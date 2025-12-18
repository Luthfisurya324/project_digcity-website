import React, { useState, useEffect } from 'react'
import { documentsAPI, Document, supabase, auditAPI } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'
import DocumentForm from './DocumentForm'
import DocumentTemplates from './DocumentTemplates'
import DocumentDetail from './DocumentDetail'
import {
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  Clock,
  File,
  Shield
} from 'lucide-react'

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'revision'>('create')
  const [formDocument, setFormDocument] = useState<Document | undefined>(undefined)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [roleLabel, setRoleLabel] = useState('Anggota')
  const [canManage, setCanManage] = useState(false)
  const { notify } = useNotifications()

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const internalRole = (user?.user_metadata?.internal_role || 'anggota') as string
        setRoleLabel(internalRole)
        const normalized = internalRole.toLowerCase()
        setCanManage(['sekretaris', 'ketua', 'administrator', 'admin'].includes(normalized))
      } catch (error) {
        console.error('Error determining role:', error)
      }
    }
    fetchRole()
  }, [])

  const loadDocuments = async () => {
    try {
      const data = await documentsAPI.getAll()
      setDocuments(data)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = typeFilter === 'all' || doc.type === typeFilter
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.ticket_number.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  }).sort((a, b) => {
    // Extract number from ticket_number (e.g., "001" from "001/SEK/...")
    const getNumber = (ticket: string) => {
      const match = ticket.match(/^(\d+)/)
      return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER // Put non-numbered at the end
    }

    const numA = getNumber(a.ticket_number)
    const numB = getNumber(b.ticket_number)

    if (numA !== numB) {
      return numA - numB
    }

    // Fallback to date if numbers are equal or invalid
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const handleOpenForm = (mode: 'create' | 'edit' | 'revision', doc?: Document) => {
    setFormMode(mode)
    setFormDocument(doc)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setFormDocument(undefined)
    setFormMode('create')
  }

  const handleStatusChange = async (doc: Document, status: Document['status']) => {
    try {
      const updated = await documentsAPI.update(doc.id, { status })
      await loadDocuments()
      setSelectedDocument(updated)
      notify({ type: 'info', title: 'Status dokumen diubah', message: `${updated.title} → ${status}` })
      await auditAPI.log({ module: 'documents', action: 'update_status', entity_type: 'document', entity_id: updated.id, details: { status } })
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Gagal memperbarui status dokumen.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'pending_review': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'archived': return 'bg-slate-100 text-slate-700 border-slate-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200' // draft
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'incoming': return 'Surat Masuk'
      case 'outgoing': return 'Surat Keluar'
      case 'proposal': return 'Proposal Acara'
      case 'lpj': return 'LPJ Acara'
      case 'report': return 'Laporan'
      default: return 'Dokumen Lain'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div id="documents-header">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Administrasi Dokumen</h1>
          <p className="text-slate-500 dark:text-slate-400">Arsip surat masuk, keluar, dan laporan organisasi</p>
          <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <Shield size={12} />
            Akses: {roleLabel.toUpperCase()} {canManage ? '(full control)' : '(read only)'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            id="documents-templates-btn"
            className="px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            onClick={() => setShowTemplates(true)}
          >
            <Download size={18} />
            <span className="hidden sm:inline">Templates</span>
          </button>
          <button
            id="documents-add-btn"
            disabled={!canManage}
            title={canManage ? undefined : 'Hanya pengurus inti yang dapat membuat dokumen'}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-200 dark:shadow-none ${canManage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            onClick={() => handleOpenForm('create')}
          >
            <Plus size={18} />
            <span>Buat Surat</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div id="documents-filters" className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor surat, perihal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'incoming', label: 'Masuk' },
            { id: 'outgoing', label: 'Keluar' },
            { id: 'proposal', label: 'Proposal' },
            { id: 'lpj', label: 'LPJ' },
            { id: 'report', label: 'Laporan Lain' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setTypeFilter(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${typeFilter === type.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                : 'bg-white dark:bg-[#1E1E1E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2A2A2A]'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div id="documents-list" className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
        {filteredDocuments.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors group cursor-pointer"
                onClick={() => setSelectedDocument(doc)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.type === 'incoming' ? 'bg-blue-100 text-blue-600' :
                      doc.type === 'outgoing' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#2A2A2A] px-2 py-0.5 rounded">
                          {doc.ticket_number}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusColor(doc.status)}`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{doc.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{doc.description}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(doc.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <File size={12} />
                          v{doc.version}
                        </span>
                        <span>{getTypeLabel(doc.type)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Dokumen"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Belum ada dokumen</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Mulai dengan membuat surat baru atau upload arsip lama.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              <span>Upload Arsip</span>
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <DocumentForm
          mode={formMode}
          document={formDocument}
          onClose={handleCloseForm}
          onSuccess={loadDocuments}
        />
      )}

      {showTemplates && (
        <DocumentTemplates
          onClose={() => setShowTemplates(false)}
        />
      )}

      {selectedDocument && (
        <DocumentDetail
          document={selectedDocument}
          history={documents.filter((doc) => doc.ticket_number === selectedDocument.ticket_number)}
          canManage={canManage}
          onClose={() => setSelectedDocument(null)}
          onEdit={(doc) => {
            setSelectedDocument(null)
            handleOpenForm('edit', doc)
          }}
          onCreateRevision={(doc) => {
            setSelectedDocument(null)
            handleOpenForm('revision', doc)
          }}
          onChangeStatus={handleStatusChange}
        />
      )}
    </div>
  )
}

export default DocumentsPage
