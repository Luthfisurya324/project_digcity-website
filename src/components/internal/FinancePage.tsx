import React, { useState, useEffect, useMemo } from 'react'
import { financeAPI, FinanceTransaction, auditAPI } from '../../lib/supabase'
import TransactionForm from './TransactionForm'
import {
  Plus,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Printer,
  BarChart3,
  Wallet
} from 'lucide-react'
import MemberDuesPanel from './DuesPanel'
import DivisionCashPanel from './DivisionCashPanel'
import UPMPanel from './UPMPanel'

const FinancePage: React.FC = () => {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editingTransaction, setEditingTransaction] = useState<FinanceTransaction | null>(null)
  const [showDivisionPanel, setShowDivisionPanel] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  const openCreateForm = () => {
    setFormMode('create')
    setEditingTransaction(null)
    setShowForm(true)
  }

  const openEditForm = (transaction: FinanceTransaction) => {
    setFormMode('edit')
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const loadTransactions = async () => {
    try {
      const data = await financeAPI.getAll()
      setTransactions(data)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      try {
        await financeAPI.delete(id)
        await auditAPI.log({
          module: 'finance',
          action: 'delete_transaction',
          entity_type: 'transaction',
          entity_id: id,
          details: { id }
        })
        loadTransactions()
      } catch (error) {
        console.error('Error deleting transaction:', error)
      }
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await financeAPI.update(id, { status: newStatus })
      await auditAPI.log({
        module: 'finance',
        action: 'update_status',
        entity_type: 'transaction',
        entity_id: id,
        details: { status: newStatus }
      })
      loadTransactions()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleExport = () => {
    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Nominal', 'Status', 'Bukti']
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        `"${t.category}"`,
        `"${t.description}"`,
        t.amount,
        t.status || 'approved',
        t.proof_url || '-'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `laporan_keuangan_digcity_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  const handleExportPdf = () => {
    const rows = transactions.map((t) => `
      <tr>
        <td>${formatDate(t.date)}</td>
        <td>${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</td>
        <td>${t.category}</td>
        <td>${t.description || '-'}</td>
        <td>${formatCurrency(t.amount)}</td>
        <td>${t.status || 'approved'}</td>
      </tr>
    `).join('')

    const html = `
      <html>
        <head>
          <title>Laporan Keuangan DIGCITY</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 20px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background: #f4f4f4; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Laporan Keuangan DIGCITY</h1>
          <p>Dicetak pada ${new Date().toLocaleString('id-ID')}</p>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tipe</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Nominal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.print()
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter = filter === 'all' || t.type === filter
      const matchesSearch = t.description?.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [transactions, filter, search])

  const monthlyTrend = useMemo(() => {
    const map = new Map<string, { income: number; expense: number; label: string }>()
    transactions.forEach((t) => {
      const date = new Date(t.date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      if (!map.has(key)) map.set(key, { income: 0, expense: 0, label })
      const entry = map.get(key)!
      if (t.type === 'income' && (t.status === 'approved' || !t.status)) entry.income += t.amount
      if (t.type === 'expense' && t.status === 'approved') entry.expense += t.amount
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([, value]) => value)
  }, [transactions])

  const monthlyReportRows = useMemo(() => monthlyTrend.map((item) => ({
    ...item,
    net: item.income - item.expense
  })), [monthlyTrend])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Simple summary for the chart placeholder - using approved data
  const totalIncome = transactions.filter(t => t.type === 'income' && (t.status === 'approved')).reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense' && (t.status === 'approved')).reduce((sum, t) => sum + t.amount, 0)
  const maxTrendValue = Math.max(...monthlyTrend.map((row) => Math.max(row.income, row.expense)), 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laporan Keuangan</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola pemasukan dan pengeluaran organisasi</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Printer size={18} />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Plus size={18} />
            <span>Catat Transaksi</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-slate-200 dark:border-[#2A2A2A] relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ArrowUpRight size={20} />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pemasukan</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{formatCurrency(totalIncome)}</h3>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Terverifikasi</span>
            </p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-slate-200 dark:border-[#2A2A2A] relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-rose-50 dark:bg-rose-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ArrowDownRight size={20} />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pengeluaran</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{formatCurrency(totalExpense)}</h3>
            <p className="text-xs text-rose-600 flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Terverifikasi</span>
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-slate-200 dark:border-[#2A2A2A] relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sisa Saldo</p>
            </div>
            <h3 className={`text-2xl font-bold mb-1 ${totalIncome - totalExpense >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600'}`}>
              {formatCurrency(totalIncome - totalExpense)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              <span>Update Realtime</span>
            </p>
          </div>
        </div>
      </div>

      {/* UPM Panel */}
      <UPMPanel />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
              : 'bg-white dark:bg-[#1E1E1E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2A2A2A]'
              }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'income'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-white dark:bg-[#1E1E1E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2A2A2A]'
              }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'expense'
              ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'
              : 'bg-white dark:bg-[#1E1E1E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2A2A2A]'
              }`}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Grafik Keuangan</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">6 Bulan Terakhir</h3>
            </div>
            <BarChart3 size={20} className="text-slate-400" />
          </div>
          {monthlyTrend.length === 0 ? (
            <p className="text-sm text-slate-500 mt-6">Belum ada data untuk menampilkan grafik.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {monthlyTrend.map((month) => (
                <div key={month.label} className="p-3 rounded-xl border border-slate-100 dark:border-[#2A2A2A] bg-slate-50 dark:bg-[#232323]">
                  <p className="text-xs text-slate-500">{month.label}</p>
                  <div className="flex items-end gap-2 h-24 mt-2">
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-t-md" style={{ height: `${(month.income / maxTrendValue) * 100}%` }}></div>
                      <span className="text-[10px] text-emerald-600 mt-1">+{formatCurrency(month.income)}</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="w-full bg-rose-100 dark:bg-rose-900/30 rounded-t-md" style={{ height: `${(month.expense / maxTrendValue) * 100}%` }}></div>
                      <span className="text-[10px] text-rose-600 mt-1">-{formatCurrency(month.expense)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Laporan Otomatis</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ringkasan Bulanan</h3>
            </div>
            <FileText size={20} className="text-slate-400" />
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="py-2">Periode</th>
                  <th className="py-2">Pemasukan</th>
                  <th className="py-2">Pengeluaran</th>
                  <th className="py-2">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {monthlyReportRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-slate-500">Belum ada data</td>
                  </tr>
                ) : monthlyReportRows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100 dark:border-[#2A2A2A]">
                    <td className="py-2">{row.label}</td>
                    <td className="py-2 text-emerald-600">{formatCurrency(row.income)}</td>
                    <td className="py-2 text-rose-600">{formatCurrency(row.expense)}</td>
                    <td className={`py-2 ${row.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(row.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Fitur Opsional</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kas Divisi & Program Kerja</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Aktifkan jika ingin memisahkan pencatatan kas per divisi.</p>
          </div>
          <button
            onClick={() => setShowDivisionPanel((prev) => !prev)}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-[#2A2A2A] hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-700"
          >
            {showDivisionPanel ? 'Sembunyikan' : 'Aktifkan'}
          </button>
        </div>
        {showDivisionPanel ? (
          <DivisionCashPanel transactions={transactions} />
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E1E1E] border border-dashed border-slate-300 dark:border-[#2A2A2A] text-sm text-slate-500">
            Catatan: Secara default seluruh transaksi tercatat sebagai Kas Inti. Aktifkan fitur ini hanya bila benar-benar membutuhkan
            pemantauan per divisi atau program kerja.
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
            {filteredTransactions.map((t) => (
              <div key={t.id} className="p-4 hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                      }`}>
                      {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{t.description || t.category}</p>
                        {t.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1">
                            <Clock size={10} /> Pending
                          </span>
                        )}
                        {t.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1">
                            <XCircle size={10} /> Ditolak
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(t.date)}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#2A2A2A] rounded text-slate-600 dark:text-slate-300">{t.category}</span>
                        {t.sub_account && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-slate-50 dark:bg-[#1E1E1E] rounded text-slate-500 dark:text-slate-300 text-xs">
                              {t.sub_account}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </p>
                      {t.proof_url && (
                        <a href={t.proof_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1">
                          <FileText size={12} /> Bukti
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      {/* Approval Actions for Pending Expense */}
                      {t.type === 'expense' && t.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(t.id, 'approved')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            title="Setujui"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(t.id, 'rejected')}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Tolak"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => openEditForm(t)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter size={24} />
            </div>
            <p>Belum ada transaksi yang sesuai filter</p>
          </div>
        )}
      </div>

      <MemberDuesPanel onFinanceUpdate={loadTransactions} />

      {showForm && (
        <TransactionForm
          mode={formMode}
          transaction={editingTransaction || undefined}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            loadTransactions()
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}

export default FinancePage