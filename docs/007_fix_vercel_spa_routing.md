# Perbaikan Routing SPA untuk Vercel - Solusi Sederhana

## Deskripsi Masalah
Project website DIGCITY mengalami masalah routing di Vercel dimana halaman tidak bisa di-refresh kecuali di domain utama. Ini terjadi karena project menggunakan custom routing dengan state management manual, bukan React Router yang proper untuk SPA (Single Page Application).

## Solusi yang Diterapkan (Versi Sederhana)

### 1. Implementasi HashRouter
- Menggunakan `HashRouter` sebagai alternatif `BrowserRouter`
- Lebih kompatibel dengan berbagai hosting platform termasuk Vercel
- URL akan menggunakan hash (#) untuk routing

### 2. Struktur Routing yang Disederhanakan
- Menggunakan komponen `PageLayout` untuk konsistensi
- Routing yang lebih clean dan mudah dipahami
- Menghapus kompleksitas yang tidak diperlukan

### 3. Konfigurasi Vercel yang Minimal
- Hanya menggunakan `rewrites` untuk SPA routing
- File `_redirects` dan `_headers` untuk konfigurasi tambahan
- Konfigurasi yang lebih sederhana dan mudah di-maintain

## Struktur Routing Baru

```tsx
// Layout component untuk konsistensi
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
)

// Routing yang sederhana
<Routes>
  {/* Admin route - no header/footer */}
  <Route path="/admin" element={<LazyAdminPage />} />
  
  {/* Main routes with header/footer */}
  <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
  <Route path="/blog" element={<PageLayout><LazyBlogPage /></PageLayout>} />
  <Route path="/events" element={<PageLayout><LazyEventsPage /></PageLayout>} />
  <Route path="/sejarah" element={<PageLayout><LazySejarahPage /></PageLayout>} />
  <Route path="/logo" element={<PageLayout><LazyLogoPage /></PageLayout>} />
  <Route path="/visi-misi" element={<PageLayout><LazyVisiMisiPage /></PageLayout>} />
  <Route path="/struktur-organisasi" element={<PageLayout><LazyStrukturOrganisasiPage /></PageLayout>} />
  <Route path="/grand-design" element={<PageLayout><LazyGrandDesignPage /></PageLayout>} />
  <Route path="/galeri" element={<PageLayout><LazyGaleriPage /></PageLayout>} />
  <Route path="/kontak" element={<PageLayout><LazyKontakPage /></PageLayout>} />
  
  {/* Catch all route - redirect to home */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

## File Konfigurasi

### vercel.json (Sederhana)
```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### public/_redirects
```
/*    /index.html   200
```

### public/_headers
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable
```

## Keuntungan Solusi Sederhana

1. **Kompatibilitas Tinggi**: HashRouter lebih kompatibel dengan berbagai hosting
2. **Konfigurasi Minimal**: Lebih sedikit file konfigurasi yang perlu di-maintain
3. **Routing yang Reliable**: Hash-based routing tidak bergantung pada server configuration
4. **Maintenance Mudah**: Struktur kode yang lebih sederhana dan mudah dipahami
5. **Debugging Sederhana**: Lebih mudah untuk troubleshoot jika ada masalah

## Perbedaan HashRouter vs BrowserRouter

### HashRouter
- URL: `example.com/#/about`
- Lebih kompatibel dengan hosting tradisional
- Tidak memerlukan server-side routing configuration
- Bisa di-refresh di semua halaman

### BrowserRouter
- URL: `example.com/about`
- Lebih SEO friendly
- Memerlukan server-side routing configuration
- Bisa bermasalah di beberapa hosting platform

## Testing

### Test yang Perlu Dilakukan
1. Navigasi antar halaman berfungsi normal
2. Refresh page di semua route berfungsi
3. Browser back/forward button berfungsi
4. URL dapat di-bookmark
5. Mobile menu navigasi berfungsi

### Cara Test
1. Deploy ke Vercel
2. Test navigasi antar halaman
3. Test refresh page di setiap route
4. Test browser navigation buttons
5. Test mobile menu di berbagai device

## Dependencies yang Diperlukan

```json
{
  "react-router-dom": "^7.8.1",
  "@types/react-router-dom": "^5.3.3"
}
```

## Catatan Penting

- **HashRouter**: URL akan menggunakan format `/#/route` bukan `/route`
- **SEO Impact**: HashRouter kurang SEO friendly, tapi lebih reliable untuk routing
- **Migration**: Jika ingin pindah ke BrowserRouter nanti, bisa dengan mudah
- **Testing**: Pastikan test thoroughly di environment Vercel

## Troubleshooting

### Jika routing masih bermasalah
1. Periksa apakah menggunakan HashRouter
2. Pastikan file `_redirects` ada di folder `public`
3. Periksa konfigurasi `vercel.json`
4. Pastikan semua import React Router sudah benar

### Jika ada error TypeScript
1. Periksa semua komponen yang menggunakan props lama
2. Pastikan semua button navigasi sudah diubah menjadi Link
3. Periksa import statements

### Jika ada masalah di Vercel
1. Pastikan file `_redirects` ada di folder `public`
2. Periksa build log di Vercel dashboard
3. Pastikan konfigurasi `vercel.json` sudah benar

## Referensi

- [React Router v7 Documentation](https://reactrouter.com/)
- [HashRouter vs BrowserRouter](https://reactrouter.com/en/main/router-components/hash-router)
- [Vercel SPA Routing](https://vercel.com/docs/projects/project-configuration#rewrites)
- [SPA vs MPA Routing](https://web.dev/routing/)
