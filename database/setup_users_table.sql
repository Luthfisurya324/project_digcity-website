-- Setup tabel users untuk DIGCITY Website
-- Jalankan script ini di Supabase SQL Editor

-- 1. Buat tabel users jika belum ada
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- 3. Buat trigger untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Insert admin user pertama
-- Ganti dengan email dan ID yang sesuai
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

-- 5. Verifikasi data
SELECT 
  id, 
  email, 
  role, 
  full_name, 
  is_active, 
  created_at, 
  updated_at 
FROM users 
ORDER BY created_at;

-- 6. Catatan: RLS akan di-disable sementara untuk testing
-- Lihat file fix_rls_policies.sql untuk detail

