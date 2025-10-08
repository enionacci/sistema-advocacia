# escritorios/management/commands/sync_permissions.py
from django.core.management.base import BaseCommand
from escritorios.permissions_registry import PermissionsRegistry


class Command(BaseCommand):
    help = 'Sincroniza permissões do registro com o banco de dados'

    def add_arguments(self, parser):
        parser.add_argument(
            '--list',
            action='store_true',
            help='Lista todas as permissões registradas sem sincronizar',
        )
        parser.add_argument(
            '--by-category',
            action='store_true',
            help='Mostra permissões agrupadas por categoria',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\nSistema de Gerenciamento de Permissões\n'))
        self.stdout.write('=' * 60)
        
        if options['list']:
            self.list_permissions()
        elif options['by_category']:
            self.list_by_category()
        else:
            self.sync_permissions()

    def list_permissions(self):
        """Lista todas as permissões."""
        self.stdout.write('\nTodas as permissões registradas:\n')
        
        permissions = PermissionsRegistry.get_all_permissions()
        for i, perm in enumerate(permissions, 1):
            self.stdout.write(
                f"{i:3d}. [{perm.categoria:15s}] "
                f"{perm.codename:25s} - {perm.nome}"
            )
            if perm.descricao:
                self.stdout.write(f"      -> {perm.descricao}")
        
        self.stdout.write(f"\nTotal: {len(permissions)} permissões")

    def list_by_category(self):
        """Lista permissões agrupadas por categoria."""
        self.stdout.write('\nPermissões por Categoria:\n')
        
        by_category = PermissionsRegistry.get_permissions_by_category()
        
        for category, permissions in by_category.items():
            self.stdout.write(
                self.style.SUCCESS(f"\n> {category} ({len(permissions)} permissões)")
            )
            for perm in permissions:
                self.stdout.write(f"   - {perm.codename:25s} - {perm.nome}")
                if perm.descricao:
                    self.stdout.write(f"     {perm.descricao}")
        
        total = sum(len(perms) for perms in by_category.values())
        self.stdout.write(f"\nTotal: {total} permissões em {len(by_category)} categorias")

    def sync_permissions(self):
        """Sincroniza permissões com o banco de dados."""
        self.stdout.write('\nSincronizando permissões...\n')
        
        try:
            PermissionsRegistry.sync_to_database()
            self.stdout.write(
                self.style.SUCCESS('\nSincronização concluída com sucesso!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'\nErro ao sincronizar: {str(e)}')
            )
            raise
