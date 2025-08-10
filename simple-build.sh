#!/bin/bash

# SmartFlow AI - Simple Build Script for Deployment
echo "Starting Node.js deployment build..."

# Set environment
export NODE_ENV=production

# Clean install all dependencies
echo "Installing all dependencies..."
npm install

# Build with available tools
echo "Building with available dependencies..."
if [ -f "node_modules/.bin/vite" ]; then
    echo "Building frontend with Vite..."
    ./node_modules/.bin/vite build
else
    echo "Vite not found, using npx..."
    npx --yes vite build
fi

echo "Building backend with esbuild..."
if [ -f "node_modules/.bin/esbuild" ]; then
    ./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
else
    npx --yes esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
fi

echo "Build process completed!"
if [ -d "dist" ]; then
    echo "Build successful - files created in dist/"
    ls -la dist/
else
    echo "Build may have failed - dist directory not found"
fi