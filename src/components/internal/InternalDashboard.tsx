import React, { useState, useEffect, useMemo } from 'react'
import { financeAPI, attendanceAPI, documentsAPI, auditAPI, notificationsAPI, supabase, type InternalEvent, type FinanceTransaction, type Document, type NotificationItemDB } from '../../lib/supabase'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getInternalBasePath } from '../../utils/domainDetection'

interface FinancialSummary {
  totalIncome: number
  totalExpense: number
  balance: number
}

const InternalDashboard: React.FC = () => {
  const basePath = getInternalBasePath()
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  })
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('Pengurus DIGCITY')
  const [userRole, setUserRole] = useState<string>('Anggota')
  const [events, setEvents] = useState<InternalEvent[]>([])
  const [pendingExpenses, setPendingExpenses] = useState<FinanceTransaction[]>([])
  const [pendingDocs, setPendingDocs] = useState<Document[]>([])
  const [memberActivities, setMemberActivities] = useState<{ id: string, action: string, created_at: string, details?: Record<string, unknown> }[]>([])
  const [notifications, setNotifications] = useState<NotificationItemDB[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const data = await financeAPI.getSummary()
      
      // Ensure data updates even if balance is 0
      setSummary({
        totalIncome: data.totalIncome || 0,
        totalExpense: data.totalExpense || 0,
        balance: data.balance || 0
      })

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserName(user.user_metadata?.full_name || user.email || 'Pengurus DIGCITY')
          setUserRole((user.user_metadata?.internal_role || 'anggota').toString())
        }
      } catch {}

      const [ev, txAll, docsAll, logs, notifs] = await Promise.all([
        attendanceAPI.getEvents(),
        financeAPI.getAll(),
        documentsAPI.getAll(),
        auditAPI.list({ module: 'members', limit: 10 }),
        notificationsAPI.list({ unreadOnly: true, limit: 5 })
      ])
      setEvents(ev)
      setPendingExpenses((txAll as FinanceTransaction[]).filter(t => t.status === 'pending').slice(0, 5))
      setPendingDocs((docsAll as Document[]).filter(d => d.status === 'pending_review').slice(0, 5))
      setMemberActivities(logs.map(l => ({ id: l.id, action: l.action, created_at: l.created_at, details: l.details || {} })))
      setNotifications(notifs)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-200 dark:shadow-none">
        <h1 className="text-2xl font-bold mb-1">Halo, {userName}! 👋</h1>
        <p className="text-blue-100 text-sm">Peran: {userRole.toUpperCase()}</p>
        <p className="text-blue-100 mt-1">Ringkasan aktivitas organisasi untuk Anda.</p>
      </div>

      {/* Finance Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Keuangan Organisasi</h2>
          <Link to={`${basePath}/finance`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center dark:text-blue-400">
            Lihat Detail <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Wallet size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Saldo Kas</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.balance)}</h3>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#2A2A2A] rounded-full h-2 mb-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${Math.min((summary.balance / (summary.totalIncome || 1)) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Saldo saat ini aman
            </p>
          </div>

          {/* Income Card */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pemasukan</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.totalIncome)}</h3>
              </div>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
              <Plus size={12} className="mr-1" />
              Total pemasukan tercatat
            </p>
          </div>

          {/* Expense Card */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center">
                <TrendingDown size={24} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pengeluaran</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.totalExpense)}</h3>
              </div>
            </div>
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center font-medium">
              Total pengeluaran tercatat
            </p>
          </div>
        </div>
      </div>

      {/* Agenda & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Agenda</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hari ini & Mendatang</h3>
            </div>
            <Link to={`${basePath}/attendance`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"><ArrowRight size={16} className="mr-1" /> Lihat semua</Link>
          </div>
          <div className="space-y-2">
            {events.filter(e => new Date(e.date).toDateString() === new Date().toDateString()).slice(0, 3).map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#232323]">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-slate-500">{e.division} • {new Date(e.date).toLocaleTimeString('id-ID',{ hour:'2-digit', minute:'2-digit' })} WIB</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Hari ini</span>
              </div>
            ))}
            {events.filter(e => new Date(e.date) > new Date()).slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#2A2A2A]">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-slate-500">{e.division} • {new Date(e.date).toLocaleDateString('id-ID',{ dateStyle:'medium'})}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Mendatang</span>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-slate-500">Belum ada agenda terjadwal.</p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Approval</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending</h3>
            </div>
            <Link to={`${basePath}/finance`} className="text-sm font-medium text-blue-600 hover:text-blue-700">Keuangan</Link>
          </div>
          <div className="space-y-2">
            {pendingExpenses.slice(0,3).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <div>
                    <p className="text-sm font-medium">Pengeluaran {t.category}</p>
                    <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString('id-ID',{ dateStyle:'medium'})}</p>
                  </div>
                </div>
                <span className="text-xs font-mono">Rp {Number(t.amount).toLocaleString('id-ID')}</span>
              </div>
            ))}
            {pendingDocs.slice(0,3).map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <div>
                    <p className="text-sm font-medium">Surat: {d.title}</p>
                    <p className="text-xs text-slate-500">{d.ticket_number}</p>
                  </div>
                </div>
                <span className="text-xs">Pending review</span>
              </div>
            ))}
            {pendingExpenses.length === 0 && pendingDocs.length === 0 && (
              <p className="text-sm text-slate-500">Tidak ada approval pending.</p>
            )}
          </div>
        </div>
      </div>

      {/* Aktivitas anggota & Notifikasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Aktivitas</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Anggota terbaru</h3>
            </div>
            <Link to={`${basePath}/activity`} className="text-sm font-medium text-blue-600 hover:text-blue-700">Log</Link>
          </div>
          <div className="space-y-2">
            {memberActivities.slice(0,5).map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#2A2A2A]">
                <span className="text-sm font-medium capitalize">{a.action.replace(/_/g,' ')}</span>
                <span className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString('id-ID',{ dateStyle:'short', timeStyle:'short'})}</span>
              </div>
            ))}
            {memberActivities.length === 0 && (
              <p className="text-sm text-slate-500">Belum ada aktivitas anggota.</p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Notifikasi</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reminder cepat</h3>
            </div>
            <Link to={`${basePath}/activity`} className="text-sm font-medium text-blue-600 hover:text-blue-700">Semua</Link>
          </div>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#232323]">
                <div className="flex items-center gap-3">
                  <Bell size={16} className={n.type === 'warning' ? 'text-amber-600' : n.type === 'error' ? 'text-rose-600' : n.type === 'success' ? 'text-emerald-600' : 'text-blue-600'} />
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.message && <p className="text-xs text-slate-500">{n.message}</p>}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{new Date(n.created_at).toLocaleTimeString('id-ID',{hour:'2-digit', minute:'2-digit'})}</span>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-slate-500">Tidak ada notifikasi baru.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternalDashboard
