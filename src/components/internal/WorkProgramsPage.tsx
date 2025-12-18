import React, { useEffect, useState } from 'react'
import { attendanceAPI, InternalEvent, budgetAPI } from '../../lib/supabase'
import { Calendar, MapPin, DollarSign, ArrowRight, Plus, Trash2 } from 'lucide-react'
import EventForm from './EventForm'
import WorkProgramDetail from './WorkProgramDetail'
import ConfirmationModal from '../common/ConfirmationModal'

interface WorkProgramsPageProps {
    userRole?: string
    userDivision?: string
}

const WorkProgramsPage: React.FC<WorkProgramsPageProps> = ({ userRole = 'anggota', userDivision = '' }) => {
    // const { userRole, userDivision } = useOutletContext<{ userRole: string, userDivision: string }>()
    const canManageFull = userRole === 'bph'
    const [programs, setPrograms] = useState<InternalEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedProgram, setSelectedProgram] = useState<InternalEvent | null>(null)
    const [editingProgram, setEditingProgram] = useState<InternalEvent | null>(null)
    const [budgets, setBudgets] = useState<Record<string, number>>({})

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [programToDelete, setProgramToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        loadPrograms()
    }, [])

    const loadPrograms = async () => {
        setLoading(true)
        try {
            const allEvents = await attendanceAPI.getEvents()
            const workPrograms = allEvents.filter(e => e.type === 'work_program')

            // Auto-update statuses based on date
            const now = new Date()
            const updates = workPrograms.map(async (program) => {
                // Skip manually cancelled programs
                if (program.status === 'cancelled') return program

                const startDate = new Date(program.date)
                const endDate = program.end_date ? new Date(program.end_date) : startDate

                let newStatus: InternalEvent['status'] = 'upcoming'

                if (now > endDate) {
                    newStatus = 'completed'
                } else if (now >= startDate && now <= endDate) {
                    newStatus = 'ongoing'
                }

                if (program.status !== newStatus) {
                    try {
                        // Only update DB if it's a significant change to avoid thrashing?
                        // Actually, we should sync DB to calculated state typicaly
                        await attendanceAPI.updateEvent(program.id, { status: newStatus })
                        program.status = newStatus
                    } catch (err) {
                        console.error(`Failed to auto-update status for ${program.title}`, err)
                    }
                }
                return program
            })

            await Promise.all(updates)
            setPrograms(workPrograms)

            // Load budget totals for each program
            const budgetMap: Record<string, number> = {}
            await Promise.all(workPrograms.map(async (p) => {
                try {
                    const items = await budgetAPI.getBudgets(p.id)
                    const total = items.reduce((sum, item) => sum + Number(item.total_price), 0)
                    budgetMap[p.id] = total
                } catch (e) {
                    console.error(`Failed to load budget for ${p.title}`, e)
                    budgetMap[p.id] = 0
                }
            }))
            setBudgets(budgetMap)
        } catch (error) {
            console.error('Failed to load work programs:', error)
        } finally {
            setLoading(false)
        }
    }

    const confirmDelete = (id: string) => {
        setProgramToDelete(id)
        setShowDeleteModal(true)
    }

    const handleDelete = async () => {
        if (!programToDelete) return

        setIsDeleting(true)
        try {
            await attendanceAPI.deleteEvent(programToDelete)
            await loadPrograms()
            setShowDeleteModal(false)
            setProgramToDelete(null)
        } catch (error) {
            console.error('Error deleting program:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
    }

    if (selectedProgram) {
        return (
            <WorkProgramDetail
                program={selectedProgram}
                onBack={() => {
                    setSelectedProgram(null)
                    loadPrograms() // Refresh data when returning
                }}
            />
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div id="work-programs-header">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Program Kerja</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola program kerja, anggaran (RAB), dan realisasi keuangan</p>
                </div>
                <button
                    id="work-programs-add-btn"
                    onClick={() => {
                        setEditingProgram(null)
                        setShowForm(true)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
                >
                    <Plus size={18} />
                    <span>Buat Program Kerja</span>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] animate-pulse">
                            <div className="h-6 w-3/4 bg-slate-100 dark:bg-[#232323] rounded mb-4"></div>
                            <div className="space-y-2 mb-6">
                                <div className="h-4 w-1/2 bg-slate-100 dark:bg-[#232323] rounded"></div>
                                <div className="h-4 w-1/3 bg-slate-100 dark:bg-[#232323] rounded"></div>
                            </div>
                            <div className="h-10 w-full bg-slate-100 dark:bg-[#232323] rounded"></div>
                        </div>
                    ))}
                </div>
            ) : programs.length > 0 ? (
                <div id="work-programs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <div key={program.id} className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] hover:shadow-lg transition-all flex flex-col h-full">
                            <div className="mb-4 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-bold uppercase">
                                        {program.division}
                                    </span>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${program.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                        program.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                            program.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                                                'bg-slate-100 text-slate-700'
                                        }`}>
                                        {program.status || 'Upcoming'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{program.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{program.description}</p>

                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span>
                                            {(() => {
                                                const start = new Date(program.date)
                                                const end = program.end_date ? new Date(program.end_date) : null

                                                const isSameDay = end && start.toDateString() === end.toDateString()

                                                if (!end) {
                                                    return start.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                }

                                                if (isSameDay) {
                                                    return (
                                                        <>
                                                            {start.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            <span className="mx-1">•</span>
                                                            {start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </>
                                                    )
                                                }

                                                return (
                                                    <>
                                                        {start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        <span className="mx-1">-</span>
                                                        {end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </>
                                                )
                                            })()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span className="truncate">{program.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-[#2A2A2A]">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Total Anggaran</span>
                                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                        <DollarSign size={14} className="text-emerald-500" />
                                        {formatCurrency(budgets[program.id] || 0)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedProgram(program)}
                                        className="flex-1 py-2 bg-slate-50 dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        Lihat Detail
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setEditingProgram(program)
                                            setShowForm(true)
                                        }}
                                        className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                                        title="Edit Program"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </button>
                                    {canManageFull && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                confirmDelete(program.id)
                                            }}
                                            className="px-3 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                                            title="Hapus Program"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Belum Ada Program Kerja</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        Buat program kerja baru untuk mulai mengelola kegiatan, anggaran, dan laporan keuangan.
                    </p>
                    <button
                        onClick={() => {
                            setEditingProgram(null)
                            setShowForm(true)
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Buat Program Kerja
                    </button>
                </div>
            )}

            {showForm && (
                <EventForm
                    onClose={() => {
                        setShowForm(false)
                        setEditingProgram(null)
                    }}
                    onSuccess={loadPrograms}
                    initialType="work_program"
                    initialData={editingProgram}
                    userRole={userRole}
                    userDivision={userDivision}
                />
            )}

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Hapus Program Kerja"
                message="Apakah Anda yakin ingin menghapus program kerja ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                type="danger"
                loading={isDeleting}
            />
        </div>
    )
}

export default WorkProgramsPage
