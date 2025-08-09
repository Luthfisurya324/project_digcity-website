# DIGCITY Website Admin Panel Setup

## Database Setup

### 1. Supabase Configuration

Proyek ini sudah terhubung dengan Supabase project:
- **Project ID**: `yiilfxyioyzcbtxyhnvo`
- **URL**: `https://yiilfxyioyzcbtxyhnvo.supabase.co`
- **Region**: `ap-southeast-1`

### 2. Database Schema Setup

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project "digcity"
3. Buka **SQL Editor**
4. Copy dan jalankan script dari file `database/schema.sql`
5. Script akan membuat:
   - Tabel `users`, `events`, `news`, `gallery`, `categories`
   - Row Level Security (RLS) policies
   - Triggers untuk `updated_at`
   - Indexes untuk performa
   - Sample data untuk testing

### 3. Authentication Setup

1. Di Supabase Dashboard, buka **Authentication** > **Settings**
2. Pastikan **Enable email confirmations** diaktifkan
3. Set **Site URL** ke `http://localhost:5173` untuk development
4. Untuk production, ganti dengan domain website yang sebenarnya

## Admin Panel Features

### 1. Authentication
- Login dengan email dan password
- Session management dengan Supabase Auth
- Auto-redirect ke login jika belum authenticated

### 2. Dashboard
- Overview statistik (total events, news, gallery)
- Recent events dan news
- Quick access ke semua fitur

### 3. Events Management
- CRUD operations untuk events
- Upload gambar event
- Set status (upcoming, ongoing, completed, cancelled)
- Manage registrations dan participants
- Featured events

### 4. News Management
- CRUD operations untuk articles
- Rich text content
- Categories dan tags
- Draft/Published status
- Featured articles

### 5. Gallery Management
- CRUD operations untuk photos
- Category filtering (DIGIMON, Level Up Day, SCBD, dll)
- Tags untuk better organization
- Event date tracking

## Accessing Admin Panel

### Development
1. Start development server: `npm run dev`
2. Buka browser ke `http://localhost:5173`
3. Navigate ke `/admin` atau tambahkan `#admin` di URL
4. Login dengan credentials yang sudah dibuat di Supabase Auth

### Creating Admin User

1. **Via Supabase Dashboard**:
   - Buka **Authentication** > **Users**
   - Click **Add user**
   - Masukkan email dan password
   - User akan otomatis ditambahkan ke tabel `users` dengan role `admin`

2. **Via SQL**:
   ```sql
   -- Insert admin user directly
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
   VALUES (
     'admin@digcity.com',
     crypt('your_password', gen_salt('bf')),
     NOW(),
     NOW(),
     NOW()
   );
   ```

## Environment Variables

Pastikan file `.env` berisi:
```env
VITE_SUPABASE_URL=https://yiilfxyioyzcbtxyhnvo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaWxmeHlpb3l6Y2J0eHlobnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNTgyMTksImV4cCI6MjA2ODczNDIxOX0.GORwjux2XXLPFQMO67JKJjEVXzpXbOX8R8HL-jhou5c
```

## File Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLogin.tsx      # Login form
│   │   ├── AdminDashboard.tsx  # Dashboard overview
│   │   ├── AdminEvents.tsx     # Events management
│   │   ├── AdminNews.tsx       # News management
│   │   └── AdminGallery.tsx    # Gallery management
│   └── AdminPanel.tsx          # Main admin container
├── pages/
│   └── AdminPage.tsx           # Admin page wrapper
├── lib/
│   └── supabase.ts            # Supabase client & API functions
└── App.tsx                    # Main app with admin route
```

## API Functions

File `src/lib/supabase.ts` menyediakan:

### Events API
- `eventsAPI.getAll()` - Get all events
- `eventsAPI.getById(id)` - Get event by ID
- `eventsAPI.create(data)` - Create new event
- `eventsAPI.update(id, data)` - Update event
- `eventsAPI.delete(id)` - Delete event

### News API
- `newsAPI.getAll()` - Get all news
- `newsAPI.getById(id)` - Get news by ID
- `newsAPI.create(data)` - Create new article
- `newsAPI.update(id, data)` - Update article
- `newsAPI.delete(id)` - Delete article

### Gallery API
- `galleryAPI.getAll()` - Get all gallery items
- `galleryAPI.getById(id)` - Get gallery item by ID
- `galleryAPI.create(data)` - Create new gallery item
- `galleryAPI.update(id, data)` - Update gallery item
- `galleryAPI.delete(id)` - Delete gallery item

### Auth API
- `authAPI.signIn(email, password)` - Login
- `authAPI.signOut()` - Logout
- `authAPI.getCurrentUser()` - Get current user

## Security Features

1. **Row Level Security (RLS)**:
   - Public dapat read events, published news, dan gallery
   - Authenticated users dapat manage semua content
   - Users table hanya accessible oleh authenticated users

2. **Input Validation**:
   - Required fields validation
   - URL validation untuk images
   - Date validation
   - Email validation

3. **Error Handling**:
   - Try-catch blocks untuk semua API calls
   - User-friendly error messages
   - Loading states

## Troubleshooting

### Common Issues

1. **"Cannot read properties of null"**:
   - Pastikan user sudah login
   - Check network connection ke Supabase

2. **"Row Level Security policy violation"**:
   - Pastikan RLS policies sudah dijalankan
   - Check user authentication status

3. **"Failed to fetch"**:
   - Check environment variables
   - Pastikan Supabase project aktif
   - Check network connectivity

### Debug Tips

1. Check browser console untuk errors
2. Check Supabase logs di dashboard
3. Verify database schema di SQL Editor
4. Test API calls di browser network tab

## Production Deployment

1. Update environment variables untuk production
2. Set proper Site URL di Supabase Auth settings
3. Configure domain untuk Supabase project
4. Enable proper CORS settings
5. Set up SSL certificate

## Support

Untuk bantuan teknis:
1. Check dokumentasi Supabase: https://supabase.com/docs
2. Check React documentation: https://react.dev
3. Contact development team