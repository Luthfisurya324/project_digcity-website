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
import DocumentsDashboard from '../components/internal/DocumentsDashboard'
import EventDocumentsPage from '../components/internal/EventDocumentsPage'
import ActivityPage from '../components/internal/ActivityPage'
import KPIPage from '../components/internal/KPIPage'
import CheckInPage from '../components/internal/CheckInPage'
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
  Shield,
  Building2,
  Briefcase,
  Package,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Award,
  Settings,
  Sun,
  Moon,
  ExternalLink,
  User
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
    section: 'management',
    children: [
      { id: 'documents_dashboard', name: 'Dashboard', path: '/documents/dashboard' },
      { id: 'documents_events', name: 'Dokumen Proker', path: '/documents/events' },
      { id: 'documents_archive', name: 'Arsip Surat', path: '/documents' }
    ]
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

    // User menu dropdown state
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'))

    // Toggle theme function
    const toggleTheme = () => {
      const newMode = !isDarkMode
      setIsDarkMode(newMode)
      if (newMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }

    // Close user menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (!target.closest('#user-menu-container')) {
          setUserMenuOpen(false)
        }
      }
      if (userMenuOpen) {
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
      }
    }, [userMenuOpen])

    const navButtonClasses = (isActive: boolean) => {
      const base = 'group w-full flex items-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40'
      const spacing = sidebarCollapsed ? 'justify-center p-2' : 'px-2.5 py-2 gap-2.5'
      const defaultStyles = 'text-slate-600 hover:bg-slate-50/80 dark:text-[rgba(255,255,255,0.65)] dark:hover:bg-[#1A1A1A]'
      const activeStyles = 'bg-blue-600/10 text-blue-700 border border-blue-100/60 shadow-sm dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/30'
      return `${base} ${spacing} ${isActive ? activeStyles : defaultStyles}`
    }

    const navIconClasses = (isActive: boolean, accent: string) => {
      const base = 'flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0'
      const sizing = sidebarCollapsed ? 'h-8 w-8' : 'h-8 w-8'
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
            ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
            ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-56'}
          `}
        >
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 border-b border-slate-100 dark:border-[#1F1F1F] flex-shrink-0`}>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">DIGCITY</p>
                  <p className="text-[10px] text-slate-500 dark:text-[rgba(255,255,255,0.6)]">Internal</p>
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



          <nav id="sidebar-nav" className={`flex-1 ${sidebarCollapsed ? 'px-1.5' : 'px-2'} py-4 overflow-y-auto space-y-4 custom-scrollbar`}>
            {groupedNavigation.map((group) => (
              <div key={group.label}>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
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
                          title={item.name}
                        >
                          <div className={navIconClasses(isActive || false, item.accent)}>
                            <Icon size={16} />
                          </div>
                          {(!sidebarCollapsed || mobileMenuOpen) && (
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[13px] font-medium truncate">{item.name}</span>
                                {hasChildren && (
                                  isExpanded ? <ChevronUp size={12} className="flex-shrink-0" /> : <ChevronDown size={12} className="flex-shrink-0" />
                                )}
                                {item.badge && !hasChildren && (
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-slate-100 text-slate-500 font-medium flex-shrink-0">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </button>

                        {/* Submenu */}
                        {(!sidebarCollapsed || mobileMenuOpen) && hasChildren && isExpanded && (
                          <div className="mt-1 ml-10 space-y-0.5 border-l-2 border-slate-100 dark:border-[#2A2A2A] pl-2">
                            {item.children?.map((child) => {
                              const isChildActive = location.pathname === child.path
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => {
                                    navigate(`${getInternalBasePath()}${child.path}`)
                                    setMobileMenuOpen(false)
                                  }}
                                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${isChildActive
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
              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-[#1F1F1F] flex-shrink-0 px-2">
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin</p>
                )}
                <Link
                  to={`${getInternalBasePath()}/admin/users`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${location.pathname === `${getInternalBasePath()}/admin/users`
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1A1A1A] hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 ${sidebarCollapsed ? '' : 'mr-2'}`}>
                    <Shield size={14} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  {(!sidebarCollapsed || mobileMenuOpen) && 'User'}
                </Link>
              </div>
            )
          }



          {/* User Profile with Dropdown Menu */}
          <div id="user-menu-container" className="p-2 border-t border-slate-100 dark:border-[#1F1F1F] flex-shrink-0 relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2'} p-2 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:hover:bg-[#252525] transition-colors`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                {user.email.charAt(0).toUpperCase()}
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-medium text-slate-900 truncate dark:text-white">{user.email.split('@')[0]}</p>
                    <p className="text-[10px] text-slate-500 truncate">{internalRole}</p>
                  </div>
                  <ChevronUp size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? '' : 'rotate-180'}`} />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className={`absolute ${sidebarCollapsed ? 'left-full ml-2 bottom-0' : 'bottom-full left-2 right-2 mb-1'} bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl shadow-lg overflow-hidden z-50`}>
                {/* Profile & Settings */}
                <div className="p-1">
                  <Link
                    to={`${getInternalBasePath()}/settings`}
                    onClick={() => { setUserMenuOpen(false); setMobileMenuOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#252525] rounded-lg transition-colors"
                  >
                    <User size={14} />
                    <span>Pengaturan Profil</span>
                  </Link>
                  <Link
                    to={`${getInternalBasePath()}/org`}
                    onClick={() => { setUserMenuOpen(false); setMobileMenuOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#252525] rounded-lg transition-colors"
                  >
                    <Settings size={14} />
                    <span>Pengaturan Organisasi</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 dark:border-[#2A2A2A]" />

                {/* Website & Theme */}
                <div className="p-1">
                  <a
                    href="https://digcity.my.id"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#252525] rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>Website Utama</span>
                  </a>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#252525] rounded-lg transition-colors"
                  >
                    {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                    <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-[#2A2A2A]" />

                {/* Logout */}
                <div className="p-1">
                  <button
                    onClick={() => { setUserMenuOpen(false); handleLogout() }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
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
                <Route path="/documents/dashboard" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <DocumentsDashboard /> : <Navigate to="/" replace />} />
                <Route path="/documents/events" element={MANAGEMENT_ROLES.includes(internalRole.toLowerCase()) ? <EventDocumentsPage /> : <Navigate to="/" replace />} />
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
