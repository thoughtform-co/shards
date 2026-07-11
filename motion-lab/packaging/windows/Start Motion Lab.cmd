@echo off
cd /d "%~dp0"
set "HOSTNAME=127.0.0.1"
set "PORT=3210"
set "PATH=%~dp0runtime\node;%PATH%"
start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3210'"
"%~dp0runtime\node\node.exe" server.js
echo.
echo Motion Lab stopped. Press any key to close this window.
pause >nul
