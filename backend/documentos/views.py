"""
Views para API de Documentos

Endpoints:
- /api/documentos/categorias/ - CRUD de categorias
- /api/documentos/tags/ - CRUD de tags
- /api/documentos/ - CRUD de documentos
- /api/documentos/{id}/download/ - Download do arquivo
- /api/documentos/{id}/incrementar-visualizacao/ - Incrementa contador
- /api/clientes/{id}/documentos/ - Documentos de um cliente específico
- /api/documentos/salvar-scanner/ - Salvar documento do scanner (NOVO)
- /api/documentos/ocr/ - Processar OCR
- /api/documentos/ocr-progress/{task_id}/ - Consultar progresso OCR
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.http import FileResponse, Http404, JsonResponse
from django.db.models import Q
from django.utils import timezone
from django.core.cache import cache
import os
import traceback
import uuid

from .models import Categoria, Tag, Documento
from .serializers import (
    CategoriaSerializer, TagSerializer,
    DocumentoListSerializer, DocumentoDetailSerializer,
    DocumentoCreateSerializer, DocumentoUpdateSerializer
)
from .permissions import DocumentoPermission, CategoriaPermission, TagPermission


class CategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de categorias de documentos
    
    list: Lista todas as categorias do escritório
    create: Cria nova categoria
    retrieve: Detalhe de uma categoria
    update/partial_update: Atualiza categoria
    destroy: Remove categoria
    """
    serializer_class = CategoriaSerializer
    permission_classes = [CategoriaPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome', 'descricao']
    ordering_fields = ['nome', 'ordem', 'data_criacao']
    ordering = ['ordem', 'nome']

    def get_queryset(self):
        """Retorna apenas categorias do escritório do usuário"""
        return Categoria.objects.filter(
            escritorio=self.request.user.perfil.escritorio,
            ativo=True
        )


class TagViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de tags
    
    list: Lista todas as tags do escritório
    create: Cria nova tag
    retrieve: Detalhe de uma tag
    update/partial_update: Atualiza tag
    destroy: Remove tag
    """
    serializer_class = TagSerializer
    permission_classes = [TagPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome']
    ordering_fields = ['nome', 'data_criacao']
    ordering = ['nome']

    def get_queryset(self):
        """Retorna apenas tags do escritório do usuário"""
        return Tag.objects.filter(
            escritorio=self.request.user.perfil.escritorio
        )


class DocumentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de documentos
    
    list: Lista documentos com filtros
    create: Upload de novo documento
    retrieve: Detalhe do documento
    update/partial_update: Atualiza metadados
    destroy: Remove documento (soft delete)
    download: Faz download do arquivo
    incrementar_visualizacao: Incrementa contador de visualizações
    """
    permission_classes = [DocumentoPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'cliente', 'confidencial', 'tipo_arquivo']
    search_fields = ['titulo', 'descricao', 'nome_original', 'texto_extraido']
    ordering_fields = ['data_upload', 'data_documento', 'titulo', 'tamanho', 'visualizacoes']
    ordering = ['-data_upload']

    def get_queryset(self):
        """
        Retorna apenas documentos do escritório do usuário
        Permite filtrar por cliente_id via query param
        """
        queryset = Documento.objects.filter(
            escritorio=self.request.user.perfil.escritorio,
            ativo=True
        ).select_related(
            'categoria', 'cliente', 'usuario_upload'
        ).prefetch_related('tags')

        # Filtro por cliente (query param)
        cliente_id = self.request.query_params.get('cliente_id')
        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)

        # Filtro por data
        data_inicio = self.request.query_params.get('data_inicio')
        data_fim = self.request.query_params.get('data_fim')
        if data_inicio:
            queryset = queryset.filter(data_upload__gte=data_inicio)
        if data_fim:
            queryset = queryset.filter(data_upload__lte=data_fim)

        # Filtro por tags
        tags = self.request.query_params.getlist('tags')
        if tags:
            queryset = queryset.filter(tags__id__in=tags).distinct()

        return queryset

    def get_serializer_class(self):
        """Retorna o serializer apropriado para cada action"""
        if self.action == 'list':
            return DocumentoListSerializer
        elif self.action == 'create':
            return DocumentoCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DocumentoUpdateSerializer
        return DocumentoDetailSerializer

    def perform_destroy(self, instance):
        """Soft delete - marca como inativo ao invés de deletar"""
        instance.ativo = False
        instance.save()

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Endpoint para download do arquivo
        GET /api/documentos/{id}/download/
        """
        documento = self.get_object()
        
        try:
            # Incrementa contador de downloads
            documento.incrementar_downloads()
            
            # Retorna o arquivo
            response = FileResponse(documento.arquivo.open('rb'))
            response['Content-Type'] = f'application/{documento.tipo_arquivo}'
            response['Content-Disposition'] = f'attachment; filename="{documento.nome_original}"'
            return response
        except Exception as e:
            return Response(
                {'error': f'Erro ao fazer download: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def incrementar_visualizacao(self, request, pk=None):
        """
        Incrementa o contador de visualizações
        POST /api/documentos/{id}/incrementar-visualizacao/
        """
        documento = self.get_object()
        documento.incrementar_visualizacoes()
        return Response({'visualizacoes': documento.visualizacoes})

    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """
        Retorna estatísticas dos documentos
        GET /api/documentos/estatisticas/
        """
        escritorio = request.user.perfil.escritorio
        queryset = self.get_queryset()

        # Estatísticas gerais
        total_documentos = queryset.count()
        total_tamanho = sum(doc.tamanho for doc in queryset)
        
        # Por categoria
        por_categoria = {}
        for cat in Categoria.objects.filter(escritorio=escritorio, ativo=True):
            por_categoria[cat.nome] = queryset.filter(categoria=cat).count()

        # Por tipo de arquivo
        por_tipo = {}
        for doc in queryset:
            tipo = doc.tipo_arquivo
            por_tipo[tipo] = por_tipo.get(tipo, 0) + 1

        return Response({
            'total_documentos': total_documentos,
            'total_tamanho': total_tamanho,
            'total_tamanho_formatado': self._formatar_tamanho(total_tamanho),
            'por_categoria': por_categoria,
            'por_tipo': por_tipo,
            'total_visualizacoes': sum(doc.visualizacoes for doc in queryset),
            'total_downloads': sum(doc.downloads for doc in queryset),
        })

    def _formatar_tamanho(self, size):
        """Formata tamanho em bytes para unidade legível"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"


# ========================================
# VIEWS PARA OCR E PROGRESSO
# ========================================

class OCRProgressView(APIView):
    """
    View para consultar o progresso do processamento OCR
    GET /api/documentos/ocr-progress/{task_id}/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, task_id):
        try:
            # Tentar buscar o progresso no cache/sessão
            progress_key = f"ocr_progress_{task_id}"
            progress_data = cache.get(progress_key)
            
            if progress_data:
                return Response(progress_data)
            else:
                # Se não encontrou, pode ser que já terminou ou task_id inválido
                return Response({
                    'task_id': task_id,
                    'status': 'completed',  # ou 'not_found'
                    'progress': 100,
                    'message': 'Processamento concluído ou não encontrado'
                })
                
        except Exception as e:
            return Response({
                'error': str(e),
                'status': 'failed',
                'task_id': task_id
            }, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def processar_ocr(request):
    """
    Endpoint para iniciar processamento OCR
    POST /api/documentos/ocr/
    """
    try:
        # Gerar um task_id único
        task_id = str(uuid.uuid4())
        
        # Simular progresso inicial
        progress_data = {
            'task_id': task_id,
            'status': 'processing',
            'progress': 10,
            'message': 'Iniciando processamento OCR...'
        }
        
        # Salvar no cache por 30 minutos
        cache.set(f"ocr_progress_{task_id}", progress_data, 1800)
        
        # Aqui você pode iniciar uma task assíncrona (Celery, etc.)
        # Por enquanto, vamos simular um processamento
        
        return Response({
            'task_id': task_id,
            'message': 'OCR iniciado com sucesso',
            'status': 'started'
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'status': 'failed'
        }, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simular_progresso_ocr(request, task_id):
    """
    Endpoint para simular atualização de progresso (para desenvolvimento)
    POST /api/documentos/ocr-progress/{task_id}/update/
    """
    try:
        progress = request.data.get('progress', 50)
        status_value = request.data.get('status', 'processing')
        message = request.data.get('message', 'Processando...')
        
        progress_data = {
            'task_id': task_id,
            'status': status_value,
            'progress': int(progress),
            'message': message
        }
        
        # Atualizar no cache
        cache.set(f"ocr_progress_{task_id}", progress_data, 1800)
        
        return Response({
            'success': True,
            'progress_data': progress_data
        })
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=500)


# ========================================
# ENDPOINT ESPECÍFICO PARA SCANNER - NOVO
# ========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def salvar_documento_scanner(request):
    """
    Endpoint específico para salvar documentos do scanner
    Bypassa o problema do perfil/escritório
    """
    try:
        titulo = request.data.get('titulo')
        texto_extraido = request.data.get('texto_extraido')
        cliente_id = request.data.get('cliente_id')
        nome_arquivo_original = request.data.get('nome_arquivo_original', '')
        
        # Validações
        if not titulo:
            return JsonResponse({'error': 'Título é obrigatório'}, status=400)
            
        if not texto_extraido:
            return JsonResponse({'error': 'Texto extraído é obrigatório'}, status=400)
        
        # Calcular tamanho
        tamanho = len(texto_extraido.encode('utf-8'))
        
        # ✅ RESOLVER ESCRITÓRIO - MÚLTIPLAS ESTRATÉGIAS
        escritorio = None
        
        # Estratégia 1: Tentar pelo perfil do usuário
        try:
            if hasattr(request.user, 'perfil') and request.user.perfil and hasattr(request.user.perfil, 'escritorio'):
                escritorio = request.user.perfil.escritorio
        except Exception:
            pass
        
        # Estratégia 2: Pegar o primeiro escritório disponível
        if not escritorio:
            from escritorios.models import Escritorio
            escritorio = Escritorio.objects.first()
        
        # Estratégia 3: Criar um escritório padrão se não existir nenhum
        if not escritorio:
            from escritorios.models import Escritorio
            escritorio = Escritorio.objects.create(
                nome='Escritório Principal',
                ativo=True
            )
        
        # Preparar dados do documento
        documento_data = {
            'escritorio': escritorio,
            'titulo': titulo,
            'texto_extraido': texto_extraido,
            'tamanho': tamanho,
            'tipo_arquivo': 'txt',
            'nome_original': nome_arquivo_original or f"{titulo}.txt",
            'data_upload': timezone.now(),
            'usuario_upload': request.user,
            'ativo': True,
            'descricao': f'Documento digitalizado via scanner em {timezone.now().strftime("%d/%m/%Y %H:%M")}',
            'versao': 1,
            'visualizacoes': 0,
            'downloads': 0,
            'confidencial': False,
            'hash_md5': '',  # Será calculado no save() se necessário
        }
        
        # ✅ ADICIONAR CLIENTE SE FORNECIDO
        if cliente_id:
            try:
                from clientes.models import Cliente
                cliente = Cliente.objects.get(id=cliente_id, escritorio=escritorio)
                documento_data['cliente'] = cliente
            except Cliente.DoesNotExist:
                return JsonResponse({
                    'error': f'Cliente com ID {cliente_id} não encontrado no escritório'
                }, status=400)
        
        # ✅ CRIAR DOCUMENTO
        documento = Documento.objects.create(**documento_data)
        
        return JsonResponse({
            'success': True,
            'id': documento.id,
            'titulo': documento.titulo,
            'tamanho': documento.tamanho,
            'escritorio': escritorio.nome,
            'message': 'Documento salvo com sucesso via scanner'
        })
        
    except Exception as e:
        # Log detalhado do erro
        print("❌ ERRO AO SALVAR DOCUMENTO SCANNER:")
        print(traceback.format_exc())
        
        return JsonResponse({
            'error': f'Erro interno do servidor: {str(e)}',
            'type': type(e).__name__
        }, status=500)