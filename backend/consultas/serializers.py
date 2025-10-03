# consultas/serializers.py
from rest_framework import serializers
from .models import Consulta
from analises.serializers import AnaliseIASerializer # Importe o novo serializer

class ConsultaSerializer(serializers.ModelSerializer):
    analises = AnaliseIASerializer(many=True, read_only=True) # Adicione o campo aninhado

    class Meta:
        model = Consulta
        fields = ['id', 'cliente', 'audio_file', 'transcricao', 'data_criacao', 'analises']
        read_only_fields = ['transcricao', 'analises'] # A transcrição e as análises não serão enviadas pelo usuário