@echo off
setlocal

set ROOT=%~dp0
set SERVER_DIR=%ROOT%hitster-web\server
set CLIENT_DIR=%ROOT%hitster-web\client

echo ========================================
echo  HITSTER - Lanceur
echo ========================================
echo.
echo  [1] Jouer en local  (localhost)
echo  [2] Jouer avec ngrok (lien pour amis)
echo.
set /p MODE="Choix (1 ou 2) : "

if "%MODE%"=="2" goto ngrok_mode

:local_mode
echo.
echo Demarrage en local...
start "Hitster - Serveur" cmd /k "cd /d "%SERVER_DIR%" && node src/index.js"
timeout /t 2 /nobreak >nul
start "Hitster - Client" cmd /k "cd /d "%CLIENT_DIR%" && npm run dev"
echo.
echo Ouvre : http://localhost:5173
goto end

:ngrok_mode
echo.
echo Build du client...
cd /d "%CLIENT_DIR%"
call npm run build
if errorlevel 1 (
  echo ERREUR : le build a echoue.
  pause
  exit /b 1
)

echo.
echo Demarrage du serveur...
start "Hitster - Serveur" cmd /k "cd /d "%SERVER_DIR%" && node src/index.js"
timeout /t 2 /nobreak >nul

echo.
echo Demarrage de ngrok sur le port 3003...
echo L'URL publique apparait dans la fenetre ngrok.
echo Partage cette URL avec tes amis !
echo.
start "Hitster - ngrok" cmd /k "ngrok http 3003"

:end
echo.
pause
