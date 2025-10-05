# 🔍 Sistema de Auditoria (Audit Log)

## 📋 Visão Geral

Sistema completo de auditoria que registra **TODAS** as ações dos usuários no sistema para fins de:
- ✅ Conformidade legal (LGPD/GDPR)
- ✅ Segurança e rastreabilidade
- ✅ Investigação de incidentes
- ✅ Análise de uso do sistema

---

## 🏗️ Arquitetura

### **Componentes:**

1. **AuditLog (Model)** - Armazena os logs
2. **AuditMiddleware** - Captura automaticamente as ações
3. **AuditViews** - API para consultar logs
4. **Frontend (AuditoriaPage)** - Interface de visualização

---

## 📊 O Que É Registrado?

### **Informações Capturadas:**

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Quem** | Usuário e escritório | "João Silva @ Silva Advogados" |
| **O quê** | Ação realizada | CREATE, UPDATE, DELETE |
| **Quando** | Data e hora | "2025-10-04 15:30:45" |
| **Onde** | Objeto afetado | "Cliente: Maria Santos (ID: 123)" |
| **Como** | Método HTTP, IP, navegador | "POST, 192.168.1.10, Chrome" |
| **Detalhes** | Dados antigos vs novos | email: "old@email.com" → "new@email.com" |

### **Ações Rastreadas:**

- ✅ **CREATE** - Criação de registros
- ✅ **UPDATE** - Edição de registros
- ✅ **DELETE** - Exclusão de registros
- ✅ **VIEW** - Visualização (opcional, configurável)
- ✅ **LOGIN/LOGOUT** - Acessos ao sistema
- ✅ **EXPORT/IMPORT** - Exportação/importação de dados

---

## 🚀 Como Funciona?

### **1. Automático via Middleware**

O middleware intercepta **todas** as requisições:

```python
# Requisição → Middleware → View → Response → Log criado

Exemplo:
Usuario: "João" 
POST /api/clientes/ 
Dados: {"nome": "Maria", "cpf": "123.456.789-00"}

→ AuditLog criado automaticamente:
   - Ação: CREATE
   - Descrição: "criou Cliente: Maria Santos"
   - Dados novos: {"nome": "Maria", "cpf": "123.456.789-00"}
   - IP: 192.168.1.10
```

### **2. Manual (Para Ações Especiais)**

```python
from escritorios.audit_models import AuditLog

# Registrar ação customizada
AuditLog.criar_log(
    usuario=request.user,
    acao='EXPORT',
    descricao='Exportou relatório de clientes em PDF',
    endpoint='/api/clientes/export/',
    metodo_http='GET',
    ip_address=get_client_ip(request)
)
```

---

## ⚙️ Configuração

### **1. Adicionar Models ao models.py**

```python
# escritorios/models.py
from .audit_models import AuditLog, AuditLogRetencao

# Adicione ao __all__ ou importe explicitamente
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
    
    # Adicione ANTES do SubscriptionCheckMiddleware
    'escritorios.audit_middleware.AuditMiddleware',  # <-- NOVO
    'escritorios.middleware.SubscriptionCheckMiddleware',
]
```

### **3. Registrar URLs**

```python
# config/urls.py

urlpatterns = [
    # ... outras URLs
    path('api/audit-logs/', include('escritorios.audit_urls')),
]
```

### **4. Criar Tabelas no Banco**

```bash
# Criar migrations
python manage.py makemigrations

# Aplicar migrations
python manage.py migrate

# Sincronizar permissões
python manage.py sync_permissions
```

---

## 🔐 Permissões

### **Quem pode ver logs?**

Apenas usuários com permissão **`ver_auditoria`**.

Por padrão:
- ✅ **Administrador** - Tem acesso
- ❌ **Outros papéis** - Não têm acesso

### **Configurar Acesso:**

1. Acesse "Gerenciar Papéis"
2. Edite o papel desejado
3. Marque ☑ "Ver Auditoria"
4. Salvar

