"""
URLs para o Sistema de Processos Judiciais
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'processos', views.ProcessoViewSet, basename='processo')
router.register(r'partes', views.ParteViewSet, basename='parte')
router.register(r'movimentacoes', views.MovimentacaoViewSet, basename='movimentacao')
router.register(r'prazos', views.PrazoViewSet, basename='prazo')
router.register(r'audiencias', views.AudienciaViewSet, basename='audiencia')

urlpatterns = [
    path('', include(router.urls)),
]
