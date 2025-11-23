import React, { useEffect, useState } from 'react'
import { complaintsAPI, type Complaint } from '../../lib/supabase'
import { AlertCircle, Filter, RefreshCw, Calendar, FolderOpen, Download, FileText, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'

const CATEGORIES = [
  'Dosen dan pengajaran',
  'Mata kuliah dan kurikulum',
  'Pembayaran dan administrasi',
  'Fasilitas kampus',
  'Masalah lainnya'
]

const STATUSES: Complaint['status'][] = ['baru', 'diproses', 'selesai', 'ditolak']

const AdminComplaints: React.FC = () => {
  const [items, setItems] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await complaintsAPI.list({
        category: category || undefined,
        status: (status as Complaint['status']) || undefined,
        from: from || undefined,
        to: to || undefined
      })
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    complaintsAPI
      .list()
      .then((data) => setItems(data))
      .catch((e) => setError(e instanceof Error ? e.message : 'Gagal memuat data'))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, s: Complaint['status']) => {
    setUpdatingId(id)
    setError(null)
    try {
      const updated = await complaintsAPI.updateStatus(id, s)
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const escapeCsv = (value: unknown) => {
    const str = value == null ? '' : String(value)
    return '"' + str.replace(/"/g, '""') + '"'
  }

  const exportCSV = () => {
    const headers = ['Tanggal','Tiket','Kategori','Anonim','Nama','NPM','Email','Lampiran','Status','Deskripsi']
    const rows = items.map((it) => {
      const dateStr = new Date(it.created_at).toISOString()
      const attach = Array.isArray(it.attachments) ? it.attachments.join(';') : ''
      return [
        escapeCsv(dateStr),
        escapeCsv(it.ticket_number),
        escapeCsv(it.category),
        escapeCsv(it.anonymous ? 'Ya' : 'Tidak'),
        escapeCsv(it.name || ''),
        escapeCsv(it.npm || ''),
        escapeCsv(it.contact_email || ''),
        escapeCsv(attach),
        escapeCsv(it.status),
        escapeCsv(it.description)
      ].join(',')
    })
    const csv = [headers.join(','), ...rows].join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    a.href = URL.createObjectURL(blob)
    a.download = `complaints-report-${yyyy}${mm}${dd}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    a.href = URL.createObjectURL(blob)
    a.download = `complaints-report-${yyyy}${mm}${dd}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const exportExcel = () => {
    const rows = items.map((it) => ({
      Tanggal: new Date(it.created_at).toLocaleString(),
      Tiket: it.ticket_number,
      Kategori: it.category,
      Anonim: it.anonymous ? 'Ya' : 'Tidak',
      Nama: it.name || '',
      NPM: it.npm || '',
      Email: it.contact_email || '',
      Lampiran: Array.isArray(it.attachments) ? it.attachments.join(';') : '',
      Status: it.status,
      Deskripsi: it.description
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Keluhan')
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    XLSX.writeFile(wb, `complaints-report-${yyyy}${mm}${dd}.xlsx`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-primary-600" size={20} />
          <h2 className="text-xl font-semibold">Keluhan Mahasiswa</h2>
        </div>
        <div className="md:ml-auto flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-secondary-600 mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Semua</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-secondary-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Semua</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-secondary-600 mb-1">Dari</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-secondary-600 mb-1">Sampai</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm" />
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-50 text-sm">
            <Filter size={16} />
            Terapkan
          </button>
          <button onClick={() => { setCategory(''); setStatus(''); setFrom(''); setTo(''); load() }} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-50 text-sm">
            <RefreshCw size={16} />
            Reset
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-50 text-sm">
            <Download size={16} />
            Export CSV
          </button>
          <button onClick={exportJSON} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-50 text-sm">
            <FileText size={16} />
            Export JSON
          </button>
          <button onClick={exportExcel} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-50 text-sm">
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-secondary-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-secondary-600">
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Tiket</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Identitas</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Lampiran</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-secondary-600">Memuat...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-secondary-600">Tidak ada data</td></tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="border-t border-secondary-100">
                  <td className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><Calendar size={14} /><span>{new Date(it.created_at).toLocaleString()}</span></div></td>
                  <td className="px-4 py-3 font-mono whitespace-nowrap">{it.ticket_number}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{it.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{it.anonymous ? 'Anonim' : `${it.name || '-'} / ${it.npm || '-'}`}</td>
                  <td className="px-4 py-3 max-w-[380px]"><div className="line-clamp-3">{it.description}</div></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {it.attachments && it.attachments.length > 0 ? (
                      <a href={it.attachments[0]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary-700 hover:underline"><FolderOpen size={14} />Lihat</a>
                    ) : (
                      <span className="text-secondary-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={it.status}
                      onChange={(e) => updateStatus(it.id, e.target.value as Complaint['status'])}
                      disabled={updatingId === it.id}
                      className="rounded-lg border border-secondary-300 bg-white px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminComplaints
