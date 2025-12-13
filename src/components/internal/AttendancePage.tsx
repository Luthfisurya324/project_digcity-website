import React, { useEffect, useMemo, useState } from 'react'
import { attendanceAPI, InternalEvent, Attendance, membersAPI, type OrganizationMember, orgAPI, type OrganizationDivision } from '../../lib/supabase'
import { getInternalBasePath } from '../../utils/domainDetection'
import EventForm from './EventForm'
import AttendanceDetail from './AttendanceDetail'
import EventQRModal from './EventQRModal'
import EventCalendar from './EventCalendar'
import QRScannerModal from './QRScannerModal'
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Plus,
  LayoutGrid,
  Calendar as CalendarIcon,
  Users,
  CalendarPlus,
  TrendingUp,
  Medal,
  Filter,
  Trash2
} from 'lucide-react'
import { Link } from 'react-router-dom'

type ActivityStats = {
  totalRecords: number
  uniqueMembers: number
  statusCounts: Record<'present' | 'late' | 'excused' | 'absent', number>
  memberLeaderboard: { name: string; count: number }[]
  trend: { label: string; value: number }[]
}

const defaultStats: ActivityStats = {
  totalRecords: 0,
  uniqueMembers: 0,
  statusCounts: { present: 0, late: 0, excused: 0, absent: 0 },
  memberLeaderboard: [],
  trend: []
}

const statusOrder: Array<keyof ActivityStats['statusCounts']> = ['present', 'late', 'excused', 'absent']
const statusLabels: Record<keyof ActivityStats['statusCounts'], string> = {
  present: 'Hadir',
  late: 'Terlambat',
  excused: 'Izin',
  absent: 'Tidak Hadir'
}
const statusColors: Record<keyof ActivityStats['statusCounts'], string> = {
  present: 'bg-emerald-500',
  late: 'bg-amber-500',
  excused: 'bg-sky-500',
  absent: 'bg-rose-500'
}



interface AttendancePageProps {
  userRole?: string
  userDivision?: string
}

