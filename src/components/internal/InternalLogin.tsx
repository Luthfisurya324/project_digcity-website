import React, { useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { membersAPI } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { getInternalBasePath } from '../../utils/domainDetection'

const InternalLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let loginEmail = identifier.trim()
      if (!loginEmail.includes('@')) {
        const list = await membersAPI.getAll()
        const m = list.find((x) => x.npm === loginEmail)
        if (!m) throw new Error('NPM tidak ditemukan. Gunakan email atau NPM yang terdaftar.')
        loginEmail = m.email
      }

      let { data, error: signInError } = await supabase.auth.signInWithPassword({ email: loginEmail, password })
      if (signInError) {
        const memberList = await membersAPI.getAll()
        const mem = memberList.find((x) => x.email === loginEmail)
        if (!mem) throw signInError
        const defaultPassword = 'DIGCITY@DEFAULT'
        const signUpRes = await supabase.auth.signUp({ email: loginEmail, password: defaultPassword })
        if (signUpRes.error) throw signUpRes.error
        await supabase.auth.updateUser({ data: { internal_role: (mem.division.toLowerCase().includes('bph') ? 'bph' : 'anggota') } })
        const signIn2 = await supabase.auth.signInWithPassword({ email: loginEmail, password: defaultPassword })
        if (signIn2.error) throw signIn2.error
        data = signIn2.data
      }
      try {
        const ua = navigator.userAgent
        const { data: me } = await supabase.auth.getUser()
        if (me.user) {
          await supabase.from('auth_device_logs').insert([{ user_id: me.user.id, user_agent: ua }])
        }
      } catch {}
      
      if (signInError) throw signInError
      
      if (data.user) {
        // For internal portal, we might want to check specific roles later
        // For now, basic authentication is sufficient
        
        // Force a hard reload to ensure all auth states are updated properly
        window.location.href = '/internal';
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [identifier, password, navigate]);

  const handleIdentifierChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value)
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0e0e0e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">DIGCITY Internal</h2>
          <p className="text-slate-600 dark:text-slate-400">Portal manajemen organisasi</p>
        </div>

        <div className="bg-white dark:bg-[#101010] border border-slate-200 dark:border-[#1F1F1F] rounded-2xl shadow-xl p-8 transition-colors">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email atau NPM
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={handleIdentifierChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white placeholder-slate-400"
                placeholder="nama@organisasi.com atau 2311..."
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Masuk...
                </div>
              ) : (
                'Masuk Portal'
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; 2024 DIGCITY Organization System
          </p>
        </div>
      </div>
    </div>
  )
}

export default InternalLogin
