# escritorios/audit_views.py
"""
Views para Audit Log - Sistema de Auditoria
"""

from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from datetime import datetime, timedelta

from .permissions import HasPermission
from .audit_models import AuditLog, AuditLogRetencao
from .audit_serializers import (
    AuditLogSerializer,
    AuditLogListSerializer,
    AuditLogRetencaoSerializer
)


class AuditLogListView(generics.ListAPIView):
    """
    Lista logs de auditoria do escritório com filtros avançados.
    Acesso restrito a usuários com permissão 'ver_auditoria'.
    """
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'ver_auditoria'
    serializer_class = AuditLogListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['acao', 'modelo_nome', 'usuario', 'sucesso']
    search_fields = ['descricao', 'usuario_nome', 'objeto_repr', 'ip_address']
    ordering_fields = ['timestamp', 'acao', 'usuario_nome']
    ordering = ['-timestamp']
    
    def get_queryset(self):
        """Retorna apenas logs do escritório do usuário."""
        user = self.request.user
        escritorio_id = user.perfil.escritorio.id
        
        queryset = AuditLog.objects.filter(
            escritorio_id=escritorio_id
        )
        
        # Filtros adicionais via query params
        # Filtro por data
        data_inicio = self.request.query_params.get('data_inicio')
        data_fim = self.request.query_params.get('data_fim')
        
        if data_inicio:
            try:
                data_inicio = datetime.fromisoformat(data_inicio)
                queryset = queryset.filter(timestamp__gte=data_inicio)
            except ValueError:
                pass
        
        if data_fim:
            try:
                data_fim = datetime.fromisoformat(data_fim)
                queryset = queryset.filter(timestamp__lte=data_fim)
            except ValueError:
                pass
        
        # Filtro por período rápido (hoje, semana, mês)
        periodo = self.request.query_params.get('periodo')
        if periodo:
            hoje = datetime.now()
            if periodo == 'hoje':
                queryset = queryset.filter(timestamp__date=hoje.date())
            elif periodo == 'semana':
                inicio_semana = hoje - timedelta(days=7)
                queryset = queryset.filter(timestamp__gte=inicio_semana)
            elif periodo == 'mes':
                inicio_mes = hoje - timedelta(days=30)
                queryset = queryset.filter(timestamp__gte=inicio_mes)
        
        # Filtro por usuário específico
        usuario_id = self.request.query_params.get('usuario_id')
        if usuario_id:
            queryset = queryset.filter(usuario_id=usuario_id)
        
        return queryset.select_related('usuario', 'content_type')


class AuditLogDetailView(generics.RetrieveAPIView):
    """
    Detalhes completos de um log específico.
    Acesso restrito a usuários com permissão 'ver_auditoria'.
    """
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'ver_auditoria'
    serializer_class = AuditLogSerializer
    
    def get_queryset(self):
        """Garante que só pode ver logs do próprio escritório."""
        user = self.request.user
        escritorio_id = user.perfil.escritorio.id
        return AuditLog.objects.filter(escritorio_id=escritorio_id)


class AuditLogStatsView(generics.GenericAPIView):
    """
    Estatísticas de auditoria para dashboards.
    Retorna métricas agregadas dos logs.
    """
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'ver_auditoria'
    
    def get(self, request, *args, **kwargs):
        """Retorna estatísticas agregadas."""
        user = request.user
        escritorio_id = user.perfil.escritorio.id
        
        # Período (padrão: últimos 30 dias)
        periodo_dias = int(request.query_params.get('dias', 30))
        data_inicio = datetime.now() - timedelta(days=periodo_dias)
        
        queryset = AuditLog.objects.filter(
            escritorio_id=escritorio_id,
            timestamp__gte=data_inicio
        )
        
        # Estatísticas gerais
        total_logs = queryset.count()
        total_usuarios = queryset.values('usuario').distinct().count()
        
        # Por ação
        por_acao = {}
        for acao, acao_display in AuditLog.ACAO_CHOICES:
            count = queryset.filter(acao=acao).count()
            if count > 0:
                por_acao[acao] = {
                    'label': acao_display,
                    'count': count
                }
        
        # Por modelo
        por_modelo = {}
        modelos = queryset.values('modelo_nome').distinct()
        for modelo_dict in modelos:
            modelo = modelo_dict['modelo_nome']
            if modelo:
                count = queryset.filter(modelo_nome=modelo).count()
                por_modelo[modelo] = count
        
        # Top usuários mais ativos
        top_usuarios = list(
            queryset.values('usuario_nome')
            .annotate(total=models.Count('id'))
            .order_by('-total')[:10]
        )
        
        # Ações por dia (últimos 7 dias)
        acoes_por_dia = []
        for i in range(7):
            dia = datetime.now() - timedelta(days=i)
            count = queryset.filter(timestamp__date=dia.date()).count()
            acoes_por_dia.append({
                'data': dia.strftime('%Y-%m-%d'),
                'count': count
            })
        
        return Response({
            'periodo_dias': periodo_dias,
            'total_logs': total_logs,
            'total_usuarios': total_usuarios,
            'por_acao': por_acao,
            'por_modelo': por_modelo,
            'top_usuarios': top_usuarios,
            'acoes_por_dia': list(reversed(acoes_por_dia)),
        })


class AuditLogRetencaoView(generics.RetrieveUpdateAPIView):
    """
    Visualiza e atualiza configurações de retenção de logs.
    """
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'ver_auditoria'
    serializer_class = AuditLogRetencaoSerializer
    
    def get_object(self):
        """Retorna ou cria configuração de retenção do escritório."""
        escritorio = self.request.user.perfil.escritorio
        config, created = AuditLogRetencao.objects.get_or_create(
            escritorio=escritorio
        )
        return config


# Import necessário para anotações
from django.db import models
