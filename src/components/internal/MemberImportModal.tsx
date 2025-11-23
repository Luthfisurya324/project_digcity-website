import React, { useEffect, useMemo, useState } from 'react'
import { X, Upload, Check, AlertCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { membersAPI, type OrganizationMember, auditAPI, memberSanctionsAPI } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'

interface MemberImportModalProps {
  onClose: () => void
  onImported: () => void
  existingMembers: OrganizationMember[]
}

type CsvRow = Partial<OrganizationMember> & {
  full_name?: string
  npm?: string
  email?: string
  phone?: string
  division?: string
  position?: string
  join_year?: number | string
  status?: OrganizationMember['status'] | string
  image_url?: string
  linkedin_url?: string
  instagram_handle?: string
  gender?: OrganizationMember['gender'] | string
  class_category?: string
  class_name?: string
  city?: string
  province?: string
  sanction?: string
  sanction_date?: string
  sanction_reason?: string
  fix_date?: string
  fix_action?: string
  followup_status?: string
}

const MemberImportModal: React.FC<MemberImportModalProps> = ({ onClose, onImported, existingMembers }) => {
  const { notify } = useNotifications()
  const [rows, setRows] = useState<CsvRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [importedCount, setImportedCount] = useState<number>(0)
  const [duplicatesSkipped, setDuplicatesSkipped] = useState<number>(0)

  const existingIndex = useMemo(() => {
    const byEmail = new Map<string, OrganizationMember>()
    const byNpm = new Map<string, OrganizationMember>()
    existingMembers.forEach((m) => {
      if (m.email) byEmail.set(m.email.toLowerCase(), m)
      if (m.npm) byNpm.set(m.npm, m)
    })
    return { byEmail, byNpm }
  }, [existingMembers])

  const parseFile = async (file: File) => {
    setError('')
    setRows([])
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, unknown>[]

      const parsed: CsvRow[] = json.map((row) => {
        const r = row as Record<string, unknown>
        return {
          full_name: String((r['Nama'] ?? r['full_name'] ?? r['nama'] ?? '') as string).trim(),
          npm: String((r['NPM'] ?? r['npm'] ?? '') as string).trim(),
          email: String((r['Email'] ?? r['email'] ?? '') as string).trim(),
          phone: String((r['Nomor Telepon'] ?? r['Telepon'] ?? r['phone'] ?? r['telepon'] ?? '') as string).trim(),
          division: String((r['Divisi'] ?? r['division'] ?? '') as string).trim(),
          position: String((r['Jabatan'] ?? r['position'] ?? '') as string).trim(),
          join_year: (r['Angkatan'] ?? r['join_year'] ?? '') as number | string,
          status: String((r['Status Keanggotaan'] ?? r['Status'] ?? r['status'] ?? 'active') as string).toLowerCase() as OrganizationMember['status'],
          image_url: String((r['Foto'] ?? r['image_url'] ?? '') as string).trim(),
          linkedin_url: String((r['Linkedin'] ?? r['linkedin_url'] ?? '') as string).trim(),
          instagram_handle: String((r['Instagram'] ?? r['instagram_handle'] ?? '') as string).trim(),
          gender: String((r['Jenis Kelamin'] ?? r['gender'] ?? '') as string).trim(),
          class_category: String((r['Kategori Kelas'] ?? r['class_category'] ?? '') as string).trim(),
          class_name: String((r['Kelas'] ?? r['class_name'] ?? '') as string).trim(),
          city: String((r['Kota/Kabupaten'] ?? r['city'] ?? '') as string).trim(),
          province: String((r['Provinsi'] ?? r['province'] ?? '') as string).trim(),
          sanction: String((r['Sanksi'] ?? '') as string).trim(),
          sanction_date: String((r['Tanggal Sanksi'] ?? '') as string).trim(),
          sanction_reason: String((r['Alasan Sanksi'] ?? '') as string).trim(),
          fix_date: String((r['Tanggal Perbaikan'] ?? '') as string).trim(),
          fix_action: String((r['Tindakan Perbaikan'] ?? '') as string).trim(),
          followup_status: String((r['Status Tindak Lanjut Sanksi'] ?? '') as string).trim()
        }
      })

      const valid = parsed.filter((r) => r.full_name && r.npm && r.email)
      setRows(valid)
      if (valid.length === 0) {
        setError('Tidak ada baris valid. Pastikan kolom minimal: Nama, NPM, Email.')
      }
    } catch (e) {
      console.error('CSV parse error:', e)
      setError('Gagal memproses file. Gunakan CSV/Excel dengan header yang benar.')
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    parseFile(file)
  }

  const normalizeStatus = (status: string): OrganizationMember['status'] => {
    const s = (status || '').toLowerCase()
    if (s.includes('cuti') || s === 'leave') return 'leave'
    if (s.includes('alum')) return 'alumni'
    if (s.includes('resign') || s === 'non-aktif') return 'resigned'
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
        if (!emailKey || !npmKey) continue
        const duplicate = existingIndex.byEmail.has(emailKey) || existingIndex.byNpm.has(npmKey)
        if (duplicate) {
          skipped += 1
          continue
        }
        try {
          const created = await membersAPI.create({
            full_name: r.full_name || '',
            npm: r.npm || '',
            email: r.email || '',
            phone: r.phone || '',
            division: r.division || 'Badan Pengurus Harian',
            position: r.position || 'Staff Muda',
            join_year: Number(r.join_year || new Date().getFullYear()),
            status: normalizeStatus(String(r.status || 'active')),
            image_url: r.image_url || '',
            linkedin_url: r.linkedin_url || '',
            instagram_handle: r.instagram_handle || '',
            gender: r.gender ? normalizeGender(String(r.gender)) : undefined,
            class_category: r.class_category || undefined,
            class_name: r.class_name || undefined,
            city: r.city || undefined,
            province: r.province || undefined
          })
          if (r.sanction || r.sanction_date || r.sanction_reason || r.fix_action || r.followup_status) {
            await memberSanctionsAPI.create({
              member_id: created.id,
              sanction_status: (r.sanction?.toLowerCase() || 'baik') as any,
              sanction_date: r.sanction_date ? new Date(r.sanction_date).toISOString().slice(0,10) : undefined,
              reason: r.sanction_reason || undefined,
              fix_date: r.fix_date ? new Date(r.fix_date).toISOString().slice(0,10) : undefined,
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
      notify({ type: 'success', title: 'Import selesai', message: `Berhasil ${imported}, duplikat ${skipped}` })
      await auditAPI.log({
        module: 'members',
        action: 'import_members',
        entity_type: 'organization_member',
        details: { imported, skipped }
      })
      onImported()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setImportedCount(0)
    setDuplicatesSkipped(0)
  }, [rows])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Import Anggota dari CSV/Excel</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Unggah file dengan header: Nama, NPM, Email, Divisi, Jabatan, Angkatan, Status, Telepon, Linkedin, Instagram, Foto</p>
              {error && (
                <p className="text-sm text-rose-600 flex items-center gap-2 mt-2"><AlertCircle size={16} /> {error}</p>
              )}
            </div>
            <label className="px-4 py-2 bg-slate-100 dark:bg-[#2A2A2A] rounded-lg cursor-pointer inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Upload size={18} /> Pilih File
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
            </label>
          </div>

          <div className="border rounded-xl border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
            <div className="max-h-72 overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-[#232323] sticky top-0">
                  <tr>
                    {['Nama','NPM','Email','Divisi','Jabatan','Angkatan','Status'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx} className="border-t border-slate-100 dark:border-[#2A2A2A]">
                      <td className="px-3 py-2">{r.full_name}</td>
                      <td className="px-3 py-2 font-mono">{r.npm}</td>
                      <td className="px-3 py-2">{r.email}</td>
                      <td className="px-3 py-2">{r.division}</td>
                      <td className="px-3 py-2">{r.position}</td>
                      <td className="px-3 py-2">{r.join_year}</td>
                      <td className="px-3 py-2 capitalize">{String(r.status || '').replace('_',' ')}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td className="px-3 py-6 text-center text-slate-400" colSpan={7}>Tidak ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              <p>Total baris valid: {rows.length}</p>
              {importedCount + duplicatesSkipped > 0 && (
                <p>Diimpor: {importedCount} • Duplikat dilewati: {duplicatesSkipped}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded-lg"
              >
                Batal
              </button>
              <button
                disabled={rows.length === 0 || loading}
                onClick={startImport}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Check size={18} />
                )}
                Mulai Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberImportModal
