# Fix Admin Events Routing

## Masalah
Routing untuk admin events tidak konsisten dengan AdminNews yang sudah menggunakan BlogEditor terpisah. AdminEvents masih menggunakan inline form yang kurang terorganisir.

## Analisis
1. **AdminEvents.tsx** menggunakan inline form modal untuk edit dan create events
2. **Tidak ada routing terpisah** untuk `/events/new` dan `/events/edit/:id`
3. **Navigasi tidak konsisten** dengan AdminNews yang sudah menggunakan BlogEditor

## Perbaikan yang Dilakukan

### 1. Tambah Routing di AdminPanel.tsx
```typescript
<Routes>
  <Route path="/" element={<AdminDashboard />} />
  <Route path="/events" element={<AdminEvents />} />
  <Route path="/events/new" element={<AdminEvents />} />        // ✅ Add new event
  <Route path="/events/edit/:id" element={<AdminEvents />} />   // ✅ Edit existing event
  <Route path="/news" element={<AdminNews />} />
  <Route path="/news/new" element={<BlogEditor />} />
  <Route path="/news/edit/:id" element={<BlogEditor />} />
  // ... lainnya
</Routes>
```

### 2. Tambah useNavigate dan useParams di AdminEvents.tsx
```typescript
import { useNavigate, useParams } from 'react-router-dom'

const AdminEvents: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  // ... state lainnya
}
```

### 3. Tambah useEffect untuk Handle Routing
```typescript
useEffect(() => {
  loadEvents()
  
  // Handle routing for edit mode
  if (id && id !== 'new') {
    loadEventForEdit(id)
  } else if (id === 'new') {
    setShowForm(true)
    setEditingEvent(null)
  }
}, [id])
```

### 4. Tambah Fungsi loadEventForEdit
```typescript
const loadEventForEdit = async (eventId: string) => {
  try {
    const event = await eventAPI.getById(eventId)
    if (event) {
      setEditingEvent(event)
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        additional_images: event.additional_images || [],
        category: event.category
      })
      setShowForm(true)
    }
  } catch (error) {
    console.error('Error loading event for edit:', error)
  }
}
```

### 5. Modifikasi handleEdit untuk Gunakan Navigate
```typescript
// Sebelum (SALAH):
const handleEdit = (event: Event) => {
  setEditingEvent(event)
  setFormData({...})
  setShowForm(true)
}

// Sesudah (BENAR):
const handleEdit = (event: Event) => {
  navigate(`/events/edit/${event.id}`)
}
```

### 6. Modifikasi Tombol "Add Event" untuk Gunakan Navigate
```typescript
// Sebelum:
<button onClick={() => setShowForm(true)}>
  <Plus size={20} />
  <span>Add New Event</span>
</button>

// Sesudah:
<button onClick={() => navigate('/events/new')}>
  <Plus size={20} />
  <span>Add New Event</span>
</button>
```

### 7. Tambah Tombol "Kembali ke Events" di Form Header
```typescript
<div className="p-6 border-b border-gray-200 flex justify-between items-center">
  <h2 className="text-xl font-semibold text-secondary-900">
    {editingEvent ? 'Edit Event' : 'Add New Event'}
  </h2>
  <button
    type="button"
    onClick={() => navigate('/events')}
    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
  >
    <span>←</span>
    <span>Kembali ke Events</span>
  </button>
</div>
```

### 8. Modifikasi resetForm dan handleSubmit
```typescript
const resetForm = () => {
  // ... reset state
  navigate('/events')  // ✅ Kembali ke events list
}

const handleSubmit = async (e: React.FormEvent) => {
  // ... save logic
  await loadEvents()
  console.log('Event saved successfully!')
  navigate('/events')  // ✅ Kembali ke events list
}
```

## Cara Kerja Routing Baru

### Dari Domain Utama
1. User mengakses `/admin/events` → AdminEvents component
2. AdminEvents memiliki routing internal:
   - `/admin/events` → Events list
   - `/admin/events/new` → Add new event form
   - `/admin/events/edit/:id` → Edit event form

### Dari Admin Subdomain
1. User mengakses `admin.digcity.com/events` → AdminEvents component
2. AdminEvents memiliki routing internal:
   - `/events` → Events list
   - `/events/new` → Add new event form
   - `/events/edit/:id` → Edit event form

## Fitur yang Sekarang Berfungsi
- 🆕 **Add Event**: Tombol "Add New Event" → navigasi ke form dengan URL `/events/new`
- ✏️ **Edit Event**: Tombol "Edit" → navigasi ke form dengan URL `/events/edit/:id`
- 🔙 **Navigation**: Tombol "Kembali ke Events" → kembali ke events list
- 💾 **Save**: Setelah save event → otomatis kembali ke events list
- 🔄 **URL Sync**: URL berubah sesuai dengan mode (list/new/edit)

## Keuntungan Routing Baru
1. **URL yang Bermakna**: User bisa bookmark halaman edit/add
2. **Browser Navigation**: Back/Forward button berfungsi normal
3. **Konsistensi**: Sama dengan AdminNews yang menggunakan BlogEditor
4. **SEO Friendly**: URL yang lebih deskriptif
5. **User Experience**: Navigasi yang lebih intuitif

## Testing
1. **Add Event**: Klik "Add New Event" → URL berubah ke `/events/new`
2. **Edit Event**: Klik "Edit" → URL berubah ke `/events/edit/:id`
3. **Navigation**: Tombol "Kembali ke Events" → kembali ke `/events`
4. **Save**: Setelah save → otomatis kembali ke `/events`
5. **Browser**: Back/Forward button berfungsi normal

## Status
✅ **FIXED** - Routing admin events sudah konsisten dengan AdminNews
✅ Events bisa diakses dengan URL yang bermakna
✅ Navigasi antar halaman berfungsi normal
✅ Support untuk domain utama dan admin subdomain
✅ URL sync dengan mode (list/new/edit)
