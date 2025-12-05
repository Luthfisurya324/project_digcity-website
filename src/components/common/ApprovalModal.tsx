import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, X } from 'lucide-react'

interface ApprovalModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (amount: number) => void
    title: string
    message: string
    initialAmount: number
    loading?: boolean
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    initialAmount,
    loading = false
}) => {
    const [amount, setAmount] = useState(initialAmount)

    useEffect(() => {
        setAmount(initialAmount)
    }, [initialAmount, isOpen])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onConfirm(amount)
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-[#2A2A2A]">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        {message}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Jumlah Disetujui (Rp)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-[#1A1A1A] dark:text-white"
                                autoFocus
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Setujui
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ApprovalModal
