-- =====================================================
-- RLS POLICIES TESTING SCRIPT
-- =====================================================
-- Run this script after implementing fix_all_rls_policies.sql
-- to verify that all policies are working correctly

-- =====================================================
-- 1. BASIC SYSTEM CHECKS
-- =====================================================

-- Check PostgreSQL version and RLS support
SELECT version();

-- Check current user and role
SELECT current_user, session_user, current_setting('role');

-- =====================================================
-- 2. RLS STATUS VERIFICATION
-- =====================================================

-- Check RLS status for all relevant tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as status
FROM pg_tables 
WHERE schemaname IN ('public', 'storage')
  AND tablename IN ('users', 'events', 'news', 'gallery', 'objects')
ORDER BY schemaname, tablename;

-- =====================================================
-- 3. POLICY INVENTORY
-- =====================================================

-- List all active policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN permissive = 'PERMISSIVE' THEN '✅ Permissive'
    ELSE '⚠️ Restrictive'
  END as type,
  roles
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
ORDER BY schemaname, tablename, cmd, policyname;

-- Count policies per table
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(DISTINCT cmd, ', ') as operations_covered
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
GROUP BY schemaname, tablename
ORDER BY schemaname, tablename;

-- =====================================================
-- 4. USERS TABLE TESTING
-- =====================================================

-- Check if admin user exists
SELECT 
  id,
  email,
  role,
  full_name,
  is_active,
  created_at,
  CASE 
    WHEN role = 'admin' AND is_active THEN '✅ Admin Ready'
    WHEN role = 'admin' AND NOT is_active THEN '⚠️ Admin Inactive'
    ELSE '❌ Not Admin'
  END as admin_status
FROM users 
WHERE email = 'admin@digcity.id';

-- Check total users count
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
  COUNT(CASE WHEN is_active THEN 1 END) as active_users
FROM users;

-- Test users table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- =====================================================
-- 5. EVENTS TABLE TESTING
-- =====================================================

-- Check if events table exists and has data
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
    RAISE NOTICE '✅ Events table exists';
    
    -- Show events count
    PERFORM (SELECT COUNT(*) FROM events);
    RAISE NOTICE 'Events count: %', (SELECT COUNT(*) FROM events);
    
    -- Show recent events
    PERFORM (SELECT title FROM events ORDER BY created_at DESC LIMIT 3);
  ELSE
    RAISE NOTICE '❌ Events table does not exist';
  END IF;
END $$;

-- Check events table structure if exists
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'events'
ORDER BY ordinal_position;

-- =====================================================
-- 6. STORAGE POLICIES TESTING
-- =====================================================

-- Check storage buckets
SELECT 
  id,
  name,
  public,
  created_at,
  CASE 
    WHEN public THEN '🌐 Public'
    ELSE '🔒 Private'
  END as access_type
FROM storage.buckets
ORDER BY name;

-- Check storage objects count per bucket
SELECT 
  bucket_id,
  COUNT(*) as object_count,
  pg_size_pretty(SUM(COALESCE(metadata->>'size', '0')::bigint)) as total_size
FROM storage.objects
GROUP BY bucket_id
ORDER BY bucket_id;

-- Check storage policies specifically
SELECT 
  policyname,
  cmd as operation,
  qual as condition,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY cmd, policyname;

-- =====================================================
-- 7. AUTHENTICATION CONTEXT TESTING
-- =====================================================

-- Test auth functions (these will return null in SQL editor)
-- But useful to verify functions exist
SELECT 
  'auth.uid()' as function_name,
  CASE 
    WHEN auth.uid() IS NULL THEN '⚠️ No auth context (expected in SQL editor)'
    ELSE '✅ Auth context available: ' || auth.uid()::text
  END as status
UNION ALL
SELECT 
  'auth.role()' as function_name,
  CASE 
    WHEN auth.role() IS NULL THEN '⚠️ No auth context (expected in SQL editor)'
    ELSE '✅ Auth role: ' || auth.role()::text
  END as status;

-- =====================================================
-- 8. POLICY SYNTAX VALIDATION
-- =====================================================

-- Check for any policies with potential issues
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN qual IS NULL AND cmd = 'SELECT' THEN '⚠️ No WHERE condition for SELECT'
    WHEN with_check IS NULL AND cmd IN ('INSERT', 'UPDATE') THEN '⚠️ No WITH CHECK for ' || cmd
    WHEN qual LIKE '%users%' AND tablename = 'users' THEN '🚨 Potential recursion risk'
    ELSE '✅ Policy looks good'
  END as validation_status,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
