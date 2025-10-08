# 📁 Sincronizar Arquivos Media com VPS

## 🚨 PROBLEMA IDENTIFICADO

Os arquivos foram enviados localmente, mas o banco de dados está na VPS.  
**Resultado:** Banco aponta para arquivos que não existem no container Docker.

---

## ✅ SOLUÇÃO 1: Transferir arquivos via SCP (Recomendado)

### No PowerShell (Windows):

```powershell
# Compactar pasta media local
cd C:\sistema-advocacia\backend
tar -czf media-backup.tar.gz media/

# Transferir para VPS (substitua com seus dados)
scp media-backup.tar.gz usuario@easypanel.nacciadvocacia.com.br:~/sistema-advocacia/
```

### Na VPS (Linux):

```bash
# Conectar à VPS
ssh usuario@easypanel.nacciadvocacia.com.br

# Ir para o diretório
cd ~/sistema-advocacia

# Extrair arquivos no volume do Docker
tar -xzf media-backup.tar.gz -C volumes/backend-media/

# Ajustar permissões
sudo chown -R 1000:1000 volumes/backend-media/
chmod -R 755 volumes/backend-media/

# Verificar arquivos
ls -la volumes/backend-media/documentos/

# Remover arquivo compactado
rm media-backup.tar.gz
```

---

## ✅ SOLUÇÃO 2: Usar Banco de Dados Local para Desenvolvimento

Crie um arquivo `.env` local separado:

### backend/.env.local

```bash
DEBUG=True
SECRET_KEY=sua-chave-local-aqui

# BANCO LOCAL (SQLite ou PostgreSQL local)
DB_NAME=sistema_advocacia_local
DB_USER=postgres
DB_PASSWORD=senha_local
DB_HOST=localhost
DB_PORT=5432

FERNET_KEY=sua-fernet-key-local

ALLOWED_HOSTS=localhost,127.0.0.1
```

**Vantagens:**
- Desenvolvimento isolado
- Não afeta produção
- Arquivos ficam organizados

**Desvantagens:**
- Dados duplicados
- Precisa migrar dados manualmente

---

## ✅ SOLUÇÃO 3: Volume Compartilhado (Cloud Storage)

Configure para salvar arquivos em S3, Azure Blob, ou similar:

```bash
pip install django-storages boto3
```

### backend/config/settings.py

```python
# Adicione ao INSTALLED_APPS
INSTALLED_APPS = [
    ...
    'storages',
]

# Configuração AWS S3 (exemplo)
if not DEBUG:
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = 'us-east-1'
    
    # Arquivos Media
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/'
```

---

## 🔍 VERIFICAR ARQUIVOS NA VPS

```bash
# Conectar à VPS
ssh usuario@easypanel.nacciadvocacia.com.br

# Ver arquivos no volume
ls -la ~/sistema-advocacia/volumes/backend-media/documentos/

# Verificar dentro do container
docker exec advocacia-backend ls -la /app/media/documentos/

# Verificar tamanho
du -sh ~/sistema-advocacia/volumes/backend-media/
```

---

## 🛠️ SCRIPT AUTOMÁTICO DE SINCRONIZAÇÃO

### sync-media.ps1 (Windows)

```powershell
# Sincroniza media local → VPS

$VPS_USER = "usuario"
$VPS_HOST = "easypanel.nacciadvocacia.com.br"
$LOCAL_MEDIA = "C:\sistema-advocacia\backend\media"
$REMOTE_PATH = "~/sistema-advocacia/volumes/backend-media"

Write-Host "📦 Compactando arquivos..." -ForegroundColor Yellow
cd C:\sistema-advocacia\backend
tar -czf media-backup.tar.gz media/

Write-Host "📤 Enviando para VPS..." -ForegroundColor Yellow
scp media-backup.tar.gz ${VPS_USER}@${VPS_HOST}:~/

Write-Host "📥 Extraindo na VPS..." -ForegroundColor Yellow
ssh ${VPS_USER}@${VPS_HOST} @"
    cd ~/sistema-advocacia
    tar -xzf ~/media-backup.tar.gz -C volumes/backend-media/ --strip-components=1
    sudo chown -R 1000:1000 volumes/backend-media/
    chmod -R 755 volumes/backend-media/
    rm ~/media-backup.tar.gz
"@

Write-Host "🧹 Limpando arquivo local..." -ForegroundColor Yellow
cd C:\sistema-advocacia\backend
Remove-Item media-backup.tar.gz

Write-Host "✅ Sincronização completa!" -ForegroundColor Green
```

### Usar:

```powershell
.\sync-media.ps1
```

---

## ⚠️ IMPORTANTE

1. **Nunca use banco de produção para desenvolvimento local**
2. **Faça backup antes de sincronizar**
3. **Verifique permissões após transferir arquivos**
4. **Use `.gitignore` para não commitar arquivos media**

---

**Última Atualização:** 07/10/2025
