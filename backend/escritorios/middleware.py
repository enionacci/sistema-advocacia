# escritorios/middleware.py
from django.http import JsonResponse
from django.utils import timezone

class SubscriptionCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Deixa passar requisições para a API de autenticação e admin
        if request.path.startswith('/api/auth/') or request.path.startswith('/admin/'):
            return self.get_response(request)

        # Verifica apenas usuários autenticados
        if request.user and request.user.is_authenticated:
            # hasattr é uma forma segura de checar se o perfil existe
            if hasattr(request.user, 'perfil'):
                escritorio = request.user.perfil.escritorio
                
                # Se o status for 'trial', verifica se expirou
                if escritorio.status_assinatura == 'trial':
                    if escritorio.data_expiracao_teste and escritorio.data_expiracao_teste < timezone.now():
                        escritorio.status_assinatura = 'expired'
                        escritorio.save()
                
                # Bloqueia a requisição se a assinatura estiver expirada
                if escritorio.status_assinatura == 'expired':
                    return JsonResponse(
                        {'error': 'Seu período de teste expirou. Por favor, realize uma assinatura para continuar.'},
                        status=403 # Forbidden
                    )

        response = self.get_response(request)
        return response
