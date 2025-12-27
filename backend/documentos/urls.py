from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, TagViewSet, DocumentoViewSet
from .views import salvar_documento_scanner, processar_ocr, simular_progresso_ocr, OCRProgressView
from .ai_views import (
    DocumentoOCRView,
    DocumentoOCRAsyncView,
    DocumentoOCRWithMarginsView,
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
    deanonymize_text,
    # =============================
    # NOVAS IMPORTAÇÕES - ANONIMIZAÇÃO MANUAL
    # =============================
    manual_anonymize,
    undo_manual_anonymize,
    suggest_type,
    list_manual_anonymizations,
    get_updated_text
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'', DocumentoViewSet, basename='documento')

urlpatterns = [
    # Scanner & IA - OCR BÁSICO (NOVO)
#    path('ocr-simple/', processar_ocr, name='documento-ocr-simple'),
#   path('ocr-progress/<str:task_id>/', OCRProgressView.as_view(), name='documento-ocr-progress-simple'),
#    path('ocr-progress/<str:task_id>/update/', simular_progresso_ocr, name='simular-progresso-ocr'),
    
    # Scanner & IA - OCR AVANÇADO (EXISTENTE)
    path('ocr/', DocumentoOCRView.as_view(), name='documento-ocr'),
    path('ocr-async/', DocumentoOCRAsyncView.as_view(), name='documento-ocr-async'),
    path('ocr-full-with-margins/', DocumentoOCRWithMarginsView.as_view(), name='documento-ocr-with-margins'),
    path('ocr-progress/<str:task_id>/', DocumentoOCRProgressView.as_view(), name='documento-ocr-progress'),  # ✅ LINHA QUE FALTAVA!
    path('salvar-ocr/', DocumentoSalvarOCRView.as_view(), name='documento-salvar-ocr'),
    path('analises/', DocumentoAnaliseIAListCreateView.as_view(), name='analises-list-create'),
    path('analises/<int:pk>/', DocumentoAnaliseIADetailView.as_view(), name='analises-detail'),
    path('analises/<int:pk>/reprocessar/', DocumentoAnaliseIAReprocessView.as_view(), name='analises-reprocess'),
    
    # Anonimização Automática (existente)
    path('<int:documento_id>/anonymize/', anonymize_document, name='documento-anonymize'),
    path('<int:documento_id>/restore/', restore_document, name='documento-restore'),
    path('anonymizations/', list_anonymizations, name='anonymizations-list'),
    path('anonymizations/<int:anonimizacao_id>/', anonymization_details, name='anonymization-details'),
    path('anonymizations/<int:anonimizacao_id>/delete/', delete_anonymization, name='anonymization-delete'),
    path('anonymizations/<int:anonimizacao_id>/deanonymize/', deanonymize_text, name='deanonymize-text'),
    
    # =============================
    # ANONIMIZAÇÃO MANUAL - NOVAS URLs
    # =============================
    path('manual-anonymize/', manual_anonymize, name='manual-anonymize'),
    path('undo-manual-anonymize/', undo_manual_anonymize, name='undo-manual-anonymize'),
    path('suggest-type/', suggest_type, name='suggest-type'),
    path('anonymizations/<int:anonimizacao_id>/manual/', list_manual_anonymizations, name='list-manual-anonymizations'),
    path('anonymizations/<int:anonimizacao_id>/updated-text/', get_updated_text, name='get-updated-text'),
    
    # Scanner básico
    path('salvar-scanner/', salvar_documento_scanner, name='salvar-documento-scanner'),
    
    # ViewSets (deve vir por último)
    path('', include(router.urls)),
]