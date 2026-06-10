Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting CRM Project (Backend and Frontend)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Get the directory of this script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrEmpty($ScriptDir)) { $ScriptDir = Get-Location }
Set-Location $ScriptDir

# Check directories
if (-not (Test-Path "live-back-main")) {
    Write-Host "Error: live-back-main directory not found." -ForegroundColor Red
    Exit 1
}
if (-not (Test-Path "live-front-main")) {
    Write-Host "Error: live-front-main directory not found." -ForegroundColor Red
    Exit 1
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$goInstalled = Get-Command go -ErrorAction SilentlyContinue
if (-not $goInstalled) {
    Write-Host "WARNING: Go is not installed or not in PATH. Please install Go to run the backend." -ForegroundColor Yellow
}

$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "WARNING: Node.js is not installed or not in PATH. Please install Node.js to run the frontend." -ForegroundColor Yellow
}

# Start backend
Write-Host "Launching Go Backend in a new window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    Set-Location '$ScriptDir\live-back-main';
    Write-Host 'Starting Go Backend Server...' -ForegroundColor Cyan;
    go run main.go;
    Read-Host 'Press Enter to exit'
"

# Install frontend dependencies if node_modules is missing
if (-not (Test-Path "live-front-main\node_modules")) {
    Write-Host "Frontend node_modules not found. Installing dependencies first..." -ForegroundColor Yellow
    Set-Location "$ScriptDir\live-front-main"
    npm install
    Set-Location $ScriptDir
}

# Start frontend
Write-Host "Launching React Frontend in a new window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    Set-Location '$ScriptDir\live-front-main';
    Write-Host 'Starting React/Vite Frontend Server...' -ForegroundColor Cyan;
    npm run dev;
    Read-Host 'Press Enter to exit'
"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Startup commands initiated!" -ForegroundColor Green
Write-Host "Go Backend will run at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "React Frontend will run at: check the Vite console window (usually http://localhost:5173)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
