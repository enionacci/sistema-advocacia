# Frontend de Auditoria - Documentação

## 📋 Visão Geral

Interface web completa para visualização e análise dos logs de auditoria do sistema. Desenvolvida em React 19 com Material-UI, integra perfeitamente com a API de auditoria do backend Django.

## 🎨 Componentes Criados

### 1. **Serviço de API** (`utils/auditLogService.js`)

Camada de comunicação com o backend:

#### Funções Principais:
- `listAuditLogs(params)` - Lista logs com filtros e paginação
- `getAuditLogDetail(id)` - Obtém detalhes de um log específico
- `getAuditLogStats(params)` - Estatísticas agregadas
- `getRetentionConfig()` - Configuração de retenção
- `updateRetentionConfig(data)` - Atualiza retenção
- `formatAction(acao)` - Formata ações para exibição
- `formatTimestamp(timestamp)` - Formata data/hora
- `compareData(oldData, newData)` - Compara objetos

#### Exemplo de Uso:
```javascript
import { listAuditLogs } from '../utils/auditLogService';

const logs = await listAuditLogs({
  acao: 'CREATE',
  data_inicio: '2025-10-01',
  page: 1,
  page_size: 25
});
```

---

### 2. **Página de Listagem** (`pages/AuditLogListPage.js`)

Página principal com tabela completa de logs.

#### Funcionalidades:
- ✅ **Tabela responsiva** com Material-UI
- ✅ **Paginação** (10, 25, 50, 100 itens/página)
- ✅ **Filtros avançados**:
  - Por ação (CREATE, UPDATE, DELETE, VIEW)
  - Por modelo (Cliente, Consulta, etc)
  - Por período (data início/fim)
  - Busca por texto livre
- ✅ **Chips coloridos** para tipo de ação
- ✅ **Navegação** para detalhes do log
- ✅ **Link** para dashboard de estatísticas

#### Exemplo de Filtros:
```javascript
{
  acao: 'DELETE',
  modelo_nome: 'Cliente',
  data_inicio: '2025-10-01',
  data_fim: '2025-10-31',
  search: 'João Silva'
}
```

#### Layout:
- Cabeçalho com título e botão de estatísticas
- Painel de filtros expansível
- Tabela com colunas: Data/Hora, Usuário, Ação, Modelo, Descrição, IP, Ações
- Paginação no rodapé

---

### 3. **Página de Detalhes** (`pages/AuditLogDetailPage.js`)

Visualização completa de um log específico.

#### Seções:
1. **Informações da Ação**:
   - Usuário que executou
   - Escritório
   - Data/hora exata
   - Descrição da ação
   - Objeto afetado

2. **Informações Técnicas**:
   - Endpoint HTTP
   - Método (GET, POST, PUT, DELETE)
   - Endereço IP
   - User Agent
   - Mensagem de erro (se houver)

3. **Alterações Realizadas** (UPDATE):
   - Tabela comparativa: campo | antes | depois
   - Destaque visual: vermelho (antigo) / verde (novo)

4. **Dados Completos** (CREATE/DELETE):
   - JSON formatado dos dados criados/removidos
   - Syntax highlighting

#### Exemplo de Comparação:
```
Campo          | Valor Anterior        | Valor Novo
-----------------------------------------------------------
nome_completo  | João Silva           | João Silva Santos
email          | joao@email.com       | joao.silva@email.com
telefone       | 11999999999          | 11988888888
```

---

### 4. **Dashboard de Estatísticas** (`pages/AuditLogStatsPage.js`)

Painel com métricas agregadas e visualizações.

#### Cards de Resumo:
1. **Total de Logs** - Quantidade total no período
2. **Usuários Únicos** - Número de usuários diferentes
3. **Modelos Afetados** - Tipos de objetos alterados
4. **Período** - Data do primeiro ao último log

#### Gráficos e Listas:
1. **Distribuição por Tipo de Ação**:
   - Quantos CREATE, UPDATE, DELETE, VIEW
   - Percentual de cada tipo

2. **Usuários Mais Ativos**:
   - Top 10 usuários por número de ações
   - Ranking com chips

3. **Modelos Mais Acessados**:
   - Quais objetos são mais modificados
   - Cliente, Consulta, etc.

4. **Atividade Diária**:
   - Últimos 7 dias
   - Quantidade de logs por dia

#### Filtros:
- Data início/fim personalizável
- Atualização em tempo real

---

## 🚀 Rotas Configuradas

Adicionadas ao `App.js`:

```javascript
// Listagem de logs
/audit-logs

// Estatísticas
/audit-logs/stats

// Detalhes de log específico
/audit-logs/:id
```

Todas as rotas são protegidas por `<PrivateRoute>` - requerem autenticação.

---

## 🎨 Estilo e UX

