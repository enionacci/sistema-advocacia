"""
Permissões personalizadas para o módulo de documentos.

Este módulo define permissões baseadas no sistema de papéis do escritório.
"""

from rest_framework import permissions


class DocumentoPermission(permissions.BasePermission):
    """
    Permissão para operações com documentos.
    
    - GET (list/retrieve): requer 'ver_documento'
    - POST (create): requer 'criar_documento'
    - PUT/PATCH (update): requer 'editar_documento'
    - DELETE: requer 'deletar_documento'
    - download: requer 'download_documento'
    """
    
    def has_permission(self, request, view):
        # Usuário precisa estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Usuário precisa ter perfil
        if not hasattr(request.user, 'perfil'):
            return False
        
        # Mapeia ação para permissão necessária
        action = view.action if hasattr(view, 'action') else None
        
        permission_map = {
            'list': 'ver_documento',
            'retrieve': 'ver_documento',
            'create': 'criar_documento',
            'update': 'editar_documento',
            'partial_update': 'editar_documento',
            'destroy': 'deletar_documento',
            'download': 'download_documento',
            'incrementar_visualizacao': 'ver_documento',
            'estatisticas': 'ver_documento',
        }
        
        # Se não encontrou a action no mapa, usa método HTTP
        if action not in permission_map:
            if request.method == 'GET':
                required_permission = 'ver_documento'
            elif request.method == 'POST':
                required_permission = 'criar_documento'
            elif request.method in ['PUT', 'PATCH']:
                required_permission = 'editar_documento'
            elif request.method == 'DELETE':
                required_permission = 'deletar_documento'
            else:
                return False
        else:
            required_permission = permission_map[action]
        
        # Verifica se o usuário tem a permissão
        return request.user.perfil.tem_permissao(required_permission)


class CategoriaPermission(permissions.BasePermission):
    """
    Permissão para operações com categorias de documentos.
    
    - GET (list/retrieve): requer 'ver_documento' (qualquer um pode ver categorias)
    - POST/PUT/PATCH/DELETE: requer 'gerenciar_categorias'
    """
    
    def has_permission(self, request, view):
        # Usuário precisa estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Usuário precisa ter perfil
        if not hasattr(request.user, 'perfil'):
            return False
        
        # Leitura: qualquer um com acesso a documentos pode ver
        if request.method == 'GET':
            return request.user.perfil.tem_permissao('ver_documento')
        
        # Escrita: precisa gerenciar categorias
        return request.user.perfil.tem_permissao('gerenciar_categorias')


class TagPermission(permissions.BasePermission):
    """
    Permissão para operações com tags de documentos.
    
    - GET (list/retrieve): requer 'ver_documento' (qualquer um pode ver tags)
    - POST/PUT/PATCH/DELETE: requer 'gerenciar_tags'
    """
    
    def has_permission(self, request, view):
        # Usuário precisa estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Usuário precisa ter perfil
        if not hasattr(request.user, 'perfil'):
            return False
        
        # Leitura: qualquer um com acesso a documentos pode ver
        if request.method == 'GET':
            return request.user.perfil.tem_permissao('ver_documento')
        
        # Escrita: precisa gerenciar tags
        return request.user.perfil.tem_permissao('gerenciar_tags')
