# start-dev.ps1
# Startet Backend und Frontend in separaten Terminal-Fenstern

Write-Host "Starte Adventskalender-Manager Development Server..." -ForegroundColor Green
Write-Host ""

# Backend in neuem Terminal starten
Write-Host "Starte Backend-Server (Deno)..." -ForegroundColor Cyan
$backendCmd = "cd '$PWD'; Write-Host 'BACKEND SERVER' -ForegroundColor Green; deno run --allow-net --allow-read --allow-write server/server.ts"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Kurz warten damit Backend zuerst startet
Start-Sleep -Seconds 2

# Frontend in neuem Terminal starten
Write-Host "Starte Frontend-Server (Vite)..." -ForegroundColor Cyan
$frontendCmd = "cd '$PWD'; Write-Host 'FRONTEND SERVER' -ForegroundColor Green; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host ""
Write-Host "Server gestartet!" -ForegroundColor Green
Write-Host ""
Write-Host "Oeffne im Browser:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Zum Beenden: Schliesse die jeweiligen Terminal-Fenster" -ForegroundColor Red
