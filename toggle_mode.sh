#!/bin/bash

# SmartFlow AI - Dual Mode Toggle Script
# Switch between Python Flask and Node.js applications

echo "SmartFlow AI - Dual Mode Toggle"
echo "================================"

if [ "$1" = "python" ]; then
    echo "Starting Python Flask mode on port 3000..."
    pkill -f tsx 2>/dev/null || true
    pkill -f node 2>/dev/null || true
    export PORT=3000
    python3 app.py
elif [ "$1" = "node" ]; then
    echo "Starting Node.js mode on port 3000..."
    pkill -f python3 2>/dev/null || true
    export PORT=3000
    export NODE_ENV=development
    npm run dev
else
    echo "Usage: ./toggle_mode.sh [python|node]"
    echo ""
    echo "python - Start Flask social media post generator"
    echo "node   - Start SmartFlow AI full platform"
    echo ""
    echo "Both applications run on port 3000"
fi