import React, { useEffect, useMemo, useState } from 'react'
import { financeAPI, attendanceAPI, documentsAPI, type FinanceTransaction, type Attendance, type Document, auditAPI } from '../../lib/supabase'
import { Calendar, BarChart3, FileText, ArrowUpRight, ArrowDownRight, Download, Printer, TrendingUp, Check, Clock, XCircle, AlertCircle } from 'lucide-react'
import { useNotifications } from '../common/NotificationCenter'

type DateRange = { start: string; end: string }

const currency = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const ReportsPage: React.FC = () => {
  const { notify } = useNotifications()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
  const [records, setRecords] = useState<Attendance[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [range, setRange] = useState<DateRange>({ start: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10), end: new Date().toISOString().slice(0, 10) })
  const [category] = useState<string>('all')
  const [searchTerm] = useState('')

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

  const incomeTotal = useMemo(() => filteredTx.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0), [filteredTx])
  const expenseTotal = useMemo(() => filteredTx.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0), [filteredTx])
  const balance = useMemo(() => incomeTotal - expenseTotal, [incomeTotal, expenseTotal])

  const byCategory = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>()
    filteredTx.forEach((t) => {
      const cur = map.get(t.category) || { income: 0, expense: 0 }
      if (t.type === 'income') cur.income += t.amount
      else cur.expense += t.amount
      map.set(t.category, cur)
    })
    return Array.from(map.entries()).map(([cat, val]) => ({ category: cat, ...val })).sort((a, b) => (b.income + b.expense) - (a.income + a.expense))
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
    return { incoming, outgoing, report, approved, pending, draft, archived, total: filteredDocs.length }
  }, [filteredDocs])

  const exportCSV = (rows: string[][], filename: string) => {
    const csv = rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleExportFinanceCSV = () => {
    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Nominal']
    const rows = filteredTx.map(t => [t.date, t.type, t.category, t.description || '', t.amount.toString()])
    exportCSV([headers, ...rows], `finance-report-${range.start}_to_${range.end}.csv`)
  }

  const handleExportAttendanceCSV = () => {
    const headers = ['Tanggal', 'Event', 'Nama', 'Status']
    const rows = filteredAttendance.map(r => [r.check_in_time, r.event_id, r.name, r.status])
    exportCSV([headers, ...rows], `attendance-report-${range.start}_to_${range.end}.csv`)
  }

  const handleExportDocumentsCSV = () => {
    const headers = ['Tanggal', 'Nomor', 'Judul', 'Tipe', 'Status']
    const rows = filteredDocs.map(d => [d.date, d.ticket_number, d.title, d.type, d.status])
    exportCSV([headers, ...rows], `documents-report-${range.start}_to_${range.end}.csv`)
  }

  const handlePrintLPJ = async () => {
    notify({ type: 'info', title: 'Menyiapkan LPJ', message: 'Membuka halaman cetak LPJ...' })
    await auditAPI.log({ module: 'documents', action: 'generate_lpj', entity_type: 'lpj', details: { start: range.start, end: range.end, incomeTotal, expenseTotal } })

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

    const categoryRows = byCategory.map(row => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${row.category}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${currency(row.income)}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${currency(row.expense)}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${currency(row.income - row.expense)}</td>
      </tr>
    `).join('')

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>LPJ DIGCITY - ${formatDate(range.start)} s/d ${formatDate(range.end)}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          * { box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            padding: 0; 
            margin: 0;
            color: #333;
            line-height: 1.6;
          }
          .container { max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; color: #1e40af; }
          .header h2 { margin: 5px 0 0 0; font-size: 16px; font-weight: normal; color: #666; }
          .header .period { margin-top: 15px; font-size: 14px; color: #333; background: #f0f4ff; padding: 8px 16px; border-radius: 20px; display: inline-block; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 16px; font-weight: bold; color: #1e40af; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
          .summary-card { padding: 20px; border-radius: 12px; text-align: center; }
          .summary-card.income { background: #d1fae5; border: 1px solid #6ee7b7; }
          .summary-card.expense { background: #fee2e2; border: 1px solid #fca5a5; }
          .summary-card.balance { background: #dbeafe; border: 1px solid #93c5fd; }
          .summary-card .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .summary-card .value { font-size: 22px; font-weight: bold; margin-top: 5px; }
          .summary-card.income .value { color: #059669; }
          .summary-card.expense .value { color: #dc2626; }
          .summary-card.balance .value { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #1e40af; color: white; padding: 12px 10px; text-align: left; }
          th:not(:first-child) { text-align: right; }
          tr:nth-child(even) { background: #f9fafb; }
          .total-row { background: #1e40af !important; color: white; font-weight: bold; }
          .total-row td { padding: 12px 10px; border: none; }
          .attendance-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
          .attendance-card { padding: 15px; border-radius: 8px; text-align: center; }
          .attendance-card .value { font-size: 28px; font-weight: bold; }
          .attendance-card .label { font-size: 11px; color: #666; margin-top: 5px; }
          .attendance-card.present { background: #d1fae5; }
          .attendance-card.present .value { color: #059669; }
          .attendance-card.late { background: #fef3c7; }
          .attendance-card.late .value { color: #d97706; }
          .attendance-card.excused { background: #dbeafe; }
          .attendance-card.excused .value { color: #2563eb; }
          .attendance-card.absent { background: #fee2e2; }
          .attendance-card.absent .value { color: #dc2626; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
          .signature-box { width: 200px; text-align: center; }
          .signature-box .line { border-top: 1px solid #333; margin-top: 60px; padding-top: 5px; font-size: 12px; }
          .print-date { text-align: center; font-size: 11px; color: #999; margin-top: 30px; }
          @media print { 
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LAPORAN PERTANGGUNGJAWABAN</h1>
            <h2>DIGCITY - Himpunan Mahasiswa Bisnis Digital UPN Yogya</h2>
            <div class="period">Periode: ${formatDate(range.start)} — ${formatDate(range.end)}</div>
          </div>

          <div class="section">
            <div class="section-title">📊 Ringkasan Keuangan</div>
            <div class="summary-grid">
              <div class="summary-card income">
                <div class="label">Total Pemasukan</div>
                <div class="value">${currency(incomeTotal)}</div>
              </div>
              <div class="summary-card expense">
                <div class="label">Total Pengeluaran</div>
                <div class="value">${currency(expenseTotal)}</div>
              </div>
              <div class="summary-card balance">
                <div class="label">Saldo Periode</div>
                <div class="value">${currency(balance)}</div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Pemasukan</th>
                  <th>Pengeluaran</th>
                  <th>Selisih</th>
                </tr>
              </thead>
              <tbody>
                ${categoryRows}
                <tr class="total-row">
                  <td>TOTAL</td>
                  <td style="text-align: right;">${currency(incomeTotal)}</td>
                  <td style="text-align: right;">${currency(expenseTotal)}</td>
                  <td style="text-align: right;">${currency(balance)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">👥 Ringkasan Presensi</div>
            <div class="attendance-grid">
              <div class="attendance-card present">
                <div class="value">${attendanceSummary.present}</div>
                <div class="label">Hadir</div>
              </div>
              <div class="attendance-card late">
                <div class="value">${attendanceSummary.late}</div>
                <div class="label">Terlambat</div>
              </div>
              <div class="attendance-card excused">
                <div class="value">${attendanceSummary.excused}</div>
                <div class="label">Izin</div>
              </div>
              <div class="attendance-card absent">
                <div class="value">${attendanceSummary.absent}</div>
                <div class="label">Tidak Hadir</div>
              </div>
            </div>
            <p style="text-align: center; margin-top: 15px; color: #666; font-size: 13px;">
              Total: ${attendanceSummary.total} record kehadiran
            </p>
          </div>

          <div class="section">
            <div class="section-title">📄 Ringkasan Dokumen</div>
            <table>
              <thead>
                <tr>
                  <th>Jenis Dokumen</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="padding: 10px; border: 1px solid #ddd;">Surat Masuk</td><td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${docsSummary.incoming}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd;">Surat Keluar</td><td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${docsSummary.outgoing}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd;">Laporan/LPJ</td><td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${docsSummary.report}</td></tr>
                <tr class="total-row">
                  <td>TOTAL DOKUMEN</td>
                  <td style="text-align: right;">${docsSummary.total}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div class="signature-box">
              <div class="line">Mengetahui,<br/>Ketua Umum</div>
            </div>
            <div class="signature-box">
              <div class="line">Bendahara</div>
            </div>
            <div class="signature-box">
              <div class="line">Sekretaris</div>
            </div>
          </div>

          <div class="print-date">
            Dicetak pada: ${new Date().toLocaleString('id-ID')}
          </div>
        </div>
      </body>
    </html>
    `

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      notify({ type: 'error', title: 'Gagal', message: 'Pop-up diblokir. Izinkan pop-up untuk mencetak.' })
      return
    }
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  const StatCard = ({ icon: Icon, label, value, subValue, color }: { icon: React.ElementType, label: string, value: string | number, subValue?: string, color: string }) => (
    <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subValue && <p className="text-xs text-slate-400">{subValue}</p>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laporan & LPJ</h1>
          <p className="text-slate-500 dark:text-slate-400">Ringkasan kas, presensi, dan administrasi dokumen</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] rounded-xl">
            <Calendar size={16} className="text-slate-400" />
            <input type="date" value={range.start} onChange={(e) => setRange(r => ({ ...r, start: e.target.value }))} className="bg-transparent text-sm focus:outline-none dark:text-white" />
            <span className="text-slate-400">—</span>
            <input type="date" value={range.end} onChange={(e) => setRange(r => ({ ...r, end: e.target.value }))} className="bg-transparent text-sm focus:outline-none dark:text-white" />
          </div>
          <button onClick={handlePrintLPJ} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-blue-200 dark:shadow-none">
            <Printer size={18} />
            <span className="hidden sm:inline">Cetak LPJ</span>
          </button>
        </div>
      </div>

      {/* Finance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ArrowUpRight} label="Pemasukan" value={currency(incomeTotal)} color="bg-emerald-500" />
        <StatCard icon={ArrowDownRight} label="Pengeluaran" value={currency(expenseTotal)} color="bg-rose-500" />
        <StatCard icon={TrendingUp} label="Saldo Periode" value={currency(balance)} subValue={balance >= 0 ? 'Surplus' : 'Defisit'} color={balance >= 0 ? 'bg-blue-500' : 'bg-amber-500'} />
        <StatCard icon={BarChart3} label="Transaksi" value={filteredTx.length} subValue="Total record" color="bg-violet-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Finance by Category */}
        <div className="xl:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ringkasan Per Kategori</h3>
              <p className="text-sm text-slate-500">Breakdown keuangan berdasarkan kategori</p>
            </div>
            <button onClick={handleExportFinanceCSV} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#232323] text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-[#2A2A2A] transition-colors text-sm font-medium">
              <Download size={16} /> Export
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map(i => <div key={i} className="h-16 animate-pulse bg-slate-100 dark:bg-[#232323] rounded-xl"></div>)}
            </div>
          ) : byCategory.length > 0 ? (
            <div className="space-y-4">
              {byCategory.slice(0, 6).map((row) => {
                const maxAmount = Math.max(...byCategory.map(c => c.income + c.expense))
                const total = row.income + row.expense
                const widthPct = maxAmount ? (total / maxAmount) * 100 : 0
                const incomePct = total ? (row.income / total) * 100 : 0
                return (
                  <div key={row.category} className="p-4 bg-slate-50 dark:bg-[#232323] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{row.category}</span>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{currency(total)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 dark:bg-[#1A1A1A] overflow-hidden" style={{ width: `${widthPct}%`, minWidth: '40%' }}>
                      <div className="h-full flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${incomePct}%` }}></div>
                        <div className="bg-rose-500 h-full" style={{ width: `${100 - incomePct}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Masuk: {currency(row.income)}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Keluar: {currency(row.expense)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500">Tidak ada transaksi pada periode ini</p>
            </div>
          )}
        </div>

        {/* Attendance Summary */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rekap Presensi</h3>
              <p className="text-sm text-slate-500">{attendanceSummary.total} record kehadiran</p>
            </div>
            <button onClick={handleExportAttendanceCSV} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#232323] text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-[#2A2A2A] transition-colors text-sm font-medium">
              <Download size={16} />
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map(i => <div key={i} className="h-12 animate-pulse bg-slate-100 dark:bg-[#232323] rounded-lg"></div>)}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg"><Check size={16} className="text-white" /></div>
                  <span className="font-medium text-slate-900 dark:text-white">Hadir</span>
                </div>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{attendanceSummary.present}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-lg"><Clock size={16} className="text-white" /></div>
                  <span className="font-medium text-slate-900 dark:text-white">Terlambat</span>
                </div>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{attendanceSummary.late}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500 rounded-lg"><AlertCircle size={16} className="text-white" /></div>
                  <span className="font-medium text-slate-900 dark:text-white">Izin</span>
                </div>
                <span className="text-xl font-bold text-sky-600 dark:text-sky-400">{attendanceSummary.excused}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500 rounded-lg"><XCircle size={16} className="text-white" /></div>
                  <span className="font-medium text-slate-900 dark:text-white">Tidak Hadir</span>
                </div>
                <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{attendanceSummary.absent}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents Summary */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rekap Dokumen</h3>
            <p className="text-sm text-slate-500">{docsSummary.total} dokumen dalam periode</p>
          </div>
          <button onClick={handleExportDocumentsCSV} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#232323] text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-[#2A2A2A] transition-colors text-sm font-medium">
            <Download size={16} /> Export
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse bg-slate-100 dark:bg-[#232323] rounded-xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{docsSummary.incoming}</p>
              <p className="text-xs text-slate-500 mt-1">Surat Masuk</p>
            </div>
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-center">
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{docsSummary.outgoing}</p>
              <p className="text-xs text-slate-500 mt-1">Surat Keluar</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{docsSummary.report}</p>
              <p className="text-xs text-slate-500 mt-1">LPJ</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{docsSummary.approved}</p>
              <p className="text-xs text-slate-500 mt-1">Disetujui</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{docsSummary.pending}</p>
              <p className="text-xs text-slate-500 mt-1">Pending</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#232323] text-center">
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{docsSummary.draft}</p>
              <p className="text-xs text-slate-500 mt-1">Draft</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#232323] text-center">
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{docsSummary.archived}</p>
              <p className="text-xs text-slate-500 mt-1">Arsip</p>
            </div>
          </div>
        )}
      </div>

      {/* Export All Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            handleExportFinanceCSV()
            handleExportAttendanceCSV()
            handleExportDocumentsCSV()
            notify({ type: 'success', title: 'Export selesai', message: '3 file CSV berhasil diunduh' })
          }}
          className="px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-2 font-medium"
        >
          <FileText size={18} />
          Export Semua CSV
        </button>
      </div>
    </div>
  )
}

export default ReportsPage
