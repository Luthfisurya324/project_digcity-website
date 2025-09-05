// Utility untuk testing konfigurasi Supabase
import { supabase } from '../lib/supabase'

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Error testing users table:', error)
      
      // Test 2: Check if table exists
      if (error.code === 'PGRST116') {
        console.warn('⚠️ Users table tidak ditemukan atau tidak accessible')
        return {
          success: false,
          error: 'Users table tidak ada atau tidak accessible',
          code: error.code,
          details: error.message
        }
      }
      
      return {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }
    }
    
    console.log('✅ Users table accessible, count:', data)
    return {
      success: true,
      message: 'Users table accessible',
      count: data
    }
    
  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      code: 'UNKNOWN_ERROR',
      details: error.stack
    }
  }
}

export const testAuthConnection = async () => {
  console.log('🔍 Testing Supabase auth...')
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Error testing auth:', error)
      return {
        success: false,
        error: error.message,
        code: error.status || 'AUTH_ERROR'
      }
    }
    
    console.log('✅ Auth connection successful, session:', !!session)
    return {
      success: true,
      message: 'Auth connection successful',
      hasSession: !!session
    }
    
  } catch (error: any) {
    console.error('❌ Unexpected auth error:', error)
    return {
      success: false,
      error: error.message,
      code: 'AUTH_UNKNOWN_ERROR'
    }
  }
}

export const runSupabaseTests = async () => {
  console.log('🚀 Running Supabase tests...')
  
  const authTest = await testAuthConnection()
  const dbTest = await testSupabaseConnection()
  
  const results = {
    auth: authTest,
    database: dbTest,
    timestamp: new Date().toISOString()
  }
  
  console.log('📊 Test results:', results)
  return results
}
