# Setup Supabase untuk Admin Authentication

## Masalah yang Ditemukan
Error 500 saat login admin karena:
1. URL Supabase tidak sesuai (mismatch antara kode dan database)
2. Tabel `users` mungkin tidak ada atau tidak accessible
3. Environment variables tidak dikonfigurasi dengan benar

## Langkah Perbaikan

### 1. Update Environment Variables
Buat file `.env` di root project dengan konfigurasi berikut:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://mqjdyiyoigjnfadqatrx.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**Catatan**: Ganti `your_actual_anon_key_here` dengan anon key yang benar dari project Supabase.

### 2. Verifikasi Project Supabase
Berdasarkan error yang muncul, project Supabase yang aktif adalah:
- URL: `https://mqjdyiyoigjnfadqatrx.supabase.co`
- Project ID: `mqjdyiyoigjnfadqatrx`

### 3. Setup Database
**PENTING**: Jalankan script SQL yang sudah disediakan untuk menghindari masalah RLS policy recursion.

#### Langkah 1: Jalankan Setup Table
Jalankan file `database/setup_users_table.sql` di Supabase SQL Editor untuk membuat tabel dengan struktur yang benar.

#### Langkah 2: Fix RLS Policies
Jalankan file `database/fix_rls_policies.sql` untuk memperbaiki masalah infinite recursion:

```sql
-- Disable RLS sementara untuk testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Hapus policies yang bermasalah
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
```

#### Struktur Tabel yang Benar:
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Setup User Admin
Buat user admin pertama melalui Supabase Dashboard atau SQL:

```sql
-- Insert admin user (ganti dengan email yang sesuai)
INSERT INTO users (id, email, role, full_name)
VALUES (
  'your-user-id-here',
  'admin@digcity.com',
  'admin',
  'Admin User'
);
```

### 5. Testing
1. Restart development server
2. Coba login dengan akun admin
3. Periksa console untuk error messages
4. Verifikasi role check berfungsi

## Troubleshooting

### Error 500 pada users table
- Pastikan tabel `users` sudah dibuat
- Cek RLS policies
- Verifikasi struktur tabel sesuai interface

### Environment variables tidak terbaca
- Restart development server
- Pastikan file `.env` ada di root project
- Cek nama variabel (harus dimulai dengan `VITE_`)

### Authentication berhasil tapi role check gagal
- Cek data di tabel `users`
- Verifikasi RLS policies
- Gunakan fallback metadata method

## Status
- [x] Update konfigurasi Supabase
- [x] Perbaiki error handling
- [x] Buat fallback untuk role check
- [ ] Setup environment variables
- [ ] Setup database tables
- [ ] Testing authentication
