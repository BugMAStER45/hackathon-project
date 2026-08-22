#!/bin/bash

echo "==========================================================="
echo "🌡️  Starting FortyGuard HeatShield (Local Development)     "
echo "==========================================================="

# Check for .env file
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No backend/.env found! Creating one with default keys..."
    echo "FORTYGUARD_API_KEY=25f1c4497921abc012e72a398543f140" > backend/.env
    echo "FORTYGUARD_API_BASE_URL=https://api.fortyguard.com/v1" >> backend/.env
fi

# Function to stop background processes on exit
cleanup() {
    echo -e "\n🛑 Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}
trap cleanup SIGINT SIGTERM

echo ""
echo "🚀 1. Starting FastAPI Backend (Port 8000)..."
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "🚀 2. Starting React Frontend (Port 5173)..."
cd ../frontend
# Use the local node binary from the environment
PATH="../.tools/node/bin:$PATH" npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

echo ""
echo "✅ All servers running!"
echo "➡️  Frontend UI: http://127.0.0.1:5173"
echo "➡️  Backend API: http://127.0.0.1:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."
wait
