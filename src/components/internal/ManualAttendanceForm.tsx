import React, { useEffect, useState } from 'react'
import { X, UserPlus } from 'lucide-react'
import { attendanceAPI, membersAPI, OrganizationMember } from '../../lib/supabase'

interface ManualAttendanceFormProps {
  eventId: string
  onClose: () => void
  onSuccess: () => void
}

const ManualAttendanceForm: React.FC<ManualAttendanceFormProps> = ({ eventId, onClose, onSuccess }) => {
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [selectedMember, setSelectedMember] = useState<string>('')
  const [name, setName] = useState('')
  const [npm, setNpm] = useState('')
  const [status, setStatus] = useState<'present' | 'late' | 'excused' | 'absent'>('present')
  const [notes, setNotes] = useState('')
  const [checkInTime, setCheckInTime] = useState(() => new Date().toISOString().slice(0, 16))
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await membersAPI.getAll()
        setMembers(data)
      } catch (error) {
        console.error('Failed to load members:', error)
      } finally {
        setLoadingMembers(false)
      }
    }
    loadMembers()
  }, [])

  const handleMemberChange = (value: string) => {
    setSelectedMember(value)
    if (!value) {
      setName('')
      setNpm('')
      return
    }
    const member = members.find((m) => m.id === value)
    if (member) {
      setName(member.full_name)
      setNpm(member.npm)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      alert('Nama peserta wajib diisi')
      return
    }

    setSaving(true)
    try {
      await attendanceAPI.recordAttendance({
        event_id: eventId,
        member_id: selectedMember || undefined,
        name,
        npm: npm || '-',
        status,
        check_in_time: checkInTime ? new Date(checkInTime).toISOString() : new Date().toISOString(),
        notes: notes || 'Manual attendance'
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to save manual attendance:', error)
      alert('Gagal menyimpan presensi manual.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Presensi Manual</h3>
            <p className="text-xs text-slate-500">Digunakan saat peserta gagal scan QR</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pilih Anggota</label>
            <select
              value={selectedMember}
              onChange={(e) => handleMemberChange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
            >
              <option value="">{loadingMembers ? 'Memuat data...' : 'Pilih dari database anggota (opsional)'}</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} • {member.division}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Peserta</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NPM / ID Anggota</label>
              <input
                type="text"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status Kehadiran</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              >
                <option value="present">Hadir</option>
                <option value="late">Terlambat</option>
                <option value="excused">Izin</option>
                <option value="absent">Tidak Hadir</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Waktu Presensi</label>
              <input
                type="datetime-local"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catatan</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              placeholder="Contoh: hadir manual karena scanner rusak"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus size={18} />
                  Simpan Presensi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManualAttendanceForm

