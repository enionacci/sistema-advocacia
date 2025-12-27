# 🔒 CORREÇÃO FINAL: Mixed Content (HTTP/HTTPS)

## 🐛 Problema Identificado

```
Mixed Content: The page at 'https://advocacia.nacciadvocacia.com.br' was loaded over HTTPS, 
but requested an insecure frame 'http://advocacia-advocacia-backend.../media/documentos/....pdf'. 
This request has been blocked; the content must be served over HTTPS.
```

### Causa Raiz

- **Frontend:** HTTPS (`https://advocacia.nacciadvocacia.com.br`)
- **Backend:** HTTP (`http://advocacia-advocacia-backend.6hrnsw.easypanel.host`)
- **Navegador:** Bloqueia conteúdo HTTP em páginas HTTPS (Mixed Content)

---

## ✅ Soluções Implementadas

### 1. Frontend - Força HTTPS no `axiosInstance.js` ✅

**Arquivo:** `frontend/src/utils/axiosInstance.js`

```javascript
// Se o frontend estiver em HTTPS, força o backend também usar HTTPS
let baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

if (window.location.protocol === 'https:' && baseURL.startsWith('http://')) {
    baseURL = baseURL.replace('http://', 'https://');
    console.log('🔒 Forçando HTTPS para API:', baseURL);
}
```

**Benefício:** Requisições da API sempre usam HTTPS quando o frontend está em HTTPS.

---

### 2. Frontend - Força HTTPS no `AuthContext.js` ✅

**Arquivo:** `frontend/src/context/AuthContext.js`

```javascript
let apiURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Se o frontend estiver em HTTPS, força o backend também usar HTTPS
if (window.location.protocol === 'https:' && apiURL.startsWith('http://')) {
    apiURL = apiURL.replace('http://', 'https://');
}
```

**Benefício:** Autenticação funciona com HTTPS.

---

### 3. Backend - Serializer força HTTPS ✅

**Arquivo:** `backend/documentos/serializers.py`

```python
def get_arquivo_url(self, obj):
    """Retorna a URL do arquivo com HTTPS se necessário"""
    if obj.arquivo:
        request = self.context.get('request')
        if request:
            url = request.build_absolute_uri(obj.arquivo.url)
            # Força HTTPS em produção
            if url.startswith('http://') and 'easypanel' in url:
                url = url.replace('http://', 'https://')
            return url
    return None
```

**Benefício:** URLs de arquivos (PDFs, imagens) sempre retornam com HTTPS em produção.

---

### 4. Backend - Headers CORS Melhorados ✅

**Arquivo:** `backend/documentos/media_views.py`

```python
# Headers para CORS e visualização inline
response['Access-Control-Allow-Origin'] = '*'
response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
response['Cross-Origin-Resource-Policy'] = 'cross-origin'
response['Cross-Origin-Embedder-Policy'] = 'require-corp'

# Para PDFs, garantir que seja inline
if extension == '.pdf':
    response['Content-Disposition'] = f'inline; filename="{os.path.basename(path)}"'
    response['Accept-Ranges'] = 'bytes'
```

**Benefício:** PDFs carregam corretamente em iframes com HTTPS.

---

### 5. Frontend - Melhorias no DocumentViewer ✅

**Arquivo:** `frontend/src/components/DocumentViewer.js`

