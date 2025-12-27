# consultas/models.py
from django.db import models
from clientes.models import Cliente # Importamos o modelo Cliente

class Consulta(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='consultas')
    audio_file = models.FileField(upload_to='audio_consultas/')
    transcricao = models.TextField(blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.cliente:
            return f"Consulta para {self.cliente.nome_completo} em {self.data_criacao.strftime('%d/%m/%Y')}"
        return f"Consulta em {self.data_criacao.strftime('%d/%m/%Y')}"

    def delete(self, *args, **kwargs):
        # Primeiro, exclui o arquivo de áudio do armazenamento.
        if self.audio_file:
            self.audio_file.delete(save=False)
        # Em seguida, chama o método delete original para remover o registro do banco de dados.
        super().delete(*args, **kwargs)