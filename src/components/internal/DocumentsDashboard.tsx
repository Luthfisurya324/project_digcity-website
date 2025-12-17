import React, { useState, useEffect, useMemo } from 'react'
import { documentsAPI, Document } from '../../lib/supabase'
import {
    FileText,
    TrendingUp,
    ArrowDownLeft,
    ArrowUpRight,
    PieChart,
    Calendar,
    ArrowRight,
    Clock
} from 'lucide-react'
import { Link } from 'react-router-dom'

const DocumentsDashboard: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await documentsAPI.getAll()
            setDocuments(data)
        } catch (error) {
            console.error('Error loading documents:', error)
        } finally {
            setLoading(false)
        }
    }

    const stats = useMemo(() => {
        const total = documents.length
        const incoming = documents.filter(d => d.type === 'incoming').length
        const outgoing = documents.filter(d => d.type === 'outgoing').length
        const reports = documents.filter(d => d.type === 'report').length
        const pending = documents.filter(d => d.status === 'pending_review').length
        const approved = documents.filter(d => d.status === 'approved').length

        return { total, incoming, outgoing, reports, pending, approved }
    }, [documents])

    const recentDocuments = useMemo(() => {
        return [...documents]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
    }, [documents])

    const monthlyTrend = useMemo(() => {
        const map = new Map<string, { incoming: number; outgoing: number; label: string }>()
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            const label = d.toLocaleDateString('id-ID', { month: 'short' })
            map.set(key, { incoming: 0, outgoing: 0, label })
        }

        documents.forEach((d) => {
            const date = new Date(d.date)
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            if (map.has(key)) {
                const entry = map.get(key)!
                if (d.type === 'incoming') entry.incoming++
                if (d.type === 'outgoing') entry.outgoing++
            }
        })

        return Array.from(map.values())
    }, [documents])

    const maxTrendValue = Math.max(...monthlyTrend.map(m => Math.max(m.incoming, m.outgoing)), 1)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700'
            case 'pending_review': return 'bg-amber-100 text-amber-700'
            case 'archived': return 'bg-slate-100 text-slate-700'
            default: return 'bg-blue-100 text-blue-700' // draft
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
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Dokumen</h1>
                <p className="text-slate-500 dark:text-slate-400">Ringkasan aktivitas persuratan dan dokumen</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl p-6 text-white shadow-lg shadow-pink-200 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-4 opacity-90">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <span className="font-medium">Total Dokumen</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-1">{stats.total}</h2>
                    <p className="text-sm opacity-80">Semua Kategori</p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <ArrowDownLeft size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Surat Masuk</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.incoming}</h2>
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Total Akumulatif</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            <ArrowUpRight size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Surat Keluar</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.outgoing}</h2>
                    <p className="text-xs text-purple-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Total Akumulatif</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Perlu Review</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.pending}</h2>
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                        <span>Pending Appproval</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Tren Surat (6 Bulan)</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-slate-500">Masuk</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-slate-500">Keluar</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
                        {monthlyTrend.map((month, idx) => (
                            <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                    <div className="text-blue-400">Masuk: {month.incoming}</div>
                                    <div className="text-purple-400">Keluar: {month.outgoing}</div>
                                </div>

                                <div className="flex gap-1 h-full items-end justify-center w-full">
                                    <div
                                        className="w-full max-w-[20px] bg-blue-500/80 hover:bg-blue-500 rounded-t transition-all"
                                        style={{ height: `${Math.max((month.incoming / maxTrendValue) * 100, 4)}%` }}
                                    ></div>
                                    <div
                                        className="w-full max-w-[20px] bg-purple-500/80 hover:bg-purple-500 rounded-t transition-all"
                                        style={{ height: `${Math.max((month.outgoing / maxTrendValue) * 100, 4)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500 text-center mt-2">{month.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Document Type Distribution */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Distribusi Tipe</h3>
                        <PieChart size={18} className="text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700 dark:text-slate-300">Surat Masuk</span>
                                <span className="font-medium text-slate-900 dark:text-white">{stats.incoming}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-[#2A2A2A] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full rounded-full"
                                    style={{ width: `${stats.total > 0 ? (stats.incoming / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700 dark:text-slate-300">Surat Keluar</span>
                                <span className="font-medium text-slate-900 dark:text-white">{stats.outgoing}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-[#2A2A2A] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-purple-500 h-full rounded-full"
                                    style={{ width: `${stats.total > 0 ? (stats.outgoing / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700 dark:text-slate-300">Laporan (LPJ)</span>
                                <span className="font-medium text-slate-900 dark:text-white">{stats.reports}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-[#2A2A2A] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-orange-500 h-full rounded-full"
                                    style={{ width: `${stats.total > 0 ? (stats.reports / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Dokumen Terbaru</h3>
                    <Link to="/documents" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        Lihat Semua <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                    {recentDocuments.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">Belum ada dokumen.</p>
                    ) : (
                        recentDocuments.map((doc) => (
                            <div key={doc.id} className="p-4 hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.type === 'incoming' ? 'bg-blue-100 text-blue-600' :
                                        doc.type === 'outgoing' ? 'bg-purple-100 text-purple-600' :
                                            'bg-orange-100 text-orange-600'
                                        }`}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900 dark:text-white line-clamp-1">{doc.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="font-mono bg-slate-100 dark:bg-[#2A2A2A] px-1.5 rounded">{doc.ticket_number}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(doc.date).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(doc.status)}`}>
                                        {doc.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default DocumentsDashboard