ORDER BY 
  CASE 
    WHEN qual LIKE '%users%' AND tablename = 'users' THEN 1
    WHEN qual IS NULL AND cmd = 'SELECT' THEN 2
    WHEN with_check IS NULL AND cmd IN ('INSERT', 'UPDATE') THEN 3
    ELSE 4
  END,
  schemaname, tablename, policyname;

-- =====================================================
-- 9. PERFORMANCE CHECKS
-- =====================================================

-- Check for complex policies that might impact performance
SELECT 
  schemaname,
  tablename,
  policyname,
  LENGTH(COALESCE(qual, '')) + LENGTH(COALESCE(with_check, '')) as policy_complexity,
  CASE 
    WHEN LENGTH(COALESCE(qual, '')) + LENGTH(COALESCE(with_check, '')) > 200 THEN '⚠️ Complex policy'
    WHEN LENGTH(COALESCE(qual, '')) + LENGTH(COALESCE(with_check, '')) > 100 THEN '🔍 Medium complexity'
    ELSE '✅ Simple policy'
  END as complexity_status
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
ORDER BY policy_complexity DESC;

-- =====================================================
-- 10. SECURITY AUDIT
-- =====================================================

-- Check for overly permissive policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN qual = 'true' AND cmd IN ('INSERT', 'UPDATE', 'DELETE') THEN '🚨 Very permissive write access'
    WHEN qual = 'true' AND cmd = 'SELECT' THEN '✅ Public read access (OK for public data)'
    WHEN qual LIKE '%true%' THEN '⚠️ Contains "true" condition'
    ELSE '✅ Properly restricted'
  END as security_assessment,
  qual
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
ORDER BY 
  CASE 
    WHEN qual = 'true' AND cmd IN ('INSERT', 'UPDATE', 'DELETE') THEN 1
    WHEN qual LIKE '%true%' THEN 2
    ELSE 3
  END,
  schemaname, tablename;

-- =====================================================
-- 11. FINAL SUMMARY REPORT
-- =====================================================

-- Generate summary report
WITH policy_summary AS (
  SELECT 
    schemaname,
    tablename,
    COUNT(*) as total_policies,
    COUNT(CASE WHEN cmd = 'SELECT' THEN 1 END) as select_policies,
    COUNT(CASE WHEN cmd = 'INSERT' THEN 1 END) as insert_policies,
    COUNT(CASE WHEN cmd = 'UPDATE' THEN 1 END) as update_policies,
    COUNT(CASE WHEN cmd = 'DELETE' THEN 1 END) as delete_policies
  FROM pg_policies 
  WHERE schemaname IN ('public', 'storage')
  GROUP BY schemaname, tablename
),
rls_status AS (
  SELECT 
    schemaname,
    tablename,
    rowsecurity
  FROM pg_tables 
  WHERE schemaname IN ('public', 'storage')
    AND tablename IN ('users', 'events', 'news', 'gallery', 'objects')
)
SELECT 
  r.schemaname,
  r.tablename,
  CASE WHEN r.rowsecurity THEN '✅ RLS Enabled' ELSE '❌ RLS Disabled' END as rls_status,
  COALESCE(p.total_policies, 0) as total_policies,
  CASE 
    WHEN r.rowsecurity AND COALESCE(p.total_policies, 0) = 0 THEN '🚨 RLS enabled but no policies!'
    WHEN r.rowsecurity AND COALESCE(p.total_policies, 0) > 0 THEN '✅ RLS properly configured'
    WHEN NOT r.rowsecurity THEN '⚠️ RLS disabled'
    ELSE '❓ Unknown status'
  END as configuration_status,
  COALESCE(p.select_policies, 0) as select_policies,
  COALESCE(p.insert_policies, 0) as insert_policies,
  COALESCE(p.update_policies, 0) as update_policies,
  COALESCE(p.delete_policies, 0) as delete_policies
FROM rls_status r
LEFT JOIN policy_summary p ON r.schemaname = p.schemaname AND r.tablename = p.tablename
ORDER BY 
  CASE 
    WHEN r.rowsecurity AND COALESCE(p.total_policies, 0) = 0 THEN 1
    WHEN NOT r.rowsecurity THEN 2
    ELSE 3
  END,
  r.schemaname, r.tablename;

-- =====================================================
-- TESTING COMPLETED
-- =====================================================

SELECT 
  '🎉 RLS POLICIES TESTING COMPLETED! 🎉' as message,
  NOW() as completed_at;

SELECT 
  '📋 NEXT STEPS:' as action,
  '1. Review the results above' as step_1,
  '2. Fix any issues marked with 🚨 or ❌' as step_2,
  '3. Test application functionality' as step_3,
  '4. Monitor performance in production' as step_4;