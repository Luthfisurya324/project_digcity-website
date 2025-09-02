# Admin Components

Folder ini berisi semua komponen yang digunakan untuk admin panel.

## Struktur

```
src/components/admin/
├── AdminDashboard.tsx      # Dashboard utama admin
├── AdminEvents.tsx         # Manajemen events
├── AdminNews.tsx           # Manajemen berita/blog
├── BlogEditor.tsx          # Editor untuk membuat/edit blog
├── AdminGallery.tsx        # Manajemen galeri
├── AdminLinktree.tsx       # Manajemen linktree
├── AdminNewsletter.tsx     # Manajemen newsletter
├── AdminLogin.tsx          # Form login admin
├── ImageUpload.tsx         # Komponen upload gambar
├── MultipleImageUpload.tsx # Upload multiple gambar
├── ImageCropper.tsx        # Cropper gambar
├── FolderStructureViewer.tsx # Viewer struktur folder
└── README.md               # Dokumentasi ini
```

## Komponen Utama

### AdminDashboard.tsx
Dashboard utama yang menampilkan:
- Statistik konten
- Quick actions
- Recent activities
- System status

### AdminEvents.tsx
Manajemen events dengan fitur:
- CRUD operations untuk events
- Upload gambar event
- Kategori management
- Date/time picker

### AdminNews.tsx
Manajemen berita/blog dengan:
- List semua berita
- Filter dan search
- Status management (draft/published)
- Bulk operations

### BlogEditor.tsx
Editor WYSIWYG untuk blog dengan:
- Rich text editor
- Image upload
- SEO fields
- Preview mode
- Auto-save

### AdminGallery.tsx
Manajemen galeri dengan:
- Grid view images
- Folder organization
- Bulk operations
- Image metadata

### AdminLinktree.tsx
Manajemen linktree dengan:
- Link management
- Category grouping
- Analytics
- Customization options

### AdminNewsletter.tsx
Manajemen newsletter dengan:
- Subscriber list
- Campaign management
- Template editor
- Analytics

## Komponen Pendukung

### ImageUpload.tsx
Komponen upload gambar tunggal dengan:
- Drag & drop
- Preview
- Validation
- Progress indicator

### MultipleImageUpload.tsx
Upload multiple gambar dengan:
- Batch processing
- Queue management
- Error handling
- Progress tracking

### ImageCropper.tsx
Cropper gambar dengan:
- Aspect ratio control
- Zoom dan pan
- Preview
- Export options

### FolderStructureViewer.tsx
Viewer struktur folder dengan:
- Tree view
- Navigation
- Search
- Context menu

## Penggunaan

Semua komponen ini digunakan oleh `AdminPanel.tsx` yang berada di `src/pages/AdminPanel.tsx`. Komponen-komponen ini tidak dapat digunakan secara independen dan harus diakses melalui admin panel.

## Dependencies

Komponen-komponen ini bergantung pada:
- React Router untuk navigation
- Supabase untuk backend operations
- Lucide React untuk icons
- Tailwind CSS untuk styling
- Custom hooks dan utilities
