# clientes/urls.py

from django.urls import path
from .views import ClienteListCreateView, ClienteDetailView
from consultas.views import ConsultaListView # Importe a nova view de listagem

urlpatterns = [
    path('clientes/', ClienteListCreateView.as_view(), name='cliente-list-create'),
    path('clientes/<int:pk>/', ClienteDetailView.as_view(), name='cliente-detail'),
    path('clientes/<int:cliente_pk>/consultas/', ConsultaListView.as_view(), name='cliente-consultas-list'),

]