### Material-UI v5
- **Componentes**: Card, Table, Chip, Button, TextField, Grid
- **Ícones**: Material Icons (Visibility, FilterList, Assessment, etc)
- **Tema**: Responsivo e consistente com o resto do sistema

### Cores por Tipo de Ação:
- 🟢 **CREATE** - Success (verde)
- 🔵 **UPDATE** - Info (azul)
- 🔴 **DELETE** - Error (vermelho)
- ⚪ **VIEW** - Default (cinza)

### Responsividade:
- Mobile-first design
- Breakpoints: xs, sm, md, lg, xl
- Tabelas com scroll horizontal em telas pequenas

---

## 📊 Exemplos de Uso

### 1. Acessar Logs de Auditoria
```
Navegue para: http://localhost:3000/audit-logs
```

### 2. Filtrar Logs
```javascript
// No painel de filtros:
- Ação: DELETE
- Modelo: Cliente
- Data Início: 01/10/2025
- Data Fim: 31/10/2025
- Busca: "João Silva"

// Clique em "Aplicar"
```

### 3. Ver Detalhes
```
Clique no ícone de olho (👁️) em qualquer log
Será redirecionado para: /audit-logs/{id}
```

### 4. Ver Estatísticas
```
Clique no botão "Estatísticas" no topo da página
Será redirecionado para: /audit-logs/stats
```

---

## 🔒 Controle de Acesso

### Permissão Necessária:
- `ver_auditoria` - Criada automaticamente no backend

### Validação:
- Frontend: Rotas protegidas por `<PrivateRoute>`
- Backend: API valida permissão em cada requisição

### Fluxo:
1. Usuário faz login
2. Token JWT é salvo no localStorage
3. `axiosInstance` envia token em todas as requisições
4. Backend valida token + permissão
5. Se autorizado, retorna dados

---

## 🧪 Testando o Frontend

### 1. Iniciar o servidor React:
```bash
cd frontend
npm start
```

### 2. Acessar a aplicação:
```
http://localhost:3000/audit-logs
```

### 3. Cenários de Teste:

#### Teste 1: Listar Logs
- Acesse `/audit-logs`
- Verifique se a tabela carrega
- Teste paginação
- Aplique filtros

#### Teste 2: Ver Detalhes
- Clique em um log
- Verifique informações completas
- Veja comparação de dados (UPDATE)

#### Teste 3: Estatísticas
- Clique em "Estatísticas"
- Veja cards de resumo
- Verifique gráficos
- Aplique filtro de período

#### Teste 4: Sem Permissão
- Faça login com usuário sem `ver_auditoria`
- Tente acessar `/audit-logs`
- Deve receber erro 403 Forbidden

---

## 📝 Próximas Melhorias (Opcional)

### Funcionalidades Futuras:
1. **Exportação**:
   - Exportar logs para CSV/Excel
   - Exportar estatísticas para PDF

2. **Gráficos Avançados**:
   - Chart.js ou Recharts
   - Gráficos de linha temporal
   - Heatmap de atividades

3. **Filtros Avançados**:
   - Filtro por usuário específico
   - Filtro por escritório
   - Filtro por status (sucesso/erro)

4. **Notificações**:
   - Alertas para ações críticas
   - Email quando log de DELETE

5. **Configuração de Retenção**:
   - Interface para ajustar dias de retenção
   - Toggle para auto-remoção
   - Toggle para logar VIEW

---

## 🐛 Troubleshooting

### Erro: "Não foi possível carregar logs"
- Verifique se o backend está rodando
- Confirme que a API está em `/api/audit-logs/`
- Verifique token JWT no localStorage

### Erro 403 Forbidden
- Usuário não tem permissão `ver_auditoria`
- Rode `python manage.py sync_permissions` no backend

### Página em branco
- Verifique console do navegador (F12)
- Confirme imports das páginas no App.js
- Verifique se React Router está configurado

### Filtros não funcionam
- Abra Network tab (F12)
- Veja se parâmetros estão sendo enviados
- Confirme que backend aceita filtros

---

## ✅ Checklist de Implementação

- [x] Criar `auditLogService.js`
- [x] Criar `AuditLogListPage.js`
- [x] Criar `AuditLogDetailPage.js`
- [x] Criar `AuditLogStatsPage.js`
- [x] Adicionar rotas no `App.js`
- [x] Adicionar imports no `App.js`
- [ ] Testar listagem de logs
- [ ] Testar detalhes de log
- [ ] Testar estatísticas
- [ ] Testar filtros
- [ ] Adicionar link no menu principal
- [ ] Deploy em produção

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do backend (`AUDIT_LOG.md`)
2. Consulte os comentários no código
3. Abra um issue no repositório

---

**Status**: ✅ Frontend de auditoria 100% implementado e pronto para uso!
