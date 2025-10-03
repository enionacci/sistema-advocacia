from django.db import models
from escritorios.models import Escritorio

class Cliente(models.Model):
    # Relacionamento
    escritorio = models.ForeignKey(Escritorio, on_delete=models.CASCADE, related_name='clientes')

    # --- Dados Pessoais Básicos ---
    nome_completo = models.CharField(max_length=255, verbose_name="Nome Completo", help_text="Para Pessoa Física")
    cpf = models.CharField(max_length=14, unique=True, blank=True, null=True, verbose_name="CPF")
    cnpj = models.CharField(max_length=18, unique=True, blank=True, null=True, verbose_name="CNPJ")
    rg = models.CharField(max_length=20, blank=True, null=True, verbose_name="RG")
    data_nascimento = models.DateField(blank=True, null=True, verbose_name="Data de Nascimento")
    estado_civil = models.CharField(max_length=50, blank=True, null=True, verbose_name="Estado Civil")
    profissao = models.CharField(max_length=100, blank=True, null=True, verbose_name="Profissão/Ocupação")
    razao_social = models.CharField(max_length=255, blank=True, null=True, verbose_name="Razão Social (PJ)")
    nome_fantasia = models.CharField(max_length=255, blank=True, null=True, verbose_name="Nome Fantasia (PJ)")

    # --- Informações de Contato ---
    logradouro = models.CharField(max_length=255, blank=True, null=True, verbose_name="Logradouro")
    numero = models.CharField(max_length=20, blank=True, null=True, verbose_name="Número")
    complemento = models.CharField(max_length=100, blank=True, null=True, verbose_name="Complemento")
    bairro = models.CharField(max_length=100, blank=True, null=True, verbose_name="Bairro")
    cidade = models.CharField(max_length=100, blank=True, null=True, verbose_name="Cidade")
    estado = models.CharField(max_length=2, blank=True, null=True, verbose_name="Estado (UF)")
    cep = models.CharField(max_length=9, blank=True, null=True, verbose_name="CEP")
    
    telefone_celular = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefone Celular")
    telefone_fixo = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefone Fixo")
    email = models.EmailField(max_length=255, unique=True, verbose_name="E-mail Principal")
    email_alternativo = models.EmailField(max_length=255, blank=True, null=True, verbose_name="E-mail Alternativo")
    preferencia_contato = models.CharField(max_length=50, blank=True, null=True, verbose_name="Preferência de Contato")

    # --- Dados Específicos da Advocacia ---
    como_chegou = models.CharField(max_length=255, blank=True, null=True, verbose_name="Como Chegou ao Escritório")
    area_interesse = models.CharField(max_length=100, blank=True, null=True, verbose_name="Área Jurídica de Interesse")
    advogado_responsavel = models.CharField(max_length=255, blank=True, null=True, verbose_name="Advogado Responsável")
    data_primeiro_atendimento = models.DateField(blank=True, null=True, verbose_name="Data do Primeiro Atendimento")
    outros_advogados = models.TextField(blank=True, null=True, verbose_name="Outros Advogados que já o Representaram")
    historico_relacionamento = models.TextField(blank=True, null=True, verbose_name="Histórico de Relacionamento")

    # --- Dados Familiares Relevantes ---
    nome_conjuge = models.CharField(max_length=255, blank=True, null=True, verbose_name="Nome do Cônjuge")
    regime_bens = models.CharField(max_length=50, blank=True, null=True, verbose_name="Regime de Bens")
    representante_legal = models.CharField(max_length=255, blank=True, null=True, verbose_name="Representante Legal")
    contato_emergencia = models.CharField(max_length=255, blank=True, null=True, verbose_name="Contato de Emergência")

    # --- Controle Administrativo ---
    data_cadastro = models.DateTimeField(auto_now_add=True, verbose_name="Data de Cadastro")
    ultima_atualizacao = models.DateTimeField(auto_now=True, verbose_name="Última Atualização")
    status_cliente = models.CharField(max_length=50, default='Ativo', verbose_name="Status do Cliente")
    observacoes = models.TextField(blank=True, null=True, verbose_name="Observações Gerais")
    restricoes = models.TextField(blank=True, null=True, verbose_name="Restrições Específicas")

    # Campos legados (mantidos por compatibilidade)
    telefone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefone (Legado)")
    endereco = models.CharField(max_length=255, blank=True, null=True, verbose_name="Endereço (Legado)")

    def __str__(self):
        return self.nome_completo or self.razao_social or str(self.id)