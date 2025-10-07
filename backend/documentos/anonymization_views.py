from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
import logging

from .models import Documento, DocumentoAnonimizacao, AnonimizacaoItem
from .serializers import DocumentoListSerializer
from .anonymization_service import AnonymizationService

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def anonymize_document(request, documento_id):
    """
    Anonimiza um documento usando IA ou regex
    """
    try:
        documento = get_object_or_404(Documento, id=documento_id)
        
        # Verificar se o usuário tem acesso ao documento
        if documento.escritorio != request.user.perfil.escritorio:
            return Response({
                'error': 'Acesso negado ao documento'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Parâmetros de configuração
        tipo_anonimizacao = request.data.get('tipo', 'ia')  # 'ia' ou 'regex'
        incluir_nomes = request.data.get('incluir_nomes', False)
        incluir_enderecos = request.data.get('incluir_enderecos', False)
        incluir_emails = request.data.get('incluir_emails', True)
        incluir_telefones = request.data.get('incluir_telefones', True)
        incluir_cpf_rg = request.data.get('incluir_cpf_rg', True)
        
        configuracao = {
            'tipo': tipo_anonimizacao,
            'incluir_nomes': incluir_nomes,
            'incluir_enderecos': incluir_enderecos,
            'incluir_emails': incluir_emails,
            'incluir_telefones': incluir_telefones,
            'incluir_cpf_rg': incluir_cpf_rg
        }
        
        logger.info(f"🔒 Iniciando anonimização do documento {documento_id} com configuração: {configuracao}")
        
        # Inicializar serviço de anonimização
        service = AnonymizationService()
        
        with transaction.atomic():
            # Criar registro de anonimização
            anonimizacao = DocumentoAnonimizacao.objects.create(
                documento=documento,
                usuario=request.user,
                escritorio=documento.escritorio,
                texto_original=documento.texto_extraido,
                status='pendente',
                anonimizar_nomes=incluir_nomes,
                anonimizar_cpf=incluir_cpf_rg,
                anonimizar_rg=incluir_cpf_rg,
                anonimizar_enderecos=incluir_enderecos,
                anonimizar_telefones=incluir_telefones,
                anonimizar_emails=incluir_emails
            )
            
            # Processar anonimização usando o método completo do serviço
            use_ai = (tipo_anonimizacao == 'ia')
            sucesso = service.anonymize_document(anonimizacao, use_ai=use_ai)
            
            if not sucesso:
                return Response({
                    'error': f'Erro na anonimização: {anonimizacao.mensagem_erro}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Buscar o número de substituições
            total_substituicoes = anonimizacao.itens.count()
            
            logger.info(f"✅ Anonimização concluída: {total_substituicoes} substituições realizadas")
            
            return Response({
                'success': True,
                'message': f'Documento anonimizado com sucesso usando {"IA Hugging Face" if use_ai else "Regex"}. {total_substituicoes} substituições realizadas.',
                'anonimizacao_id': anonimizacao.id,
                'total_substituicoes': total_substituicoes,
                'metodo': 'IA Hugging Face' if use_ai else 'Regex',
                'configuracao': configuracao
            }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"❌ Erro na anonimização: {str(e)}")
        return Response({
            'error': f'Erro na anonimização: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restore_document(request, documento_id):
    """
    Restaura um documento anonimizado para seu texto original
    """
    try:
        documento = get_object_or_404(Documento, id=documento_id)
        
        # Verificar se o usuário tem acesso ao documento
        if documento.escritorio != request.user.perfil.escritorio:
            return Response({
                'error': 'Acesso negado ao documento'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Buscar a anonimização mais recente do documento
        anonimizacao = DocumentoAnonimizacao.objects.filter(
            documento=documento,
            status='concluido'
        ).order_by('-data_conclusao').first()
        
        if not anonimizacao:
            return Response({
                'error': 'Nenhuma anonimização encontrada para este documento'
            }, status=status.HTTP_404_NOT_FOUND)
        
        with transaction.atomic():
            # Restaurar texto original
            documento.texto_extraido = anonimizacao.texto_original
            documento.save()
            
            # Marcar anonimização como revertida
            anonimizacao.status = 'revertido'
            anonimizacao.data_reversao = timezone.now()
            anonimizacao.save()
            
            logger.info(f"✅ Documento {documento_id} restaurado com sucesso")
            
            return Response({
                'success': True,
                'message': 'Documento restaurado para o texto original com sucesso.',
                'anonimizacao_id': anonimizacao.id
            }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"❌ Erro na restauração: {str(e)}")
        return Response({
            'error': f'Erro na restauração: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_anonymizations(request):
    """
    Lista todas as anonimizações do escritório
    """
    try:
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        anonimizacoes = DocumentoAnonimizacao.objects.filter(
            escritorio=request.user.perfil.escritorio
        ).select_related(
            'documento', 'documento__cliente', 'usuario'
        ).order_by('-data_solicitacao')
        
        data = []
        for anon in anonimizacoes:
            data.append({
                'id': anon.id,
                'documento_id': anon.documento.id,
                'documento_titulo': anon.documento.titulo or f'Documento {anon.documento.id}',
                'cliente_nome': anon.documento.cliente.nome_completo if anon.documento.cliente else 'N/A',
                'status': anon.status,
                'data_solicitacao': anon.data_solicitacao,
                'data_conclusao': anon.data_conclusao,
                'data_reversao': anon.data_reversao,
                'usuario_solicitante': anon.usuario.get_full_name() if anon.usuario else 'Sistema',
                'anonimizar_nomes': anon.anonimizar_nomes,
                'anonimizar_cpf': anon.anonimizar_cpf,
                'anonimizar_rg': anon.anonimizar_rg,
                'anonimizar_enderecos': anon.anonimizar_enderecos,
                'anonimizar_telefones': anon.anonimizar_telefones,
                'anonimizar_emails': anon.anonimizar_emails,
                'mensagem_erro': anon.mensagem_erro
            })
        
        return Response({
            'success': True,
            'count': len(data),
            'results': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"❌ Erro ao listar anonimizações: {str(e)}")
        return Response({
            'error': f'Erro ao listar anonimizações: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def anonymization_details(request, anonimizacao_id):
    """
    Detalhes de uma anonimização específica incluindo itens substituídos
    """
    try:
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        anonimizacao = get_object_or_404(
            DocumentoAnonimizacao.objects.select_related('documento', 'documento__cliente', 'usuario'),
            id=anonimizacao_id,
            escritorio=request.user.perfil.escritorio
        )
        
        # Buscar itens de substituição
        itens = AnonimizacaoItem.objects.filter(anonimizacao=anonimizacao).order_by('id')
        
        items_data = []
        for item in itens:
            items_data.append({
                'id': item.id,
                'posicao_inicio': item.posicao_inicio,
                'posicao_fim': item.posicao_fim,
                'tipo_dado': item.tipo_dado,
                'valor_original': item.valor_original,
                'valor_anonimizado': item.valor_anonimizado,
                'contexto': item.contexto,
                'data_criacao': item.data_criacao
            })
        
        data = {
            'id': anonimizacao.id,
            'documento': {
                'id': anonimizacao.documento.id,
                'titulo': anonimizacao.documento.titulo,
                'cliente_nome': anonimizacao.documento.cliente.nome_completo if anonimizacao.documento.cliente else 'N/A',
            },
            'status': anonimizacao.status,
            'configuracao': {
                'anonimizar_nomes': anonimizacao.anonimizar_nomes,
                'anonimizar_cpf': anonimizacao.anonimizar_cpf,
                'anonimizar_rg': anonimizacao.anonimizar_rg,
                'anonimizar_enderecos': anonimizacao.anonimizar_enderecos,
                'anonimizar_telefones': anonimizacao.anonimizar_telefones,
                'anonimizar_emails': anonimizacao.anonimizar_emails,
            },
            'data_solicitacao': anonimizacao.data_solicitacao,
            'data_conclusao': anonimizacao.data_conclusao,
            'data_reversao': anonimizacao.data_reversao,
            'usuario_solicitante': anonimizacao.usuario.get_full_name() if anonimizacao.usuario else 'Sistema',
            'mensagem_erro': anonimizacao.mensagem_erro,
            'itens_substituicao': items_data,
            'texto_preview': {
                'original': anonimizacao.texto_original[:500] + '...' if len(anonimizacao.texto_original) > 500 else anonimizacao.texto_original,
                'anonimizado': anonimizacao.texto_anonimizado[:500] + '...' if anonimizacao.texto_anonimizado and len(anonimizacao.texto_anonimizado) > 500 else anonimizacao.texto_anonimizado
            }
        }
        
        return Response({
            'success': True,
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"❌ Erro ao buscar detalhes da anonimização: {str(e)}")
        return Response({
            'error': f'Erro ao buscar detalhes: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)