# analises/models.py
from django.db import models
from consultas.models import Consulta

class AnaliseIA(models.Model):
    consulta = models.ForeignKey(Consulta, on_delete=models.CASCADE, related_name='analises')
    contexto = models.TextField(verbose_name="Contexto da Análise", help_text="O prompt ou contexto fornecido pelo usuário para a análise.")
    resultado = models.TextField(verbose_name="Resultado da Análise")
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")

    def __str__(self):
        return f"Análise para a consulta {self.consulta.id} em {self.data_criacao.strftime('%d/%m/%Y')}"

    class Meta:
        ordering = ['-data_criacao']