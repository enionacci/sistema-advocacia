"""
URLs para API de Documentos
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, TagViewSet, DocumentoViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'', DocumentoViewSet, basename='documento')

urlpatterns = [
    path('', include(router.urls)),
]
