# 🐳 Docker Setup - Sistema de Advocacia

## 📋 Pré-requisitos

- Docker Desktop instalado ([Download aqui](https://www.docker.com/products/docker-desktop))
- Docker Compose (já vem com Docker Desktop)

## 🚀 Como Usar

### Iniciar a aplicação completa

```powershell
# Inicia frontend + backend
docker-compose up

# Ou em modo detached (background)
docker-compose up -d
```

### Parar a aplicação

```powershell
# Para os containers
docker-compose down

# Para e remove volumes (limpa dados)
docker-compose down -v
```

### Reconstruir as imagens

```powershell
# Reconstrói as imagens antes de iniciar
docker-compose up --build

# Reconstrói forçando (sem cache)
docker-compose build --no-cache
```

### Ver logs

```powershell
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

## 🌐 Acessar a Aplicação

Após iniciar os containers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin

## 🔧 Comandos Úteis

### Executar comandos no backend

```powershell
# Criar migrações
docker-compose exec backend python manage.py makemigrations

# Aplicar migrações
docker-compose exec backend python manage.py migrate

# Criar superusuário
docker-compose exec backend python manage.py createsuperuser

# Shell Django
docker-compose exec backend python manage.py shell

# Acessar bash do container
docker-compose exec backend bash
```

### Executar comandos no frontend

```powershell
# Instalar nova dependência
docker-compose exec frontend npm install <pacote>

# Acessar shell do container
docker-compose exec frontend sh
```

### Verificar status dos containers

```powershell
# Lista containers rodando
docker-compose ps

# Informações detalhadas
docker-compose ps -a
```

## 🐛 Troubleshooting

### Porta já em uso

Se as portas 3000 ou 8000 já estiverem em uso:

```powershell
# Para processos locais
# No terminal pwsh onde o frontend/backend estão rodando, use Ctrl+C

# Ou modifique as portas no docker-compose.yml:
# "3001:3000"  # Acessa frontend em localhost:3001
# "8001:8000"  # Acessa backend em localhost:8001
```

### Container não inicia

```powershell
# Ver logs de erro
docker-compose logs backend
docker-compose logs frontend

# Reconstruir do zero
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Hot-reload não funciona no Windows

O `docker-compose.yml` já está configurado com `CHOKIDAR_USEPOLLING=true` para React. Se ainda não funcionar:

```powershell
# Reinicie o container
docker-compose restart frontend
```

### Problemas com permissões (Linux/Mac)

```bash
# Ajustar permissões do entrypoint
chmod +x backend/docker-entrypoint.sh
```

## 📦 Estrutura dos Containers

### Backend (Django)
- **Imagem Base**: `python:3.12-slim`
- **Porta**: 8000
- **Inclui**: Tesseract OCR + Poppler + PostgreSQL drivers
- **Volumes**: código, static files, media files

### Frontend (React)
- **Imagem Base**: `node:20-alpine`
- **Porta**: 3000
- **Volumes**: código, node_modules isolado

## 🔒 Variáveis de Ambiente

As variáveis de ambiente estão definidas no `docker-compose.yml`. Para produção, use um arquivo `.env` separado:

```powershell
# Crie um arquivo .env na raiz do projeto
DB_NAME=sistema_advocacia
DB_USER=postgres
DB_PASSWORD=sua_senha_segura
DB_HOST=easypanel.nacciadvocacia.com.br
DB_PORT=5432
```

E modifique o `docker-compose.yml` para usar:

```yaml
environment:
  - DEBUG=${DEBUG}
  - SECRET_KEY=${SECRET_KEY}
  # etc...
```

## 🎯 Próximos Passos

1. **Testar localmente**: `docker-compose up`
2. **Fazer alterações**: Os volumes sincronizam automaticamente
3. **Ver mudanças**: Frontend atualiza automaticamente, backend pode precisar restart
4. **Deploy**: Use Docker Swarm, Kubernetes ou serviços como Railway/Render

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Django in Docker](https://docs.docker.com/samples/django/)
- [React in Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
