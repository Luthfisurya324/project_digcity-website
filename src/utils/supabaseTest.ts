// Utility untuk testing konfigurasi Supabase
import { supabase } from '../lib/supabase'

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Coba akses tabel news untuk cek koneksi dan RLS
    const { error, count } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Error testing news table:', error)
      return {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }
    }
    
    console.log('✅ News table accessible, count available')
    return {
      success: true,
      message: 'News table accessible',
      count: count ?? null
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
