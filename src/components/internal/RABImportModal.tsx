import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Upload, FileSpreadsheet, AlertCircle, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { WorkProgramBudget, budgetAPI } from '../../lib/supabase'

interface RABImportModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    programId: string
}

const RABImportModal: React.FC<RABImportModalProps> = ({ isOpen, onClose, onSuccess, programId }) => {
    const [step, setStep] = useState<'upload' | 'preview'>('upload')
    const [parsedData, setParsedData] = useState<Partial<WorkProgramBudget>[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    if (!isOpen) return null

    const handleDownloadTemplate = () => {
        const template = [
            {
                'Nama Item': 'Contoh: Sewa Tenda',
                'Kategori': 'Perlengkapan',
                'Harga Satuan': 500000,
                'Jumlah': 2
            },
            {
                'Nama Item': 'Contoh: Konsumsi Peserta',
                'Kategori': 'Konsumsi',
                'Harga Satuan': 25000,
                'Jumlah': 100
            }
        ]

        const ws = XLSX.utils.json_to_sheet(template)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Template RAB')
        XLSX.writeFile(wb, 'template_rab.xlsx')
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && selectedFile.type !== 'application/vnd.ms-excel') {
                setError('Format file harus Excel (.xlsx atau .xls)')
                return
            }
            setError(null)
            parseFile(selectedFile)
        }
    }

    const parseFile = async (file: File) => {
        setIsProcessing(true)
        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

            const formattedData: Partial<WorkProgramBudget>[] = jsonData.map((row) => ({
                program_id: programId,
                item_name: row['Nama Item'] || row['nama item'] || row['Item'] || '',
                category: row['Kategori'] || row['kategori'] || 'Umum',
                unit_price: Number(row['Harga Satuan'] || row['harga satuan'] || row['Harga'] || 0),
                quantity: Number(row['Jumlah'] || row['jumlah'] || row['Qty'] || 1),
                status: 'planned' as const,
                total_price: Number(row['Harga Satuan'] || 0) * Number(row['Jumlah'] || 1)
            })).filter(item => item.item_name) // Filter empty rows

            if (formattedData.length === 0) {
                setError('Tidak ada data valid yang ditemukan dalam file.')
            } else {
                setParsedData(formattedData)
                setStep('preview')
            }
        } catch (err) {
            console.error('Error parsing file:', err)
            setError('Gagal membaca file. Pastikan format sesuai template.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleImport = async () => {
        setIsProcessing(true)
        try {
            // Add total_price calculation just to be safe
            const finalData = parsedData.map(item => ({
                ...item,
                total_price: (item.unit_price || 0) * (item.quantity || 1)
            })) as Omit<WorkProgramBudget, 'id' | 'created_at' | 'updated_at'>[]

            await budgetAPI.bulkCreate(finalData)
            onSuccess()
            onClose()
        } catch (err) {
            console.error('Error importing data:', err)
            setError('Gagal mengimpor data ke database.')
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        setStep('upload')
        setParsedData([])
        setError(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Import RAB</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {step === 'upload' ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
                                <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm mb-1">Panduan Import</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Gunakan template yang disediakan untuk memastikan format data sesuai.
                                        Kolom yang wajib diisi: <strong>Nama Item, Kategori, Harga Satuan, Jumlah</strong>.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-[#333] transition-colors"
                                >
                                    <Download size={18} />
                                    Download Template Excel
                                </button>
                            </div>

                            <div
                                className="border-2 border-dashed border-slate-300 dark:border-[#2A2A2A] rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                />
                                <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <FileSpreadsheet size={32} />
                                </div>
                                <p className="text-slate-900 dark:text-white font-medium mb-1">
                                    Klik untuk upload file Excel
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Format .xlsx atau .xls
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Preview Data</h4>
                                    <p className="text-sm text-slate-500">{parsedData.length} item ditemukan</p>
                                </div>
                                <button
                                    onClick={reset}
                                    className="text-sm text-slate-500 hover:text-blue-600"
                                >
                                    Upload Ulang
                                </button>
                            </div>

                            <div className="border border-slate-200 dark:border-[#2A2A2A] rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-[#2A2A2A] text-slate-500">
                                        <tr>
                                            <th className="px-4 py-2">Item</th>
                                            <th className="px-4 py-2">Kategori</th>
                                            <th className="px-4 py-2 text-right">Harga</th>
                                            <th className="px-4 py-2 text-center">Qty</th>
                                            <th className="px-4 py-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                                        {parsedData.slice(0, 5).map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2">{item.item_name}</td>
                                                <td className="px-4 py-2">{item.category}</td>
                                                <td className="px-4 py-2 text-right">{item.unit_price?.toLocaleString()}</td>
                                                <td className="px-4 py-2 text-center">{item.quantity}</td>
                                                <td className="px-4 py-2 text-right">{item.total_price?.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {parsedData.length > 5 && (
                                    <div className="p-2 text-center text-xs text-slate-500 bg-slate-50 dark:bg-[#2A2A2A]">
                                        ...dan {parsedData.length - 5} item lainnya
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-[#2A2A2A] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        disabled={isProcessing}
                    >
                        Batal
                    </button>
                    {step === 'preview' && (
                        <button
                            onClick={handleImport}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Import {parsedData.length} Item
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}

export default RABImportModal
