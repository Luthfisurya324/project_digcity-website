import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Document, documentsAPI, supabase } from '../../lib/supabase'
import { X, Upload, Check, FileText, Wand2 } from 'lucide-react'

type DocumentFormMode = 'create' | 'edit' | 'revision'

interface DocumentFormProps {
  onClose: () => void
  onSuccess: () => void
  document?: Document
  mode?: DocumentFormMode
}

const templatePresets = [
  {
    id: 'spj',
    label: 'Template SPJ',
    type: 'report' as Document['type'],
    category: 'SPJ',
    title: 'Surat Pertanggungjawaban Kegiatan',
    description:
      'Melampirkan bukti pengeluaran kegiatan beserta rincian penggunaan dana. Harap sertakan daftar hadir dan dokumentasi.'
  },
  {
    id: 'undangan',
    label: 'Surat Undangan',
    type: 'outgoing' as Document['type'],
    category: 'Undangan',
    title: 'Undangan Rapat Koordinasi',
    description: 'Mengundang pihak terkait untuk menghadiri rapat koordinasi sesuai jadwal terlampir.'
  },
  {
    id: 'laporan',
    label: 'Laporan LPJ',
    type: 'report' as Document['type'],
    category: 'LPJ',
    title: 'Laporan Pertanggungjawaban Program',
    description: 'Ringkasan hasil kegiatan, realisasi anggaran, dan evaluasi program.'
  }
]

