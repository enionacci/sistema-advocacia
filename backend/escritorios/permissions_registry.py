# escritorios/permissions_registry.py
"""
Sistema centralizado de registro de permissões.
Todas as permissões do sistema devem ser declaradas aqui.
"""

from typing import Dict, List, Tuple
from dataclasses import dataclass


@dataclass
class PermissionDefinition:
    """Define uma permissão do sistema."""
    codename: str
    nome: str
    categoria: str
    descricao: str = ""


class PermissionsRegistry:
    """
    Registro centralizado de todas as permissões do sistema.
    
    Benefícios:
    1. Todas as permissões em um único lugar
    2. Fácil de auditar e documentar
    3. Auto-sincronização com banco de dados
    4. Categorização por módulo
    5. Validação automática
    """
    
    # ==================== CLIENTES ====================
    CLIENTES = [
        PermissionDefinition(
            codename='ver_cliente',
            nome='Ver Cliente',
            categoria='Clientes',
            descricao='Permite visualizar dados de clientes'
        ),
        PermissionDefinition(
            codename='criar_cliente',
            nome='Criar Cliente',
            categoria='Clientes',
            descricao='Permite criar novos clientes'
        ),
        PermissionDefinition(
            codename='editar_cliente',
            nome='Editar Cliente',
            categoria='Clientes',
            descricao='Permite editar dados de clientes existentes'
        ),
        PermissionDefinition(
            codename='deletar_cliente',
            nome='Deletar Cliente',
            categoria='Clientes',
            descricao='Permite remover clientes do sistema'
        ),
        PermissionDefinition(
            codename='exportar_clientes',
            nome='Exportar Clientes',
            categoria='Clientes',
            descricao='Permite exportar lista de clientes'
        ),
    ]
    
    # ==================== CONSULTAS ====================
    CONSULTAS = [
        PermissionDefinition(
            codename='ver_consulta',
            nome='Ver Consulta',
            categoria='Consultas',
            descricao='Permite visualizar consultas'
        ),
        PermissionDefinition(
            codename='criar_consulta',
            nome='Criar Consulta',
            categoria='Consultas',
            descricao='Permite criar novas consultas'
        ),
        PermissionDefinition(
            codename='editar_consulta',
            nome='Editar Consulta',
            categoria='Consultas',
            descricao='Permite editar consultas existentes'
        ),
        PermissionDefinition(
            codename='deletar_consulta',
            nome='Deletar Consulta',
            categoria='Consultas',
            descricao='Permite remover consultas'
        ),
    ]
    
    # ==================== ANÁLISES ====================
    ANALISES = [
        PermissionDefinition(
            codename='ver_analise',
            nome='Ver Análise',
            categoria='Análises',
            descricao='Permite visualizar análises jurídicas'
        ),
        PermissionDefinition(
            codename='criar_analise',
            nome='Criar Análise',
            categoria='Análises',
            descricao='Permite criar novas análises'
        ),
        PermissionDefinition(
            codename='editar_analise',
            nome='Editar Análise',
            categoria='Análises',
            descricao='Permite editar análises existentes'
        ),
        PermissionDefinition(
            codename='deletar_analise',
            nome='Deletar Análise',
            categoria='Análises',
            descricao='Permite remover análises'
        ),
    ]
    
    # ==================== GERENCIAMENTO ====================
    GERENCIAMENTO = [
        PermissionDefinition(
            codename='gerenciar_papeis',
            nome='Gerenciar Papéis',
            categoria='Gerenciamento',
            descricao='Permite criar, editar e deletar papéis e suas permissões'
        ),
        PermissionDefinition(
            codename='gerenciar_membros',
            nome='Gerenciar Membros',
            categoria='Gerenciamento',
            descricao='Permite convidar, remover e editar membros do escritório'
        ),
        PermissionDefinition(
            codename='gerenciar_escritorio',
            nome='Gerenciar Escritório',
            categoria='Gerenciamento',
            descricao='Permite editar dados do escritório'
        ),
        PermissionDefinition(
            codename='ver_relatorios',
            nome='Ver Relatórios',
            categoria='Gerenciamento',
            descricao='Permite visualizar relatórios e estatísticas'
        ),
    ]
    
    # ==================== FINANCEIRO ====================
    FINANCEIRO = [
        PermissionDefinition(
            codename='ver_financeiro',
            nome='Ver Financeiro',
            categoria='Financeiro',
            descricao='Permite visualizar dados financeiros'
        ),
        PermissionDefinition(
            codename='criar_lancamento',
            nome='Criar Lançamento',
            categoria='Financeiro',
            descricao='Permite criar lançamentos financeiros'
        ),
        PermissionDefinition(
            codename='editar_lancamento',
            nome='Editar Lançamento',
            categoria='Financeiro',
            descricao='Permite editar lançamentos financeiros'
        ),
        PermissionDefinition(
            codename='deletar_lancamento',
            nome='Deletar Lançamento',
            categoria='Financeiro',
            descricao='Permite remover lançamentos financeiros'
        ),
    ]
    
    # ==================== PROCESSOS ====================
    PROCESSOS = [
        PermissionDefinition(
            codename='ver_processo',
            nome='Ver Processo',
            categoria='Processos',
            descricao='Permite visualizar processos'
        ),
        PermissionDefinition(
            codename='criar_processo',
            nome='Criar Processo',
            categoria='Processos',
            descricao='Permite criar novos processos'
        ),
        PermissionDefinition(
            codename='editar_processo',
            nome='Editar Processo',
            categoria='Processos',
            descricao='Permite editar processos existentes'
        ),
        PermissionDefinition(
            codename='deletar_processo',
            nome='Deletar Processo',
            categoria='Processos',
            descricao='Permite remover processos'
        ),
    ]
    
    @classmethod
    def get_all_permissions(cls) -> List[PermissionDefinition]:
        """Retorna todas as permissões do sistema."""
        return (
            cls.CLIENTES +
            cls.CONSULTAS +
            cls.ANALISES +
            cls.GERENCIAMENTO +
            cls.FINANCEIRO +
            cls.PROCESSOS
        )
    
    @classmethod
    def get_permissions_by_category(cls) -> Dict[str, List[PermissionDefinition]]:
        """Retorna permissões agrupadas por categoria."""
        return {
            'Clientes': cls.CLIENTES,
            'Consultas': cls.CONSULTAS,
            'Análises': cls.ANALISES,
            'Gerenciamento': cls.GERENCIAMENTO,
            'Financeiro': cls.FINANCEIRO,
            'Processos': cls.PROCESSOS,
        }
    
    @classmethod
    def get_permission_by_codename(cls, codename: str) -> PermissionDefinition:
        """Busca uma permissão pelo codename."""
        for perm in cls.get_all_permissions():
            if perm.codename == codename:
                return perm
        raise ValueError(f"Permissão '{codename}' não encontrada no registro")
    
    @classmethod
    def validate_permission(cls, codename: str) -> bool:
        """Valida se uma permissão existe no registro."""
        try:
            cls.get_permission_by_codename(codename)
            return True
        except ValueError:
            return False
    
    @classmethod
    def sync_to_database(cls):
        """
        Sincroniza as permissões do registro com o banco de dados.
        Cria novas permissões e marca obsoletas como inativas.
        """
        from .models import Permissao
        
        all_permissions = cls.get_all_permissions()
        existing_codenames = set(Permissao.objects.values_list('codename', flat=True))
        registry_codenames = {perm.codename for perm in all_permissions}
        
        # Criar ou atualizar permissões
        created_count = 0
        updated_count = 0
        
        for perm_def in all_permissions:
            perm, created = Permissao.objects.get_or_create(
                codename=perm_def.codename,
                defaults={'nome': perm_def.nome}
            )
            
            if created:
                created_count += 1
                print(f"✅ Permissão criada: {perm_def.codename} - {perm_def.nome}")
            else:
                # Atualiza o nome se mudou
                if perm.nome != perm_def.nome:
                    perm.nome = perm_def.nome
                    perm.save()
                    updated_count += 1
                    print(f"🔄 Permissão atualizada: {perm_def.codename}")
        
        # Identificar permissões obsoletas
        obsolete_codenames = existing_codenames - registry_codenames
        if obsolete_codenames:
            print(f"\n⚠️  Permissões obsoletas encontradas (não estão no registro):")
            for codename in obsolete_codenames:
                print(f"   - {codename}")
        
        print(f"\n📊 Resumo da sincronização:")
        print(f"   - Permissões criadas: {created_count}")
        print(f"   - Permissões atualizadas: {updated_count}")
        print(f"   - Permissões obsoletas: {len(obsolete_codenames)}")
        print(f"   - Total no registro: {len(all_permissions)}")
    
    @classmethod
    def get_default_role_permissions(cls) -> Dict[str, List[str]]:
        """
        Define as permissões padrão para cada papel.
        Retorna um dicionário com nome do papel e lista de codenames.
        """
        return {
            'Administrador': [perm.codename for perm in cls.get_all_permissions()],
            'Advogado': [
                'ver_cliente', 'criar_cliente', 'editar_cliente',
                'ver_consulta', 'criar_consulta', 'editar_consulta',
                'ver_analise', 'criar_analise', 'editar_analise',
                'ver_processo', 'criar_processo', 'editar_processo',
                'ver_relatorios',
            ],
            'Secretária': [
                'ver_cliente', 'criar_cliente', 'editar_cliente',
                'ver_consulta', 'criar_consulta',
                'ver_processo', 'criar_processo',
            ],
            'Assistente': [
                'ver_cliente',
                'ver_consulta',
                'ver_processo',
            ],
            'Financeiro': [
                'ver_cliente',
                'ver_financeiro', 'criar_lancamento', 'editar_lancamento',
                'ver_relatorios',
            ],
        }


# Atalho para facilitar importação
PERMISSIONS = PermissionsRegistry
