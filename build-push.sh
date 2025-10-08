# 🐳 Build e Push para Docker Hub

# ============================================
# BACKEND
# ============================================

# Build da imagem do backend
docker build -t enionacci/advocacia-backend:latest ./backend

# Push para Docker Hub
docker push enionacci/advocacia-backend:latest

# ============================================
# FRONTEND
# ============================================

# Build da imagem do frontend
docker build -t enionacci/advocacia-frontend:latest ./frontend

# Push para Docker Hub
docker push enionacci/advocacia-frontend:latest

# ============================================
# PRONTO! Imagens disponíveis em:
# - hub.docker.com/r/enionacci/advocacia-backend
# - hub.docker.com/r/enionacci/advocacia-frontend
# ============================================
