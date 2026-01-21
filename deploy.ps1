# Quick Deploy Script
# Run this after npm install completes successfully

# STEP 1: Create your .env.local file
echo "Creating .env.local..."
cp .env.local.example .env.local
echo "⚠️  IMPORTANT: Edit .env.local and add your R2 access keys!"
echo ""

# STEP 2: Build test
echo "Testing build..."
npm run build
if ($LASTEXITCODE -ne 0) {
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
}
echo "✅ Build successful!"
echo ""

# STEP 3: Git setup
echo "Setting up git..."
git init
git add .
git commit -m "Production-ready Next.js deployment"
git branch -M main

# STEP 4: Connect to GitHub
echo "Adding remote (kiko1313/playbox)..."
git remote add origin https://github.com/kiko1313/playbox.git
git push -u origin main --force

# STEP 5: Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "Don't forget to set environment variables in Vercel dashboard if not already set."
