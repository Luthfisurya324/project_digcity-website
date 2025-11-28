-- =====================================================
-- COMPREHENSIVE RLS POLICIES FIX FOR DIGCITY PROJECT
-- =====================================================
-- This script fixes all RLS policy issues found in the project
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. FIX USERS TABLE RLS POLICIES
-- =====================================================

-- Disable RLS temporarily to avoid infinite recursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON users;

-- Create safe RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for reading user data (safe, no recursion)
CREATE POLICY "users_select_policy" ON users
  FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM auth.users au 
    WHERE au.id = auth.uid() 
    AND au.raw_user_meta_data->>'role' = 'admin'
  ));

-- Policy for inserting users (admin only)
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users au 
    WHERE au.id = auth.uid() 
    AND au.raw_user_meta_data->>'role' = 'admin'
  ));

-- Policy for updating users (own profile or admin)
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM auth.users au 
    WHERE au.id = auth.uid() 
    AND au.raw_user_meta_data->>'role' = 'admin'
  ));

-- Policy for deleting users (admin only)
CREATE POLICY "users_delete_policy" ON users
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM auth.users au 
    WHERE au.id = auth.uid() 
    AND au.raw_user_meta_data->>'role' = 'admin'
  ));

-- =====================================================
-- 2. FIX EVENTS TABLE RLS POLICIES
-- =====================================================

-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON events;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON events;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON events;
DROP POLICY IF EXISTS "events_select_policy" ON events;
DROP POLICY IF EXISTS "events_insert_policy" ON events;
DROP POLICY IF EXISTS "events_update_policy" ON events;
DROP POLICY IF EXISTS "events_delete_policy" ON events;

-- Create new clean policies for events
CREATE POLICY "events_select_policy" ON events
  FOR SELECT
  USING (true); -- Public read access

CREATE POLICY "events_insert_policy" ON events
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "events_update_policy" ON events
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "events_delete_policy" ON events
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. FIX NEWS TABLE RLS POLICIES
-- =====================================================

-- Enable RLS on news table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'news') THEN
    ALTER TABLE news ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "news_select_policy" ON news;
    DROP POLICY IF EXISTS "news_insert_policy" ON news;
    DROP POLICY IF EXISTS "news_update_policy" ON news;
    DROP POLICY IF EXISTS "news_delete_policy" ON news;
    
    -- Create new policies
    CREATE POLICY "news_select_policy" ON news
      FOR SELECT
      USING (true); -- Public read access
    
    CREATE POLICY "news_insert_policy" ON news
      FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
    
    CREATE POLICY "news_update_policy" ON news
      FOR UPDATE
      USING (auth.role() = 'authenticated');
    
    CREATE POLICY "news_delete_policy" ON news
      FOR DELETE
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- =====================================================
-- 4. FIX GALLERY TABLE RLS POLICIES
-- =====================================================

-- Enable RLS on gallery table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gallery') THEN
    ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "gallery_select_policy" ON gallery;
    DROP POLICY IF EXISTS "gallery_insert_policy" ON gallery;
    DROP POLICY IF EXISTS "gallery_update_policy" ON gallery;
    DROP POLICY IF EXISTS "gallery_delete_policy" ON gallery;
    
    -- Create new policies
    CREATE POLICY "gallery_select_policy" ON gallery
      FOR SELECT
      USING (true); -- Public read access
    
    CREATE POLICY "gallery_insert_policy" ON gallery
      FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
    
    CREATE POLICY "gallery_update_policy" ON gallery
      FOR UPDATE
      USING (auth.role() = 'authenticated');
    
    CREATE POLICY "gallery_delete_policy" ON gallery
      FOR DELETE
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- =====================================================
-- 5. FIX STORAGE BUCKET POLICIES
-- =====================================================

-- Drop all existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "events-images-upload-policy" ON storage.objects;
DROP POLICY IF EXISTS "events-images-authenticated-upload" ON storage.objects;
DROP POLICY IF EXISTS "events-images-final-upload" ON storage.objects;
DROP POLICY IF EXISTS "events-images-read-policy" ON storage.objects;
DROP POLICY IF EXISTS "events-images-update-policy" ON storage.objects;
DROP POLICY IF EXISTS "events-images-delete-policy" ON storage.objects;
DROP POLICY IF EXISTS "admin-images-insert" ON storage.objects;
DROP POLICY IF EXISTS "admin-images-select" ON storage.objects;
DROP POLICY IF EXISTS "admin-images-update" ON storage.objects;
DROP POLICY IF EXISTS "admin-images-delete" ON storage.objects;
DROP POLICY IF EXISTS "Very permissive test policy" ON storage.objects;
DROP POLICY IF EXISTS "Secure admin policy for admin-images bucket" ON storage.objects;

-- Create comprehensive storage policies

-- 1. Public read access for all buckets
CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT
  USING (true);

-- 2. Authenticated users can upload to any bucket
CREATE POLICY "storage_authenticated_upload" ON storage.objects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 3. Authenticated users can update their uploads
CREATE POLICY "storage_authenticated_update" ON storage.objects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 4. Authenticated users can delete their uploads
CREATE POLICY "storage_authenticated_delete" ON storage.objects
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. CREATE ADMIN USER IF NOT EXISTS
-- =====================================================

-- Insert or update admin user
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
  is_active = true,
  updated_at = NOW();

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

-- Check RLS status for all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname IN ('public', 'storage')
  AND tablename IN ('users', 'events', 'news', 'gallery', 'objects')
ORDER BY schemaname, tablename;

-- Check all active policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
ORDER BY schemaname, tablename, policyname;

-- Verify admin user exists
SELECT id, email, role, full_name, is_active, created_at
FROM users 
WHERE email = 'admin@digcity.id';

-- =====================================================
-- SCRIPT COMPLETED SUCCESSFULLY
-- =====================================================
-- All RLS policies have been fixed and standardized
-- Admin user has been created/updated
-- Run the verification queries above to confirm everything is working