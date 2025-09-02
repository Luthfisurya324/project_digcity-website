# Fix Admin Events Routing Consistency

## Masalah
Routing untuk admin events tidak konsisten antara domain utama dan admin subdomain:
- **Domain Utama**: Menggunakan `/admin/events` (sudah benar)
- **Admin Subdomain**: Menggunakan `/events` (sudah benar)
- **Masalah**: AdminEvents component masih menggunakan path `/events` untuk semua kasus

## Analisis
1. **AdminPanel.tsx** sudah memiliki routing yang benar:
   - Domain utama: `/admin/events/*`
   - Admin subdomain: `/events/*`

2. **AdminEvents.tsx** masih menggunakan path hardcoded `/events` yang tidak konsisten dengan domain utama

3. **getActiveTab()** sudah menggunakan path yang benar:
   - Domain utama: `/admin/events`
   - Admin subdomain: `/events`

## Perbaikan yang Dilakukan

### 1. Perbaiki handleTabClick di AdminPanel.tsx
```typescript
const handleTabClick = (tabId: string) => {
  const currentHost = window.location.host
  const isAdminSubdomain = currentHost.startsWith('admin.')
  
  switch (tabId) {
    case 'events':
      if (isAdminSubdomain) {
        navigate('/events')           // ✅ Admin subdomain
      } else {
        navigate('/admin/events')     // ✅ Domain utama
      }
      break
    case 'news':
      if (isAdminSubdomain) {
        navigate('/news')             // ✅ Admin subdomain
      } else {
        navigate('/admin/news')       // ✅ Domain utama
      }
      break
    // ... lainnya dengan pola yang sama
  }
}
```

### 2. Perbaiki AdminEvents.tsx untuk Support Multi-Domain

#### **A. handleSubmit - Setelah Save Event**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // ... save logic
  await loadEvents()
  console.log('Event saved successfully!')
  
  const currentHost = window.location.host
  const isAdminSubdomain = currentHost.startsWith('admin.')
  
  if (isAdminSubdomain) {
    navigate('/events')           // ✅ Admin subdomain
  } else {
    navigate('/admin/events')     // ✅ Domain utama
  }
}
```

#### **B. handleEdit - Navigasi ke Edit Form**
```typescript
const handleEdit = (event: Event) => {
  const currentHost = window.location.host
  const isAdminSubdomain = currentHost.startsWith('admin.')
  
  if (isAdminSubdomain) {
    navigate(`/events/edit/${event.id}`)           // ✅ Admin subdomain
  } else {
    navigate(`/admin/events/edit/${event.id}`)     // ✅ Domain utama
  }
}
```

#### **C. resetForm - Kembali ke Events List**
```typescript
const resetForm = () => {
  // ... reset state
  
  const currentHost = window.location.host
  const isAdminSubdomain = currentHost.startsWith('admin.')
  
  if (isAdminSubdomain) {
    navigate('/events')           // ✅ Admin subdomain
  } else {
    navigate('/admin/events')     // ✅ Domain utama
  }
}
```

#### **D. Tombol "Add New Event"**
```typescript
<button
  onClick={() => {
    const currentHost = window.location.host
    const isAdminSubdomain = currentHost.startsWith('admin.')
    
    if (isAdminSubdomain) {
      navigate('/events/new')           // ✅ Admin subdomain
    } else {
      navigate('/admin/events/new')     // ✅ Domain utama
    }
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
    const currentHost = window.location.host
    const isAdminSubdomain = currentHost.startsWith('admin.')
    
    if (isAdminSubdomain) {
      navigate('/events')           // ✅ Admin subdomain
    } else {
      navigate('/admin/events')     // ✅ Domain utama
    }
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
    const currentHost = window.location.host
    const isAdminSubdomain = currentHost.startsWith('admin.')
    
    if (isAdminSubdomain) {
      navigate('/events/new')           // ✅ Admin subdomain
    } else {
      navigate('/admin/events/new')     // ✅ Domain utama
    }
  }}
>
  <Plus size={20} className="mr-2" />
  Add First Event
</button>
```

## Cara Kerja Routing Sekarang

### **Dari Domain Utama** (`digcity.com/admin`)
1. User mengakses `/admin/events` → AdminEvents component
2. Semua navigasi internal menggunakan `/admin/events/*`:
   - `/admin/events` → Events list
   - `/admin/events/new` → Add new event form
   - `/admin/events/edit/:id` → Edit event form

### **Dari Admin Subdomain** (`admin.digcity.com`)
1. User mengakses `/events` → AdminEvents component
2. Semua navigasi internal menggunakan `/events/*`:
   - `/events` → Events list
   - `/events/new` → Add new event form
   - `/events/edit/:id` → Edit event form

## Keuntungan Perbaikan

1. **Konsistensi Routing**: Domain utama dan admin subdomain menggunakan path yang sesuai
2. **URL yang Bermakna**: User bisa bookmark halaman dengan URL yang benar
3. **Browser Navigation**: Back/Forward button berfungsi normal di kedua domain
4. **SEO Friendly**: URL yang konsisten dan deskriptif
5. **User Experience**: Navigasi yang intuitif di kedua domain

## Testing

### **Domain Utama** (`digcity.com/admin`)
1. **Add Event**: Klik "Add New Event" → URL `/admin/events/new`
2. **Edit Event**: Klik "Edit" → URL `/admin/events/edit/:id`
3. **Navigation**: Tombol "Kembali ke Events" → URL `/admin/events`
4. **Save**: Setelah save → kembali ke `/admin/events`

### **Admin Subdomain** (`admin.digcity.com`)
1. **Add Event**: Klik "Add New Event" → URL `/events/new`
2. **Edit Event**: Klik "Edit" → URL `/events/edit/:id`
3. **Navigation**: Tombol "Kembali ke Events" → URL `/events`
4. **Save**: Setelah save → kembali ke `/events`

## Status
✅ **FIXED** - Routing admin events sudah konsisten antara domain utama dan admin subdomain
✅ Domain utama menggunakan `/admin/events/*`
✅ Admin subdomain menggunakan `/events/*`
✅ Semua navigasi internal menggunakan path yang sesuai
✅ Support untuk kedua domain dengan routing yang benar
✅ URL sync dengan mode (list/new/edit) di kedua domain
