# 🚀 Audit Log - Guia Rápido de Instalação

## ✅ Passo a Passo (5 minutos)

### **1. Importar Models no models.py principal**

```python
# escritorios/models.py
# Adicione no final do arquivo:

from .audit_models import AuditLog, AuditLogRetencao

__all__ = ['Escritorio', 'PerfilUsuario', 'Permissao', 'Papel', 'Convite', 'AuditLog', 'AuditLogRetencao']
```

### **2. Ativar Middleware**

```python
# config/settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    # ADICIONE ESTA LINHA (antes do SubscriptionCheckMiddleware)
    'escritorios.audit_middleware.AuditMiddleware',
    
    'escritorios.middleware.SubscriptionCheckMiddleware',
]
```

### **3. Registrar URLs**

```python
# config/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('api/', include('escritorios.urls')),
    path('api/clientes/', include('clientes.urls')),
    path('api/consultas/', include('consultas.urls')),
    path('api/analises/', include('analises.urls')),
    
    # ADICIONE ESTA LINHA
    path('api/audit-logs/', include('escritorios.audit_urls')),
]
```

### **4. Criar e Aplicar Migrations**

```bash
cd backend

# Criar migrations
python manage.py makemigrations

# Aplicar no banco
python manage.py migrate

# Sincronizar permissão 'ver_auditoria'
python manage.py sync_permissions
```

### **5. Verificar Instalação**

```bash
# Iniciar servidor
python manage.py runserver

# Testar endpoint (deve retornar 403 se não tiver permissão)
curl http://localhost:8000/api/audit-logs/
```

### **6. Dar Permissão ao Administrador**

A permissão `ver_auditoria` já foi criada e automaticamente atribuída ao papel **Administrador**.

Se precisar dar permissão manualmente:
1. Acesse http://localhost:3000/escritorio
2. Clique em "Gerenciar Papéis"
3. Edite o papel "Administrador"
4. Marque ☑ "Ver Auditoria"
5. Salvar

---

## 🧪 Testar Funcionamento

### **Teste 1: Criar um cliente**
```bash
# Faça login e crie um cliente via interface

# Verifique se log foi criado:
curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:8000/api/audit-logs/
```

**Resultado esperado:**
```json
{
  "results": [
    {
      "acao": "CREATE",
      "descricao": "criou Cliente: Nome do Cliente",
      "usuario_nome": "Seu Nome"
    }
  ]
}
```

### **Teste 2: Editar um cliente**
```bash
# Edite um cliente via interface

# Verifique se log capturou diferenças:
curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:8000/api/audit-logs/1/
```

**Resultado esperado:**
```json
{
  "acao": "UPDATE",
  "campos_alterados": ["email", "telefone"],
  "dados_antigos": {"email": "old@email.com"},
  "dados_novos": {"email": "new@email.com"}
}
```

---

## 🎨 Frontend (Opcional)

### **Criar página de auditoria:**

```bash
cd frontend/src/pages

# Criar AuditoriaPage.js (copiar do docs/AUDIT_LOG.md)
```

### **Adicionar rota:**

```javascript
// src/App.js
import AuditoriaPage from './pages/AuditoriaPage';

// Dentro de <Routes>:
<Route path="/auditoria" element={<AuditoriaPage />} />
```

### **Adicionar link no menu:**

```javascript
// Onde tiver menu de navegação
<Link to="/auditoria">Auditoria</Link>
```

---

## ⚙️ Configurações Opcionais

### **Habilitar log de leitura (GET)**

Por padrão, apenas CREATE/UPDATE/DELETE são registrados.

Para registrar também visualizações (VIEW):

```bash
# Via API:
curl -X PUT http://localhost:8000/api/audit-logs/retencao/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"habilitar_log_leitura": true}'
```

### **Alterar período de retenção**

Padrão: 365 dias (1 ano)

```bash
curl -X PUT http://localhost:8000/api/audit-logs/retencao/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dias_retencao": 730}'  # 2 anos
```

---

## 📊 Endpoints Disponíveis

- **GET /api/audit-logs/** - Lista logs com filtros
- **GET /api/audit-logs/{id}/** - Detalhes de um log
- **GET /api/audit-logs/stats/** - Estatísticas agregadas
- **GET /api/audit-logs/retencao/** - Config de retenção
- **PUT /api/audit-logs/retencao/** - Atualizar config

---

## ✅ Checklist Final

- [ ] Models importados em `models.py`
- [ ] Middleware adicionado em `settings.py`
- [ ] URLs registradas em `urls.py`
- [ ] `makemigrations` executado
- [ ] `migrate` executado
- [ ] `sync_permissions` executado
- [ ] Servidor reiniciado
- [ ] Testado criar/editar objeto
- [ ] Log apareceu em `/api/audit-logs/`
- [ ] Frontend criado (opcional)

---

## 🐛 Troubleshooting

### **Erro: "AuditLog não encontrado"**
- Execute: `python manage.py makemigrations` e `python manage.py migrate`

### **Erro: "403 Forbidden" ao acessar /api/audit-logs/**
- Verifique se seu usuário tem permissão `ver_auditoria`
- Execute: `python manage.py sync_permissions`

### **Logs não estão sendo criados**
- Verifique se middleware está ativado em `settings.py`
- Verifique se usuário está autenticado
- Cheque se endpoint não está na lista `IGNORE_PATHS`

### **Muitos logs de GET**
- Desative `habilitar_log_leitura` na configuração de retenção

---

**Pronto! Sistema de auditoria instalado e funcionando!** 🎉
