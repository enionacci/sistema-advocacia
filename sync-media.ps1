# 📦 Script de Sincronização de Media Files para VPS
# Sincroniza arquivos da pasta media local para o container Docker na VPS

param(
    [string]$VpsUser = "usuario",
    [string]$VpsHost = "easypanel.nacciadvocacia.com.br",
    [switch]$DryRun,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
📦 Script de Sincronização Media → VPS

USO:
    .\sync-media.ps1 -VpsUser seu_usuario -VpsHost seu_servidor.com

PARÂMETROS:
    -VpsUser    Usuário SSH da VPS (padrão: usuario)
    -VpsHost    Hostname/IP da VPS (padrão: easypanel.nacciadvocacia.com.br)
    -DryRun     Apenas simula, não executa
    -Help       Mostra esta ajuda

EXEMPLO:
    .\sync-media.ps1 -VpsUser admin -VpsHost 192.168.1.100

"@ -ForegroundColor Cyan
    exit 0
}

$ErrorActionPreference = "Stop"

# Configurações
$LOCAL_MEDIA = "C:\sistema-advocacia\backend\media"
$BACKUP_FILE = "media-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').tar.gz"
$REMOTE_PATH = "~/sistema-advocacia/volumes/backend-media"

Write-Host "`n🚀 Sincronização de Media Files" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Local:  $LOCAL_MEDIA" -ForegroundColor Yellow
Write-Host "VPS:    ${VpsUser}@${VpsHost}:${REMOTE_PATH}" -ForegroundColor Yellow
Write-Host ""

# Verificar se a pasta media existe
if (-not (Test-Path $LOCAL_MEDIA)) {
    Write-Host "❌ ERRO: Pasta media não encontrada em $LOCAL_MEDIA" -ForegroundColor Red
    exit 1
}

# Contar arquivos
$fileCount = (Get-ChildItem -Path $LOCAL_MEDIA -Recurse -File).Count
$totalSize = (Get-ChildItem -Path $LOCAL_MEDIA -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "📊 Estatísticas:" -ForegroundColor Cyan
Write-Host "   Arquivos: $fileCount" -ForegroundColor White
Write-Host "   Tamanho:  $([math]::Round($totalSize, 2)) MB" -ForegroundColor White
Write-Host ""

if ($DryRun) {
    Write-Host "🔍 MODO DRY-RUN: Nenhuma ação será executada" -ForegroundColor Yellow
    exit 0
}

# Confirmar ação
Write-Host "⚠️  Deseja continuar com a sincronização? (S/N): " -NoNewline -ForegroundColor Yellow
$confirm = Read-Host
if ($confirm -ne 'S' -and $confirm -ne 's') {
    Write-Host "❌ Operação cancelada" -ForegroundColor Red
    exit 0
}

try {
    # Passo 1: Compactar
    Write-Host "`n📦 [1/5] Compactando arquivos..." -ForegroundColor Yellow
    Set-Location "C:\sistema-advocacia\backend"
    tar -czf $BACKUP_FILE media/
    
    if (-not (Test-Path $BACKUP_FILE)) {
        throw "Falha ao criar arquivo de backup"
    }
    
    $backupSize = (Get-Item $BACKUP_FILE).Length / 1MB
    Write-Host "   ✓ Arquivo criado: $BACKUP_FILE ($([math]::Round($backupSize, 2)) MB)" -ForegroundColor Green

    # Passo 2: Transferir
    Write-Host "`n📤 [2/5] Enviando para VPS..." -ForegroundColor Yellow
    Write-Host "   Isso pode levar alguns minutos dependendo da conexão..." -ForegroundColor Gray
    scp $BACKUP_FILE "${VpsUser}@${VpsHost}:~/"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao transferir arquivo via SCP"
    }
    Write-Host "   ✓ Arquivo enviado com sucesso" -ForegroundColor Green

    # Passo 3: Fazer backup na VPS
    Write-Host "`n💾 [3/5] Fazendo backup dos arquivos atuais na VPS..." -ForegroundColor Yellow
    ssh "${VpsUser}@${VpsHost}" @"
        if [ -d ~/sistema-advocacia/volumes/backend-media/documentos ]; then
            sudo mv ~/sistema-advocacia/volumes/backend-media/documentos ~/sistema-advocacia/volumes/backend-media/documentos.backup-`$(date +%Y%m%d-%H%M%S)
            echo 'Backup criado'
        else
            echo 'Sem arquivos para backup'
        fi
"@
    Write-Host "   ✓ Backup criado" -ForegroundColor Green

    # Passo 4: Extrair na VPS
    Write-Host "`n📥 [4/5] Extraindo arquivos na VPS..." -ForegroundColor Yellow
    ssh "${VpsUser}@${VpsHost}" @"
        cd ~/sistema-advocacia/volumes/backend-media
        tar -xzf ~/$BACKUP_FILE --strip-components=1
        sudo chown -R 1000:1000 .
        chmod -R 755 .
        rm ~/$BACKUP_FILE
        echo 'Arquivos extraídos e permissões ajustadas'
"@
    
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao extrair arquivos na VPS"
    }
    Write-Host "   ✓ Arquivos extraídos e permissões ajustadas" -ForegroundColor Green

    # Passo 5: Verificar
    Write-Host "`n🔍 [5/5] Verificando arquivos na VPS..." -ForegroundColor Yellow
    $remoteFileCount = ssh "${VpsUser}@${VpsHost}" "find ~/sistema-advocacia/volumes/backend-media/documentos -type f 2>/dev/null | wc -l"
    Write-Host "   ✓ Arquivos sincronizados: $remoteFileCount" -ForegroundColor Green

    # Limpar arquivo local
    Write-Host "`n🧹 Limpando arquivo temporário..." -ForegroundColor Yellow
    Remove-Item $BACKUP_FILE -Force
    Write-Host "   ✓ Arquivo temporário removido" -ForegroundColor Green

    # Sucesso
    Write-Host "`n✅ SINCRONIZAÇÃO COMPLETA!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "📊 Resumo:" -ForegroundColor Cyan
    Write-Host "   Arquivos locais:  $fileCount" -ForegroundColor White
    Write-Host "   Arquivos na VPS:  $remoteFileCount" -ForegroundColor White
    Write-Host "   Tamanho total:    $([math]::Round($totalSize, 2)) MB" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Próximos passos:" -ForegroundColor Yellow
    Write-Host "   1. Reiniciar container: docker restart advocacia-backend" -ForegroundColor White
    Write-Host "   2. Verificar logs: docker logs advocacia-backend" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "`n❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    
    # Tentar limpar arquivo temporário
    if (Test-Path $BACKUP_FILE) {
        Remove-Item $BACKUP_FILE -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host "`n💡 Dicas:" -ForegroundColor Yellow
    Write-Host "   - Verifique sua conexão SSH" -ForegroundColor White
    Write-Host "   - Confirme usuário e host estão corretos" -ForegroundColor White
    Write-Host "   - Verifique se tem espaço em disco na VPS" -ForegroundColor White
    Write-Host "   - Use -Help para ver a documentação" -ForegroundColor White
    
    exit 1
}
