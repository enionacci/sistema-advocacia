"""
Comando Django para criar tags padrão de documentos.

Este comando cria tags padrão em todos os escritórios existentes
para facilitar a organização de documentos.
"""

from django.core.management.base import BaseCommand
from escritorios.models import Escritorio
from documentos.models import Tag


class Command(BaseCommand):
    help = 'Cria tags padrão de documentos para todos os escritórios'

    def handle(self, *args, **options):
        # Tags padrão com cores
        tags_padrao = [
            {'nome': 'Urgente', 'cor': '#d32f2f'},  # vermelho
            {'nome': 'Importante', 'cor': '#f57c00'},  # laranja
            {'nome': 'Revisão', 'cor': '#fbc02d'},  # amarelo
            {'nome': 'Aprovado', 'cor': '#388e3c'},  # verde
            {'nome': 'Assinado', 'cor': '#00796b'},  # teal
            {'nome': 'Original', 'cor': '#1976d2'},  # azul
            {'nome': 'Cópia', 'cor': '#5e35b1'},  # roxo
            {'nome': 'Rascunho', 'cor': '#757575'},  # cinza
            {'nome': 'Arquivado', 'cor': '#546e7a'},  # azul cinza
            {'nome': 'Em Análise', 'cor': '#0288d1'},  # azul claro
        ]

        escritorios = Escritorio.objects.all()
        
        if not escritorios.exists():
            self.stdout.write(self.style.WARNING('Nenhum escritório encontrado.'))
            return

        total_criadas = 0
        total_existentes = 0

        for escritorio in escritorios:
            self.stdout.write(f'\nProcessando escritório: {escritorio.nome}')
            
            for tag_data in tags_padrao:
                tag, created = Tag.objects.get_or_create(
                    escritorio=escritorio,
                    nome=tag_data['nome'],
                    defaults={
                        'cor': tag_data['cor'],
                    }
                )
                
                if created:
                    total_criadas += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'  ✓ Tag criada: {tag.nome}')
                    )
                else:
                    total_existentes += 1
                    self.stdout.write(
                        self.style.WARNING(f'  - Tag já existe: {tag.nome}')
                    )

        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Comando concluído!\n'
                f'  Tags criadas: {total_criadas}\n'
                f'  Tags já existentes: {total_existentes}\n'
            )
        )
