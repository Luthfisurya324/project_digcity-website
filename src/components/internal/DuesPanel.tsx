import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, Wallet, Calendar, Plus, Pencil, Trash2, Download, TrendingUp, User, ChevronRight, ArrowLeft, Clock, Users, Filter, CheckSquare, Square, X, AlertTriangle, ExternalLink, XCircle } from 'lucide-react'
import { duesAPI, membersAPI, MemberDue, OrganizationMember, supabase, auditAPI, orgAPI, type OrganizationDivision } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'

interface DuesPanelProps {
  onFinanceUpdate: () => void
  userRole: string
}

const statusLabels: Record<MemberDue['status'], string> = {
  unpaid: 'Belum Bayar',
  partial: 'Cicil',
  paid: 'Lunas',
  pending_verification: 'Menunggu Konfirmasi'
}

const statusColors: Record<MemberDue['status'], string> = {
  unpaid: 'bg-rose-100 text-rose-700',
  partial: 'bg-amber-100 text-amber-700',
  paid: 'bg-emerald-100 text-emerald-700',
  pending_verification: 'bg-amber-100 text-amber-700'
}

const useDivisionOptions = () => {
  const [options, setOptions] = React.useState<string[]>([])
  React.useEffect(() => {
    const load = async () => {
      try {
        const list = await orgAPI.getStructure(null)
        const names = list.map((d: OrganizationDivision) => d.name)
        setOptions(names.length ? names : ['Inti'])
      } catch {
        setOptions(['Inti'])
      }
    }
    load()
  }, [])
  return options
}

const generateInvoiceNumber = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `INV/${year}/${month}/${rand}`
}

