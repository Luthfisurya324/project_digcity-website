import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { authAPI, supabase } from '../lib/supabase'
import { getInternalBasePath } from '../utils/domainDetection'
import InternalLogin from '../components/internal/InternalLogin'
import AccountSettings from '../components/internal/AccountSettings'
import InternalDashboard from '../components/internal/InternalDashboard'
import FinancePage from '../components/internal/FinancePage'
import MembersPage from '../components/internal/MembersPage'
import AttendancePage from '../components/internal/AttendancePage'
import DocumentsPage from '../components/internal/DocumentsPage'
import ActivityPage from '../components/internal/ActivityPage'
import CheckInPage from '../components/internal/CheckInPage'
import ThemeToggle from '../components/common/ThemeToggle'
import { useReminders } from '../hooks/useReminders'
import ReportsPage from '../components/internal/ReportsPage'
import OrganizationSettings from '../components/internal/OrganizationSettings'
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  ClipboardList, 
  FileText,
  Clock,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Shield,
  Building2
} from 'lucide-react'

interface User {
  id: string
  email: string
  role: string
}

type TabSection = 'main' | 'management'

interface NavigationItem {
  id: string
  name: string
  description: string
  icon: LucideIcon
  accent: string
  path: string
  section: TabSection
  badge?: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Ringkasan organisasi',
    icon: LayoutDashboard,
    accent: 'from-blue-500 to-cyan-500',
    path: '/',
    section: 'main'
  },
  {
    id: 'finance',
    name: 'Keuangan',
    description: 'Manajemen kas & transaksi',
    icon: Wallet,
    accent: 'from-emerald-500 to-teal-500',
    path: '/finance',
    section: 'main'
  },
  {
    id: 'members',
    name: 'Anggota',
    description: 'Database anggota',
    icon: Users,
    accent: 'from-orange-500 to-amber-500',
    path: '/members',
    section: 'management'
  },
  {
    id: 'attendance',
    name: 'Absensi',
    description: 'Rekap kehadiran',
    icon: ClipboardList,
    accent: 'from-purple-500 to-indigo-500',
    path: '/attendance',
    section: 'management'
  },
  {
    id: 'documents',
    name: 'Persuratan',
    description: 'Arsip surat',
    icon: FileText,
    accent: 'from-pink-500 to-rose-500',
    path: '/documents',
    section: 'management'
  }
  ,
  {
    id: 'activity',
    name: 'Aktivitas',
    description: 'Timeline & audit log',
    icon: Clock,
    accent: 'from-slate-500 to-blue-500',
    path: '/activity',
    section: 'management'
  }
  ,
  {
    id: 'reports',
    name: 'Laporan & LPJ',
    description: 'Ringkasan kas & presensi',
    icon: BarChart3,
    accent: 'from-teal-500 to-blue-500',
    path: '/reports',
    section: 'management'
  }
  ,
  {
    id: 'org',
    name: 'Pengaturan',
    description: 'Profil & struktur organisasi',
    icon: Shield,
    accent: 'from-slate-500 to-indigo-500',
    path: '/org',
    section: 'management'
  }
]

const navigationGroups: { section: TabSection; label: string }[] = [
  { section: 'main', label: 'Utama' },
  { section: 'management', label: 'Manajemen' }
]

const InternalPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [internalRole, setInternalRole] = useState<string>('anggota')
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkUser()
  }, [])

  useReminders()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      checkUser()
      // Don't redirect on SIGNED_IN, just update the user state
      if (event === 'SIGNED_OUT') {
        const basePath = getInternalBasePath()
        navigate(basePath || '/')
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  // Update active tab based on current location
  const getActiveTab = () => {
    const base = getInternalBasePath() || ''
    let path = location.pathname
    if (base && path.startsWith(base)) {
      path = path.slice(base.length)
      if (path === '' || path === undefined) path = '/'
    }
    if (path === '/' || path === '') return 'dashboard'
    if (path.startsWith('/finance')) return 'finance'
    if (path.startsWith('/members')) return 'members'
    if (path.startsWith('/attendance')) return 'attendance'
    if (path.startsWith('/documents')) return 'documents'
    if (path.startsWith('/activity')) return 'activity'
    if (path.startsWith('/reports')) return 'reports'
    if (path.startsWith('/org')) return 'org'
    return 'dashboard'
  }

  const checkUser = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser()
      if (currentUser) {
        // For now, allow any authenticated user to access internal dashboard
        // In future, check for specific internal_member role
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          role: 'member'
        })
        const roleMeta = (currentUser.user_metadata?.internal_role || 'anggota').toString()
        setInternalRole(roleMeta)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.signOut()
      setUser(null)
      const basePath = getInternalBasePath()
      navigate(basePath || '/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleTabClick = (tabId: string) => {
    const target = navigationItems.find((tab) => tab.id === tabId)
    if (target) {
      const basePath = getInternalBasePath()
      // If path is root '/', use basePath only if it's not empty
      // Otherwise append target path
      if (target.path === '/') {
        navigate(basePath || '/')
      } else {
        navigate(`${basePath}${target.path}`)
      }
    }
  }

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)
  
  const groupedNavigation = useMemo(() => {
    return navigationGroups
      .map((group) => ({
        label: group.label,
        items: navigationItems.filter((item) => item.section === group.section).filter((item) => {
          const canManage = ['bph','admin','ketua','sekretaris','bendahara'].includes(internalRole.toLowerCase())
          if (group.section === 'management') return canManage
          if (item.id === 'finance') return canManage
          return true
        })
      }))
      .filter((group) => group.items.length > 0)
  }, [internalRole])

  const navButtonClasses = (isActive: boolean) => {
    const base = 'group w-full flex items-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40'
    const spacing = sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 gap-3'
    const defaultStyles = 'text-slate-600 hover:bg-slate-50/80 dark:text-[rgba(255,255,255,0.65)] dark:hover:bg-[#1A1A1A]'
    const activeStyles = 'bg-blue-600/10 text-blue-700 border border-blue-100/60 shadow-sm dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/30'
    return `${base} ${spacing} ${isActive ? activeStyles : defaultStyles}`
  }

  const navIconClasses = (isActive: boolean, accent: string) => {
    const base = 'flex items-center justify-center rounded-xl transition-all duration-200'
    const sizing = sidebarCollapsed ? 'h-9 w-9' : 'h-11 w-11'
    const defaultStyles = 'bg-slate-100 text-slate-500 dark:bg-[#232323] dark:text-neutral-300'
    const activeStyles = `bg-gradient-to-br ${accent} text-white shadow-md`
    return `${base} ${sizing} ${isActive ? activeStyles : defaultStyles}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat sistem internal...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <InternalLogin />
  }

  const activeTab = getActiveTab()
  const activeTabInfo = navigationItems.find((tab) => tab.id === activeTab) || navigationItems[0]

  return (
    <div className="admin-container min-h-screen bg-slate-50 dark:bg-[#0e0e0e] transition-colors">
      <div className="flex">
        <aside
          className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#101010] min-h-screen transition-all duration-300 fixed z-20 ${
            sidebarCollapsed ? 'w-20' : 'w-72'
          }`}
        >
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-slate-100 dark:border-[#1F1F1F]`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">DIGCITY Internal</p>
                  <p className="text-xs text-slate-500 dark:text-[rgba(255,255,255,0.6)]">Organization Portal</p>
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          
          <nav className={`flex-1 ${sidebarCollapsed ? 'px-2' : 'px-4'} py-6 overflow-y-auto space-y-6`}>
            {groupedNavigation.map((group) => (
              <div key={group.label}>
                {!sidebarCollapsed && (
                  <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {group.label}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={navButtonClasses(isActive)}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <div className={navIconClasses(isActive, item.accent)}>
                          <Icon size={18} />
                        </div>
                        {!sidebarCollapsed && (
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{item.name}</span>
                              {item.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate dark:text-slate-400">{item.description}</p>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-100 dark:border-[#1F1F1F]">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                {user.email.charAt(0).toUpperCase()}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate dark:text-white">{user.email}</p>
                  <p className="text-xs text-slate-500 truncate">{internalRole.toUpperCase()}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start gap-3 px-3'} py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors`}
            >
              <LogOut size={18} />
              {!sidebarCollapsed && <span className="text-sm font-medium">Keluar</span>}
            </button>
          </div>
        </aside>

        <main className={`flex-1 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
          <header className="bg-white/80 dark:bg-[#101010]/80 backdrop-blur sticky top-0 z-10 border-b border-slate-200 dark:border-[#1F1F1F] px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeTabInfo.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{activeTabInfo.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <a href="https://digcity.my.id" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Globe size={20} />
                </a>
                <a href={`${getInternalBasePath()}/settings`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Pengaturan Akun">
                  <Shield size={20} />
                </a>
              </div>
            </div>
          </header>

          <div className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<InternalDashboard />} />
              <Route path="/finance" element={['bph','admin','ketua','sekretaris','bendahara'].includes(internalRole.toLowerCase()) ? <FinancePage /> : <Navigate to="/" replace />} />
              <Route path="/members" element={['bph','admin','ketua','sekretaris','bendahara'].includes(internalRole.toLowerCase()) ? <MembersPage /> : <Navigate to="/" replace />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/checkin" element={<CheckInPage />} />
              <Route path="/documents" element={['bph','admin','ketua','sekretaris','bendahara'].includes(internalRole.toLowerCase()) ? <DocumentsPage /> : <Navigate to="/" replace />} />
              <Route path="/activity" element={['bph','admin','ketua','sekretaris','bendahara'].includes(internalRole.toLowerCase()) ? <ActivityPage /> : <Navigate to="/" replace />} />
              <Route path="/reports" element={['bph','admin','ketua','sekretaris','bendahara'].includes(internalRole.toLowerCase()) ? <ReportsPage /> : <Navigate to="/" replace />} />
              <Route path="/org" element={['bph','admin','ketua','sekretaris','bendahara'].includes(internalRole.toLowerCase()) ? <OrganizationSettings /> : <Navigate to="/" replace />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default InternalPanel
