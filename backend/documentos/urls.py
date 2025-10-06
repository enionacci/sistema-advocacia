"""
URLs para API de Documentos
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, TagViewSet, DocumentoViewSet
from .ai_views import (
    DocumentoOCRView,
    DocumentoSalvarOCRView,
    DocumentoAnaliseIAListCreateView,
    DocumentoAnaliseIADetailView,
    DocumentoAnaliseIAReprocessView
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'', DocumentoViewSet, basename='documento')

urlpatterns = [
    # Scanner & IA
    path('ocr/', DocumentoOCRView.as_view(), name='documento-ocr'),
    path('salvar-ocr/', DocumentoSalvarOCRView.as_view(), name='documento-salvar-ocr'),
    path('analises/', DocumentoAnaliseIAListCreateView.as_view(), name='analises-list-create'),
    path('analises/<int:pk>/', DocumentoAnaliseIADetailView.as_view(), name='analises-detail'),
    path('analises/<int:pk>/reprocessar/', DocumentoAnaliseIAReprocessView.as_view(), name='analises-reprocess'),
    
    # ViewSets (deve vir por último)
    path('', include(router.urls)),
]
