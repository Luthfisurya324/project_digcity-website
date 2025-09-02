# Struktur Folder Pages

Folder ini berisi halaman-halaman utama aplikasi yang diorganisir dengan struktur yang rapi.

## Struktur

```
src/pages/
├── AdminPanel.tsx          # Panel admin utama dengan sidebar
├── LinktreePage.tsx        # Halaman linktree
└── admin/
    └── index.ts            # Export semua komponen admin
```

## AdminPanel.tsx

Komponen admin panel utama yang menggantikan AdminPage.tsx. Fitur:

- **Sidebar Navigation**: Navigasi vertikal dengan ikon dan label
- **Clean Header**: Header minimalis dengan informasi user dan tombol logout
- **Responsive Design**: Layout yang responsif untuk berbagai ukuran layar
- **Tab Management**: Manajemen tab aktif berdasarkan route

### Komponen yang Digunakan

- `AdminDashboard`: Dashboard utama admin
- `AdminEvents`: Manajemen events
- `AdminNews`: Manajemen berita/blog
- `BlogEditor`: Editor untuk membuat/edit blog
- `AdminGallery`: Manajemen galeri
- `AdminLinktree`: Manajemen linktree
- `AdminNewsletter`: Manajemen newsletter
- `CacheControl`: Kontrol cache

### Routing

Semua route admin menggunakan nested routing dengan React Router:

```tsx
<Routes>
  <Route path="/" element={<AdminDashboard />} />
  <Route path="/events" element={<AdminEvents />} />
  <Route path="/news" element={<AdminNews />} />
  <Route path="/news/new" element={<BlogEditor />} />
  <Route path="/news/edit/:id" element={<BlogEditor />} />
  <Route path="/gallery" element={<AdminGallery />} />
  <Route path="/linktree" element={<AdminLinktree />} />
  <Route path="/newsletter" element={<AdminNewsletter />} />
  <Route path="/cache" element={<CacheControl />} />
</Routes>
```

## Keuntungan Struktur Baru

1. **Pemisahan yang Jelas**: Halaman admin terpisah dari komponen UI
2. **Sidebar Navigation**: Lebih mudah navigasi dengan sidebar vertikal
3. **Struktur yang Rapi**: Folder admin terorganisir dengan baik
4. **Maintainability**: Lebih mudah untuk maintenance dan update
5. **Consistency**: Konsisten dengan struktur folder modern React

## Penggunaan

Untuk mengakses admin panel:

- **Local Development**: `http://localhost:5173/#/admin`
- **Production**: `https://yourdomain.com/admin`
- **Subdomain**: `https://admin.yourdomain.com`
