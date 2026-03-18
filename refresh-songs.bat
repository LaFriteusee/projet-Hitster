@echo off
setlocal

set ROOT=%~dp0
set SERVER_DIR=%ROOT%hitster-web\server

echo ========================================
echo  HITSTER - Rafraichissement des previews
echo ========================================
echo.
echo Les URLs Deezer expirent apres ~1 semaine.
echo Ce script les regenere automatiquement.
echo.

echo [1/2] Telechargement des nouvelles URLs...
cd /d "%SERVER_DIR%"
node scripts/buildSongsFromDeezer.js
if errorlevel 1 (
  echo.
  echo ERREUR : le script a echoue.
  pause
  exit /b 1
)

echo.
echo [2/2] Arret du serveur si en cours...
powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force" >nul 2>&1
timeout /t 1 /nobreak >nul

echo.
echo ========================================
echo  URLs mises a jour !
echo  Relance start.bat ou start-ngrok.bat
echo ========================================
pause
