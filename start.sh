#!/bin/bash
# SmartFlow AI - Node.js Start Script
# Force Node.js execution

export NODE_ENV=production
export HOST=0.0.0.0
export PORT=3000

echo "🚀 Starting SmartFlow AI Node.js Application"
echo "   Environment: $NODE_ENV"
echo "   Host: $HOST"
echo "   Port: $PORT"

# Execute Node.js application
exec node dist/index.js