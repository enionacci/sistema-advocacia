#!/usr/bin/env python
import os, sys, django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from escritorios.models import Permissao

User = get_user_model()

print("\n" + "="*70)
print("VERIFICAÇÃO COMPLETA DE PERMISSÕES - USUÁRIO ENIO")
print("="*70)

# Buscar usuário Enio
user = User.objects.filter(username='Enio').first()
if not user:
    print("❌ Usuário 'Enio' não encontrado!")
    print("\nUsuários disponíveis:")
    for u in User.objects.all():
        print(f"  - {u.username} (ID: {u.id})")
    sys.exit(1)

print(f"\n✅ Usuário encontrado: {user.username}")
print(f"   Email: {user.email}")
print(f"   Superuser: {user.is_superuser}")

# Verificar perfil
if not hasattr(user, 'perfil') or not user.perfil:
    print("\n❌ PROBLEMA: Usuário não tem perfil!")
    sys.exit(1)

print(f"\n✅ Perfil existe")
print(f"   Escritório: {user.perfil.escritorio.nome if user.perfil.escritorio else 'SEM ESCRITÓRIO'}")

# Verificar papéis
papeis = user.perfil.papeis.all()
print(f"\n📋 Papéis atribuídos: {papeis.count()}")

if papeis.count() == 0:
    print("   ❌ PROBLEMA: Usuário não tem nenhum papel atribuído!")
    print("\n💡 SOLUÇÃO:")
    print("   1. Acesse o Django Admin: http://localhost:8000/admin/")
    print("   2. Vá em 'Perfis de Usuário' ou 'Papéis'")
    print("   3. Atribua um papel ao usuário Enio")
    sys.exit(1)

for papel in papeis:
    print(f"\n   📌 Papel: {papel.nome}")
    perms = list(papel.permissoes.values_list('codename', flat=True))
    print(f"      Permissões: {len(perms)} no total")
    
    # Verificar permissões específicas do Scanner
    scanner_perms = ['escanear_documento', 'solicitar_analise_ia', 'ver_analise_ia']
    print(f"\n      Permissões do Scanner & IA:")
    for perm in scanner_perms:
        has_it = perm in perms
        status = "✅" if has_it else "❌"
        print(f"         {status} {perm}")
    
    if not any(p in perms for p in scanner_perms):
        print(f"\n      ⚠️ Este papel NÃO TEM nenhuma permissão do Scanner & IA")
        print(f"\n      💡 SOLUÇÃO: Adicionar permissões ao papel '{papel.nome}':")
        print(f"         from escritorios.models import Papel, Permissao")
        print(f"         papel = Papel.objects.get(id={papel.id})")
        for perm in scanner_perms:
            print(f"         papel.permissoes.add(Permissao.objects.get(codename='{perm}'))")

print("\n" + "="*70)
