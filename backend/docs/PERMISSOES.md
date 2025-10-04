# 🔐 Sistema de Permissões - Guia Completo

## 📋 Visão Geral

Sistema centralizado e escalável de gerenciamento de permissões baseado em papéis (RBAC).

---

## ✅ Como Adicionar Novas Permissões

### 1️⃣ **Adicione no Registry** (permissions_registry.py)

```python
# Adicione na categoria apropriada ou crie uma nova
PROCESSOS = [
    PermissionDefinition(
        codename='criar_peticao',      # Identificador único
        nome='Criar Petição',          # Nome amigável
        categoria='Processos',         # Categoria
        descricao='Permite criar petições'  # Descrição opcional
    ),
]
```

### 2️⃣ **Sincronize com o Banco**

```bash
# Automático: Roda após cada migrate
python manage.py migrate

# Ou manual:
python manage.py sync_permissions
```

### 3️⃣ **Use na View**

```python
# Opção 1: Permissão simples
class MinhaView(APIView):
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'criar_peticao'

# Opção 2: Múltiplas permissões (TODAS necessárias)
class MinhaView(APIView):
    permission_classes = [IsAuthenticated, HasPermission]
    required_permissions = ['ver_processo', 'criar_peticao']

# Opção 3: Permissão alternativa (QUALQUER uma)
class MinhaView(APIView):
    permission_classes = [IsAuthenticated, HasPermission]
    required_any_permission = ['editar_processo', 'criar_peticao']

# Opção 4: Usando decorador
class MinhaView(APIView):
    @require_permission('criar_peticao')
    def post(self, request):
        # código aqui
```

---

## 🎯 Comandos Disponíveis

### Listar todas as permissões
```bash
python manage.py sync_permissions --list
```

### Listar por categoria
```bash
python manage.py sync_permissions --by-category
```

### Sincronizar com banco de dados
```bash
python manage.py sync_permissions
```

---

## 📂 Estrutura de Categorias

### Clientes
- ver_cliente, criar_cliente, editar_cliente, deletar_cliente, exportar_clientes

### Consultas
- ver_consulta, criar_consulta, editar_consulta, deletar_consulta

### Análises
- ver_analise, criar_analise, editar_analise, deletar_analise

### Processos
- ver_processo, criar_processo, editar_processo, deletar_processo

### Financeiro
- ver_financeiro, criar_lancamento, editar_lancamento, deletar_lancamento

### Gerenciamento
- gerenciar_papeis, gerenciar_membros, gerenciar_escritorio, ver_relatorios

---

## 🚀 Exemplo Completo: Adicionando Módulo de Agenda

```python
# 1. Em permissions_registry.py
AGENDA = [
    PermissionDefinition(
        codename='ver_agenda',
        nome='Ver Agenda',
        categoria='Agenda',
        descricao='Permite visualizar compromissos'
    ),
    PermissionDefinition(
        codename='criar_compromisso',
        nome='Criar Compromisso',
        categoria='Agenda',
        descricao='Permite criar novos compromissos'
    ),
    PermissionDefinition(
        codename='editar_compromisso',
        nome='Editar Compromisso',
        categoria='Agenda',
        descricao='Permite editar compromissos'
    ),
]

# Adicione ao get_all_permissions()
@classmethod
def get_all_permissions(cls):
    return (
        cls.CLIENTES +
        cls.CONSULTAS +
        # ... outras categorias
        cls.AGENDA  # <-- Adicione aqui
    )

# Adicione ao get_permissions_by_category()
@classmethod
def get_permissions_by_category(cls):
    return {
        'Clientes': cls.CLIENTES,
        # ... outras categorias
        'Agenda': cls.AGENDA,  # <-- Adicione aqui
    }
```

```python
# 2. Em agenda/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from escritorios.permissions import HasPermission

class CompromissoListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, HasPermission]
    
    def check_permissions(self, request):
        if request.method == 'POST':
            self.required_permission = 'criar_compromisso'
        else:
            self.required_permission = 'ver_agenda'
        super().check_permissions(request)
```

```bash
# 3. Sincronize
python manage.py sync_permissions
```

**Pronto!** O sistema já está protegido e as permissões disponíveis para atribuição aos papéis.

---

## 🔍 Validação de Permissões

```python
from escritorios.permissions_registry import PermissionsRegistry

# Validar se existe
if PermissionsRegistry.validate_permission('criar_peticao'):
    print("Permissão existe!")

# Buscar informações
perm = PermissionsRegistry.get_permission_by_codename('criar_peticao')
print(f"{perm.nome} - {perm.descricao}")
```

---

## 🎭 Papéis Padrão

Ao criar um escritório, os seguintes papéis são criados automaticamente:

- **Administrador**: Todas as permissões
- **Advogado**: Permissões de trabalho completas
- **Secretária**: Permissões de suporte
- **Assistente**: Apenas visualização
- **Financeiro**: Gestão financeira

Edite em `permissions_registry.py` → `get_default_role_permissions()`

---

## ⚡ Benefícios

✅ **Centralizado**: Todas as permissões em um único arquivo  
✅ **Documentado**: Descrições claras de cada permissão  
✅ **Automático**: Sincronização após cada migrate  
✅ **Validado**: Sistema detecta permissões obsoletas  
✅ **Escalável**: Adicione quantas permissões precisar  
✅ **Tipado**: Suporte a IDE com dataclasses  
✅ **Auditável**: Fácil revisar todas as permissões  

---

## 🔧 Troubleshooting

### Permissão não aparece no frontend?
```bash
python manage.py sync_permissions
# Reinicie o servidor Django
```

### View retorna 403 Forbidden?
- Verifique se o `required_permission` está correto
- Confirme que o papel do usuário tem a permissão
- Use `python manage.py sync_permissions --list` para ver permissões disponíveis

### Permissão obsoleta?
Se uma permissão não está mais no registry, ela será identificada como obsoleta.
Você pode removê-la manualmente do admin ou deixá-la (não afeta o sistema).

---

## 📝 Checklist para Nova Funcionalidade

- [ ] Adicionar permissões no `permissions_registry.py`
- [ ] Adicionar categoria ao `get_all_permissions()`
- [ ] Adicionar categoria ao `get_permissions_by_category()`
- [ ] Rodar `python manage.py sync_permissions`
- [ ] Adicionar `permission_classes` e `required_permission` nas views
- [ ] Testar com usuário que NÃO tem a permissão
- [ ] Testar com usuário que TEM a permissão
- [ ] Documentar no README da funcionalidade

---

**Agora adicionar novas funcionalidades é MUITO mais fácil!** 🎉
