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

# Run database migrations in production
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Run type checking
echo "🔍 Type checking..."
npm run type-check

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
