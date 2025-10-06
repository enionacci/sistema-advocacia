#!/usr/bin/env python
import os, sys, django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("\n=== USUÁRIOS DO SISTEMA ===\n")
for u in User.objects.all():
    has_perfil = hasattr(u, 'perfil') and u.perfil is not None
    print(f"ID: {u.id} | Username: {u.username} | Email: {u.email}")
    print(f"   Superuser: {u.is_superuser} | Tem Perfil: {has_perfil}")
    if has_perfil:
        print(f"   Escritório: {u.perfil.escritorio.nome}")
        print(f"   Papel: {u.perfil.papel.nome if u.perfil.papel else 'SEM PAPEL'}")
    print()
