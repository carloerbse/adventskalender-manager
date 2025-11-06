# stop-dev.ps1
# Stoppt alle laufenden Dev-Server

Write-Host "🛑 Stoppe Adventskalender-Manager Server..." -ForegroundColor Red
Write-Host ""

# Deno-Prozesse beenden
$denoProcesses = Get-Process -Name "deno" -ErrorAction SilentlyContinue
if ($denoProcesses) {
    Write-Host "⏹️  Stoppe Backend-Server (Deno)..." -ForegroundColor Yellow
    $denoProcesses | Stop-Process -Force
    Write-Host "   ✅ Backend gestoppt" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Kein Backend läuft" -ForegroundColor Gray
}

# Node-Prozesse (Vite) auf Port 5173 finden und beenden
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    Write-Host "⏹️  Stoppe Frontend-Server (Vite)..." -ForegroundColor Yellow
    $processId = $port5173.OwningProcess
    Stop-Process -Id $processId -Force
    Write-Host "   ✅ Frontend gestoppt" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Kein Frontend läuft auf Port 5173" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Alle Server gestoppt!" -ForegroundColor Green
