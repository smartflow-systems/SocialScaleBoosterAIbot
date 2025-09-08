#!/usr/bin/env python3
import subprocess
import sys
import os

print("🚀 SmartFlow AI - Redirecting to Node.js Server")
print("=" * 50)

# Set environment variables for Node.js
os.environ['NODE_ENV'] = 'development'
os.environ['PORT'] = '3000'

try:
    # Start the Node.js development server
    print("Starting Node.js development server...")
    result = subprocess.run(['npm', 'run', 'dev'], check=True)
except subprocess.CalledProcessError as e:
    print(f"❌ Failed to start Node.js server: {e}")
    sys.exit(1)
except KeyboardInterrupt:
    print("\n👋 Server stopped")
    sys.exit(0)