---

## 🎯 API Endpoints

### **GET /api/audit-logs/**
Lista logs de auditoria com filtros

**Parâmetros:**
- `?periodo=hoje|semana|mes` - Filtro rápido
- `?data_inicio=2025-10-01` - Data inicial
- `?data_fim=2025-10-31` - Data final
- `?acao=CREATE` - Filtrar por ação
- `?modelo_nome=Cliente` - Filtrar por modelo
- `?usuario_id=5` - Filtrar por usuário
- `?search=maria` - Busca textual
- `?ordering=-timestamp` - Ordenação

**Resposta:**
```json
{
  "count": 150,
  "results": [
    {
      "id": 1,
      "timestamp": "2025-10-04T15:30:45Z",
      "usuario_nome": "João Silva",
      "acao": "CREATE",
      "acao_display": "Criação",
      "descricao": "criou Cliente: Maria Santos",
      "modelo_nome": "Cliente",
      "objeto_repr": "Maria Santos",
      "sucesso": true
    }
  ]
}
```

### **GET /api/audit-logs/{id}/**
Detalhes completos de um log

**Resposta:**
```json
{
  "id": 1,
  "timestamp": "2025-10-04T15:30:45Z",
  "usuario_completo": {
    "id": 5,
    "username": "joao",
    "nome": "João Silva",
    "email": "joao@silva.com"
  },
  "escritorio_nome": "Silva Advogados",
  "acao": "UPDATE",
  "descricao": "editou Cliente: Maria Santos",
  "dados_antigos": {
    "email": "old@email.com",
    "telefone": "(11) 9999-9999"
  },
  "dados_novos": {
    "email": "new@email.com",
    "telefone": "(11) 8888-8888"
  },
  "campos_alterados": ["email", "telefone"],
  "diferencas": [
    {
      "campo": "email",
      "antes": "old@email.com",
      "depois": "new@email.com"
    }
  ],
  "ip_address": "192.168.1.10",
  "user_agent": "Mozilla/5.0 Chrome/91.0"
}
```

### **GET /api/audit-logs/stats/**
Estatísticas agregadas

**Parâmetros:**
- `?dias=30` - Período (padrão: 30 dias)

**Resposta:**
```json
{
  "periodo_dias": 30,
  "total_logs": 1250,
  "total_usuarios": 8,
  "por_acao": {
    "CREATE": {"label": "Criação", "count": 450},
    "UPDATE": {"label": "Atualização", "count": 600},
    "DELETE": {"label": "Exclusão", "count": 200}
  },
  "por_modelo": {
    "Cliente": 800,
    "Consulta": 350,
    "Processo": 100
  },
  "top_usuarios": [
    {"usuario_nome": "João Silva", "total": 450},
    {"usuario_nome": "Maria Santos", "total": 320}
  ],
  "acoes_por_dia": [
    {"data": "2025-10-04", "count": 85},
    {"data": "2025-10-03", "count": 92}
  ]
}
```

### **GET/PUT /api/audit-logs/retencao/**
Configuração de retenção de logs

**GET Resposta:**
```json
{
  "escritorio": 1,
  "dias_retencao": 365,
  "habilitar_log_leitura": false,
  "habilitar_exportacao_automatica": false
}
```

**PUT Request:**
```json
{
  "dias_retencao": 730,
  "habilitar_log_leitura": true
}
```

---

## ⚡ Configurações Avançadas

### **Retenção de Logs**

Por padrão, logs são mantidos por **365 dias (1 ano)**.

**Alterar período:**
1. Acesse `/api/audit-logs/retencao/`
2. Defina `dias_retencao`
3. Salvar

**Limpeza automática (Opcional):**

Criar comando para limpar logs antigos:

```python
# management/commands/limpar_logs_antigos.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from escritorios.audit_models import AuditLog, AuditLogRetencao

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        for config in AuditLogRetencao.objects.all():
            data_limite = timezone.now() - timedelta(days=config.dias_retencao)
            logs_excluidos = AuditLog.objects.filter(
                escritorio_id=config.escritorio.id,
                timestamp__lt=data_limite
            ).delete()
            
            self.stdout.write(f"Escritório {config.escritorio.nome}: {logs_excluidos[0]} logs removidos")
```

**Agendar limpeza (cron):**
```bash
# Rodar todo dia às 3h da manhã
0 3 * * * cd /path/to/project && python manage.py limpar_logs_antigos
```

---

## 🎨 Interface Frontend (React)

**Criar página de auditoria:**

```javascript
// src/pages/AuditoriaPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, MenuItem,
  Select, FormControl, InputLabel, Chip, Box, Button
} from '@mui/material';

function AuditoriaPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    periodo: 'semana',
    acao: '',
    modelo_nome: '',
  });

  useEffect(() => {
    fetchLogs();
  }, [filtros]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filtros).toString();
      const response = await axiosInstance.get(`/api/audit-logs/?${params}`);
      setLogs(response.data.results);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert('Você não tem permissão para visualizar logs de auditoria');
      }
    } finally {
      setLoading(false);
    }
  };

  const getAcaoColor = (acao) => {
    const colors = {
      CREATE: 'success',
      UPDATE: 'warning',
      DELETE: 'error',
      VIEW: 'info',
    };
    return colors[acao] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Logs de Auditoria
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={filtros.periodo}
              onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
            >
              <MenuItem value="hoje">Hoje</MenuItem>
              <MenuItem value="semana">Última Semana</MenuItem>
              <MenuItem value="mes">Último Mês</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Ação</InputLabel>
            <Select
              value={filtros.acao}
              onChange={(e) => setFiltros({...filtros, acao: e.target.value})}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="CREATE">Criação</MenuItem>
              <MenuItem value="UPDATE">Atualização</MenuItem>
              <MenuItem value="DELETE">Exclusão</MenuItem>
            </Select>
          </FormControl>

          <Button onClick={fetchLogs} variant="contained">
            Filtrar
          </Button>
        </Box>
      </Paper>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Ação</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Modelo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>{log.usuario_nome}</TableCell>
                <TableCell>
                  <Chip
                    label={log.acao_display}
                    color={getAcaoColor(log.acao)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.descricao}</TableCell>
                <TableCell>{log.modelo_nome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AuditoriaPage;
```

---

## ✅ Checklist de Implementação

- [ ] Models criados (`audit_models.py`)
- [ ] Middleware adicionado em `settings.py`
- [ ] URLs registradas em `config/urls.py`
- [ ] Migrations criadas e aplicadas
- [ ] Permissão `ver_auditoria` sincronizada
- [ ] Papel Administrador tem permissão
- [ ] Frontend `AuditoriaPage.js` criado
- [ ] Rota `/auditoria` adicionada no React Router
- [ ] Testado criar/editar/deletar objeto
- [ ] Verificado log foi criado automaticamente

---

## 🔒 Segurança e Privacidade

### **Dados Sensíveis:**
- ❌ Senhas NÃO são registradas
- ❌ Tokens NÃO são registrados
- ✅ Apenas metadados e campos não-sensíveis

### **Isolamento:**
- Cada escritório vê APENAS seus logs
- Usuários só veem logs se tiverem permissão
- Logs são imutáveis (não podem ser editados/deletados via API)

---

## 📈 Casos de Uso

1. **Investigação de incidente:**
   - "Quem deletou o cliente X?"
   - "Quando o processo Y foi alterado?"

2. **Auditoria de conformidade:**
   - Relatório de todas as ações em um período
   - Quem acessou dados de cliente específico

3. **Análise de uso:**
   - Usuários mais ativos
   - Funcionalidades mais utilizadas
   - Horários de pico

---

**Sistema de auditoria completo e pronto para produção!** 🎉
