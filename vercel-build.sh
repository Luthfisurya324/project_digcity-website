#!/bin/bash

# Vercel Build Script untuk DIGCITY Website
# Script ini memastikan build process berjalan dengan benar

echo "🚀 Memulai build process untuk DIGCITY Website..."

# Clean previous build
echo "🧹 Membersihkan build sebelumnya..."
rm -rf dist
rm -rf .vercel

# Install dependencies
echo "📦 Menginstall dependencies..."
npm ci --only=production

# Build application
echo "🔨 Building application..."
npm run build:vercel

# Verify build output
echo "✅ Verifikasi build output..."
if [ -d "dist" ]; then
    echo "✅ Build berhasil! Directory dist ditemukan."
    
    # List build output
    echo "📁 Isi directory dist:"
    ls -la dist/
    
    # Check for critical files
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html ditemukan"
    else
        echo "❌ index.html tidak ditemukan!"
        exit 1
    fi
    
    if [ -f "dist/assets/js/main.js" ] || [ -f "dist/main.js" ]; then
        echo "✅ Main JavaScript file ditemukan"
    else
        echo "❌ Main JavaScript file tidak ditemukan!"
        exit 1
    fi
    
    if [ -f "dist/assets/css/index.css" ] || [ -f "dist/index.css" ]; then
        echo "✅ Main CSS file ditemukan"
    else
        echo "❌ Main CSS file tidak ditemukan!"
        exit 1
    fi
    
    # Check for public assets
    if [ -f "dist/digital-innovation.png" ]; then
        echo "✅ digital-innovation.png ditemukan"
    else
        echo "❌ digital-innovation.png tidak ditemukan!"
    fi
    
    if [ -f "dist/logo_digcity.png" ]; then
        echo "✅ logo_digcity.png ditemukan"
    else
        echo "❌ logo_digcity.png tidak ditemukan!"
    fi
    
else
    echo "❌ Build gagal! Directory dist tidak ditemukan."
    exit 1
fi

echo "🎉 Build process selesai dengan sukses!"
echo "📤 Siap untuk deploy ke Vercel!"
