# 🐳 Build e Push para Docker Hub - PowerShell

Write-Host "🐳 Build e Push - Docker Hub" -ForegroundColor Cyan
Write-Host ""

# ============================================
# BACKEND
# ============================================
Write-Host "📦 Building backend..." -ForegroundColor Yellow
docker build -t enionacci/advocacia-backend:latest ./backend

Write-Host "📤 Pushing backend..." -ForegroundColor Yellow
docker push enionacci/advocacia-backend:latest

Write-Host "✅ Backend done!" -ForegroundColor Green
Write-Host ""

# ============================================
# FRONTEND
# ============================================
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
docker build -t enionacci/advocacia-frontend:latest ./frontend

Write-Host "📤 Pushing frontend..." -ForegroundColor Yellow
docker push enionacci/advocacia-frontend:latest

Write-Host "✅ Frontend done!" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Todas as imagens foram enviadas para o Docker Hub!" -ForegroundColor Green
