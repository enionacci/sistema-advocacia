"""
Permissões personalizadas para o módulo de documentos.

Este módulo define permissões baseadas no sistema de papéis do escritório.
"""

from rest_framework import permissions

class DocumentoPermission(permissions.BasePermission):
    """
    Permissão para operações com documentos e arquivos.
    Verifica o contexto (documento de cliente ou arquivo geral)
    e aplica a permissão correta.
    """
    
    def has_permission(self, request, view):
        # Usuário precisa estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Usuário precisa ter perfil
        if not hasattr(request.user, 'perfil'):
            return False
        
        # Determina o contexto: 'documento' (cliente) ou 'arquivo' (geral)
        # A presença do query param 'cliente' ou 'cliente_id' indica o contexto de cliente.
        is_client_scope = 'cliente' in request.query_params or 'cliente_id' in request.query_params
        
        if is_client_scope:
            scope_perms = {
                'GET': 'ver_documento',
                'POST': 'criar_documento',
                'PUT': 'editar_documento',
                'PATCH': 'editar_documento',
                'DELETE': 'deletar_documento',
                # Actions específicas
                'download': 'download_documento',
                'incrementar_visualizacao': 'ver_documento',
                'estatisticas': 'ver_documento',
            }
        else:
            # Permissões para o módulo geral de "Arquivos"
            scope_perms = {
                'GET': 'ver_arquivos',
                'POST': 'criar_arquivo',
                'PUT': 'editar_arquivo',
                'PATCH': 'editar_arquivo',
                'DELETE': 'deletar_arquivo',
                # Actions específicas
                'download': 'download_arquivo',
                'incrementar_visualizacao': 'ver_arquivos',
                'estatisticas': 'ver_arquivos',
            }

        action = view.action if hasattr(view, 'action') else None
        
        # Mapeia a action da view para o método HTTP correspondente para simplificar
        action_to_method = {
            'list': 'GET',
            'retrieve': 'GET',
            'create': 'POST',
            'update': 'PUT',
            'partial_update': 'PATCH',
            'destroy': 'DELETE',
        }
        
        # Usa a action da view se disponível, senão o método HTTP
        method = action_to_method.get(action, request.method)
        
        # Actions customizadas que não seguem o padrão CRUD
        if action in ['download', 'incrementar_visualizacao', 'estatisticas']:
            required_permission = scope_perms.get(action)
        else:
            required_permission = scope_perms.get(method)

        if not required_permission:
            return False
            
        # Verifica se o usuário tem a permissão
        return request.user.perfil.tem_permissao(required_permission)


class CategoriaPermission(permissions.BasePermission):
    """
    Permissão para operações com categorias de documentos.
    
    - GET (list/retrieve): requer 'ver_documento' OU 'ver_arquivos'
    - POST/PUT/PATCH/DELETE: requer 'gerenciar_categorias'
    """
    
    def has_permission(self, request, view):
        # Usuário precisa estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Usuário precisa ter perfil
        if not hasattr(request.user, 'perfil'):
            return False
        
        # Leitura: pode ver categorias se tiver permissão para ver documentos OU arquivos
        if request.method == 'GET':
            return (
                request.user.perfil.tem_permissao('ver_documento') or
                request.user.perfil.tem_permissao('ver_arquivos')
            )
        
        # Escrita: precisa gerenciar categorias (permissão única)
        return request.user.perfil.tem_permissao('gerenciar_categorias')


class TagPermission(permissions.BasePermission):
    """
    Permissão para operações com tags de documentos.
    
    - GET (list/retrieve): requer 'ver_documento' OU 'ver_arquivos'
    - POST/PUT/PATCH/DELETE: requer 'gerenciar_tags'
    """
    
    def has_permission(self, request, view):
        # Usuário precisa estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Usuário precisa ter perfil
        if not hasattr(request.user, 'perfil'):
            return False
        
        # Leitura: pode ver tags se tiver permissão para ver documentos OU arquivos
        if request.method == 'GET':
            return (
                request.user.perfil.tem_permissao('ver_documento') or
                request.user.perfil.tem_permissao('ver_arquivos')
            )
        
        # Escrita: precisa gerenciar tags (permissão única)
        return request.user.perfil.tem_permissao('gerenciar_tags')
