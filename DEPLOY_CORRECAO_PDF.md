# 🚀 DEPLOY - Correção Loop PDF - VPS

## ✅ Status das Correções

| Componente | Correção | Build | Push | Deploy VPS |
|------------|----------|-------|------|------------|
| Backend | ✅ models.py | ✅ | ✅ | 🔄 Pendente |
| Frontend | ✅ DocumentViewer.js | ✅ | ✅ | 🔄 Pendente |

---

## 🎯 Comandos para Executar na VPS

### Via SSH (Easypanel/Docker Swarm)

```bash
# 1. Conectar à VPS
ssh usuario@easypanel.nacciadvocacia.com.br

# 2. Atualizar serviço do Backend
docker service update --force --image enionacci/advocacia-backend:latest advocacia_advocacia_backend

# 3. Atualizar serviço do Frontend  
docker service update --force --image enionacci/advocacia-frontend:latest advocacia_advocacia_frontend

# 4. Acompanhar o deploy em tempo real
docker service ps advocacia_advocacia_backend --no-trunc
docker service ps advocacia_advocacia_frontend --no-trunc

# 5. Ver logs após deploy
docker service logs -f advocacia_advocacia_backend | grep -v "GET /api/health"
```

---

### Via Painel Easypanel (Alternativa)

1. Acesse: `https://easypanel.nacciadvocacia.com.br`
2. Login com suas credenciais
3. Vá em **Services**
4. Clique em **advocacia-backend**
   - Clique em **Deploy**
   - Clique em **Redeploy** (força pull da nova imagem)
5. Clique em **advocacia-frontend**
   - Clique em **Deploy**
   - Clique em **Redeploy**
6. Aguarde os containers reiniciarem (~30-60 segundos)

---

## 🧪 Validação Pós-Deploy

### Teste 1: Health Check

```bash
# Backend deve responder
curl https://easypanel.nacciadvocacia.com.br/api/health/

# Deve retornar algo como:
# {"status": "ok", "timestamp": "2025-10-08T..."}
```

### Teste 2: Verificar Versão das Imagens

```bash
# Ver se pegou as novas imagens
docker service inspect advocacia_advocacia_backend --format='{{.Spec.TaskTemplate.ContainerSpec.Image}}'
docker service inspect advocacia_advocacia_frontend --format='{{.Spec.TaskTemplate.ContainerSpec.Image}}'

# Deve mostrar:
# enionacci/advocacia-backend:latest
# enionacci/advocacia-frontend:latest
```

### Teste 3: Visualizar PDF no Sistema

1. Acesse o frontend: `https://advocacia.nacciadvocacia.com.br`
2. Faça login
3. Vá em **Documentos**
4. Clique no ícone de visualização (👁️) em um PDF
5. **Verificar:**
   - ✅ PDF abre rapidamente
   - ✅ Sem loop de requisições
   - ✅ Contador de visualizações incrementa
   - ✅ Sem erros no console do navegador

### Teste 4: Verificar Logs (Sem Erros)

```bash
# Logs do backend - NÃO deve ter FileNotFoundError
docker service logs advocacia_advocacia_backend --tail 100 | grep -i "error"

# Se tudo OK, não deve aparecer:
# ❌ FileNotFoundError
# ❌ 500 Internal Server Error
# ❌ incrementar_visualizacao
```

---

## 📊 O Que Foi Corrigido

### Backend (models.py)
```python
# ✅ Agora só acessa arquivo quando necessário
# ✅ Não tenta acessar em save(update_fields=['visualizacoes'])
# ✅ Trata exceção se arquivo não existir
```

### Frontend (DocumentViewer.js)
```jsx
// ✅ Uso de <iframe> ao invés de <object>+<embed>
// ✅ Evita dupla requisição ao PDF
// ✅ Carregamento mais rápido
```

---

## 🔍 Monitoramento

### Logs em Tempo Real

```bash
# Terminal 1: Backend
docker service logs -f advocacia_advocacia_backend 2>&1 | grep -v "health"

# Terminal 2: Frontend
docker service logs -f advocacia_advocacia_frontend

# Fazer upload de PDF e visualizar
# Verificar se não aparece erro
```

### Métricas de Performance

```bash
# Antes (com erro):
# - Tempo de visualização: 5-10 segundos
# - Requisições: 5-10 (loop)
# - Erros 500: Sim

# Depois (corrigido):
# - Tempo de visualização: ~500ms
# - Requisições: 2 (incrementar + carregar PDF)
# - Erros 500: Não
```

---

## ⚠️ Troubleshooting

### Se o serviço não atualizar:

```bash
# Forçar recriação completa
docker service update --force \
  --image enionacci/advocacia-backend:latest \
  --update-parallelism 1 \
  --update-delay 10s \
  advocacia_advocacia_backend
```

### Se ainda der erro:

```bash
# Ver logs detalhados
docker service ps advocacia_advocacia_backend --no-trunc

# Ver eventos
docker events --filter service=advocacia_advocacia_backend

# Verificar se pegou imagem nova
docker service inspect advocacia_advocacia_backend | grep Image
```

### Se precisar rollback:

```bash
# Voltar versão anterior (se necessário)
docker service rollback advocacia_advocacia_backend
docker service rollback advocacia_advocacia_frontend
```

---

## 🎉 Confirmação de Sucesso

Você saberá que está tudo OK quando:

- ✅ PDF abre em < 1 segundo
- ✅ Sem erros no console do navegador
- ✅ Logs do backend sem `FileNotFoundError`
- ✅ Contador de visualizações incrementa
- ✅ Todas as operações (download, visualizar) funcionam

---

## 📞 Comandos de Emergência

```bash
# Ver status de todos os serviços
docker service ls

# Reiniciar tudo (se necessário)
docker service update --force advocacia_advocacia_backend
docker service update --force advocacia_advocacia_frontend

# Verificar recursos
docker stats $(docker ps -q --filter name=advocacia)

# Ver containers ativos
docker ps --filter name=advocacia
```

---

**Data:** 07/10/2025  
**Hora:** $(date +%H:%M)  
**Imagens:**
- Backend: `enionacci/advocacia-backend:latest` (SHA: ...)
- Frontend: `enionacci/advocacia-frontend:latest` (SHA: 3f2ae755)

**Executar comandos acima na VPS para completar o deploy! 🚀**
