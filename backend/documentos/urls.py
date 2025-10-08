"""
URLs para API de Documentos
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, TagViewSet, DocumentoViewSet
from .ai_views import (
    DocumentoOCRView,
    DocumentoOCRAsyncView,
    DocumentoOCRProgressView,
    DocumentoSalvarOCRView,
    DocumentoAnaliseIAListCreateView,
    DocumentoAnaliseIADetailView,
    DocumentoAnaliseIAReprocessView
)
from .anonymization_views import (
    anonymize_document,
    restore_document,
    list_anonymizations,
    anonymization_details,
    delete_anonymization,
    deanonymize_text
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'', DocumentoViewSet, basename='documento')

urlpatterns = [
    # Scanner & IA
    path('ocr/', DocumentoOCRView.as_view(), name='documento-ocr'),
    path('ocr-async/', DocumentoOCRAsyncView.as_view(), name='documento-ocr-async'),
    path('ocr-progress/<str:task_id>/', DocumentoOCRProgressView.as_view(), name='documento-ocr-progress'),
    path('salvar-ocr/', DocumentoSalvarOCRView.as_view(), name='documento-salvar-ocr'),
    path('analises/', DocumentoAnaliseIAListCreateView.as_view(), name='analises-list-create'),
    path('analises/<int:pk>/', DocumentoAnaliseIADetailView.as_view(), name='analises-detail'),
    path('analises/<int:pk>/reprocessar/', DocumentoAnaliseIAReprocessView.as_view(), name='analises-reprocess'),
    
    # Anonimização
    path('<int:documento_id>/anonymize/', anonymize_document, name='documento-anonymize'),
    path('<int:documento_id>/restore/', restore_document, name='documento-restore'),
    path('anonymizations/', list_anonymizations, name='anonymizations-list'),
    path('anonymizations/<int:anonimizacao_id>/', anonymization_details, name='anonymization-details'),
    path('anonymizations/<int:anonimizacao_id>/delete/', delete_anonymization, name='anonymization-delete'),
    path('anonymizations/<int:anonimizacao_id>/deanonymize/', deanonymize_text, name='deanonymize-text'),
    
    # ViewSets (deve vir por último)
    path('', include(router.urls)),
]
