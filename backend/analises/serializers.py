# analises/serializers.py
from rest_framework import serializers
from .models import AnaliseIA

class AnaliseIASerializer(serializers.ModelSerializer):
    class Meta:
        model = AnaliseIA
        fields = ['id', 'contexto', 'resultado', 'data_criacao']
        read_only_fields = ['resultado', 'data_criacao']
