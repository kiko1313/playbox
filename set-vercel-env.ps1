# Vercel Environment Variable Setup Script
# This script sets all required environment variables for production

Write-Host "Setting Vercel Environment Variables..." -ForegroundColor Cyan

# Firebase Public Variables
$env:FIREBASE_API_KEY = "AIzaSyCW-uXCaJi36xTADrYp1y9kDviRayNQyWo"
$env:FIREBASE_AUTH_DOMAIN = "adawat-c701c.firebaseapp.com"
$env:FIREBASE_PROJECT_ID = "adawat-c701c"
$env:FIREBASE_SENDER_ID = "138856973754"
$env:FIREBASE_APP_ID = "1:138856973754:web:4fea264a442b52dd860983"

# R2 Credentials
$env:R2_ACCOUNT_ID = "fad148415bc5962bf2d7c5c9377680f4"
$env:R2_ACCESS_KEY = "01eaa402d4e5b458f82e939b111d7245"
$env:R2_SECRET = "03e657ad21db2f6362a518069a676e8ec92e564f9ecd2e80ed260a0b935da5d7"
$env:R2_BUCKET = "mysite"
$env:R2_URL = "https://fad148415bc5962bf2d7c5c9377680f4.r2.cloudflarestorage.com"

# Set each variable via Vercel CLI (requires manual confirmation)
echo $env:FIREBASE_API_KEY | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production preview
echo $env:FIREBASE_AUTH_DOMAIN | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production preview
echo $env:FIREBASE_PROJECT_ID | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production preview
echo $env:FIREBASE_SENDER_ID | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production preview
echo $env:FIREBASE_APP_ID | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production preview

echo $env:R2_ACCOUNT_ID | vercel env add R2_ACCOUNT_ID production preview
echo $env:R2_ACCESS_KEY | vercel env add R2_ACCESS_KEY_ID production preview
echo $env:R2_SECRET | vercel env add R2_SECRET_ACCESS_KEY production preview  
echo $env:R2_BUCKET | vercel env add R2_BUCKET production preview
echo $env:R2_URL | vercel env add R2_PUBLIC_URL production preview

Write-Host "Environment variables configured!" -ForegroundColor Green
Write-Host "Triggering redeploy..." -ForegroundColor Cyan

vercel --prod --yes
