#!/bin/bash
# Render.com build script for Battery Department Customer Portal

set -e

echo "🚀 Building Battery Department Customer Portal for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if DATABASE_URL is set and not empty before running migrations
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️ Running database migrations..."
    npx prisma migrate deploy
else
    echo "⚠️ Skipping database migrations (DATABASE_URL not set)"
fi

# Run type checking
echo "🔍 Type checking..."
npm run type-check

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
