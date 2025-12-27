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
import json

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def anonymize_document(request, documento_id):
    """
    Anonimiza um documento usando regex
    """
    try:
        documento = get_object_or_404(Documento, id=documento_id)
        
        # Verificar se o usuário tem acesso ao documento
        if documento.escritorio != request.user.perfil.escritorio:
            return Response({
                'error': 'Acesso negado ao documento'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Parâmetros de configuração
        incluir_nomes = request.data.get('incluir_nomes', False)
        incluir_enderecos = request.data.get('incluir_enderecos', False)
        incluir_emails = request.data.get('incluir_emails', True)
        incluir_telefones = request.data.get('incluir_telefones', True)
        incluir_cpf_rg = request.data.get('incluir_cpf_rg', True)
        
        configuracao = {
            'incluir_nomes': incluir_nomes,
            'incluir_enderecos': incluir_enderecos,
            'incluir_emails': incluir_emails,
            'incluir_telefones': incluir_telefones,
            'incluir_cpf_rg': incluir_cpf_rg
        }
        
        logger.info(f"🔒 Iniciando anonimização do documento {documento_id} com configuração: {configuracao}")
        
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

        service = AnonymizationService()
        sucesso = service.anonymize_document(anonimizacao)
        
        if not sucesso:
            return Response({'error': f'Erro na anonimização com Regex: {anonimizacao.mensagem_erro}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        total_substituicoes = anonimizacao.itens.count()
        metodo = 'Regex (Local)'

        logger.info(f"✅ Anonimização concluída via {metodo}: {total_substituicoes} substituições realizadas")
        
        return Response({
            'success': True,
            'message': f'Documento anonimizado com sucesso usando {metodo}.',
            'anonimizacao_id': anonimizacao.id,
            'total_substituicoes': total_substituicoes,
            'metodo': metodo,
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
            # Contar total de substituições
            total_substituicoes = AnonimizacaoItem.objects.filter(anonimizacao=anon).count()
            
            # Determinar tipo de anonimização (padrão: 'ia')
            tipo_anonimizacao = 'ia'  # Por padrão, assume IA
            
            data.append({
                'id': anon.id,
                'documento_id': anon.documento.id,
                'documento_titulo': anon.documento.titulo or f'Documento {anon.documento.id}',
                'cliente_nome': anon.documento.cliente.nome_completo if anon.documento.cliente else 'N/A',
                'status': anon.status,
                'tipo_anonimizacao': tipo_anonimizacao,
                'total_substituicoes': total_substituicoes,
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
            'documento_titulo': anonimizacao.documento.titulo or f'Documento {anonimizacao.documento.id}',
            'status': anonimizacao.status,
            'tipo_anonimizacao': 'ia',  # Por padrão assume IA
            'total_substituicoes': len(items_data),
            'configuracao': {
                'incluir_nomes': anonimizacao.anonimizar_nomes,
                'incluir_cpf_rg': anonimizacao.anonimizar_cpf or anonimizacao.anonimizar_rg,
                'incluir_enderecos': anonimizacao.anonimizar_enderecos,
                'incluir_telefones': anonimizacao.anonimizar_telefones,
                'incluir_emails': anonimizacao.anonimizar_emails,
            },
            'data_solicitacao': anonimizacao.data_solicitacao,
            'data_conclusao': anonimizacao.data_conclusao,
            'data_reversao': anonimizacao.data_reversao,
            'usuario_solicitante': anonimizacao.usuario.get_full_name() if anonimizacao.usuario else 'Sistema',
            'mensagem_erro': anonimizacao.mensagem_erro,
            'itens': items_data,  # ✅ Mudado de itens_substituicao para itens
            'texto_preview': {
                'original': anonimizacao.texto_original,  # ✅ Texto completo para visualização
                'anonimizado': anonimizacao.texto_anonimizado or ''  # ✅ Texto completo para visualização
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


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_anonymization(request, anonimizacao_id):
    """
    Deleta um registro de anonimização e seus itens relacionados
    """
    try:
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        anonimizacao = get_object_or_404(
            DocumentoAnonimizacao.objects.select_related('documento'),
            id=anonimizacao_id,
            escritorio=request.user.perfil.escritorio
        )
        
        documento_id = anonimizacao.documento.id
        documento_titulo = anonimizacao.documento.titulo or f'Documento {documento_id}'
        
        # Deletar itens relacionados e a anonimização
        with transaction.atomic():
            # Os itens serão deletados automaticamente via CASCADE
            anonimizacao.delete()
            
        logger.info(f"✅ Anonimização {anonimizacao_id} deletada com sucesso")
        
        return Response({
            'success': True,
            'message': f'Anonimização do documento "{documento_titulo}" deletada com sucesso.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"❌ Erro ao deletar anonimização: {str(e)}")
        return Response({
            'error': f'Erro ao deletar anonimização: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deanonymize_text(request, anonimizacao_id):
    """
    Desanonimiza um texto usando o dicionário de substituições de uma anonimização.
    
    Este endpoint é útil para o fluxo:
    1. Anonimizar petição inicial
    2. Enviar texto anonimizado para ChatGPT
    3. Receber contestação do ChatGPT (ainda com placeholders)
    4. Usar este endpoint para desanonimizar a contestação
    
    Body esperado:
    {
        "texto_anonimizado": "O NOME1 com CPF CPF1 requer..."
    }
    
    Response:
    {
        "success": true,
        "texto_desanonimizado": "O João Silva com CPF 123.456.789-00 requer...",
        "total_substituicoes": 5,
        "anonimizacao_id": 123
    }
    """
    try:
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar anonimização existe e pertence ao escritório
        anonimizacao = get_object_or_404(
            DocumentoAnonimizacao,
            id=anonimizacao_id,
            escritorio=request.user.perfil.escritorio
        )
        
        # Validar que a anonimização está concluída
        if anonimizacao.status != 'concluido':
            return Response({
                'error': 'A anonimização precisa estar concluída para ser usada na desanonimização',
                'status_atual': anonimizacao.status
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Obter texto anonimizado do body
        texto_anonimizado = request.data.get('texto_anonimizado', '').strip()
        
        if not texto_anonimizado:
            return Response({
                'error': 'Campo "texto_anonimizado" é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Processar desanonimização
        service = AnonymizationService()
        texto_desanonimizado, total_substituicoes = service.deanonymize_text(
            texto_anonimizado, 
            anonimizacao_id
        )
        
        logger.info(f"✅ Texto desanonimizado com sucesso usando anonimização #{anonimizacao_id}")
        logger.info(f"📊 Total de substituições: {total_substituicoes}")
        
        return Response({
            'success': True,
            'texto_desanonimizado': texto_desanonimizado,
            'total_substituicoes': total_substituicoes,
            'anonimizacao_id': anonimizacao_id,
            'documento': {
                'id': anonimizacao.documento.id,
                'titulo': anonimizacao.documento.titulo
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"❌ Erro ao desanonimizar texto: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'error': f'Erro ao desanonimizar texto: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# =====================================
# ANONIMIZAÇÃO MANUAL - NOVAS APIs
# =====================================

from .anonymization_service import ManualAnonymizationService

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manual_anonymize(request):
    """
    API para anonimização manual de texto selecionado pelo usuário.
    
    Body esperado:
    {
        "anonimizacao_id": 123,
        "texto_selecionado": "João Silva",
        "tipo": "nome"  // opcional, será auto-detectado se não fornecido
    }
    """
    try:
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar dados obrigatórios
        anonimizacao_id = request.data.get('anonimizacao_id')
        texto_selecionado = request.data.get('texto_selecionado')
        tipo_sugerido = request.data.get('tipo')
        
        if not anonimizacao_id:
            return Response({
                'error': 'Campo "anonimizacao_id" é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not texto_selecionado:
            return Response({
                'error': 'Campo "texto_selecionado" é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se a anonimização pertence ao escritório do usuário
        anonimizacao = get_object_or_404(
            DocumentoAnonimizacao,
            id=anonimizacao_id,
            escritorio=request.user.perfil.escritorio
        )
        
        # Verificar se a anonimização está em status válido
        if anonimizacao.status not in ['concluido']:
            return Response({
                'error': f'Anonimização deve estar concluída. Status atual: {anonimizacao.status}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Processar anonimização manual
        service = ManualAnonymizationService()
        resultado = service.anonymize_selected_text(
            anonimizacao_id=anonimizacao_id,
            texto_selecionado=texto_selecionado,
            tipo_sugerido=tipo_sugerido
        )
        
        if resultado['success']:
            logger.info(f"✅ Anonimização manual bem-sucedida: {texto_selecionado} → {resultado['placeholder']}")
            return Response(resultado, status=status.HTTP_200_OK)
        else:
            logger.warning(f"⚠️ Erro na anonimização manual: {resultado['error']}")
            return Response(resultado, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"❌ Erro na API de anonimização manual: {e}", exc_info=True)
        return Response({
            'success': False,
            'error': f'Erro interno do servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def undo_manual_anonymize(request):
    """
    API para desfazer uma anonimização manual específica.
    
    Body esperado:
    {
        "anonimizacao_id": 123,
        "item_id": 456
    }
    """
    try:
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar dados obrigatórios
        anonimizacao_id = request.data.get('anonimizacao_id')
        item_id = request.data.get('item_id')
        
        if not anonimizacao_id or not item_id:
            return Response({
                'error': 'Campos "anonimizacao_id" e "item_id" são obrigatórios'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se a anonimização pertence ao escritório do usuário
        anonimizacao = get_object_or_404(
            DocumentoAnonimizacao,
            id=anonimizacao_id,
            escritorio=request.user.perfil.escritorio
        )
        
        # Processar desfazer anonimização
        service = ManualAnonymizationService()
        resultado = service.undo_manual_anonymization(
            anonimizacao_id=anonimizacao_id,
            item_id=item_id
        )
        
        if resultado['success']:
            logger.info(f"↩️ Anonimização manual desfeita: {resultado['placeholder_removido']} → {resultado['valor_restaurado']}")
            return Response(resultado, status=status.HTTP_200_OK)
        else:
            logger.warning(f"⚠️ Erro ao desfazer anonimização manual: {resultado['error']}")
            return Response(resultado, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"❌ Erro na API de desfazer anonimização: {e}", exc_info=True)
        return Response({
            'success': False,
            'error': f'Erro interno do servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def suggest_type(request):
    """
    API para analisar texto selecionado e sugerir tipo de dado.
    
    Body esperado:
    {
        "texto_selecionado": "123.456.789-00"
    }
    """
    try:
        texto_selecionado = request.data.get('texto_selecionado', '').strip()
        
        if not texto_selecionado:
            return Response({
                'success': False,
                'error': 'Campo "texto_selecionado" é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Analisar texto e sugerir tipo
        service = ManualAnonymizationService()
        sugestoes = service.get_suggestions_for_selection(texto_selecionado)
        
        return Response({
            'success': True,
            'texto_analisado': texto_selecionado,
            'sugestoes': sugestoes
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"❌ Erro na API de sugestão de tipo: {e}")
        return Response({
            'success': False,
            'error': f'Erro interno do servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_manual_anonymizations(request, anonimizacao_id):
    """
    API para listar todas as anonimizações manuais de um documento.
    """
    try:
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se a anonimização pertence ao escritório do usuário
        anonimizacao = get_object_or_404(
            DocumentoAnonimizacao,
            id=anonimizacao_id,
            escritorio=request.user.perfil.escritorio
        )
        
        # Buscar anonimizações manuais
        service = ManualAnonymizationService()
        resultado = service.get_manual_anonymizations(anonimizacao_id)
        
        return Response(resultado, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"❌ Erro ao listar anonimizações manuais: {e}")
        return Response({
            'success': False,
            'error': f'Erro interno do servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_updated_text(request, anonimizacao_id):
    """
    API para obter o texto atualizado após anonimizações manuais.
    """
    try:
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se a anonimização pertence ao escritório do usuário
        anonimizacao = get_object_or_404(
            DocumentoAnonimizacao,
            id=anonimizacao_id,
            escritorio=request.user.perfil.escritorio
        )
        
        # Contar estatísticas
        total_automaticas = AnonimizacaoItem.objects.filter(
            anonimizacao=anonimizacao,
            anonimizado_manualmente=False
        ).count()
        
        total_manuais = AnonimizacaoItem.objects.filter(
            anonimizacao=anonimizacao,
            anonimizado_manualmente=True
        ).count()
        
        return Response({
            'success': True,
            'anonimizacao_id': anonimizacao_id,
            'texto_original': anonimizacao.texto_original,
            'texto_anonimizado': anonimizacao.texto_anonimizado,
            'status': anonimizacao.status,
            'estatisticas': {
                'total_automaticas': total_automaticas,
                'total_manuais': total_manuais,
                'total_geral': total_automaticas + total_manuais
            },
            'documento': {
                'id': anonimizacao.documento.id,
                'titulo': anonimizacao.documento.titulo
            }
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"❌ Erro ao obter texto atualizado: {e}")
        return Response({
            'success': False,
            'error': f'Erro interno do servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)