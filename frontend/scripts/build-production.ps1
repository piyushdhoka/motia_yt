# Production Build and Deployment Script for Windows
# This script prepares and builds the application for production

Write-Host "🚀 Starting production build process..." -ForegroundColor Green

# Check if .env.production.local exists
if (-not (Test-Path .env.production.local)) {
    Write-Host "❌ Error: .env.production.local not found!" -ForegroundColor Red
    Write-Host "📝 Please create .env.production.local from .env.production.example" -ForegroundColor Yellow
    exit 1
}

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Cyan
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
if (Test-Path out) { Remove-Item -Recurse -Force out }

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm ci --production=false

# Run production build
Write-Host "🏗️  Building for production..." -ForegroundColor Cyan
$env:NODE_ENV = "production"
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Production build completed successfully!" -ForegroundColor Green
    Write-Host "🎉 Ready to deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Test locally: npm run prod" -ForegroundColor White
    Write-Host "2. Deploy to Vercel: vercel --prod" -ForegroundColor White
    Write-Host "3. Or deploy to your hosting platform" -ForegroundColor White
} else {
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}
