# Script de Deploy - Build e Push para Docker Hub
# Sistema de Advocacia - Backend e Frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Deploy Docker - Sistema de Advocacia" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurações
$DOCKER_USERNAME = "enionacci"  # ALTERE para seu username do Docker Hub
$BACKEND_IMAGE = "${DOCKER_USERNAME}/advocacia-backend"
$FRONTEND_IMAGE = "${DOCKER_USERNAME}/advocacia-frontend"
$TAG = "latest"  # Pode usar versões como: v1.0.0, v1.1.0, etc

Write-Host "📋 Configurações:" -ForegroundColor Yellow
Write-Host "   Docker Hub User: $DOCKER_USERNAME" -ForegroundColor White
Write-Host "   Backend Image:   $BACKEND_IMAGE:$TAG" -ForegroundColor White
Write-Host "   Frontend Image:  $FRONTEND_IMAGE:$TAG" -ForegroundColor White
Write-Host ""

# Verificar se está logado no Docker Hub
Write-Host "🔐 Verificando login no Docker Hub..." -ForegroundColor Yellow
$dockerLogin = docker info 2>&1 | Select-String "Username"
if (-not $dockerLogin) {
    Write-Host "❌ Você não está logado no Docker Hub!" -ForegroundColor Red
    Write-Host "   Execute: docker login" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Login verificado: $dockerLogin" -ForegroundColor Green
Write-Host ""

# ============================================
# BACKEND - Build e Push
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🐳 BACKEND - Django" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "📦 1/4 - Building backend image..." -ForegroundColor Yellow
docker build -t ${BACKEND_IMAGE}:${TAG} ./backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer build do backend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend image built successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🏷️  2/4 - Tagging backend image..." -ForegroundColor Yellow
docker tag ${BACKEND_IMAGE}:${TAG} ${BACKEND_IMAGE}:latest
Write-Host "✅ Backend image tagged!" -ForegroundColor Green
Write-Host ""

Write-Host "📤 3/4 - Pushing backend to Docker Hub..." -ForegroundColor Yellow
docker push ${BACKEND_IMAGE}:${TAG}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer push do backend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend pushed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "📤 4/4 - Pushing backend:latest tag..." -ForegroundColor Yellow
docker push ${BACKEND_IMAGE}:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer push do backend:latest!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend:latest pushed successfully!" -ForegroundColor Green
Write-Host ""

# ============================================
# FRONTEND - Build e Push
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "⚛️  FRONTEND - React" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "📦 1/4 - Building frontend image..." -ForegroundColor Yellow
docker build -t ${FRONTEND_IMAGE}:${TAG} ./frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer build do frontend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend image built successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🏷️  2/4 - Tagging frontend image..." -ForegroundColor Yellow
docker tag ${FRONTEND_IMAGE}:${TAG} ${FRONTEND_IMAGE}:latest
Write-Host "✅ Frontend image tagged!" -ForegroundColor Green
Write-Host ""

Write-Host "📤 3/4 - Pushing frontend to Docker Hub..." -ForegroundColor Yellow
docker push ${FRONTEND_IMAGE}:${TAG}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer push do frontend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend pushed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "📤 4/4 - Pushing frontend:latest tag..." -ForegroundColor Yellow
docker push ${FRONTEND_IMAGE}:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer push do frontend:latest!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend:latest pushed successfully!" -ForegroundColor Green
Write-Host ""

# ============================================
# RESUMO
# ============================================
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Images disponíveis no Docker Hub:" -ForegroundColor Yellow
Write-Host "   Backend:  $BACKEND_IMAGE:$TAG" -ForegroundColor White
Write-Host "   Frontend: $FRONTEND_IMAGE:$TAG" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Próximos passos na VPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Conecte-se à VPS:" -ForegroundColor Cyan
Write-Host "   ssh usuario@seu-servidor.com" -ForegroundColor White
Write-Host ""
Write-Host "2. Crie o arquivo .env com as variáveis:" -ForegroundColor Cyan
Write-Host "   nano .env" -ForegroundColor White
Write-Host ""
Write-Host "3. Faça pull das images:" -ForegroundColor Cyan
Write-Host "   docker pull $BACKEND_IMAGE:$TAG" -ForegroundColor White
Write-Host "   docker pull $FRONTEND_IMAGE:$TAG" -ForegroundColor White
Write-Host ""
Write-Host "4. Inicie os containers:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor White
Write-Host ""
Write-Host "5. Verifique os logs:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
