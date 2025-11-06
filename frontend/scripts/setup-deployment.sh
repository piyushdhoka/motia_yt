#!/bin/bash

# Deployment Setup Script for YouTube Title Optimizer Frontend
# This script helps configure the project for deployment

echo "🚀 YouTube Title Optimizer - Deployment Setup"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "✅ Found package.json in current directory"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check environment variables
echo ""
echo "🔧 Checking environment configuration..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Creating from example..."
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        echo "✅ Created .env.local from example"
        echo "📝 Please edit .env.local with your actual configuration values"
    else
        echo "❌ Error: .env.local.example not found"
        exit 1
    fi
else
    echo "✅ .env.local exists"
fi

# Build the project to check for errors
echo ""
echo "🏗️  Building project to check for errors..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build completed successfully"

# Deployment instructions
echo ""
echo "📋 Deployment Instructions:"
echo "=========================="
echo ""
echo "For Vercel Deployment:"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Login to Vercel: vercel login"
echo "3. Deploy: vercel"
echo "4. Set environment variables in Vercel dashboard:"
echo "   - BETTER_AUTH_SECRET"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - NEXT_PUBLIC_BACKEND_URL"
echo "   - DATABASE_URL (if using database for sessions)"
echo ""
echo "For Docker Deployment:"
echo "1. Build image: docker build -t youtube-optimizer-frontend ."
echo "2. Run container: docker run -p 3000:3000 --env-file .env.production youtube-optimizer-frontend"
echo ""
echo "Environment Variables Required:"
echo "- BETTER_AUTH_SECRET: Generate with: openssl rand -base64 32"
echo "- GOOGLE_CLIENT_ID: Get from Google Cloud Console"
echo "- GOOGLE_CLIENT_SECRET: Get from Google Cloud Console"
echo "- NEXT_PUBLIC_BACKEND_URL: Your backend API URL"
echo "- DATABASE_URL: Database connection string (if needed)"
echo ""
echo "🎉 Setup completed successfully!"
echo "   Remember to configure your Google OAuth with the correct callback URLs!"