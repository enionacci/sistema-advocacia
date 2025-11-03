#!/usr/bin/env python
"""Script para verificar e atualizar permissões do papel Secretária"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from escritorios.models import Papel, Permissao
from escritorios.permissions_registry import PermissionsRegistry

# Busca o papel Secretária
secretaria = Papel.objects.filter(nome='Secretária').first()

if secretaria:
    print(f"\n📋 Papel: {secretaria.nome}")
    print(f"📝 Permissões atuais:")
    for perm in secretaria.permissoes.all():
        print(f"   - {perm.codename}: {perm.nome}")
    
    # Permissões que a secretária DEVERIA ter segundo o registry
    permissoes_esperadas = PermissionsRegistry.get_default_role_permissions()['Secretária']
    
    print(f"\n✅ Permissões esperadas segundo o registry:")
    for codename in permissoes_esperadas:
        print(f"   - {codename}")
    
    # Verifica quais permissões estão faltando
    permissoes_atuais = set(secretaria.permissoes.values_list('codename', flat=True))
    faltando = set(permissoes_esperadas) - permissoes_atuais
    
    if faltando:
        print(f"\n⚠️  Permissões FALTANDO:")
        for codename in faltando:
            print(f"   - {codename}")
        
        resposta = input("\nDeseja adicionar as permissões faltantes? (s/n): ")
        if resposta.lower() == 's':
            for codename in faltando:
                try:
                    perm = Permissao.objects.get(codename=codename)
                    secretaria.permissoes.add(perm)
                    print(f"✅ Adicionada: {codename}")
                except Permissao.DoesNotExist:
                    print(f"❌ Permissão não encontrada: {codename}")
            
            print("\n✅ Permissões atualizadas com sucesso!")
    else:
        print("\n✅ Todas as permissões estão corretas!")
else:
    print("❌ Papel 'Secretária' não encontrado!")