const DocumentForm: React.FC<DocumentFormProps> = ({ onClose, onSuccess, document, mode = 'create' }) => {
  const isEditMode = mode === 'edit' && document
  const isRevisionMode = mode === 'revision' && document

  const [title, setTitle] = useState(document?.title || '')
  const [type, setType] = useState<Document['type']>(document?.type || 'outgoing')
  const [category, setCategory] = useState(document?.category || 'Umum')
  const [date, setDate] = useState(document?.date ? document.date.slice(0, 10) : new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState(document?.description || '')
  const [fileUrl, setFileUrl] = useState(document?.file_url || '')
  const [driveLink, setDriveLink] = useState(document?.drive_link || '')
  const [ticketNumber, setTicketNumber] = useState(document?.ticket_number || '')
  const [version, setVersion] = useState<number>(document?.version || 1)

  // New fields
  const [sender, setSender] = useState(document?.sender || '')
  const [recipient, setRecipient] = useState(document?.recipient || '')
  const [dateReceived, setDateReceived] = useState(document?.date_received ? document.date_received.slice(0, 10) : '')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchTicket = async () => {
      if (!document && mode === 'create') {
        if (type !== 'incoming') {
          const ticket = await documentsAPI.getNextTicketNumber()
          if (isMounted) {
            setTicketNumber(ticket)
          }
        } else {
          if (isMounted) setTicketNumber('')
        }
      }
    }

    fetchTicket()

    if (isRevisionMode && document) {
      setTicketNumber(document.ticket_number)
      setVersion((document.version || 1) + 1)
    }
    return () => {
      isMounted = false
    }
  }, [document, mode, isRevisionMode, type])

  const typeOptions = [
    { value: 'incoming', label: 'Surat Masuk' },
    { value: 'outgoing', label: 'Surat Keluar' },
    { value: 'report', label: 'Laporan (LPJ)' },
    { value: 'other', label: 'Dokumen Lain' }
  ]

  const categoryOptions = ['Umum', 'Undangan', 'Peminjaman', 'Keputusan', 'Rekomendasi', 'MoU', 'SPJ', 'LPJ', 'Internal']

  const formTitle = useMemo(() => {
    if (isEditMode) return 'Ubah Dokumen'
    if (isRevisionMode) return `Buat Revisi v${version}`
    return 'Buat Dokumen Baru'
  }, [isEditMode, isRevisionMode, version])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    try {
      const file = e.target.files[0]
      const publicUrl = await documentsAPI.uploadFile(file)
      setFileUrl(publicUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Gagal mengunggah dokumen. Silakan coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  const handleApplyTemplate = (templateId: string) => {
    const template = templatePresets.find((preset) => preset.id === templateId)
    if (!template) return
    setTitle(template.title)
    setType(template.type)
    setCategory(template.category)
    setDescription(template.description)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const commonData = {
        title,
        type,
        category,
        date,
        description,
        file_url: fileUrl,
        drive_link: driveLink,
        sender: type === 'incoming' ? sender : undefined,
        recipient: type === 'outgoing' ? recipient : undefined,
        date_received: type === 'incoming' ? dateReceived : undefined,
      }

      if (isEditMode && document) {
        await documentsAPI.update(document.id, {
          ...commonData,
          // If editing incoming, allow updating ticket number if needed, 
          // but usually ticket number is fixed. For now let's allow updating it if it's incoming.
          ticket_number: type === 'incoming' ? ticketNumber : document.ticket_number
        })
      } else {
        // For incoming, use the manually entered ticket number
        // For outgoing, use generated or existing (if revision)
        let payloadTicket = ticketNumber
        if (type !== 'incoming' && (!payloadTicket || payloadTicket === '')) {
          payloadTicket = documentsAPI.generateTicketNumber()
        }

        if (isRevisionMode && document) {
          payloadTicket = document.ticket_number
        }

        const payloadVersion = isRevisionMode && document ? version : 1

        await documentsAPI.create({
          ...commonData,
          version: payloadVersion,
          status: 'draft',
          created_by: user.id,
          ticket_number: payloadTicket
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Gagal menyimpan dokumen. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl transform transition-all flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{formTitle}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Type Selection First */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Dokumen</label>
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Judul / Perihal</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  placeholder="Contoh: Surat Undangan Rapat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nomor Surat</label>
                <input
                  type="text"
                  required={type === 'incoming'}
                  disabled={type !== 'incoming'}
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  className={`w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg ${type !== 'incoming' ? 'bg-slate-50 dark:bg-[#232323] text-slate-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white'}`}
                  placeholder={type === 'incoming' ? "Masukkan Nomor Surat Masuk" : "Otomatis (ORG/SEK/...)"}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {type === 'incoming'
                    ? 'Masukkan nomor surat sesuai yang tertera pada dokumen fisik.'
                    : isRevisionMode
                      ? 'Menggunakan nomor surat yang sama.'
                      : 'Nomor surat digenerate otomatis.'}
                </p>
              </div>
            </div>

            {/* Conditional Fields based on Type */}
            {type === 'incoming' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pengirim</label>
                  <input
                    type="text"
                    required
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    placeholder="Nama Instansi / Pengirim"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Diterima</label>
                  <input
                    type="date"
                    required
                    value={dateReceived}
                    onChange={(e) => setDateReceived(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
              </div>
            )}

            {type === 'outgoing' && (
              <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Penerima / Tujuan</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  placeholder="Nama Instansi / Penerima"
                />
              </div>
            )}

            {!isEditMode && type !== 'incoming' && (
              <div className="border border-dashed border-slate-200 dark:border-[#2A2A2A] rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <Wand2 size={16} className="text-blue-500" />
                  Gunakan Template Otomatis
                </p>
                <div className="flex flex-wrap gap-2">
                  {templatePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyTemplate(preset.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                <input
                  list="categories"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                  placeholder="Pilih atau ketik kategori"
                />
                <datalist id="categories">
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Surat</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deskripsi</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                placeholder="Tambahkan keterangan singkat..."
              />
            </div>

            <div className="border-t border-slate-100 dark:border-[#2A2A2A] pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Lampiran & Tautan</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload File</label>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 relative border-2 border-dashed border-slate-300 dark:border-[#2A2A2A] rounded-lg p-4 text-center hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <div className="flex flex-col items-center gap-1">
                        {uploading ? (
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : fileUrl ? (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <Check size={20} />
                            <span className="text-sm font-medium">File terupload</span>
                          </div>
                        ) : (
                          <>
                            <Upload size={20} className="text-slate-400" />
                            <span className="text-sm text-slate-500">Klik untuk upload dokumen (PDF/DOCX)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {fileUrl && (
                    <p className="text-xs text-emerald-600 mt-1 truncate">URL: {fileUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link Google Drive (Opsional)</label>
                  <input
                    type="url"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    placeholder="https://drive.google.com/..."
                  />
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
                  <FileText size={18} />
                )}
                {isEditMode ? 'Simpan Perubahan' : isRevisionMode ? 'Simpan Revisi' : 'Buat Dokumen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DocumentForm
