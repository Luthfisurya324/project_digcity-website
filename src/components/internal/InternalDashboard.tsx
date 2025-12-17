import React, { useState, useEffect, useMemo } from 'react'
import { financeAPI, attendanceAPI, documentsAPI, notificationsAPI, supabase, membersAPI, duesAPI, orgAPI, type FinanceTransaction, type Document, type NotificationItemDB, type MemberDue } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'
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
  FileText,
  Clock
} from 'lucide-react'
import DashboardQRScanner from './DashboardQRScanner'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { getInternalBasePath } from '../../utils/domainDetection'

interface FinancialSummary {
  totalIncome: number
  totalExpense: number
  balance: number
}

const InternalDashboard: React.FC = () => {
  const basePath = getInternalBasePath()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { notify } = useNotifications()
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

    // Check for check-in status from redirect
    const status = searchParams.get('status')
    const eventName = searchParams.get('event')

    if (status === 'success') {
      notify({
        type: 'success',
        title: 'Presensi Berhasil',
        message: `Kehadiran Anda di "${eventName}" telah tercatat.`
      })
      // Clear params
      navigate(basePath || '/', { replace: true })
    } else if (status === 'already_attended') {
      notify({
        type: 'info',
        title: 'Sudah Presensi',
        message: `Anda sudah melakukan presensi di "${eventName}" sebelumnya.`
      })
      // Clear params
      navigate(basePath || '/', { replace: true })
    }
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
            <Link to={`${basePath}/settings`} className="text-sm font-medium text-amber-900 dark:text-amber-100 underline hover:no-underline flex items-center gap-1" >
              Ganti Password Sekarang <ArrowRight size={14} />
            </Link >
          </div >
        </div >
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
    </div >
  )
}

const MemberDuesWidget: React.FC = () => {
  const [dues, setDues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalOutstanding, setTotalOutstanding] = useState(0)

  // Payment Modal State
  const [selectedDueIds, setSelectedDueIds] = useState<string[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'cash'>('transfer')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { notify } = useNotifications()

  // Re-fetch logic
  const loadDues = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email) return

      // Find member by email
      const member = await membersAPI.getMemberByEmail(user.email)
      if (member) {
        const myDues = await duesAPI.getByMemberId(member.id)
        // Show unpaid and pending_verification
        const active = myDues.filter((d: any) => d.status !== 'paid')
        setDues(active)
        // Calculate total only for truly unpaid (not pending?) or all? 
        // Typically pending is still outstanding until approved.
        setTotalOutstanding(active.reduce((sum: number, d: any) => d.status !== 'paid' ? sum + d.amount : sum, 0))
      }
    } catch (error) {
      console.error('Failed to load member dues:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDues()
  }, [])

  const handleCreatePayment = (dueId?: string) => {
    if (dueId) {
      setSelectedDueIds([dueId])
    }
    // If dueId is null, it means use existing selectedDueIds
    setShowPaymentModal(true)
    setPaymentMethod('transfer')
  }

  const toggleSelection = (id: string) => {
    setSelectedDueIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDueIds.length === 0) return
    setSubmitting(true)

    try {
      let proofUrl = ''
      if (proofFile) {
        proofUrl = await financeAPI.uploadProof(proofFile)
      }

      // Process all selected dues
      const submittedAt = new Date().toISOString()

      await Promise.all(selectedDueIds.map(async (id) => {
        await duesAPI.update(id, {
          status: 'pending_verification' as any,
          payment_method: paymentMethod,
          proof_url: proofUrl,
          submitted_at: submittedAt
        })
      }))

      // alert('Konfirmasi pembayaran dikirim! Menunggu verifikasi admin.')
      // Use simple alert or notify if available
      loadDues()
      setShowPaymentModal(false)
      setSelectedDueIds([])
      setProofFile(null)
    } catch (error) {
      console.error('Payment submission failed:', error)
      alert('Gagal mengirim konfirmasi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  // Calculate total for modal
  const totalSelectedAmount = dues
    .filter(d => selectedDueIds.includes(d.id))
    .reduce((sum, d) => sum + d.amount, 0)

  const selectedInvoices = dues
    .filter(d => selectedDueIds.includes(d.id))
    .map(d => d.invoice_number)
    .join(', ')

  return (
    <>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A] shadow-sm relative">
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
            {dues.slice(0, 5).map((due) => (
              <div key={due.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#2A2A2A] hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors relative">
                <div className="flex items-center gap-3">
                  {due.status === 'pending_verification' ? (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Clock size={16} className="text-amber-500" />
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedDueIds.includes(due.id)}
                      onChange={() => toggleSelection(due.id)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  )}

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center hidden sm:flex ${due.status === 'pending_verification' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                    {due.status === 'pending_verification' ? <Clock size={14} /> : <AlertTriangle size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{due.invoice_number}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(due.due_date).toLocaleDateString('id-ID')}
                      {due.status === 'pending_verification' && <span className="ml-2 text-amber-600 font-bold">• Menunggu Konfirmasi</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(due.amount)}
                  </p>
                  {due.status !== 'pending_verification' && !selectedDueIds.includes(due.id) && (
                    <button
                      onClick={() => handleCreatePayment(due.id)}
                      className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-slate-200 transition"
                    >
                      Bayar
                    </button>
                  )}
                </div>
              </div>
            ))}

            {dues.length > 5 && (
              <p className="text-xs text-center text-slate-500">+{dues.length - 5} tagihan lainnya</p>
            )}
          </div>
        )}

        {/* Floating Bulk Pay Button */}
        {selectedDueIds.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
            <button
              onClick={() => handleCreatePayment()}
              className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 ring-4 ring-white dark:ring-[#1E1E1E]"
            >
              Bayar {selectedDueIds.length} Tagihan
              <span className="bg-blue-500 px-2 py-0.5 rounded text-xs">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalSelectedAmount)}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Konfirmasi Pembayaran ({selectedDueIds.length} Item)</h3>
            <div className="bg-slate-50 dark:bg-[#252525] p-3 rounded-lg mb-4 max-h-32 overflow-y-auto">
              <p className="text-sm text-slate-500 mb-1">Invoices: <span className="font-mono text-xs text-slate-900 dark:text-white">{selectedInvoices}</span></p>
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-[#333] pt-2 mt-2">
                <span className="text-sm font-medium">Total Bayar:</span>
                <p className="text-lg font-bold text-blue-600">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalSelectedAmount)}
                </p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === 'transfer' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    Transfer Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    Tunai (Cash)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {paymentMethod === 'transfer' ? 'Bukti Transfer' : 'Bukti Serah Terima / Foto Uang'}
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {paymentMethod === 'transfer'
                    ? 'Format: JPG, PNG, PDF. Maks 5MB.'
                    : 'Upload foto saat menyerahkan uang tunai ke Bendahara.'}
                </p>
              </div>

              {paymentMethod === 'cash' && (
                <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <p>Pastikan Anda mengupload foto bukti penyerahan uang tunai.</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowPaymentModal(false); setProofFile(null); setSelectedDueIds([]); }} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium">Batal</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                  {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default InternalDashboard
