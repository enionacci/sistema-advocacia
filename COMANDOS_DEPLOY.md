# 🚀 COMANDOS RÁPIDOS DE DEPLOY

## 📦 NO SEU COMPUTADOR (Windows)

### 1. Login no Docker Hub
```powershell
docker login
```

### 2. Build e Push das Imagens
```powershell
cd C:\sistema-advocacia
.\deploy-docker.ps1
```

**Isso vai:**
- ✅ Build do backend
- ✅ Build do frontend  
- ✅ Push para Docker Hub

---

## 🖥️ NA VPS (Linux)

### 1. Conectar à VPS
```bash
ssh usuario@easypanel.nacciadvocacia.com.br
```

### 2. Criar Estrutura
```bash
mkdir -p ~/sistema-advocacia
cd ~/sistema-advocacia
```

### 3. Criar docker-compose.prod.yml
```bash
nano docker-compose.prod.yml
```

Cole:
```yaml
version: '3.8'

services:
  backend:
    image: enionacci/advocacia-backend:latest
    container_name: advocacia-backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - SECRET_KEY=${SECRET_KEY}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT:-5432}
      - FERNET_KEY=${FERNET_KEY}
      - ALLOWED_HOSTS=${ALLOWED_HOSTS}
      - HF_TOKEN=${HF_TOKEN}
    volumes:
      - ./volumes/backend-static:/app/staticfiles
      - ./volumes/backend-media:/app/media
    restart: unless-stopped
    networks:
      - advocacia-network

  frontend:
    image: enionacci/advocacia-frontend:latest
    container_name: advocacia-frontend
    ports:
      - "3001:3001"
    environment:
      - REACT_APP_API_URL=${REACT_APP_API_URL}
      - NODE_ENV=production
      - PORT=3001
    restart: unless-stopped
    depends_on:
      - backend
    networks:
      - advocacia-network

networks:
  advocacia-network:
    driver: bridge
```

### 4. Criar .env
```bash
nano .env
```

Cole e EDITE:
```bash
SECRET_KEY=GERE_UMA_NOVA_SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=easypanel.nacciadvocacia.com.br,nacciadvocacia.com.br

DB_NAME=sistema_advocacia
DB_USER=postgres
DB_PASSWORD=@Gui020305
DB_HOST=easypanel.nacciadvocacia.com.br
DB_PORT=5432

FERNET_KEY=7RR3-W6pkGEKUwH3u5chq4wS-811puFPoI2jEmNH97M=

REACT_APP_API_URL=https://easypanel.nacciadvocacia.com.br/api

HF_TOKEN=seu_token_huggingface
```

### 5. Pull e Start
```bash
docker login
docker pull enionacci/advocacia-backend:latest
docker pull enionacci/advocacia-frontend:latest

docker-compose -f docker-compose.prod.yml up -d
```

### 6. Migrações
```bash
docker exec -it advocacia-backend python manage.py migrate
docker exec -it advocacia-backend python manage.py collectstatic --noinput
docker exec -it advocacia-backend python manage.py createsuperuser
```

### 7. Ver Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🔄 ATUALIZAR (Depois de mudanças)

### No Windows:
```powershell
.\deploy-docker.ps1
```

### Na VPS:
```bash
docker-compose -f docker-compose.prod.yml down
docker pull enionacci/advocacia-backend:latest
docker pull enionacci/advocacia-frontend:latest
docker-compose -f docker-compose.prod.yml up -d
docker exec -it advocacia-backend python manage.py migrate
```

---

## 🐛 DEBUG

```bash
# Ver logs
docker logs advocacia-backend
docker logs advocacia-frontend

# Entrar no container
docker exec -it advocacia-backend bash

# Ver status
docker ps
docker stats
```

---

## 🛑 PARAR/REMOVER

```bash
# Parar
docker-compose -f docker-compose.prod.yml stop

# Remover
docker-compose -f docker-compose.prod.yml down

# Remover com volumes (CUIDADO!)
docker-compose -f docker-compose.prod.yml down -v
```
