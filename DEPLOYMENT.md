# DEPLOYMENT GUIDE - DIGCITY Website

## Status Deployment Terkini

### Issues yang Ditemukan:
1. **File tidak ditemukan (404)**: `react.svg`, `main.tsx`
2. **Assets yang berhasil di-deploy**: `logo_digcity.png`, `manifest.json`, `robots.txt`, `sitemap.xml`

### Rekomendasi:
- Pastikan semua file source code ter-compile dengan benar
- Verifikasi path file assets sudah sesuai
- Test loading time dan performance setelah deployment

## Masalah yang Ditemukan

Setelah deploy ke Vercel di domain `digcity.my.id`, ditemukan bebera pa error:

1. **File tidak ditemukan (404)**: `react.svg`, `main.tsx`
2. **MIME type error**: CSS file di-load sebagai `text/plain` bukan `text/css`
3. **Font loading error**: Font Google tidak dapat di-load
4. **Preload warning**: Resource yang di-preload tidak digunakan

## Solusi yang Telah Diterapkan

### 1. Konfigurasi Vercel (`vercel.json`)

- Menambahkan header MIME type yang benar untuk semua jenis file
- Mengkonfigurasi routing yang tepat untuk SPA
- Menambahkan cache control yang optimal

### 2. Konfigurasi Build (`build.config.js`)

- Membuat konfigurasi build khusus untuk production
- Memastikan asset di-build dengan struktur yang benar
- Menonaktifkan CSS code splitting untuk menghindari masalah MIME type

### 3. Asset Configuration (`src/config/assetConfig.ts`)

- Membuat sistem konfigurasi asset yang dinamis
- Memastikan path asset yang benar di development dan production
- Menangani error asset loading dengan graceful

### 4. Utility Asset Loader (`src/utils/assetLoader.ts`)

- Membuat utility untuk memastikan asset di-load dengan benar
- Menangani preload asset dengan tepat
- Error handling untuk asset loading

### 5. File Headers (`public/_headers`)

- Konfigurasi header untuk berbagai jenis file
- Memastikan MIME type yang benar
- Cache control yang optimal

## Langkah Deployment

### 1. Build Project

```bash
# Clean previous build
npm run clean

# Build untuk production
npm run build:vercel

# Atau gunakan script khusus Vercel
npm run vercel-build
```

### 2. Verifikasi Build Output

Pastikan file berikut ada di folder `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [hash].js
├── logo_digcity.png
├── manifest.json
├── robots.txt
├── sitemap.xml
└── sw.js
```

### 3. Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3.1 Linking Proyek ke Vercel (Dashboard)

Cara paling mudah menghubungkan proyek ini ke Vercel adalah melalui dashboard:

- Buka `https://vercel.com/new`
- Pilih sumber kode (GitHub/GitLab/Bitbucket) atau import folder lokal via CLI
- Pilih root direktori: `c:\dev\project_digcity-website`
- Vercel akan membaca `vercel.json` dan otomatis menggunakan:
  - Build Command: `npm run build:vercel`
  - Output Directory: `dist`
  - Install Command: `npm install`
  - Dev Command: `npm run dev`
- Setelah import, set environment variables (lihat bagian Environment Variables di bawah)
- Klik Deploy

### 3.2 Linking via CLI (Opsional, non-interaktif)

Jika ingin menghubungkan via CLI tanpa prompt interaktif:

1. Buat Personal Access Token di Vercel (Account Settings → Tokens)
2. Set environment variables di shell sebelum menjalankan perintah:

```
# PowerShell (Windows)
$env:VERCEL_TOKEN = "<YOUR_VERCEL_TOKEN>"
$env:VERCEL_ORG_ID = "<YOUR_ORG_ID>"
$env:VERCEL_PROJECT_ID = "<YOUR_PROJECT_ID>"
```

3. Jalankan deploy non-interaktif:

```
npx vercel --prod --confirm
```

Jika project belum dibuat, jalankan `npx vercel` sekali untuk membuatnya (interaktif), kemudian gunakan `--confirm` di deploy berikutnya.

### 3.3 Environment Variables di Vercel

Tambahkan environment variables berikut di Project Settings → Environment Variables (Production):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=DIGCITY Website
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_DOMAIN=digcity.my.id
VITE_APP_URL=https://digcity.my.id
```

Referensi nilai default tersedia di `.env.example`. Untuk pengujian di Preview, Anda juga bisa menambahkan environment dengan scope Preview.

### 4. Konfigurasi Domain

Pastikan domain `digcity.my.id` sudah dikonfigurasi dengan benar di Vercel dashboard.

## Troubleshooting

### Jika masih ada error 404:

1. Periksa apakah file ada di folder `public/`
2. Pastikan konfigurasi `vercel.json` sudah benar
3. Cek apakah build output sudah sesuai

### Jika masih ada MIME type error:

1. Pastikan file `_headers` sudah ada di folder `public/`
2. Periksa konfigurasi header di `vercel.json`
3. Pastikan CSS tidak di-split (cssCodeSplit: false)

### Jika font tidak bisa di-load:

1. Periksa apakah Google Fonts bisa diakses
2. Pastikan preconnect sudah dikonfigurasi dengan benar
3. Cek apakah ada CORS issue

## Monitoring

Setelah deploy, monitor:

1. Console browser untuk error
2. Network tab untuk failed requests
3. Performance metrics
4. Error tracking (jika ada)

## Optimasi Lanjutan

1. **Image Optimization**: Gunakan format WebP dan lazy loading
2. **Font Loading**: Implementasi font display swap
3. **Caching**: Optimasi cache strategy
4. **CDN**: Gunakan CDN untuk asset static

## Support

Jika masih ada masalah, periksa:

1. Vercel deployment logs
2. Browser developer tools
3. Network requests
4. Console errors

## Catatan Penting

- Pastikan semua asset di folder `public/` sudah benar
- Test build locally sebelum deploy
- Monitor performance setelah deploy
- Backup konfigurasi sebelum melakukan perubahan besar
