# escritorios/urls.py
from django.urls import path
from .views import MinhaEscritorioView, EscritorioCreateView, EnviarConviteView, AcceptInvitationView, MembroDestroyView

urlpatterns = [
    path('escritorios/', EscritorioCreateView.as_view(), name='escritorio-create'),
    path('meu-escritorio/', MinhaEscritorioView.as_view(), name='meu-escritorio'),
    path('meu-escritorio/convidar/', EnviarConviteView.as_view(), name='enviar-convite'),
    path('meu-escritorio/membros/<int:pk>/', MembroDestroyView.as_view(), name='membro-delete'),
    path('convites/aceitar/', AcceptInvitationView.as_view(), name='aceitar-convite'),
]
