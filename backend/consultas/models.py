# consultas/models.py
from django.db import models
from clientes.models import Cliente # Importamos o modelo Cliente

class Consulta(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='consultas')
    audio_file = models.FileField(upload_to='audio_consultas/')
    transcricao = models.TextField(blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consulta para {self.cliente.nome_completo} em {self.data_criacao.strftime('%d/%m/%Y')}"