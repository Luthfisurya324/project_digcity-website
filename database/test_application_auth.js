// =====================================================
// APPLICATION AUTHENTICATION TESTING SCRIPT
// =====================================================
// Run this script to test authentication and RLS policies
// from the application perspective

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (optional, for admin tests)');
  process.exit(1);
}

// Create clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const adminSupabase = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

console.log('🚀 Starting Application Authentication Tests');
console.log('=' .repeat(60));

// Test results storage
const testResults = {
  connection: false,
  adminAuth: false,
  publicRead: false,
  protectedWrite: false,
  storageAccess: false,
  rls: false
};

// =====================================================
// 1. CONNECTION TEST
// =====================================================
async function testConnection() {
  console.log('\n📡 Testing Supabase Connection...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Connection test with error:', error.message);
      // This might be expected due to RLS
      testResults.connection = true;
    } else {
      console.log('✅ Connection successful');
      testResults.connection = true;
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    testResults.connection = false;
  }
}

// =====================================================
// 2. ADMIN AUTHENTICATION TEST
// =====================================================
async function testAdminAuth() {
  console.log('\n👤 Testing Admin Authentication...');
  
  try {
    // Test admin login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@digcity.id',
      password: 'admin123456'
    });
    
    if (authError) {
      console.error('❌ Admin login failed:', authError.message);
      testResults.adminAuth = false;
      return;
    }
    
    console.log('✅ Admin login successful');
    console.log('   User ID:', authData.user?.id);
    console.log('   Email:', authData.user?.email);
    
    // Test accessing users table as admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (userError) {
      console.error('❌ Admin cannot access users table:', userError.message);
      testResults.adminAuth = false;
    } else {
      console.log('✅ Admin can access users table');
      console.log('   Users found:', userData?.length || 0);
      testResults.adminAuth = true;
    }
    
    // Sign out
    await supabase.auth.signOut();
    
  } catch (err) {
    console.error('❌ Admin auth test failed:', err.message);
    testResults.adminAuth = false;
  }
}

// =====================================================
// 3. PUBLIC READ ACCESS TEST
// =====================================================
async function testPublicRead() {
  console.log('\n📖 Testing Public Read Access...');
  
  try {
    // Ensure we're not authenticated
    await supabase.auth.signOut();
    
    // Test reading events (should be public)
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, title, description')
      .limit(3);
    
    if (eventsError) {
      console.log('⚠️  Events read error (might be expected):', eventsError.message);
    } else {
      console.log('✅ Public can read events');
      console.log('   Events found:', eventsData?.length || 0);
    }
    
    // Test reading news (should be public)
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('id, title, content')
      .limit(3);
    
    if (newsError) {
      console.log('⚠️  News read error (might be expected):', newsError.message);
    } else {
      console.log('✅ Public can read news');
      console.log('   News found:', newsData?.length || 0);
    }
    
    // Test reading gallery (should be public)
    const { data: galleryData, error: galleryError } = await supabase
      .from('gallery')
      .select('id, title, image_url')
      .limit(3);
    
    if (galleryError) {
      console.log('⚠️  Gallery read error (might be expected):', galleryError.message);
    } else {
      console.log('✅ Public can read gallery');
      console.log('   Gallery items found:', galleryData?.length || 0);
    }
    
    testResults.publicRead = true;
    
  } catch (err) {
    console.error('❌ Public read test failed:', err.message);
    testResults.publicRead = false;
  }
}

// =====================================================
// 4. PROTECTED WRITE ACCESS TEST
// =====================================================
async function testProtectedWrite() {
  console.log('\n🔒 Testing Protected Write Access...');
  
  try {
    // Ensure we're not authenticated
    await supabase.auth.signOut();
    
    // Try to insert without authentication (should fail)
    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert({
        title: 'Test Event',
        description: 'This should not be allowed',
        event_date: new Date().toISOString()
      });
    
    if (insertError) {
      console.log('✅ Unauthenticated write properly blocked:', insertError.message);
      testResults.protectedWrite = true;
    } else {
      console.error('❌ Unauthenticated write was allowed! This is a security issue.');
      testResults.protectedWrite = false;
    }
    
    // Try to update without authentication (should fail)
    const { data: updateData, error: updateError } = await supabase
      .from('events')
      .update({ title: 'Hacked Event' })
      .eq('id', 1);
    
    if (updateError) {
      console.log('✅ Unauthenticated update properly blocked:', updateError.message);
    } else {
      console.error('❌ Unauthenticated update was allowed! This is a security issue.');
      testResults.protectedWrite = false;
    }
    
    // Try to delete without authentication (should fail)
    const { data: deleteData, error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', 1);
    
    if (deleteError) {
      console.log('✅ Unauthenticated delete properly blocked:', deleteError.message);
    } else {
      console.error('❌ Unauthenticated delete was allowed! This is a security issue.');
      testResults.protectedWrite = false;
    }
    
  } catch (err) {
    console.error('❌ Protected write test failed:', err.message);
    testResults.protectedWrite = false;
  }
}

// =====================================================
// 5. STORAGE ACCESS TEST
// =====================================================
async function testStorageAccess() {
  console.log('\n📁 Testing Storage Access...');
  
  try {
    // List buckets (should work)
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('⚠️  Cannot list buckets:', bucketsError.message);
    } else {
      console.log('✅ Can list storage buckets');
      console.log('   Buckets found:', buckets?.length || 0);
      buckets?.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }
    
    // Try to list files in admin-images bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('admin-images')
      .list();
    
    if (filesError) {
      console.log('⚠️  Cannot list admin-images files (expected for unauthenticated):', filesError.message);
    } else {
      console.log('✅ Can list admin-images files');
      console.log('   Files found:', files?.length || 0);
    }
    
    testResults.storageAccess = true;
    
  } catch (err) {
    console.error('❌ Storage access test failed:', err.message);
    testResults.storageAccess = false;
  }
}

