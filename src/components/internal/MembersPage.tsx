import React, { useState, useEffect } from 'react'
import { membersAPI, OrganizationMember, supabase } from '../../lib/supabase'
import MemberForm from './MemberForm'
import MemberImportModal from './MemberImportModal'
import MemberEditForm from './MemberEditForm'
import MemberCardModal from './MemberCardModal'
import {
  Users,
  Search,
  Plus,
  Download,
  MoreVertical,
  Filter,
  User,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  QrCode,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react'

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editTarget, setEditTarget] = useState<OrganizationMember | null>(null)
  const [cardTarget, setCardTarget] = useState<OrganizationMember | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [canManage, setCanManage] = useState(false)
  const [roleLabel, setRoleLabel] = useState('Anggota')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  useEffect(() => {
    loadMembers()
  }, [])

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const internalRole = (user?.user_metadata?.internal_role || 'anggota') as string
        setRoleLabel(internalRole)
        const normalized = internalRole.toLowerCase()
        setCanManage(['ketua', 'wakil ketua', 'sekretaris', 'bendahara', 'administrator', 'admin', 'bph'].includes(normalized))
      } catch (error) {
        console.error('Error determining role:', error)
      }
    }
    fetchRole()
  }, [])

  const loadMembers = async () => {
    try {
      const data = await membersAPI.getAll()
      setMembers(data)
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesFilter = filter === 'all' || member.status === filter
    const matchesSearch = member.full_name.toLowerCase().includes(search.toLowerCase()) ||
      member.npm.includes(search) ||
      member.division.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const groupedMembers = React.useMemo(() => {
    const groups: Record<string, OrganizationMember[]> = {}
    filteredMembers.forEach(member => {
      const division = member.division || 'Lainnya'
      if (!groups[division]) {
        groups[division] = []
      }
      groups[division].push(member)
    })
    return groups
  }, [filteredMembers])

  // Sort divisions to keep them consistent (optional, alphabetical or specific order)
  const sortedDivisions = Object.keys(groupedMembers).sort()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'inactive': return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'demisioner': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'inactive': return 'Tidak Aktif'
      case 'demisioner': return 'Demisioner'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const exportCSV = () => {
    const headers = ['Nama', 'NPM', 'Email', 'Telepon', 'Divisi', 'Jabatan', 'Angkatan', 'Status', 'LinkedIn', 'Instagram', 'Foto']
    const escapeCsv = (value: unknown) => {
      const str = value == null ? '' : String(value)
      return '"' + str.replace(/"/g, '""') + '"'
    }
    const rows = members.map((m) => [
      escapeCsv(m.full_name),
      escapeCsv(m.npm),
      escapeCsv(m.email),
      escapeCsv(m.phone || ''),
      escapeCsv(m.division),
      escapeCsv(m.position),
      escapeCsv(m.join_year),
      escapeCsv(m.status),
      escapeCsv(m.linkedin_url || ''),
      escapeCsv(m.instagram_handle || ''),
      escapeCsv(m.image_url || '')
    ].join(','))
    const csv = [headers.join(','), ...rows].join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    a.href = URL.createObjectURL(blob)
    a.download = `organization-members-${yyyy}${mm}${dd}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }




  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div id="members-header">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Database Anggota</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola data pengurus dan anggota organisasi</p>
          <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            Akses: {roleLabel.toUpperCase()} {canManage ? '(full control)' : '(read only)'}
          </p>
        </div>
        <div id="members-actions" className="flex gap-2">
          <div className="flex bg-slate-100 dark:bg-[#2A2A2A] rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-white dark:bg-[#1E1E1E] shadow-sm text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}
              title="Tampilan Kartu"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-[#1E1E1E] shadow-sm text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}
              title="Tampilan Tabel"
            >
              <TableIcon size={18} />
            </button>
          </div>
          <button
            id="members-export"
            className="px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            onClick={exportCSV}
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            id="members-import"
            disabled={!canManage}
            title={canManage ? undefined : 'Hanya pengurus inti yang dapat import'}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${canManage ? 'bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-slate-300 hover:bg-slate-50' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
            onClick={() => setShowImport(true)}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <button
            id="members-add-btn"
            disabled={!canManage}
            title={canManage ? undefined : 'Hanya pengurus inti yang dapat menambah anggota'}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-200 dark:shadow-none ${canManage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            <span>Tambah Anggota</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div id="members-filters" className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NPM, atau divisi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'active', label: 'Aktif' },
            { id: 'inactive', label: 'Tidak Aktif' },
            { id: 'demisioner', label: 'Demisioner' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === type.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                : 'bg-white dark:bg-[#1E1E1E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2A2A2A]'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members View */}
      {filteredMembers.length > 0 ? (
        viewMode === 'card' ? (
          <div id="members-content" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] p-6 hover:shadow-lg transition-all group relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    title="Kartu Anggota"
                    onClick={() => setCardTarget(member)}
                  >
                    <QrCode size={18} />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${canManage ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50' : 'text-slate-300 cursor-not-allowed'}`}
                    title={canManage ? 'Edit Profil' : 'Hanya pengurus inti'}
                    onClick={() => canManage && setEditTarget(member)}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-[#2A2A2A] mb-3 overflow-hidden border-2 border-white dark:border-[#333] shadow-sm">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User size={32} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{member.full_name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{member.position}</p>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${getStatusColor(member.status)}`}>
                    {getStatusLabel(member.status)}
                  </span>
                </div>

                <div className="space-y-3 border-t border-slate-100 dark:border-[#2A2A2A] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">NPM</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{member.npm}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Divisi</span>
                    <span className="text-slate-700 dark:text-slate-300 text-right">{member.division}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Angkatan</span>
                    <span className="text-slate-700 dark:text-slate-300">{member.join_year}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-[#2A2A2A]">
                  <a href={`mailto:${member.email}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Mail size={18} />
                  </a>
                  {member.phone && (
                    <a href={`https://wa.me/${member.phone.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Phone size={18} />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.instagram_handle && (
                    <a href={`https://instagram.com/${member.instagram_handle.replace('@', '')}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                      <Instagram size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-[#252525] border-b border-slate-200 dark:border-[#2A2A2A]">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Nama Lengkap</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">NPM</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Divisi</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Jabatan</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Angkatan</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-[#252525] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#2A2A2A] overflow-hidden">
                            {member.image_url ? (
                              <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={14} /></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{member.full_name}</div>
                            <div className="text-xs text-slate-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{member.npm}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{member.division}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-[#333] text-xs font-medium">
                          {member.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{member.join_year}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(member.status)}`}>
                          {getStatusLabel(member.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50"
                            title="Kartu Anggota"
                            onClick={() => setCardTarget(member)}
                          >
                            <QrCode size={16} />
                          </button>
                          {canManage && (
                            <button
                              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50"
                              title="Edit Profil"
                              onClick={() => setEditTarget(member)}
                            >
                              <MoreVertical size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Belum ada anggota</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Mulai dengan menambahkan data pengurus atau anggota baru.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            <span>Tambah Anggota</span>
          </button>
        </div>
      )}

      {
        showForm && (
          <MemberForm
            onClose={() => setShowForm(false)}
            onSuccess={loadMembers}
          />
        )
      }
      {
        showImport && (
          <MemberImportModal
            onClose={() => setShowImport(false)}
            onImported={loadMembers}
            existingMembers={members}
          />
        )
      }
      {
        editTarget && (
          <MemberEditForm
            member={editTarget}
            onClose={() => setEditTarget(null)}
            onUpdated={async () => { await loadMembers(); setEditTarget(null) }}
          />
        )
      }
      {
        cardTarget && (
          <MemberCardModal
            member={cardTarget}
            onClose={() => setCardTarget(null)}
          />
        )
      }
    </div >
  )
}

export default MembersPage
