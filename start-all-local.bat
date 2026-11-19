@echo off
echo ========================================================
echo   DEMARRAGE LOCAL DES MICROSERVICES (SPRING BOOT)
echo ========================================================

:: Detection de Maven
set "MVN_CMD=mvn"
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.11-bin\6mqf5t809d9geo83kj4ttckcbc\apache-maven-3.9.11\bin\mvn.cmd" (
        set "MVN_CMD=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.11-bin\6mqf5t809d9geo83kj4ttckcbc\apache-maven-3.9.11\bin\mvn.cmd"
    )
)

echo 1. Lancement de ms-auth-user (Port 3000)...
start "ms-auth-user" cmd /k "cd ms-auth-user\ms-auth-user && "%MVN_CMD%" spring-boot:run"

timeout /t 5 /nobreak >nul

echo 2. Lancement de ms-patrimoine (Port 3001)...
start "ms-patrimoine" cmd /k "cd ms-patrimoine\ms-patrimoine && .\mvnw.cmd spring-boot:run"

timeout /t 5 /nobreak >nul

echo 3. Lancement de ms-circuit (Port 3002)...
start "ms-circuit" cmd /k "cd ms-circuit\ms-circuit && .\mvnw.cmd spring-boot:run"

echo 4. Lancement de ms-evenement (Port 3003)...
start "ms-evenement" cmd /k "cd ms-evenement\ms-evenement && .\mvnw.cmd spring-boot:run"

timeout /t 5 /nobreak >nul

echo 5. Lancement de ms-reservation (Port 3004)...
start "ms-reservation" cmd /k "cd ms-reservation\ms-reservation && .\mvnw.cmd spring-boot:run"

timeout /t 3 /nobreak >nul

echo 6. Lancement du Frontend Angular (Port 4200)...
start "frontend-angular" cmd /k "cd frontend-angular && node serve.js"

echo ========================================================
echo Microservices lances !
echo Frontend accessible sur : http://localhost:4200
echo ========================================================
pause
