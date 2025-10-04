# escritorios/urls.py
from django.urls import path
from .views import (
    MinhaEscritorioView, EscritorioCreateView, EnviarConviteView, 
    AcceptInvitationView, MembroDestroyView, PermissaoListView, 
    PapelListCreateView, PapelDetailView, PerfilUsuarioPapelUpdateView,
    InvitationDetailView
)

urlpatterns = [
    path('escritorios/', EscritorioCreateView.as_view(), name='escritorio-create'),
    path('meu-escritorio/', MinhaEscritorioView.as_view(), name='meu-escritorio'),
    path('meu-escritorio/convidar/', EnviarConviteView.as_view(), name='enviar-convite'),
    path('meu-escritorio/membros/<int:pk>/', MembroDestroyView.as_view(), name='membro-delete'),
    path('convites/aceitar/', AcceptInvitationView.as_view(), name='aceitar-convite'),
    path('convites/<uuid:token>/', InvitationDetailView.as_view(), name='convite-detail'),

    # URLs para Papéis e Permissões
    path('permissoes/', PermissaoListView.as_view(), name='permissao-list'),
    path('papeis/', PapelListCreateView.as_view(), name='papel-list-create'),
    path('papeis/<int:pk>/', PapelDetailView.as_view(), name='papel-detail'),
    path('membros/<int:pk>/papeis/', PerfilUsuarioPapelUpdateView.as_view(), name='usuario-papel-update'),
]
