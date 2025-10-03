# clientes/views.py

from rest_framework import generics
from .models import Cliente
from .serializers import ClienteSerializer
from rest_framework.permissions import IsAuthenticated 
from rest_framework import generics, filters

class ClienteListCreateView(generics.ListCreateAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome_completo', 'cpf', 'email']

    def get_queryset(self):
        """Este queryset retorna apenas clientes do escritório do usuário logado."""
        user = self.request.user
        return Cliente.objects.filter(escritorio=user.perfil.escritorio)

    def perform_create(self, serializer):
        """Associa o novo cliente ao escritório do usuário logado."""
        serializer.save(escritorio=self.request.user.perfil.escritorio)

class ClienteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Este queryset garante que o usuário só pode acessar clientes do seu próprio escritório."""
        user = self.request.user
        return Cliente.objects.filter(escritorio=user.perfil.escritorio)