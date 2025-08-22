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
    echo "🔍 Checking critical assets..."

    if [ -f "dist/logo_digcity.png" ]; then
        echo "✅ logo_digcity.png ditemukan"
    else
        echo "❌ logo_digcity.png tidak ditemukan!"
        exit 1
    fi
    
    # Verify SPA routing files
    echo "🔍 Verifikasi file routing SPA..."
    if [ -f "dist/_redirects" ]; then
        echo "✅ _redirects ditemukan"
    else
        echo "⚠️  _redirects tidak ditemukan - akan dibuat otomatis"
    fi
    
    if [ -f "dist/_headers" ]; then
        echo "✅ _headers ditemukan"
    else
        echo "⚠️  _headers tidak ditemukan - akan dibuat otomatis"
    fi
    
    # Create _redirects if not exists
    if [ ! -f "dist/_redirects" ]; then
        echo "📝 Membuat file _redirects..."
        cat > dist/_redirects << 'EOF'
# SPA Fallback - Redirect all routes to index.html
/*    /index.html   200

# Specific redirects for DIGCITY pages
/kontak    /index.html   200
/blog      /index.html   200
/events    /index.html   200
/sejarah   /index.html   200
/logo      /index.html   200
/visi-misi /index.html   200
/struktur-organisasi /index.html   200
/grand-design /index.html   200
/galeri    /index.html   200
/admin     /index.html   200
EOF
        echo "✅ _redirects berhasil dibuat"
    fi
    
else
    echo "❌ Build gagal! Directory dist tidak ditemukan."
    exit 1
fi

echo "🎉 Build process selesai dengan sukses!"
echo "📤 Siap untuk deploy ke Vercel!"
echo "🔧 Pastikan vercel.json dan _redirects sudah dikonfigurasi dengan benar!"
