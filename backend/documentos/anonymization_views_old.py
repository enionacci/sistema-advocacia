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
# Force reload after cache cleanup

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def anonymize_document(request, documento_id):
    """
    Anonimiza um documento usando IA ou regex
    """
    try:
        documento = get_object_or_404(Documento, id=documento_id)
        
        # Verificar se já existe anonimização ativa para este documento
        anonimizacao_existente = DocumentoAnonimizacao.objects.filter(
            documento=documento,
            status='ativo'
        ).first()
        
        if anonimizacao_existente:
            return Response({
                'error': 'Este documento já possui uma anonimização ativa',
                'anonimizacao_id': anonimizacao_existente.id
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Parâmetros da requisição
        tipo_anonimizacao = request.data.get('tipo', 'regex')  # 'regex' ou 'ai'
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
                usuario_solicitante=request.user,
                escritorio=documento.escritorio,
                tipo_anonimizacao=tipo_anonimizacao,
                configuracao=configuracao,
                texto_original=documento.texto_extraido,
                status='processando'
            )
            
            try:
                # Executar anonimização
                if tipo_anonimizacao == 'ai':
                    resultado = service.detect_and_anonymize_ai(
                        documento.texto_extraido,
                        incluir_nomes=incluir_nomes,
                        incluir_enderecos=incluir_enderecos,
                        incluir_emails=incluir_emails,
                        incluir_telefones=incluir_telefones,
                        incluir_cpf_rg=incluir_cpf_rg
                    )
                else:
                    resultado = service.detect_and_anonymize_regex(
                        documento.texto_extraido,
                        incluir_emails=incluir_emails,  
                        incluir_telefones=incluir_telefones,
                        incluir_cpf_rg=incluir_cpf_rg
                    )
                
                # Atualizar anonimização com resultado
                anonimizacao.texto_anonimizado = resultado['texto_anonimizado']
                anonimizacao.total_substituicoes = len(resultado['substituicoes'])
                anonimizacao.status = 'ativo'
                anonimizacao.save()
                
                # Salvar itens de substituição
                for substituicao in resultado['substituicoes']:
                    AnonimizacaoItem.objects.create(
                        anonimizacao=anonimizacao,
                        tipo_dado=substituicao['tipo'],
                        valor_original=substituicao['original'],
                        valor_anonimizado=substituicao['anonimizado'],
                        posicao_inicio=substituicao.get('posicao_inicio', 0),
                        posicao_fim=substituicao.get('posicao_fim', 0),
                        contexto=substituicao.get('contexto', '')
                    )
                
                # Atualizar documento com texto anonimizado
                documento.texto_extraido = resultado['texto_anonimizado']
                documento.anonimizado = True
                documento.save()
                
                logger.info(f"✅ Anonimização concluída: {anonimizacao.total_substituicoes} substituições")
                
                return Response({
                    'success': True,
                    'anonimizacao_id': anonimizacao.id,
                    'total_substituicoes': anonimizacao.total_substituicoes,
                    'documento': DocumentoListSerializer(documento).data
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                # Marcar anonimização como erro
                anonimizacao.status = 'erro'
                anonimizacao.observacoes = f"Erro durante processamento: {str(e)}"
                anonimizacao.save()
                
                logger.error(f"❌ Erro na anonimização: {str(e)}")
                raise e
                
    except Exception as e:
        logger.error(f"❌ Erro geral na anonimização: {str(e)}")
        return Response({
            'error': f'Erro ao anonimizar documento: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restore_document(request, documento_id):
    """
    Restaura um documento anonimizado para seu texto original
    """
    try:
        documento = get_object_or_404(Documento, id=documento_id)
        
        # Buscar anonimização ativa
        anonimizacao = DocumentoAnonimizacao.objects.filter(
            documento=documento,
            status='ativo'
        ).first()
        
        if not anonimizacao:
            return Response({
                'error': 'Este documento não possui anonimização ativa para restaurar'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        logger.info(f"🔓 Iniciando restauração do documento {documento_id}")
        
        with transaction.atomic():
            # Restaurar texto original
            documento.texto_extraido = anonimizacao.texto_original
            documento.anonimizado = False
            documento.save()
            
            # Marcar anonimização como restaurada
            anonimizacao.status = 'restaurado'
            anonimizacao.data_restauracao = timezone.now()
            anonimizacao.usuario_restauracao = request.user
            anonimizacao.save()
            
            logger.info(f"✅ Documento restaurado com sucesso")
            
            return Response({
                'success': True,
                'documento': DocumentoListSerializer(documento).data
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        logger.error(f"❌ Erro na restauração: {str(e)}")
        return Response({
            'error': f'Erro ao restaurar documento: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_anonymizations(request):
    """
    Lista todas as anonimizações do escritório
    """
    try:
        print(f"🔍 DEBUG: user = {request.user}")
        print(f"🔍 DEBUG: hasattr perfil = {hasattr(request.user, 'perfil')}")
        if hasattr(request.user, 'perfil'):
            print(f"🔍 DEBUG: user.perfil = {request.user.perfil}")
            print(f"🔍 DEBUG: user.perfil.escritorio = {request.user.perfil.escritorio}")
        
        # Verificar se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return Response({
                'error': 'Usuário não possui escritório associado'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        anonimizacoes = DocumentoAnonimizacao.objects.filter(
            escritorio=request.user.perfil.escritorio
        ).select_related(
            'documento', 'usuario_solicitante', 'usuario_restauracao'
        ).order_by('-data_solicitacao')
        
        data = []
        for anon in anonimizacoes:
            data.append({
                'id': anon.id,
                'documento_id': anon.documento.id,
                'documento_titulo': anon.documento.titulo or f'Documento {anon.documento.id}',
                'cliente_nome': anon.documento.cliente_nome,
                'status': anon.status,
                'tipo_anonimizacao': anon.tipo_anonimizacao,
                'total_substituicoes': anon.total_substituicoes,
                'data_solicitacao': anon.data_solicitacao,
                'data_restauracao': anon.data_restauracao,
                'usuario_solicitante': anon.usuario_solicitante.get_full_name() or anon.usuario_solicitante.username,
                'usuario_restauracao': anon.usuario_restauracao.get_full_name() if anon.usuario_restauracao else None,
                'configuracao': anon.configuracao,
                'observacoes': anon.observacoes
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
            DocumentoAnonimizacao.objects.select_related('documento', 'usuario_solicitante'),
            id=anonimizacao_id,
            escritorio=request.user.perfil.escritorio
        )
        
        # Buscar itens de substituição
        itens = AnonimizacaoItem.objects.filter(anonimizacao=anonimizacao).order_by('id')
        
        items_data = []
        for item in itens:
            items_data.append({
                'id': item.id,
                'tipo_dado': item.tipo_dado,
                'valor_original': item.valor_original,
                'valor_anonimizado': item.valor_anonimizado,
                'posicao_inicio': item.posicao_inicio,
                'posicao_fim': item.posicao_fim,
                'contexto': item.contexto
            })
        
        data = {
            'id': anonimizacao.id,
            'documento_id': anonimizacao.documento.id,
            'documento_titulo': anonimizacao.documento.titulo or f'Documento {anonimizacao.documento.id}',
            'cliente_nome': anonimizacao.documento.cliente_nome,
            'status': anonimizacao.status,
            'tipo_anonimizacao': anonimizacao.tipo_anonimizacao,
            'total_substituicoes': anonimizacao.total_substituicoes,
            'data_solicitacao': anonimizacao.data_solicitacao,
            'data_restauracao': anonimizacao.data_restauracao,
            'usuario_solicitante': anonimizacao.usuario_solicitante.get_full_name() or anonimizacao.usuario_solicitante.username,
            'usuario_restauracao': anonimizacao.usuario_restauracao.get_full_name() if anonimizacao.usuario_restauracao else None,
            'configuracao': anonimizacao.configuracao,
            'observacoes': anonimizacao.observacoes,
            'texto_original': anonimizacao.texto_original,
            'texto_anonimizado': anonimizacao.texto_anonimizado,
            'itens': items_data
        }
        
        return Response({
            'success': True,
            'data': data
        }, status=status.HTTP_200_OK)
        
    except DocumentoAnonimizacao.DoesNotExist:
        return Response({
            'error': 'Anonimização não encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"❌ Erro ao buscar detalhes da anonimização: {str(e)}")
        return Response({
            'error': f'Erro ao buscar detalhes: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)