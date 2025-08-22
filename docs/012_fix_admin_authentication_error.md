# Fix Admin Authentication Error 500

## Deskripsi Masalah
Halaman admin tidak bisa login karena terjadi error 500 saat mengakses data user dari Supabase. Error terjadi pada query ke tabel `users` untuk memverifikasi role admin.

## Error yang Ditemukan

### Error Awal (500 Internal Server Error)
```
mqjdyiyoigjnfadqatrx.supabase.co/rest/v1/users?select=role&id=eq.24e91d70-889f-40ff-8efa-47cf6830c0d0:1 
Failed to load resource: the server responded with a status of 500 ()
```

### Error Baru (RLS Policy Recursion)
```
Error accessing users table: {
  code: '42P17', 
  message: 'infinite recursion detected in policy for relation "users"'
}
```

## Analisis Masalah
1. **URL Supabase Mismatch**: Error menunjukkan URL `mqjdyiyoigjnfadqatrx.supabase.co` sedangkan kode menggunakan `yiilfxyioyzcbtxyhnvo.supabase.co`
2. **Tabel Users Tidak Ada**: Kemungkinan tabel `users` belum dibuat di database Supabase
3. **Struktur Database Tidak Sesuai**: Interface User di kode tidak sesuai dengan struktur tabel di database
4. **RLS Policy Recursion**: Row Level Security policies menyebabkan infinite recursion

## Solusi yang Diterapkan

### 1. Perbaiki Konfigurasi Supabase
- Update environment variables dengan URL dan key yang benar
- Pastikan tabel `users` sudah dibuat dengan struktur yang sesuai

### 2. Perbaiki Error Handling
- Tambahkan fallback untuk kasus tabel users tidak ada
- Gunakan auth.user_metadata untuk role check sebagai alternatif

### 3. Perbaiki Struktur Database
- Buat tabel `users` dengan kolom yang diperlukan
- Setup Row Level Security (RLS) yang tepat
- **FIX RLS Policy Recursion**: Perbaiki policies yang menyebabkan infinite loop

### 4. Perbaiki RLS Policies
Masalah utama adalah RLS policies yang menyebabkan infinite recursion. Perlu perbaiki policies:

```sql
-- Hapus policies yang bermasalah
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Buat policies yang sederhana dan tidak recursive
CREATE POLICY "Enable read access for authenticated users" ON users
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Atau disable RLS sementara untuk testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

## File yang Dimodifikasi
- `src/lib/supabase.ts` - Perbaiki konfigurasi dan error handling
- `src/components/AdminPanel.tsx` - Perbaiki logic autentikasi
- Environment variables untuk Supabase

## Testing
- Test login dengan akun admin yang valid
- Verifikasi role check berfungsi
- Test error handling untuk kasus database error

## Status
- [x] Dokumentasi masalah
- [x] Perbaikan konfigurasi Supabase
- [x] Perbaiki error handling
- [x] Buat fallback untuk role check
- [x] Buat file konfigurasi terpisah
- [x] Identifikasi masalah RLS policy recursion
- [x] Buat script SQL untuk fix RLS policies
- [x] Buat instruksi quick fix
- [ ] Jalankan script SQL di Supabase
- [ ] Setup environment variables
- [ ] Testing autentikasi
- [ ] Verifikasi role check

## Catatan
1. Pastikan untuk memeriksa dan memperbarui environment variables Supabase sebelum testing
2. **PRIORITAS**: Perbaiki RLS policies yang menyebabkan infinite recursion
3. Gunakan fallback metadata method sementara sampai RLS policies diperbaiki
