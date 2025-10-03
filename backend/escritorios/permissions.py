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
        # Retorna True se o usuário não tiver um perfil (e, portanto, um escritório)
        return not hasattr(request.user, 'perfil')
