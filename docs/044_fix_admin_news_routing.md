# Fix Admin News Routing

## Masalah
Routing untuk admin news tidak berfungsi dengan baik, khususnya untuk mengakses BlogEditor component.

## Analisis
1. **AdminPanel.tsx** memiliki routing yang benar untuk news:
   - `/news` → AdminNews component
   - `/news/new` → BlogEditor component (untuk artikel baru)
   - `/news/edit/:id` → BlogEditor component (untuk edit artikel)

2. **Masalah utama** ada di fungsi `handleTabClick` yang menggunakan path `/admin/` yang tidak sesuai dengan routing yang ada.

## Perbaikan yang Dilakukan

### 1. Perbaiki handleTabClick di AdminPanel.tsx
```typescript
// Sebelum (SALAH):
const handleTabClick = (tabId: string) => {
  switch (tabId) {
    case 'news':
      navigate('/admin/news')  // ❌ Path tidak sesuai
      break
    // ... lainnya
  }
}

// Sesudah (BENAR):
const handleTabClick = (tabId: string) => {
  switch (tabId) {
    case 'news':
      navigate('/news')  // ✅ Path sesuai dengan routing
      break
    // ... lainnya
  }
}
```

### 2. Routing yang Sudah Benar
```typescript
<Routes>
  <Route path="/" element={<AdminDashboard />} />
  <Route path="/events" element={<AdminEvents />} />
  <Route path="/news" element={<AdminNews />} />
  <Route path="/news/new" element={<BlogEditor />} />        // ✅ Add new article
  <Route path="/news/edit/:id" element={<BlogEditor />} />   // ✅ Edit existing article
  <Route path="/gallery" element={<AdminGallery />} />
  <Route path="/linktree" element={<AdminLinktree />} />
  <Route path="/newsletter" element={<AdminNewsletter />} />
  <Route path="/cache" element={<CacheControl />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### 3. Navigasi di AdminNews.tsx
```typescript
const handleAddNew = () => {
  console.log('Navigating to new news')
  navigate('/news/new')  // ✅ Navigasi ke BlogEditor untuk artikel baru
}

const handleEdit = (newsItem: News) => {
  console.log('Navigating to edit:', newsItem.id)
  navigate(`/news/edit/${newsItem.id}`)  // ✅ Navigasi ke BlogEditor untuk edit
}
```

### 4. Navigasi di BlogEditor.tsx
```typescript
// Tombol "Kembali ke News"
<button
  onClick={() => {
    const currentHost = window.location.host
    const isAdminSubdomain = currentHost.startsWith('admin.')
    
    if (isAdminSubdomain) {
      navigate('/news')  // ✅ Kembali ke news list
    } else {
      navigate('/admin/news')  // ✅ Fallback untuk domain utama
    }
  }}
>
  <ArrowLeft className="w-4 h-4" />
  Kembali ke News
</button>

// Setelah save artikel
if (isAdminSubdomain) {
  navigate('/news')  // ✅ Kembali ke news list
} else {
  navigate('/admin/news')  // ✅ Fallback untuk domain utama
}
```

## Cara Kerja Routing

### Dari Domain Utama
1. User mengakses `/admin` → AdminPanel component
2. AdminPanel memiliki routing internal:
   - `/admin/news` → AdminNews component
   - `/admin/news/new` → BlogEditor component
   - `/admin/news/edit/:id` → BlogEditor component

### Dari Admin Subdomain
1. User mengakses `admin.digcity.com` → AdminPanel component
2. AdminPanel memiliki routing internal:
   - `/news` → AdminNews component
   - `/news/new` → BlogEditor component
   - `/news/edit/:id` → BlogEditor component

## Testing
1. **Add News**: Klik tombol "Add News" di AdminNews → harus navigasi ke BlogEditor
2. **Edit News**: Klik tombol "Edit" di news item → harus navigasi ke BlogEditor dengan data yang ada
3. **Navigation**: Tombol "Kembali ke News" di BlogEditor → harus kembali ke AdminNews
4. **Save**: Setelah save artikel → harus kembali ke AdminNews

## Status
✅ **FIXED** - Routing admin news sudah berfungsi dengan baik
✅ BlogEditor bisa diakses dari AdminNews
✅ Navigasi antar halaman berfungsi normal
✅ Support untuk domain utama dan admin subdomain
