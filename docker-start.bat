@echo off
echo ========================================================
echo   LANCEMENT DU SYSTEME DE GESTION DE PATRIMOINE (DOCKER)
echo ========================================================
echo Verification de Docker...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Docker n'est pas demarre. Veuillez demarrer Docker Desktop.
    pause
    exit /b 1
)

echo Construction et lancement des conteneurs orchestrés...
docker-compose up --build -d

echo ========================================================
echo   SERVICES DEMARRES AVEC SUCCES :
echo   - Frontend Angular :       http://localhost:4200
echo   - API Gateway Orchestré :  http://localhost:8080
echo   - MS Auth & Avis :         http://localhost:3000
echo   - MS Patrimoine :          http://localhost:3001
echo   - MS Circuit :             http://localhost:3002
echo   - MS Evenement :           http://localhost:3003
echo   - MS Reservation :         http://localhost:3004
echo ========================================================
pause
