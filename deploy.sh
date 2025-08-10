#!/bin/bash

# SmartFlow AI - Deployment Script
# Ensures proper Node.js deployment without Python virtual environment conflicts

echo "SmartFlow AI - Starting Deployment"
echo "=================================="

# Set Node.js environment
export NODE_ENV=production
export PORT=${PORT:-3000}

# Ensure we're using Node.js for deployment
echo "Configuring Node.js deployment..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm ci

# Build the application (frontend + backend)
echo "Building application..."
npm run build

# Start the application
echo "Starting SmartFlow AI on port $PORT..."
npm start