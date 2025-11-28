import React, { useEffect, useState } from 'react'
import { attendanceAPI, supabase, auditAPI, orgAPI, type OrganizationDivision } from '../../lib/supabase'
import { useNotifications } from '../common/NotificationCenter'
import { X, Check } from 'lucide-react'

interface EventFormProps {
  onClose: () => void
  onSuccess: () => void
  initialType?: 'meeting' | 'work_program' | 'gathering' | 'other'
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSuccess, initialType = 'meeting' }) => {
  const { notify } = useNotifications()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [division, setDivision] = useState('')
  const [type, setType] = useState<'meeting' | 'work_program' | 'gathering' | 'other'>(initialType)
  const [loading, setLoading] = useState(false)
  const [divisionOptions, setDivisionOptions] = useState<string[]>([])
  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const list = await orgAPI.getStructure(null)
        const names = list.map((d: OrganizationDivision) => d.name)
        setDivisionOptions(names.length ? names : ['Umum'])
        setDivision(names.length ? names[0] : 'Umum')
      } catch {
        setDivisionOptions(['Umum'])
        setDivision('Umum')
      }
    }
    loadDivisions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const created = await attendanceAPI.createEvent({
        title,
        description,
        date: new Date(date).toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : undefined,
        location,
        division,
        type,
        status: 'upcoming',
        created_by: user.id // Use real user ID
      })
      notify({ type: 'success', title: 'Event dibuat', message: title })
      await auditAPI.log({ module: 'attendance', action: 'create_event', entity_type: 'internal_event', entity_id: created.id, details: { division, location, date } })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Gagal membuat event. Pastikan Anda sudah login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Buat Agenda Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Judul Event</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal & Waktu Mulai</label>
              <input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal & Waktu Selesai</label>
              <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lokasi</label>
            <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Divisi Penanggung Jawab</label>
              <select value={division} onChange={e => setDivision(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white">
                {divisionOptions.map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipe Event</label>
              <select value={type} onChange={e => setType(e.target.value as 'meeting' | 'work_program' | 'gathering' | 'other')} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white">
                <option value="meeting">Rapat</option>
                <option value="work_program">Program Kerja</option>
                <option value="gathering">Gathering</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deskripsi</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white" placeholder="Tambahkan detail kegiatan..." />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded-lg">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Check size={18} /> Simpan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm
