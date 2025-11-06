#!/bin/bash

# Production Build and Deployment Script
# This script prepares and builds the application for production

set -e  # Exit on error

echo "🚀 Starting production build process..."

# Check if .env.production.local exists
if [ ! -f .env.production.local ]; then
    echo "❌ Error: .env.production.local not found!"
    echo "📝 Please create .env.production.local from .env.production.example"
    exit 1
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next out

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run production build
echo "🏗️  Building for production..."
NODE_ENV=production npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"
    echo "🎉 Ready to deploy!"
    echo ""
    echo "Next steps:"
    echo "1. Test locally: npm run prod"
    echo "2. Deploy to Vercel: vercel --prod"
    echo "3. Or deploy to your hosting platform"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
