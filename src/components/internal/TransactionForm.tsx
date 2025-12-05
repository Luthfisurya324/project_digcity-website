import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { financeAPI, supabase, FinanceTransaction, auditAPI } from '../../lib/supabase'
import { X, Upload, Check } from 'lucide-react'

interface TransactionFormProps {
  onClose: () => void
  onSuccess: () => void
  mode?: 'create' | 'edit'
  transaction?: FinanceTransaction | null
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSuccess, mode = 'create', transaction }) => {
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'income')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [category, setCategory] = useState(transaction?.category || '')
  const [description, setDescription] = useState(transaction?.description || '')
  const [date, setDate] = useState(transaction?.date ? transaction.date.slice(0, 10) : new Date().toISOString().slice(0, 10))
  const [proofUrl, setProofUrl] = useState(transaction?.proof_url || '')
  const [subAccount, setSubAccount] = useState(transaction?.sub_account || 'Kas Inti')
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>(transaction?.status || (transaction?.type === 'expense' ? 'pending' : 'approved'))
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const categories = useMemo(() => ({
    income: ['Uang Kas', 'Sponsorship', 'Donasi', 'Penjualan Merchandise', 'Lainnya'],
    expense: ['Konsumsi', 'Transportasi', 'Perlengkapan', 'Sewa Tempat', 'Operasional Divisi', 'Lainnya']
  }), [])

  const categoryOptions = useMemo(() => {
    const options = categories[type]
    if (category && !options.includes(category)) {
      return [category, ...options]
    }
    return options
  }, [categories, type, category])

  useEffect(() => {
    if (mode === 'edit' && transaction) {
      setType(transaction.type)
      setAmount(String(transaction.amount))
      setCategory(transaction.category)
      setDescription(transaction.description)
      setDate(transaction.date ? transaction.date.slice(0, 10) : new Date().toISOString().slice(0, 10))
      setProofUrl(transaction.proof_url || '')
      setSubAccount(transaction.sub_account || 'Kas Inti')
      setStatus(transaction.status || (transaction.type === 'expense' ? 'pending' : 'approved'))
    } else if (mode === 'create') {
      setType('income')
      setAmount('')
      setCategory('')
      setDescription('')
      setDate(new Date().toISOString().slice(0, 10))
      setProofUrl('')
      setSubAccount('Kas Inti')
      setStatus('approved')
    }
  }, [mode, transaction])

  useEffect(() => {
    if (mode === 'create') {
      setStatus(type === 'income' ? 'approved' : 'pending')
    }
  }, [mode, type])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    try {
      const file = e.target.files[0]
      const publicUrl = await financeAPI.uploadProof(file)
      setProofUrl(publicUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Gagal mengunggah bukti. Silakan coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      if (mode === 'edit' && transaction) {
        await financeAPI.update(transaction.id, {
          type,
          amount: Number(amount),
          category,
          description,
          date,
          proof_url: proofUrl,
          sub_account: subAccount,
          status
        })
        await auditAPI.log({
          module: 'finance',
          action: 'update_transaction',
          entity_type: 'transaction',
          entity_id: transaction.id,
          details: { amount: Number(amount), type, category }
        })
      } else {
        const newTx = await financeAPI.create({
          type,
          amount: Number(amount),
          category,
          description,
          date,
          proof_url: proofUrl,
          sub_account: subAccount,
          created_by: user.id,
          status
        })
        if (newTx) {
          await auditAPI.log({
            module: 'finance',
            action: 'create_transaction',
            entity_type: 'transaction',
            entity_id: newTx.id,
            details: { amount: Number(amount), type, category }
          })
        }
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert('Gagal menyimpan transaksi. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {mode === 'edit' ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selector */}
          <div className="flex bg-slate-100 dark:bg-[#2A2A2A] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'income'
                ? 'bg-white dark:bg-[#1E1E1E] text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'expense'
                ? 'bg-white dark:bg-[#1E1E1E] text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              Pengeluaran
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
            >
              <option value="">Pilih Kategori</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keterangan</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              placeholder="Tambahkan detail transaksi..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bukti Transaksi</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white text-sm"
                placeholder="https://..."
                readOnly={uploading}
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <button
                  type="button"
                  className={`px-3 py-2 bg-slate-100 dark:bg-[#2A2A2A] text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors ${uploading ? 'opacity-50' : ''}`}
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload size={20} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Upload gambar atau PDF (max 5MB)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              disabled={mode !== 'edit' && type === 'expense'}
              className={`w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white ${mode !== 'edit' && type === 'expense' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <option value="approved">Disetujui</option>
              <option value="pending">Menunggu</option>
              <option value="rejected">Ditolak</option>
            </select>
            {type === 'expense' && mode !== 'edit' && (
              <p className="text-xs text-slate-500 mt-1">Pengeluaran baru otomatis menunggu persetujuan bendahara.</p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Check size={18} />
              )}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default TransactionForm