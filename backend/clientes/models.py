from django.db import models
from escritorios.models import Escritorio

class Cliente(models.Model):
    escritorio = models.ForeignKey(Escritorio, on_delete=models.CASCADE, related_name='clientes')
    # Dados Pessoais
    nome_completo = models.CharField(max_length=255, verbose_name="Nome Completo")
    cpf = models.CharField(max_length=14, unique=True, verbose_name="CPF")
    email = models.EmailField(max_length=255, unique=True, verbose_name="E-mail")
    telefone = models.CharField(max_length=20, blank=True, verbose_name="Telefone")

    # Endereço (pode ser melhorado depois, mas é um bom começo)
    endereco = models.CharField(max_length=255, blank=True, verbose_name="Endereço")

    # Metadados
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")

    # Campo para observações gerais
    observacoes = models.TextField(blank=True, verbose_name="Observações")

    def __str__(self):
        return self.nome_completo