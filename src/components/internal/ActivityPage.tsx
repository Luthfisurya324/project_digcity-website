import React, { useEffect, useMemo, useState } from 'react'
import { auditAPI, type AuditLog, supabase } from '../../lib/supabase'
import { Search, Filter, Clock, User, Database } from 'lucide-react'

type ModuleFilter = AuditLog['module'] | 'all'

const moduleLabels: Record<AuditLog['module'], string> = {
  members: 'Anggota',
  finance: 'Keuangan',
  attendance: 'Absensi',
  documents: 'Persuratan',
  linktree: 'Linktree',
  system: 'Sistem'
}

const ActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('all')
  const [search, setSearch] = useState('')
  const [currentUserEmail, setCurrentUserEmail] = useState('')

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUserEmail(user?.email || '')
      } catch { }
    }
    getUserEmail()
  }, [])

  const loadLogs = async () => {
    try {
      const list = await auditAPI.list({ limit: 200 })
      setLogs(list)
    } catch (error) {
      console.error('Failed to load logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return logs.filter((l) => {
      const matchesModule = moduleFilter === 'all' || l.module === moduleFilter
      const detailsStr = l.details ? JSON.stringify(l.details).toLowerCase() : ''
      const matchesSearch = l.action.toLowerCase().includes(term) ||
        (l.entity_type || '').toLowerCase().includes(term) ||
        (l.entity_id || '').toLowerCase().includes(term) ||
        detailsStr.includes(term)
      return matchesModule && matchesSearch
    })
  }, [logs, moduleFilter, search])

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, AuditLog[]>()
    filtered.forEach((l) => {
      const key = new Date(l.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })
      const arr = groups.get(key) || []
      arr.push(l)
      groups.set(key, arr)
    })
    return Array.from(groups.entries()).map(([date, items]) => ({ date, items: items.sort((a, b) => a.created_at < b.created_at ? 1 : -1) }))
  }, [filtered])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div id="activity-header">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Log Aktivitas</h1>
          <p className="text-slate-500 dark:text-slate-400">Timeline audit tindakan pengguna di sistem internal</p>
        </div>
        <div id="activity-filters" className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aksi, entitas, atau detail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value as ModuleFilter)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
            >
              <option value="all">Semua Modul</option>
              {(Object.keys(moduleLabels) as AuditLog['module'][]).map((m) => (
                <option key={m} value={m}>{moduleLabels[m]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {groupedByDate.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Belum ada aktivitas</h3>
          <p className="text-slate-500 dark:text-slate-400">Aksi yang Anda lakukan akan muncul di sini.</p>
        </div>
      ) : (
        <div id="activity-list" className="space-y-8">
          {groupedByDate.map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{group.date}</h3>
              </div>
              <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                <ul className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
                  {group.items.map((l) => (
                    <li key={l.id} className="p-4 hover:bg-slate-50 dark:hover:bg-[#232323] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#232323] flex items-center justify-center text-slate-600">
                            <Database size={16} />
                          </div>
                          <div>
                            <div className="text-sm">
                              <span className="font-semibold text-slate-900 dark:text-white">{moduleLabels[l.module]}</span>
                              <span className="mx-2 text-slate-400">•</span>
                              <span className="text-slate-700 dark:text-slate-300">{l.action}</span>
                            </div>
                            {(l.entity_type || l.entity_id) && (
                              <div className="text-xs text-slate-500 mt-1">
                                {l.entity_type} {l.entity_id ? `#${l.entity_id}` : ''}
                              </div>
                            )}
                            {l.details && Object.keys(l.details).length > 0 && (
                              <div className="text-xs text-slate-500 mt-1 line-clamp-1">{JSON.stringify(l.details)}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-slate-500">
                            {new Date(l.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-1">
                            <User size={10} /> {l.user_id === 'anonymous' ? 'Anonim' : (l.user_id.slice(0, 6) + '…')}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityPage

