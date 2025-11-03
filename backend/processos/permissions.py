"""
Permissões para o módulo de Processos
"""

from rest_framework import permissions


class ProcessoPermission(permissions.BasePermission):
    """
    Permissão para operações em processos.
    
    - ver_processo: permite listar e visualizar processos
    - criar_processo: permite criar novos processos
    - editar_processo: permite editar processos existentes
    - deletar_processo: permite remover processos
    """
    
    def has_permission(self, request, view):
        # Usuário deve estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Verifica se o usuário tem perfil e escritório
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return False
        
        # Mapeia ações para permissões
        action = view.action
        
        permission_map = {
            'list': 'ver_processo',
            'retrieve': 'ver_processo',
            'create': 'criar_processo',
            'update': 'editar_processo',
            'partial_update': 'editar_processo',
            'destroy': 'deletar_processo',
            'movimentacoes': 'ver_processo',
            'prazos': 'ver_processo',
            'audiencias': 'ver_processo',
            'estatisticas': 'ver_processo',
        }
        
        required_permission = permission_map.get(action, 'ver_processo')
        
        # Verifica se o usuário tem a permissão necessária
        return request.user.perfil.tem_permissao(required_permission)
    
    def has_object_permission(self, request, view, obj):
        """
        Verifica se o usuário pode acessar este processo específico.
        Apenas membros do mesmo escritório podem acessar.
        """
        if not hasattr(request.user, 'perfil'):
            return False
        
        # Verifica se o processo pertence ao mesmo escritório do usuário
        return obj.escritorio == request.user.perfil.escritorio


class PartePermission(permissions.BasePermission):
    """
    Permissão para gerenciar partes do processo.
    Usa as mesmas permissões do processo principal.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return False
        
        action = view.action
        
        permission_map = {
            'list': 'ver_processo',
            'retrieve': 'ver_processo',
            'create': 'editar_processo',
            'update': 'editar_processo',
            'partial_update': 'editar_processo',
            'destroy': 'editar_processo',
            'importar_cliente': 'editar_processo',
        }
        
        required_permission = permission_map.get(action, 'ver_processo')
        return request.user.perfil.tem_permissao(required_permission)


class MovimentacaoPermission(permissions.BasePermission):
    """Permissão para movimentações do processo"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return False
        
        action = view.action
        
        permission_map = {
            'list': 'ver_processo',
            'retrieve': 'ver_processo',
            'create': 'editar_processo',
            'update': 'editar_processo',
            'partial_update': 'editar_processo',
            'destroy': 'editar_processo',
        }
        
        required_permission = permission_map.get(action, 'ver_processo')
        return request.user.perfil.tem_permissao(required_permission)


class PrazoPermission(permissions.BasePermission):
    """Permissão para prazos do processo"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return False
        
        action = view.action
        
        permission_map = {
            'list': 'ver_processo',
            'retrieve': 'ver_processo',
            'create': 'editar_processo',
            'update': 'editar_processo',
            'partial_update': 'editar_processo',
            'destroy': 'editar_processo',
            'pendentes': 'ver_processo',
            'vencidos': 'ver_processo',
        }
        
        required_permission = permission_map.get(action, 'ver_processo')
        return request.user.perfil.tem_permissao(required_permission)


class AudienciaPermission(permissions.BasePermission):
    """Permissão para audiências do processo"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if not hasattr(request.user, 'perfil') or not request.user.perfil.escritorio:
            return False
        
        action = view.action
        
        permission_map = {
            'list': 'ver_processo',
            'retrieve': 'ver_processo',
            'create': 'editar_processo',
            'update': 'editar_processo',
            'partial_update': 'editar_processo',
            'destroy': 'editar_processo',
            'proximas': 'ver_processo',
        }
        
        required_permission = permission_map.get(action, 'ver_processo')
        return request.user.perfil.tem_permissao(required_permission)
