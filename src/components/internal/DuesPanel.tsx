import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, Wallet, Calendar, Plus, Pencil, Trash2, Download, TrendingUp } from 'lucide-react'
import { duesAPI, membersAPI, MemberDue, OrganizationMember, supabase, auditAPI, orgAPI, type OrganizationDivision } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'

interface DuesPanelProps {
  onFinanceUpdate: () => void
}

const statusLabels: Record<MemberDue['status'], string> = {
  unpaid: 'Belum Bayar',
  partial: 'Cicil',
  paid: 'Lunas'
}

const statusColors: Record<MemberDue['status'], string> = {
  unpaid: 'bg-rose-100 text-rose-700',
  partial: 'bg-amber-100 text-amber-700',
  paid: 'bg-emerald-100 text-emerald-700'
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
}> = ({ onClose, onSuccess, due }) => {
  const { notify } = useNotifications()
  const divisionOptions = useDivisionOptions()
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [memberId, setMemberId] = useState(due?.member_id || '')
  const [memberName, setMemberName] = useState(due?.member_name || '')
  const [division, setDivision] = useState(due?.division || 'Inti')
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
      } catch (error) {
        console.error('Failed to load members:', error)
      }
    }
    loadMembers()
  }, [])

  const handleMemberChange = (id: string) => {
    setMemberId(id)
    if (!id) return
    const selected = members.find((m) => m.id === id)
    if (selected) {
      setMemberName(selected.full_name)
      setDivision(selected.division || 'Inti')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // Generate invoice number for new dues
      const invoiceNumber = due?.invoice_number || generateInvoiceNumber()

      // Handle Transaction Logic - REMOVED as per request
      // if (status === 'paid') {
      //   if (!transactionId) {
      //     // Create transaction if becoming paid and no transaction exists
      //     const tx = await financeAPI.create({
      //       type: 'income',
      //       amount: Number(amount),
      //       category: 'Iuran Anggota',
      //       description: `Pembayaran ${memberName} (${invoiceNumber})`,
      //       date: new Date().toISOString().slice(0, 10),
      //       sub_account: `Kas ${division}`,
      //       created_by: user.id
      //     })
      //     transactionId = tx.id
      //   }
      // } else {
      //   if (transactionId) {
      //     // Delete transaction if becoming unpaid/partial
      //     await financeAPI.delete(transactionId)
      //     transactionId = null
      //   }
      // }

      if (due) {
        await duesAPI.update(due.id, {
          member_id: memberId || null,
          member_name: memberName,
          division,
          amount: Number(amount),
          due_date: dueDate,
          status,
          notes,
          transaction_id: null // Ensure transaction_id is cleared or ignored
        })
        notify({ type: 'success', title: 'Iuran diperbarui', message: `${memberName} • Rp ${Number(amount).toLocaleString('id-ID')}` })
        await auditAPI.log({ module: 'finance', action: 'update_due', entity_type: 'member_due', entity_id: due.id, details: { status, amount: Number(amount) } })
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
        await auditAPI.log({ module: 'finance', action: 'create_due', entity_type: 'member_due', details: { division, amount: Number(amount), due_date: dueDate } })
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
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{due ? 'Edit Iuran' : 'Buat Tagihan Iuran'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
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
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
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
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
              placeholder="Contoh: Belum melunasi kas semester ini"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle2 size={18} />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

const MemberDuesPanel: React.FC<DuesPanelProps> = ({ onFinanceUpdate }) => {
  const [dues, setDues] = useState<MemberDue[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid' | 'overdue' | 'partial'>('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingDue, setEditingDue] = useState<MemberDue | null>(null)

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

  const filteredDues = useMemo(() => {
    return dues.filter((due) => {
      const matchesSearch = due.member_name.toLowerCase().includes(search.toLowerCase()) || due.invoice_number.toLowerCase().includes(search.toLowerCase())
      const today = new Date().toISOString().slice(0, 10)
      const isOverdue = due.status !== 'paid' && due.due_date < today
      if (filter === 'overdue') return matchesSearch && isOverdue
      if (filter === 'paid') return matchesSearch && due.status === 'paid'
      if (filter === 'unpaid') return matchesSearch && due.status === 'unpaid'
      if (filter === 'partial') return matchesSearch && due.status === 'partial'
      return matchesSearch
    })
  }, [dues, filter, search])

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
      // Removed automatic finance transaction creation/deletion
      // if (status === 'paid' && !due.transaction_id) {
      //   ...
      // } else if (status !== 'paid' && due.transaction_id) {
      //   ...
      // }
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
      // Removed automatic finance transaction deletion
      // if (due.transaction_id) {
      //   await financeAPI.delete(due.transaction_id)
      //   await onFinanceUpdate()
      // }
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Iuran Anggota</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola invoice kas dan status pembayaran</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari invoice / nama"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-4 pr-4 py-2 rounded-lg border border-slate-200 dark:border-[#2A2A2A] dark:bg-[#1A1A1A] text-sm"
            />
          </div>
          <button
            onClick={() => {
              setEditingDue(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 text-sm font-semibold"
          >
            <Plus size={16} /> Tagih Iuran
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-slate-200 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
              <Wallet size={20} />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Total Invoice</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {summary.total}
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
            {summary.outstanding}
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
            Rp {new Intl.NumberFormat('id-ID').format(summary.totalOutstanding)}
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
            Rp {new Intl.NumberFormat('id-ID').format(summary.paidAmount)}
          </h2>
          <p className="text-xs text-indigo-600 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>Dari Anggota</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'unpaid', label: 'Belum Bayar' },
          { id: 'partial', label: 'Cicil' },
          { id: 'paid', label: 'Lunas' },
          { id: 'overdue', label: 'Terlambat' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id as typeof filter)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${filter === item.id
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white dark:bg-[#1E1E1E] border-slate-200 dark:border-[#2A2A2A] text-slate-600'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden flex flex-col max-h-[600px]">
        {filteredDues.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <AlertCircle className="mx-auto mb-2 text-slate-400" />
            Tidak ada invoice pada filter ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-[#2A2A2A] overflow-y-auto">
            {filteredDues.map((due) => {
              const overdue = due.status !== 'paid' && due.due_date < new Date().toISOString().slice(0, 10)
              return (
                <div key={due.id} className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Wallet size={18} className="text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{due.member_name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[due.status]}`}>
                          {statusLabels[due.status]}
                        </span>
                        {overdue && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">Terlambat</span>}
                      </div>
                      <p className="text-xs text-slate-500">{due.invoice_number} • {due.division}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(due.due_date).toLocaleDateString('id-ID')}</span>
                        <span>Rp {new Intl.NumberFormat('id-ID').format(due.amount)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {due.status !== 'paid' && (
                      <button
                        onClick={() => handleStatusChange(due, 'paid')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1"
                      >
                        <CheckCircle2 size={14} /> Tandai Lunas
                      </button>
                    )}
                    {due.status === 'paid' && (
                      <button
                        onClick={() => handleStatusChange(due, 'unpaid')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#1A1A1A]"
                      >
                        Batalkan
                      </button>
                    )}
                    <button onClick={() => handleInvoicePrint(due)} className="p-2 text-slate-400 hover:text-blue-600"><Download size={16} /></button>
                    <button onClick={() => { setEditingDue(due); setShowForm(true) }} className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(due)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <MemberDuesForm
          due={editingDue}
          onClose={() => {
            setShowForm(false)
            setEditingDue(null)
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

export default MemberDuesPanel
