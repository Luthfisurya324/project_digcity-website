import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Upload, Download, FileSpreadsheet, AlertCircle, Check, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { financeAPI, supabase } from '../../lib/supabase'

interface FinanceImportModalProps {
    onClose: () => void
    onSuccess: () => void
}

interface ImportRow {
    Date: string
    Type: string
    Amount: number
    Category: string
    Description: string
    SubAccount?: string
}

const FinanceImportModal: React.FC<FinanceImportModalProps> = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState<'upload' | 'preview'>('upload')
    const [file, setFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<ImportRow[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDownloadTemplate = () => {
        const headers = ['Date', 'Type', 'Amount', 'Category', 'Description', 'SubAccount']
        const exampleRow = ['2024-01-31', 'income', 500000, 'Uang Kas', 'Iuran Januari', 'Kas Inti']
        const exampleRow2 = ['2024-02-01', 'expense', 150000, 'Konsumsi', 'Rapat Bulanan', 'Kas Inti']

        const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow, exampleRow2])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Template')
        XLSX.writeFile(wb, 'finance_import_template.xlsx')
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            parseFile(selectedFile)
        }
    }

    const parseFile = async (file: File) => {
        setLoading(true)
        setError(null)
        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json<ImportRow>(worksheet)

            // Basic validation
            if (jsonData.length === 0) {
                throw new Error('File kosong atau format tidak sesuai.')
            }

            const validatedData = jsonData.map((row, index) => {
                if (!row.Date || !row.Type || !row.Amount || !row.Category) {
                    throw new Error(`Baris ${index + 2}: Data tidak lengkap (Date, Type, Amount, Category wajib diisi).`)
                }

                // Normalize Type
                const type = row.Type.toLowerCase()
                if (type !== 'income' && type !== 'expense' && type !== 'pemasukan' && type !== 'pengeluaran') {
                    throw new Error(`Baris ${index + 2}: Tipe harus 'income'/'pemasukan' atau 'expense'/'pengeluaran'.`)
                }

                return {
                    ...row,
                    Type: (type === 'pemasukan') ? 'income' : (type === 'pengeluaran') ? 'expense' : type
                }
            })

            setPreviewData(validatedData)
            setStep('preview')
        } catch (err: any) {
            setError(err.message || 'Gagal memproses file.')
            setFile(null)
        } finally {
            setLoading(false)
        }
    }

    const handleImport = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('User not authenticated')

            const transactions = previewData.map(row => ({
                date: row.Date, // Assuming YYYY-MM-DD from Excel or handled correctly
                type: row.Type as 'income' | 'expense',
                amount: Number(row.Amount),
                category: row.Category,
                description: row.Description || '',
                sub_account: row.SubAccount || 'Kas Inti',
                created_by: user.id,
                status: 'approved' as const // Auto-approve imported transactions? Or pending? Let's assume approved for bulk import convenience.
            }))

            await financeAPI.bulkCreate(transactions)
            onSuccess()
            onClose()
        } catch (err: any) {
            console.error('Import error:', err)
            setError('Gagal menyimpan data ke database.')
        } finally {
            setLoading(false)
        }
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Import Transaksi
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {step === 'upload' ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
                                <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
                                <div className="text-sm text-blue-800 dark:text-blue-300">
                                    <p className="font-semibold mb-1">Panduan Import:</p>
                                    <ul className="list-disc list-inside space-y-1 opacity-90">
                                        <li>Gunakan template yang disediakan agar format sesuai.</li>
                                        <li>Format Tanggal: YYYY-MM-DD (Contoh: 2024-01-31).</li>
                                        <li>Tipe: 'income' (Pemasukan) atau 'expense' (Pengeluaran).</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-slate-300 dark:border-[#2A2A2A] rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors relative">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={loading}
                                />
                                <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                                </div>
                                <p className="text-slate-900 dark:text-white font-medium mb-1">
                                    {loading ? 'Memproses file...' : 'Klik atau drag file Excel di sini'}
                                </p>
                                <p className="text-sm text-slate-500">Format .xlsx atau .xls</p>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <FileSpreadsheet size={16} />
                                    Download Template Excel
                                </button>
                            </div>

                            {error && (
                                <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-slate-900 dark:text-white">Preview Data ({previewData.length} baris)</h4>
                                <button
                                    onClick={() => { setStep('upload'); setFile(null); setPreviewData([]); }}
                                    className="text-sm text-slate-500 hover:text-slate-700"
                                >
                                    Ganti File
                                </button>
                            </div>

                            <div className="border border-slate-200 dark:border-[#2A2A2A] rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-[#232323] text-slate-500 dark:text-slate-400 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2">Date</th>
                                            <th className="px-4 py-2">Type</th>
                                            <th className="px-4 py-2">Category</th>
                                            <th className="px-4 py-2">Amount</th>
                                            <th className="px-4 py-2">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                                        {previewData.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#232323]">
                                                <td className="px-4 py-2">{row.Date}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${row.Type === 'income'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                        }`}>
                                                        {row.Type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{row.Category}</td>
                                                <td className="px-4 py-2 font-mono">{row.Amount.toLocaleString('id-ID')}</td>
                                                <td className="px-4 py-2 text-slate-500 truncate max-w-[200px]">{row.Description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-[#2A2A2A] bg-slate-50 dark:bg-[#232323]/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#2A2A2A] border border-transparent hover:border-slate-200 dark:hover:border-[#2A2A2A] rounded-lg transition-all"
                    >
                        Batal
                    </button>
                    {step === 'preview' && (
                        <button
                            onClick={handleImport}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Check size={18} />
                            )}
                            Import Data
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}

export default FinanceImportModal
