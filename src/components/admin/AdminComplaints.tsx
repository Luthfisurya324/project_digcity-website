import React, { useEffect, useState } from 'react'
import { complaintsAPI, type Complaint } from '../../lib/supabase'
import { AlertCircle, Filter, RefreshCw, Calendar, FolderOpen, Download, FileText, FileSpreadsheet, ChevronDown, ChevronUp, Copy, X } from 'lucide-react'
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
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

      <div className="bg-white rounded-2xl border border-secondary-200 overflow-x-hidden">
        <table className="min-w-full w-full text-sm table-fixed">
          <thead>
            <tr className="text-left text-secondary-600">
              <th className="px-4 py-3 sticky top-0 bg-white w-40">Tanggal</th>
              <th className="px-4 py-3 sticky top-0 bg-white w-44">Tiket</th>
              <th className="px-4 py-3 sticky top-0 bg-white w-40">Kategori</th>
              <th className="px-4 py-3 sticky top-0 bg-white w-48 hidden sm:table-cell">Identitas</th>
              <th className="px-4 py-3 sticky top-0 bg-white w-[320px] hidden md:table-cell">Deskripsi</th>
              <th className="px-4 py-3 sticky top-0 bg-white w-32 hidden sm:table-cell">Lampiran</th>
              <th className="px-4 py-3 sticky top-0 bg-white w-40">Status</th>
              <th className="px-4 py-3 sticky top-0 bg-white w-28">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-secondary-600">Memuat...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-secondary-600">Tidak ada data</td></tr>
            ) : (
              items.map((it) => (
                <React.Fragment key={it.id}>
                  <tr
                    className="border-t border-secondary-100 hover:bg-secondary-50 cursor-pointer"
                    onClick={(e) => {
                      const el = e.target as HTMLElement
                      if (el.closest('select, a, button')) return
                      setExpandedId(expandedId === it.id ? null : it.id)
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" title={new Date(it.created_at).toLocaleString()}>
                        <Calendar size={14} />
                        <div className="leading-tight">
                          <div className="text-xs">{new Date(it.created_at).toLocaleDateString()}</div>
                          <div className="text-[11px] text-secondary-600">{new Date(it.created_at).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono truncate max-w-[160px] overflow-hidden" title={it.ticket_number}>{it.ticket_number}</td>
                    <td className="px-4 py-3 break-words">{it.category}</td>
                    <td className="px-4 py-3 break-words hidden sm:table-cell">{it.anonymous ? 'Anonim' : `${it.name || '-'} / ${it.npm || '-'}`}</td>
                    <td className="px-4 py-3 max-w-[320px] hidden md:table-cell"><div className="line-clamp-2">{it.description}</div></td>
                    <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setExpandedId(expandedId === it.id ? null : it.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-100 text-xs"
                      >
                        {expandedId === it.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {expandedId === it.id ? 'Tutup' : 'Buka'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === it.id && (
                    <tr className="bg-secondary-50">
                      <td colSpan={8} className="px-4 py-4 overflow-visible">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-secondary-600">Tiket:</span>
                            <span className="font-mono text-sm">{it.ticket_number}</span>
                            <button
                              onClick={() => copyToClipboard(it.ticket_number)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-secondary-300 text-secondary-700 hover:bg-secondary-100 text-xs"
                            >
                              <Copy size={12} /> Salin
                            </button>
                            <button
                              onClick={() => setExpandedId(null)}
                              className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded border border-secondary-300 text-secondary-700 hover:bg-secondary-100 text-xs"
                            >
                              <X size={12} /> Tutup Detil
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 min-w-0">
                              <div className="text-secondary-600 text-xs">Kategori</div>
                              <div className="text-sm">{it.category}</div>
                              <div className="text-secondary-600 text-xs mt-3">Waktu</div>
                              <div className="text-sm">{new Date(it.created_at).toLocaleString()}</div>
                              <div className="text-secondary-600 text-xs mt-3">Status</div>
                              <div>
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
                              </div>
                              <div className="text-secondary-600 text-xs mt-3">Identitas</div>
                              <div className="text-sm">
                                {it.anonymous ? 'Anonim' : (
                                  <div className="space-y-1">
                                    <div>{it.name || '-'}</div>
                                    <div>{it.npm || '-'}</div>
                                    <div>
                                      {it.contact_email ? (
                                        <a href={`mailto:${it.contact_email}`} className="text-primary-700 hover:underline">{it.contact_email}</a>
                                      ) : (
                                        '-' 
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <div className="text-secondary-600 text-xs">Deskripsi</div>
                              <div className="text-sm whitespace-pre-wrap break-all md:break-words w-full max-w-full pr-2">{it.description}</div>
                              <div className="text-secondary-600 text-xs mt-3">Lampiran</div>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(it.attachments) && it.attachments.length > 0 ? (
                                  it.attachments.map((url, idx) => (
                                    <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border border-secondary-300 text-primary-700 hover:bg-secondary-100 text-xs">
                                      <FolderOpen size={12} /> Lampiran {idx + 1}
                                    </a>
                                  ))
                                ) : (
                                  <span className="text-secondary-500 text-sm">Tidak ada lampiran</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminComplaints
