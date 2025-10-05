"""
Views para API de Documentos

Endpoints:
- /api/documentos/categorias/ - CRUD de categorias
- /api/documentos/tags/ - CRUD de tags
- /api/documentos/ - CRUD de documentos
- /api/documentos/{id}/download/ - Download do arquivo
- /api/documentos/{id}/incrementar-visualizacao/ - Incrementa contador
- /api/clientes/{id}/documentos/ - Documentos de um cliente específico
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.http import FileResponse, Http404
from django.db.models import Q
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
