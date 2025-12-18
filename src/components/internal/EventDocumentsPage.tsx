import React, { useState, useEffect } from 'react'
import { attendanceAPI, InternalEvent, documentsAPI, Document } from '../../lib/supabase'
import { Upload, Eye, Search } from 'lucide-react'
import DocumentForm from './DocumentForm'
import DocumentDetail from './DocumentDetail'

interface ExtendedEvent extends InternalEvent {
    proposal?: Document
    lpj?: Document
}

const EventDocumentsPage: React.FC = () => {
    const [events, setEvents] = useState<ExtendedEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
    const [documentType, setDocumentType] = useState<'proposal' | 'lpj' | null>(null)
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null) // Added state for selectedDocument

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            // Fetch events and documents parallelly
            const [allEvents, allDocs] = await Promise.all([
                attendanceAPI.getEvents(),
                documentsAPI.getAll()
            ])

            // Filter for work programs only
            const workPrograms = allEvents.filter(e => e.type === 'work_program')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

            // Map documents to events
            const extendedEvents = workPrograms.map(event => {
                const eventDocs = allDocs.filter(d => d.event_id === event.id)
                const proposal = eventDocs.find(d => d.type === 'proposal')
                const lpj = eventDocs.find(d => d.type === 'lpj')
                return { ...event, proposal, lpj }
            })

            setEvents(extendedEvents)
        } catch (error) {
            console.error('Failed to load event documents:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadClick = (eventId: string, type: 'proposal' | 'lpj') => {
        setSelectedEventId(eventId)
        setDocumentType(type)
        setShowForm(true)
    }

    const handleViewDocument = (doc: Document) => { // Added handleViewDocument function
        setSelectedDocument(doc)
    }

    const getStatusColor = (doc?: Document) => {
        if (!doc) return 'bg-slate-100 text-slate-500' // Belum ada
        if (doc.status === 'approved') return 'bg-emerald-100 text-emerald-700'
        if (doc.status === 'pending_review') return 'bg-amber-100 text-amber-700'
        return 'bg-blue-100 text-blue-700' // Draft
    }

    const getStatusLabel = (doc?: Document) => {
        if (!doc) return 'Belum Upload'
        if (doc.status === 'approved') return 'Disetujui'
        if (doc.status === 'pending_review') return 'Menunggu Review'
        return 'Draft'
    }

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.division.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dokumen Program Kerja</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola Proposal dan LPJ untuk setiap acara</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari program kerja..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-[#2A2A2A] border-b border-slate-200 dark:border-[#2A2A2A]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Program Kerja</th>
                                    <th className="px-6 py-4 font-medium">Tanggal</th>
                                    <th className="px-6 py-4 font-medium">Divisi</th>
                                    <th className="px-6 py-4 font-medium">Proposal</th>
                                    <th className="px-6 py-4 font-medium">Laporan (LPJ)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                                            {event.title}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium whitespace-nowrap">
                                                {event.division}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2 items-start">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(event.proposal)}`}>
                                                    {getStatusLabel(event.proposal)}
                                                </span>
                                                {event.proposal ? (
                                                    <div className="flex items-center gap-1">
                                                        <button // Changed from <a> to <button>
                                                            onClick={() => handleViewDocument(event.proposal!)} // Added onClick handler
                                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <Eye size={12} /> Lihat
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUploadClick(event.id, 'proposal')}
                                                        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Upload size={12} /> Upload
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2 items-start">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(event.lpj)}`}>
                                                    {getStatusLabel(event.lpj)}
                                                </span>
                                                {event.lpj ? (
                                                    <div className="flex items-center gap-1">
                                                        <button // Changed from <a> to <button>
                                                            onClick={() => handleViewDocument(event.lpj!)} // Added onClick handler
                                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <Eye size={12} /> Lihat
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUploadClick(event.id, 'lpj')}
                                                        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Upload size={12} /> Upload
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            Tidak ada program kerja ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showForm && selectedEventId && documentType && (
                <DocumentForm
                    onClose={() => {
                        setShowForm(false)
                        setSelectedEventId(null)
                        setDocumentType(null)
                    }}
                    onSuccess={() => {
                        loadData()
                        setShowForm(false)
                        setSelectedEventId(null)
                        setDocumentType(null)
                    }}
                    initialData={{
                        type: documentType,
                        category: documentType === 'proposal' ? 'Proposal Acara' : 'Laporan Pertanggungjawaban (LPJ)',
                        title: `${documentType === 'proposal' ? 'Proposal' : 'LPJ'} - ${events.find(e => e.id === selectedEventId)?.title}`,
                        event_id: selectedEventId
                    }}
                    fixedType={true}
                />
            )}

            {selectedDocument && ( // Conditionally render DocumentDetail
                <DocumentDetail
                    document={selectedDocument}
                    history={[]} // History is currently not loaded here, passing empty for now or could implement fetch
                    canManage={true} // Assuming full access, or pass from props if needed
                    onClose={() => setSelectedDocument(null)}
                    onEdit={() => { }} // Not implementing edit from viewing context here yet
                    onCreateRevision={() => { }}
                    onChangeStatus={() => { }}
                // Note: You might want to pass handleEdit/etc if needed later
                />
            )}
        </div>
    )
}

export default EventDocumentsPage
