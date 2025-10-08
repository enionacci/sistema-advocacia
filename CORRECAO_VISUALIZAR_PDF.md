# 🐛 CORREÇÃO: FileNotFoundError ao visualizar PDFs na VPS

## 📋 Problema Identificado

### Erro Original
```
FileNotFoundError: [Errno 2] No such file or directory: 
'/app/media/documentos/escritorio_9/cliente_17/2025/10/1004850-59.2020.8.26.0526_1.pdf'
```

### Causa Raiz

**Dois problemas identificados:**

#### 1. ⚠️ Desenvolvimento Local + Banco de Dados Remoto

```
Fluxo do Problema:
┌─────────────────────────────────────────┐
│ 1. Desenvolvimento Local (Windows)     │
│    - Upload de PDF via frontend        │
│    - Arquivo salvo em:                  │
│      C:\sistema-advocacia\backend\media│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. Banco de Dados (VPS/Easypanel)      │
│    - Registro criado com path:          │
│      /app/media/documentos/...          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. Deploy Docker (VPS)                  │
│    - Container busca arquivo em:        │
│      /app/media/documentos/...          │
│    - ❌ Arquivo NÃO existe lá!          │
│    - Arquivo está no PC local           │
└─────────────────────────────────────────┘
```

#### 2. 🐞 Bug no método `save()` do modelo

O método `save()` do modelo `Documento` **sempre** tentava acessar `self.arquivo.size`, mesmo quando:
- Era um update parcial (ex: `update_fields=['visualizacoes']`)
- O arquivo físico não existia mais
- Estava fazendo soft delete

```python
# ❌ CÓDIGO PROBLEMÁTICO (ANTES)
def save(self, *args, **kwargs):
    if self.arquivo:
        self.nome_original = os.path.basename(self.arquivo.name)
        self.tipo_arquivo = os.path.splitext(self.arquivo.name)[1].lower().replace('.', '')
        self.tamanho = self.arquivo.size  # ← ERRO: sempre tenta acessar, mesmo em updates parciais
    super().save(*args, **kwargs)
```

---

## ✅ Soluções Implementadas

### Solução 1: Correção do Método `save()`

**Arquivo:** `backend/documentos/models.py`

```python
# ✅ CÓDIGO CORRIGIDO (DEPOIS)
def save(self, *args, **kwargs):
    """
    Calcula o hash MD5 do arquivo no primeiro save
    """
    # Verifica se é um update parcial (ex: apenas visualizacoes, ativo, etc)
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
- ✅ Não tenta acessar arquivo em updates parciais
- ✅ Trata exceção se arquivo não existir
- ✅ Performance melhorada (não processa arquivo desnecessariamente)
- ✅ Evita erros em `incrementar_visualizacoes()` e `perform_destroy()`

---

### Solução 2: Sincronização de Arquivos Media

#### Opção A: Script Automático (Recomendado)

**Criado:** `sync-media.ps1`

```powershell
# Uso básico
.\sync-media.ps1 -VpsUser seu_usuario -VpsHost seu_servidor.com

# Ver ajuda
.\sync-media.ps1 -Help

# Modo teste (não executa)
.\sync-media.ps1 -DryRun
```

**O que o script faz:**
1. ✅ Compacta pasta `media/` local
2. ✅ Transfere via SCP para VPS
3. ✅ Faz backup dos arquivos atuais na VPS
4. ✅ Extrai arquivos no volume Docker
5. ✅ Ajusta permissões (1000:1000, 755)
6. ✅ Limpa arquivos temporários

#### Opção B: Manual

```powershell
# 1. No Windows - Compactar
cd C:\sistema-advocacia\backend
tar -czf media-backup.tar.gz media/

# 2. Transferir
scp media-backup.tar.gz usuario@servidor:~/sistema-advocacia/

# 3. Na VPS - Extrair
ssh usuario@servidor
cd ~/sistema-advocacia
tar -xzf media-backup.tar.gz -C volumes/backend-media/ --strip-components=1
sudo chown -R 1000:1000 volumes/backend-media/
chmod -R 755 volumes/backend-media/
rm media-backup.tar.gz
```

---

## 🚀 Processo de Deploy Completo

### 1️⃣ Corrigir o Código (✅ FEITO)
```powershell
# Já corrigimos backend/documentos/models.py
```

### 2️⃣ Build e Push da Nova Imagem
```powershell
cd C:\sistema-advocacia

# Build apenas do backend
docker build -t enionacci/advocacia-backend:latest ./backend

# Push para Docker Hub
docker push enionacci/advocacia-backend:latest
```

### 3️⃣ Sincronizar Arquivos Media
```powershell
# Usando o script
.\sync-media.ps1 -VpsUser seu_usuario -VpsHost seu_servidor.com
```

### 4️⃣ Atualizar Container na VPS
```bash
# Conectar à VPS
ssh usuario@servidor

