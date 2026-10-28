@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18+ is required. Install Node.js and run this file again.
  pause
  exit /b 1
)
echo Starting AgriSmart...
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"
node backend\server.js
pause
