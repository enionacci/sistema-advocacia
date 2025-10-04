# consultas/views.py
from rest_framework import generics, parsers, status
from rest_framework.response import Response
from .models import Consulta
from .serializers import ConsultaSerializer
from rest_framework.permissions import IsAuthenticated
from escritorios.permissions import HasPermission
from clientes.models import Cliente

import openai
from django.conf import settings
import os
import subprocess

class ConsultaCreateView(generics.CreateAPIView):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'criar_consulta'
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

        # Salva o arquivo .wav original primeiro
        self.perform_create(serializer)
        consulta = serializer.instance

        # --- Lógica de Conversão para MP3 ---
        try:
            original_wav_path = consulta.audio_file.path
            filename_without_ext = os.path.splitext(os.path.basename(original_wav_path))[0]
            converted_mp3_filename = f"{filename_without_ext}.mp3"
            converted_mp3_path = os.path.join(os.path.dirname(original_wav_path), converted_mp3_filename)

            # Executa o FFmpeg para converter .wav para .mp3
            subprocess.run([
                'ffmpeg',
                '-i', original_wav_path,
                '-b:a', '96k',  # Bitrate de 96kbps, bom para voz
                converted_mp3_path,
                '-y'  # Sobrescreve o arquivo de saída se ele existir
            ], check=True, capture_output=True)

            # Atualiza a instância do modelo para apontar para o novo arquivo .mp3
            new_db_path = os.path.join('audio_consultas', converted_mp3_filename)
            consulta.audio_file.name = new_db_path
            consulta.save()

            # Exclui o arquivo .wav original
            os.remove(original_wav_path)

        except subprocess.CalledProcessError as e:
            error_message = f"Erro no FFmpeg durante a conversão: {e.stderr.decode()}"
            print(error_message)
            # Salva o erro na transcrição e mantém o .wav original
            consulta.transcricao = error_message
            consulta.save()
        except Exception as e:
            error_message = f"Erro inesperado durante a conversão do áudio: {e}"
            print(error_message)
            # Salva o erro na transcrição e mantém o .wav original
            consulta.transcricao = error_message
            consulta.save()
        # --- Fim da Lógica de Conversão ---

        # --- Lógica de Transcrição (agora usa o .mp3) ---
        try:
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
            # Se a transcrição falhar, o erro é salvo no campo
            if not consulta.transcricao: # Só sobrescreve se não houver erro de conversão
                consulta.transcricao = f"Erro na transcrição: {e}"
                consulta.save()
        # --- Fim da Lógica de Transcrição ---

        headers = self.get_success_headers(serializer.data)
        updated_serializer = self.get_serializer(instance=consulta)
        return Response(updated_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    
class ConsultaListView(generics.ListAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'ver_consulta'

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
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'deletar_consulta'

    def get_queryset(self):
        """Permite excluir apenas consultas de clientes do escritório do usuário."""
        user = self.request.user
        return Consulta.objects.filter(cliente__escritorio=user.perfil.escritorio)