# Parar container
docker stop advocacia-backend

# Remover container antigo
docker rm advocacia-backend

# Fazer pull da nova imagem
docker pull enionacci/advocacia-backend:latest

# Iniciar novamente
cd ~/sistema-advocacia
docker-compose -f docker-compose.prod.yml up -d

# Verificar logs
docker logs -f advocacia-backend
```

### 5️⃣ Testar
- Acesse o frontend
- Tente visualizar um PDF
- Verifique os logs: `docker logs advocacia-backend`

---

## 🔍 Verificações Pós-Deploy

### Verificar Arquivos na VPS

```bash
# 1. Arquivos no volume
ls -la ~/sistema-advocacia/volumes/backend-media/documentos/

# 2. Arquivos dentro do container
docker exec advocacia-backend ls -la /app/media/documentos/

# 3. Tamanho total
du -sh ~/sistema-advocacia/volumes/backend-media/

# 4. Contar arquivos
find ~/sistema-advocacia/volumes/backend-media/ -type f | wc -l

# 5. Permissões
ls -la ~/sistema-advocacia/volumes/backend-media/documentos/escritorio_*/
```

### Testar API

```bash
# No container, testar acesso ao arquivo
docker exec advocacia-backend python manage.py shell
```

```python
from documentos.models import Documento

# Pegar documento de teste
doc = Documento.objects.first()
print(f"Arquivo: {doc.arquivo.name}")
print(f"Path completo: {doc.arquivo.path}")

# Verificar se arquivo existe
import os
print(f"Existe? {os.path.exists(doc.arquivo.path)}")

# Verificar tamanho
print(f"Tamanho: {doc.arquivo.size} bytes")
```

---

## 📊 Comparação: Antes vs Depois

### ❌ ANTES

```python
# Incrementar visualizações
documento.incrementar_visualizacoes()
  └─> save(update_fields=['visualizacoes'])
      └─> self.tamanho = self.arquivo.size
          └─> FileNotFoundError ❌
```

### ✅ DEPOIS

```python
# Incrementar visualizações
documento.incrementar_visualizacoes()
  └─> save(update_fields=['visualizacoes'])
      └─> should_process_file = False (visualizacoes não está na lista)
          └─> Pula processamento do arquivo ✅
              └─> Sucesso! 🎉
```

---

## 🛡️ Prevenção Futura

### 1. Usar Banco Local para Desenvolvimento

**Crie:** `backend/.env.local`

```bash
DEBUG=True
SECRET_KEY=local-dev-key

# Banco LOCAL (não use produção)
DB_NAME=advocacia_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

FERNET_KEY=local-fernet-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Alternar entre ambientes:**

```powershell
# Desenvolvimento
cp backend/.env.local backend/.env

# Produção (deploy)
cp backend/.env.prod backend/.env
```

### 2. Adicionar Media ao .gitignore

```gitignore
# .gitignore
backend/media/*
!backend/media/.gitkeep

# Manter estrutura de pastas, mas não os arquivos
backend/media/documentos/*
!backend/media/documentos/.gitkeep
```

### 3. Backup Automatizado

**Criar:** `backup-media.ps1`

```powershell
# Backup diário
$DATE = Get-Date -Format "yyyyMMdd"
tar -czf "backup-media-$DATE.tar.gz" backend/media/

# Upload para cloud (exemplo)
# aws s3 cp "backup-media-$DATE.tar.gz" s3://seu-bucket/backups/
```

### 4. Cloud Storage (Futuro)

Para produção real, considere usar:
- **AWS S3** - Mais popular
- **Azure Blob Storage** - Microsoft
- **Google Cloud Storage** - Google
- **MinIO** - Open source (self-hosted)

```python
# settings.py com S3
INSTALLED_APPS += ['storages']

if not DEBUG:
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_STORAGE_BUCKET_NAME = 'advocacia-media'
    AWS_S3_REGION_NAME = 'us-east-1'
```

---

## 📚 Documentos Criados

1. ✅ **SYNC_MEDIA_VPS.md** - Guia completo de sincronização
2. ✅ **sync-media.ps1** - Script automático PowerShell
3. ✅ **CORRECAO_VISUALIZAR_PDF.md** - Este documento

---

## 🎯 Resumo Executivo

| Item | Status | Ação |
|------|--------|------|
| Bug no `save()` | ✅ Corrigido | Deploy nova imagem |
| Arquivos faltando | ⚠️ Pendente | Executar `sync-media.ps1` |
| Docker image | ⚠️ Pendente | Build + Push |
| Deploy VPS | ⚠️ Pendente | Pull + Restart |
| Testes | ⚠️ Pendente | Verificar visualização |

---

**Data:** 07/10/2025  
**Autor:** GitHub Copilot  
**Versão:** 1.0
