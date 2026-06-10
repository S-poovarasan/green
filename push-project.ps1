# PowerShell script to push project to GitHub
Write-Host "Checking git initialization..." -ForegroundColor Cyan
if (!(Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Green
}

Write-Host "Staging all files..." -ForegroundColor Yellow
git add .

Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit: CRM Project setup"

# Check if remote origin exists, if so update it, otherwise add it
$remoteExists = git remote | Select-String "^origin$"
if ($remoteExists) {
    Write-Host "Updating remote origin URL to https://github.com/S-poovarasan/green.git" -ForegroundColor Yellow
    git remote set-url origin https://github.com/S-poovarasan/green.git
} else {
    Write-Host "Adding remote origin URL https://github.com/S-poovarasan/green.git" -ForegroundColor Yellow
    git remote add origin https://github.com/S-poovarasan/green.git
}

Write-Host "Renaming branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "Done!" -ForegroundColor Green
