-- Fix RLS Policies untuk tabel users
-- Masalah: infinite recursion detected in policy for relation "users"

-- 1. Hapus policies yang bermasalah
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;

-- 2. Disable RLS sementara untuk testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. Verifikasi struktur tabel
-- Pastikan tabel users memiliki struktur yang benar
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 4. Insert test admin user jika belum ada
-- Ganti 'your-user-id-here' dengan ID user yang sebenarnya
INSERT INTO users (id, email, role, full_name, is_active)
VALUES (
  '24e91d70-889f-40ff-8efa-47cf6830c0d0', -- ID dari error log
  'admin@digcity.id', -- Email dari error log
  'admin',
  'Admin User',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 5. Re-enable RLS dengan policies yang sederhana (opsional)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Simple read access" ON users
--   FOR SELECT USING (true);

-- 6. Test query
SELECT id, email, role, is_active FROM users WHERE id = '24e91d70-889f-40ff-8efa-47cf6830c0d0';