```jsx
<iframe
    src={`${documento.arquivo_url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
    type="application/pdf"
    style={{ width: '100%', height: '100%', border: 'none' }}
    title={documento.titulo}
    onLoad={handleLoadSuccess}
    onError={handleLoadError}
    allow="fullscreen"
    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
/>
```

**Benefícios:**
- Parâmetros PDF para melhor visualização
- Sandbox para segurança
- Logs de debug

---

### 6. Backend - Logs de Debug ✅

**Arquivo:** `backend/documentos/media_views.py`

```python
logger.info(f"📥 Requisição de media: {path}")
logger.info(f"   User-Agent: {request.META.get('HTTP_USER_AGENT', 'Unknown')}")
logger.info(f"   Referer: {request.META.get('HTTP_REFERER', 'None')}")
logger.info(f"✅ Servindo PDF: {os.path.basename(path)} ({content_type})")
```

**Benefício:** Facilita debug de problemas futuros.

---

## 🚀 Deploy

### Status:
```
✅ Backend: Código corrigido
✅ Frontend: Código corrigido
🔄 Build: Em andamento
🔄 Push: Pendente
🔄 Deploy VPS: Pendente
```

### Comandos executados:
```powershell
# Build e Push (em andamento)
.\build-push.ps1
```

### Próximos passos na VPS:
```bash
# Atualizar serviços
docker service update --force advocacia_advocacia_backend
docker service update --force advocacia_advocacia_frontend

# Verificar logs
docker service logs -f advocacia_advocacia_backend | grep "Servindo PDF"
```

---

## 🧪 Como Testar

### Teste 1: Verificar URLs no Console

1. Abra DevTools (F12)
2. Vá na aba Console
3. Tente visualizar um PDF
4. **Deve aparecer:**
   ```
   🔒 Forçando HTTPS para API: https://advocacia-advocacia-backend...
   🔍 Tentando carregar PDF: https://advocacia-advocacia-backend.../media/...
   ✅ PDF carregado com sucesso!
   ```

### Teste 2: Verificar Mixed Content

1. Abra DevTools → Console
2. **NÃO deve aparecer:**
   ```
   ❌ Mixed Content: ... was loaded over HTTPS, but requested an insecure frame 'http://...
   ```

### Teste 3: Visualizar PDF

1. Clique no ícone de visualização (👁️) em um PDF
2. **Deve:**
   - ✅ Abrir modal rapidamente
   - ✅ Carregar PDF inline sem erros
   - ✅ URL do PDF deve ser HTTPS no iframe
   - ✅ Sem círculo de loading infinito

---

## 📊 Fluxo Corrigido

### ❌ ANTES (Com erro)

```
Frontend (HTTPS)
    ↓
API Request → http://backend... (HTTP) ❌
    ↓
Retorna: arquivo_url = "http://backend.../media/doc.pdf"
    ↓
<iframe src="http://..." /> ❌
    ↓
BLOCKED BY BROWSER (Mixed Content)
```

### ✅ DEPOIS (Corrigido)

```
Frontend (HTTPS)
    ↓
axiosInstance detecta HTTPS → força baseURL = https://backend...
    ↓
API Request → https://backend... (HTTPS) ✅
    ↓
Serializer força HTTPS → arquivo_url = "https://backend.../media/doc.pdf"
    ↓
<iframe src="https://..." /> ✅
    ↓
PDF CARREGA NORMALMENTE 🎉
```

---

## 🔍 Verificações de Segurança

### Headers de Resposta Esperados:

```http
HTTP/2 200 OK
Content-Type: application/pdf
Content-Disposition: inline; filename="documento.pdf"
Access-Control-Allow-Origin: *
Cross-Origin-Resource-Policy: cross-origin
Accept-Ranges: bytes
```

### URLs Esperadas:

```
✅ https://advocacia-advocacia-backend.6hrnsw.easypanel.host/media/documentos/...
✅ https://advocacia.nacciadvocacia.com.br/clientes/17
❌ http://advocacia-advocacia-backend... (NÃO DEVE APARECER)
```

---

## 🛠️ Configuração no Easypanel

### Variáveis de Ambiente Recomendadas:

```bash
# Frontend
REACT_APP_API_URL=https://advocacia-advocacia-backend.6hrnsw.easypanel.host
# OU
REACT_APP_API_URL=http://advocacia-advocacia-backend.6hrnsw.easypanel.host
# (O código força HTTPS automaticamente se o frontend estiver em HTTPS)

# Backend
DEBUG=False
ALLOWED_HOSTS=advocacia-advocacia-backend.6hrnsw.easypanel.host,easypanel.nacciadvocacia.com.br
```

### SSL/TLS:

O Easypanel já fornece certificado SSL automaticamente. Certifique-se que:
- ✅ Frontend tem certificado válido
- ✅ Backend tem certificado válido
- ✅ Ambos estão acessíveis via HTTPS

---

## 📝 Checklist Final

- [x] ✅ Frontend força HTTPS em `axiosInstance.js`
- [x] ✅ Frontend força HTTPS em `AuthContext.js`
- [x] ✅ Backend serializer retorna URLs com HTTPS
- [x] ✅ Backend serve media com headers CORS corretos
- [x] ✅ DocumentViewer usa iframe com sandbox
- [x] ✅ Logs de debug adicionados
- [ ] 🔄 Build concluído
- [ ] 🔄 Push para Docker Hub
- [ ] 🔄 Deploy na VPS
- [ ] 🔄 Testes de visualização de PDF
- [ ] 🔄 Verificar ausência de Mixed Content

---

## 🎯 Resumo

**Problema:** Mixed Content bloqueava visualização de PDFs.

**Causa:** Frontend HTTPS tentava carregar PDFs via HTTP.

**Solução:** 
1. Frontend força HTTPS automaticamente
2. Backend retorna URLs com HTTPS
3. Headers CORS configurados corretamente

**Resultado Esperado:** 
- ✅ PDFs carregam normalmente
- ✅ Sem avisos de Mixed Content
- ✅ Visualização inline funciona
- ✅ Performance melhorada

---

**Data:** 07/10/2025  
**Status:** Build em andamento  
**Prioridade:** 🔴 CRÍTICA (Bloqueador de produção)
