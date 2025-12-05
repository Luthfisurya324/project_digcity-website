import React, { useEffect, useState } from 'react'
import { complaintsAPI, type Complaint } from '../../lib/supabase'
import { MessageSquare, Calendar, User, CheckCircle, XCircle, Clock, AlertCircle, Search } from 'lucide-react'

const ResponsePage: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filter, setFilter] = useState<'all' | 'responded'>('all')
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadComplaints()
    }, [])

    const loadComplaints = async () => {
        setLoading(true)
        try {
            const data = await complaintsAPI.list()
            // Filter out rejected complaints if needed, or show all. 
            // Usually public transparency shows accepted/processed/done.
            // Let's show all except maybe 'ditolak' if they want to hide spam, 
            // but transparency usually means showing everything. 
            // Let's filter client-side for now.
            setComplaints(data)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Gagal memuat data pengaduan')
        } finally {
            setLoading(false)
        }
    }

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch =
            c.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase()) ||
            c.category.toLowerCase().includes(search.toLowerCase())

        if (filter === 'responded') {
            return matchesSearch && (c.response || c.status === 'selesai')
        }
        return matchesSearch
    })

    const getStatusBadge = (status: Complaint['status']) => {
        switch (status) {
            case 'baru':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><AlertCircle size={12} /> Baru</span>
            case 'diproses':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} /> Diproses</span>
            case 'selesai':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> Selesai</span>
            case 'ditolak':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} /> Ditolak</span>
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Transparansi Pengaduan</h1>
                    <p className="text-primary-100 max-w-2xl mx-auto text-lg">
                        Pantau tindak lanjut dan respon resmi dari program studi terhadap aspirasi mahasiswa.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari tiket, kategori, atau isi pengaduan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setFilter('all')}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setFilter('responded')}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'responded' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Sudah Direspon
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Memuat data pengaduan...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
                        <AlertCircle className="mx-auto text-red-500 mb-2" size={48} />
                        <p className="text-red-600">{error}</p>
                        <button onClick={loadComplaints} className="mt-4 text-primary-600 hover:underline">Coba lagi</button>
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <MessageSquare className="mx-auto text-gray-300 mb-2" size={48} />
                        <p className="text-gray-500">Belum ada pengaduan yang sesuai kriteria.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredComplaints.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {item.ticket_number}
                                            </span>
                                            {getStatusBadge(item.status)}
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="text-xs font-medium px-3 py-1 rounded-full bg-primary-50 text-primary-700">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                            <User size={14} />
                                            <span>{item.anonymous ? 'Mahasiswa (Anonim)' : item.name}</span>
                                        </div>
                                    </div>

                                    {/* Admin Response Section */}
                                    {item.response && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 relative">
                                            <div className="absolute top-5 left-5">
                                                <MessageSquare className="text-primary-600" size={20} />
                                            </div>
                                            <div className="pl-10">
                                                <h4 className="text-sm font-bold text-primary-900 mb-2">Tanggapan Prodi</h4>
                                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{item.response}</p>
                                                {item.response_at && (
                                                    <p className="text-xs text-primary-400 mt-3">
                                                        Dibalas pada {new Date(item.response_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!item.response && item.status !== 'ditolak' && (
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                                            <p className="text-sm text-gray-500 italic">Menunggu tanggapan resmi...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResponsePage
