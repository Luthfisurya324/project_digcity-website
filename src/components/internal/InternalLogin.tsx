import React, { useState, useCallback } from 'react'
import { supabase, membersAPI, auditAPI } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Building2, Mail, ArrowRight } from 'lucide-react'

const InternalLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsEmail, setNeedsEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [memberId, setMemberId] = useState('')
  const navigate = useNavigate()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let loginEmail = identifier.trim()

      // If we are in "needs email" mode, we update the email first
      if (needsEmail && memberId) {
        if (!newEmail.includes('@')) throw new Error('Email tidak valid')

        // Update email securely
        const updated = await membersAPI.updateEmailIfEmpty(memberId, newEmail)
        if (!updated) throw new Error('Gagal memperbarui email. Mungkin sudah terisi.')

        loginEmail = newEmail
        // Continue to login with this new email
      } else if (!loginEmail.includes('@')) {
        // Try to find by NPM
        const mem = await membersAPI.getMemberByNpm(loginEmail)

        if (!mem) throw new Error('NPM tidak ditemukan.')

        if (!mem.email) {
          // Member found but has no email -> Prompt for email
          setMemberId(mem.id)
          setNeedsEmail(true)
          setLoading(false)
          return
        }

        loginEmail = mem.email
      }

      let { data, error: signInError } = await supabase.auth.signInWithPassword({ email: loginEmail, password })
      if (signInError) {
        const mem = await membersAPI.getMemberByEmail(loginEmail)
        if (!mem) throw signInError
        const defaultPassword = 'digcity123'
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
      } catch { }

      if (signInError) throw signInError

      if (data.user) {
        // Log activity
        await auditAPI.log({
          module: 'system',
          action: 'login',
          details: { method: 'password', email: loginEmail }
        })

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
  }, [identifier, password, navigate, needsEmail, newEmail, memberId]);

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

            {!needsEmail ? (
              <>
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
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 flex items-start gap-3">
                  <Mail className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold mb-1">Email Belum Terdaftar</p>
                    <p>Akun Anda belum memiliki email. Silakan masukkan email aktif untuk melanjutkan login.</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="newEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Aktif
                  </label>
                  <input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Memproses...
                </>
              ) : (
                needsEmail ? (
                  <>Simpan & Lanjut <ArrowRight size={16} /></>
                ) : (
                  'Masuk Portal'
                )
              )}
            </button>

            {needsEmail && (
              <button
                type="button"
                onClick={() => {
                  setNeedsEmail(false)
                  setNewEmail('')
                  setMemberId('')
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Kembali
              </button>
            )}
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
