-- Fix Events RLS Policy - Error 403
-- Jalankan file ini di Supabase SQL Editor

-- Enable RLS pada tabel events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies jika ada
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON events;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON events;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON events;

-- Policy untuk read access (semua user bisa baca)
CREATE POLICY "Enable read access for all users" ON events
FOR SELECT USING (true);

-- Policy untuk insert (user yang sudah login)
CREATE POLICY "Enable insert for authenticated users" ON events
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy untuk update (user yang sudah login)
CREATE POLICY "Enable update for authenticated users" ON events
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy untuk delete (user yang sudah login)
CREATE POLICY "Enable delete for authenticated users" ON events
FOR DELETE USING (auth.role() = 'authenticated');

-- Verifikasi bahwa policy sudah dibuat
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'events'
ORDER BY policyname;



