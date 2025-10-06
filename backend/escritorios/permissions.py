# escritorios/permissions.py
from rest_framework.permissions import BasePermission
from functools import wraps


class CanCreateEscritorio(BasePermission):
    """
    Permite a criação de um escritório apenas para usuários autenticados
    que ainda não pertencem a um.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Retorna True se o usuário tiver um perfil, mas o perfil não tiver um escritório.
        return hasattr(request.user, 'perfil') and request.user.perfil.escritorio is None


class HasPermission(BasePermission):
    """
    Verifica se o usuário tem uma permissão específica definida na view.
    
    Uso básico:
        class MyView(APIView):
            permission_classes = [IsAuthenticated, HasPermission]
            required_permission = 'codename_da_permissao'
    
    Uso com múltiplas permissões:
        class MyView(APIView):
            permission_classes = [IsAuthenticated, HasPermission]
            required_permissions = ['ver_cliente', 'editar_cliente']  # Requer TODAS
    
    Uso com permissão OU:
        class MyView(APIView):
            permission_classes = [IsAuthenticated, HasPermission]
            required_any_permission = ['ver_cliente', 'editar_cliente']  # Requer ALGUMA
    """
    def has_permission(self, request, view):
        # Superusuário sempre tem permissão
        if request.user and request.user.is_authenticated and request.user.is_superuser:
            return True
            
        if not request.user or not request.user.is_authenticated or not hasattr(request.user, 'perfil'):
            return False

        # Suporta required_permission (single)
        required_permission = getattr(view, 'required_permission', None)
        
        # Suporta required_permissions (multiple - todas necessárias)
        required_permissions = getattr(view, 'required_permissions', None)
        
        # Suporta required_any_permission (multiple - pelo menos uma)
        required_any_permission = getattr(view, 'required_any_permission', None)

        # Se nenhuma permissão for especificada, nega o acesso por padrão.
        if not (required_permission or required_permissions or required_any_permission):
            return False

        # Coleta todas as permissões do usuário
        user_permissions = set()
        for papel in request.user.perfil.papeis.all():
            for permissao in papel.permissoes.all():
                user_permissions.add(permissao.codename)

        # Verifica permissão única
        if required_permission:
            return required_permission in user_permissions
        
        # Verifica múltiplas permissões (todas necessárias)
        if required_permissions:
            return all(perm in user_permissions for perm in required_permissions)
        
        # Verifica múltiplas permissões (pelo menos uma)
        if required_any_permission:
            return any(perm in user_permissions for perm in required_any_permission)
        
        return False


def require_permission(permission_codename):
    """
    Decorador para facilitar checagem de permissões em métodos de view.
    
    Uso:
        class MyView(APIView):
            @require_permission('criar_cliente')
            def post(self, request):
                # código aqui
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            if not request.user or not request.user.is_authenticated:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Autenticação necessária")
            
            if not hasattr(request.user, 'perfil'):
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Perfil de usuário não encontrado")
            
            # Coleta permissões do usuário
            user_permissions = set()
            for papel in request.user.perfil.papeis.all():
                for permissao in papel.permissoes.all():
                    user_permissions.add(permissao.codename)
            
            if permission_codename not in user_permissions:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied(
                    f"Você não tem permissão para executar esta ação. "
                    f"Permissão necessária: {permission_codename}"
                )
            
            return func(self, request, *args, **kwargs)
        return wrapper
    return decorator

