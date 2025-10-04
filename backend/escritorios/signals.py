# escritorios/signals.py
from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import PerfilUsuario


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Cria um PerfilUsuario para cada novo User criado."""
    if created:
        PerfilUsuario.objects.create(user=instance)


@receiver(post_migrate)
def sync_permissions_after_migrate(sender, **kwargs):
    """
    Sincroniza automaticamente as permissões após cada migrate.
    Garante que o banco sempre tenha as permissões mais atualizadas.
    """
    if sender.name == 'escritorios':
        from .permissions_registry import PermissionsRegistry
        print("\n🔄 Sincronizando permissões automaticamente...")
        try:
            PermissionsRegistry.sync_to_database()
        except Exception as e:
            print(f"⚠️  Aviso: Não foi possível sincronizar permissões: {e}")
