import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { membersAPI, type OrganizationMember, auditAPI, orgAPI, type OrganizationDivision, positionsAPI, type OrganizationPosition } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'
import { X, Upload, Check, User } from 'lucide-react'

interface MemberFormProps {
  onClose: () => void
  onSuccess: () => void
}

const MemberForm: React.FC<MemberFormProps> = ({ onClose, onSuccess }) => {
  const { notify } = useNotifications()
  const [fullName, setFullName] = useState('')
  const [npm, setNpm] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [division, setDivision] = useState('')
  const [position, setPosition] = useState('')
  const [joinYear, setJoinYear] = useState(new Date().getFullYear().toString())
  const [status, setStatus] = useState<'active' | 'inactive' | 'demisioner'>('active')
  const [imageUrl, setImageUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('')
  const [classCategory, setClassCategory] = useState('')
  const [className, setClassName] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [divisionOptions, setDivisionOptions] = useState<string[]>([])
  const [positionOptions, setPositionOptions] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const divList = await orgAPI.getStructure(null)
        setDivisionOptions(divList.map((d: OrganizationDivision) => d.name))
      } catch (e) {
        setDivisionOptions(['Badan Pengurus Harian'])
      }

      try {
        const posList = await positionsAPI.getAll()
        setPositionOptions(posList.map((p: OrganizationPosition) => p.name))
      } catch (e) {
        // Fallback if fetch fails
        setPositionOptions(['Anggota', 'Bendahara', 'Kepala Divisi', 'Ketua Himpunan', 'Sekretaris', 'Sekretaris Divisi', 'Wakil Ketua Himpunan'])
      }
    }
    loadData()
  }, [])

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
      const created = await membersAPI.create({
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
        gender: gender || undefined,
        class_category: classCategory || undefined,
        class_name: className || undefined,
        city: city || undefined,
        province: province || undefined
      })
      notify({ type: 'success', title: 'Anggota ditambahkan', message: fullName })
      await auditAPI.log({
        module: 'members',
        action: 'create_member',
        entity_type: 'organization_member',
        entity_id: (created && (created as OrganizationMember).id) ? (created as OrganizationMember).id : undefined,
        details: { full_name: fullName, npm, division, position, join_year: joinYear }
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating member:', error)
      alert('Gagal menyimpan data anggota. Pastikan NPM belum terdaftar.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl transform transition-all flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Anggota Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo Upload */}
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
                <p className="text-xs text-slate-500 text-center">
                  Upload foto formal<br />(Max 2MB, JPG/PNG)
                </p>
              </div>

              {/* Main Info */}
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    placeholder="Nama Lengkap"
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
                      placeholder="NPM"
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
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                      placeholder="email@mahasiswa.id"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                      placeholder="0812..."
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
                    <option value="">Pilih Divisi</option>
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
                    <option value="">Pilih Jabatan</option>
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
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other' | '')}
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
                    placeholder="Reguler"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    placeholder="A/B"
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
                    placeholder="Kabupaten Bogor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    placeholder="Jawa Barat"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#2A2A2A] pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Media Sosial (Opsional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    placeholder="https://linkedin.com/in/..."
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
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-[#2A2A2A]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors"
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
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberForm
