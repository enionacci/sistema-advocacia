# analises/urls.py
from django.urls import path
from .views import AnalisarConsultaView, AnaliseIADestroyView

urlpatterns = [
    path('consultas/<int:pk>/analisar/', AnalisarConsultaView.as_view(), name='analisar-consulta'),
    path('analises/<int:pk>/', AnaliseIADestroyView.as_view(), name='analise-delete'),
]
