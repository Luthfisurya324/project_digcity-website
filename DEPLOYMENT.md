# Panduan Deployment Vercel - DigCity Website

## Direktori Root untuk Deployment

**PENTING:** Gunakan direktori root proyek sebagai direktori deployment Vercel:

```
c:\dev\project_digcity-website
```

## Struktur Proyek untuk Deployment

```
project_digcity-website/
├── vercel.json              # ✅ Konfigurasi Vercel
├── package.json             # ✅ Dependencies & scripts
├── vite.config.ts           # ✅ Konfigurasi build optimized
├── index.html               # ✅ Entry point
├── src/                     # ✅ Source code
├── public/                  # ✅ Static assets
├── .env.example             # ✅ Template environment variables
└── dist/                    # ⚠️  Build output (auto-generated)
```

## Konfigurasi Vercel

### 1. Framework Detection
Vercel akan otomatis mendeteksi proyek sebagai **Vite** berdasarkan:
- File `vite.config.ts`
- Dependencies di `package.json`
- Konfigurasi di `vercel.json`

### 2. Build Settings
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Dev Command:** `npm run dev`

### 3. Environment Variables (Production)
Set di Vercel Dashboard > Settings > Environment Variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# App Configuration
VITE_APP_NAME=DIGCITY Website
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false

# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Langkah-langkah Deployment

### Opsi 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login ke Vercel:
   ```bash
   vercel login
   ```

3. Deploy dari direktori root:
   ```bash
   cd c:\dev\project_digcity-website
   vercel
   ```

### Opsi 2: Deploy via Vercel Dashboard

1. Buka [vercel.com](https://vercel.com)
2. Connect repository GitHub/GitLab
3. Set **Root Directory** ke `/` (root)
4. Vercel akan otomatis detect settings dari `vercel.json`

### Opsi 3: Deploy via Git Integration

1. Push code ke GitHub/GitLab
2. Import project di Vercel
3. Set Root Directory: **Leave empty** (akan menggunakan root)
4. Environment variables akan diambil dari Vercel Dashboard

## Troubleshooting

### Build Errors
- Pastikan semua dependencies terinstall: `npm install`
- Test build lokal: `npm run build`
- Check TypeScript errors: `npm run lint`

### Routing Issues
- SPA routing sudah dikonfigurasi di `vercel.json`
- Semua routes akan redirect ke `index.html`

### Environment Variables
- Pastikan semua `VITE_*` variables sudah diset
- Variables harus diawali dengan `VITE_` untuk accessible di client

## Optimisasi Production

### Build Optimization
- Minification: Terser
- Code splitting: Manual chunks untuk vendor libraries
- Source maps: Disabled untuk production

### Performance
- Lazy loading untuk components
- Image optimization via Vercel
- CDN distribution otomatis

## Monitoring

- **Analytics:** Vercel Analytics (optional)
- **Logs:** Vercel Functions logs
- **Performance:** Web Vitals monitoring

---

**Catatan:** Direktori root `c:\dev\project_digcity-website` sudah dikonfigurasi dengan semua file yang diperlukan untuk deployment Vercel yang sukses.