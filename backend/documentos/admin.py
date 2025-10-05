"""
Admin para Documentos
"""

from django.contrib import admin
from .models import Categoria, Tag, Documento


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'escritorio', 'icone', 'cor', 'ordem', 'ativo', 'data_criacao']
    list_filter = ['escritorio', 'ativo']
    search_fields = ['nome', 'descricao']
    ordering = ['escritorio', 'ordem', 'nome']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['nome', 'escritorio', 'cor', 'data_criacao']
    list_filter = ['escritorio']
    search_fields = ['nome']
    ordering = ['escritorio', 'nome']


@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = [
        'titulo', 'cliente', 'categoria', 'tipo_arquivo',
        'tamanho', 'data_upload', 'usuario_upload', 'visualizacoes', 'downloads', 'ativo'
    ]
    list_filter = ['escritorio', 'categoria', 'tipo_arquivo', 'confidencial', 'ativo', 'data_upload']
    search_fields = ['titulo', 'descricao', 'nome_original', 'cliente__nome_completo']
    readonly_fields = [
        'hash_md5', 'nome_original', 'tipo_arquivo', 'tamanho',
        'data_upload', 'data_atualizacao', 'visualizacoes', 'downloads'
    ]
    ordering = ['-data_upload']
    date_hierarchy = 'data_upload'

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'descricao', 'cliente', 'categoria', 'tags')
        }),
        ('Arquivo', {
            'fields': ('arquivo', 'nome_original', 'tipo_arquivo', 'tamanho', 'hash_md5')
        }),
        ('Datas', {
            'fields': ('data_documento', 'data_upload', 'data_atualizacao')
        }),
        ('Controles', {
            'fields': ('confidencial', 'ativo', 'versao', 'documento_pai')
        }),
        ('Auditoria', {
            'fields': ('usuario_upload', 'visualizacoes', 'downloads')
        }),
        ('OCR', {
            'fields': ('texto_extraido',),
            'classes': ('collapse',)
        }),
    )
