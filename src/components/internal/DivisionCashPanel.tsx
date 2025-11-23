import React, { useEffect, useMemo, useState } from 'react'
import { FinanceTransaction } from '../../lib/supabase'
import { Wallet, ArrowUpRight, ArrowDownRight, Calendar, Plus, X } from 'lucide-react'

const STORAGE_KEY = 'division-cash-list'
const DEFAULT_DIVISIONS = ['Kas Inti']

interface DivisionCashPanelProps {
  transactions: FinanceTransaction[]
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

const DivisionCashPanel: React.FC<DivisionCashPanelProps> = ({ transactions }) => {
  const [divisionList, setDivisionList] = useState<string[]>([])
  const [newDivision, setNewDivision] = useState('')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setDivisionList(parsed.filter(Boolean).map((d) => d.trim()).filter((d) => d && d !== 'Kas Inti'))
        }
      }
    } catch (error) {
      console.error('Failed to load division list:', error)
    } finally {
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (!initialized || divisionList.length > 0) return
    const derived = Array.from(
      new Set(
        transactions
          .map((t) => t.sub_account)
          .filter((name): name is string => Boolean(name) && name !== 'Kas Inti')
      )
    )
    if (derived.length > 0) {
      setDivisionList(derived)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(derived))
      }
    }
  }, [initialized, divisionList.length, transactions])

  const persistDivisions = (list: string[]) => {
    setDivisionList(list)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    }
  }

  const finalDivisionNames = useMemo(() => {
    const base = Array.from(new Set([...DEFAULT_DIVISIONS, ...divisionList]))
    const detected = new Set(
      transactions
        .map((t) => t.sub_account || 'Kas Inti')
        .filter((name) => name && !base.includes(name))
    )
    return [...base, ...Array.from(detected)]
  }, [divisionList, transactions])

  const summary = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>()
    finalDivisionNames.forEach((name) => map.set(name, { income: 0, expense: 0 }))

    transactions.forEach((t) => {
      const key = t.sub_account || 'Kas Inti'
      if (!map.has(key)) map.set(key, { income: 0, expense: 0 })
      const entry = map.get(key)!
      if (t.type === 'income' && (t.status === 'approved' || !t.status)) entry.income += t.amount
      if (t.type === 'expense' && t.status === 'approved') entry.expense += t.amount
    })

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense
    }))
  }, [transactions, finalDivisionNames])

  const [activeSubAccount, setActiveSubAccount] = useState(finalDivisionNames[0] || 'Kas Inti')

  useEffect(() => {
    if (!summary.find((item) => item.name === activeSubAccount)) {
      setActiveSubAccount(summary[0]?.name || 'Kas Inti')
    }
  }, [summary, activeSubAccount])

  const handleAddDivision = () => {
    const name = newDivision.trim()
    if (!name || name.toLowerCase() === 'kas inti') return
    if (divisionList.includes(name)) {
      setNewDivision('')
      return
    }
    const updated = [...divisionList, name]
    persistDivisions(updated)
    setNewDivision('')
  }

  const handleRemoveDivision = (name: string) => {
    const updated = divisionList.filter((div) => div !== name)
    persistDivisions(updated)
  }

  const subAccountTransactions = useMemo(
    () =>
      transactions
        .filter((t) => (t.sub_account || 'Kas Inti') === activeSubAccount)
        .slice(0, 5),
    [transactions, activeSubAccount]
  )

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] bg-white dark:bg-[#101010]">
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Kelola Daftar Divisi</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Tambahkan atau hapus divisi untuk memantau kas program kerja. Secara default hanya Kas Inti yang aktif.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newDivision}
            onChange={(e) => setNewDivision(e.target.value)}
            placeholder="Nama divisi (contoh: Riset & Inovasi)"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
          />
          <button
            onClick={handleAddDivision}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 text-sm font-semibold"
          >
            <Plus size={16} /> Tambah Divisi
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {divisionList.length === 0 ? (
            <span className="text-xs text-slate-500">Belum ada divisi tambahan.</span>
          ) : (
            divisionList.map((div) => (
              <span
                key={div}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E1E1E] text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1"
              >
                {div}
                <button onClick={() => handleRemoveDivision(div)} className="text-slate-400 hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveSubAccount(item.name)}
            className={`p-4 rounded-xl border text-left transition-colors ${
              activeSubAccount === item.name
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-[#2A2A2A] bg-white dark:bg-[#101010]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">{item.name}</p>
              <Wallet size={16} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Saldo</p>
            <p className={`text-xl font-bold ${item.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(item.balance)}
            </p>
            <div className="flex items-center justify-between text-xs mt-3">
              <span className="flex items-center gap-1 text-emerald-600">
                <ArrowUpRight size={12} /> {formatCurrency(item.income)}
              </span>
              <span className="flex items-center gap-1 text-rose-600">
                <ArrowDownRight size={12} /> {formatCurrency(item.expense)}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-4 bg-slate-50 dark:bg-[#151515]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-500">Riwayat {activeSubAccount}</p>
            <h4 className="font-semibold text-slate-900 dark:text-white">Transaksi Terbaru</h4>
          </div>
          <span className="text-xs text-slate-500">{subAccountTransactions.length} entri</span>
        </div>

        {subAccountTransactions.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada transaksi untuk sub kas ini.</p>
        ) : (
          <div className="space-y-2">
            {subAccountTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between bg-white dark:bg-[#1E1E1E] rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.description || t.category}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar size={12} />
                    {formatDate(t.date)}
                  </div>
                </div>
                <p className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DivisionCashPanel

