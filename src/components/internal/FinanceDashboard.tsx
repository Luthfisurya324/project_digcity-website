import React, { useState, useEffect, useMemo } from 'react'
import { financeAPI, FinanceTransaction, duesAPI, MemberDue } from '../../lib/supabase'
import {
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    TrendingUp,
    PieChart,
    Calendar,
    ArrowRight,
    AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface FinanceDashboardProps {
    userRole?: string
    userDivision?: string
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = (/* { userRole, userDivision } */) => {
    const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
    const [dues, setDues] = useState<MemberDue[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [txData, duesData] = await Promise.all([
                financeAPI.getAll(),
                duesAPI.getAll()
            ])
            setTransactions(txData)
            setDues(duesData)
        } catch (error) {
            console.error('Error loading finance data:', error)
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    // Calculations
    const totalPaidDues = useMemo(() => {
        return dues.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.amount, 0)
    }, [dues])

    const totalIncome = useMemo(() => {
        const incomeTransactions = transactions.filter(t => t.type === 'income' && (t.status === 'approved' || !t.status))
        const txTotal = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
        return txTotal + totalPaidDues
    }, [transactions, totalPaidDues])

    const totalExpense = useMemo(() =>
        transactions
            .filter(t => t.type === 'expense' && t.status === 'approved')
            .reduce((sum, t) => sum + t.amount, 0),
        [transactions]
    )

    const balance = totalIncome - totalExpense

    const monthlyTrend = useMemo(() => {
        const map = new Map<string, { income: number; expense: number; label: string }>()
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            const label = d.toLocaleDateString('id-ID', { month: 'short' })
            map.set(key, { income: 0, expense: 0, label })
        }

        transactions.forEach((t) => {
            const date = new Date(t.date)
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            if (map.has(key)) {
                const entry = map.get(key)!
                if (t.type === 'income' && (t.status === 'approved' || !t.status)) entry.income += t.amount
                if (t.type === 'expense' && t.status === 'approved') entry.expense += t.amount
            }
        })

        // Add dues to monthly trend (using created_at or due_date as proxy for payment date since we don't track payment date explicitly yet)
        // Ideally we should track payment_date. For now, let's use updated_at or created_at if status is paid.
        // Since we don't have updated_at in the interface shown in previous turn (it showed created_at), 
        // we might have to approximate or just leave it out of the trend chart for now to avoid inaccuracy, 
        // OR use due_date. Let's use due_date for now as it's the closest thing we have to a relevant date.
        dues.forEach((d) => {
            if (d.status === 'paid') {
                const date = new Date(d.due_date)
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                if (map.has(key)) {
                    map.get(key)!.income += d.amount
                }
            }
        })

        return Array.from(map.values())
    }, [transactions, dues])

    const expenseByCategory = useMemo(() => {
        const map = new Map<string, number>()
        transactions
            .filter(t => t.type === 'expense' && t.status === 'approved')
            .forEach(t => {
                const current = map.get(t.category) || 0
                map.set(t.category, current + t.amount)
            })

        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1]) // Sort by amount desc
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
            }))
    }, [transactions, totalExpense])

    const recentDues = useMemo(() => {
        return dues
            .filter(d => d.status === 'paid')
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
    }, [dues])

    const recentTransactions = useMemo(() => {
        return [...transactions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
    }, [transactions])

    const maxTrendValue = Math.max(...monthlyTrend.map(m => Math.max(m.income, m.expense)), 1)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Keuangan</h1>
                <p className="text-slate-500 dark:text-slate-400">Ringkasan performa keuangan organisasi</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg shadow-blue-200 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-4 opacity-90">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Wallet size={20} />
                        </div>
                        <span className="font-medium">Total Saldo</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-1">{formatCurrency(balance)}</h2>
                    <p className="text-sm opacity-80">Update Realtime</p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <ArrowUpRight size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Pemasukan</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{formatCurrency(totalIncome)}</h2>
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Total Akumulatif</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                            <ArrowDownRight size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Pengeluaran</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{formatCurrency(totalExpense)}</h2>
                    <p className="text-xs text-rose-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Total Akumulatif</span>
                    </p>
                </div>

                {/* Dues Summary Cards */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                            <Wallet size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Total Invoice</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {dues.length}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span>Tagihan diterbitkan</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Belum Lunas</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {dues.filter(d => d.status !== 'paid').length}
                    </h2>
                    <p className="text-xs text-rose-600 flex items-center gap-1">
                        <span>Tagihan outstanding</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                            <Wallet size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Piutang</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {formatCurrency(dues.filter(d => d.status !== 'paid').reduce((sum, d) => sum + d.amount, 0))}
                    </h2>
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                        <span>Potensi pemasukan</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Wallet size={20} />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Kas Masuk</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {formatCurrency(totalPaidDues)}
                    </h2>
                    <p className="text-xs text-indigo-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Dari Anggota</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Tren Arus Kas (6 Bulan)</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-slate-500">Masuk</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <span className="text-slate-500">Keluar</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
                        {monthlyTrend.map((month, idx) => (
                            <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                    <div className="text-emerald-400">In: {formatCurrency(month.income)}</div>
                                    <div className="text-rose-400">Out: {formatCurrency(month.expense)}</div>
                                </div>

                                <div className="flex gap-1 h-full items-end justify-center w-full">
                                    <div
                                        className="w-full max-w-[20px] bg-emerald-500/80 hover:bg-emerald-500 rounded-t transition-all"
                                        style={{ height: `${Math.max((month.income / maxTrendValue) * 100, 4)}%` }}
                                    ></div>
                                    <div
                                        className="w-full max-w-[20px] bg-rose-500/80 hover:bg-rose-500 rounded-t transition-all"
                                        style={{ height: `${Math.max((month.expense / maxTrendValue) * 100, 4)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500 text-center mt-2">{month.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Kategori Pengeluaran</h3>
                        <PieChart size={18} className="text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        {expenseByCategory.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-8">Belum ada data pengeluaran.</p>
                        ) : (
                            expenseByCategory.slice(0, 5).map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                                        <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-[#2A2A2A] rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-rose-500 h-full rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 text-right">{item.percentage.toFixed(1)}%</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Dues */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Riwayat Iuran Terbaru</h3>
                        <Link to="/finance/dues" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                        {recentDues.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-8">Belum ada data iuran.</p>
                        ) : (
                            recentDues.map((d) => (
                                <div key={d.id} className="p-4 hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 flex items-center justify-center">
                                            <Wallet size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {d.member_name}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(d.created_at)}</span>
                                                <span>•</span>
                                                <span>{d.division}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                        +{formatCurrency(d.amount)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Transaksi Terakhir</h3>
                        <Link to="/finance" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                        {recentTransactions.map((t) => (
                            <div key={t.id} className="p-4 hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income'
                                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                        : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                                        }`}>
                                        {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{t.description || t.category}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(t.date)}</span>
                                            <span>•</span>
                                            <span>{t.category}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                    }`}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinanceDashboard
