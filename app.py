#!/usr/bin/env python3
"""
SmartFlow AI - Node.js Redirection Script
This application is a Node.js project. This Python file exists only for compatibility.
"""

import subprocess
import sys
import os

print("🔄 SmartFlow AI - Redirecting to Node.js application...")
print("=" * 50)

# Set environment variables
os.environ['NODE_ENV'] = 'production'
os.environ['PORT'] = '3000'

# Execute the Node.js application
try:
    # Check if the build exists
    if not os.path.exists('dist/index.js'):
        print("📦 Building Node.js application...")
        subprocess.run(['./deploy-fix.sh'], check=True)
    
    print("🚀 Starting Node.js server...")
    # Run the Node.js server
    subprocess.run(['node', 'dist/index.js'], check=False)
except KeyboardInterrupt:
    print("\n⏹️  Server stopped")
    sys.exit(0)
except Exception as e:
    print(f"❌ Error: {e}")
    print("Attempting direct Node.js start...")
    subprocess.run(['npm', 'start'])
