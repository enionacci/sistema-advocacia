# escritorios/permissions.py
from rest_framework.permissions import BasePermission

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
    Uso:
    class MyView(APIView):
        permission_classes = [IsAuthenticated, HasPermission]
        required_permission = 'codename_da_permissao'
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated or not hasattr(request.user, 'perfil'):
            return False

        required_permission = getattr(view, 'required_permission', None)
        if not required_permission:
            # Se a view não especificar uma permissão, nega o acesso por padrão.
            return False

        user_permissions = set()
        for papel in request.user.perfil.papeis.all():
            for permissao in papel.permissoes.all():
                user_permissions.add(permissao.codename)

        return required_permission in user_permissions
