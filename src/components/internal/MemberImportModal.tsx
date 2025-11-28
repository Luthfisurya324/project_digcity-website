import React, { useState, useMemo } from 'react'
import { X, Upload, Check, AlertCircle, ArrowRight, ArrowLeft, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import { membersAPI, type OrganizationMember, auditAPI, memberSanctionsAPI } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'

interface MemberImportModalProps {
  onClose: () => void
  onImported: () => void
  existingMembers: OrganizationMember[]
}

// Define the fields we want to map
const DB_FIELDS = [
  { key: 'full_name', label: 'Nama Lengkap', required: true },
  { key: 'npm', label: 'NPM', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'division', label: 'Divisi', required: false },
  { key: 'position', label: 'Jabatan', required: false },
  { key: 'join_year', label: 'Angkatan', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'phone', label: 'No. Telepon', required: false },
  { key: 'gender', label: 'Jenis Kelamin', required: false },
  { key: 'class_category', label: 'Kategori Kelas', required: false },
  { key: 'class_name', label: 'Kelas', required: false },
  { key: 'city', label: 'Kota/Kabupaten', required: false },
  { key: 'province', label: 'Provinsi', required: false },
  { key: 'linkedin_url', label: 'LinkedIn', required: false },
  { key: 'instagram_handle', label: 'Instagram', required: false },
  // Sanction fields
  { key: 'sanction', label: 'Status Sanksi', required: false },
  { key: 'sanction_date', label: 'Tanggal Sanksi', required: false },
  { key: 'sanction_reason', label: 'Alasan Sanksi', required: false },
  { key: 'fix_date', label: 'Tanggal Perbaikan', required: false },
  { key: 'fix_action', label: 'Tindakan Perbaikan', required: false },
  { key: 'followup_status', label: 'Status Tindak Lanjut', required: false },
] as const

type DbFieldKey = typeof DB_FIELDS[number]['key']

type CsvRow = Partial<OrganizationMember> & {
  sanction?: string
  sanction_date?: string
  sanction_reason?: string
  fix_date?: string
  fix_action?: string
  followup_status?: string
}

const MemberImportModal: React.FC<MemberImportModalProps> = ({ onClose, onImported, existingMembers }) => {
  const { notify } = useNotifications()

  // Steps: 0 = Upload, 1 = Map Columns, 2 = Preview & Confirm
  const [step, setStep] = useState<0 | 1 | 2>(0)

  const [rawFile, setRawFile] = useState<File | null>(null)
  const [rawJson, setRawJson] = useState<Record<string, unknown>[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])

  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({}) // DbFieldKey -> CsvHeader

  const [rows, setRows] = useState<CsvRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [importedCount, setImportedCount] = useState<number>(0)
  const [duplicatesSkipped, setDuplicatesSkipped] = useState<number>(0)

  const existingIndex = useMemo(() => {
    const byEmail = new Map<string, OrganizationMember>()
    const byNpm = new Map<string, OrganizationMember>()
    const byName = new Map<string, OrganizationMember>()

    existingMembers.forEach((m) => {
      if (m.email) byEmail.set(m.email.toLowerCase(), m)
      if (m.npm) byNpm.set(m.npm, m)
      if (m.full_name) byName.set(m.full_name.toLowerCase().trim(), m)
    })
    return { byEmail, byNpm, byName }
  }, [existingMembers])

  // Auto-map columns based on similarity
  const autoMapColumns = (headers: string[]) => {
    const mapping: Record<string, string> = {}
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

    DB_FIELDS.forEach(field => {
      const fieldLabelNorm = normalize(field.label)
      const fieldKeyNorm = normalize(field.key)

      // Try to find a matching header
      const match = headers.find(h => {
        const hNorm = normalize(h)
        return hNorm === fieldLabelNorm ||
          hNorm === fieldKeyNorm ||
          (field.key === 'full_name' && (hNorm.includes('nama') || hNorm === 'name')) ||
          (field.key === 'phone' && (hNorm.includes('telepon') || hNorm.includes('wa') || hNorm.includes('whatsapp'))) ||
          (field.key === 'join_year' && hNorm.includes('angkatan')) ||
          (field.key === 'status' && hNorm.includes('status'))
      })

      if (match) {
        mapping[field.key] = match
      }
    })
    setColumnMapping(mapping)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setRawFile(file)
    setError('')

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, unknown>[]

      if (json.length === 0) {
        setError('File kosong atau format tidak valid.')
        return
      }

      const headers = Object.keys(json[0])
      setCsvHeaders(headers)
      setRawJson(json)
      autoMapColumns(headers)
      setStep(1) // Move to mapping step
    } catch (e) {
      console.error('CSV parse error:', e)
      setError('Gagal membaca file. Pastikan format Excel/CSV benar.')
    }
  }

  const processData = () => {
    // Validate required fields
    const missingRequired = DB_FIELDS.filter(f => f.required && !columnMapping[f.key])
    if (missingRequired.length > 0) {
      setError(`Mohon petakan kolom wajib: ${missingRequired.map(f => f.label).join(', ')} `)
      return
    }

    const processed: CsvRow[] = rawJson.map(row => {
      const getValue = (key: DbFieldKey) => {
        const header = columnMapping[key]
        return header ? String(row[header] || '').trim() : ''
      }

      return {
        full_name: getValue('full_name'),
        npm: getValue('npm'),
        email: getValue('email'),
        phone: getValue('phone'),
        division: getValue('division'),
        position: getValue('position'),
        join_year: parseInt(getValue('join_year') || '0') || new Date().getFullYear(),
        status: (getValue('status') || 'active') as any,
        image_url: '', // Usually not in CSV, or needs specific handling
        linkedin_url: getValue('linkedin_url'),
        instagram_handle: getValue('instagram_handle'),
        gender: getValue('gender') as any,
        class_category: getValue('class_category'),
        class_name: getValue('class_name'),
        city: getValue('city'),
        province: getValue('province'),
        // Sanctions
        sanction: getValue('sanction'),
        sanction_date: getValue('sanction_date'),
        sanction_reason: getValue('sanction_reason'),
        fix_date: getValue('fix_date'),
        fix_action: getValue('fix_action'),
        followup_status: getValue('followup_status'),
      }
    })

    const valid = processed.filter(r => r.full_name && r.npm)
    setRows(valid)

    if (valid.length === 0) {
      setError('Tidak ada data valid setelah pemetaan. Pastikan kolom Nama dan NPM terisi.')
    } else {
      setError('')
      setStep(2) // Move to preview step
    }
  }

  const normalizeStatus = (status: string): OrganizationMember['status'] => {
    const s = (status || '').toLowerCase()
    if (s.includes('cuti') || s === 'leave') return 'leave'
    if (s.includes('alum') || s.includes('lulus')) return 'alumni'
    if (s.includes('resign') || s.includes('keluar') || s === 'non-aktif' || s === 'tidak aktif') return 'resigned'
    return 'active'
  }

  const normalizeGender = (gender: string): OrganizationMember['gender'] => {
    const g = (gender || '').toLowerCase()
    if (g.startsWith('laki') || g === 'male' || g === 'l') return 'male'
    if (g.startsWith('perem') || g === 'female' || g === 'p') return 'female'
    return 'other'
  }

  const startImport = async () => {
    if (rows.length === 0) return
    setLoading(true)
    setImportedCount(0)
    setDuplicatesSkipped(0)

    try {
      let imported = 0
      let skipped = 0

      for (const r of rows) {
        const emailKey = (r.email || '').toLowerCase()
        const npmKey = r.npm || ''
        const nameKey = (r.full_name || '').toLowerCase().trim()

        if (!npmKey && !nameKey) continue

        const duplicate = (emailKey && existingIndex.byEmail.has(emailKey)) ||
          (npmKey && existingIndex.byNpm.has(npmKey)) ||
          (nameKey && existingIndex.byName.has(nameKey))
        if (duplicate) {
          skipped += 1
          continue
        }

        try {
          const created = await membersAPI.create({
            full_name: r.full_name || '',
            npm: r.npm || '',
            email: r.email || null,
            phone: r.phone || '',
            division: r.division || 'Badan Pengurus Harian',
            position: r.position || 'Staff Muda',
            join_year: Number(r.join_year || new Date().getFullYear()),
            status: normalizeStatus(String(r.status || 'active')),
            image_url: '',
            linkedin_url: r.linkedin_url || '',
            instagram_handle: r.instagram_handle || '',
            gender: r.gender ? normalizeGender(String(r.gender)) : undefined,
            class_category: r.class_category || undefined,
            class_name: r.class_name || undefined,
            city: r.city || undefined,
            province: r.province || undefined
          })

          // Handle sanctions if present
          if (r.sanction && r.sanction.toLowerCase() !== 'baik' && r.sanction.toLowerCase() !== 'none' && r.sanction !== '') {
            await memberSanctionsAPI.create({
              member_id: created.id,
              sanction_status: (r.sanction?.toLowerCase() || 'warning') as any,
              sanction_date: r.sanction_date ? new Date(r.sanction_date).toISOString().slice(0, 10) : undefined,
              reason: r.sanction_reason || undefined,
              fix_date: r.fix_date ? new Date(r.fix_date).toISOString().slice(0, 10) : undefined,
              fix_action: r.fix_action || undefined,
              followup_status: r.followup_status || undefined
            })
          }

          imported += 1
        } catch (err) {
          console.error('Import error for row:', r, err)
        }
      }

      setImportedCount(imported)
      setDuplicatesSkipped(skipped)
      notify({ type: 'success', title: 'Import selesai', message: `Berhasil ${imported}, duplikat ${skipped} ` })

      await auditAPI.log({
        module: 'members',
        action: 'import_members',
        entity_type: 'organization_member',
        details: { imported, skipped }
      })

      onImported()
      // Don't close immediately so user can see result
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-4xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="text-blue-600" />
            Import Anggota
            <span className="text-sm font-normal text-slate-500 ml-2">
              {step === 0 && 'Langkah 1: Upload File'}
              {step === 1 && 'Langkah 2: Petakan Kolom'}
              {step === 2 && 'Langkah 3: Konfirmasi'}
            </span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* STEP 0: UPLOAD */}
          {step === 0 && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-[#333] rounded-xl bg-slate-50 dark:bg-[#1A1A1A]">
              <Upload size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">Upload file Excel atau CSV</p>
              <p className="text-sm text-slate-400 mb-6">Format .xlsx, .xls, atau .csv</p>
              <label className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors font-medium">
                Pilih File
                <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
              </label>
            </div>
          )}

          {/* STEP 1: MAPPING */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {DB_FIELDS.map((field) => (
                  <div key={field.key} className="flex flex-col">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    <select
                      value={columnMapping[field.key] || ''}
                      onChange={(e) => setColumnMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className={`w - full px - 3 py - 2 border rounded - lg text - sm bg - white dark: bg - [#1A1A1A] dark: text - white focus: ring - 2 focus: ring - blue - 500 ${field.required && !columnMapping[field.key]
                        ? 'border-rose-300 dark:border-rose-800'
                        : 'border-slate-200 dark:border-[#333]'
                        } `}
                    >
                      <option value="">-- Pilih Kolom CSV --</option>
                      {csvHeaders.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#1A1A1A] p-4 rounded-lg">
                <span>Total Data: <strong>{rawJson.length}</strong></span>
                <span>Valid: <strong>{rows.length}</strong></span>
                <span>Siap Import: <strong>{rows.length}</strong></span>
              </div>

              <div className="border rounded-xl border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                <div className="max-h-64 overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-[#232323] sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Nama</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">NPM</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Email</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Divisi</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                      {rows.slice(0, 50).map((r, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-slate-900 dark:text-slate-200">{r.full_name}</td>
                          <td className="px-3 py-2 font-mono text-slate-600 dark:text-slate-400">{r.npm}</td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{r.email}</td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{r.division}</td>
                          <td className="px-3 py-2">
                            <span className={`px - 2 py - 0.5 rounded - full text - xs font - medium ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                              } `}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rows.length > 50 && (
                  <div className="p-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-[#2A2A2A]">
                    Menampilkan 50 dari {rows.length} baris
                  </div>
                )}
              </div>

              {importedCount > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg text-green-700 dark:text-green-400 text-center">
                  <p className="font-bold text-lg">Import Berhasil!</p>
                  <p>{importedCount} data ditambahkan, {duplicatesSkipped} duplikat dilewati.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-between">
          {step === 0 ? (
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              Batal
            </button>
          ) : (
            <button
              onClick={() => setStep(prev => (prev - 1) as any)}
              disabled={loading || importedCount > 0}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
          )}

          {step === 1 && (
            <button
              onClick={processData}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Lanjut <ArrowRight size={16} />
            </button>
          )}

          {step === 2 && importedCount === 0 && (
            <button
              onClick={startImport}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Check size={16} />}
              Mulai Import
            </button>
          )}

          {step === 2 && importedCount > 0 && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberImportModal
