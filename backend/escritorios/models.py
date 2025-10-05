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

    # --- Endereço ---
    logradouro = models.CharField(max_length=255, blank=True, null=True, verbose_name="Logradouro")
    numero = models.CharField(max_length=20, blank=True, null=True, verbose_name="Número")
    complemento = models.CharField(max_length=100, blank=True, null=True, verbose_name="Complemento")
    bairro = models.CharField(max_length=100, blank=True, null=True, verbose_name="Bairro")
    cidade = models.CharField(max_length=100, blank=True, null=True, verbose_name="Cidade")
    estado = models.CharField(max_length=2, blank=True, null=True, verbose_name="Estado (UF)")
    cep = models.CharField(max_length=9, blank=True, null=True, verbose_name="CEP")

    # --- Branding ---
    logo = models.ImageField(upload_to='logos/', null=True, blank=True, verbose_name="Logotipo do Escritório")

    def __str__(self):
        return self.nome

class PerfilUsuario(models.Model):
    """Estende o modelo de usuário padrão para vinculá-lo a um escritório."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    escritorio = models.ForeignKey(Escritorio, on_delete=models.CASCADE, related_name='membros', null=True, blank=True)
    papeis = models.ManyToManyField('Papel', related_name='usuarios', blank=True)

    def __str__(self):
        if self.escritorio:
            return f"{self.user.username} @ {self.escritorio.nome}"
        return self.user.username
    
    def tem_permissao(self, codename):
        """
        Verifica se o usuário tem uma permissão específica através de seus papéis.
        
        Args:
            codename (str): O codename da permissão (ex: 'ver_cliente', 'criar_documento')
        
        Returns:
            bool: True se o usuário tem a permissão, False caso contrário
        """
        # Verifica se o usuário é superusuário
        if self.user.is_superuser:
            return True
        
        # Busca em todos os papéis do usuário
        return self.papeis.filter(
            permissoes__codename=codename
        ).exists()

class Permissao(models.Model):
    """Representa uma permissão específica no sistema."""
    nome = models.CharField(max_length=100, unique=True, verbose_name="Nome da Permissão")
    codename = models.CharField(max_length=100, unique=True, verbose_name="Codename da Permissão")

    def __str__(self):
        return self.nome

class Papel(models.Model):
    """Representa um papel ou função que agrupa várias permissões."""
    nome = models.CharField(max_length=100, verbose_name="Nome do Papel")
    escritorio = models.ForeignKey(Escritorio, on_delete=models.CASCADE, related_name='papeis')
    permissoes = models.ManyToManyField(Permissao, related_name='papeis', blank=True)

    class Meta:
        unique_together = ('nome', 'escritorio')

    def __str__(self):
        return f"{self.nome} ({self.escritorio.nome})"

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


# Importa models de auditoria
from .audit_models import AuditLog, AuditLogRetencao
