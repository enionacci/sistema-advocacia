# Script para build local das imagens Docker do backend e frontend
# Uso: ./build-local.ps1

Write-Host "Iniciando build local das imagens Docker..."

# Build backend (usando contexto correto)
Write-Host "Buildando imagem do backend..."
docker build -t advocacia-backend:latest -f backend/Dockerfile ./backend


# Build frontend (usando contexto correto)
Write-Host "Buildando imagem do frontend..."
docker build -t advocacia-frontend:latest -f frontend/Dockerfile ./frontend

Write-Host "Build local concluído. Use 'docker compose up' para subir os containers."
