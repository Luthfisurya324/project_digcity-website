import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Upload, Check, Trash2, User } from 'lucide-react'
import { membersAPI, type OrganizationMember, auditAPI, memberSanctionsAPI, type MemberSanction, orgAPI, type OrganizationDivision, positionsAPI, type OrganizationPosition } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'

interface MemberEditFormProps {
  member: OrganizationMember
  onClose: () => void
  onUpdated: () => void
}

const MemberEditForm: React.FC<MemberEditFormProps> = ({ member, onClose, onUpdated }) => {
  const { notify } = useNotifications()
  const [fullName, setFullName] = useState(member.full_name)
  const [npm, setNpm] = useState(member.npm)
  const [email, setEmail] = useState(member.email)
  const [phone, setPhone] = useState(member.phone || '')
  const [division, setDivision] = useState(member.division)
  const [position, setPosition] = useState(member.position)
  const [joinYear, setJoinYear] = useState(member.join_year.toString())
  const [status, setStatus] = useState<OrganizationMember['status']>(member.status)
  const [imageUrl, setImageUrl] = useState(member.image_url || '')
  const [linkedinUrl, setLinkedinUrl] = useState(member.linkedin_url || '')
  const [instagramHandle, setInstagramHandle] = useState(member.instagram_handle || '')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gender, setGender] = useState<OrganizationMember['gender']>(member.gender)
  const [classCategory, setClassCategory] = useState(member.class_category || '')
  const [className, setClassName] = useState(member.class_name || '')
  const [city, setCity] = useState(member.city || '')
  const [province, setProvince] = useState(member.province || '')
  const [sanctions, setSanctions] = useState<MemberSanction[]>([])
  const [sanctionStatus, setSanctionStatus] = useState<MemberSanction['sanction_status']>('baik')
  const [sanctionDate, setSanctionDate] = useState('')
  const [sanctionReason, setSanctionReason] = useState('')
  const [fixDate, setFixDate] = useState('')
  const [fixAction, setFixAction] = useState('')
  const [followupStatus, setFollowupStatus] = useState('')

  const divisions = [
    member.division
  ]
  const [divisionOptions, setDivisionOptions] = useState<string[]>([...divisions])
  const [positionOptions, setPositionOptions] = useState<string[]>([member.position])

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const list = await orgAPI.getStructure(null)
        const names = list.map((d: OrganizationDivision) => d.name)
        setDivisionOptions(Array.from(new Set([member.division, ...names].filter(Boolean))))
      } catch { }

      try {
        const posList = await positionsAPI.getAll()
        const posNames = posList.map((p: OrganizationPosition) => p.name)
        setPositionOptions(Array.from(new Set([member.position, ...posNames].filter(Boolean))))
      } catch { }
    }
    loadData()
  }, [member.division, member.position])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    try {
      const file = e.target.files[0]
      const publicUrl = await membersAPI.uploadPhoto(file)
      setImageUrl(publicUrl)
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Gagal mengunggah foto. Silakan coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await membersAPI.update(member.id, {
        full_name: fullName,
        npm,
        email: email || null,
        phone,
        division,
        position,
        join_year: parseInt(joinYear),
        status,
        image_url: imageUrl,
        linkedin_url: linkedinUrl,
        instagram_handle: instagramHandle,
        gender,
        class_category: classCategory || undefined,
        class_name: className || undefined,
        city: city || undefined,
        province: province || undefined
      })
      notify({ type: 'success', title: 'Profil diperbarui', message: fullName })
      await auditAPI.log({
        module: 'members',
        action: 'update_member',
        entity_type: 'organization_member',
        entity_id: updated.id,
        details: { division, position, status }
      })
      onUpdated()
    } catch (error) {
      console.error('Error updating member:', error)
      alert('Gagal memperbarui data anggota.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Hapus anggota ini? Tindakan tidak dapat dibatalkan.')) return
    setLoading(true)
    try {
      await membersAPI.delete(member.id)
      notify({ type: 'warning', title: 'Anggota dihapus', message: fullName })
      await auditAPI.log({
        module: 'members',
        action: 'delete_member',
        entity_type: 'organization_member',
        entity_id: member.id,
        details: { full_name: fullName, npm }
      })
      onUpdated()
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Gagal menghapus data anggota.')
    } finally {
      setLoading(false)
    }
  }

  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const container = document.getElementById('root') || document.body
  if (!container) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl transform transition-all flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profil Anggota</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full bg-slate-100 dark:bg-[#2A2A2A] mb-4 overflow-hidden border-2 border-slate-200 dark:border-[#333]">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="text-white" size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 text-center">Upload foto formal<br />(Max 2MB, JPG/PNG)</p>
              </div>

              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NPM</label>
                    <input
                      type="text"
                      required
                      value={npm}
                      onChange={(e) => setNpm(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Angkatan</label>
                    <input
                      type="number"
                      required
                      value={joinYear}
                      onChange={(e) => setJoinYear(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={email || ''}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#2A2A2A] pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Posisi & Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Divisi</label>
                  <select
                    required
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  >
                    {divisionOptions.map((div) => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jabatan</label>
                  <select
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  >
                    {positionOptions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrganizationMember['status'])}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="demisioner">Demisioner</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#2A2A2A] pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Profil Tambahan</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender || ''}
                    onChange={(e) => setGender(e.target.value as OrganizationMember['gender'])}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  >
                    <option value="">Pilih</option>
                    <option value="male">Laki-Laki</option>
                    <option value="female">Perempuan</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori Kelas</label>
                  <input
                    type="text"
                    value={classCategory}
                    onChange={(e) => setClassCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kota/Kabupaten</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#2A2A2A] pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Riwayat Sanksi</h4>
              <SanctionsSection
                memberId={member.id}
                sanctions={sanctions}
                setSanctions={setSanctions}
                sanctionStatus={sanctionStatus}
                setSanctionStatus={setSanctionStatus}
                sanctionDate={sanctionDate}
                setSanctionDate={setSanctionDate}
                sanctionReason={sanctionReason}
                setSanctionReason={setSanctionReason}
                fixDate={fixDate}
                setFixDate={setFixDate}
                fixAction={fixAction}
                setFixAction={setFixAction}
                followupStatus={followupStatus}
                setFollowupStatus={setFollowupStatus}
              />
            </div>

            <div className="border-t border-slate-100 dark:border-[#2A2A2A] pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Media Sosial</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instagram Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-slate-400">@</span>
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-[#2A2A2A]">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg inline-flex items-center gap-2"
              >
                <Trash2 size={18} /> Hapus Anggota
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Check size={18} />
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>,
    container
  )
}

export default MemberEditForm

const SanctionsSection: React.FC<{
  memberId: string;
  sanctions: MemberSanction[];
  setSanctions: (s: MemberSanction[]) => void;
  sanctionStatus: MemberSanction['sanction_status'];
  setSanctionStatus: (v: MemberSanction['sanction_status']) => void;
  sanctionDate: string;
  setSanctionDate: (v: string) => void;
  sanctionReason: string;
  setSanctionReason: (v: string) => void;
  fixDate: string;
  setFixDate: (v: string) => void;
  fixAction: string;
  setFixAction: (v: string) => void;
  followupStatus: string;
  setFollowupStatus: (v: string) => void;
}> = ({ memberId, sanctions, setSanctions, sanctionStatus, setSanctionStatus, sanctionDate, setSanctionDate, sanctionReason, setSanctionReason, fixDate, setFixDate, fixAction, setFixAction, followupStatus, setFollowupStatus }) => {
  const { notify } = useNotifications()

  React.useEffect(() => {
    const load = async () => {
      try {
        const list = await memberSanctionsAPI.listByMember(memberId)
        setSanctions(list)
      } catch (e) {
        console.error('Failed to load sanctions', e)
      }
    }
    load()
  }, [memberId, setSanctions])

  const addSanction = async () => {
    try {
      const created = await memberSanctionsAPI.create({
        member_id: memberId,
        sanction_status: sanctionStatus,
        sanction_date: sanctionDate ? new Date(sanctionDate).toISOString().slice(0, 10) : undefined,
        reason: sanctionReason || undefined,
        fix_date: fixDate ? new Date(fixDate).toISOString().slice(0, 10) : undefined,
        fix_action: fixAction || undefined,
        followup_status: followupStatus || undefined
      })
      notify({ type: 'info', title: 'Sanksi ditambahkan', message: sanctionStatus })
      const list = await memberSanctionsAPI.listByMember(memberId)
      setSanctions(list)
    } catch (e) {
      console.error('Failed to add sanction', e)
      alert('Gagal menambahkan sanksi')
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status Sanksi</label>
          <select value={sanctionStatus} onChange={(e) => setSanctionStatus(e.target.value as MemberSanction['sanction_status'])} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white">
            <option value="baik">Baik</option>
            <option value="warning">Warning</option>
            <option value="probation">Probation</option>
            <option value="suspended">Suspended</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Sanksi</label>
          <input type="date" value={sanctionDate} onChange={(e) => setSanctionDate(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alasan</label>
          <input type="text" value={sanctionReason} onChange={(e) => setSanctionReason(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Perbaikan</label>
          <input type="date" value={fixDate} onChange={(e) => setFixDate(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tindakan Perbaikan</label>
          <input type="text" value={fixAction} onChange={(e) => setFixAction(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status Tindak Lanjut</label>
          <input type="text" value={followupStatus} onChange={(e) => setFollowupStatus(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={addSanction} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">Tambah Sanksi</button>
      </div>

      <div className="border border-slate-200 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-[#232323]">
            <tr>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Tanggal</th>
              <th className="text-left px-3 py-2">Alasan</th>
              <th className="text-left px-3 py-2">Perbaikan</th>
              <th className="text-left px-3 py-2">Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {sanctions.map((s) => (
              <tr key={s.id} className="border-t border-slate-100 dark:border-[#2A2A2A]">
                <td className="px-3 py-2 capitalize">{s.sanction_status}</td>
                <td className="px-3 py-2">{s.sanction_date || '-'}</td>
                <td className="px-3 py-2">{s.reason || '-'}</td>
                <td className="px-3 py-2">{s.fix_action || '-'}</td>
                <td className="px-3 py-2">{s.followup_status || '-'}</td>
              </tr>
            ))}
            {sanctions.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-center text-slate-400" colSpan={5}>Belum ada riwayat sanksi</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
