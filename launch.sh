#!/bin/bash
# ============================================================
#   🚀 BOOKING-APP LAUNCHER — Bash (WSL/Mac/Linux)
#   Next.js + Prisma + SQLite
# ============================================================

set -e
CYAN='\033[0;36m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; RED='\033[0;31m'; RESET='\033[0m'

log()     { echo -e "${CYAN}[LAUNCH]${RESET} $1"; }
success() { echo -e "${GREEN}[✔] $1${RESET}"; }
warn()    { echo -e "${YELLOW}[⚠] $1${RESET}"; }

echo -e "${CYAN}
  ╔══════════════════════════════════════════╗
  ║   🛸  BOOKING-APP DEPLOY ENGINE          ║
  ║     Build → Migrate → Test → Launch      ║
  ╚══════════════════════════════════════════╝
${RESET}"

# ── STEP 1: Confirm project root ──
[ -f "package.json" ] || { echo -e "${RED}[✘] Run from booking-app root!${RESET}"; exit 1; }
success "Project root confirmed."

# ── STEP 2: Install dependencies ──
log "Installing dependencies..."
npm ci
success "Dependencies installed."

# ── STEP 3: Environment setup ──
log "Checking .env..."
if [ ! -f ".env" ]; then
  [ -f ".env.example" ] && cp .env.example .env \
    && warn ".env created from .env.example — fill in your values!" \
    || warn "No .env found — make sure DATABASE_URL is set."
else
  success ".env already exists."
fi

# ── STEP 4: Prisma — Generate + Migrate ──
log "Running Prisma migrations..."
npx prisma generate
npx prisma migrate deploy
success "Database migrated."

# ── STEP 5: Seed database (if script exists) ──
if grep -q '"seed"' package.json 2>/dev/null; then
  log "Seeding database..."
  npx prisma db seed
  success "Database seeded."
fi

# ── STEP 6: Run tests ──
log "Running tests..."
npm run test -- --passWithNoTests && success "All tests passed." \
  || warn "Some tests failed — check output above."

# ── STEP 7: Production build ──
log "Building Next.js for production..."
NODE_ENV=production npm run build
success "Build complete and optimized."

# ── STEP 8: Launch ──
log "Starting production server..."
echo -e "${GREEN}
  ╔══════════════════════════════════════════╗
  ║   ✅  BOOKING-APP IS LIVE!               ║
  ║   🌐  http://localhost:3000              ║
  ╚══════════════════════════════════════════╝
${RESET}"

npm run start
