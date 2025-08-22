# Fix Vercel SPA Routing Issue

## Deskripsi Masalah

Website DigCity mengalami error Vercel saat user melakukan refresh pada halaman yang bukan root domain. Contoh:
- `digcity.my.id` ✅ (berfungsi normal)
- `digcity.my.id/kontak` ❌ (error saat refresh)
- `digcity.my.id/blog` ❌ (error saat refresh)

## Penyebab Masalah

Masalah ini terjadi karena:

1. **Client-side Routing**: Aplikasi React menggunakan `window.history.pushState()` untuk navigasi tanpa reload
2. **Server-side Routing**: Vercel tidak tahu bagaimana handle route seperti `/kontak` karena tidak ada file fisik di server
3. **SPA Routing Issue**: Ketika user refresh halaman, browser meminta route tersebut ke server, bukan ke aplikasi React

## Solusi yang Diterapkan

### 1. Update `vercel.json` (Versi Final)

Menggunakan konfigurasi yang lebih sederhana dan efektif:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Catatan**: Pattern `/(.*)` akan catch semua route dan redirect ke `index.html`, memungkinkan React app mengambil alih routing.

### 2. File `_redirects` (Backup)

Membuat file `public/_redirects` sebagai fallback untuk memastikan routing berfungsi:

```
# Redirect all routes to index.html for SPA
/kontak    /index.html   200
/blog      /index.html   200
/events    /index.html   200
/sejarah   /index.html   200
/logo      /index.html   200
/visi-misi /index.html   200
/struktur-organisasi /index.html 200
/grand-design /index.html 200
/galeri    /index.html   200
/admin     /index.html   200

# Catch all other routes
/*         /index.html   200
```

### 3. File `_headers` (Optimasi)

Mengoptimalkan cache dan security headers:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
```

## Cara Kerja Solusi

1. **User mengakses** `digcity.my.id/kontak`
2. **Vercel server** menerima request untuk route `/kontak`
3. **Rewrite rule** `/(.*)` mengarahkan request ke `/index.html`
4. **React app** di-load dan routing client-side mengambil alih
5. **Halaman kontak** ditampilkan dengan benar

## Testing

### ✅ Deployment Berhasil (Update)

- **Production URL**: https://digcity-website-id934pzex-digcitys-projects.vercel.app
- **Inspect URL**: https://vercel.com/digcitys-projects/digcity-website/3D4P6V7psvpfVZwKtyVTmakrYh9t
- **Status**: ✅ Deployed successfully dengan konfigurasi baru

### 🧪 Test yang Perlu Dilakukan

Setelah deploy, test dengan:
- [ ] Akses langsung ke `digcity.my.id/kontak`
- [ ] Refresh halaman pada route `/kontak`
- [ ] Refresh halaman pada route `/blog`
- [ ] Refresh halaman pada route lainnya
- [ ] Akses langsung ke semua route yang ada

### 🔍 Cara Testing

1. **Test Refresh Route**:
   - Buka `digcity.my.id/kontak`
   - Refresh browser (F5 atau Ctrl+R)
   - Pastikan tidak ada error Vercel

2. **Test Direct Access**:
   - Copy URL `digcity.my.id/kontak`
   - Paste di tab baru
   - Pastikan halaman kontak muncul

3. **Test All Routes**:
   - Test setiap route yang ada di aplikasi
   - Pastikan semua berfungsi dengan baik

## Troubleshooting

### ⚠️ Masalah yang Ditemui

**Error 404 masih terjadi setelah konfigurasi awal:**
- Masalah: Regex pattern yang kompleks tidak kompatibel dengan Vercel
- Solusi: Gunakan pattern sederhana `/(.*)` yang lebih reliable

### 🔧 Solusi Troubleshooting

1. **Clear Vercel cache dan redeploy**:
   ```bash
   vercel --prod --force
   ```

2. **Check deployment logs**:
   ```bash
   vercel logs
   ```

3. **Verify file structure**:
   - Pastikan `index.html` ada di root `dist/`
   - Pastikan semua assets ter-build dengan benar

4. **Test konfigurasi lokal**:
   ```bash
   npm run build:vercel
   # Verifikasi file _redirects dan _headers ada di dist/
   ```

### Common Issues:

- **Build failed**: Check `npm run build:vercel` locally
- **Routing still broken**: Verify `vercel.json` syntax
- **Assets not loading**: Check rewrite pattern excludes assets correctly
- **404 errors persist**: Gunakan pattern sederhana `/(.*)` di rewrites

## Referensi

- [Vercel SPA Routing Documentation](https://vercel.com/docs/projects/project-configuration#rewrites)
- [React Router with Vercel](https://vercel.com/guides/deploying-react-with-vercel)
- [SPA Fallback Configuration](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Vercel Headers Configuration](https://vercel.com/docs/projects/project-configuration#headers)

## Status

- [x] Identifikasi masalah
- [x] Update `vercel.json` (versi 1)
- [x] Update `vercel.json` (versi final)
- [x] Buat file `_redirects`
- [x] Buat file `_headers`
- [x] Dokumentasi solusi
- [x] Deployment ke production (versi 1)
- [x] Deployment ke production (versi final)
- [ ] Testing di production
- [ ] Verifikasi semua route berfungsi

## Deployment Info

- **Date**: July 2025
- **Vercel Project**: digcity-website
- **Production URL**: https://digcity-website-id934pzex-digcitys-projects.vercel.app
- **Status**: ✅ Deployed successfully dengan konfigurasi final
- **Versi Konfigurasi**: Final (pattern sederhana `/(.*)`)

## Tim

- **Developer**: AI Assistant
- **Date**: July 2025
- **Version**: 2.0 (Final)
