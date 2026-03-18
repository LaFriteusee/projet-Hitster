@echo off
setlocal

set ROOT=%~dp0
set SERVER_DIR=%ROOT%hitster-web\server
set CLIENT_DIR=%ROOT%hitster-web\client
set NGROK=%ROOT%ngrok.exe

echo ========================================
echo  HITSTER - Lancement avec ngrok
echo ========================================
echo.

if not exist "%NGROK%" (
  echo ERREUR : ngrok.exe introuvable dans %ROOT%
  echo Deplace ngrok.exe dans le meme dossier que ce .bat
  pause
  exit /b 1
)

echo [1/3] Build du client React...
cd /d "%CLIENT_DIR%"
call npm run build
if errorlevel 1 (
  echo.
  echo ERREUR : le build a echoue. Verifie les erreurs ci-dessus.
  pause
  exit /b 1
)
echo Build OK.
echo.

echo [2/3] Demarrage du serveur...
start "Hitster - Serveur" cmd /k "cd /d "%SERVER_DIR%" && node src/index.js"
timeout /t 2 /nobreak >nul
echo Serveur lance sur le port 3003.
echo.

echo [3/3] Demarrage de ngrok...
echo L'URL publique apparaitra dans la fenetre ngrok.
echo Partage cette URL avec tes amis !
echo.
start "Hitster - ngrok" cmd /k ""%NGROK%" http 3003"

echo ========================================
echo  Tout est lance !
echo  Copie l'URL "Forwarding" depuis la
echo  fenetre ngrok et envoie-la a tes amis.
echo ========================================
pause
