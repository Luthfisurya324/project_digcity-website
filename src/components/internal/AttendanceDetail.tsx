import React, { useEffect, useMemo, useState } from 'react'
import { attendanceAPI, Attendance, InternalEvent } from '../../lib/supabase'
import { X, UserCheck, Clock, Download, FileText, UserPlus, Filter } from 'lucide-react'
import ManualAttendanceForm from './ManualAttendanceForm'

interface AttendanceDetailProps {
  event: InternalEvent
  onClose: () => void
}

const AttendanceDetail: React.FC<AttendanceDetailProps> = ({ event, onClose }) => {
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | Attendance['status']>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showManualForm, setShowManualForm] = useState(false)

  useEffect(() => {
    loadAttendance()
  }, [event.id])

  const loadAttendance = async () => {
    try {
      const data = await attendanceAPI.getEventAttendance(event.id)
      setAttendanceList(data)
    } catch (error) {
      console.error('Error loading attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusSummary = useMemo(() => {
    return attendanceList.reduce(
      (acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1
        return acc
      },
      { present: 0, late: 0, excused: 0, absent: 0 } as Record<Attendance['status'], number>
    )
  }, [attendanceList])

  const filteredList = useMemo(() => {
    return attendanceList.filter((record) => {
      const matchesStatus = filterStatus === 'all' ? true : record.status === filterStatus
      const query = searchTerm.toLowerCase()
      const matchesQuery = record.name.toLowerCase().includes(query) || record.npm.toLowerCase().includes(query)
      return matchesStatus && matchesQuery
    })
  }, [attendanceList, filterStatus, searchTerm])

  const exportCsv = () => {
    const header = 'Nama,NPM,Status,Waktu,Catatan\n'
    const rows = attendanceList
      .map((record) => {
        const time = new Date(record.check_in_time).toLocaleString('id-ID')
        return `"${record.name}","${record.npm}","${record.status}","${time}","${record.notes || ''}"`
      })
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `attendance-${event.title}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportLpj = () => {
    const total = attendanceList.length
    const hadir = statusSummary.present + statusSummary.late
    const content = [
      `LAPORAN PRESENSI - ${event.title}`,
      `Tanggal : ${new Date(event.date).toLocaleString('id-ID')}`,
      `Lokasi  : ${event.location}`,
      `Divisi  : ${event.division}`,
      '',
      `Total Peserta     : ${total}`,
      `Hadir/Terlambat   : ${hadir}`,
      `Izin              : ${statusSummary.excused}`,
      `Tidak Hadir       : ${statusSummary.absent}`,
      '',
      'Rincian Peserta:',
      ...attendanceList.map(
        (record, index) =>
          `${index + 1}. ${record.name} (${record.npm}) - ${record.status.toUpperCase()} - ${new Date(
            record.check_in_time
          ).toLocaleTimeString('id-ID')}`
      )
    ].join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `LPJ-${event.title.replace(/\s+/g, '-')}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const attendanceRate = attendanceList.length
    ? Math.round(((statusSummary.present + statusSummary.late) / attendanceList.length) * 100)
    : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Laporan Presensi</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{event.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(event.date).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} • {event.location}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-4 space-y-4 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Hadir', value: statusSummary.present, color: 'bg-emerald-100 text-emerald-700' },
              { label: 'Terlambat', value: statusSummary.late, color: 'bg-amber-100 text-amber-700' },
              { label: 'Izin', value: statusSummary.excused, color: 'bg-sky-100 text-sky-700' },
              { label: 'Tidak Hadir', value: statusSummary.absent, color: 'bg-rose-100 text-rose-700' }
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#232323] border border-slate-100 dark:border-transparent">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className={`text-xl font-bold ${item.color.split(' ')[1]}`}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Filter size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-slate-700 dark:text-slate-200 text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="present">Hadir</option>
                <option value="late">Terlambat</option>
                <option value="excused">Izin</option>
                <option value="absent">Tidak Hadir</option>
              </select>
              <input
                type="text"
                placeholder="Cari nama / NPM"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowManualForm(true)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#232323] text-slate-600 dark:text-slate-200 text-sm font-medium flex items-center gap-2"
              >
                <UserPlus size={16} />
                Presensi Manual
              </button>
              <button onClick={exportCsv} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium flex items-center gap-2">
                <Download size={16} /> Export CSV
              </button>
              <button onClick={exportLpj} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium flex items-center gap-2">
                <FileText size={16} /> LPJ
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-slate-500">Memuat data...</p>
            </div>
          ) : filteredList.length > 0 ? (
            <div className="space-y-2">
              {filteredList.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#232323] rounded-xl border border-slate-100 dark:border-transparent">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                      {record.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{record.name}</p>
                      <p className="text-xs text-slate-500 font-mono truncate">{record.npm}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        record.status === 'present'
                          ? 'bg-emerald-100 text-emerald-700'
                          : record.status === 'late'
                          ? 'bg-amber-100 text-amber-700'
                          : record.status === 'excused'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {record.status === 'present'
                        ? 'Hadir'
                        : record.status === 'late'
                        ? 'Terlambat'
                        : record.status === 'excused'
                        ? 'Izin'
                        : 'Tidak Hadir'}
                    </span>
                    <div className="text-right text-xs text-slate-500">
                      <p className="flex items-center gap-1 justify-end">
                        <Clock size={12} />
                        {new Date(record.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {record.notes && <p className="text-[10px] text-slate-400 mt-1">{record.notes}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck size={24} />
              </div>
              <p>Belum ada data presensi dengan filter saat ini.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-500">
          <span>Total Peserta: {attendanceList.length} • Tingkat Kehadiran: {attendanceRate}%</span>
          <span>Diperbarui: {new Date().toLocaleString('id-ID')}</span>
        </div>
      </div>

      {showManualForm && (
        <ManualAttendanceForm
          eventId={event.id}
          onClose={() => setShowManualForm(false)}
          onSuccess={loadAttendance}
        />
      )}
    </div>
  )
}

export default AttendanceDetail
