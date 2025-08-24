// Konfigurasi Supabase untuk DIGCITY Website
// Update URL dan key sesuai dengan project yang aktif

export const supabaseConfig = {
  // URL Supabase - update berdasarkan error yang muncul
  url: import.meta.env.VITE_SUPABASE_URL || 'https://mqjdyiyoigjnfadqatrx.supabase.co',
  
  // Anon Key - hardcoded untuk development sementara
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamR5aXlvaWdqbmZhZHFhdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjY4NTcsImV4cCI6MjA3MTAwMjg1N30.onUd1j0u_MyPmDz4WF5egO2ksPT5o9_2TTSry3QUuYo',
  
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
