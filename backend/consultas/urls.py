# consultas/urls.py
from django.urls import path
from .views import ConsultaCreateView, ConsultaDestroyView

urlpatterns = [
    path('consultas/', ConsultaCreateView.as_view(), name='consulta-create'),
    path('consultas/<int:pk>/', ConsultaDestroyView.as_view(), name='consulta-delete'),
]