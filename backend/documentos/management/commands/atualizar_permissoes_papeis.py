"""
Comando Django para atualizar permissões dos papéis existentes.

Este comando adiciona as novas permissões de documentos aos papéis
que já existem no sistema.
"""

from django.core.management.base import BaseCommand
from escritorios.models import Papel, Permissao
from escritorios.permissions_registry import PermissionsRegistry


class Command(BaseCommand):
    help = 'Atualiza permissões dos papéis existentes com permissões de documentos'

    def handle(self, *args, **options):
        # Obtém as permissões padrão por papel
        default_permissions = PermissionsRegistry.get_default_role_permissions()
        
        # Busca as permissões de documentos
        perms_documentos = Permissao.objects.filter(
            codename__in=[
                'ver_documento',
                'criar_documento',
                'editar_documento',
                'deletar_documento',
                'download_documento',
                'gerenciar_categorias',
                'gerenciar_tags',
            ]
        )
        
        if not perms_documentos.exists():
            self.stdout.write(
                self.style.ERROR('❌ Permissões de documentos não encontradas. Execute sync_to_database primeiro.')
            )
            return
        
        self.stdout.write(
            self.style.WARNING(f'\n📋 Permissões de documentos encontradas: {perms_documentos.count()}\n')
        )
        
        # Atualiza cada papel
        papeis = Papel.objects.all()
        
        if not papeis.exists():
            self.stdout.write(self.style.WARNING('Nenhum papel encontrado.'))
            return
        
        total_updated = 0
        
        for papel in papeis:
            self.stdout.write(f'\n🔧 Atualizando papel: {papel.nome} (Escritório: {papel.escritorio.nome})')
            
            # Obtém as permissões padrão para este tipo de papel
            papel_lower = papel.nome.lower()
            
            # Mapeia nomes comuns
            if 'administrador' in papel_lower or 'admin' in papel_lower:
                papel_tipo = 'Administrador'
            elif 'advogado' in papel_lower:
                papel_tipo = 'Advogado'
            elif 'secretária' in papel_lower or 'secretaria' in papel_lower:
                papel_tipo = 'Secretária'
            elif 'assistente' in papel_lower:
                papel_tipo = 'Assistente'
            elif 'financeiro' in papel_lower:
                papel_tipo = 'Financeiro'
            else:
                self.stdout.write(
                    self.style.WARNING(f'  ⚠️  Tipo de papel não reconhecido: {papel.nome}. Pulando...')
                )
                continue
            
            # Obtém as permissões padrão
            codenames_padrao = default_permissions.get(papel_tipo, [])
            
            # Filtra apenas as permissões de documentos que este papel deve ter
            codenames_docs = [
                'ver_documento',
                'criar_documento',
                'editar_documento',
                'deletar_documento',
                'download_documento',
                'gerenciar_categorias',
                'gerenciar_tags',
            ]
            
            codenames_para_adicionar = [c for c in codenames_docs if c in codenames_padrao]
            
            if not codenames_para_adicionar:
                self.stdout.write(
                    self.style.WARNING(f'  ℹ️  Nenhuma permissão de documento para adicionar')
                )
                continue
            
            # Adiciona as permissões
            perms_para_adicionar = perms_documentos.filter(codename__in=codenames_para_adicionar)
            
            added_count = 0
            for perm in perms_para_adicionar:
                if not papel.permissoes.filter(id=perm.id).exists():
                    papel.permissoes.add(perm)
                    added_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'  ✅ Adicionada: {perm.codename}')
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f'  - Já existe: {perm.codename}')
                    )
            
            if added_count > 0:
                total_updated += 1
                self.stdout.write(
                    self.style.SUCCESS(f'  ✓ {added_count} permissões adicionadas ao papel "{papel.nome}"')
                )
        
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Comando concluído!\n'
                f'  Papéis atualizados: {total_updated}\n'
                f'  Total de papéis: {papeis.count()}\n'
            )
        )
