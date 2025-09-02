# Fix Development Routing Consistency

## Masalah
Routing di development localhost tidak konsisten dengan production domain utama `digcity.my.id`:
- **Development**: Menggunakan path `/events` (tidak konsisten)
- **Production Domain Utama**: Menggunakan `/admin/events` (sudah benar)
- **Production Admin Subdomain**: Menggunakan `/events` (sudah benar)

## Analisis
1. **Domain Detection** tidak mengenali localhost sebagai development environment
2. **Routing Hardcoded** di AdminEvents masih menggunakan path yang tidak konsisten
3. **Development vs Production** memiliki behavior yang berbeda

## Perbaikan yang Dilakukan

### 1. Tambah Utility Functions di domainDetection.ts

#### **A. isAdminSubdomain dengan Development Support**
```typescript
export const isAdminSubdomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Development environment: localhost, 127.0.0.1, etc.
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
    return false; // Treat as domain utama for consistency
  }
  
  return hostname === 'admin.digcity.my.id';
};
```

#### **B. getAdminBasePath untuk Routing Konsisten**
```typescript
export const getAdminBasePath = (): string => {
  if (typeof window === 'undefined') return '/admin';
  
  const hostname = window.location.hostname;
  
  // Development environment: treat as domain utama
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
    return '/admin';
  }
  
  // Admin subdomain: no prefix needed
  if (hostname === 'admin.digcity.my.id') {
    return '';
  }
  
  // Production domain utama: use /admin prefix
  return '/admin';
};
```

#### **C. isDevelopment untuk Environment Detection**
```typescript
export const isDevelopment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost');
};
```

### 2. Perbaiki AdminPanel.tsx - handleTabClick

#### **Sebelum (SALAH):**
```typescript
const handleTabClick = (tabId: string) => {
  const currentHost = window.location.host
  const isAdminSubdomain = currentHost.startsWith('admin.')
  
  switch (tabId) {
    case 'events':
      if (isAdminSubdomain) {
        navigate('/events')           // ❌ Hardcoded path
      } else {
        navigate('/admin/events')     // ❌ Hardcoded path
      }
      break
    // ... lainnya
  }
}
```

#### **Sesudah (BENAR):**
```typescript
import { getAdminBasePath } from '../utils/domainDetection'

const handleTabClick = (tabId: string) => {
  const adminBasePath = getAdminBasePath()
  
  switch (tabId) {
    case 'events':
      navigate(`${adminBasePath}/events`)     // ✅ Dynamic path
      break
    case 'news':
      navigate(`${adminBasePath}/news`)       // ✅ Dynamic path
      break
    // ... lainnya dengan pola yang sama
  }
}
```

### 3. Perbaiki AdminEvents.tsx - Semua Navigasi

#### **A. handleSubmit - Setelah Save Event**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // ... save logic
  await loadEvents()
  console.log('Event saved successfully!')
  
  const adminBasePath = getAdminBasePath()
  navigate(`${adminBasePath}/events`)  // ✅ Dynamic path
}
```

#### **B. handleEdit - Navigasi ke Edit Form**
```typescript
const handleEdit = (event: Event) => {
  const adminBasePath = getAdminBasePath()
  navigate(`${adminBasePath}/events/edit/${event.id}`)  // ✅ Dynamic path
}
```

#### **C. resetForm - Kembali ke Events List**
```typescript
const resetForm = () => {
  // ... reset state
  
  const adminBasePath = getAdminBasePath()
  navigate(`${adminBasePath}/events`)  // ✅ Dynamic path
}
```

#### **D. Tombol "Add New Event"**
```typescript
<button
  onClick={() => {
    const adminBasePath = getAdminBasePath()
    navigate(`${adminBasePath}/events/new`)  // ✅ Dynamic path
  }}
>
  <Plus size={20} />
  <span>Add New Event</span>
</button>
```

#### **E. Tombol "Kembali ke Events"**
```typescript
<button
  type="button"
  onClick={() => {
    const adminBasePath = getAdminBasePath()
    navigate(`${adminBasePath}/events`)  // ✅ Dynamic path
  }}
>
  <span>←</span>
  <span>Kembali ke Events</span>
</button>
```

#### **F. Tombol "Add First Event"**
```typescript
<button
  onClick={() => {
    const adminBasePath = getAdminBasePath()
    navigate(`${adminBasePath}/events/new`)  // ✅ Dynamic path
  }}
>
  <Plus size={20} className="mr-2" />
  Add First Event
</button>
```

## Cara Kerja Routing Sekarang

### **🖥️ Development Environment** (`localhost:3000`)
1. `getAdminBasePath()` → return `/admin`
2. Semua routing menggunakan `/admin/*`:
   - `/admin/events` → Events list
   - `/admin/events/new` → Add new event form
   - `/admin/events/edit/:id` → Edit event form

### **🌐 Production Domain Utama** (`digcity.my.id/admin`)
1. `getAdminBasePath()` → return `/admin`
2. Semua routing menggunakan `/admin/*`:
   - `/admin/events` → Events list
   - `/admin/events/new` → Add new event form
   - `/admin/events/edit/:id` → Edit event form

### **🔧 Production Admin Subdomain** (`admin.digcity.my.id`)
1. `getAdminBasePath()` → return `''` (empty string)
2. Semua routing menggunakan `/*`:
   - `/events` → Events list
   - `/events/new` → Add new event form
   - `/events/edit/:id` → Edit event form

## Keuntungan Perbaikan

1. **Konsistensi Development vs Production**: Development localhost sekarang konsisten dengan production domain utama
2. **Single Source of Truth**: Semua routing menggunakan `getAdminBasePath()` yang sama
3. **Maintenance Mudah**: Tidak perlu ubah routing di banyak tempat
4. **Environment Detection**: Otomatis mendeteksi environment dan menggunakan path yang sesuai
5. **URL yang Bermakna**: Development dan production memiliki URL yang konsisten

## Testing

### **Development Localhost** (`localhost:3000`)
1. **Add Event**: Klik "Add New Event" → URL `/admin/events/new`
2. **Edit Event**: Klik "Edit" → URL `/admin/events/edit/:id`
3. **Navigation**: Tombol "Kembali ke Events" → URL `/admin/events`
4. **Save**: Setelah save → kembali ke `/admin/events`

### **Production Domain Utama** (`digcity.my.id/admin`)
1. **Add Event**: Klik "Add New Event" → URL `/admin/events/new`
2. **Edit Event**: Klik "Edit" → URL `/admin/events/edit/:id`
3. **Navigation**: Tombol "Kembali ke Events" → URL `/admin/events`
4. **Save**: Setelah save → kembali ke `/admin/events`

### **Production Admin Subdomain** (`admin.digcity.my.id`)
1. **Add Event**: Klik "Add New Event" → URL `/events/new`
2. **Edit Event**: Klik "Edit" → URL `/events/edit/:id`
3. **Navigation**: Tombol "Kembali ke Events" → URL `/events`
4. **Save**: Setelah save → kembali ke `/events`

## Status
✅ **FIXED** - Development routing sudah konsisten dengan production domain utama
✅ Development localhost menggunakan `/admin/*` (sama dengan production)
✅ Production admin subdomain tetap menggunakan `/*` (tidak berubah)
✅ Single utility function untuk semua routing
✅ Environment detection otomatis
✅ Maintenance dan development lebih mudah
