import React, { useState, useEffect } from 'react'
import { supabase, membersAPI } from '../../lib/supabase'
import { Search, KeyRound, AlertTriangle, CheckCircle } from 'lucide-react'

interface UserData {
    id: string
    email: string
    raw_user_meta_data: {
        full_name?: string
        internal_role?: string
        is_default_password?: boolean
    }
    last_sign_in_at?: string
}

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            // Fetch members
            const members = await membersAPI.getAll()

            // Map members to a structure.
            const mapped = members.map(m => ({
                id: m.id,
                email: m.email,
                raw_user_meta_data: {
                    full_name: m.full_name,
                    internal_role: m.position // Placeholder
                }
            }))

            setUsers(mapped as any)
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (email: string) => {
        if (!confirm(`Reset password untuk ${email} menjadi 'digcity123'?`)) return

        setActionLoading(true)
        setMessage(null)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/internal/settings',
            })

            if (error) throw error
            setMessage({ type: 'success', text: `Email reset password telah dikirim ke ${email}` })

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Gagal mereset password'
            setMessage({ type: 'error', text: msg })
        } finally {
            setActionLoading(false)
        }
    }

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.raw_user_meta_data.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Pengguna</h2>
                    <p className="text-slate-500 dark:text-slate-400">Kelola akun dan akses anggota</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari pengguna..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#1A1A1A] focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-[#232323] text-slate-500 dark:text-slate-400 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Nama Lengkap</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Tidak ada pengguna ditemukan</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {user.raw_user_meta_data.full_name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                {user.raw_user_meta_data.internal_role || 'Anggota'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleResetPassword(user.email)}
                                                disabled={actionLoading}
                                                className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1 disabled:opacity-50"
                                                title="Kirim Email Reset Password"
                                            >
                                                <KeyRound size={16} /> Reset
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminUserManagement
