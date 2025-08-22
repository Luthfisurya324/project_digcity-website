# DigCity Website

Website resmi untuk DigCity yang dibangun dengan React + TypeScript + Vite.

## Fitur Linktree

Proyek ini juga menyertakan fitur **Linktree** yang dapat diakses melalui:
- **URL:** `/linktree`
- **Subdomain:** `linktree.digcity.my.id` (perlu konfigurasi DNS)

Linktree dirancang untuk digunakan sebagai bio link di Instagram dan platform social media lainnya, menyediakan satu halaman yang berisi semua link penting DigCity.

### Dokumentasi Linktree
- 📖 [Implementasi Fitur Linktree](./docs/013_implement_linktree_feature.md) - Dokumentasi lengkap fitur linktree

## Deployment ke Vercel

### Direktori Root untuk Deployment

Untuk deployment ke Vercel, pastikan Anda menggunakan **direktori root proyek** (`c:\dev\project_digcity-website`) sebagai direktori deployment. Direktori ini sudah dikonfigurasi dengan:

- `vercel.json` - Konfigurasi deployment Vercel
- `package.json` - Dependencies dan build scripts
- `vite.config.ts` - Konfigurasi Vite
- `index.html` - Entry point aplikasi
- `src/` - Source code aplikasi
- `public/` - Static assets

### Langkah Deployment

1. **Pastikan semua file konfigurasi ada:**
   - ✅ `vercel.json` (sudah dikonfigurasi)
   - ✅ `package.json` dengan build script
   - ✅ `vite.config.ts`

2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Install Command:** `npm install`
5. **Dev Command:** `npm run dev`

### Konfigurasi Vercel

File `vercel.json` sudah dikonfigurasi dengan:
- Framework: Vite
- Build output: `dist/`
- SPA routing support dengan rewrites

### Environment Variables

Untuk deployment production, pastikan Anda mengatur environment variables berikut di Vercel Dashboard:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=DIGCITY Website
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
VITE_API_BASE_URL=https://your-api-domain.com/api
```

**Catatan:** 
- File `SUPABASE_SETUP.md` berisi instruksi lengkap untuk setup Supabase
- File `docs/012_fix_admin_authentication_error.md` berisi dokumentasi perbaikan error autentikasi admin
- Pastikan environment variables dikonfigurasi dengan benar untuk menghindari error 500

## Development Setup

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Documentation

- [Fix Vercel SPA Routing Issue](./docs/006_fix_vercel_spa_routing.md) - Solusi untuk masalah routing SPA di Vercel
- [Performance Optimization Report](./docs/PERFORMANCE_OPTIMIZATION_REPORT.md) - Laporan optimasi performa website
- [Mobile Optimization](./docs/MOBILE_OPTIMIZATION.md) - Optimasi untuk perangkat mobile
- [Design Improvements](./docs/DESIGN_IMPROVEMENTS.md) - Perbaikan desain UI/UX
- [Deployment Guide](./docs/DEPLOYMENT.md) - Panduan deployment dan konfigurasi

## Development Tools

### React Developer Tools

Untuk pengalaman pengembangan yang lebih baik, disarankan untuk menginstal React Developer Tools:

- **Chrome**: [Install React DevTools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- **Firefox**: [Install React DevTools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
- **Edge**: [Install React DevTools for Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

React DevTools memungkinkan Anda untuk:
- Inspect komponen React dan props
- Edit state dan props secara real-time
- Profiling performa aplikasi
- Debug hooks dan context

### Database Setup

Proyek ini menggunakan Supabase sebagai backend. Pastikan Anda telah:

1. Membuat akun di [Supabase](https://supabase.com)
2. Membuat project baru
3. Menyalin file `.env.example` ke `.env` dan mengisi kredensial Supabase Anda
4. Menjalankan migrasi database (tabel users, events, news, gallery, newsletter)

### Admin Access

Untuk mengakses panel admin:
1. Buka `/admin` di browser
2. Login dengan kredensial admin yang telah dibuat di database
3. Default admin: `admin@digcity.com` (pastikan user ini ada di tabel `users` dengan role `admin`)
