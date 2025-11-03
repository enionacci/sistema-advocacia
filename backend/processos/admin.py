from django.contrib import admin
from .models import Processo, Parte, Movimentacao, Prazo, Audiencia


@admin.register(Processo)
class ProcessoAdmin(admin.ModelAdmin):
    list_display = ['numero_processo', 'cliente_principal', 'tipo', 'status', 'tribunal', 'data_distribuicao']
    list_filter = ['tipo', 'status', 'uf', 'escritorio', 'sigilo']
    search_fields = ['numero_processo', 'cliente_principal__nome_completo', 'assunto', 'tribunal']
    date_hierarchy = 'data_distribuicao'
    readonly_fields = ['data_cadastro', 'ultima_atualizacao', 'usuario_cadastro']
    
    fieldsets = (
        ('Identificação', {
            'fields': ('numero_processo', 'numero_antigo', 'escritorio', 'cliente_principal')
        }),
        ('Classificação', {
            'fields': ('tipo', 'classe', 'assunto', 'assuntos_secundarios', 'posicao_cliente')
        }),
        ('Localização', {
            'fields': ('tribunal', 'comarca', 'vara', 'uf')
        }),
        ('Datas', {
            'fields': ('data_distribuicao', 'data_citacao', 'data_audiencia', 'data_sentenca', 'data_transito_julgado')
        }),
        ('Controle', {
            'fields': ('status', 'tipo_distribuicao', 'sigilo', 'ativo')
        }),
        ('Valores', {
            'fields': ('valor_causa', 'valor_condenacao', 'valor_acordo')
        }),
        ('Responsáveis', {
            'fields': ('advogado_responsavel', 'advogados_equipe')
        }),
        ('Observações', {
            'fields': ('resumo', 'estrategia_juridica', 'observacoes')
        }),
        ('Links', {
            'fields': ('link_consulta', 'processo_origem')
        }),
        ('Auditoria', {
            'fields': ('data_cadastro', 'ultima_atualizacao', 'usuario_cadastro')
        }),
    )


@admin.register(Parte)
class ParteAdmin(admin.ModelAdmin):
    list_display = ['nome', 'tipo_parte', 'tipo_pessoa', 'processo', 'cliente_vinculado', 'representado_escritorio']
    list_filter = ['tipo_parte', 'tipo_pessoa', 'representado_escritorio']
    search_fields = ['nome', 'cpf_cnpj', 'processo__numero_processo']


@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = ['processo', 'data_movimentacao', 'tipo', 'importante', 'lido', 'cadastrado_por']
    list_filter = ['tipo', 'importante', 'lido', 'gera_prazo']
    search_fields = ['processo__numero_processo', 'descricao']
    date_hierarchy = 'data_movimentacao'
    readonly_fields = ['data_cadastro', 'cadastrado_por']


@admin.register(Prazo)
class PrazoAdmin(admin.ModelAdmin):
    list_display = ['descricao', 'processo', 'data_limite', 'status', 'prioridade', 'responsavel']
    list_filter = ['status', 'prioridade', 'alerta_enviado']
    search_fields = ['descricao', 'processo__numero_processo']
    date_hierarchy = 'data_limite'


@admin.register(Audiencia)
class AudienciaAdmin(admin.ModelAdmin):
    list_display = ['processo', 'tipo', 'data_hora', 'status', 'local', 'cadastrado_por']
    list_filter = ['tipo', 'status', 'alertar']
    search_fields = ['processo__numero_processo', 'local', 'pauta']
    date_hierarchy = 'data_hora'
    readonly_fields = ['data_cadastro', 'cadastrado_por']
