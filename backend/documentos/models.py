"""
Models para o Sistema de Gerenciamento de Documentos

- Categoria: Tipos de documentos (RG, CPF, Contratos, etc)
- Tag: Tags personalizadas para organização
- Documento: Arquivo digital vinculado a um cliente
"""

import os
import hashlib
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
from clientes.models import Cliente
from escritorios.models import Escritorio

User = get_user_model()


class Categoria(models.Model):
    """
    Categorias de documentos para organização
    Ex: Identificação, Contratos, Procurações, Processos
    """
    escritorio = models.ForeignKey(
        Escritorio,
        on_delete=models.CASCADE,
        related_name='categorias_documentos',
        verbose_name='Escritório'
    )
    nome = models.CharField(
        max_length=100,
        verbose_name='Nome da Categoria'
    )
    descricao = models.TextField(
        blank=True,
        verbose_name='Descrição'
    )
    icone = models.CharField(
        max_length=50,
        default='description',
        verbose_name='Ícone Material-UI',
        help_text='Nome do ícone do Material-UI (ex: description, article, folder)'
    )
    cor = models.CharField(
        max_length=20,
        default='primary',
        verbose_name='Cor',
        help_text='Cor do Material-UI (primary, secondary, success, error, warning, info)'
    )
    ordem = models.IntegerField(
        default=0,
        verbose_name='Ordem de Exibição'
    )
    ativo = models.BooleanField(
        default=True,
        verbose_name='Ativo'
    )
    data_criacao = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Data de Criação'
    )

    class Meta:
        ordering = ['ordem', 'nome']
        verbose_name = 'Categoria de Documento'
        verbose_name_plural = 'Categorias de Documentos'
        unique_together = ['escritorio', 'nome']

    def __str__(self):
        return f"{self.nome} ({self.escritorio.nome})"


class Tag(models.Model):
    """
    Tags personalizadas para marcação de documentos
    """
    escritorio = models.ForeignKey(
        Escritorio,
        on_delete=models.CASCADE,
        related_name='tags_documentos',
        verbose_name='Escritório'
    )
    nome = models.CharField(
        max_length=50,
        verbose_name='Nome da Tag'
    )
    cor = models.CharField(
        max_length=7,
        default='#1976d2',
        verbose_name='Cor Hex',
        help_text='Cor em formato hexadecimal (#RRGGBB)'
    )
    data_criacao = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Data de Criação'
    )

    class Meta:
        ordering = ['nome']
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        unique_together = ['escritorio', 'nome']

    def __str__(self):
        return self.nome


def documento_upload_path(instance, filename):
    """
    Define o caminho de upload dos documentos
    Organiza por: escritorio/cliente/ano/mes/filename
    """
    import datetime
    now = datetime.datetime.now()
    return os.path.join(
        'documentos',
        f'escritorio_{instance.escritorio.id}',
        f'cliente_{instance.cliente.id}',
        str(now.year),
        str(now.month).zfill(2),
        filename
    )


class Documento(models.Model):
    """
    Documento digital vinculado a um cliente
    """
    # Relacionamentos
    escritorio = models.ForeignKey(
        Escritorio,
        on_delete=models.CASCADE,
        related_name='documentos',
        verbose_name='Escritório'
    )
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name='documentos',
        verbose_name='Cliente'
    )
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documentos',
        verbose_name='Categoria'
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name='documentos',
        verbose_name='Tags'
    )

    # Informações do Arquivo
    arquivo = models.FileField(
        upload_to=documento_upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png', 'txt', 'xlsx', 'xls']
            )
        ],
        verbose_name='Arquivo'
    )
    titulo = models.CharField(
        max_length=255,
        verbose_name='Título do Documento'
    )
    descricao = models.TextField(
        blank=True,
        verbose_name='Descrição'
    )
    
    # Metadados do Arquivo
    nome_original = models.CharField(
        max_length=255,
        verbose_name='Nome Original do Arquivo'
    )
    tipo_arquivo = models.CharField(
        max_length=10,
        verbose_name='Tipo/Extensão'
    )
    tamanho = models.BigIntegerField(
        verbose_name='Tamanho em Bytes'
    )
    hash_md5 = models.CharField(
        max_length=32,
        blank=True,
        verbose_name='Hash MD5',
        help_text='Para detectar duplicatas'
    )

    # Datas
    data_upload = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Data de Upload'
    )
    data_documento = models.DateField(
        null=True,
        blank=True,
        verbose_name='Data do Documento',
        help_text='Data real do documento físico/assinatura'
    )
    data_atualizacao = models.DateTimeField(
        auto_now=True,
        verbose_name='Última Atualização'
    )

    # Controles
    confidencial = models.BooleanField(
        default=False,
        verbose_name='Confidencial',
        help_text='Requer permissão especial para visualizar'
    )
    ativo = models.BooleanField(
        default=True,
        verbose_name='Ativo'
    )
    
    # Versionamento
    versao = models.IntegerField(
        default=1,
        verbose_name='Versão'
    )
    documento_pai = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='versoes',
        verbose_name='Documento Original',
        help_text='Referência à versão anterior'
    )

    # Auditoria
    usuario_upload = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='documentos_enviados',
        verbose_name='Usuário que fez Upload'
    )
    visualizacoes = models.IntegerField(
        default=0,
        verbose_name='Número de Visualizações'
    )
    downloads = models.IntegerField(
        default=0,
        verbose_name='Número de Downloads'
    )

    # Texto extraído (para busca futura - OCR)
    texto_extraido = models.TextField(
        blank=True,
        verbose_name='Texto Extraído (OCR)',
        help_text='Texto extraído do documento para busca'
    )

    class Meta:
        ordering = ['-data_upload']
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'
        indexes = [
            models.Index(fields=['escritorio', 'cliente', '-data_upload']),
            models.Index(fields=['escritorio', 'categoria', '-data_upload']),
            models.Index(fields=['hash_md5']),
        ]

    def __str__(self):
        return f"{self.titulo} - {self.cliente.nome_completo}"

    def save(self, *args, **kwargs):
        """
        Calcula o hash MD5 do arquivo no primeiro save
        """
        if self.arquivo and not self.hash_md5:
            md5_hash = hashlib.md5()
            for chunk in self.arquivo.chunks():
                md5_hash.update(chunk)
            self.hash_md5 = md5_hash.hexdigest()
        
        # Extrai tipo e tamanho do arquivo
        if self.arquivo:
            self.nome_original = os.path.basename(self.arquivo.name)
            self.tipo_arquivo = os.path.splitext(self.arquivo.name)[1].lower().replace('.', '')
            self.tamanho = self.arquivo.size

        super().save(*args, **kwargs)

    def get_tamanho_formatado(self):
        """
        Retorna o tamanho do arquivo formatado (KB, MB, GB)
        """
        size = self.tamanho
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"

    def incrementar_visualizacoes(self):
        """
        Incrementa o contador de visualizações
        """
        self.visualizacoes += 1
        self.save(update_fields=['visualizacoes'])

    def incrementar_downloads(self):
        """
        Incrementa o contador de downloads
        """
        self.downloads += 1
        self.save(update_fields=['downloads'])
