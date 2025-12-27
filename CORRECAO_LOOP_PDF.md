# 🔄 CORREÇÃO: Loop/Erro ao Visualizar PDF

## 🐛 Problema Identificado

Ao tentar visualizar um PDF na VPS, ocorria:
1. **Loop de requisições** ao backend
2. **FileNotFoundError** nos logs
3. **Visualização não carregava**

---

## 🔍 Causa Raiz

### Problema 1: Bug no Backend (models.py)

```python
# ❌ ANTES - models.py
def incrementar_visualizacoes(self):
    self.visualizacoes += 1
    self.save(update_fields=['visualizacoes'])  # ← Chama save()
    
def save(self, *args, **kwargs):
    if self.arquivo:
        self.tamanho = self.arquivo.size  # ← SEMPRE tenta acessar arquivo
        # FileNotFoundError se arquivo não existe! ❌
```

**Fluxo do erro:**
```
Frontend clica "Visualizar PDF"
  ↓
POST /api/documentos/{id}/incrementar_visualizacao/
  ↓
incrementar_visualizacoes()
  ↓
save(update_fields=['visualizacoes'])
  ↓
self.arquivo.size
  ↓
FileNotFoundError ❌
  ↓
500 Internal Server Error
  ↓
Frontend tenta novamente (retry)
  ↓
LOOP! 🔄
```

### Problema 2: Dupla Requisição no Frontend

```jsx
// ❌ ANTES - DocumentViewer.js
<object data={pdf_url}>
  <embed src={pdf_url} />  {/* ← Fallback pode causar dupla requisição */}
</object>
```

Navegadores podem fazer **duas requisições**:
1. Uma para o `<object>`
2. Outra para o `<embed>` (fallback)

---

## ✅ Soluções Implementadas

### Solução 1: Backend - Correção do save() ✅

**Arquivo:** `backend/documentos/models.py`

```python
# ✅ DEPOIS - Corrigido
def save(self, *args, **kwargs):
    """
    Calcula o hash MD5 do arquivo no primeiro save
    """
    # Verifica se é um update parcial
    update_fields = kwargs.get('update_fields', None)
    should_process_file = (
        update_fields is None or 
        'arquivo' in update_fields or
        'nome_original' in update_fields or
        'tipo_arquivo' in update_fields or
        'tamanho' in update_fields or
        'hash_md5' in update_fields
    )
    
    # Só processa o arquivo se necessário
    if should_process_file:
        if self.arquivo and not self.hash_md5:
            md5_hash = hashlib.md5()
            for chunk in self.arquivo.chunks():
                md5_hash.update(chunk)
            self.hash_md5 = md5_hash.hexdigest()
        
        # Extrai tipo e tamanho do arquivo
        if self.arquivo:
            try:
                self.nome_original = os.path.basename(self.arquivo.name)
                self.tipo_arquivo = os.path.splitext(self.arquivo.name)[1].lower().replace('.', '')
                self.tamanho = self.arquivo.size
            except (FileNotFoundError, OSError):
                # Se o arquivo físico não existir, mantém os valores existentes
                pass

    super().save(*args, **kwargs)
```

**Benefícios:**
- ✅ Não acessa arquivo em updates parciais (`visualizacoes`, `ativo`, etc)
- ✅ Trata exceção se arquivo não existir
- ✅ Performance melhorada
- ✅ Evita crashes

### Solução 2: Frontend - Uso de iframe ✅

**Arquivo:** `frontend/src/components/DocumentViewer.js`

```jsx
// ✅ DEPOIS - Usando iframe simples
{isPDF && (
  <iframe
    src={documento.arquivo_url}
    type="application/pdf"
    style={{
      width: '100%',
      height: '100%',
      border: 'none',
    }}
    title={documento.titulo}
    onLoad={handleLoadSuccess}
    onError={handleLoadError}
  />
)}
```

**Benefícios:**
- ✅ Requisição única ao PDF
- ✅ Sem fallback duplo
- ✅ Compatível com todos navegadores modernos
- ✅ Menos overhead

---

## 🚀 Deploy das Correções

### Passo 1: Build Backend ✅ (FEITO)

```powershell
# No Windows
cd C:\sistema-advocacia
docker build -t enionacci/advocacia-backend:latest ./backend
docker push enionacci/advocacia-backend:latest
```

### Passo 2: Build Frontend 🔄 (FAZER)

```powershell
# No Windows
cd C:\sistema-advocacia
docker build -t enionacci/advocacia-frontend:latest ./frontend
docker push enionacci/advocacia-frontend:latest
```

### Passo 3: Atualizar na VPS 🔄 (FAZER)

