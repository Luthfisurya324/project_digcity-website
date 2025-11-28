# Database RLS Policies Fix & Testing Guide

## 📋 Overview

This directory contains comprehensive scripts to fix and test Row Level Security (RLS) policies for the DigCity website Supabase database. The scripts address issues with infinite recursion, 403 errors, and improper access controls.

## 🚨 Critical Issues Addressed

1. **Infinite Recursion in Users Table**: Policy referencing itself causing login failures
2. **403 Forbidden Errors**: Overly restrictive policies blocking legitimate access
3. **Storage Access Issues**: Improper bucket policies preventing file uploads
4. **Missing Admin Access**: No proper admin authentication system
5. **Inconsistent RLS Configuration**: Some tables missing proper policies

## 📁 Files in this Directory

### 🔧 Fix Scripts
- **`fix_all_rls_policies.sql`** - Comprehensive RLS policy fix script
- **`test_rls_policies.sql`** - Database-level testing and validation
- **`test_application_auth.js`** - Application-level authentication testing

### 📚 Documentation
- **`README.md`** - This guide
- **`../docs/049_comprehensive_rls_policy_fix.md`** - Detailed technical documentation

## 🚀 Quick Start Guide

### Step 1: Backup Your Database
```bash
# Always backup before making changes!
# Use Supabase Dashboard > Settings > Database > Backups
# Or use pg_dump if you have direct access
```

### Step 2: Run the Fix Script

1. **Open Supabase Dashboard**
   - Go to your project dashboard
   - Navigate to SQL Editor

2. **Execute the Fix Script**
   ```sql
   -- Copy and paste the entire content of fix_all_rls_policies.sql
   -- Run it in the SQL Editor
   ```

3. **Verify Execution**
   - Check for any error messages
   - Ensure all commands completed successfully

### Step 3: Run Database Tests

1. **Execute Test Script**
   ```sql
   -- Copy and paste the entire content of test_rls_policies.sql
   -- Run it in the SQL Editor
   ```

2. **Review Results**
   - Look for ✅ (success) and ❌ (failure) indicators
   - Pay attention to 🚨 (critical issues)

### Step 4: Run Application Tests

1. **Install Dependencies** (if not already installed)
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

2. **Set Environment Variables**
   ```bash
   # Ensure these are set in your .env.local file:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run Application Tests**
   ```bash
   node database/test_application_auth.js
   ```

## 🔍 What Each Script Does

### fix_all_rls_policies.sql

**Purpose**: Comprehensive fix for all RLS policy issues

**Actions**:
- ✅ Disables problematic RLS on users table
- ✅ Drops all existing conflicting policies
- ✅ Creates new, safe RLS policies for all tables
- ✅ Sets up proper storage bucket policies
- ✅ Creates admin user with secure credentials
- ✅ Enables RLS where appropriate

**Tables Affected**:
- `users` - Admin access policies
- `events` - Public read, admin write policies
- `news` - Public read, admin write policies
- `gallery` - Public read, admin write policies
- `storage.objects` - Bucket-specific access policies

### test_rls_policies.sql

**Purpose**: Comprehensive database-level validation

**Tests**:
- 🔍 RLS status verification
- 📊 Policy inventory and analysis
- 🔐 Security audit
- ⚡ Performance checks
- 📋 Configuration validation

### test_application_auth.js

**Purpose**: Application-level authentication testing

**Tests**:
- 📡 Supabase connection
- 👤 Admin authentication
- 📖 Public read access
- 🔒 Protected write access
- 📁 Storage access
- 🛡️ RLS effectiveness

## 🎯 Expected Results

### After Running fix_all_rls_policies.sql

✅ **Should Work**:
- Admin login with `admin@digcity.id` / `admin123456`
- Public reading of events, news, gallery
- Admin CRUD operations on all tables
- File uploads to admin-images and events-images buckets

❌ **Should NOT Work**:
- Unauthenticated write operations
- Non-admin access to users table
- Unauthorized file uploads

### Test Results Interpretation

**Database Tests (test_rls_policies.sql)**:
- ✅ = Working correctly
- ⚠️ = Warning, review needed
- ❌ = Error, must fix
- 🚨 = Critical security issue

**Application Tests (test_application_auth.js)**:
- All critical tests should pass
- Some warnings are acceptable for public access
- Zero critical issues for production deployment

## 🔧 Troubleshooting

### Common Issues

**1. "Policy already exists" errors**
```sql
-- Solution: The script handles this with DROP POLICY IF EXISTS
-- If you still get errors, manually drop policies first
DROP POLICY IF EXISTS policy_name ON table_name;
```

**2. "Permission denied" errors**
```sql
-- Solution: Ensure you're running as database owner or superuser
-- In Supabase, use the SQL Editor with your project credentials
```

**3. Admin login fails**
```sql
-- Check if admin user exists
SELECT * FROM users WHERE email = 'admin@digcity.id';

-- If not found, run the admin creation part of fix script again
```

**4. RLS still blocking access**
```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Temporarily disable for debugging
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### Environment Variable Issues

**Missing Variables**:
```bash
# Check your .env.local file contains:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Wrong URL Format**:
```bash
# Correct format:
NEXT_PUBLIC_SUPABASE_URL=https://mqjdyiyoigjnfadqatrx.supabase.co

# Wrong format:
NEXT_PUBLIC_SUPABASE_URL=mqjdyiyoigjnfadqatrx.supabase.co  # Missing https://
```

## 🔐 Security Considerations

### Admin Credentials
- **Default**: `admin@digcity.id` / `admin123456`
- **⚠️ IMPORTANT**: Change password immediately after testing
- **Production**: Use strong, unique passwords

### Policy Design
- **Principle of Least Privilege**: Users get minimum required access
- **Defense in Depth**: Multiple layers of security
- **Audit Trail**: All changes are logged

### Storage Security
- **Bucket Isolation**: Each bucket has specific policies
- **File Type Validation**: Implement in application layer
- **Size Limits**: Configure in Supabase dashboard

## 📊 Monitoring & Maintenance

### Regular Checks

**Weekly**:
```sql
-- Check for failed authentication attempts
SELECT * FROM auth.audit_log_entries 
WHERE created_at > NOW() - INTERVAL '7 days'
AND payload->>'error' IS NOT NULL;
```

**Monthly**:
```sql
-- Review policy effectiveness
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

### Performance Monitoring

```sql
-- Check slow queries related to RLS
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
WHERE query LIKE '%policy%' OR query LIKE '%rls%'
ORDER BY mean_exec_time DESC;
```

## 📚 Additional Resources

### Supabase Documentation
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)

### PostgreSQL Documentation
- [Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Policy Commands](https://www.postgresql.org/docs/current/sql-createpolicy.html)

## 🆘 Support

If you encounter issues:

1. **Check the logs** in Supabase Dashboard > Logs
2. **Review test results** for specific error messages
3. **Consult documentation** in `../docs/` directory
4. **Test incrementally** - run one fix at a time if needed

## 📝 Change Log

- **2024-01-XX**: Initial RLS policy fix implementation
- **2024-01-XX**: Added comprehensive testing scripts
- **2024-01-XX**: Enhanced security and documentation

---

**⚠️ Remember**: Always test in a development environment before applying to production!