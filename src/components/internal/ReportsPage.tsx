import React, { useEffect, useMemo, useState } from 'react'
import { financeAPI, attendanceAPI, documentsAPI, type FinanceTransaction, type Attendance, type Document, auditAPI } from '../../lib/supabase'
import { Search, Filter, Calendar, BarChart3, FileText, ArrowUpRight, ArrowDownRight, Download, Printer } from 'lucide-react'
import { useNotifications } from '../common/NotificationCenter'

type DateRange = { start: string; end: string }

const currency = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const ReportsPage: React.FC = () => {
  const { notify } = useNotifications()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
  const [records, setRecords] = useState<Attendance[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [range, setRange] = useState<DateRange>({ start: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0,10), end: new Date().toISOString().slice(0,10) })
  const [category, setCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [tx, rc, ds] = await Promise.all([
          financeAPI.getAll(),
          attendanceAPI.getRecentAttendance(365),
          documentsAPI.getAll()
        ])
        setTransactions(tx as FinanceTransaction[])
        setRecords(rc as Attendance[])
        setDocs(ds as Document[])
      } catch (e) {
        console.error('Failed to load reports data:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const inRange = (iso: string) => {
    const d = new Date(iso)
    const s = new Date(range.start)
    const e = new Date(range.end)
    return d >= s && d <= e
  }

  const filteredTx = useMemo(() => {
    return transactions.filter((t) => inRange(t.date) && (category === 'all' || t.category === category) && (searchTerm === '' || (t.description || '').toLowerCase().includes(searchTerm.toLowerCase())))
  }, [transactions, range, category, searchTerm])

  const incomeTotal = useMemo(() => filteredTx.filter(t => t.type === 'income').reduce((a,b)=>a+b.amount,0), [filteredTx])
  const expenseTotal = useMemo(() => filteredTx.filter(t => t.type === 'expense').reduce((a,b)=>a+b.amount,0), [filteredTx])
  const balance = useMemo(() => incomeTotal - expenseTotal, [incomeTotal, expenseTotal])

  const byCategory = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>()
    filteredTx.forEach((t) => {
      const cur = map.get(t.category) || { income: 0, expense: 0 }
      if (t.type === 'income') cur.income += t.amount
      else cur.expense += t.amount
      map.set(t.category, cur)
    })
    return Array.from(map.entries()).map(([cat, val]) => ({ category: cat, ...val }))
  }, [filteredTx])

  const filteredAttendance = useMemo(() => records.filter((r) => inRange(r.check_in_time)), [records, range])
  const attendanceSummary = useMemo(() => {
    const total = filteredAttendance.length
    const present = filteredAttendance.filter(r => r.status === 'present').length
    const late = filteredAttendance.filter(r => r.status === 'late').length
    const excused = filteredAttendance.filter(r => r.status === 'excused').length
    const absent = filteredAttendance.filter(r => r.status === 'absent').length
    return { total, present, late, excused, absent }
  }, [filteredAttendance])

  const filteredDocs = useMemo(() => docs.filter((d) => inRange(d.date)), [docs, range])
  const docsSummary = useMemo(() => {
    const incoming = filteredDocs.filter(d => d.type === 'incoming').length
    const outgoing = filteredDocs.filter(d => d.type === 'outgoing').length
    const report = filteredDocs.filter(d => d.type === 'report').length
    const approved = filteredDocs.filter(d => d.status === 'approved').length
    const pending = filteredDocs.filter(d => d.status === 'pending_review').length
    const draft = filteredDocs.filter(d => d.status === 'draft').length
    const archived = filteredDocs.filter(d => d.status === 'archived').length
    return { incoming, outgoing, report, approved, pending, draft, archived }
  }, [filteredDocs])

  const exportCSV = (rows: string[][], filename: string) => {
    const csv = rows.map(r => r.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleExportFinanceCSV = () => {
    const headers = ['Tanggal','Tipe','Kategori','Deskripsi','Nominal']
    const rows = filteredTx.map(t => [t.date, t.type, t.category, t.description || '', t.amount.toString()])
    exportCSV([headers, ...rows], `finance-report-${range.start}_to_${range.end}.csv`)
  }

  const handleExportAttendanceCSV = () => {
    const headers = ['Tanggal','Event','Nama','Status']
    const rows = filteredAttendance.map(r => [r.check_in_time, r.event_id, r.name, r.status])
    exportCSV([headers, ...rows], `attendance-report-${range.start}_to_${range.end}.csv`)
  }

  const handleExportDocumentsCSV = () => {
    const headers = ['Tanggal','Nomor','Judul','Tipe','Status']
    const rows = filteredDocs.map(d => [d.date, d.ticket_number, d.title, d.type, d.status])
    exportCSV([headers, ...rows], `documents-report-${range.start}_to_${range.end}.csv`)
  }

  const handlePrintLPJ = async () => {
    notify({ type: 'info', title: 'Menyiapkan LPJ', message: 'Gunakan dialog cetak untuk simpan PDF' })
    await auditAPI.log({ module: 'documents', action: 'generate_lpj', entity_type: 'lpj', details: { start: range.start, end: range.end, incomeTotal, expenseTotal } })
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laporan & LPJ</h1>
          <p className="text-slate-500 dark:text-slate-400">Ringkasan kas, presensi, dan administrasi dokumen</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" value={range.start} onChange={(e)=>setRange(r=>({ ...r, start: e.target.value }))} className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
          </div>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" value={range.end} onChange={(e)=>setRange(r=>({ ...r, end: e.target.value }))} className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
          </div>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white">
              <option value="all">Semua Kategori</option>
              {Array.from(new Set(transactions.map(t=>t.category))).map((c)=> (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari deskripsi transaksi" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0,1,2].map(i => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] animate-pulse">
              <div className="h-5 w-24 bg-slate-100 dark:bg-[#232323] rounded mb-2"></div>
              <div className="h-6 w-40 bg-slate-200 dark:bg-[#2A2A2A] rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpRight className="text-emerald-600" />
              <span className="text-sm text-slate-500">Total Pemasukan</span>
            </div>
            <p className="text-xl font-bold">{currency(incomeTotal)}</p>
          </div>
          <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownRight className="text-rose-600" />
              <span className="text-sm text-slate-500">Total Pengeluaran</span>
            </div>
            <p className="text-xl font-bold">{currency(expenseTotal)}</p>
          </div>
          <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-blue-600" />
              <span className="text-sm text-slate-500">Saldo Periode</span>
            </div>
            <p className="text-xl font-bold">{currency(balance)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Kas organisasi</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ringkasan Per Kategori</h3>
            </div>
            <button onClick={handleExportFinanceCSV} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#232323] text-slate-700 dark:text-slate-300 flex items-center gap-2"><Download size={16} /> CSV</button>
          </div>
          {loading ? (
            <div className="h-48 animate-pulse bg-slate-100 dark:bg-[#232323] rounded"></div>
          ) : (
            <div className="space-y-3">
              {byCategory.length > 0 ? byCategory.map((row) => {
                const total = row.income + row.expense
                const incPct = total ? (row.income / total) * 100 : 0
                const expPct = total ? (row.expense / total) * 100 : 0
                return (
                  <div key={row.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{row.category}</span>
                      <span className="text-xs text-slate-500">{currency(total)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-[#232323] overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${incPct}%` }}></div>
                      <div className="h-full bg-rose-500" style={{ width: `${expPct}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Pemasukan {currency(row.income)}</span>
                      <span>Pengeluaran {currency(row.expense)}</span>
                    </div>
                  </div>
                )
              }) : (
                <p className="text-sm text-slate-400">Tidak ada transaksi pada periode ini.</p>
              )}
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Presensi</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ringkasan Keaktifan</h3>
            </div>
            <button onClick={handleExportAttendanceCSV} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#232323] text-slate-700 dark:text-slate-300 flex items-center gap-2"><Download size={16} /> CSV</button>
          </div>
          {loading ? (
            <div className="h-40 animate-pulse bg-slate-100 dark:bg-[#232323] rounded"></div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>Hadir</span><span>{attendanceSummary.present}</span></div>
              <div className="flex justify-between text-sm"><span>Terlambat</span><span>{attendanceSummary.late}</span></div>
              <div className="flex justify-between text-sm"><span>Izin</span><span>{attendanceSummary.excused}</span></div>
              <div className="flex justify-between text-sm"><span>Tidak Hadir</span><span>{attendanceSummary.absent}</span></div>
              <div className="flex justify-between text-sm font-semibold"><span>Total</span><span>{attendanceSummary.total}</span></div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Administrasi</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rekap Dokumen</h3>
          </div>
          <button onClick={handleExportDocumentsCSV} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#232323] text-slate-700 dark:text-slate-300 flex items-center gap-2"><Download size={16} /> CSV</button>
        </div>
        {loading ? (
          <div className="h-40 animate-pulse bg-slate-100 dark:bg-[#232323] rounded"></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#232323]"><div className="text-xs text-slate-500 mb-1">Surat Masuk</div><div className="text-lg font-bold">{docsSummary.incoming}</div></div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#232323]"><div className="text-xs text-slate-500 mb-1">Surat Keluar</div><div className="text-lg font-bold">{docsSummary.outgoing}</div></div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#232323]"><div className="text-xs text-slate-500 mb-1">LPJ</div><div className="text-lg font-bold">{docsSummary.report}</div></div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#232323]"><div className="text-xs text-slate-500 mb-1">Approved</div><div className="text-lg font-bold">{docsSummary.approved}</div></div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#232323]"><div className="text-xs text-slate-500 mb-1">Pending</div><div className="text-lg font-bold">{docsSummary.pending}</div></div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#232323]"><div className="text-xs text-slate-500 mb-1">Draft</div><div className="text-lg font-bold">{docsSummary.draft}</div></div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#232323]"><div className="text-xs text-slate-500 mb-1">Archived</div><div className="text-lg font-bold">{docsSummary.archived}</div></div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={handlePrintLPJ} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"><Printer size={18} /> Cetak LPJ (PDF)</button>
        <button onClick={() => { handleExportFinanceCSV(); handleExportAttendanceCSV(); handleExportDocumentsCSV(); notify({ type: 'success', title: 'Export selesai', message: 'CSV keuangan, presensi, dokumen' }) }} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#232323] text-slate-700 dark:text-slate-300 flex items-center gap-2"><FileText size={18} /> Export Semua CSV</button>
      </div>
    </div>
  )
}

export default ReportsPage

