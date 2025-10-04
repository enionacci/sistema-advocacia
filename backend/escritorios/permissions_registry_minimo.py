# escritorios/permissions_registry.py (VERSÃO MÍNIMA)
"""Sistema centralizado - apenas permissões atuais"""

from typing import Dict, List
from dataclasses import dataclass

@dataclass
class PermissionDefinition:
    codename: str
    nome: str
    categoria: str
    descricao: str = ""

class PermissionsRegistry:
    
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
    ]
    
    @classmethod
    def get_all_permissions(cls) -> List[PermissionDefinition]:
        return (
            cls.CLIENTES +
            cls.CONSULTAS +
            cls.ANALISES +
            cls.GERENCIAMENTO
        )
    
    @classmethod
    def get_permissions_by_category(cls) -> Dict[str, List[PermissionDefinition]]:
        return {
            'Clientes': cls.CLIENTES,
            'Consultas': cls.CONSULTAS,
            'Análises': cls.ANALISES,
            'Gerenciamento': cls.GERENCIAMENTO,
        }
    
    # ... resto dos métodos permanecem iguais
