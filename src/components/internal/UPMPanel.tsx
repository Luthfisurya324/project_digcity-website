import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { upmAPI, UPMAllocation, UPMRequest, attendanceAPI, InternalEvent } from '../../lib/supabase'
import ApprovalModal from '../common/ApprovalModal'
import ConfirmationModal from '../common/ConfirmationModal'
import {
    Plus,
    CheckCircle,
    XCircle,
    Clock,
    ChevronDown,
    ChevronUp,
    Landmark,
    Trash2
} from 'lucide-react'

const UPMPanel: React.FC = () => {
    const [allocation, setAllocation] = useState<UPMAllocation | null>(null)
    const [requests, setRequests] = useState<UPMRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showAllocationForm, setShowAllocationForm] = useState(false)
    const [programs, setPrograms] = useState<InternalEvent[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    // Modal States
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<UPMRequest | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Delete/Reject Confirmation State
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmAction, setConfirmAction] = useState<'reject' | 'disburse' | 'delete' | null>(null)

    // Form states
    const [formData, setFormData] = useState({
        program_id: '',
        description: '',
        amount_proposed: 0
    })

    const [allocationData, setAllocationData] = useState({
        period: '2024/2025',
        total_amount: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    })

    useEffect(() => {
        if (isExpanded) {
            loadData()
        }
    }, [isExpanded])

    const loadData = async () => {
        setLoading(true)
        try {
            const allocations = await upmAPI.getAllocations()
            if (allocations.length > 0) {
                setAllocation(allocations[0])
                const reqs = await upmAPI.getRequests(allocations[0].id)
                setRequests(reqs)
            }

            const events = await attendanceAPI.getEvents()
            setPrograms(events.filter(e => e.type === 'work_program'))
        } catch (error) {
            console.error('Error loading UPM data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAllocation = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (allocation) {
                await upmAPI.updateAllocation(allocation.id, {
                    total_amount: allocationData.total_amount,
                    period: allocationData.period
                })
            } else {
                await upmAPI.createAllocation(allocationData)
            }
            setShowAllocationForm(false)
            loadData()
        } catch (error) {
            console.error('Error saving allocation:', error)
            alert('Gagal menyimpan data alokasi')
        }
    }

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!allocation) return

        try {
            await upmAPI.createRequest({
                allocation_id: allocation.id,
                program_id: formData.program_id || undefined,
                description: formData.description,
                amount_proposed: formData.amount_proposed,
                submission_date: new Date().toISOString().split('T')[0]
            })
            setShowForm(false)
            setFormData({ program_id: '', description: '', amount_proposed: 0 })
            loadData()
        } catch (error) {
            console.error('Error creating request:', error)
            alert('Gagal membuat pengajuan')
        }
    }

    const handleStatusUpdate = async (id: string, status: UPMRequest['status'], amount?: number) => {
        setIsProcessing(true)
        try {
            // Update UPM Request status
            await upmAPI.updateRequestStatus(
                id,
                status,
                amount,
                status === 'disbursed' ? new Date().toISOString().split('T')[0] : undefined
            )

            loadData()
            setShowApprovalModal(false)
            setShowConfirmModal(false)
            setSelectedRequest(null)
            setConfirmAction(null)
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Gagal memperbarui status')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDeleteRequest = async (id: string) => {
        setIsProcessing(true)
        try {
            await upmAPI.deleteRequest(id)
            loadData()
            setShowConfirmModal(false)
            setSelectedRequest(null)
            setConfirmAction(null)
        } catch (error) {
            console.error('Error deleting request:', error)
            alert('Gagal menghapus pengajuan')
        } finally {
            setIsProcessing(false)
        }
    }

    const openApprovalModal = (req: UPMRequest) => {
        setSelectedRequest(req)
        setShowApprovalModal(true)
    }

    const openConfirmModal = (req: UPMRequest, action: 'reject' | 'disburse' | 'delete') => {
        setSelectedRequest(req)
        setConfirmAction(action)
        setShowConfirmModal(true)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
    }

    const totalDisbursed = requests
        .filter(r => r.status === 'disbursed')
        .reduce((sum, r) => sum + (r.amount_approved || 0), 0)

    const totalProposed = requests
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.amount_proposed, 0)

    const remainingBalance = (allocation?.total_amount || 0) - totalDisbursed

    return (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
            <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Landmark size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dana UPM (Fakultas)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Kelola pengajuan dan pencairan dana kemahasiswaan</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {allocation && (
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-500">Sisa Alokasi</p>
                            <p className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(remainingBalance)}</p>
                        </div>
                    )}
                    {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-5 border-t border-slate-200 dark:border-[#2A2A2A]">
                    {loading && !allocation ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            {!allocation ? (
                                <div className="text-center py-8 bg-slate-50 dark:bg-[#232323] rounded-xl border border-dashed border-slate-300 dark:border-[#2A2A2A]">
                                    <p className="text-slate-500 mb-4">Belum ada data alokasi UPM untuk periode ini.</p>
                                    <button
                                        onClick={() => setShowAllocationForm(true)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Set Alokasi Awal
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-[#232323] rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
                                            <p className="text-xs text-slate-500 mb-1">Total Pagu Anggaran</p>
                                            <div className="flex justify-between items-end">
                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(allocation.total_amount)}</h4>
                                                <button onClick={() => setShowAllocationForm(true)} className="text-xs text-indigo-600 hover:underline">Edit</button>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">Periode {allocation.period}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-[#232323] rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
                                            <p className="text-xs text-slate-500 mb-1">Total Dicairkan</p>
                                            <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalDisbursed)}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{requests.filter(r => r.status === 'disbursed').length} pengajuan cair</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-[#232323] rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
                                            <p className="text-xs text-slate-500 mb-1">Menunggu Persetujuan</p>
                                            <h4 className="text-xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalProposed)}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{requests.filter(r => r.status === 'pending').length} pengajuan pending</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-slate-900 dark:text-white">Riwayat Pengajuan</h4>
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
                                        >
                                            <Plus size={16} />
                                            Buat Pengajuan
                                        </button>
                                    </div>

                                    {/* Requests List */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 dark:bg-[#232323] text-slate-500">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-l-lg">Tanggal</th>
                                                    <th className="px-4 py-3">Program Kerja</th>
                                                    <th className="px-4 py-3">Keterangan</th>
                                                    <th className="px-4 py-3">Pengajuan</th>
                                                    <th className="px-4 py-3">Disetujui</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 rounded-r-lg text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                                                {requests.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Belum ada pengajuan dana UPM.</td>
                                                    </tr>
                                                ) : (
                                                    requests.map((req) => (
                                                        <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-[#232323]">
                                                            <td className="px-4 py-3 text-slate-500">{new Date(req.submission_date).toLocaleDateString('id-ID')}</td>
                                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                                {req.internal_events?.title || '-'}
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{req.description}</td>
                                                            <td className="px-4 py-3 font-medium">{formatCurrency(req.amount_proposed)}</td>
                                                            <td className="px-4 py-3 font-medium text-emerald-600">
                                                                {req.amount_approved ? formatCurrency(req.amount_approved) : '-'}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${req.status === 'disbursed' ? 'bg-emerald-100 text-emerald-700' :
                                                                    req.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                                        req.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                                            'bg-amber-100 text-amber-700'
                                                                    }`}>
                                                                    {req.status === 'disbursed' && <CheckCircle size={12} />}
                                                                    {req.status === 'approved' && <CheckCircle size={12} />}
                                                                    {req.status === 'rejected' && <XCircle size={12} />}
                                                                    {req.status === 'pending' && <Clock size={12} />}
                                                                    {req.status === 'disbursed' ? 'Cair' :
                                                                        req.status === 'approved' ? 'Disetujui' :
                                                                            req.status === 'rejected' ? 'Ditolak' : 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <div className="flex justify-end gap-2 items-center">
                                                                    {req.status === 'pending' && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => openApprovalModal(req)}
                                                                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                                                                title="Setujui"
                                                                            >
                                                                                <CheckCircle size={16} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => openConfirmModal(req, 'reject')}
                                                                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                                                                title="Tolak"
                                                                            >
                                                                                <XCircle size={16} />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {req.status === 'approved' && (
                                                                        <button
                                                                            onClick={() => openConfirmModal(req, 'disburse')}
                                                                            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
                                                                        >
                                                                            Cairkan Dana
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => openConfirmModal(req, 'delete')}
                                                                        className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                                                        title="Hapus"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Allocation Form Modal */}
            {showAllocationForm && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Pengaturan Alokasi UPM</h3>
                        <form onSubmit={handleCreateAllocation} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Periode Kepengurusan</label>
                                <input
                                    type="text"
                                    required
                                    value={allocationData.period}
                                    onChange={e => setAllocationData({ ...allocationData, period: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2A2A2A] rounded-lg dark:bg-[#1A1A1A] dark:text-white"
                                    placeholder="Contoh: 2024/2025"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Pagu Anggaran (Rp)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={allocationData.total_amount}
                                    onChange={e => setAllocationData({ ...allocationData, total_amount: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2A2A2A] rounded-lg dark:bg-[#1A1A1A] dark:text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAllocationForm(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Request Form Modal */}
            {showForm && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Buat Pengajuan UPM</h3>
                        <form onSubmit={handleSubmitRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Program Kerja (Opsional)</label>
                                <select
                                    value={formData.program_id}
                                    onChange={e => setFormData({ ...formData, program_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2A2A2A] rounded-lg dark:bg-[#1A1A1A] dark:text-white"
                                >
                                    <option value="">-- Pilih Program Kerja --</option>
                                    {programs.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keterangan / Keperluan</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2A2A2A] rounded-lg dark:bg-[#1A1A1A] dark:text-white"
                                    placeholder="Contoh: Konsumsi Rapat Akbar"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jumlah Diajukan (Rp)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.amount_proposed}
                                    onChange={e => setFormData({ ...formData, amount_proposed: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2A2A2A] rounded-lg dark:bg-[#1A1A1A] dark:text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Ajukan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Approval Modal */}
            {selectedRequest && (
                <ApprovalModal
                    isOpen={showApprovalModal}
                    onClose={() => setShowApprovalModal(false)}
                    onConfirm={(amount) => handleStatusUpdate(selectedRequest.id, 'approved', amount)}
                    title="Setujui Pengajuan"
                    message={`Masukkan jumlah dana yang disetujui untuk "${selectedRequest.description}".`}
                    initialAmount={selectedRequest.amount_proposed}
                    loading={isProcessing}
                />
            )}

            {/* Confirmation Modal for Reject/Disburse */}
            {selectedRequest && (
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={() => {
                        if (confirmAction === 'reject') handleStatusUpdate(selectedRequest.id, 'rejected')
                        if (confirmAction === 'disburse') handleStatusUpdate(selectedRequest.id, 'disbursed')
                        if (confirmAction === 'delete') handleDeleteRequest(selectedRequest.id)
                    }}
                    title={
                        confirmAction === 'reject' ? 'Tolak Pengajuan' :
                            confirmAction === 'disburse' ? 'Cairkan Dana' :
                                'Hapus Pengajuan'
                    }
                    message={
                        confirmAction === 'reject'
                            ? 'Apakah Anda yakin ingin menolak pengajuan ini?'
                            : confirmAction === 'disburse'
                                ? 'Apakah Anda yakin ingin menandai dana ini sebagai sudah cair? Tindakan ini akan mencatat tanggal pencairan.'
                                : 'Apakah Anda yakin ingin menghapus pengajuan ini? Tindakan ini tidak dapat dibatalkan.'
                    }
                    confirmText={
                        confirmAction === 'reject' ? 'Tolak' :
                            confirmAction === 'disburse' ? 'Cairkan' :
                                'Hapus'
                    }
                    type={confirmAction === 'disburse' ? 'info' : 'danger'}
                    loading={isProcessing}
                />
            )}
        </div>
    )
}

export default UPMPanel
