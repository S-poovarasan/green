# CRM Project Setup & Execution Guide

This repository contains:
- **`live-back-main`**: Go (Gin) backend API server.
- **`live-front-main`**: React (TypeScript + Vite) frontend app.

---

## Quick Start (Windows)

We have created startup scripts in the root directory to automate building, installing, and running both project components.

### Option A: Double-Click (Recommended)
1. Double-click the **`run-project.bat`** file in the root directory.
2. It will:
   - Check if you have backend and frontend directories.
   - Run `npm install` inside the frontend folder if dependencies are not already installed.
   - Open a separate Command Prompt window to run the **Go backend** on `http://localhost:8080`.
   - Open another Command Prompt window to run the **React frontend** on `http://localhost:5173`.

### Option B: PowerShell
1. Open PowerShell in the root directory (`d:\projects\crm project`).
2. Run the script:
   ```powershell
   .\run-project.ps1
   ```

---

## Environment Configuration

Both the frontend and backend require environment configurations. Default `.env` files have been automatically created for you:

### 1. Backend Config (`live-back-main/.env`)
Contains configurations for port, database connection, JWT tokens, and encrypt APIs:
```ini
PORT=8080
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=crm
DB_PORT=5432
DATABASE_URL=postgres://postgres:postgres@localhost:5432/crm?sslmode=disable
EMAILID=example@gmail.com
PASSWORD=your_app_password
ENCRYPT_API=yoursupersecretkey
ACCESS_TOKEN=your_jwt_access_token_secret
```

### 2. Frontend Config (`live-front-main/.env`)
Directs the Axios client to communicate with the local Go backend server:
```ini
VITE_API_URL=http://localhost:8080
```
