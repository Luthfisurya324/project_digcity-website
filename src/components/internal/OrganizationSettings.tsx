import React, { useEffect, useMemo, useState } from 'react'
import { orgAPI, type OrganizationProfile, type OrganizationDivision, membersAPI } from '../../lib/supabase'
import { Upload, Plus, Trash2, Save, Settings, ArrowUpDown, Users, Calendar, Link as LinkIcon, Shield, RefreshCcw, Download } from 'lucide-react'

const OrganizationSettings: React.FC = () => {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [divisions, setDivisions] = useState<OrganizationDivision[]>([])
  const [newDivisionName, setNewDivisionName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [driveUrl, setDriveUrl] = useState('')
  const [paymentProvider, setPaymentProvider] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [orgName, setOrgName] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const p = await orgAPI.getProfile()
        setProfile(p)
        setOrgName(p.name)
        setDriveUrl(p.external_drive_url || '')
        setPaymentProvider(p.payment_provider || '')
        setPeriodStart(p.period_start || '')
        setPeriodEnd(p.period_end || '')
        const list = await orgAPI.getStructure(null)
        setDivisions(list)
      } catch (e) {
        console.error('Failed to load org settings', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setLogoUploading(true)
    try {
      await orgAPI.uploadLogo(e.target.files[0])
      const refreshed = await orgAPI.getProfile()
      setProfile(refreshed)
    } catch (e) {
      alert('Gagal upload logo')
    } finally {
      setLogoUploading(false)
    }
  }

  const addDivision = async () => {
    if (!newDivisionName.trim()) return
    try {
      const created = await orgAPI.createDivision({ name: newDivisionName, parent_id: null, description: '' })
      setDivisions((prev) => [...prev, created].sort((a,b)=> a.order_index - b.order_index))
      setNewDivisionName('')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal menambah divisi. Pastikan Anda memiliki akses.'
      alert(msg)
    }
  }

  const removeDivision = async (id: string) => {
    try {
      await orgAPI.deleteDivision(id)
      setDivisions((prev) => prev.filter((d) => d.id !== id))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal menghapus divisi. Pastikan Anda memiliki akses.'
      alert(msg)
    }
  }

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id)
  }

  const onDrop = async (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    const draggedId = e.dataTransfer.getData('text/plain')
    if (!draggedId || draggedId === targetId) return
    const ordered = divisions.map((d) => d.id)
    const fromIndex = ordered.indexOf(draggedId)
    const toIndex = ordered.indexOf(targetId)
    if (fromIndex < 0 || toIndex < 0) return
    ordered.splice(toIndex, 0, ordered.splice(fromIndex, 1)[0])
    await orgAPI.reorder(null, ordered)
    const newDivs = [...divisions]
    newDivs.sort((a,b)=> ordered.indexOf(a.id) - ordered.indexOf(b.id))
    setDivisions(newDivs)
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      await orgAPI.updateProfile({ name: orgName, external_drive_url: driveUrl, payment_provider: paymentProvider, period_start: periodStart || null as any, period_end: periodEnd || null as any })
      const refreshed = await orgAPI.getProfile()
      setProfile(refreshed)
    } catch (e) {
      alert('Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  const transferOwnership = async () => {
    try {
      const members = await membersAPI.getAll()
      const m = members.find((x)=> x.email === ownerEmail)
      if (!m) { alert('Email tidak ditemukan di anggota'); return }
      await orgAPI.updateProfile({ owner_user_id: m.id })
      const refreshed = await orgAPI.getProfile()
      setProfile(refreshed)
      alert('Kepemilikan organisasi diperbarui')
    } catch (e) {
      alert('Gagal memperbarui kepemilikan')
    }
  }

  const exportAll = async () => {
    const members = await membersAPI.getAll()
    const rows = members.map((m)=> [m.full_name, m.npm, m.email, m.division, m.position, m.join_year])
    const csv = ['Nama,NPM,Email,Divisi,Jabatan,Angkatan', ...rows.map((r)=> r.join(','))].join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'backup-members.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const softDelete = async () => {
    if (!confirm('Yakin ingin menghapus organisasi? Ini adalah soft delete dan dapat dipulihkan oleh admin.')) return
    await orgAPI.softDeleteOrganization()
    const refreshed = await orgAPI.getProfile()
    setProfile(refreshed)
    alert('Organisasi dihapus (soft delete)')
  }

  if (loading) {
    return (<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Organisasi</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola profil, struktur, dan periode kepengurusan</p>
        </div>
        <button onClick={saveProfile} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          {saving ? (<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : (<Save size={18} />)}
          Simpan Perubahan
        </button>
      </div>

      {/* Profil */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings size={18} /> Profil Organisasi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input value={orgName} onChange={(e)=>setOrgName(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-[#1A1A1A]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border">
                {profile?.logo_url ? <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" /> : <div className="w-full h-full"></div>}
              </div>
              <label className="px-3 py-2 bg-slate-100 rounded-lg cursor-pointer inline-flex items-center gap-2"><Upload size={16} /> Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadLogo} disabled={logoUploading} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Periode Mulai</label>
              <input type="date" value={periodStart} onChange={(e)=>setPeriodStart(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-[#1A1A1A]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Periode Selesai</label>
              <input type="date" value={periodEnd} onChange={(e)=>setPeriodEnd(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-[#1A1A1A]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Integrasi Drive (Folder URL)</label>
              <input value={driveUrl} onChange={(e)=>setDriveUrl(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-[#1A1A1A]" placeholder="https://drive.google.com/..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Penyedia Pembayaran</label>
              <input value={paymentProvider} onChange={(e)=>setPaymentProvider(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-[#1A1A1A]" placeholder="Midtrans/Xendit" />
            </div>
          </div>
        </div>

        {/* Transfer Ownership */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={18} /> Transfer Ownership</h3>
          <p className="text-sm text-slate-500 mb-2">Tetapkan email anggota sebagai pemilik organisasi.</p>
          <input value={ownerEmail} onChange={(e)=>setOwnerEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-[#1A1A1A] mb-3" placeholder="email anggota" />
          <button onClick={transferOwnership} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Tetapkan Pemilik</button>
          {profile?.owner_user_id && (<p className="text-xs text-slate-500 mt-2">Owner ID: {profile.owner_user_id}</p>)}
        </div>
      </div>

      {/* Struktur Divisi */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold flex items-center gap-2"><Users size={18} /> Struktur Divisi</h3>
          <div className="flex gap-2">
            <input value={newDivisionName} onChange={(e)=>setNewDivisionName(e.target.value)} placeholder="Nama divisi" className="px-3 py-2 border rounded-lg dark:bg-[#1A1A1A]" />
            <button onClick={addDivision} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><Plus size={16} /> Tambah</button>
          </div>
        </div>
        <div className="space-y-2">
          {divisions.map((d) => (
            <div key={d.id} draggable onDragStart={(e)=>onDragStart(e,d.id)} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDrop(e,d.id)} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-slate-400" />
                <span className="text-sm font-medium">{d.name}</span>
              </div>
              <button onClick={()=>removeDivision(d.id)} className="text-rose-600 hover:bg-rose-50 rounded-lg p-2"><Trash2 size={16} /></button>
            </div>
          ))}
          {divisions.length === 0 && (
            <p className="text-sm text-slate-500">Belum ada divisi. Tambahkan di atas.</p>
          )}
        </div>
      </div>

      {/* Backup & Soft Delete */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Download size={18} /> Backup Data</h3>
          <p className="text-sm text-slate-500 mb-3">Ekspor data anggota sebagai CSV untuk backup.</p>
          <button onClick={exportAll} className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200">Export Anggota CSV</button>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><RefreshCcw size={18} /> Restore Data</h3>
          <p className="text-sm text-slate-500">Gunakan fitur import di halaman Anggota/Keuangan/Dokumen.</p>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Trash2 size={18} /> Hapus Organisasi</h3>
          <p className="text-sm text-slate-500 mb-3">Soft delete, data tidak langsung dihapus permanen.</p>
          <button onClick={softDelete} className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Soft Delete</button>
          {profile?.deleted_at && (<p className="text-xs text-rose-600 mt-2">Deleted at: {profile.deleted_at}</p>)}
        </div>
      </div>
    </div>
  )
}

export default OrganizationSettings
