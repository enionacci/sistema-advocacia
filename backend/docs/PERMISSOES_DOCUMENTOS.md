# Permissões e Auditoria do Sistema de Documentos

## Data de Implementação
**Data:** Outubro 2025  
**Status:** ✅ Completo

---

## 🔐 Permissões Implementadas

### Novas Permissões Adicionadas

#### **Documentos (7 permissões)**

1. **`ver_documento`**
   - **Nome:** Ver Documento
   - **Descrição:** Permite visualizar documentos
   - **Categoria:** Documentos
   - **Usado em:** GET (list, retrieve)

2. **`criar_documento`**
   - **Nome:** Criar Documento
   - **Descrição:** Permite fazer upload de novos documentos
   - **Categoria:** Documentos
   - **Usado em:** POST (create)

3. **`editar_documento`**
   - **Nome:** Editar Documento
   - **Descrição:** Permite editar metadados de documentos existentes
   - **Categoria:** Documentos
   - **Usado em:** PUT/PATCH (update)

4. **`deletar_documento`**
   - **Nome:** Deletar Documento
   - **Descrição:** Permite remover documentos do sistema
   - **Categoria:** Documentos
   - **Usado em:** DELETE (destroy)

5. **`download_documento`**
   - **Nome:** Download de Documento
   - **Descrição:** Permite fazer download de documentos
   - **Categoria:** Documentos
   - **Usado em:** GET /api/documentos/{id}/download/

6. **`gerenciar_categorias`**
   - **Nome:** Gerenciar Categorias
   - **Descrição:** Permite criar, editar e deletar categorias de documentos
   - **Categoria:** Documentos
   - **Usado em:** POST/PUT/PATCH/DELETE em /api/documentos/categorias/

7. **`gerenciar_tags`**
   - **Nome:** Gerenciar Tags
   - **Descrição:** Permite criar, editar e deletar tags de documentos
   - **Categoria:** Documentos
   - **Usado em:** POST/PUT/PATCH/DELETE em /api/documentos/tags/

---

## 👥 Permissões por Papel

### **Administrador**
✅ Todas as permissões (7/7)
- ver_documento
- criar_documento
- editar_documento
- deletar_documento
- download_documento
- gerenciar_categorias
- gerenciar_tags

### **Advogado**
✅ 5 permissões
- ver_documento
- criar_documento
- editar_documento
- deletar_documento
- download_documento

❌ Não tem:
- gerenciar_categorias
- gerenciar_tags

### **Secretária**
✅ 4 permissões
- ver_documento
- criar_documento
- editar_documento
- download_documento

❌ Não tem:
- deletar_documento
- gerenciar_categorias
- gerenciar_tags

### **Assistente**
✅ 2 permissões
- ver_documento
- download_documento

❌ Não tem:
- criar_documento
- editar_documento
- deletar_documento
- gerenciar_categorias
- gerenciar_tags

### **Financeiro**
❌ Nenhuma permissão de documentos

---

## 🔧 Classes de Permissão Implementadas

### 1. **DocumentoPermission** (`documentos/permissions.py`)

Controla acesso aos endpoints de documentos:

```python
permission_classes = [DocumentoPermission]
```

**Mapeamento de Actions:**
- `list` → requer `ver_documento`
- `retrieve` → requer `ver_documento`
- `create` → requer `criar_documento`
- `update/partial_update` → requer `editar_documento`
- `destroy` → requer `deletar_documento`
- `download` → requer `download_documento`
- `incrementar_visualizacao` → requer `ver_documento`
- `estatisticas` → requer `ver_documento`

### 2. **CategoriaPermission** (`documentos/permissions.py`)

Controla acesso às categorias:

```python
permission_classes = [CategoriaPermission]
```

**Regras:**
- GET → requer `ver_documento` (qualquer um pode ver categorias)
- POST/PUT/PATCH/DELETE → requer `gerenciar_categorias`

### 3. **TagPermission** (`documentos/permissions.py`)

Controla acesso às tags:

```python
permission_classes = [TagPermission]
```

**Regras:**
- GET → requer `ver_documento` (qualquer um pode ver tags)
- POST/PUT/PATCH/DELETE → requer `gerenciar_tags`

---

## 📊 Auditoria Implementada

### O que é auditado?

O `AuditMiddleware` registra automaticamente:

#### **Ações Capturadas:**
- ✅ **CREATE (POST)** - Upload de documentos
- ✅ **UPDATE (PUT/PATCH)** - Edição de metadados
- ✅ **DELETE** - Remoção (soft delete)
- ❌ **VIEW (GET)** - Apenas se habilitado no escritório

#### **Informações Registradas:**

1. **Dados Básicos:**
   - Usuário que realizou a ação
   - Data/hora
   - IP do cliente
   - User-Agent
   - Endpoint acessado
   - Método HTTP

2. **Dados do Objeto:**
   - Tipo de objeto (Documento, Categoria, Tag)
   - ID do objeto
   - Referência ao objeto

3. **Mudanças (UPDATE):**
   - Dados antigos (snapshot antes da edição)
   - Dados novos (snapshot depois da edição)
   - Lista de campos alterados

4. **Descrição Amigável:**
   - "criou Documento: Contrato de Prestação de Serviços.pdf"
   - "editou Documento: Procuração - João Silva.pdf"
   - "excluiu Categoria: Documentos Antigos"

### Mapeamento de Endpoints

O middleware foi atualizado para reconhecer:

```python
model_mapping = {
    'documento': 'documentos.Documento',
    'categoria': 'documentos.Categoria',
    'tag': 'documentos.Tag',
}
```

### Exemplos de Logs Gerados

#### Upload de Documento
```
Ação: CREATE
Descrição: criou Documento: Contrato_2024.pdf
Endpoint: /api/documentos/
Dados Novos: {
  "id": 42,
  "titulo": "Contrato de Prestação de Serviços",
  "categoria": "Contratos",
  "cliente": "João Silva",
  "tamanho": 1024000,
  ...
}
```

#### Edição de Documento
```
Ação: UPDATE
Descrição: editou Documento: Contrato_2024.pdf
Endpoint: /api/documentos/42/
Campos Alterados: ["titulo", "categoria", "confidencial"]
Dados Antigos: {"titulo": "Contrato", "categoria": "Outros", "confidencial": false}
Dados Novos: {"titulo": "Contrato de Prestação", "categoria": "Contratos", "confidencial": true}
```

#### Download de Documento
```
Ação: VIEW (se habilitado)
Descrição: fez download de Documento: Contrato_2024.pdf
Endpoint: /api/documentos/42/download/
```

#### Exclusão de Documento
```
Ação: DELETE
Descrição: excluiu Documento: Contrato_2024.pdf
Endpoint: /api/documentos/42/
Dados Antigos: {...}
```

---

## 🚀 Comandos Implementados

### 1. Sincronizar Permissões

```bash
python manage.py shell -c "from escritorios.permissions_registry import PermissionsRegistry; PermissionsRegistry.sync_to_database()"
```

**O que faz:**
- Cria as 7 novas permissões no banco
- Atualiza nomes se mudaram
- Identifica permissões obsoletas

**Resultado:**
```
✅ Permissão criada: ver_documento - Ver Documento
✅ Permissão criada: criar_documento - Criar Documento
...
📊 Resumo da sincronização:
   - Permissões criadas: 7
   - Total no registro: 33
```

### 2. Atualizar Papéis Existentes

```bash
python manage.py atualizar_permissoes_papeis
```

**O que faz:**
- Adiciona permissões de documentos aos papéis existentes
- Respeita a hierarquia de permissões por papel
- Não remove permissões existentes

**Resultado:**
```
🔧 Atualizando papel: Administrador (Escritório: Nacci Advocacia)
  ✅ Adicionada: criar_documento
  ✅ Adicionada: deletar_documento
  ...
  ✓ 7 permissões adicionadas ao papel "Administrador"
```

---

## 🔍 Como Verificar Permissões

### No Django Shell

```python
# Verificar permissões de um usuário
from django.contrib.auth.models import User
user = User.objects.get(username='seu_usuario')
perfil = user.perfil

# Checar permissão específica
perfil.tem_permissao('criar_documento')  # True/False

# Listar todas as permissões
perfil.papel.permissoes.values_list('codename', 'nome')

# Verificar permissões de documentos
perfil.papel.permissoes.filter(codename__contains='documento')
```

### Na API

**Testar acesso:**
```bash
# Como Administrador - deve funcionar
GET /api/documentos/
POST /api/documentos/ (upload)
DELETE /api/documentos/42/

# Como Assistente - deve falhar
POST /api/documentos/ → 403 Forbidden
DELETE /api/documentos/42/ → 403 Forbidden
```

---

## 📝 Visualizar Logs de Auditoria

### Via Admin
1. Acesse `/admin/`
2. Vá em "Escritorios" > "Audit Logs"
3. Filtre por:
   - Ação: CREATE, UPDATE, DELETE
   - Usuário
   - Data
   - Endpoint: `/api/documentos/`

### Via API
```bash
GET /api/audit-logs/?endpoint__contains=documentos
GET /api/audit-logs/?acao=CREATE&usuario=5
GET /api/audit-logs/?data_inicio=2024-12-01&data_fim=2024-12-31
```

### Via Django Shell
```python
from escritorios.audit_models import AuditLog

# Logs de documentos
AuditLog.objects.filter(endpoint__contains='/api/documentos/')

# Uploads recentes
AuditLog.objects.filter(
    acao='CREATE',
    endpoint__startswith='/api/documentos/'
).order_by('-data_hora')[:10]

# Quem deletou documentos?
AuditLog.objects.filter(
    acao='DELETE',
    endpoint__contains='/api/documentos/'
).values('usuario__username', 'descricao', 'data_hora')
```

---

## ⚠️ Importante

### Permissões são obrigatórias
- ✅ Usuários **devem** ter as permissões adequadas
- ❌ Não é mais suficiente estar autenticado
- 🔒 A API retorna **403 Forbidden** se não tiver permissão

### Auditoria é automática
- ✅ Não precisa código extra nas views
- ✅ Middleware captura tudo automaticamente
- ⚙️ Pode ser desabilitado por escritório (se necessário)

### Soft Delete
- ✅ Documentos deletados ficam com `ativo=False`
- ✅ Continuam sendo auditados
- ✅ Podem ser recuperados por admins

---

## 🧪 Como Testar

### 1. Criar usuário de teste
```python
from django.contrib.auth.models import User
from escritorios.models import Perfil, Papel

# Cria usuário
user = User.objects.create_user('teste', 'teste@email.com', 'senha123')

# Busca papel Assistente
papel = Papel.objects.get(nome='Assistente', escritorio_id=1)

# Cria perfil
perfil = Perfil.objects.create(user=user, escritorio_id=1, papel=papel)
```

### 2. Testar na API
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "teste", "password": "senha123"}'

# Tentar criar documento (deve falhar - Assistente não pode criar)
curl -X POST http://localhost:8000/api/documentos/ \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "arquivo=@documento.pdf"

# Ver documentos (deve funcionar - Assistente pode ver)
curl http://localhost:8000/api/documentos/ \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 3. Verificar logs
```python
from escritorios.audit_models import AuditLog

# Ver tentativa de criar documento
AuditLog.objects.filter(usuario__username='teste').order_by('-data_hora').first()
```

---

## 📚 Arquivos Modificados

### Backend
- ✅ `escritorios/permissions_registry.py` - Adicionadas 7 permissões
- ✅ `escritorios/audit_middleware.py` - Mapeamento de documentos
- ✅ `documentos/permissions.py` - **NOVO** - Classes de permissão
- ✅ `documentos/views.py` - Aplicadas permissões nas ViewSets
- ✅ `documentos/management/commands/atualizar_permissoes_papeis.py` - **NOVO**

### Banco de Dados
- ✅ 7 novas permissões criadas
- ✅ Permissões atribuídas aos papéis existentes
- ✅ Logs de auditoria capturam ações de documentos

---

## ✅ Checklist de Implementação

- [x] Definir permissões no `permissions_registry.py`
- [x] Criar classes de permissão personalizadas
- [x] Aplicar permissões nas ViewSets
- [x] Sincronizar permissões com banco de dados
- [x] Atualizar papéis existentes
- [x] Configurar mapeamento no middleware de auditoria
- [x] Testar permissões (Administrador, Advogado, Assistente)
- [x] Verificar logs de auditoria
- [x] Documentar sistema

---

## 🎯 Resultado Final

### Antes
- ❌ Qualquer usuário autenticado podia fazer upload
- ❌ Qualquer usuário podia deletar documentos
- ❌ Não havia controle de quem gerencia categorias/tags
- ❌ Ações de documentos não eram auditadas

### Depois
- ✅ Apenas usuários com permissão podem fazer upload
- ✅ Apenas Administradores e Advogados podem deletar
- ✅ Gerenciamento de categorias/tags é restrito
- ✅ Todas as ações são automaticamente auditadas
- ✅ Sistema totalmente integrado com papéis existentes

---

**Implementado em:** Outubro 2025  
**Status:** ✅ Produção Ready  
**Auditoria:** ✅ Completa  
**Permissões:** ✅ Granulares  
**Segurança:** 🔒 Alta
