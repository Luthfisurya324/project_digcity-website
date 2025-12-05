import React, { useState, useEffect, useMemo } from 'react'
import {
    membersAPI,
    attendanceAPI,
    kpiAPI,
    OrganizationMember,
    MemberKPI
} from '../../lib/supabase'
import {
    Trophy,
    Search,
    RefreshCw,
    Edit3,
    Award,
    Users,
    FileSpreadsheet
} from 'lucide-react'
import KPIAssessmentModal from './KPIAssessmentModal'
import KPIImportModal from './KPIImportModal'
import ConfirmationModal from '../common/ConfirmationModal'

const KPIPage: React.FC = () => {
    const [members, setMembers] = useState<OrganizationMember[]>([])
    const [kpis, setKpis] = useState<MemberKPI[]>([])
    const [loading, setLoading] = useState(true)
    // Period is now fixed to tenure
    const [period] = useState('2024/2025')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null)
    const [showAssessmentModal, setShowAssessmentModal] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [showRecalculateConfirm, setShowRecalculateConfirm] = useState(false)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [recalculating, setRecalculating] = useState(false)

    useEffect(() => {
        loadData()
    }, [period])

    const loadData = async () => {
        setLoading(true)
        try {
            const [membersData, kpisData] = await Promise.all([
                membersAPI.getAll(),
                kpiAPI.getByPeriod(period)
            ])
            setMembers(membersData)
            setKpis(kpisData)
        } catch (error) {
            console.error('Failed to load KPI data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRecalculateAttendance = () => {
        setShowRecalculateConfirm(true)
    }

    const executeRecalculation = async () => {
        setRecalculating(true)
        try {
            // 1. Fetch all events and attendance
            const [events, attendanceRecords] = await Promise.all([
                attendanceAPI.getEvents(),
                attendanceAPI.getRecentAttendance(365) // Last 1 year
            ])

            // Filter events by period (Assuming period format "YYYY-Semester")
            // For MVP, we'll just take all events in the last 6 months if period matches current
            // Or just use all fetched events for simplicity as "Active Period" events
            // TODO: Implement proper period date range filtering
            const activeEvents = events.filter(e => e.status !== 'cancelled')
            const totalEvents = activeEvents.length

            if (totalEvents === 0) {
                alert('Tidak ada event untuk dihitung.')
                return
            }

            // 2. Map attendance by member for fast lookup
            // Map<memberId, Set<eventId>>
            const memberAttendanceMap = new Map<string, Set<string>>()
            attendanceRecords.forEach(record => {
                if (record.status === 'present' || record.status === 'late') {
                    if (!memberAttendanceMap.has(record.member_id)) {
                        memberAttendanceMap.set(record.member_id, new Set())
                    }
                    memberAttendanceMap.get(record.member_id)?.add(record.event_id)
                }
            })

            // 3. Update KPI for each member
            const updates = members.map(async (member) => {
                if (member.status !== 'active') return

                // Filter mandatory events for THIS member
                // Mandatory = 'Umum' OR member's division
                const mandatoryEvents = events.filter(e =>
                    e.status !== 'cancelled' &&
                    (e.division === 'Umum' || e.division === member.division)
                )

                const totalMandatory = mandatoryEvents.length
                const attendedEventIds = memberAttendanceMap.get(member.id) || new Set()

                // Count how many MANDATORY events were attended
                const presentCount = mandatoryEvents.filter(e => attendedEventIds.has(e.id)).length

                // Calculate score
                const attendanceScore = totalMandatory > 0
                    ? Math.min(100, Math.round((presentCount / totalMandatory) * 100))
                    : 0

                // Get existing KPI to preserve other scores
                const existingKPI = kpis.find(k => k.member_id === member.id)

                await kpiAPI.upsert({
                    id: existingKPI?.id,
                    member_id: member.id,
                    period,
                    attendance_score: attendanceScore,
                    project_score: existingKPI?.project_score || 0,
                    attitude_score: existingKPI?.attitude_score || 0,
                    skill_score: existingKPI?.skill_score || 0,
                    notes: existingKPI?.notes || ''
                })
            })

            await Promise.all(updates)
            await loadData()
            setShowSuccessAlert(true)
        } catch (error) {
            console.error('Failed to recalculate attendance:', error)
            alert('Gagal menghitung ulang kehadiran')
        } finally {
            setRecalculating(false)
        }
    }

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A+': return 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300'
            case 'A': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200'
            case 'B+': return 'text-blue-700 bg-blue-100 dark:bg-blue-900/40 border-blue-300'
            case 'B': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200'
            case 'C+': return 'text-amber-700 bg-amber-100 dark:bg-amber-900/40 border-amber-300'
            case 'C': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200'
            case 'D+': return 'text-orange-700 bg-orange-100 dark:bg-orange-900/40 border-orange-300'
            case 'D': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200'
            default: return 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200'
        }
    }

    const filteredData = useMemo(() => {
        return members
            .filter(m => m.status === 'active')
            .map(member => {
                const kpi = kpis.find(k => k.member_id === member.id)
                return {
                    ...member,
                    kpi
                }
            })
            .filter(item =>
                item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.division.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => (b.kpi?.final_score || 0) - (a.kpi?.final_score || 0))
    }, [members, kpis, searchQuery])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">KPI Anggota</h1>
                    <p className="text-slate-500 dark:text-slate-400">Evaluasi kinerja anggota periode {period}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        <FileSpreadsheet size={18} />
                        Import Excel
                    </button>
                    <button
                        onClick={handleRecalculateAttendance}
                        disabled={recalculating}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={recalculating ? 'animate-spin' : ''} />
                        {recalculating ? 'Menghitung...' : 'Hitung Kehadiran'}
                    </button>
                    <button
                        onClick={async () => {
                            if (!confirm('Perbarui semua grade KPI ke skala baru (A+, A, B+, dst)? Skor tidak akan berubah.')) return
                            setRecalculating(true)
                            try {
                                const allKpis = await kpiAPI.getByPeriod(period)
                                await Promise.all(allKpis.map(k => kpiAPI.upsert({
                                    id: k.id,
                                    member_id: k.member_id,
                                    period: k.period,
                                    attendance_score: k.attendance_score,
                                    project_score: k.project_score,
                                    attitude_score: k.attitude_score,
                                    skill_score: k.skill_score,
                                    notes: k.notes
                                })))
                                await loadData()
                                alert('Grade berhasil diperbarui!')
                            } catch (e) {
                                console.error(e)
                                alert('Gagal memperbarui grade')
                            } finally {
                                setRecalculating(false)
                            }
                        }}
                        disabled={recalculating}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
                        title="Perbarui Grade ke Skala Baru"
                    >
                        <RefreshCw size={18} className={recalculating ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Anggota Aktif</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{filteredData.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Rata-rata Nilai</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {filteredData.length > 0
                                ? (filteredData.reduce((acc, curr) => acc + (curr.kpi?.final_score || 0), 0) / filteredData.length).toFixed(1)
                                : '0.0'
                            }
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex items-center gap-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Performa Terbaik</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {filteredData[0]?.full_name.split(' ')[0] || '-'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-[#2A2A2A] flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari anggota..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg bg-slate-50 dark:bg-[#1A1A1A] focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-[#232323] border-b border-slate-200 dark:border-[#2A2A2A]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Anggota</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Kehadiran (15%)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Proyek (40%)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Sikap (30%)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Skill (15%)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Nilai Akhir</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Grade</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                        Memuat data KPI...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                        Tidak ada data anggota.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#2A2A2A] flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold overflow-hidden">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.full_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        item.full_name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white text-sm">{item.full_name}</p>
                                                    <p className="text-[10px] text-slate-500">{item.division}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                {item.kpi?.attendance_score || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                {item.kpi?.project_score || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                {item.kpi?.attitude_score || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                {item.kpi?.skill_score || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {item.kpi?.final_score?.toFixed(1) || '0.0'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getGradeColor(item.kpi?.grade || 'E')}`}>
                                                {item.kpi?.grade || 'E'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedMember(item)
                                                    setShowAssessmentModal(true)
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Nilai Manual"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAssessmentModal && selectedMember && (
                <KPIAssessmentModal
                    member={selectedMember}
                    period={period}
                    existingKPI={kpis.find(k => k.member_id === selectedMember.id)}
                    onClose={() => {
                        setShowAssessmentModal(false)
                        setSelectedMember(null)
                    }}
                    onSave={loadData}
                />
            )}

            {showImportModal && (
                <KPIImportModal
                    members={members}
                    kpis={kpis}
                    period={period}
                    onClose={() => setShowImportModal(false)}
                    onSave={loadData}
                />
            )}

            <ConfirmationModal
                isOpen={showRecalculateConfirm}
                onClose={() => setShowRecalculateConfirm(false)}
                onConfirm={executeRecalculation}
                title="Hitung Ulang Kehadiran"
                message="Hitung ulang nilai kehadiran untuk semua anggota? Ini akan menimpa nilai kehadiran yang ada."
                confirmText="Ya, Hitung Ulang"
                type="warning"
            />

            <ConfirmationModal
                isOpen={showSuccessAlert}
                onClose={() => setShowSuccessAlert(false)}
                onConfirm={() => setShowSuccessAlert(false)}
                title="Berhasil"
                message="Nilai kehadiran berhasil diperbarui!"
                confirmText="OK"
                type="info"
                showCancel={false}
            />
        </div>
    )
}

export default KPIPage
