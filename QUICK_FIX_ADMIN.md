# 🚀 Quick Fix Admin Authentication - DIGCITY Website

## ⚠️ Masalah yang Ditemukan
Error `infinite recursion detected in policy for relation "users"` menyebabkan admin tidak bisa login.

## 🔧 Solusi Cepat (5 Menit)

### Langkah 1: Buka Supabase Dashboard
1. Login ke [supabase.com](https://supabase.com)
2. Pilih project: `mqjdyiyoigjnfadqatrx`
3. Buka **SQL Editor**

### Langkah 2: Jalankan Script Fix
Copy-paste dan jalankan script ini:

```sql
-- Fix RLS Policies - Disable sementara
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Hapus policies yang bermasalah
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Insert admin user jika belum ada
INSERT INTO users (id, email, role, full_name, is_active)
VALUES (
  '24e91d70-889f-40ff-8efa-47cf6830c0d0',
  'admin@digcity.id',
  'admin',
  'Admin User',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Verifikasi
SELECT * FROM users WHERE email = 'admin@digcity.id';
```

### Langkah 3: Test Login
1. Refresh halaman admin
2. Login dengan `admin@digcity.id`
3. Password: (password yang sudah ada)

## ✅ Hasil yang Diharapkan
- Admin bisa login tanpa error
- Tidak ada lagi error 500 atau RLS recursion
- Role check berfungsi dengan baik

## 🔍 Jika Masih Error
1. **Check Console**: Lihat apakah masih ada error
2. **Verify Table**: Pastikan tabel `users` ada dan berisi data
3. **Check Permissions**: Pastikan user memiliki akses ke tabel

## 📝 Catatan
- RLS di-disable sementara untuk testing
- Setelah berfungsi, bisa di-enable kembali dengan policies yang sederhana
- Lihat file `database/fix_rls_policies.sql` untuk detail lengkap

## 🆘 Butuh Bantuan?
Jika masih bermasalah, cek:
1. File `SUPABASE_SETUP.md` untuk setup lengkap
2. File `docs/012_fix_admin_authentication_error.md` untuk dokumentasi masalah
3. Console browser untuk error messages