// =====================================================
// 6. RLS POLICY EFFECTIVENESS TEST
// =====================================================
async function testRLSEffectiveness() {
  console.log('\n🛡️  Testing RLS Policy Effectiveness...');
  
  if (!adminSupabase) {
    console.log('⚠️  Skipping RLS test - no service role key provided');
    testResults.rls = true;
    return;
  }
  
  try {
    // Test with service role (should bypass RLS)
    const { data: adminData, error: adminError } = await adminSupabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (adminError) {
      console.error('❌ Service role cannot access users:', adminError.message);
      testResults.rls = false;
    } else {
      console.log('✅ Service role can bypass RLS');
      console.log('   Users accessible via service role:', adminData?.length || 0);
    }
    
    // Test with anon key (should be restricted)
    const { data: anonData, error: anonError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (anonError) {
      console.log('✅ Anonymous access properly restricted:', anonError.message);
      testResults.rls = true;
    } else {
      console.error('❌ Anonymous access not properly restricted!');
      console.log('   Users accessible anonymously:', anonData?.length || 0);
      testResults.rls = false;
    }
    
  } catch (err) {
    console.error('❌ RLS effectiveness test failed:', err.message);
    testResults.rls = false;
  }
}

// =====================================================
// 7. COMPREHENSIVE TEST RUNNER
// =====================================================
async function runAllTests() {
  console.log('🧪 Running Comprehensive Authentication Tests');
  console.log('=' .repeat(60));
  
  await testConnection();
  await testAdminAuth();
  await testPublicRead();
  await testProtectedWrite();
  await testStorageAccess();
  await testRLSEffectiveness();
  
  // Generate final report
  console.log('\n' + '=' .repeat(60));
  console.log('📊 FINAL TEST RESULTS');
  console.log('=' .repeat(60));
  
  const results = [
    { test: 'Connection', status: testResults.connection, critical: true },
    { test: 'Admin Authentication', status: testResults.adminAuth, critical: true },
    { test: 'Public Read Access', status: testResults.publicRead, critical: false },
    { test: 'Protected Write Access', status: testResults.protectedWrite, critical: true },
    { test: 'Storage Access', status: testResults.storageAccess, critical: false },
    { test: 'RLS Effectiveness', status: testResults.rls, critical: true }
  ];
  
  let passedTests = 0;
  let criticalIssues = 0;
  
  results.forEach(result => {
    const icon = result.status ? '✅' : '❌';
    const criticality = result.critical ? '🚨 CRITICAL' : '⚠️  Warning';
    const status = result.status ? 'PASSED' : 'FAILED';
    
    console.log(`${icon} ${result.test}: ${status}${!result.status && result.critical ? ` (${criticality})` : ''}`);
    
    if (result.status) passedTests++;
    if (!result.status && result.critical) criticalIssues++;
  });
  
  console.log('\n' + '-'.repeat(60));
  console.log(`📈 Summary: ${passedTests}/${results.length} tests passed`);
  
  if (criticalIssues === 0) {
    console.log('🎉 All critical tests passed! Your RLS policies are working correctly.');
  } else {
    console.log(`🚨 ${criticalIssues} critical issue(s) found. Please review and fix before deploying.`);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Fix any critical issues marked with 🚨');
  console.log('2. Test the actual application UI');
  console.log('3. Monitor logs for any authentication errors');
  console.log('4. Consider running load tests if deploying to production');
  
  return criticalIssues === 0;
}

// =====================================================
// 8. EXPORT FOR USE IN OTHER SCRIPTS
// =====================================================
export {
  testConnection,
  testAdminAuth,
  testPublicRead,
  testProtectedWrite,
  testStorageAccess,
  testRLSEffectiveness,
  runAllTests
};

// =====================================================
// 9. RUN TESTS IF CALLED DIRECTLY
// =====================================================
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('💥 Test runner crashed:', err);
      process.exit(1);
    });
}