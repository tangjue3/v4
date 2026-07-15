@echo off
setlocal

chcp 65001 >nul
title EduMind Dev Server

cd /d "%~dp0"

echo ========================================
echo EduMind local startup
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found in PATH.
  echo Install Node.js first, then run this script again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found in PATH.
  echo Reinstall Node.js or fix PATH, then run this script again.
  pause
  exit /b 1
)

echo [OK] Node:
node --version
echo [OK] npm:
call npm --version
echo.

if "%~1"=="--check" (
  echo [OK] startup script check passed.
  exit /b 0
)

if not exist "node_modules\" (
  echo [INFO] node_modules not found. Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
  echo.
)

echo [INFO] Starting EduMind...
echo [INFO] API server: http://localhost:8787
echo [INFO] Vite will print the frontend URL below, usually http://localhost:5173
echo [INFO] Press Ctrl+C to stop.
echo.

call npm run dev

echo.
echo [INFO] EduMind stopped.
pause
