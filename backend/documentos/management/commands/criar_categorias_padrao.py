"""
Comando Django para criar categorias padrão de documentos.

Este comando cria categorias padrão em todos os escritórios existentes
para facilitar a organização de documentos.
"""

from django.core.management.base import BaseCommand
from escritorios.models import Escritorio
from documentos.models import Categoria


class Command(BaseCommand):
    help = 'Cria categorias padrão de documentos para todos os escritórios'

    def handle(self, *args, **options):
        # Categorias padrão com ícone Material-UI e cor
        categorias_padrao = [
            {
                'nome': 'Contratos',
                'icone': 'Description',
                'cor': '#1976d2',  # azul
                'ordem': 1,
            },
            {
                'nome': 'Procurações',
                'icone': 'Gavel',
                'cor': '#d32f2f',  # vermelho
                'ordem': 2,
            },
            {
                'nome': 'Petições',
                'icone': 'Article',
                'cor': '#7b1fa2',  # roxo
                'ordem': 3,
            },
            {
                'nome': 'Documentos Pessoais',
                'icone': 'Badge',
                'cor': '#388e3c',  # verde
                'ordem': 4,
            },
            {
                'nome': 'Decisões Judiciais',
                'icone': 'AccountBalance',
                'cor': '#f57c00',  # laranja
                'ordem': 5,
            },
            {
                'nome': 'Correspondências',
                'icone': 'Email',
                'cor': '#0288d1',  # azul claro
                'ordem': 6,
            },
            {
                'nome': 'Comprovantes',
                'icone': 'Receipt',
                'cor': '#5d4037',  # marrom
                'ordem': 7,
            },
            {
                'nome': 'Laudos e Perícias',
                'icone': 'Science',
                'cor': '#00796b',  # teal
                'ordem': 8,
            },
            {
                'nome': 'Fotos e Evidências',
                'icone': 'Photo',
                'cor': '#c2185b',  # rosa
                'ordem': 9,
            },
            {
                'nome': 'Outros',
                'icone': 'Folder',
                'cor': '#616161',  # cinza
                'ordem': 10,
            },
        ]

        escritorios = Escritorio.objects.all()
        
        if not escritorios.exists():
            self.stdout.write(self.style.WARNING('Nenhum escritório encontrado.'))
            return

        total_criadas = 0
        total_existentes = 0

        for escritorio in escritorios:
            self.stdout.write(f'\nProcessando escritório: {escritorio.nome}')
            
            for cat_data in categorias_padrao:
                categoria, created = Categoria.objects.get_or_create(
                    escritorio=escritorio,
                    nome=cat_data['nome'],
                    defaults={
                        'icone': cat_data['icone'],
                        'cor': cat_data['cor'],
                        'ordem': cat_data['ordem'],
                    }
                )
                
                if created:
                    total_criadas += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'  ✓ Categoria criada: {categoria.nome}')
                    )
                else:
                    total_existentes += 1
                    self.stdout.write(
                        self.style.WARNING(f'  - Categoria já existe: {categoria.nome}')
                    )

        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Comando concluído!\n'
                f'  Categorias criadas: {total_criadas}\n'
                f'  Categorias já existentes: {total_existentes}\n'
            )
        )
