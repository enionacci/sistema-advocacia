# escritorios/models.py
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from encrypted_fields.fields import EncryptedTextField

class Escritorio(models.Model):
    """Representa um inquilino (tenant), ou seja, um escritório de advocacia."""

    STATUS_ASSINATURA = (
        ('trial', 'Em Teste'),
        ('active', 'Ativo'),
        ('expired', 'Expirado'),
        ('canceled', 'Cancelado'),
    )

    nome = models.CharField(max_length=255, verbose_name="Nome do Escritório")
    data_criacao = models.DateTimeField(auto_now_add=True)
    status_assinatura = models.CharField(
        max_length=20, 
        choices=STATUS_ASSINATURA, 
        default='trial',
        verbose_name="Status da Assinatura"
    )
    data_expiracao_teste = models.DateTimeField(
        verbose_name="Data de Expiração do Teste",
        null=True, 
        blank=True
    )
    openai_api_key = EncryptedTextField(
        verbose_name="Chave de API da OpenAI",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.nome

class PerfilUsuario(models.Model):
    """Estende o modelo de usuário padrão para vinculá-lo a um escritório."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    escritorio = models.ForeignKey(Escritorio, on_delete=models.CASCADE, related_name='membros')

    def __str__(self):
        return f"{self.user.username} @ {self.escritorio.nome}"

class Convite(models.Model):
    """Armazena um convite para um usuário se juntar a um escritório."""
    STATUS_CONVITE = (
        ('pending', 'Pendente'),
        ('accepted', 'Aceito'),
        ('expired', 'Expirado'),
    )

    email = models.EmailField()
    escritorio = models.ForeignKey(Escritorio, on_delete=models.CASCADE, related_name='convites')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='convites_enviados')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CONVITE, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Convite para {self.email} para o escritório {self.escritorio.nome}"
