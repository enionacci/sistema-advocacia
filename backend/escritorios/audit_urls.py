# escritorios/audit_urls.py
from django.urls import path
from . import audit_views

urlpatterns = [
    path('', audit_views.AuditLogListView.as_view(), name='audit-log-list'),
    path('<int:pk>/', audit_views.AuditLogDetailView.as_view(), name='audit-log-detail'),
    path('stats/', audit_views.AuditLogStatsView.as_view(), name='audit-log-stats'),
    path('retencao/', audit_views.AuditLogRetencaoView.as_view(), name='audit-log-retencao'),
]
