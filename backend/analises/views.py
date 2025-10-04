# analises/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from escritorios.permissions import HasPermission
from django.shortcuts import get_object_or_404
from django.conf import settings
import openai

from consultas.models import Consulta
from .models import AnaliseIA
from .serializers import AnaliseIASerializer

class AnaliseIADestroyView(generics.DestroyAPIView):
    queryset = AnaliseIA.objects.all()
    serializer_class = AnaliseIASerializer
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'deletar_analise'

    def get_queryset(self):
        """Permite excluir apenas análises de consultas do escritório do usuário."""
        user = self.request.user
        return AnaliseIA.objects.filter(consulta__cliente__escritorio=user.perfil.escritorio)

class AnalisarConsultaView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'criar_analise'
    serializer_class = AnaliseIASerializer

    def post(self, request, *args, **kwargs):
        consulta = get_object_or_404(Consulta, pk=self.kwargs.get('pk'))
        user = self.request.user

        # Validação de permissão
        if consulta.cliente.escritorio != user.perfil.escritorio:
            return Response({"detail": "Você não tem permissão para analisar esta consulta."}, status=status.HTTP_403_FORBIDDEN)

        contexto = request.data.get('contexto')

        if not contexto:
            return Response({"error": "O campo 'contexto' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        if not consulta.transcricao:
            return Response({"error": "A consulta não possui uma transcrição para ser analisada."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Pega a chave de API do escritório do usuário
            escritorio = request.user.perfil.escritorio
            api_key = escritorio.openai_api_key

            if not api_key:
                raise Exception("A chave de API da OpenAI não está configurada para este escritório.")

            # 2. Preparar e enviar a requisição para a OpenAI
            openai.api_key = api_key
            
            system_prompt = "Você é um assistente de advocacia. Analise o texto fornecido com base no contexto e forneça insights, resumos ou sugestões de artigos de lei relevantes."
            user_prompt = f"Contexto da análise: {contexto}\n\nTranscrição da consulta: \n```\n{consulta.transcricao}\n```"

            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )

            resultado_analise = response.choices[0].message.content

            # 3. Salvar a análise no banco de dados
            analise = AnaliseIA.objects.create(
                consulta=consulta,
                contexto=contexto,
                resultado=resultado_analise
            )

            # 4. Retornar o resultado
            serializer = self.get_serializer(analise)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Ocorreu um erro ao processar a análise com a IA: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)