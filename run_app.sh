#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
export PATH="$DIR/.tools/node/bin:$DIR/.tools/bin:$PATH"

echo "=========================================================="
echo " Starting FortyGuard HeatShield | Thermal Resilience Hub"
echo "=========================================================="

# Start backend in background
echo "[1/2] Starting FastAPI Backend on http://0.0.0.0:8000..."
cd "$DIR/backend"
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start frontend in background
echo "[2/2] Starting React + Vite Frontend on http://0.0.0.0:5173..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM EXIT

echo ""
echo "FortyGuard HeatShield is running!"
echo "-> Frontend: http://localhost:5173"
echo "-> Backend API Docs: http://localhost:8000/docs"
echo "Press Ctrl+C to stop both servers."

wait
