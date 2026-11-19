Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  LANCEMENT LOCAL DES MICROSERVICES ET DU FRONTEND" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

# 1. ms-auth-user (3000)
Write-Host "1. Demarrage ms-auth-user sur http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'ms-auth-user\ms-auth-user'; mvn spring-boot:run"

Start-Sleep -Seconds 4

# 2. ms-patrimoine (3001)
Write-Host "2. Demarrage ms-patrimoine sur http://localhost:3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'ms-patrimoine\ms-patrimoine'; .\mvnw.cmd spring-boot:run"

Start-Sleep -Seconds 4

# 3. ms-circuit (3002)
Write-Host "3. Demarrage ms-circuit sur http://localhost:3002..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'ms-circuit\ms-circuit'; .\mvnw.cmd spring-boot:run"

# 4. ms-evenement (3003)
Write-Host "4. Demarrage ms-evenement sur http://localhost:3003..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'ms-evenement\ms-evenement'; .\mvnw.cmd spring-boot:run"

Start-Sleep -Seconds 4

# 5. ms-reservation (3004)
Write-Host "5. Demarrage ms-reservation sur http://localhost:3004..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'ms-reservation\ms-reservation'; .\mvnw.cmd spring-boot:run"

Start-Sleep -Seconds 2

# 6. Frontend Angular (4200)
Write-Host "6. Demarrage Frontend Angular sur http://localhost:4200..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend-angular'; node serve.js"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Tous les services sont en cours de demarrage !" -ForegroundColor Yellow
Write-Host "Frontend disponible a l'adresse : http://localhost:4200" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
