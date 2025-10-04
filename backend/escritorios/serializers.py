# escritorios/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Escritorio, PerfilUsuario, Convite, Papel, Permissao

class ConviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Convite
        fields = ['id', 'email', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

class AcceptInvitationSerializer(serializers.Serializer):
    """Serializer para aceitar um convite e criar um novo usuário."""
    token = serializers.UUIDField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

class InvitationDetailSerializer(serializers.ModelSerializer):
    escritorio_nome = serializers.CharField(source='escritorio.nome', read_only=True)

    class Meta:
        model = Convite
        fields = ['email', 'escritorio_nome']

class UserSerializerForPerfil(serializers.ModelSerializer):
    """Serializer simplificado para o User, usado dentro do Perfil."""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    """Serializer para o Perfil do Usuário, incluindo dados do usuário."""
    user = UserSerializerForPerfil(read_only=True)
    papeis = serializers.StringRelatedField(many=True, read_only=True)
    class Meta:
        model = PerfilUsuario
        fields = ['id', 'user', 'papeis']

class PermissaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permissao
        fields = ['id', 'nome', 'codename']

class PapelSerializer(serializers.ModelSerializer):
    permissoes = serializers.PrimaryKeyRelatedField(queryset=Permissao.objects.all(), many=True)

    class Meta:
        model = Papel
        fields = ['id', 'nome', 'permissoes']
        read_only_fields = ['escritorio']

class PerfilUsuarioPapelUpdateSerializer(serializers.ModelSerializer):
    papeis = serializers.PrimaryKeyRelatedField(queryset=Papel.objects.all(), many=True)

    class Meta:
        model = PerfilUsuario
        fields = ['papeis']

class EscritorioSerializer(serializers.ModelSerializer):
    """Serializer para o Escritório, incluindo a lista de membros."""
    membros = PerfilUsuarioSerializer(many=True, read_only=True)
    # Campo para receber a chave de API, mas nunca enviá-la de volta.
    openai_api_key = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Escritorio
        fields = [
            'id', 'nome', 'data_criacao', 'membros', 'openai_api_key',
            'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep',
            'logo'
        ]
        read_only_fields = ['data_criacao', 'membros']
