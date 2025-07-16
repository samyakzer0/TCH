#!/bin/bash

echo "🚀 Setting up Vercel deployment for TCH..."

# Install dependencies
echo "📦 Installing Vercel Postgres..."
npm install @vercel/postgres

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next steps for Vercel deployment:"
    echo "1. Set up Vercel Postgres database in your dashboard"
    echo "2. Add environment variables (see VERCEL_DEPLOYMENT.md)"
    echo "3. Deploy with: git push"
    echo ""
    echo "📖 Check VERCEL_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
fi
