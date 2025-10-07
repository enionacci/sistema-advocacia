# Deploy Script para Docker Hub
# Substitua 'seuusername' pelo seu username do Docker Hub

param(
    [string]$DockerUser = "enionacci",  # SUBSTITUA pelo seu username do Docker Hub
    [string]$Version = "latest"
)

Write-Host "🚀 Iniciando deploy para Docker Hub..." -ForegroundColor Green
Write-Host ""

# Verificar se está logado no Docker
Write-Host "🔐 Verificando login no Docker..." -ForegroundColor Yellow
$loginCheck = docker info 2>&1 | Select-String "Username"
if (-not $loginCheck) {
    Write-Host "❌ Você não está logado no Docker Hub!" -ForegroundColor Red
    Write-Host "Execute: docker login" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Login confirmado" -ForegroundColor Green
Write-Host ""

# Build Backend
Write-Host "📦 Construindo imagem do backend..." -ForegroundColor Yellow
docker build -t ${DockerUser}/advocacia-backend:${Version} ./backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao construir backend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend construído com sucesso" -ForegroundColor Green
Write-Host ""

# Build Frontend
Write-Host "📦 Construindo imagem do frontend..." -ForegroundColor Yellow
docker build -t ${DockerUser}/advocacia-frontend:${Version} ./frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao construir frontend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend construído com sucesso" -ForegroundColor Green
Write-Host ""

# Push Backend
Write-Host "☁️  Enviando backend para Docker Hub..." -ForegroundColor Yellow
docker push ${DockerUser}/advocacia-backend:${Version}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao enviar backend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend enviado com sucesso" -ForegroundColor Green
Write-Host ""

# Push Frontend
Write-Host "☁️  Enviando frontend para Docker Hub..." -ForegroundColor Yellow
docker push ${DockerUser}/advocacia-frontend:${Version}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao enviar frontend!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend enviado com sucesso" -ForegroundColor Green
Write-Host ""

# Resumo
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Imagens criadas:" -ForegroundColor Yellow
Write-Host "   - ${DockerUser}/advocacia-backend:${Version}"
Write-Host "   - ${DockerUser}/advocacia-frontend:${Version}"
Write-Host ""
Write-Host "🔗 Ver no Docker Hub:" -ForegroundColor Yellow
Write-Host "   https://hub.docker.com/r/${DockerUser}/advocacia-backend"
Write-Host "   https://hub.docker.com/r/${DockerUser}/advocacia-frontend"
Write-Host ""
Write-Host "🚀 Próximos passos na VPS:" -ForegroundColor Yellow
Write-Host "   1. Fazer login: ssh usuario@vps" -ForegroundColor White
Write-Host "   2. Fazer pull: docker-compose pull" -ForegroundColor White
Write-Host "   3. Reiniciar: docker-compose up -d --force-recreate" -ForegroundColor White
Write-Host ""