const MemberDuesForm: React.FC<{
  onClose: () => void
  onSuccess: () => void
  due?: MemberDue | null
  preselectedMemberId?: string
}> = ({ onClose, onSuccess, due, preselectedMemberId }) => {
  const { notify } = useNotifications()
  const divisionOptions = useDivisionOptions()
  const [members, setMembers] = useState<OrganizationMember[]>([])

  // Mode: Single or Bulk (Only if creating new)
  const [mode, setMode] = useState<'single' | 'bulk'>(due ? 'single' : 'single')

  // Single Mode State
  const [memberId, setMemberId] = useState(due?.member_id || preselectedMemberId || '')
  const [memberName, setMemberName] = useState(due?.member_name || '')
  const [division, setDivision] = useState(due?.division || 'Inti')

  // Bulk Mode State
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(preselectedMemberId ? [preselectedMemberId] : [])
  const [bulkDivisionFilter, setBulkDivisionFilter] = useState<string>('all')

  // Common State
  const [amount, setAmount] = useState(due ? String(due.amount) : '')
  const [dueDate, setDueDate] = useState(due?.due_date ? due.due_date.slice(0, 10) : new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState<MemberDue['status']>(due?.status || 'unpaid')
  const [notes, setNotes] = useState(due?.notes || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await membersAPI.getAll()
        setMembers(data)

        // Auto-fill details if preselected member (Single Mode)
        if (preselectedMemberId && !due) {
          const selected = data.find(m => m.id === preselectedMemberId)
          if (selected) {
            setMemberName(selected.full_name)
            setDivision(selected.division || 'Inti')
          }
        }
      } catch (error) {
        console.error('Failed to load members:', error)
      }
    }
    loadMembers()
  }, [preselectedMemberId, due])

  // Helper for Single Mode
  const handleMemberChange = (id: string) => {
    setMemberId(id)
    if (!id) return
    const selected = members.find((m) => m.id === id)
    if (selected) {
      setMemberName(selected.full_name)
      setDivision(selected.division || 'Inti')
    }
  }

  // Helper for Bulk Mode
  const filteredBulkMembers = useMemo(() => {
    if (bulkDivisionFilter === 'all') return members
    return members.filter(m => m.division === bulkDivisionFilter)
  }, [members, bulkDivisionFilter])

  const toggleMemberSelection = (id: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    const ids = filteredBulkMembers.map(m => m.id)
    // If all currently filtered are selected, deselect them. Otherwise, select all.
    const allSelected = ids.every(id => selectedMemberIds.includes(id))

    if (allSelected) {
      setSelectedMemberIds(prev => prev.filter(id => !ids.includes(id)))
    } else {
      // Add missing ones
      const newIds = [...selectedMemberIds]
      ids.forEach(id => {
        if (!newIds.includes(id)) newIds.push(id)
      })
      setSelectedMemberIds(newIds)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      if (mode === 'single') {
        const invoiceNumber = due?.invoice_number || generateInvoiceNumber()
        if (due) {
          await duesAPI.update(due.id, {
            member_id: memberId || null,
            member_name: memberName,
            division,
            amount: Number(amount),
            due_date: dueDate,
            status,
            notes,
            transaction_id: null
          })
          notify({ type: 'success', title: 'Iuran diperbarui', message: `${memberName} • Rp ${Number(amount).toLocaleString('id-ID')}` })
        } else {
          await duesAPI.create({
            member_id: memberId || null,
            member_name: memberName || 'Anggota Tanpa Nama',
            division,
            amount: Number(amount),
            due_date: dueDate,
            status,
            invoice_number: invoiceNumber,
            notes,
            transaction_id: null
          })
          notify({ type: 'info', title: 'Tagihan iuran dibuat', message: `${memberName || 'Tanpa Nama'} • Rp ${Number(amount).toLocaleString('id-ID')}` })
        }
      } else {
        // BULK MODE
        if (selectedMemberIds.length === 0) {
          alert('Pilih minimal satu anggota.')
          setLoading(false)
          return
        }

        // Create dues sequentially or parallel
        let count = 0
        for (const mId of selectedMemberIds) {
          const member = members.find(m => m.id === mId)
          if (!member) continue

          await duesAPI.create({
            member_id: member.id,
            member_name: member.full_name,
            division: member.division || 'Inti',
            amount: Number(amount),
            due_date: dueDate,
            status: status, // Typically unpaid for bulk
            invoice_number: generateInvoiceNumber(), // Unique for each
            notes: notes,
            transaction_id: null
          })
          count++
          await auditAPI.log({ module: 'finance', action: 'create_due_bulk', entity_type: 'member_due', details: { member: member.full_name, amount: Number(amount) } })
        }
        notify({ type: 'success', title: 'Tagihan Masal Dibuat', message: `${count} tagihan berhasil dibuat.` })
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to save due:', error)
      alert('Gagal menyimpan iuran.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#2A2A2A] shrink-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {due ? 'Edit Iuran' : 'Buat Tagihan Iuran'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Mode Toggle (Only for new dues) */}
            {!due && (
              <div className="bg-slate-100 dark:bg-[#2A2A2A] p-1 rounded-lg flex mb-4">
                <button
                  type="button"
                  onClick={() => setMode('single')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'single' ? 'bg-white dark:bg-[#1E1E1E] shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Satu Anggota
                </button>
                <button
                  type="button"
                  onClick={() => setMode('bulk')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'bulk' ? 'bg-white dark:bg-[#1E1E1E] shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users size={14} /> Tagihan Masal
                  </div>
                </button>
              </div>
            )}

            {/* SINGLE MODE MEMBER SELECTION */}
            {mode === 'single' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pilih Anggota</label>
                  <select
                    value={memberId}
                    onChange={(e) => handleMemberChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                  >
                    <option value="">Pilih anggota atau isi manual</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>{member.full_name} • {member.division}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Penanggung</label>
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                    placeholder="Nama anggota"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Divisi</label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                  >
                    {divisionOptions.map((div) => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* BULK MODE MEMBER SELECTION */}
            {mode === 'bulk' && !due && (
              <div className="space-y-3 border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-4 bg-slate-50 dark:bg-[#252525]">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Pilih Anggota ({selectedMemberIds.length})</label>
                  <button type="button" onClick={() => setSelectedMemberIds([])} className="text-xs text-rose-600 hover:underline">Reset</button>
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Filter size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <select
                      value={bulkDivisionFilter}
                      onChange={(e) => setBulkDivisionFilter(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1E1E1E]"
                    >
                      <option value="all">Semua Divisi ({members.length})</option>
                      {divisionOptions.map(d => (
                        <option key={d} value={d}>Divisi {d} ({members.filter(m => m.division === d).length})</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-3 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    Pilih Semua
                  </button>
                </div>

                {/* Checklist */}
                <div className="max-h-[150px] overflow-y-auto space-y-1 bg-white dark:bg-[#1E1E1E] rounded-lg border border-slate-200 dark:border-[#2A2A2A] p-2">
                  {filteredBulkMembers.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-2">Tidak ada anggota.</p>
                  ) : filteredBulkMembers.map(m => (
                    <label key={m.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.includes(m.id)}
                        onChange={() => toggleMemberSelection(m.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{m.full_name}</span>
                      <span className="text-xs text-slate-400 ml-auto">{m.division}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-[#252525] p-3 rounded-lg border border-slate-200 dark:border-[#2A2A2A] -mx-2 px-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Detail Tagihan {mode === 'bulk' && '(Berlaku untuk semua)'}</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                    placeholder="Contoh: 50000"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jatuh Tempo</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status Awal</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as MemberDue['status'])}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                    >
                      <option value="unpaid">Belum Bayar</option>
                      <option value="partial">Cicil</option>
                      <option value="paid">Lunas</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catatan</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                    placeholder="Contoh: Iuran Wajib Bulan Desember"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600">Batal</button>
              <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 disabled:opacity-60">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle2 size={18} />}
                Simpan {mode === 'bulk' && `(${selectedMemberIds.length})`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Bulk Delete Modal Component
const BulkDeleteModal: React.FC<{
  dues: MemberDue[]
  onClose: () => void
  onSuccess: () => void
}> = ({ dues, onClose, onSuccess }) => {
  const { notify } = useNotifications()
  const [loading, setLoading] = useState<string | null>(null)

  // Group unpaid dues by date, sorted Desc
  const dateGroups = useMemo(() => {
    const unpaid = dues.filter(d => d.status !== 'paid')
    const groups: Record<string, { date: string, count: number, ids: string[] }> = {}

    unpaid.forEach(d => {
      const date = d.due_date.slice(0, 10)
      if (!groups[date]) {
        groups[date] = { date, count: 0, ids: [] }
      }
      groups[date].count++
      groups[date].ids.push(d.id)
    })

    return Object.values(groups).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [dues])

  const handleDelete = async (date: string, ids: string[]) => {
    if (!window.confirm(`Yakin hapus ${ids.length} tagihan untuk tanggal ${date}?`)) return

    setLoading(date)
    try {
      // Delete in parallel or bulk
      // Since API might not support bulk delete, we loop in parallel
      await Promise.all(ids.map(id => duesAPI.delete(id)))

      notify({ type: 'success', title: 'Hapus Masal Berhasil', message: `${ids.length} tagihan telah dihapus.` })
      onSuccess()
    } catch (error) {
      console.error('Bulk delete failed:', error)
      alert('Gagal menghapus beberapa data.')
    } finally {
      setLoading(null)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trash2 size={18} className="text-rose-500" /> Hapus Tagihan Masal
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
        <div className="p-5">
          <div className="bg-rose-50 text-rose-800 p-3 rounded-lg text-sm mb-4 flex gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>Hanya tagihan <strong>BELUM LUNAS</strong> yang muncul di sini. Penghapusan tidak bisa dibatalkan.</p>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {dateGroups.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>Tidak ada tagihan aktif untuk dihapus.</p>
              </div>
            ) : (
              dateGroups.map(group => (
                <div key={group.date} className="flex items-center justify-between p-3 border border-slate-100 dark:border-[#2A2A2A] rounded-lg bg-slate-50 dark:bg-[#252525]">
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {new Date(group.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500">{group.count} Tagihan</p>
                  </div>
                  <button
                    onClick={() => handleDelete(group.date, group.ids)}
                    disabled={!!loading}
                    className="px-3 py-1.5 bg-white dark:bg-[#1E1E1E] border border-rose-200 text-rose-600 rounded text-xs font-semibold hover:bg-rose-50 disabled:opacity-50"
                  >
                    {loading === group.date ? 'Menghapus...' : 'Hapus semua'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-[#2A2A2A] bg-slate-50 dark:bg-[#252525] flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Tutup</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

const MemberDuesPanel: React.FC<DuesPanelProps> = ({ onFinanceUpdate, userRole }) => {
  const [dues, setDues] = useState<MemberDue[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pendingOnly, setPendingOnly] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showBulkDelete, setShowBulkDelete] = useState(false)
  const [editingDue, setEditingDue] = useState<MemberDue | null>(null)

  // New State for Drill-down View
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [preselectedMemberFormId, setPreselectedMemberFormId] = useState<string | undefined>(undefined)

  useEffect(() => {
    loadDues()
  }, [])

  const loadDues = async () => {
    try {
      const data = await duesAPI.getAll()
      setDues(data)
    } catch (error) {
      console.error('Failed to load dues:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group Dues by Member (Only Active/Unpaid)
  const memberDebts = useMemo(() => {
    const activeDues = dues.filter(d => d.status !== 'paid')
    const groups: Record<string, { member_id: string, member_name: string, division: string, total: number, count: number, hasPending: boolean, dues: MemberDue[] }> = {}

    activeDues.forEach(due => {
      const key = due.member_id || due.member_name
      if (!groups[key]) {
        groups[key] = {
          member_id: due.member_id || '',
          member_name: due.member_name,
          division: due.division || 'Unknown',
          total: 0,
          count: 0,
          hasPending: false,
          dues: []
        }
      }
      groups[key].total += due.amount
      groups[key].count += 1
      if (due.status === 'pending_verification') groups[key].hasPending = true
      groups[key].dues.push(due)
    })

    return Object.values(groups)
      .filter(g => g.member_name.toLowerCase().includes(search.toLowerCase()))
      .filter(g => !pendingOnly || g.hasPending)
      .sort((a, b) => {
        // Sort by pending status first, then by total
        if (pendingOnly) return b.total - a.total
        if (a.hasPending !== b.hasPending) return a.hasPending ? -1 : 1
        return b.total - a.total
      })

  }, [dues, search, pendingOnly])

  // Get Detail Data for Selected Member
  const selectedDetails = useMemo(() => {
    if (!selectedMemberId) return null
    const group = memberDebts.find(g => (g.member_id || g.member_name) === selectedMemberId)
    if (group) {
      const sortedDues = [...group.dues].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      return { ...group, dues: sortedDues }
    }
    return null
  }, [selectedMemberId, memberDebts])


  const summary = useMemo(() => {
    const total = dues.length
    const outstanding = dues.filter((due) => due.status !== 'paid').length
    const totalOutstanding = dues.filter((due) => due.status !== 'paid').reduce((sum, due) => sum + due.amount, 0)
    const paidAmount = dues.filter((due) => due.status === 'paid').reduce((sum, due) => sum + due.amount, 0)
    return { total, outstanding, totalOutstanding, paidAmount }
  }, [dues])

  const handleStatusChange = async (due: MemberDue, status: MemberDue['status']) => {
    try {
      const updates: Partial<MemberDue> = { status }
      await duesAPI.update(due.id, updates)
      await loadDues()
    } catch (error) {
      console.error('Failed to update due status:', error)
      alert('Gagal memperbarui status iuran.')
    }
  }

  const handleDelete = async (due: MemberDue) => {
    if (!window.confirm('Hapus iuran ini?')) return
    try {
      await duesAPI.delete(due.id)
      await loadDues()
    } catch (error) {
      console.error('Failed to delete due:', error)
    }
  }

  const handleInvoicePrint = (due: MemberDue) => {
    const win = window.open('', '_blank', 'width=800,height=600')
    if (!win) return
    win.document.write(`
      <html>
        <head>
          <title>${due.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            td { padding: 8px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Invoice Iuran Anggota</h1>
          <p>Nomor Invoice: <strong>${due.invoice_number}</strong></p>
          <table>
            <tr><td>Nama Anggota</td><td>${due.member_name}</td></tr>
            <tr><td>Divisi</td><td>${due.division}</td></tr>
            <tr><td>Jumlah</td><td>Rp ${new Intl.NumberFormat('id-ID').format(due.amount)}</td></tr>
            <tr><td>Jatuh Tempo</td><td>${new Date(due.due_date).toLocaleDateString('id-ID')}</td></tr>
            <tr><td>Status</td><td>${statusLabels[due.status]}</td></tr>
          </table>
          <p style="margin-top:24px;">Silakan lakukan pembayaran ke rekening bendahara DIGCITY dan unggah bukti di portal internal.</p>
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    win.print()
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-6 mt-8">
        <p className="text-slate-500 text-sm">Memuat data iuran...</p>
      </div>
    )
  }

  // DETAIL VIEW
  if (selectedMemberId && selectedDetails) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedMemberId(null)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedDetails.member_name}</h2>
            <p className="text-sm text-slate-500">Detail Tagihan Belum Lunas</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-500">Total Tagihan</p>
            <p className="text-xl font-bold text-rose-600">Rp {new Intl.NumberFormat('id-ID').format(selectedDetails.total)}</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl flex items-start gap-3 text-sm">
          <Clock size={18} className="mt-0.5 shrink-0" />
          <p>Tagihan diurutkan dari yang <strong>paling lama</strong> jatuh temponya. Disarankan untuk melunasi secara berurutan.</p>
        </div>

        <div className="space-y-3">
          {selectedDetails.dues.map((due, index) => {
            const isOverdue = due.due_date < new Date().toISOString().slice(0, 10);
            const isPending = due.status === 'pending_verification';

            return (
              <div key={due.id} className={`bg-white dark:bg-[#1E1E1E] rounded-xl border ${isPending ? 'border-amber-300 ring-2 ring-amber-100 ring-offset-0 dark:ring-amber-900/30' : 'border-slate-200 dark:border-[#2A2A2A]'} p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm relative overflow-hidden`}>
                {/* Visual clue for oldest unpaid */}
                {index === 0 && !isPending && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-[#2A2A2A] px-2 py-0.5 rounded">{due.invoice_number}</span>
                    {isPending && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Clock size={10} /> Konfirmasi Pembayaran</span>}
                    {isOverdue && !isPending && <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">TERLAMBAT</span>}
                  </div>
                  <div className="flex items-center justify-between md:justify-start md:gap-8">
                    <div>
                      <p className="text-xs text-slate-500">Jatuh Tempo</p>
                      <p className={`font-medium ${isOverdue && !isPending ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {new Date(due.due_date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Nominal</p>
                      <p className="font-bold text-slate-900 dark:text-white">Rp {new Intl.NumberFormat('id-ID').format(due.amount)}</p>
                    </div>
                  </div>
                  {due.notes && <p className="text-xs text-slate-500 italic mt-2">"{due.notes}"</p>}

                  {/* Proof Section */}
                  {isPending && (
                    <div className="mt-3 bg-slate-50 dark:bg-[#252525] p-2 rounded-lg text-sm">
                      <p className="text-xs text-slate-500 mb-1">Metode: <span className="font-medium text-slate-700 capitalize">{due.payment_method || 'Unknown'}</span></p>
                      {due.proof_url ? (
                        <a href={due.proof_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                          <ExternalLink size={14} /> Lihat Bukti Transfer
                        </a>
                      ) : (
                        due.payment_method === 'cash' ? <span className="text-amber-600 italic">Pembayaran Tunai ke Bendahara</span> : <span className="text-slate-400 italic">Tidak ada bukti lampiran</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {userRole === 'bph' ? (
                    isPending ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm('Tolak pembayaran ini? Status akan kembali menjadi Belum Bayar.')) {
                              handleStatusChange(due, 'unpaid')
                            }
                          }}
                          className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-sm font-semibold flex items-center gap-1 transition"
                        >
                          <XCircle size={16} /> Tolak
                        </button>
                        <button
                          onClick={() => handleStatusChange(due, 'paid')}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1 transition shadow-sm hover:shadow"
                        >
                          <CheckCircle2 size={16} /> Terima (Lunas)
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(due, 'paid')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm hover:shadow"
                      >
                        <CheckCircle2 size={16} /> Bayar
                      </button>
                    )
                  ) : (
                    <span className="text-xs text-slate-400 italic">View Only</span>
                  )}
                  <div className="flex">
                    <button onClick={() => { setEditingDue(due); setShowForm(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(due)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={18} /></button>
                    <button onClick={() => handleInvoicePrint(due)} className="p-2 text-slate-400 hover:text-slate-600"><Download size={18} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add New within Detail View */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              setEditingDue(null)
              setPreselectedMemberFormId(selectedDetails.member_id)
              setShowForm(true)
            }}
            className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded-lg transition"
          >
            <Plus size={16} /> Tambah Tagihan Manual untuk {selectedDetails.member_name}
          </button>
        </div>

        {showForm && (
          <MemberDuesForm
            due={editingDue}
            preselectedMemberId={preselectedMemberFormId}
            onClose={() => {
              setShowForm(false)
              setEditingDue(null)
              setPreselectedMemberFormId(undefined)
            }}
            onSuccess={() => {
              loadDues()
              onFinanceUpdate()
            }}
          />
        )}
      </div>
    )
  }

  // MAIN GRID VIEW
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Iuran Anggota</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola tagihan per anggota</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 sticky top-0 bg-slate-50 dark:bg-[#0e0e0e] z-10 py-2">
        <div className="flex-1 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama anggota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPendingOnly(!pendingOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border ${pendingOnly
              ? 'bg-amber-100 text-amber-700 border-amber-200'
              : 'bg-white dark:bg-[#1E1E1E] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#2A2A2A] hover:bg-slate-50 dark:hover:bg-[#252525]'}`}
          >
            <Clock size={16} />
            {pendingOnly ? 'Menampilkan: Menunggu Konfirmasi' : 'Filter: Menunggu Konfirmasi'}
          </button>
          {userRole === 'bph' && (
            <>
              <button
                onClick={() => {
                  setEditingDue(null)
                  setPreselectedMemberFormId(undefined)
                  setShowForm(true)
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-emerald-700 transition"
              >
                <Plus size={16} /> Tagih Iuran
              </button>
              <button
                onClick={() => setShowBulkDelete(true)}
                className="p-2 sm:px-4 sm:py-2 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-xl transition-colors"
                title="Hapus Masal"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
          <p className="text-xs text-slate-400">Total Outstanding</p>
          <p className="text-lg font-bold text-rose-600">Rp {new Intl.NumberFormat('id-ID').format(summary.totalOutstanding)}</p>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
          <p className="text-xs text-slate-400">Total Kas Masuk</p>
          <p className="text-lg font-bold text-emerald-600">Rp {new Intl.NumberFormat('id-ID').format(summary.paidAmount)}</p>
        </div>
      </div>

      {/* Member Debt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberDebts.map((group) => (
          <div
            key={group.member_id || group.member_name}
            onClick={() => setSelectedMemberId(group.member_id || group.member_name)}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-5 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.01] group relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  {group.member_name}
                  {group.hasPending && <span title="Menunggu Konfirmasi" className="block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>}
                </h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <User size={12} /> {group.division}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-[#252525] flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ChevronRight size={18} />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Total Tagihan</span>
                <span className="text-xl font-bold text-rose-600 group-hover:underline decoration-rose-200 underline-offset-4">
                  Rp {new Intl.NumberFormat('id-ID').format(group.total)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block mb-0.5">Jumlah Invoice</span>
                <span className="text-sm font-semibold bg-rose-50 dark:bg-rose-900/20 text-rose-600 px-2 py-1 rounded inline-block">
                  {group.count} Item
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {memberDebts.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-200" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Semua Bersih!</p>
          <p>Tidak ada tagihan yang belum dibayar.</p>
        </div>
      )}

      {showForm && (
        <MemberDuesForm
          due={editingDue}
          preselectedMemberId={preselectedMemberFormId}
          onClose={() => {
            setShowForm(false)
            setEditingDue(null)
            setPreselectedMemberFormId(undefined)
          }}
          onSuccess={() => {
            loadDues()
            onFinanceUpdate()
          }}
        />
      )}

      {showBulkDelete && (
        <BulkDeleteModal
          dues={dues}
          onClose={() => setShowBulkDelete(false)}
          onSuccess={() => {
            loadDues()
            onFinanceUpdate()
            setShowBulkDelete(false)
          }}
        />
      )}
    </div>
  )
}

export default MemberDuesPanel
