# ========================================
# Multi-stage Dockerfile for SocialScaleBoosterAIbot
# Stack: Python Flask + Node.js + React + Vite
# Hybrid application with both Python and Node.js runtimes
# ========================================

# ----------------------------------------
# Stage 1: Build Node.js Frontend
# ----------------------------------------
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install Node.js dependencies
RUN npm ci && \
    npm cache clean --force

# Copy frontend source code
COPY client ./client
COPY public ./public
COPY index.html vite.config.ts tsconfig.json tailwind.config.ts postcss.config.js ./

# Build frontend with Vite
RUN npm run build

# ----------------------------------------
# Stage 2: Python Dependencies
# ----------------------------------------
FROM python:3.11-slim AS python-dependencies

WORKDIR /app

# Install system dependencies required for Python packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ----------------------------------------
# Stage 3: Production
# ----------------------------------------
FROM python:3.11-slim AS production

# Install Node.js for hybrid runtime and dumb-init
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    dumb-init \
    libpq5 \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -g 1001 appuser && \
    useradd -r -u 1001 -g appuser appuser

WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    FLASK_ENV=production

# Copy Python dependencies from python-dependencies stage
COPY --from=python-dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=python-dependencies /usr/local/bin /usr/local/bin

# Copy Python application files
COPY --chown=appuser:appuser app.py server.py ./
COPY --chown=appuser:appuser api ./api
COPY --chown=appuser:appuser server ./server

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder --chown=appuser:appuser /app/build ./build
COPY --from=frontend-builder --chown=appuser:appuser /app/dist ./dist

# Copy package.json for reference
COPY --chown=appuser:appuser package.json ./

# Switch to non-root user
USER appuser

# Expose application ports
# Flask backend typically runs on 5000
# Node.js server might run on different port
EXPOSE 5000

# Health check for Flask application
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/api/health').read()" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
# Default to Python Flask app (adjust if you have a different startup script)
CMD ["python", "app.py"]
