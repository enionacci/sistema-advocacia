# 🚀 Guia Completo de Deploy - Docker + VPS

## 📋 Visão Geral

Este guia mostra como fazer o deploy do **Sistema de Advocacia** usando Docker na VPS.

---

## 🏗️ PARTE 1: Build e Push das Imagens (Seu Computador Local)

### Pré-requisitos

1. ✅ Docker Desktop instalado e rodando
2. ✅ Conta no [Docker Hub](https://hub.docker.com/)
3. ✅ Login feito no Docker: `docker login`

### Passo 1: Configurar Username do Docker Hub

Edite o arquivo `deploy-docker.ps1` e altere:

```powershell
$DOCKER_USERNAME = "enionacci"  # ← ALTERE para SEU username
```

### Passo 2: Executar o Script de Deploy

No PowerShell (como Administrador), execute:

```powershell
cd C:\sistema-advocacia
.\deploy-docker.ps1
```

**O script irá:**
- ✅ Verificar login no Docker Hub
- ✅ Build da imagem do backend
- ✅ Build da imagem do frontend
- ✅ Push das duas imagens para o Docker Hub
- ✅ Criar tags `latest` automaticamente

**Tempo estimado:** 10-15 minutos (primeira vez)

### Passo 3: Verificar Imagens no Docker Hub

Acesse: https://hub.docker.com/u/SEU_USERNAME

Você deve ver:
- 📦 `advocacia-backend:latest`
- 📦 `advocacia-frontend:latest`

---

## 🖥️ PARTE 2: Deploy na VPS

### Passo 1: Conectar à VPS

```bash
ssh usuario@easypanel.nacciadvocacia.com.br
# OU
ssh usuario@seu-ip-da-vps
```

### Passo 2: Instalar Docker (se necessário)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

### Passo 3: Criar Estrutura de Diretórios

```bash
# Criar diretório do projeto
mkdir -p ~/sistema-advocacia
cd ~/sistema-advocacia

# Criar diretórios para volumes
mkdir -p volumes/backend-static
mkdir -p volumes/backend-media
mkdir -p volumes/postgres-data
```

### Passo 4: Criar Arquivo docker-compose.prod.yml

```bash
nano docker-compose.prod.yml
```

Cole o conteúdo:

```yaml
version: '3.8'

services:
  # Backend Django - Produção
  backend:
    image: enionacci/advocacia-backend:latest
    container_name: advocacia-backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=${DEBUG:-False}
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
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend React - Produção
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

Salve: `Ctrl+O`, `Enter`, `Ctrl+X`

### Passo 5: Criar Arquivo .env

```bash
nano .env
```

Cole e **EDITE** os valores:

```bash
# DJANGO
SECRET_KEY=GERE_UMA_NOVA_SECRET_KEY_AQUI
DEBUG=False
ALLOWED_HOSTS=easypanel.nacciadvocacia.com.br,nacciadvocacia.com.br

# BANCO DE DADOS
DB_NAME=sistema_advocacia
DB_USER=postgres
DB_PASSWORD=@Gui020305
DB_HOST=easypanel.nacciadvocacia.com.br
DB_PORT=5432

# CRIPTOGRAFIA
FERNET_KEY=7RR3-W6pkGEKUwH3u5chq4wS-811puFPoI2jEmNH97M=

# FRONTEND
REACT_APP_API_URL=https://easypanel.nacciadvocacia.com.br/api

# HUGGING FACE
HF_TOKEN=seu_token_huggingface_aqui
```

**⚠️ IMPORTANTE:** Gere novas chaves para produção!

```bash
# Gerar SECRET_KEY
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Gerar FERNET_KEY
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Salve: `Ctrl+O`, `Enter`, `Ctrl+X`

### Passo 6: Fazer Pull das Imagens

```bash
docker login  # Se ainda não estiver logado

docker pull enionacci/advocacia-backend:latest
docker pull enionacci/advocacia-frontend:latest
```

### Passo 7: Iniciar os Containers

```bash
# Iniciar em modo daemon (background)
docker-compose -f docker-compose.prod.yml up -d

# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f
```

### Passo 8: Executar Migrações e Criar Superusuário

```bash
# Executar migrações do Django
docker exec -it advocacia-backend python manage.py migrate

# Coletar arquivos estáticos
docker exec -it advocacia-backend python manage.py collectstatic --noinput

# Criar superusuário
docker exec -it advocacia-backend python manage.py createsuperuser
```

### Passo 9: Verificar Status

```bash
# Ver containers rodando
docker ps

# Ver logs do backend
docker logs advocacia-backend

# Ver logs do frontend
docker logs advocacia-frontend

# Ver uso de recursos
docker stats
```

---

## 🔄 ATUALIZAÇÕES FUTURAS

Quando fizer mudanças no código:

### No Seu Computador Local:

```powershell
# 1. Fazer build e push novamente
.\deploy-docker.ps1
```

### Na VPS:

```bash
# 2. Parar containers
docker-compose -f docker-compose.prod.yml down

# 3. Fazer pull das novas imagens
docker pull enionacci/advocacia-backend:latest
docker pull enionacci/advocacia-frontend:latest

# 4. Iniciar containers
docker-compose -f docker-compose.prod.yml up -d

# 5. Executar migrações (se houver)
docker exec -it advocacia-backend python manage.py migrate
```

---

## 🐛 TROUBLESHOOTING

### Container não inicia

```bash
# Ver logs detalhados
docker logs advocacia-backend --tail 100
docker logs advocacia-frontend --tail 100
```

### Erro de conexão com banco de dados

```bash
# Verificar se o banco está acessível
docker exec -it advocacia-backend python manage.py check --database default

# Testar conexão direta
docker exec -it advocacia-backend python manage.py dbshell
```

### Frontend não conecta ao backend

```bash
# Verificar variáveis de ambiente
docker exec advocacia-frontend env | grep REACT_APP_API_URL

# Verificar rede
docker network inspect advocacia-network
```

### Limpar tudo e recomeçar

```bash
# Parar e remover containers
docker-compose -f docker-compose.prod.yml down -v

# Remover imagens antigas
docker image prune -a

# Remover volumes (CUIDADO: apaga dados!)
docker volume prune

# Recomeçar do Passo 6
```

---

## 📊 COMANDOS ÚTEIS

### Gerenciamento de Containers

```bash
# Parar todos os containers
docker-compose -f docker-compose.prod.yml stop

# Iniciar containers parados
docker-compose -f docker-compose.prod.yml start

# Reiniciar containers
docker-compose -f docker-compose.prod.yml restart

# Ver logs de um serviço específico
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Entrar no container
docker exec -it advocacia-backend bash
docker exec -it advocacia-frontend sh

# Ver processos dentro do container
docker top advocacia-backend
```

### Backup e Restore

```bash
# Backup dos volumes
tar -czf backup-media-$(date +%Y%m%d).tar.gz volumes/backend-media/
tar -czf backup-static-$(date +%Y%m%d).tar.gz volumes/backend-static/

# Backup do banco (se estiver em container)
docker exec advocacia-postgres pg_dump -U postgres sistema_advocacia > backup-db-$(date +%Y%m%d).sql
```

### Monitoramento

```bash
# CPU e Memória em tempo real
docker stats

# Espaço em disco dos containers
docker system df

# Ver todas as images
docker images

# Ver todos os volumes
docker volume ls
```

---

## 🔐 SEGURANÇA EM PRODUÇÃO

### Checklist de Segurança

- [ ] Gerar novas `SECRET_KEY` e `FERNET_KEY`
- [ ] Configurar `DEBUG=False`
- [ ] Definir `ALLOWED_HOSTS` corretamente
- [ ] Usar senhas fortes para banco de dados
- [ ] Configurar SSL/HTTPS com certificado
- [ ] Configurar firewall (UFW)
- [ ] Fazer backups regulares
- [ ] Configurar rate limiting
- [ ] Monitorar logs de acesso
- [ ] Manter Docker e sistema operacional atualizados

### Configurar Firewall (UFW)

```bash
# Instalar UFW
sudo apt install ufw -y

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir portas da aplicação (se necessário)
sudo ufw allow 8000/tcp
sudo ufw allow 3001/tcp

# Ativar firewall
sudo ufw enable

# Ver status
sudo ufw status
```

---

## 🌐 CONFIGURAR NGINX (Opcional mas Recomendado)

Se quiser usar Nginx como reverse proxy:

```bash
# Instalar Nginx
sudo apt install nginx -y

# Criar configuração
sudo nano /etc/nginx/sites-available/advocacia
```

```nginx
server {
    listen 80;
    server_name easypanel.nacciadvocacia.com.br;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static {
        alias /home/usuario/sistema-advocacia/volumes/backend-static;
    }

    # Media files
    location /media {
        alias /home/usuario/sistema-advocacia/volumes/backend-media;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/advocacia /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Consulte a documentação do Docker: https://docs.docker.com
3. Verifique variáveis de ambiente no `.env`
4. Certifique-se de que as portas estão abertas no firewall
5. Verifique conectividade com o banco de dados

---

**Última Atualização:** 07/10/2025  
**Versão do Docker:** 24.x  
**Versão do Docker Compose:** 2.x
