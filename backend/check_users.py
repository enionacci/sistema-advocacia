#!/usr/bin/env python
"""Script para verificar usuários e escritórios"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from escritorios.models import PerfilUsuario, Escritorio

print("\n" + "="*60)
print("VERIFICAÇÃO DE USUÁRIOS E ESCRITÓRIOS")
print("="*60 + "\n")

# Listar todos os usuários
users = User.objects.all()
print(f"📊 Total de usuários: {users.count()}\n")

for user in users:
    print(f"👤 Usuário: {user.username} (ID: {user.id})")
    try:
        perfil = user.perfil
        if perfil.escritorio:
            print(f"   🏢 Escritório: {perfil.escritorio.nome} (ID: {perfil.escritorio.id})")
            print(f"   🖼️  Logo: {perfil.escritorio.logo if perfil.escritorio.logo else 'SEM LOGO'}")
        else:
            print(f"   ⚠️  SEM ESCRITÓRIO")
    except PerfilUsuario.DoesNotExist:
        print(f"   ❌ SEM PERFIL")
    print()

print("\n" + "="*60)
print("ESCRITÓRIOS CADASTRADOS")
print("="*60 + "\n")

escritorios = Escritorio.objects.all()
for esc in escritorios:
    print(f"🏢 ID: {esc.id} | Nome: {esc.nome}")
    print(f"   Logo: {esc.logo if esc.logo else 'SEM LOGO'}")
    print(f"   Membros: {esc.membros.count()}")
    print()
