# cleanup_internal_only.ps1
# Script untuk membersihkan project DIGCITY dan HANYA menyisakan sistem internal (Dashboard).
# Jalankan script ini di PowerShell pada root folder project BARU Anda.

Write-Host "Mulai pembersihan project untuk Internal System Only..." -ForegroundColor Cyan

# 1. Hapus Folder/File Halaman Public
$foldersToDelete = @(
    "src/pages/about",
    "src/pages/blog",
    "src/pages/contact",
    "src/pages/events",
    "src/pages/gallery",
    "src/pages/linktree",
    "src/components/layout", # Header/Footer public
    "src/components/landing" # Landing page components jika ada
)

$filesToDelete = @(
    "src/pages/HomePage.tsx",
    "src/pages/LinktreePage.tsx",
    "src/pages/Recap2025Page.tsx"
)

foreach ($folder in $foldersToDelete) {
    if (Test-Path $folder) {
        Remove-Item -Recurse -Force $folder
        Write-Host "Deleted folder: $folder" -ForegroundColor Yellow
    }
}

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item -Force $file
        Write-Host "Deleted file: $file" -ForegroundColor Yellow
    }
}

# 2. Update App.tsx untuk Internal Only
# Kita akan menimpa file App.tsx dengan versi sederhana yang hanya memuat InternalPanel
$appTsxContent = @"
import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { NotificationProvider } from './components/common/NotificationCenter'
import InternalPanel from './pages/InternalPanel'
import NotFoundPage from './pages/NotFoundPage'
import { registerServiceWorker } from './utils/serviceWorker'

function App() {
  useEffect(() => {
    registerServiceWorker().catch(console.warn)
  }, [])

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
        <Routes>
          {/* Redirect root to internal dashboard directly */}
          <Route path="/" element={<Navigate to="/internal" replace />} />
          
          {/* Internal Panel Routes */}
          <Route path="/internal/*" element={<InternalPanel />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFoundPage type="internal" />} />
        </Routes>
      </div>
    </NotificationProvider>
  )
}

export default App
"@

Set-Content -Path "src/App.tsx" -Value $appTsxContent
Write-Host "App.tsx updated for Internal System Only." -ForegroundColor Green

# 3. Rename/Cleaning up imports in InternalPanel if needed
# (InternalPanel biasanya self-contained, tapi kita pastikan path-nya aman)

Write-Host "Pembersihan selesai! Sekarang project hanya berisi sistem internal." -ForegroundColor Green
Write-Host "Jalankan 'npm run dev' untuk mencoba." -ForegroundColor Cyan
