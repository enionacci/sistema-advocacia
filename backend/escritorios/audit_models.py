# escritorios/audit_models.py
"""
Sistema de Auditoria (Audit Log)
Registra todas as ações dos usuários no sistema para fins de conformidade e segurança.
"""

from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils import timezone
import json


class AuditLog(models.Model):
    """
    Registra todas as ações dos usuários no sistema.
    
    Informações capturadas:
    - Quem fez (usuário, escritório)
    - O quê fez (ação: CREATE, UPDATE, DELETE, VIEW)
    - Quando fez (timestamp)
    - Onde fez (modelo, objeto_id, endpoint)
    - Como fez (método HTTP, IP)
    - Detalhes (dados antigos vs novos)
    """
    
    ACAO_CHOICES = (
        ('CREATE', 'Criação'),
        ('UPDATE', 'Atualização'),
        ('DELETE', 'Exclusão'),
        ('VIEW', 'Visualização'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('EXPORT', 'Exportação'),
        ('IMPORT', 'Importação'),
    )
    
    # Quem fez
    usuario = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs',
        verbose_name='Usuário'
    )
    usuario_nome = models.CharField(
        max_length=255,
        verbose_name='Nome do Usuário',
        help_text='Nome do usuário no momento da ação (para histórico)'
    )
    escritorio_id = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='ID do Escritório',
        help_text='ID do escritório no momento da ação'
    )
    escritorio_nome = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Nome do Escritório',
        help_text='Nome do escritório no momento da ação'
    )
    
    # O quê fez
    acao = models.CharField(
        max_length=20,
        choices=ACAO_CHOICES,
        verbose_name='Ação'
    )
    descricao = models.TextField(
        verbose_name='Descrição',
        help_text='Descrição da ação realizada'
    )
    
    # Quando fez
    timestamp = models.DateTimeField(
        default=timezone.now,
        db_index=True,
        verbose_name='Data/Hora'
    )
    
    # Onde fez (Objeto afetado)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Tipo de Objeto'
    )
    object_id = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name='ID do Objeto'
    )
    content_object = GenericForeignKey('content_type', 'object_id')
    
    objeto_repr = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Representação do Objeto',
        help_text='String representation do objeto no momento da ação'
    )
    modelo_nome = models.CharField(
        max_length=100,
        blank=True,
        db_index=True,
        verbose_name='Nome do Modelo',
        help_text='Nome do modelo afetado (Cliente, Consulta, etc.)'
    )
    
    # Como fez (Requisição HTTP)
    endpoint = models.CharField(
        max_length=500,
        blank=True,
        verbose_name='Endpoint',
        help_text='URL do endpoint acessado'
    )
    metodo_http = models.CharField(
        max_length=10,
        blank=True,
        verbose_name='Método HTTP',
        help_text='GET, POST, PUT, PATCH, DELETE'
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='Endereço IP'
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name='User Agent',
        help_text='Navegador/cliente utilizado'
    )
    
    # Detalhes da ação
    dados_antigos = models.JSONField(
        null=True,
        blank=True,
        verbose_name='Dados Antigos',
        help_text='Estado anterior do objeto (para UPDATE e DELETE)'
    )
    dados_novos = models.JSONField(
        null=True,
        blank=True,
        verbose_name='Dados Novos',
        help_text='Estado novo do objeto (para CREATE e UPDATE)'
    )
    campos_alterados = models.JSONField(
        null=True,
        blank=True,
        verbose_name='Campos Alterados',
        help_text='Lista de campos que foram modificados'
    )
    
    # Metadados adicionais
    sucesso = models.BooleanField(
        default=True,
        verbose_name='Sucesso',
        help_text='Se a ação foi executada com sucesso'
    )
    erro_mensagem = models.TextField(
        blank=True,
        verbose_name='Mensagem de Erro',
        help_text='Mensagem de erro se a ação falhou'
    )
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Log de Auditoria'
        verbose_name_plural = 'Logs de Auditoria'
        indexes = [
            models.Index(fields=['-timestamp', 'escritorio_id']),
            models.Index(fields=['usuario', '-timestamp']),
            models.Index(fields=['acao', '-timestamp']),
            models.Index(fields=['modelo_nome', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')} - {self.usuario_nome} - {self.get_acao_display()}"
    
    @classmethod
    def criar_log(cls, usuario, acao, descricao, **kwargs):
        """
        Método auxiliar para criar logs de auditoria.
        
        Uso:
            AuditLog.criar_log(
                usuario=request.user,
                acao='CREATE',
                descricao='Cliente criado',
                objeto=cliente,
                endpoint=request.path,
                metodo_http=request.method,
                ip_address=get_client_ip(request)
            )
        """
        log_data = {
            'usuario': usuario,
            'usuario_nome': usuario.get_full_name() or usuario.username,
            'acao': acao,
            'descricao': descricao,
        }
        
        # Adiciona dados do escritório se disponível
        if hasattr(usuario, 'perfil') and usuario.perfil and usuario.perfil.escritorio:
            log_data['escritorio_id'] = usuario.perfil.escritorio.id
            log_data['escritorio_nome'] = usuario.perfil.escritorio.nome
        
        # Adiciona dados opcionais
        if 'objeto' in kwargs:
            obj = kwargs.pop('objeto')
            if obj:  # ✅ Verifica se objeto não é None
                log_data['content_object'] = obj
                log_data['objeto_repr'] = str(obj)
                log_data['modelo_nome'] = obj.__class__.__name__
        
        # Merge com kwargs restantes
        log_data.update(kwargs)
        
        return cls.objects.create(**log_data)
    
    def get_diferenca_campos(self):
        """
        Retorna uma lista amigável das diferenças entre dados antigos e novos.
        """
        if not self.dados_antigos or not self.dados_novos:
            return []
        
        diferencas = []
        for campo in self.campos_alterados or []:
            valor_antigo = self.dados_antigos.get(campo, 'N/A')
            valor_novo = self.dados_novos.get(campo, 'N/A')
            diferencas.append({
                'campo': campo,
                'antes': valor_antigo,
                'depois': valor_novo
            })
        
        return diferencas


class AuditLogRetencao(models.Model):
    """
    Configuração de retenção de logs por escritório.
    Define por quanto tempo os logs devem ser mantidos.
    """
    
    escritorio = models.OneToOneField(
        'Escritorio',
        on_delete=models.CASCADE,
        related_name='config_auditoria',
        verbose_name='Escritório'
    )
    dias_retencao = models.PositiveIntegerField(
        default=365,
        verbose_name='Dias de Retenção',
        help_text='Número de dias que os logs devem ser mantidos (padrão: 1 ano)'
    )
    habilitar_log_leitura = models.BooleanField(
        default=False,
        verbose_name='Habilitar Log de Leitura',
        help_text='Se deve registrar operações de VIEW (pode gerar muitos logs)'
    )
    habilitar_exportacao_automatica = models.BooleanField(
        default=False,
        verbose_name='Exportação Automática',
        help_text='Se deve exportar logs antigos antes de excluir'
    )
    
    class Meta:
        verbose_name = 'Configuração de Retenção'
        verbose_name_plural = 'Configurações de Retenção'
    
    def __str__(self):
        return f"Retenção {self.escritorio.nome} - {self.dias_retencao} dias"
