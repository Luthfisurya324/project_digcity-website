import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { OrganizationMember, MemberKPI, kpiAPI } from '../../lib/supabase'
import { X, Download, Upload, FileSpreadsheet, AlertCircle, Check, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'

interface KPIImportModalProps {
    members: OrganizationMember[]
    kpis: MemberKPI[]
    period: string
    onClose: () => void
    onSave: () => void
}

const KPIImportModal: React.FC<KPIImportModalProps> = ({ members, kpis, period, onClose, onSave }) => {
    const [step, setStep] = useState<'upload' | 'preview'>('upload')
    const [selectedDivision, setSelectedDivision] = useState<string>('')
    const [file, setFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [importing, setImporting] = useState(false)

    // Extract unique divisions
    const divisions = Array.from(new Set(members.map(m => m.division))).sort()

    const handleDownloadTemplate = () => {
        // Filter members if division selected
        const targetMembers = selectedDivision
            ? members.filter(m => m.division === selectedDivision && m.status === 'active')
            : members.filter(m => m.status === 'active')

        // Create data for template
        const data = targetMembers.map(m => ({
            NPM: m.npm,
            Name: m.full_name,
            Division: m.division,
            'Project Score (0-100)': 0,
            'Attitude Score (0-100)': 0,
            'Skill Score (0-100)': 0,
            Notes: ''
        }))

        if (data.length === 0) {
            // Empty template if no members
            data.push({
                NPM: 'Example: 123456',
                Name: 'John Doe',
                Division: 'Division Name',
                'Project Score (0-100)': 80,
                'Attitude Score (0-100)': 85,
                'Skill Score (0-100)': 90,
                Notes: 'Good job'
            })
        }

        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'KPI Template')
        const fileName = `KPI_Template_${selectedDivision || 'All'}_${period.replace('/', '-')}.xlsx`
        XLSX.writeFile(wb, fileName)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFile(file)
        setError('')
        setLoading(true)

        const reader = new FileReader()
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result
                const wb = XLSX.read(bstr, { type: 'binary' })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws)
                validateAndPreview(data)
            } catch (err) {
                console.error(err)
                setError('Gagal membaca file. Pastikan format Excel benar.')
                setLoading(false)
            }
        }
        reader.readAsBinaryString(file)
    }

    const validateAndPreview = (data: any[]) => {
        // Validate columns
        const requiredCols = ['NPM', 'Project Score (0-100)', 'Attitude Score (0-100)', 'Skill Score (0-100)']
        if (data.length === 0) {
            setError('File kosong.')
            setLoading(false)
            return
        }

        const firstRow = data[0]
        const missing = requiredCols.filter(col => !Object.keys(firstRow).includes(col))

        if (missing.length > 0) {
            setError(`Kolom tidak lengkap: ${missing.join(', ')}`)
            setLoading(false)
            return
        }

        // Map to preview format
        const mapped = data.map((row: any) => {
            const member = members.find(m => m.npm === String(row['NPM']))
            return {
                npm: row['NPM'],
                name: member?.full_name || row['Name'] || 'Unknown',
                member_id: member?.id,
                division: member?.division || row['Division'] || '-',
                project: Number(row['Project Score (0-100)']) || 0,
                attitude: Number(row['Attitude Score (0-100)']) || 0,
                skill: Number(row['Skill Score (0-100)']) || 0,
                notes: row['Notes'] || '',
                status: member ? 'valid' : 'invalid'
            }
        })

        setPreviewData(mapped)
        setStep('preview')
        setLoading(false)
    }

    const handleImport = async () => {
        setImporting(true)
        try {
            const validRows = previewData.filter(r => r.status === 'valid')

            const updates = validRows.map(async (row) => {
                // Find existing KPI to preserve attendance score
                const existingKPI = kpis.find(k => k.member_id === row.member_id)

                await kpiAPI.upsert({
                    id: existingKPI?.id,
                    member_id: row.member_id,
                    period,
                    attendance_score: existingKPI?.attendance_score || 0,
                    project_score: row.project,
                    attitude_score: row.attitude,
                    skill_score: row.skill,
                    notes: row.notes
                })
            })

            await Promise.all(updates)
            onSave()
            onClose()
            alert(`Berhasil mengimpor ${validRows.length} data KPI.`)
        } catch (err) {
            console.error(err)
            alert('Gagal mengimpor data.')
        } finally {
            setImporting(false)
        }
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-200 dark:border-[#2A2A2A] flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import KPI</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {step === 'upload' ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/30">
                                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                    <Download size={18} />
                                    Langkah 1: Download Template
                                </h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                                    Pilih divisi untuk mengunduh template Excel yang sudah berisi daftar anggota.
                                </p>
                                <div className="flex gap-3">
                                    <select
                                        value={selectedDivision}
                                        onChange={(e) => setSelectedDivision(e.target.value)}
                                        className="flex-1 px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-blue-200 dark:border-blue-800 rounded-lg text-sm"
                                    >
                                        <option value="">Semua Divisi</option>
                                        {divisions.map(div => (
                                            <option key={div} value={div}>{div}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleDownloadTemplate}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                                    >
                                        Download Template
                                    </button>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-slate-300 dark:border-[#2A2A2A] rounded-xl p-8 text-center hover:border-blue-500 transition-colors relative">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={loading}
                                />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center text-slate-500">
                                        {loading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {loading ? 'Memproses file...' : 'Upload file Excel/CSV'}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Drag & drop atau klik untuk memilih file
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Preview Data</h3>
                                <div className="text-sm text-slate-500">
                                    Total: {previewData.length} | Valid: {previewData.filter(r => r.status === 'valid').length}
                                </div>
                            </div>

                            <div className="border border-slate-200 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-[#232323] border-b border-slate-200 dark:border-[#2A2A2A]">
                                        <tr>
                                            <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">NPM</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Nama</th>
                                            <th className="px-4 py-3 font-medium text-slate-500 text-center">Project</th>
                                            <th className="px-4 py-3 font-medium text-slate-500 text-center">Attitude</th>
                                            <th className="px-4 py-3 font-medium text-slate-500 text-center">Skill</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                                        {previewData.slice(0, 10).map((row, i) => (
                                            <tr key={i} className={row.status === 'invalid' ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                                <td className="px-4 py-3">
                                                    {row.status === 'valid' ? (
                                                        <Check size={16} className="text-emerald-500" />
                                                    ) : (
                                                        <AlertCircle size={16} className="text-red-500" />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.npm}</td>
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{row.name}</td>
                                                <td className="px-4 py-3 text-center">{row.project}</td>
                                                <td className="px-4 py-3 text-center">{row.attitude}</td>
                                                <td className="px-4 py-3 text-center">{row.skill}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {previewData.length > 10 && (
                                    <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 dark:bg-[#232323] border-t border-slate-200 dark:border-[#2A2A2A]">
                                        ...dan {previewData.length - 10} baris lainnya
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-[#2A2A2A] flex justify-end gap-3 bg-slate-50 dark:bg-[#232323]">
                    {step === 'preview' ? (
                        <>
                            <button
                                onClick={() => {
                                    setStep('upload')
                                    setFile(null)
                                    setPreviewData([])
                                }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#2A2A2A] rounded-xl transition-colors font-medium"
                                disabled={importing}
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={importing || previewData.filter(r => r.status === 'valid').length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                {importing && <Loader2 size={16} className="animate-spin" />}
                                Import Data
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#2A2A2A] rounded-xl transition-colors font-medium"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}

export default KPIImportModal
