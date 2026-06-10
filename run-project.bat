@echo off
title CRM Project Startup Script
echo ==========================================
echo Starting CRM Project (Backend and Frontend)
echo ==========================================

:: Change directory to the root of the project
cd /d "%~dp0"

:: Check backend folder
if not exist "live-back-main" (
    echo Error: live-back-main directory not found!
    pause
    exit /b 1
)

:: Check frontend folder
if not exist "live-front-main" (
    echo Error: live-front-main directory not found!
    pause
    exit /b 1
)

:: Start backend in a new cmd window
echo Launching Go Backend in a new window...
start cmd /k "cd /d "%~dp0\live-back-main" && echo Starting Go Backend... && go run main.go"

:: Check frontend node_modules, install if missing
if not exist "live-front-main\node_modules" (
    echo Frontend node_modules not found. Installing dependencies...
    cd /d "%~dp0\live-front-main"
    call npm install
    cd /d "%~dp0"
)

:: Start frontend in a new cmd window
echo Launching React Frontend in a new window...
start cmd /k "cd /d "%~dp0\live-front-main" && echo Starting React/Vite Frontend... && npm run dev"

echo ==========================================
echo Project startup initiated!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo ==========================================
pause
