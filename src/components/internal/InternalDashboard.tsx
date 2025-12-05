import React, { useState, useEffect, useMemo } from 'react'
import { financeAPI, attendanceAPI, documentsAPI, notificationsAPI, supabase, membersAPI, duesAPI, type FinanceTransaction, type Document, type NotificationItemDB } from '../../lib/supabase'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Bell,
  Users,
  Briefcase,
  FileText
} from 'lucide-react'
import DashboardQRScanner from './DashboardQRScanner'
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
  const [pendingExpenses, setPendingExpenses] = useState<FinanceTransaction[]>([])
  const [pendingDocs, setPendingDocs] = useState<Document[]>([])
  const [notifications, setNotifications] = useState<NotificationItemDB[]>([])
  const [memberCount, setMemberCount] = useState(0)
  const [activeProgramsCount, setActiveProgramsCount] = useState(0)

  const [isDefaultPassword, setIsDefaultPassword] = useState(false)

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
          setIsDefaultPassword(!!user.user_metadata?.is_default_password)
        }
      } catch { }

      const [ev, txAll, docsAll, notifs, members] = await Promise.all([
        attendanceAPI.getEvents(),
        financeAPI.getAll(),
        documentsAPI.getAll(),
        notificationsAPI.list({ unreadOnly: true, limit: 5 }),
        membersAPI.getAll()
      ])

      setActiveProgramsCount(ev.filter(e => e.type === 'work_program' && e.status !== 'cancelled').length)
      setPendingExpenses((txAll as FinanceTransaction[]).filter(t => t.status === 'pending').slice(0, 5))
      setPendingDocs((docsAll as Document[]).filter(d => d.status === 'pending_review').slice(0, 5))
      setNotifications(notifs)
      setMemberCount(members.length)

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
      {/* Default Password Warning */}
      {isDefaultPassword && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-1">Keamanan Akun</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
              Anda masih menggunakan password default. Demi keamanan, silakan ganti password Anda segera.
            </p>
            <Link to={`${basePath}/settings`} className="text-sm font-medium text-amber-900 dark:text-amber-100 underline hover:no-underline">
              Ganti Password Sekarang &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-200 dark:shadow-none relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-1">Halo, {userName}! 👋</h1>
          <p className="text-blue-100 text-sm">Peran: {userRole.toUpperCase()}</p>
          <p className="text-blue-100 mt-1">Selamat datang di dashboard transparansi DIGCITY.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
            <Wallet size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Saldo Kas</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.balance)}</h3>
          </div>
        </div>

        {/* Active Members Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} className="text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Anggota Aktif</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{memberCount}</h3>
          </div>
        </div>

        {/* Active Programs Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Program</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeProgramsCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Transparency Feed & Financial Overview */}
        <div className="lg:col-span-2 space-y-8">



          {/* Financial Overview */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Ringkasan Keuangan</h3>
              <Link to={`${basePath}/finance`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Detail <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Total Pemasukan</p>
                <h4 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(summary.totalIncome)}</h4>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
                <p className="text-sm text-rose-600 dark:text-rose-400 font-medium mb-1">Total Pengeluaran</p>
                <h4 className="text-xl font-bold text-rose-700 dark:text-rose-300">{formatCurrency(summary.totalExpense)}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal & Quick Actions */}
        <div className="space-y-8">
          {/* QR Scanner */}
          <DashboardQRScanner />

          {/* Personal Dues Widget */}
          <MemberDuesWidget />

          {/* Pending Approvals (Admin/BPH Only) */}
          {(pendingExpenses.length > 0 || pendingDocs.length > 0) && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-[#2A2A2A] bg-amber-50 dark:bg-amber-900/20">
                <h3 className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Perlu Persetujuan
                </h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                {pendingExpenses.slice(0, 3).map((t) => (
                  <div key={t.id} className="p-3 hover:bg-slate-50 dark:hover:bg-[#232323]">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Pengeluaran: {t.category}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(t.amount)} • {new Date(t.date).toLocaleDateString('id-ID')}</p>
                  </div>
                ))}
                {pendingDocs.slice(0, 3).map((d) => (
                  <div key={d.id} className="p-3 hover:bg-slate-50 dark:hover:bg-[#232323]">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Surat: {d.title}</p>
                    <p className="text-xs text-slate-500">{d.ticket_number}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MemberDuesWidget: React.FC = () => {
  const [dues, setDues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalOutstanding, setTotalOutstanding] = useState(0)

  useEffect(() => {
    const loadDues = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !user.email) return

        const member = await membersAPI.getMemberByEmail(user.email)
        if (member) {
          const myDues = await duesAPI.getByMemberId(member.id)
          const unpaid = myDues.filter((d: any) => d.status !== 'paid')
          setDues(unpaid)
          setTotalOutstanding(unpaid.reduce((sum: number, d: any) => sum + d.amount, 0))
        }
      } catch (error) {
        console.error('Failed to load member dues:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDues()
  }, [])

  if (loading) return null

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Keuangan Pribadi</p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tagihan Saya</h3>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${totalOutstanding > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalOutstanding)}
          </p>
        </div>
      </div>

      {dues.length === 0 ? (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
          <CheckCircle size={20} />
          <span className="text-sm font-medium">Lunas! Tidak ada tagihan.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {dues.slice(0, 3).map((due) => (
            <div key={due.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#2A2A2A] hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                  <AlertTriangle size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{due.invoice_number}</p>
                  <p className="text-xs text-slate-500">{new Date(due.due_date).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(due.amount)}
                </p>
              </div>
            </div>
          ))}
          {dues.length > 3 && (
            <p className="text-xs text-center text-slate-500">+{dues.length - 3} tagihan lainnya</p>
          )}
        </div>
      )}
    </div>
  )
}

export default InternalDashboard
