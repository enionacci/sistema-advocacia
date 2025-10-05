"""
App de Gerenciamento de Documentos

Permite upload, armazenamento e organização de documentos
vinculados a clientes do escritório.
"""

from django.apps import AppConfig


class DocumentosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'documentos'
    verbose_name = 'Gerenciamento de Documentos'
