# 🐳 Deploy para Docker Hub e VPS

## 📋 Pré-requisitos

1. Conta no Docker Hub: https://hub.docker.com/
2. Docker Desktop instalado e rodando
3. Acesso SSH à VPS

---

## 🚀 Passo a Passo - Deploy na VPS

### 1. Fazer Login no Docker Hub

```powershell
docker login
```

Você será solicitado a digitar:
- Username do Docker Hub
- Password (ou Personal Access Token)

### 2. Construir e Enviar Imagens

```powershell
# Substitua 'seuusername' pelo seu username do Docker Hub
$DOCKER_USER = "seuusername"

# Construir imagem do backend
docker build -t ${DOCKER_USER}/advocacia-backend:latest ./backend

# Construir imagem do frontend
docker build -t ${DOCKER_USER}/advocacia-frontend:latest ./frontend

# Enviar imagens para Docker Hub
docker push ${DOCKER_USER}/advocacia-backend:latest
docker push ${DOCKER_USER}/advocacia-frontend:latest
```

### 3. Criar docker-compose para Produção na VPS

Crie um arquivo `docker-compose.prod.yml` na VPS:

```yaml
version: '3.8'

services:
  backend:
    image: seuusername/advocacia-backend:latest
    container_name: advocacia-backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - SECRET_KEY=${SECRET_KEY}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_HOST=localhost  # Ou IP do PostgreSQL na VPS
      - DB_PORT=5432
      - FERNET_KEY=${FERNET_KEY}
    restart: unless-stopped

  frontend:
    image: seuusername/advocacia-frontend:latest
    container_name: advocacia-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://seu-dominio.com.br
    restart: unless-stopped
    depends_on:
      - backend
```

### 4. Conectar na VPS e Executar

```bash
# Conectar via SSH
ssh usuario@easypanel.nacciadvocacia.com.br

# Criar diretório para o projeto
mkdir -p ~/advocacia
cd ~/advocacia

# Criar arquivo .env com suas variáveis
nano .env

# Baixar o docker-compose.prod.yml
nano docker-compose.prod.yml
# Cole o conteúdo acima

# Fazer pull das imagens
docker pull seuusername/advocacia-backend:latest
docker pull seuusername/advocacia-frontend:latest

# Iniciar aplicação
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose logs -f
```

---

## 🔄 Workflow Recomendado

### **Desenvolvimento (Local)**
```powershell
# Trabalhar localmente com hot-reload
docker-compose up
```

### **Deploy (VPS)**
```powershell
# 1. Testar localmente primeiro
docker-compose up --build

# 2. Se estiver tudo OK, fazer build e push
docker build -t seuusername/advocacia-backend:latest ./backend
docker push seuusername/advocacia-backend:latest

docker build -t seuusername/advocacia-frontend:latest ./frontend
docker push seuusername/advocacia-frontend:latest

# 3. Na VPS, fazer pull e restart
ssh usuario@vps
cd ~/advocacia
docker-compose pull
docker-compose up -d --force-recreate
```

---

## 🛠️ Scripts Auxiliares

### Script Windows (PowerShell) - `deploy.ps1`

```powershell
# Configurar seu username
$DOCKER_USER = "seuusername"
$VERSION = "latest"

Write-Host "🚀 Iniciando deploy..." -ForegroundColor Green

# Build
Write-Host "📦 Construindo imagens..." -ForegroundColor Yellow
docker build -t ${DOCKER_USER}/advocacia-backend:${VERSION} ./backend
docker build -t ${DOCKER_USER}/advocacia-frontend:${VERSION} ./frontend

# Push
Write-Host "☁️  Enviando para Docker Hub..." -ForegroundColor Yellow
docker push ${DOCKER_USER}/advocacia-backend:${VERSION}
docker push ${DOCKER_USER}/advocacia-frontend:${VERSION}

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "Execute na VPS: docker-compose pull && docker-compose up -d --force-recreate"
```

### Script Linux/Mac (Bash) - `deploy.sh`

```bash
#!/bin/bash

# Configurar seu username
DOCKER_USER="seuusername"
VERSION="latest"

echo "🚀 Iniciando deploy..."

# Build
echo "📦 Construindo imagens..."
docker build -t ${DOCKER_USER}/advocacia-backend:${VERSION} ./backend
docker build -t ${DOCKER_USER}/advocacia-frontend:${VERSION} ./frontend

# Push
echo "☁️  Enviando para Docker Hub..."
docker push ${DOCKER_USER}/advocacia-backend:${VERSION}
docker push ${DOCKER_USER}/advocacia-frontend:${VERSION}

echo "✅ Deploy concluído!"
echo "Execute na VPS: docker-compose pull && docker-compose up -d --force-recreate"
```

---

## 🔐 Variáveis de Ambiente na VPS

Crie um arquivo `.env` na VPS com suas credenciais:

```env
# Django
SECRET_KEY=sua-secret-key-segura-aqui
DEBUG=False

# Database
DB_NAME=sistema_advocacia
DB_USER=postgres
DB_PASSWORD=@Gui020305
DB_HOST=localhost
DB_PORT=5432

# Encryption
FERNET_KEY=7RR3-W6pkGEKUwH3u5chq4wS-811puFPoI2jEmNH97M=

# OpenAI (se usar)
OPENAI_API_KEY=sua-chave-aqui
```

---

## 📊 Comparação

| Aspecto | Docker Desktop (Local) | Docker Hub + VPS |
|---------|------------------------|------------------|
| **Uso** | Desenvolvimento/Testes | Produção |
| **Velocidade** | ⚡ Instantâneo | 🐌 Precisa push/pull |
| **Hot-reload** | ✅ Sim | ❌ Não |
| **Internet** | ❌ Não precisa | ✅ Precisa |
| **Custo** | 💰 Grátis | 💰 Grátis (Docker Hub) |
| **Complexidade** | 😊 Simples | 🤔 Intermediária |

---

## 🎯 Recomendação

1. **Desenvolva localmente**: Use `docker-compose up` no Docker Desktop
2. **Teste tudo**: Certifique-se que está funcionando 100%
3. **Faça deploy**: Envie para Docker Hub e suba na VPS

---

## 🆘 Troubleshooting

### Erro: "denied: requested access to the resource is denied"
```powershell
# Fazer login novamente
docker login

# Verificar se o nome do usuário está correto
docker images | grep advocacia
```

### Erro: "Cannot connect to Docker daemon"
```powershell
# Iniciar Docker Desktop
# Aguardar ele inicializar completamente
```

### Erro na VPS: "port already in use"
```bash
# Ver o que está usando a porta
sudo lsof -i :8000
sudo lsof -i :3000

# Parar containers antigos
docker-compose down
```

---

## 📚 Recursos

- [Docker Hub](https://hub.docker.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Deploy](https://docs.docker.com/compose/production/)