```bash
# Na VPS via SSH
# Se usando Docker Swarm/Easypanel:
docker service update --force advocacia_advocacia_backend
docker service update --force advocacia_advocacia_frontend

# OU via painel Easypanel:
# Ir em Services → advocacia-backend → Deploy → Redeploy
# Ir em Services → advocacia-frontend → Deploy → Redeploy
```

---

## 🧪 Como Testar

### Teste 1: Verificar Logs (Antes de testar)

```bash
# Na VPS, acompanhar logs em tempo real
docker service logs -f advocacia_advocacia_backend

# Deve NÃO aparecer mais:
# ❌ FileNotFoundError: [Errno 2] No such file or directory
```

### Teste 2: Visualizar PDF

1. Acesse o sistema
2. Vá em **Documentos**
3. Clique no ícone de visualização (👁️) em um PDF
4. **Deve:**
   - ✅ Abrir modal rapidamente
   - ✅ Carregar PDF inline
   - ✅ NÃO dar erro 500
   - ✅ Incrementar contador de visualizações

### Teste 3: Upload Novo PDF

1. Faça upload de um novo PDF
2. Tente visualizar imediatamente
3. **Deve funcionar perfeitamente**

### Teste 4: Incrementar Visualizações

```bash
# Teste via API direto
curl -X POST \
  https://seu-dominio.com/api/documentos/11/incrementar_visualizacao/ \
  -H "Authorization: Bearer seu-token"

# Deve retornar:
# {"visualizacoes": 5}  (ou o número atual + 1)
```

---

## 📊 Comparação: Antes vs Depois

### ❌ ANTES

```
Clique Visualizar
  ↓ (100ms)
POST /incrementar_visualizacao/
  ↓ (50ms)
FileNotFoundError ❌
  ↓ (100ms)
500 Internal Server Error
  ↓ (200ms)
Retry automático do navegador
  ↓
FileNotFoundError ❌
  ↓
LOOP 🔄 (pode durar 5-10 segundos)
  ↓
Timeout ou desiste
```

**Tempo total:** 5-10 segundos + erro

### ✅ DEPOIS

```
Clique Visualizar
  ↓ (100ms)
POST /incrementar_visualizacao/
  ↓ (50ms)
Incrementa sem acessar arquivo ✅
  ↓ (50ms)
GET /media/documentos/arquivo.pdf
  ↓ (200ms)
PDF carregado! 🎉
```

**Tempo total:** ~400ms + sucesso

---

## 🔒 Bônus: Arquivos Órfãos no Banco

Se você ainda tiver registros no banco apontando para arquivos que não existem:

### Opção 1: Limpar Documentos Órfãos

```python
# Via Django Shell
docker exec -it <container_id> python manage.py shell

from documentos.models import Documento
import os

# Encontrar documentos com arquivos faltando
orfaos = []
for doc in Documento.objects.filter(ativo=True):
    if doc.arquivo and not os.path.exists(doc.arquivo.path):
        orfaos.append(doc.id)
        print(f"Órfão: {doc.id} - {doc.nome_original}")

print(f"\nTotal de órfãos: {len(orfaos)}")

# Marcar como inativos (soft delete)
Documento.objects.filter(id__in=orfaos).update(ativo=False)
print(f"Marcados como inativos: {len(orfaos)}")
```

### Opção 2: Deletar Permanentemente

```python
# ⚠️ CUIDADO: Deleta permanentemente!
Documento.objects.filter(id__in=orfaos).delete()
```

### Opção 3: Sincronizar Arquivos do PC

```powershell
# Se quiser manter os registros, sincronize os arquivos
.\sync-media.ps1 -VpsUser seu_usuario -VpsHost seu_servidor.com
```

---

## 🎯 Checklist Final

- [x] ✅ Corrigido `models.py` (backend)
- [x] ✅ Corrigido `DocumentViewer.js` (frontend)
- [x] ✅ Build backend feito
- [ ] 🔄 Build frontend (FAZER)
- [ ] 🔄 Push frontend (FAZER)
- [ ] 🔄 Deploy na VPS (FAZER)
- [ ] 🔄 Testar visualização de PDF
- [ ] 🔄 Verificar logs sem erros

---

## 📝 Comandos Rápidos

```powershell
# Build e Push Frontend
cd C:\sistema-advocacia
docker build -t enionacci/advocacia-frontend:latest ./frontend
docker push enionacci/advocacia-frontend:latest
```

```bash
# Atualizar na VPS (Easypanel/Swarm)
docker service update --force advocacia_advocacia_frontend

# Ver logs
docker service logs -f advocacia_advocacia_backend | grep -v "GET /api/health"
```

---

**Data:** 07/10/2025  
**Status:** Backend ✅ | Frontend 🔄 | Deploy 🔄  
**Prioridade:** 🔴 ALTA
