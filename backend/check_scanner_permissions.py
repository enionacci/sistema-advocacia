#!/usr/bin/env python
"""
Script para verificar permissões do Scanner & IA
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from escritorios.models import Papel, Permissao

User = get_user_model()

print("=" * 60)
print("VERIFICAÇÃO DE PERMISSÕES - SCANNER & IA")
print("=" * 60)

# Buscar permissões do Scanner & IA
perms_scanner = ['escanear_documento', 'solicitar_analise_ia', 'ver_analise_ia', 'editar_analise_ia', 'deletar_analise_ia']
print("\n📋 Permissões necessárias para Scanner & IA:")
for codename in perms_scanner:
    perm = Permissao.objects.filter(codename=codename).first()
    if perm:
        print(f"  ✅ {perm.codename} - {perm.nome}")
    else:
        print(f"  ❌ {codename} - NÃO ENCONTRADA")

# Buscar usuário normal (não superuser)
user = User.objects.filter(is_superuser=False).first()
if not user:
    print("\n⚠️ Nenhum usuário normal encontrado")
    sys.exit(1)

print(f"\n👤 Usuário: {user.username}")
print(f"   Email: {user.email}")

if not hasattr(user, 'perfil') or not user.perfil:
    print("   ❌ Usuário sem perfil!")
    sys.exit(1)

print(f"   Escritório: {user.perfil.escritorio.nome}")

if not user.perfil.papel:
    print("   ❌ Usuário sem papel atribuído!")
    sys.exit(1)

papel = user.perfil.papel
print(f"   Papel: {papel.nome}")

# Verificar permissões do papel
print(f"\n🔐 Permissões do papel '{papel.nome}':")
perms_papel = list(papel.permissoes.values_list('codename', flat=True))

for codename in perms_scanner:
    has_perm = codename in perms_papel
    status = "✅" if has_perm else "❌"
    print(f"   {status} {codename}")

# Mostrar solução se faltar permissões
missing_perms = [p for p in perms_scanner if p not in perms_papel]
if missing_perms:
    print(f"\n⚠️ FALTAM {len(missing_perms)} PERMISSÕES!")
    print("\n💡 SOLUÇÃO: Adicione as permissões ao papel via Django Admin ou execute:")
    print(f"\nfrom escritorios.models import Papel, Permissao")
    print(f"papel = Papel.objects.get(id={papel.id})")
    for codename in missing_perms:
        print(f"papel.permissoes.add(Permissao.objects.get(codename='{codename}'))")
    print(f"print('Permissões adicionadas!')")
else:
    print("\n✅ Todas as permissões estão atribuídas!")

print("\n" + "=" * 60)
