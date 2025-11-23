import React, { useState } from 'react'
import { AlertCircle, Upload, CheckCircle, AlertTriangle } from 'lucide-react'
import { complaintsAPI, supabase } from '../../lib/supabase'

const CATEGORIES = [
  'Dosen dan pengajaran',
  'Mata kuliah dan kurikulum',
  'Pembayaran dan administrasi',
  'Fasilitas kampus',
  'Masalah lainnya'
]

const ComplaintsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'status'>('submit')
  const [anonymous, setAnonymous] = useState(false)
  const [name, setName] = useState('')
  const [npm, setNpm] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successTicket, setSuccessTicket] = useState<string | null>(null)
  const [statusTicket, setStatusTicket] = useState('')
  const [statusResult, setStatusResult] = useState<{ ticket_number: string; status: string; category: string; created_at: string; anonymous: boolean } | null>(null)
  const [checking, setChecking] = useState(false)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    setUploading(true)
    const uploaded: string[] = []
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i]
        const timestamp = Date.now()
        const ext = f.name.includes('.') ? f.name.split('.').pop() : 'dat'
        const path = `complaints/${timestamp}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('admin-images')
          .upload(path, f, { cacheControl: '3600', upsert: false })
        if (uploadError) throw new Error(uploadError.message)
        const { data: { publicUrl } } = supabase.storage
          .from('admin-images')
          .getPublicUrl(path)
        uploaded.push(publicUrl)
      }
      setAttachments((prev) => [...prev, ...uploaded])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload gagal')
    } finally {
      setUploading(false)
    }
  }

  const validate = () => {
    if (!category) return 'Kategori wajib dipilih'
    if (!description || description.trim().length < 10) return 'Deskripsi minimal 10 karakter'
    if (!anonymous) {
      if (!name.trim()) return 'Nama wajib diisi jika bukan anonim'
      if (!npm.trim()) return 'NPM wajib diisi jika bukan anonim'
    }
    return null
  }

  const handleStatusCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setStatusResult(null)
    if (!statusTicket.trim()) {
      setError('Masukkan nomor tiket')
      return
    }
    setChecking(true)
    try {
      const res = await complaintsAPI.checkStatus(statusTicket.trim())
      if (!res) {
        setError('Nomor tiket tidak ditemukan')
      } else {
        setStatusResult(res)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setSubmitting(true)
    try {
      const res = await complaintsAPI.submit({
        category,
        description: description.trim(),
        anonymous,
        name: anonymous ? undefined : name.trim(),
        npm: anonymous ? undefined : npm.trim(),
        contact_email: anonymous ? undefined : contactEmail.trim(),
        attachments
      })
      setSuccessTicket(res.ticket_number)
      setAnonymous(false)
      setName('')
      setNpm('')
      setContactEmail('')
      setCategory('')
      setDescription('')
      setAttachments([])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[60vh] bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-primary-600" size={22} />
            <h1 className="text-2xl font-semibold text-secondary-900">Formulir Pengaduan Mahasiswa</h1>
          </div>
          <p className="text-sm text-secondary-600 mt-2">Khusus bidang Bisnis Digital. Kirimkan keluhan Anda dengan jelas untuk penanganan yang lebih cepat.</p>
        </div>

        <div className="mb-4">
          <div className="inline-flex rounded-xl border border-secondary-200 overflow-hidden">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'submit' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700'}`}
            >
              Masukan Pengaduan
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'status' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700'}`}
            >
              Cek Status Pengaduan
            </button>
          </div>
        </div>

        {activeTab === 'submit' && successTicket && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex items-start gap-3">
            <CheckCircle className="text-emerald-600" size={18} />
            <div>
              <p className="text-sm font-semibold text-emerald-700">Keluhan berhasil dikirim</p>
              <p className="text-sm text-emerald-700">Nomor tiket: <span className="font-mono font-semibold">{successTicket}</span></p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
            <AlertTriangle className="text-red-600" size={18} />
            <div>
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-secondary-200 p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-800">Kategori Keluhan</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-secondary-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
              required
            >
              <option value="">Pilih kategori...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-800">Deskripsi Lengkap</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan detail keluhan, waktu kejadian, pihak terkait, dan informasi pendukung lainnya."
              className="w-full rounded-xl border border-secondary-300 bg-white px-4 py-3 text-sm min-h-[140px] focus:outline-none focus:ring-2 focus:ring-primary-500/60"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="anonymous"
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="rounded-md"
            />
            <label htmlFor="anonymous" className="text-sm text-secondary-800">Kirim sebagai anonim</label>
          </div>

          {!anonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-800">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-secondary-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                  required={!anonymous}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-800">NPM</label>
                <input
                  type="text"
                  value={npm}
                  onChange={(e) => setNpm(e.target.value)}
                  className="w-full rounded-xl border border-secondary-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                  required={!anonymous}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-sm font-medium text-secondary-800">Email (opsional)</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-secondary-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                  placeholder="email@contoh.com"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-800">Lampiran File Pendukung (opsional)</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                className="text-sm"
              />
              {uploading && (
                <span className="text-xs text-secondary-600">Mengunggah...</span>
              )}
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 text-xs text-secondary-700 space-y-1">
                {attachments.map((url) => (
                  <div key={url} className="truncate">{url}</div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              <Upload size={16} />
              <span>Kirim Pengaduan</span>
            </button>
          </div>
        </form>
        )}

        {activeTab === 'status' && (
          <form onSubmit={handleStatusCheck} className="bg-white rounded-2xl border border-secondary-200 p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-800">Nomor Tiket</label>
              <input
                type="text"
                value={statusTicket}
                onChange={(e) => setStatusTicket(e.target.value)}
                placeholder="KEL-YYYYMMDD-XXXXXX"
                className="w-full rounded-xl border border-secondary-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={checking}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
              >
                Cek Status
              </button>
            </div>
            {statusResult && (
              <div className="mt-4 rounded-xl border border-secondary-200 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-secondary-600">Nomor Tiket</span><div className="font-mono">{statusResult.ticket_number}</div></div>
                  <div><span className="text-secondary-600">Tanggal</span><div>{new Date(statusResult.created_at).toLocaleString()}</div></div>
                  <div><span className="text-secondary-600">Kategori</span><div>{statusResult.category}</div></div>
                  <div><span className="text-secondary-600">Status</span><div className="font-semibold">{statusResult.status}</div></div>
                  <div><span className="text-secondary-600">Anonim</span><div>{statusResult.anonymous ? 'Ya' : 'Tidak'}</div></div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default ComplaintsPage
