import React, { useEffect, useMemo, useState } from 'react'
import { attendanceAPI, membersAPI, type OrganizationMember, type Attendance, orgAPI, type OrganizationDivision } from '../../lib/supabase'
import { ArrowLeft, Filter, Medal, Search, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const LeaderboardPage: React.FC = () => {
    const [members, setMembers] = useState<OrganizationMember[]>([])
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
    const [loading, setLoading] = useState(true)
    const [divisionFilter, setDivisionFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [divisionOptions, setDivisionOptions] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const [membersData, recordsData, divisionsData] = await Promise.all([
                    membersAPI.getAll(),
                    attendanceAPI.getRecentAttendance(365), // Last 1 year
                    orgAPI.getStructure(null)
                ])
                setMembers(membersData)
                setAttendanceRecords(recordsData)
                setDivisionOptions(divisionsData.map((d: OrganizationDivision) => d.name))
            } catch (error) {
                console.error('Failed to load leaderboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const leaderboardData = useMemo(() => {
        const memberStats = new Map<string, { count: number; lastActive: string }>()

        // Initialize with 0 for all members
        members.forEach(m => {
            memberStats.set(m.id, { count: 0, lastActive: '' })
        })

        // Count attendance
        attendanceRecords.forEach(r => {
            // Try to match by ID first, then name
            let memberId = r.member_id
            if (!memberId) {
                const member = members.find(m => m.full_name === r.name)
                if (member) memberId = member.id
            }

            if (memberId && memberStats.has(memberId)) {
                const stats = memberStats.get(memberId)!
                if (r.status === 'present' || r.status === 'late') {
                    stats.count += 1
                }
                if (!stats.lastActive || new Date(r.check_in_time) > new Date(stats.lastActive)) {
                    stats.lastActive = r.check_in_time
                }
                memberStats.set(memberId, stats)
            }
        })

        return members
            .map(m => ({
                ...m,
                attendanceCount: memberStats.get(m.id)?.count || 0,
                lastActive: memberStats.get(m.id)?.lastActive
            }))
            .filter(m => {
                const matchesDivision = divisionFilter === 'all' || m.division === divisionFilter
                const matchesSearch = m.full_name.toLowerCase().includes(searchQuery.toLowerCase())
                const isActive = m.status === 'active'
                return matchesDivision && matchesSearch && isActive
            })
            .sort((a, b) => b.attendanceCount - a.attendanceCount)
    }, [members, attendanceRecords, divisionFilter, searchQuery])

    const totalPages = Math.ceil(leaderboardData.length / itemsPerPage)
    const paginatedData = leaderboardData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [divisionFilter, searchQuery])

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/internal/attendance" className="p-2 hover:bg-slate-100 dark:hover:bg-[#1E1E1E] rounded-lg transition-colors">
                    <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leaderboard Anggota</h1>
                    <p className="text-slate-500 dark:text-slate-400">Peringkat keaktifan anggota berdasarkan presensi</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari anggota..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        value={divisionFilter}
                        onChange={(e) => setDivisionFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
                    >
                        <option value="all">Semua Divisi</option>
                        {divisionOptions.map((d) => (<option key={d} value={d}>{d}</option>))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A]"></div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-[#232323] border-b border-slate-200 dark:border-[#2A2A2A]">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">#</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Anggota</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Divisi</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Total Kehadiran</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Terakhir Aktif</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                                {paginatedData.map((member, index) => {
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index
                                    return (
                                        <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors">
                                            <td className="px-6 py-3 text-center">
                                                {globalIndex < 3 ? (
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${globalIndex === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                        globalIndex === 1 ? 'bg-slate-100 text-slate-600' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {globalIndex === 0 ? <Trophy size={16} /> : <Medal size={16} />}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-500 font-medium">{globalIndex + 1}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#2A2A2A] flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold overflow-hidden">
                                                        {member.image_url ? (
                                                            <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            member.full_name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white text-sm">{member.full_name}</p>
                                                        <p className="text-[10px] text-slate-500">{member.npm}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-medium">
                                                    {member.division}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className="font-bold text-slate-900 dark:text-white text-base">{member.attendanceCount}</span>
                                            </td>
                                            <td className="px-6 py-3 text-xs text-slate-500">
                                                {member.lastActive ? new Date(member.lastActive).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                            </td>
                                        </tr>
                                    )
                                })}
                                {leaderboardData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Tidak ada data anggota yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#2A2A2A] flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, leaderboardData.length)} dari {leaderboardData.length} anggota
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default LeaderboardPage
