import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { authAPI, supabase } from '../lib/supabase'
import { getInternalBasePath } from '../utils/domainDetection'
import InternalLogin from '../components/internal/InternalLogin'
import AccountSettings from '../components/internal/AccountSettings'
import InternalDashboard from '../components/internal/InternalDashboard'
import FinancePage from '../components/internal/FinancePage'
import FinanceDashboard from '../components/internal/FinanceDashboard'
import MembersPage from '../components/internal/MembersPage'
import AttendancePage from '../components/internal/AttendancePage'
import LeaderboardPage from '../components/internal/LeaderboardPage'
import DocumentsPage from '../components/internal/DocumentsPage'
import ActivityPage from '../components/internal/ActivityPage'
import KPIPage from '../components/internal/KPIPage'
import CheckInPage from '../components/internal/CheckInPage'
import ThemeToggle from '../components/common/ThemeToggle'
import { useReminders } from '../hooks/useReminders'
import ReportsPage from '../components/internal/ReportsPage'
import OrganizationSettings from '../components/internal/OrganizationSettings'
import WorkProgramsPage from '../components/internal/WorkProgramsPage'
import InventoryPage from '../components/internal/InventoryPage'
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
  Building2,
  Briefcase,
  Package,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Award
} from 'lucide-react'
import MemberDuesPage from '../components/internal/MemberDuesPage'
import AdminUserManagement from '../components/internal/AdminUserManagement'
import NotFoundPage from './NotFoundPage'
import { MANAGEMENT_ROLES } from '../lib/roles'
import TutorialButton from '../components/internal/TutorialButton'



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
  children?: {
    id: string
    name: string
    path: string
  }[]
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
    id: 'work_programs',
    name: 'Program Kerja',
    description: 'Manajemen proker & RAB',
    icon: Briefcase,
    accent: 'from-violet-500 to-purple-500',
    path: '/work-programs',
    section: 'main'
  },
  {
    id: 'finance',
    name: 'Keuangan',
    description: 'Manajemen kas & transaksi',
    icon: Wallet,
    accent: 'from-emerald-500 to-teal-500',
    path: '/finance',
    section: 'main',
    children: [
      { id: 'finance_dashboard', name: 'Dashboard', path: '/finance/dashboard' },
      { id: 'finance_cash', name: 'Kas Utama', path: '/finance' },
      { id: 'finance_dues', name: 'Iuran Anggota', path: '/finance/dues' }
    ]
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
    id: 'kpi',
    name: 'KPI Anggota',
    description: 'Evaluasi kinerja',
    icon: Award,
    accent: 'from-yellow-500 to-orange-500',
    path: '/kpi',
    section: 'management'
  },
  {
    id: 'inventory',
    name: 'Inventaris',
    description: 'Aset & perlengkapan',
    icon: Package,
    accent: 'from-cyan-500 to-blue-500',
    path: '/inventory',
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
  },
  {
    id: 'activity',
    name: 'Aktivitas',
    description: 'Timeline & audit log',
    icon: Clock,
    accent: 'from-slate-500 to-blue-500',
    path: '/activity',
    section: 'management'
  },
  {
    id: 'reports',
    name: 'Laporan & LPJ',
    description: 'Ringkasan kas & presensi',
    icon: BarChart3,
    accent: 'from-teal-500 to-blue-500',
    path: '/reports',
    section: 'management'
  },
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

// Separate component for authenticated layout to ensure hooks only run when logged in
const AuthenticatedLayout: React.FC<{
  user: User
  internalRole: string
  userDivision: string
  userPosition: string
  activeTab: string
  activeTabInfo: NavigationItem
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  handleLogout: () => void
  groupedNavigation: { label: string; items: NavigationItem[] }[]
  expandedMenus: string[]
  toggleMenu: (id: string) => void
  handleTabClick: (id: string) => void
  navigate: (path: string) => void
  location: any
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}> = ({
  user,
  internalRole,
  userDivision,
  userPosition,
  activeTab,
  activeTabInfo,
  sidebarCollapsed,
  toggleSidebar,
  handleLogout,
  groupedNavigation,
  expandedMenus,
  toggleMenu,
  handleTabClick,
  navigate,
  location,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
    // Only run reminders when authenticated
    useReminders(true)

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

    return (
      <div className="admin-container h-screen w-full bg-slate-50 dark:bg-[#0e0e0e] transition-colors flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-30 bg-white dark:bg-[#101010] border-r border-slate-200 dark:border-[#1F1F1F] transition-all duration-300 lg:static lg:h-full lg:flex lg:flex-col
            ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
            ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
          `}
        >
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-slate-100 dark:border-[#1F1F1F] flex-shrink-0`}>
            {(!sidebarCollapsed || mobileMenuOpen) && (
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

            {/* Desktop Collapse Button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>



          <nav id="sidebar-nav" className={`flex-1 ${sidebarCollapsed ? 'px-2' : 'px-4'} py-6 overflow-y-auto space-y-6 custom-scrollbar`}>
            {groupedNavigation.map((group) => (
              <div key={group.label}>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {group.label}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id || (item.children && item.children.some(child => location.pathname === child.path))
                    const isExpanded = expandedMenus.includes(item.id)
                    const hasChildren = item.children && item.children.length > 0

                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => {
                            if (hasChildren && (!sidebarCollapsed || mobileMenuOpen)) {
                              toggleMenu(item.id)
                            } else {
                              handleTabClick(item.id)
                              setMobileMenuOpen(false)
                            }
                          }}
                          className={navButtonClasses(isActive || false)}
                          title={sidebarCollapsed ? item.name : undefined}
                        >
                          <div className={navIconClasses(isActive || false, item.accent)}>
                            <Icon size={18} />
                          </div>
                          {(!sidebarCollapsed || mobileMenuOpen) && (
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{item.name}</span>
                                {hasChildren && (
                                  isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                )}
                                {item.badge && !hasChildren && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 truncate dark:text-slate-400">{item.description}</p>
                            </div>
                          )}
                        </button>

                        {/* Submenu */}
                        {(!sidebarCollapsed || mobileMenuOpen) && hasChildren && isExpanded && (
                          <div className="mt-1 ml-12 space-y-1 border-l-2 border-slate-100 dark:border-[#2A2A2A] pl-3">
                            {item.children?.map((child) => {
                              const isChildActive = location.pathname === child.path
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => {
                                    navigate(`${getInternalBasePath()}${child.path}`)
                                    setMobileMenuOpen(false)
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${isChildActive
                                    ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 font-medium'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-[#1A1A1A]'
                                    }`}
                                >
                                  {child.name}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Admin Only Menu */}
          {
            internalRole === 'admin' && (
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1F1F1F] flex-shrink-0">
                <p className={`px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ${sidebarCollapsed ? 'text-center' : ''}`}>
                  {sidebarCollapsed ? 'ADM' : 'Admin'}
                </p>
                <Link
                  to={`${getInternalBasePath()}/admin/users`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${location.pathname === `${getInternalBasePath()}/admin/users`
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1A1A1A] hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <Shield size={20} className={sidebarCollapsed ? 'mx-auto' : 'mr-3'} />
                  {(!sidebarCollapsed || mobileMenuOpen) && 'Manajemen User'}
                </Link>
              </div>
            )
          }



          <div id="user-profile-section" className="p-4 border-t border-slate-100 dark:border-[#1F1F1F] flex-shrink-0">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                {user.email.charAt(0).toUpperCase()}
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
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
              {(!sidebarCollapsed || mobileMenuOpen) && <span className="text-sm font-medium">Keluar</span>}
            </button>
          </div>
        </aside >

        <main className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 w-full ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
          <header className="bg-white/80 dark:bg-[#101010]/80 backdrop-blur z-10 border-b border-slate-200 dark:border-[#1F1F1F] px-4 sm:px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] rounded-lg"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 id="internal-dashboard-header" className="text-xl font-bold text-slate-900 dark:text-white">{activeTabInfo.name}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">{activeTabInfo.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div id="theme-toggle-btn">
                  <ThemeToggle />
                </div>
                <a href="https://digcity.my.id" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors hidden sm:block">
                  <Globe size={20} />
                </a>
                <a href={`${getInternalBasePath()}/settings`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Pengaturan Akun">
                  <Shield size={20} />
                </a>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
            <div className="max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<InternalDashboard />} />
                <Route path="/work-programs" element={<WorkProgramsPage userRole={internalRole} userDivision={userDivision} />} />
                <Route path="/finance/dashboard" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <FinanceDashboard userRole={internalRole} userDivision={userDivision} /> : <Navigate to="/" replace />} />
                <Route path="/finance" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <FinancePage userRole={internalRole} userPosition={userPosition} /> : <Navigate to="/" replace />} />
                <Route path="/finance/dues" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <MemberDuesPage userRole={internalRole} /> : <Navigate to="/" replace />} />
                <Route path="/members" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <MembersPage /> : <Navigate to="/" replace />} />
                <Route path="/attendance" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <AttendancePage userRole={internalRole} userDivision={userDivision} /> : <Navigate to="/" replace />} />
                <Route path="/attendance/leaderboard" element={<LeaderboardPage />} />
                <Route path="/kpi" element={<KPIPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/checkin" element={<CheckInPage />} />
                <Route path="/documents" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <DocumentsPage /> : <Navigate to="/" replace />} />
                <Route path="/activity" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <ActivityPage /> : <Navigate to="/" replace />} />
                <Route path="/reports" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <ReportsPage /> : <Navigate to="/" replace />} />
                <Route path="/org" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <OrganizationSettings /> : <Navigate to="/" replace />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/admin/users" element={internalRole === 'admin' ? <AdminUserManagement /> : <Navigate to="/" replace />} />
                <Route path="*" element={<NotFoundPage type="internal" />} />
              </Routes>
            </div>
          </div>
        </main>

        {/* Tutorial Button */}
        <TutorialButton sidebarCollapsed={sidebarCollapsed} />
      </div >
    )
  }

const InternalPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [internalRole, setInternalRole] = useState<string>('anggota')
  const [userDivision, setUserDivision] = useState<string>('')
  const [userPosition, setUserPosition] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['finance'])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  useEffect(() => {
    checkUser()
  }, [])

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
    if (path.startsWith('/work-programs')) return 'work_programs'
    if (path.startsWith('/finance')) return 'finance'
    if (path.startsWith('/members')) return 'members'
    if (path.startsWith('/attendance')) return 'attendance'
    if (path.startsWith('/kpi')) return 'kpi'
    if (path.startsWith('/inventory')) return 'inventory'
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

        let roleMeta = (currentUser.user_metadata?.internal_role || 'anggota').toString()

        // Check database for position if role is basic
        if (currentUser.email) {
          try {
            const { data: memberData } = await supabase
              .from('organization_members')
              .select('id, full_name, position, division')
              .eq('email', currentUser.email)
              .single()

            if (memberData) {
              setUserName(memberData.full_name)
              const position = memberData.position ? memberData.position.toLowerCase() : ''
              setUserPosition(position)
              if (position.includes('kepala divisi') || position.includes('head of')) {
                roleMeta = 'kepala divisi'
              } else if (
                position.includes('bph') ||
                position.includes('badan pengurus harian') ||
                position.includes('wakil ketua') ||
                position.includes('sekretaris') ||
                position.includes('bendahara') ||
                position === 'ketua' ||
                position.includes('ketua umum')
              ) {
                roleMeta = 'bph'
              }

              if (memberData.division) {
                setUserDivision(memberData.division)
              }
            }
          } catch (err) {
            console.warn('Could not fetch member details for role check', err)
          }
        }

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
          const canManage = MANAGEMENT_ROLES.includes(internalRole.toLowerCase())
          if (group.section === 'management') return canManage
          if (item.id === 'finance') return canManage
          return true
        })
      }))
      .filter((group) => group.items.length > 0)
  }, [internalRole])

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
    <AuthenticatedLayout
      user={user}
      internalRole={internalRole}
      userDivision={userDivision}
      userPosition={userPosition}
      activeTab={activeTab}
      activeTabInfo={activeTabInfo}
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      handleLogout={handleLogout}
      groupedNavigation={groupedNavigation}
      expandedMenus={expandedMenus}
      toggleMenu={toggleMenu}
      handleTabClick={handleTabClick}
      navigate={navigate}
      location={location}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
    />
  )
}

export default InternalPanel
