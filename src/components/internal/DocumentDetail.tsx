import React from 'react'
import { createPortal } from 'react-dom'
import { Document } from '../../lib/supabase'
import {
  X,
  FileText,
  Calendar,
  Folder,
  Clock,
  Download,
  ExternalLink,
  Copy,
  CheckCircle2,
  Archive,
  RefreshCw,
  ShieldCheck,
  Layers,
  Pencil
} from 'lucide-react'

interface DocumentDetailProps {
  document: Document
  history: Document[]
  canManage: boolean
  onClose: () => void
  onEdit: (doc: Document) => void
  onCreateRevision: (doc: Document) => void
  onChangeStatus: (doc: Document, status: Document['status']) => void
}

const statusLabels: Record<Document['status'], string> = {
  draft: 'Draft',
  pending_review: 'Menunggu Review',
  approved: 'Disetujui',
  archived: 'Diarsipkan'
}

const statusColors: Record<Document['status'], string> = {
  draft: 'bg-blue-100 text-blue-700',
  pending_review: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-slate-200 text-slate-600'
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({
  document,
  history,
  canManage,
  onClose,
  onEdit,
  onCreateRevision,
  onChangeStatus
}) => {
  const copyLink = async () => {
    const link = document.file_url || document.drive_link
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      alert('Tautan dokumen disalin ke clipboard')
    } catch (error) {
      console.error('Failed to copy link', error)
    }
  }

  const [showPreview, setShowPreview] = React.useState(false)

  const getFileViewerUrl = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase()
    // For Office documents, use Google Docs Viewer
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension || '')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    }
    return url
  }

  const actions = [
    { label: 'Setujui Dokumen', status: 'approved' as Document['status'], icon: CheckCircle2, show: canManage && document.status !== 'approved' },
    { label: 'Tandai Pending Review', status: 'pending_review' as Document['status'], icon: RefreshCw, show: canManage && document.status !== 'pending_review' },
    { label: 'Arsipkan', status: 'archived' as Document['status'], icon: Archive, show: canManage && document.status !== 'archived' },
    { label: 'Kembalikan Draft', status: 'draft' as Document['status'], icon: ShieldCheck, show: canManage && document.status !== 'draft' }
  ]

  // If preview is open, show the preview modal
  if (showPreview && document.file_url) {
    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
        <div className="bg-white dark:bg-[#111111] rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#1F1F1F]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              {document.title}
            </h3>
            <div className="flex gap-2">
              <a
                href={document.file_url}
                download
                className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                title="Download Original"
              >
                <Download size={20} />
              </a>
              <button onClick={() => setShowPreview(false)} className="p-2 text-slate-500 hover:text-rose-600 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-100 dark:bg-[#0A0A0A] relative">
            <iframe
              src={getFileViewerUrl(document.file_url)}
              className="w-full h-full border-0"
              title="Document Preview"
            />
          </div>
        </div>
      </div>,
      window.document.body
    )
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-[#111111] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#1F1F1F]">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Detail Dokumen</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{document.title}</h3>
            {document.type !== 'proposal' && document.type !== 'lpj' && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#2A2A2A] px-2 py-0.5 rounded">
                  {document.ticket_number}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase border ${statusColors[document.status]}`}>
                  {document.status.replace('_', ' ')}
                </span>
              </div>
            )}
            {(document.type === 'proposal' || document.type === 'lpj') && (
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase border ${statusColors[document.status]}`}>
                  {document.status.replace('_', ' ')}
                </span>
              </div>
            )}  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-[#1E1E1E] dark:text-slate-300">
              v{document.version}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
          <X size={22} />
        </button>


        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0A0A0A]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="p-5 rounded-2xl border border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#181818]">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Informasi Dokumen</h4>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-blue-500" />
                    <span>{new Date(document.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Folder size={16} className="text-emerald-500" />
                    <span>{document.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-purple-500" />
                    <span>
                      {document.type === 'incoming' && 'Surat Masuk'}
                      {document.type === 'outgoing' && 'Surat Keluar'}
                      {document.type === 'report' && 'Laporan / LPJ'}
                      {document.type === 'other' && 'Dokumen Lain'}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-orange-500 mt-0.5" />
                    <span>Dibuat pada {new Date(document.created_at).toLocaleString('id-ID')}</span>
                  </div>

                  {document.sender && (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 w-4 flex justify-center">From</span>
                      <span className="font-medium">{document.sender}</span>
                    </div>
                  )}

                  {document.recipient && (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 w-4 flex justify-center">To</span>
                      <span className="font-medium">{document.recipient}</span>
                    </div>
                  )}

                  {document.date_received && (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 w-4 flex justify-center">Recv</span>
                      <span>Diterima: {new Date(document.date_received).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                  {document.description && (
                    <div className="mt-4">
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Ringkasan</p>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">{document.description}</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="p-5 rounded-2xl border border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#181818]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Lampiran & Tautan</h4>
                  <div className="flex gap-2">
                    {document.file_url && (
                      <button
                        onClick={() => setShowPreview(true)}
                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-2 transition-colors border border-blue-100 dark:border-blue-800"
                      >
                        <FileText size={16} />
                        Lihat Dokumen
                      </button>
                    )}
                    {document.drive_link && (
                      <a
                        href={document.drive_link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 flex items-center gap-1 dark:bg-[#1E1E1E]"
                      >
                        <ExternalLink size={14} />
                        Google Drive
                      </a>
                    )}
                    {(document.file_url || document.drive_link) && (
                      <button onClick={copyLink} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 flex items-center gap-1 dark:bg-[#1E1E1E]">
                        <Copy size={14} />
                        Salin Link
                      </button>
                    )}
                  </div>
                </div>
                {!document.file_url && !document.drive_link && (
                  <p className="text-sm text-slate-500">Belum ada file lampiran. Unggah dokumen melalui tombol edit.</p>
                )}
              </section>

              <section className="p-5 rounded-2xl border border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#181818]">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers size={16} />
                  Riwayat Versi
                </h4>
                {history.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada riwayat revisi.</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {history
                      .sort((a, b) => b.version - a.version)
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-xl border text-sm ${item.id === document.id
                            ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                            : 'bg-slate-50 border-slate-200 dark:bg-[#1E1E1E] dark:border-[#1F1F1F] text-slate-600'
                            }`}
                        >
                          <div>
                            <p className="font-semibold">Versi {item.version}</p>
                            <p className="text-xs">{statusLabels[item.status]}</p>
                          </div>
                          <span className="text-xs">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-4">
              <section className="p-5 rounded-2xl border border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#181818]">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Aksi Dokumen</h4>
                <div className="space-y-2">
                  {canManage ? (
                    <>
                      <button
                        onClick={() => onEdit(document)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1F1F1F] text-sm font-semibold flex items-center gap-2 hover:border-blue-400 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                        Edit Dokumen
                      </button>
                      <button
                        onClick={() => onCreateRevision(document)}
                        className="w-full px-4 py-2.5 rounded-xl border border-dashed border-blue-200 text-sm font-semibold text-blue-600 flex items-center gap-2 hover:bg-blue-50"
                      >
                        <Layers size={16} />
                        Buat Revisi Baru
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Anda memiliki akses baca. Hubungi sekretaris untuk melakukan perubahan atau mengunggah revisi.
                    </p>
                  )}
                </div>
              </section>

              {canManage && (
                <section className="p-5 rounded-2xl border border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#181818] space-y-2">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Status & Persetujuan</h4>
                  {actions
                    .filter((action) => action.show)
                    .map((action) => (
                      <button
                        key={action.label}
                        onClick={() => onChangeStatus(document, action.status)}
                        className="w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2 bg-slate-50 dark:bg-[#1E1E1E] hover:bg-blue-50 dark:hover:bg-blue-900/10"
                      >
                        <action.icon size={16} className="text-blue-500" />
                        {action.label}
                      </button>
                    ))}
                  {actions.filter((action) => action.show).length === 0 && (
                    <p className="text-xs text-slate-500">Tidak ada aksi status lain untuk dokumen ini.</p>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    window.document.body
  )
}

export default DocumentDetail
