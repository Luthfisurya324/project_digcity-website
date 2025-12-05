import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, UserPlus, Search, ChevronDown } from 'lucide-react'
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
  const [status, setStatus] = useState<'present' | 'late' | 'excused' | 'absent' | 'sick'>('present')
  const [notes, setNotes] = useState('')
  const [checkInTime, setCheckInTime] = useState(() => new Date().toISOString().slice(0, 16))
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [saving, setSaving] = useState(false)

  // Searchable dropdown states
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

    // Click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMemberSelect = (member: OrganizationMember) => {
    setSelectedMember(member.id)
    setName(member.full_name)
    setNpm(member.npm)
    setSearchQuery(member.full_name)
    setIsDropdownOpen(false)
  }

  const clearSelection = () => {
    setSelectedMember('')
    setName('')
    setNpm('')
    setSearchQuery('')
  }

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.npm.includes(searchQuery) ||
    member.division.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
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
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cari Anggota</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsDropdownOpen(true)
                  if (selectedMember && e.target.value !== name) {
                    setSelectedMember('') // Clear selection if user types something else
                  }
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Ketik nama atau NPM..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {selectedMember && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {loadingMembers ? (
                  <div className="p-3 text-sm text-slate-500 text-center">Memuat data...</div>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleMemberSelect(member)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#2A2A2A] flex flex-col"
                    >
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{member.full_name}</span>
                      <span className="text-xs text-slate-500">{member.npm} • {member.division}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-sm text-slate-500 text-center">Tidak ada anggota ditemukan</div>
                )}
              </div>
            )}
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
                <option value="sick">Sakit</option>
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
    </div>,
    document.body
  )
}

export default ManualAttendanceForm

