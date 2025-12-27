#!/usr/bin/env python
"""Script para atualizar permissões de todos os papéis padrão"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from escritorios.models import Papel, Permissao, Escritorio
from escritorios.permissions_registry import PermissionsRegistry

def atualizar_papel(nome_papel):
    """Atualiza as permissões de um papel específico"""
    papel = Papel.objects.filter(nome=nome_papel).first()
    
    if not papel:
        print(f"⚠️  Papel '{nome_papel}' não encontrado. Será criado automaticamente.")
        return
    
    print(f"\n{'='*60}")
    print(f"📋 Papel: {papel.nome}")
    print(f"{'='*60}")
    
    # Permissões esperadas
    permissoes_esperadas = PermissionsRegistry.get_default_role_permissions().get(nome_papel, [])
    
    if not permissoes_esperadas:
        print(f"❌ Nenhuma permissão definida para '{nome_papel}' no registry")
        return
    
    # Permissões atuais
    permissoes_atuais = set(papel.permissoes.values_list('codename', flat=True))
    
    # Permissões faltando
    faltando = set(permissoes_esperadas) - permissoes_atuais
    
    # Permissões extras (que não deveriam estar)
    extras = permissoes_atuais - set(permissoes_esperadas)
    
    if faltando:
        print(f"\n✅ Adicionando {len(faltando)} permissões:")
        for codename in sorted(faltando):
            try:
                perm = Permissao.objects.get(codename=codename)
                papel.permissoes.add(perm)
                print(f"   + {codename}")
            except Permissao.DoesNotExist:
                print(f"   ❌ Permissão não encontrada: {codename}")
    
    if extras:
        print(f"\n⚠️  Removendo {len(extras)} permissões obsoletas:")
        for codename in sorted(extras):
            try:
                perm = Permissao.objects.get(codename=codename)
                papel.permissoes.remove(perm)
                print(f"   - {codename}")
            except Permissao.DoesNotExist:
                pass
    
    if not faltando and not extras:
        print(f"\n✅ Permissões já estão corretas ({len(permissoes_esperadas)} permissões)")

# Atualiza todos os papéis padrão
print("🔄 Atualizando permissões dos papéis padrão...\n")

papeis_padrao = ['Administrador', 'Advogado', 'Secretária', 'Assistente', 'Financeiro']

for nome_papel in papeis_padrao:
    atualizar_papel(nome_papel)

print(f"\n{'='*60}")
print("✅ Atualização concluída!")
print(f"{'='*60}\n")