const AttendancePage: React.FC<AttendancePageProps> = ({ userRole = 'anggota', userDivision = '' }) => {
  // const { userRole, userDivision } = useOutletContext<{ userRole: string, userDivision: string }>()
  const canManageFull = userRole === 'bph'
  const [events, setEvents] = useState<InternalEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<InternalEvent | null>(null)
  const [qrEvent, setQrEvent] = useState<InternalEvent | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid')
  const [calendarMode, setCalendarMode] = useState<'month' | 'week'>('month')
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedDayEvents, setSelectedDayEvents] = useState<InternalEvent[]>([])
  const [activityStats, setActivityStats] = useState<ActivityStats>(defaultStats)
  const [loadingStats, setLoadingStats] = useState(true)
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [divisionFilter, setDivisionFilter] = useState<string>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'meeting' | 'work_program' | 'gathering' | 'other'>('all')
  const [monthFilter, setMonthFilter] = useState<string>('')
  const [divisionOptions, setDivisionOptions] = useState<OrganizationDivision[]>([])
  const [visibleCount, setVisibleCount] = useState(9)

  useEffect(() => {
    loadEvents()
    loadAttendanceStats()
    loadMembers()
    const loadDivisions = async () => {
      try {
        const list = await orgAPI.getStructure(null)
        setDivisionOptions(list)
      } catch { }
    }
    loadDivisions()
  }, [])

  useEffect(() => {
    filterEventsByDate(calendarDate)
  }, [calendarDate, events])

  const loadEvents = async () => {
    setLoadingEvents(true)
    try {
      const data = await attendanceAPI.getEvents()
      setEvents(data)
      filterEventsByDate(calendarDate, data)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoadingEvents(false)
    }
  }

  const handleDeleteEvent = async (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus agenda "${title}"?`)) {
      try {
        await attendanceAPI.deleteEvent(id)
        loadEvents()
        // Also refresh stats if needed, but loadEvents is crucial
      } catch (error) {
        console.error('Failed to delete event:', error)
        alert('Gagal menghapus agenda.')
      }
    }
  }

  const loadAttendanceStats = async () => {
    try {
      const [records, allMembers] = await Promise.all([
        attendanceAPI.getRecentAttendance(365),
        membersAPI.getAll()
      ])

      setAttendanceRecords(records)

      const activeMemberIds = new Set(
        allMembers
          .filter(m => m.status === 'active')
          .map(m => m.id)
      )

      const statusCounts: ActivityStats['statusCounts'] = { present: 0, late: 0, excused: 0, absent: 0 }
      const memberMap = new Map<string, { name: string; count: number }>()

      // Initialize last 7 days map
      const trendMap = new Map<string, number>()
      const today = new Date()
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const label = d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
        trendMap.set(label, 0)
      }

      records.forEach((record: Attendance) => {
        statusCounts[record.status] = statusCounts[record.status] + 1

        // Only count for leaderboard if present or late
        if (record.status === 'present' || record.status === 'late') {
          // Check if member is active (if we have their ID)
          if (record.member_id && !activeMemberIds.has(record.member_id)) {
            return
          }

          const key = record.member_id || record.name
          const entry = memberMap.get(key) || { name: record.name, count: 0 }
          entry.count += 1
          memberMap.set(key, entry)
        }

        const recordDate = new Date(record.check_in_time)
        const label = recordDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })

        // Only count if it falls within our 7-day window
        if (trendMap.has(label)) {
          trendMap.set(label, (trendMap.get(label) || 0) + 1)
        }
      })

      const trend = Array.from(trendMap.entries())
        .map(([label, value]) => ({ label, value }))

      const memberLeaderboard = Array.from(memberMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setActivityStats({
        totalRecords: records.length,
        uniqueMembers: memberMap.size,
        statusCounts,
        memberLeaderboard,
        trend
      })
    } catch (error) {
      console.error('Failed to load attendance statistics:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const loadMembers = async () => {
    try {
      const data = await membersAPI.getAll()
      setMembers(data)
    } catch (error) {
      console.error('Failed to load members:', error)
    }
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  const filterEventsByDate = (date: Date, source: InternalEvent[] = events) => {
    const items = source.filter((event) => isSameDay(new Date(event.date), date))
    setSelectedDayEvents(items)
  }


  const attendanceRate = useMemo(() => {
    const total = activityStats.totalRecords
    const attended = activityStats.statusCounts.present + activityStats.statusCounts.late
    return total ? Math.round((attended / total) * 100) : 0
  }, [activityStats])

  const filteredEvents = useMemo(() => {
    setVisibleCount(9) // Reset pagination when filters change
    return events.filter((ev) => {
      const matchesDivision = divisionFilter === 'all' || ev.division_id === divisionFilter
      const matchesType = eventTypeFilter === 'all' || ev.type === eventTypeFilter
      const matchesMonth = monthFilter === '' || (() => {
        const d = new Date(ev.date)
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        return ym === monthFilter
      })()
      return matchesDivision && matchesType && matchesMonth
    })
  }, [events, divisionFilter, eventTypeFilter, monthFilter])

  const attendanceByEvent = useMemo(() => {
    const map = new Map<string, Attendance[]>()
    attendanceRecords.forEach((r) => {
      const arr = map.get(r.event_id) || []
      arr.push(r)
      map.set(r.event_id, arr)
    })
    return map
  }, [attendanceRecords])

  const divisionMembers = useMemo(() => {
    return divisionFilter === 'all' ? members : members.filter((m) => {
      // Find division name for this filter ID
      const div = divisionOptions.find(d => d.id === divisionFilter)
      // Fallback to name match if needed, but member.division stores acronym usually
      // Actually member.division stores acronym (POD, PR). 
      // divisionOptions has name "People Organizing...".
      // We need to map ID -> Acronym or Name.
      // Let's assume for now we filter members by division name matching the acronym?
      // Wait, organization_members has 'division' column with acronyms (POD, PR).
      // organization_structure has 'name' with full names.
      // We need a way to map.
      // For now, let's keep member filtering simple or fix it.
      // If divisionFilter is ID, we need to know which acronym it corresponds to.
      if (!div) return false
      return div.name.includes(m.division) || div.name === m.division // Loose match
    })
  }, [members, divisionFilter, divisionOptions])

  const divisionEventsForMonth = useMemo(() => {
    return filteredEvents.filter((e) => eventTypeFilter === 'all' ? true : e.type === eventTypeFilter)
  }, [filteredEvents, eventTypeFilter])

  const divisionPerformance = useMemo(() => {
    const totalEvents = divisionEventsForMonth.length
    if (totalEvents === 0) return [] as { name: string; count: number; rate: number }[]

    if (divisionFilter === 'all') {
      // Aggregate by division
      const divisions = Array.from(new Set(members.map((m) => m.division))).filter(Boolean)
      return divisions.map((divName) => {
        const divMembers = members.filter((m) => m.division === divName)
        if (divMembers.length === 0) return { name: divName, count: 0, rate: 0 }

        let totalAttended = 0
        const totalPossible = divMembers.length * totalEvents

        divMembers.forEach((member) => {
          const attended = divisionEventsForMonth.reduce((acc, ev) => {
            const list = attendanceByEvent.get(ev.id) || []
            const hit = list.some((r) => (member.id ? r.member_id === member.id : false) || r.name === member.full_name)
            return acc + (hit ? 1 : 0)
          }, 0)
          totalAttended += attended
        })

        const rate = totalPossible > 0 ? Math.round((totalAttended / totalPossible) * 100) : 0
        return { name: divName, count: totalAttended, rate }
      }).sort((a, b) => b.rate - a.rate)
    }

    return divisionMembers.map((member) => {
      const attended = divisionEventsForMonth.reduce((acc, ev) => {
        const list = attendanceByEvent.get(ev.id) || []
        const hit = list.some((r) => (member.id ? r.member_id === member.id : false) || r.name === member.full_name)
        return acc + (hit ? 1 : 0)
      }, 0)
      const rate = Math.round((attended / totalEvents) * 100)
      return { name: member.full_name, count: attended, rate }
    }).sort((a, b) => a.rate - b.rate)
  }, [divisionMembers, divisionEventsForMonth, attendanceByEvent, divisionFilter, members])

  const committeeEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.type === 'work_program')
  }, [filteredEvents])

  const committeePerformance = useMemo(() => {
    const totalEvents = committeeEvents.length
    if (totalEvents === 0) return [] as { name: string; count: number; rate: number }[]
    const counts = new Map<string, { name: string; count: number }>()
    committeeEvents.forEach((ev) => {
      const list = attendanceByEvent.get(ev.id) || []
      list.forEach((r) => {
        const key = r.member_id || r.name
        const cur = counts.get(key) || { name: r.name, count: 0 }
        cur.count += 1
        counts.set(key, cur)
      })
    })
    return Array.from(counts.values()).map((v) => ({ name: v.name, count: v.count, rate: Math.round((v.count / totalEvents) * 100) })).sort((a, b) => b.rate - a.rate)
  }, [committeeEvents, attendanceByEvent])

  const formatGoogleCalendarDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const handleAddToGoogleCalendar = (event: InternalEvent) => {
    const start = new Date(event.date)
    const end = event.end_date ? new Date(event.end_date) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}&details=${encodeURIComponent(
      event.description || 'Agenda internal DIGCITY'
    )}&location=${encodeURIComponent(event.location)}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div id="attendance-header">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agenda & Presensi</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola jadwal kegiatan, QR dinamis, dan laporan presensi</p>
        </div>
        <div id="attendance-actions" className="flex flex-wrap gap-2">
          <div className="flex bg-slate-100 dark:bg-[#2A2A2A] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#1E1E1E] shadow-sm text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-[#1E1E1E] shadow-sm text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <CalendarIcon size={18} />
            </button>
          </div>
          <button
            id="attendance-scanner-btn"
            onClick={() => setShowScanner(true)}
            className="px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] transition-colors shadow-sm"
          >
            <QrCode size={18} />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
          <button
            id="attendance-create-btn"
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Plus size={18} />
            <span>Buat Agenda</span>
          </button>
        </div>
      </div>
      {(loadingEvents || loadingStats) ? (
        <div id="attendance-stats" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#232323]"></div>
              <div className="flex-1">
                <div className="h-3 w-24 bg-slate-100 dark:bg-[#232323] rounded mb-2"></div>
                <div className="h-5 w-16 bg-slate-200 dark:bg-[#2A2A2A] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Agenda</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{filteredEvents.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Akan Datang</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{filteredEvents.filter((e) => new Date(e.date) > new Date()).length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tingkat Kehadiran</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      )}

      <div id="attendance-filters" className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] flex flex-wrap items-center gap-3">
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white">
            <option value="all">Semua Divisi</option>
            {divisionOptions.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
          </select>
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value as 'all' | 'meeting' | 'work_program' | 'gathering' | 'other')} className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white">
            <option value="all">Semua Tipe</option>
            <option value="meeting">Rapat</option>
            <option value="work_program">Panitia/Program Kerja</option>
            <option value="gathering">Gathering</option>
            <option value="other">Lainnya</option>
          </select>
        </div>
        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div id="attendance-content" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loadingEvents ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-100 dark:bg-[#232323] rounded"></div>
                    <div className="h-5 w-48 bg-slate-200 dark:bg-[#2A2A2A] rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-slate-100 dark:bg-[#232323] rounded-lg"></div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-3 w-full bg-slate-100 dark:bg-[#232323] rounded"></div>
                  <div className="h-3 w-2/3 bg-slate-100 dark:bg-[#232323] rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-100 dark:bg-[#232323] rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-full bg-slate-100 dark:bg-[#232323] rounded-lg"></div>
                  <div className="h-9 w-full bg-slate-100 dark:bg-[#232323] rounded-lg"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {filteredEvents.slice(0, visibleCount).map((event) => (
                <div key={event.id} className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${event.type === 'meeting'
                            ? 'bg-blue-100 text-blue-700'
                            : event.type === 'work_program'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                            }`}
                        >
                          {event.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500">{event.division}</span>
                      </div>
                      <h3 className="text-lg font-bold mt-2 text-slate-900 dark:text-white line-clamp-1">{event.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      {canManageFull && (
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-colors"
                          title="Hapus Agenda"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => setQrEvent(event)}
                        className="p-2 bg-slate-50 dark:bg-[#2A2A2A] text-slate-600 dark:text-slate-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="QR Presensi Dinamis"
                      >
                        <QrCode size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="shrink-0" />
                      <span>{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="shrink-0" />
                      <span>
                        {new Date(event.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="w-full py-2.5 bg-slate-50 dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Users size={16} />
                      Detail Presensi
                    </button>
                    <button
                      onClick={() => handleAddToGoogleCalendar(event)}
                      className="w-full py-2.5 border border-slate-200 dark:border-[#2A2A2A] rounded-lg text-sm font-medium flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:border-blue-400"
                    >
                      <CalendarPlus size={16} />
                      Tambah ke Google Calendar
                    </button>
                  </div>
                </div>
              ))}
              {visibleCount < filteredEvents.length && (
                <div className="col-span-full flex justify-center mt-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 9)}
                    className="px-6 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] transition-colors shadow-sm"
                  >
                    Muat Lebih Banyak
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Tampilan kalender {calendarMode === 'month' ? 'bulanan' : 'mingguan'}</p>
              <div className="flex bg-slate-100 dark:bg-[#2A2A2A] rounded-lg p-1">
                <button
                  onClick={() => setCalendarMode('month')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md ${calendarMode === 'month' ? 'bg-white dark:bg-[#1E1E1E] shadow text-blue-600' : 'text-slate-500'
                    }`}
                >
                  Bulanan
                </button>
                <button
                  onClick={() => setCalendarMode('week')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md ${calendarMode === 'week' ? 'bg-white dark:bg-[#1E1E1E] shadow text-blue-600' : 'text-slate-500'
                    }`}
                >
                  Mingguan
                </button>
              </div>
            </div>
            {loadingEvents ? (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6 animate-pulse h-[420px]">
                <div className="h-6 w-40 bg-slate-100 dark:bg-[#232323] rounded mb-4"></div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 dark:bg-[#232323] rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <EventCalendar
                events={events}
                mode={calendarMode}
                activeDate={calendarDate}
                onActiveDateChange={setCalendarDate}
                onSelectDay={(date) => setCalendarDate(date)}
                onSelectEvent={setSelectedEvent}
              />
            )}
          </div>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Agenda tanggal</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {calendarDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
            </div>
            {loadingEvents ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-[#2A2A2A]">
                    <div className="h-4 w-40 bg-slate-100 dark:bg-[#232323] rounded mb-3"></div>
                    <div className="h-3 w-24 bg-slate-100 dark:bg-[#232323] rounded mb-2"></div>
                    <div className="h-3 w-20 bg-slate-100 dark:bg-[#232323] rounded"></div>
                  </div>
                ))}
              </div>
            ) : selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-xl border border-slate-100 dark:border-[#2A2A2A]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 text-xs font-semibold"
                          onClick={() => setSelectedEvent(event)}
                        >
                          Lihat
                        </button>
                        {canManageFull && (
                          <button
                            className="text-rose-600 text-xs font-semibold"
                            onClick={() => handleDeleteEvent(event.id, event.title)}
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{event.division}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={12} />
                      {new Date(event.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 text-sm py-10">
                Belum ada agenda pada tanggal ini.
              </div>
            )}
          </div>
        </div>
      )}

      <div id="attendance-performance-stats" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Kinerja divisi</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{divisionFilter === 'all' ? 'Semua Divisi' : divisionFilter}</h3>
            </div>
          </div>
          {divisionPerformance.length > 0 ? (
            <div className="space-y-2">
              {divisionPerformance.map((row) => (
                <div key={row.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#232323]">
                  <span className="text-sm font-medium">{row.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{row.count} hadir</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${row.rate >= 75 ? 'bg-emerald-100 text-emerald-700' : row.rate >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{row.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">Tidak ada data divisi untuk filter saat ini.</p>
          )}
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Kinerja panitia</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Program Kerja</h3>
            </div>
          </div>
          {committeePerformance.length > 0 ? (
            <div className="space-y-2">
              {committeePerformance.map((row) => (
                <div key={row.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#232323]">
                  <span className="text-sm font-medium">{row.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{row.count} hadir</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${row.rate >= 75 ? 'bg-emerald-100 text-emerald-700' : row.rate >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{row.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">Tidak ada data panitia untuk filter saat ini.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Statistik keaktifan</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">60 Hari Terakhir</h3>
            </div>
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          {loadingStats ? (
            <div className="text-center py-8 text-slate-400 text-sm">Memuat statistik...</div>
          ) : (
            <div className="space-y-4">
              {statusOrder.map((key) => {
                const value = activityStats.statusCounts[key]
                const percentage = activityStats.totalRecords ? (value / activityStats.totalRecords) * 100 : 0
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{statusLabels[key]}</span>
                      <span>{value} peserta</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-[#2A2A2A] overflow-hidden">
                      <div className={`h-full rounded-full ${statusColors[key]}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Tren presensi</p>
                <div className="flex items-end gap-2 h-24">
                  {activityStats.trend.length > 0 ? (
                    activityStats.trend.map((point) => {
                      const max = Math.max(...activityStats.trend.map((p) => p.value), 1)
                      return (
                        <div key={point.label} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-6 bg-blue-500 rounded-full"
                            style={{ height: `${(point.value / max) * 100}%` }}
                            title={`${point.label}: ${point.value}`}
                          ></div>
                          <span className="text-[10px] text-slate-400">{point.label}</span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-xs text-slate-400">Belum ada data presensi terbaru.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Leaderboard anggota</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kehadiran Terbanyak</h3>
            </div>
            <div className="flex items-center gap-3">
              <Link to={`${getInternalBasePath()}/attendance/leaderboard`} className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Lihat Semua
              </Link>
              <Medal size={20} className="text-amber-500" />
            </div>
          </div>
          {activityStats.memberLeaderboard.length > 0 ? (
            <div className="space-y-3">
              {activityStats.memberLeaderboard.map((member, index) => (
                <div key={member.name + index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#232323]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.count} kehadiran</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada data aktivitas anggota.</p>
          )}
        </div>
      </div>

      {showForm && <EventForm onClose={() => setShowForm(false)} onSuccess={loadEvents} userRole={userRole} userDivision={userDivision} />}

      {selectedEvent && (
        <AttendanceDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {qrEvent && (
        <EventQRModal
          event={qrEvent}
          onClose={() => setQrEvent(null)}
        />
      )}

      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}

export default AttendancePage
