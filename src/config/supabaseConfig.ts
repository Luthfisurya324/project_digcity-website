// Konfigurasi Supabase untuk DIGCITY Website
// Update URL dan key sesuai dengan project yang aktif

export const supabaseConfig = {
  // URL Supabase - update berdasarkan error yang muncul
  url: import.meta.env.VITE_SUPABASE_URL || 'https://mqjdyiyoigjnfadqatrx.supabase.co',
  
  // Anon Key - harus diisi di environment variables
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Debug mode
  debug: import.meta.env.NODE_ENV === 'development'
}

// Validasi konfigurasi
export const validateSupabaseConfig = () => {
  if (!supabaseConfig.url) {
    console.error('❌ VITE_SUPABASE_URL tidak ditemukan')
    return false
  }
  
  if (!supabaseConfig.anonKey) {
    console.error('❌ VITE_SUPABASE_ANON_KEY tidak ditemukan')
    return false
  }
  
  if (supabaseConfig.debug) {
    console.log('✅ Supabase Config:', {
      url: supabaseConfig.url,
      hasKey: !!supabaseConfig.anonKey,
      debug: supabaseConfig.debug
    })
  }
  
  return true
}

// Export default config
export default supabaseConfig
