import React, { useEffect, useState } from 'react'
import { supabase, membersAPI } from '../../lib/supabase'
import { Check, KeyRound, Upload, LogOut, Smartphone } from 'lucide-react'

const AccountSettings: React.FC = () => {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [division, setDivision] = useState('')
  const [position, setPosition] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [devices, setDevices] = useState<{ id: string; user_agent?: string; created_at: string }[]>([])
  const [changing, setChanging] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const emailX = user?.email || ''
        setEmail(emailX)
        const list = await membersAPI.getAll()
        const m = list.find((x) => x.email === emailX)
        if (m) {
          setFullName(m.full_name)
          setDivision(m.division)
          setPosition(m.position)
          setBio(m.bio || '')
          setAvatarUrl(m.image_url || '')
        }
        const { data: deviceLogs } = await supabase
          .from('auth_device_logs')
          .select('*')
          .order('created_at', { ascending: false })
        setDevices(deviceLogs || [])
      } catch {}
    }
    load()
  }, [])

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    try {
      const file = e.target.files[0]
      const publicUrl = await membersAPI.uploadPhoto(file)
      setAvatarUrl(publicUrl)
      const { data: { user } } = await supabase.auth.getUser()
      const emailX = user?.email || ''
      const list = await membersAPI.getAll()
      const m = list.find((x) => x.email === emailX)
      if (m) {
        await membersAPI.update(m.id, { image_url: publicUrl, bio })
      }
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
    } catch (e) {
      alert('Gagal mengunggah foto')
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const emailX = user?.email || ''
      const list = await membersAPI.getAll()
      const m = list.find((x) => x.email === emailX)
      if (m) {
        await membersAPI.update(m.id, { full_name: fullName, bio, image_url: avatarUrl })
      }
      await supabase.auth.updateUser({ data: { full_name: fullName } })
      setMessage('Profil berhasil diperbarui')
    } catch (e) {
      setMessage('Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setChanging(true)
    setMessage('')
    try {
      if (newPassword !== confirmPassword) {
        setMessage('Konfirmasi password tidak sesuai')
        return
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setMessage('Password berhasil diubah')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal mengubah password'
      setMessage(msg)
    } finally {
      setChanging(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Profil Akun</h3>
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 md:col-span-2">
            <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border">
              {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full"></div>}
            </div>
            <label className="px-3 py-2 bg-slate-100 rounded-lg cursor-pointer inline-flex items-center gap-2"><Upload size={16} /> Upload Foto
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} />
            </label>
          </div>
          <div>
            <p className="text-slate-500">Nama Lengkap</p>
            <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-[#1A1A1A]" />
          </div>
          <div>
            <p className="text-slate-500">Email</p>
            <p className="font-medium">{email}</p>
          </div>
          <div>
            <p className="text-slate-500">Divisi</p>
            <p className="font-medium">{division || '-'}</p>
          </div>
          <div>
            <p className="text-slate-500">Jabatan</p>
            <p className="font-medium">{position || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-slate-500">Bio</p>
            <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-[#1A1A1A]"></textarea>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              Simpan Profil
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><KeyRound size={18} /> Ganti Password</h3>
        <form className="space-y-4" onSubmit={handleChangePassword}>
          {message && (
            <div className="text-sm px-3 py-2 rounded bg-slate-100 dark:bg-[#232323]">{message}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password Saat Ini</label>
              <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg dark:bg-[#1A1A1A] dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password Baru</label>
              <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg dark:bg-[#1A1A1A] dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password</label>
              <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg dark:bg-[#1A1A1A] dark:text-white" />
            </div>
          </div>
          <button type="submit" disabled={changing} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {changing ? (<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : (<Check size={16} />)}
            Simpan Password
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Smartphone size={18} /> Riwayat Login Perangkat</h3>
        <div className="space-y-2">
          {devices.map((d)=> (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#2A2A2A]">
              <span className="text-sm">{d.user_agent || 'Perangkat tidak dikenal'}</span>
              <span className="text-xs text-slate-500">{new Date(d.created_at).toLocaleString('id-ID',{ dateStyle:'short', timeStyle:'short' })}</span>
            </div>
          ))}
          {devices.length === 0 && (
            <p className="text-sm text-slate-500">Belum ada riwayat login tersimpan.</p>
          )}
        </div>
        <div className="mt-3">
          <button onClick={()=> supabase.auth.signOut()} className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 inline-flex items-center gap-2"><LogOut size={16} /> Keluar dari perangkat ini</button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
  
