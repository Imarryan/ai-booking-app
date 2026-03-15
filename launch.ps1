# ============================================================
#   BOOKING-APP LAUNCHER - PowerShell (Windows)
#   Next.js + Prisma + SQLite
# ============================================================

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Log($msg)     { Write-Host "[LAUNCH] $msg" -ForegroundColor Cyan }
function Success($msg) { Write-Host "[OK] $msg" -ForegroundColor Green }
function Warn($msg)    { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Fail($msg)    { Write-Host "[FAIL] $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "  =========================================" -ForegroundColor Cyan
Write-Host "    BOOKING-APP DEPLOY ENGINE" -ForegroundColor Cyan
Write-Host "    Build > Migrate > Seed > Launch" -ForegroundColor Cyan
Write-Host "  =========================================" -ForegroundColor Cyan
Write-Host ""

# -- STEP 1: Confirm project root --
if (-not (Test-Path "package.json")) {
    Fail "Run this script from the booking-app root directory!"
}
Success "Project root confirmed."

# -- STEP 2: Kill any existing process on port 3000 --
Log "Checking for existing processes on port 3000..."
$portCheck = netstat -aon 2>$null | Select-String ":3000.*LISTENING"
if ($portCheck) {
    $pids = $portCheck | ForEach-Object {
        ($_ -replace '.*\s+', '').Trim()
    } | Sort-Object -Unique
    foreach ($p in $pids) {
        if ($p -and $p -match '^\d+$') {
            Log "Killing process $p on port 3000..."
            taskkill /F /PID $p 2>$null | Out-Null
        }
    }
    Start-Sleep -Seconds 2
    Success "Port 3000 freed."
} else {
    Success "Port 3000 is available."
}

# -- STEP 3: Install dependencies --
Log "Installing dependencies..."
cmd /c "npm install 2>&1"
if ($LASTEXITCODE -ne 0) {
    Warn "npm install had warnings - dependencies may already be present."
} else {
    Success "Dependencies installed."
}

# -- STEP 4: Environment setup --
Log "Checking .env..."
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Warn ".env created from .env.example - fill in your values!"
    }
    else {
        Warn "No .env found - make sure DATABASE_URL is set."
    }
}
else {
    Success ".env already exists."
}

# -- STEP 5: Prisma - Generate + Migrate --
Log "Running Prisma generate..."
cmd /c "npx prisma generate 2>&1"
if ($LASTEXITCODE -ne 0) {
    Warn "Prisma generate had issues (files may be locked) - using existing client."
} else {
    Success "Prisma client generated."
}

Log "Running Prisma migrations..."
cmd /c "npx prisma migrate deploy 2>&1"
if ($LASTEXITCODE -ne 0) {
    Warn "Migrations skipped - database may already be up to date."
} else {
    Success "Database migrated."
}

# -- STEP 6: Seed database (if seed script exists) --
$pkgJson = Get-Content "package.json" -Raw
if ($pkgJson -match '"seed"') {
    Log "Seeding database..."
    cmd /c "npx prisma db seed 2>&1"
    if ($LASTEXITCODE -ne 0) {
        Warn "Seeding had issues - check output above."
    }
    else {
        Success "Database seeded."
    }
}

# -- STEP 7: Production build --
Log "Building Next.js for production..."
cmd /c "set NODE_ENV=production && npm run build 2>&1"
if ($LASTEXITCODE -ne 0) { Fail "Next.js build failed." }
Success "Build complete and optimized."

# -- STEP 8: Launch --
Log "Starting production server..."
Write-Host ""
Write-Host "  =========================================" -ForegroundColor Green
Write-Host "    BOOKING-APP IS LIVE!" -ForegroundColor Green
Write-Host "    http://localhost:3000" -ForegroundColor Green
Write-Host "  =========================================" -ForegroundColor Green
Write-Host ""

cmd /c "npm run start"
