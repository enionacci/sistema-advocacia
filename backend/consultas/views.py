# consultas/views.py
from rest_framework import generics, parsers, status
from rest_framework.response import Response
from .models import Consulta
from .serializers import ConsultaSerializer
from rest_framework.permissions import IsAuthenticated
from clientes.models import Cliente

import openai
from django.conf import settings

class ConsultaCreateView(generics.CreateAPIView):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def create(self, request, *args, **kwargs):
        cliente_id = request.data.get('cliente')
        try:
            cliente = Cliente.objects.get(pk=cliente_id)
            if cliente.escritorio != request.user.perfil.escritorio:
                return Response({"detail": "Você não tem permissão para criar uma consulta para este cliente."}, status=status.HTTP_403_FORBIDDEN)
        except Cliente.DoesNotExist:
            return Response({"detail": "Cliente não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        consulta = serializer.instance

        try:
            # Pega a chave de API do escritório do usuário
            escritorio = request.user.perfil.escritorio
            api_key = escritorio.openai_api_key

            if not api_key:
                raise Exception("A chave de API da OpenAI não está configurada para este escritório.")

            openai.api_key = api_key
            audio_file_path = consulta.audio_file.path
            with open(audio_file_path, "rb") as audio_file:
                transcription = openai.audio.transcriptions.create(
                  model="whisper-1", 
                  file=audio_file
                )
            consulta.transcricao = transcription.text
            consulta.save()
        except Exception as e:
            print(f"Ocorreu um erro durante a transcrição: {e}")
            consulta.transcricao = f"Erro na transcrição: {e}"
            consulta.save()

        headers = self.get_success_headers(serializer.data)
        updated_serializer = self.get_serializer(instance=consulta)
        return Response(updated_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class ConsultaListView(generics.ListAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retorna consultas de um cliente específico, se ele pertencer ao escritório do usuário."""
        cliente_pk = self.kwargs['cliente_pk']
        user = self.request.user
        return Consulta.objects.filter(
            cliente__pk=cliente_pk,
            cliente__escritorio=user.perfil.escritorio
        ).order_by('-data_criacao')

class ConsultaDestroyView(generics.DestroyAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Permite excluir apenas consultas de clientes do escritório do usuário."""
        user = self.request.user
        return Consulta.objects.filter(cliente__escritorio=user.perfil.escritorio)