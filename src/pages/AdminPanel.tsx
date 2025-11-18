import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { authAPI } from '../lib/supabase'
import { getAdminBasePath } from '../utils/domainDetection'
import AdminLogin from '../components/admin/AdminLogin'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminEvents from '../components/admin/AdminEvents'
import AdminNews from '../components/admin/AdminNews'
import BlogEditor from '../components/admin/BlogEditor'
import AdminGallery from '../components/admin/AdminGallery'
import AdminNewsletter from '../components/admin/AdminNewsletter'
import AdminLinktree from '../components/admin/AdminLinktree'
import CacheControl from '../components/common/CacheControl'
import ThemeToggle from '../components/common/ThemeToggle'
import { 
  BarChart3, 
  Calendar, 
  Newspaper, 
  Image, 
  Mail, 
  Trash2,
  User,
  Link,
  Home,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Globe
} from 'lucide-react'

interface User {
  id: string
  email: string
  role: string
}

type TabSection = 'overview' | 'content' | 'audience' | 'system'

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
    description: 'Monitor performa dan aktivitas terbaru',
    icon: BarChart3,
    accent: 'from-blue-500 to-cyan-500',
    path: '/',
    section: 'overview',
    badge: 'Live'
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Kelola agenda & program komunitas',
    icon: Calendar,
    accent: 'from-emerald-500 to-lime-500',
    path: '/events',
    section: 'content'
  },
  {
    id: 'news',
    name: 'News',
    description: 'Publikasikan berita & artikel',
    icon: Newspaper,
    accent: 'from-purple-500 to-indigo-500',
    path: '/news',
    section: 'content'
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Kurasi dokumentasi visual',
    icon: Image,
    accent: 'from-pink-500 to-rose-500',
    path: '/gallery',
    section: 'content'
  },
  {
    id: 'linktree',
    name: 'Linktree',
    description: 'Atur tautan multi-channel',
    icon: Link,
    accent: 'from-orange-500 to-amber-500',
    path: '/linktree',
    section: 'content',
    badge: 'Beta'
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Kelola audience & kampanye',
    icon: Mail,
    accent: 'from-sky-500 to-blue-500',
    path: '/newsletter',
    section: 'audience'
  },
  {
    id: 'cache',
    name: 'Cache Tools',
    description: 'Sinkronisasi data & performa',
    icon: Trash2,
    accent: 'from-slate-500 to-slate-700',
    path: '/cache',
    section: 'system',
    badge: 'Tools'
  }
]

const navigationGroups: { section: TabSection; label: string }[] = [
  { section: 'overview', label: 'Overview' },
  { section: 'content', label: 'Content Studio' },
  { section: 'audience', label: 'Audience' },
  { section: 'system', label: 'Utilities' }
]

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('digcity-admin-sidebar')
    if (stored === 'collapsed') {
      setSidebarCollapsed(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('digcity-admin-sidebar', sidebarCollapsed ? 'collapsed' : 'expanded')
  }, [sidebarCollapsed])

  // Debug routing changes
  useEffect(() => {
    console.log('🔍 AdminPanel: Location changed:', location.pathname)
    console.log('🔍 AdminPanel: Current location object:', location)
  }, [location])

  // Update active tab based on current location
  const getActiveTab = () => {
    const path = location.pathname
    const adminBasePath = getAdminBasePath()
    
    // Handle dashboard path
    if (path === adminBasePath || path === `${adminBasePath}/` || path === '/' || path === '') {
      return 'dashboard'
    }
    
    // Handle other paths
    if (path.startsWith(`${adminBasePath}/events`)) return 'events'
    if (path.startsWith(`${adminBasePath}/news`)) return 'news'
    if (path.startsWith(`${adminBasePath}/gallery`)) return 'gallery'
    if (path.startsWith(`${adminBasePath}/linktree`)) return 'linktree'
    if (path.startsWith(`${adminBasePath}/newsletter`)) return 'newsletter'
    if (path.startsWith(`${adminBasePath}/cache`)) return 'cache'
    
    return 'dashboard'
  }

  const checkUser = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser()
      if (currentUser) {
        console.log('User authenticated:', currentUser.email)
        const adminStatus = await authAPI.isAdmin()
        console.log('Admin status:', adminStatus)
        setIsAdmin(adminStatus)
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          role: adminStatus ? 'admin' : 'viewer'
        })
      } else {
        // No user session, reset state
        console.log('No user session found')
        setUser(null)
        setIsAdmin(false)
      }
    } catch (error) {
      // Handle auth session missing error gracefully
      console.error('Error checking user:', error)
      setUser(null)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.signOut()
      setUser(null)
      setIsAdmin(false)
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleTabClick = (tabId: string) => {
    const adminBasePath = getAdminBasePath()
    const target = navigationItems.find((tab) => tab.id === tabId)
    
    if (!target) {
      navigate(adminBasePath || '/')
      return
    }
    
    if (target.path === '/' || target.path === '') {
      navigate(adminBasePath || '/')
      return
    }
    
    navigate(`${adminBasePath}${target.path}`)
  }

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)
  
  const groupedNavigation = useMemo(() => {
    return navigationGroups
      .map((group) => ({
        label: group.label,
        items: navigationItems.filter((item) => item.section === group.section)
      }))
      .filter((group) => group.items.length > 0)
  }, [])

  const navButtonClasses = (isActive: boolean) => {
    const base = 'group w-full flex items-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40'
    const spacing = sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 gap-3'
    const defaultStyles = 'text-secondary-600 hover:bg-secondary-50/80 dark:text-[rgba(255,255,255,0.65)] dark:hover:bg-[#1A1A1A]'
    const activeStyles = 'bg-primary-600/10 text-primary-700 border border-primary-100/60 shadow-sm dark:text-[#BB86FC] dark:bg-[rgba(187,134,252,0.12)] dark:border-[rgba(187,134,252,0.3)]'
    return `${base} ${spacing} ${isActive ? activeStyles : defaultStyles}`
  }

  const navIconClasses = (isActive: boolean, accent: string) => {
    const base = 'flex items-center justify-center rounded-xl transition-all duration-200'
    const sizing = sidebarCollapsed ? 'h-9 w-9' : 'h-11 w-11'
    const defaultStyles = 'bg-secondary-100 text-secondary-500 dark:bg-[#232323] dark:text-neutral-300'
    const activeStyles = `bg-gradient-to-br ${accent} text-white shadow-md`
    return `${base} ${sizing} ${isActive ? activeStyles : defaultStyles}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <AdminLogin />
  }

  const activeTab = getActiveTab()
  const activeTabInfo = navigationItems.find((tab) => tab.id === activeTab) || navigationItems[0]

  // Detect if current route is Blog Editor (new or edit) to enable fullscreen mode
  const adminBasePath = getAdminBasePath()
  const isEditorRoute = location.pathname === `${adminBasePath}/news/new` || location.pathname.startsWith(`${adminBasePath}/news/edit/`)

  const environmentLabel = getAdminBasePath() === '' ? 'Subdomain Admin' : 'Domain Utama'

  return (
    <div className="admin-container min-h-screen bg-gradient-to-b from-slate-100 via-white to-white dark:from-[#121212] dark:via-[#121212] dark:to-[#0e0e0e] transition-colors">
      {/* Modern Header - hidden on editor routes */}
      {!isEditorRoute && (
        <>
          <header className="bg-white/90 dark:bg-[#121212]/80 backdrop-blur border-b border-secondary-200 dark:border-[#2A2A2A] sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary-500 dark:text-[rgba(255,255,255,0.6)] mb-1">
                    Control Center
                  </p>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-secondary-900 dark:text-[rgba(255,255,255,0.95)]">
                      {activeTabInfo.name}
                    </h1>
                    {activeTabInfo.badge && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 dark:bg-[rgba(187,134,252,0.2)] dark:text-[#BB86FC]">
                        {activeTabInfo.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-[rgba(255,255,255,0.7)]">
                    {activeTabInfo.description}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <div className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-[#1E1E1E] border border-secondary-200 dark:border-[#2A2A2A] rounded-xl px-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 text-white flex items-center justify-center text-sm font-semibold uppercase">
                      {user.email.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary-900 dark:text-white">{user.email}</p>
                      <p className="text-xs text-secondary-500 dark:text-[rgba(255,255,255,0.6)] capitalize">{user.role}</p>
                    </div>
                  </div>
                  <ThemeToggle />
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-secondary-200 text-secondary-700 hover:bg-secondary-50 transition-colors dark:border-[#2A2A2A] dark:text-[rgba(255,255,255,0.87)] dark:hover:bg-[#1E1E1E]"
                  >
                    <Globe size={16} />
                    <span className="text-sm font-medium">Lihat Situs</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm hover:shadow-md transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Context badges */}
          <div className="bg-white/80 dark:bg-[#121212]/70 border-b border-secondary-100 dark:border-[#1F1F1F] backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex flex-wrap gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-[rgba(25,118,210,0.2)] dark:text-[#69F0AE]">
                <ShieldCheck size={14} />
                Admin secure
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 dark:bg-[rgba(187,134,252,0.2)] dark:text-[#BB86FC]">
                <Sparkles size={14} />
                {user.email}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-50 text-secondary-700 dark:bg-[#1E1E1E] dark:text-[rgba(255,255,255,0.85)]">
                <Home size={14} />
                {environmentLabel}
              </span>
            </div>
          </div>
          
          {/* Mobile navigation */}
          <div className="lg:hidden border-b border-secondary-100 dark:border-[#1F1F1F] bg-white/85 dark:bg-[#121212]/85 backdrop-blur px-4 py-3">
            <label htmlFor="admin-mobile-navigation" className="block text-xs uppercase tracking-widest text-secondary-500 dark:text-[rgba(255,255,255,0.6)] mb-2">
              Navigasi cepat
            </label>
            <select
              id="admin-mobile-navigation"
              value={activeTab}
              onChange={(event) => handleTabClick(event.target.value)}
              className="w-full rounded-xl border border-secondary-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/60"
            >
              {navigationItems.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      
      <div className={isEditorRoute ? '' : 'flex'}>
        {!isEditorRoute && (
          <aside
            className={`hidden lg:flex flex-col border-r border-secondary-100 dark:border-[#1F1F1F] bg-white/90 dark:bg-[#101010]/90 backdrop-blur min-h-screen transition-all duration-300 ${
              sidebarCollapsed ? 'w-20' : 'w-72'
            }`}
          >
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-end' : 'justify-between'} px-4 py-4 border-b border-secondary-100 dark:border-[#1F1F1F]`}>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white shadow-lg">
                    <Home size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary-900 dark:text-white">DIGCITY Studio</p>
                    <p className="text-xs text-secondary-500 dark:text-[rgba(255,255,255,0.6)]">Admin v3</p>
                  </div>
                </div>
              )}
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center rounded-xl border border-secondary-200 text-secondary-500 hover:text-secondary-900 hover:border-secondary-300 transition-colors dark:border-[#2A2A2A] dark:text-[rgba(255,255,255,0.7)] dark:hover:text-white"
                aria-label={sidebarCollapsed ? 'Buka navigasi' : 'Sembunyikan navigasi'}
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
            
            <nav className={`flex-1 ${sidebarCollapsed ? 'px-1' : 'px-3'} pt-4 pb-6 overflow-y-auto`}>
              {groupedNavigation.map((group) => (
                <div key={group.label} className="mb-5">
                  {!sidebarCollapsed && (
                    <p className="text-[11px] uppercase tracking-[0.3em] text-secondary-500 dark:text-[rgba(255,255,255,0.5)] mb-2">
                      {group.label}
                    </p>
                  )}
                  <div className={`flex ${sidebarCollapsed ? 'flex-col items-center gap-2' : 'flex-col space-y-1'}`}>
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = activeTab === item.id
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={navButtonClasses(isActive)}
                          title={sidebarCollapsed ? item.name : undefined}
                          aria-label={sidebarCollapsed ? item.name : undefined}
                        >
                          <div className={navIconClasses(isActive, item.accent)}>
                            <Icon size={18} />
                          </div>
                          {!sidebarCollapsed && (
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold">{item.name}</p>
                                {item.badge && (
                                  <span className="text-[10px] uppercase tracking-widest text-secondary-500">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-secondary-500 dark:text-[rgba(255,255,255,0.55)]">
                                {item.description}
                              </p>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
            
            <div className="px-4 pb-6">
              <div
                className={`rounded-2xl border border-secondary-200 dark:border-[#2A2A2A] bg-white/80 dark:bg-[#141414] ${
                  sidebarCollapsed ? 'p-3' : 'p-4'
                }`}
              >
                <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 text-white flex items-center justify-center">
                    <User size={18} />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <p className="text-sm font-semibold text-secondary-900 dark:text-white">Tim Operasional</p>
                      <p className="text-xs text-secondary-500 dark:text-[rgba(255,255,255,0.6)]">
                        Semua perubahan tersinkron
                      </p>
                    </div>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => navigate(getAdminBasePath() || '/')}
                    className="mt-4 w-full text-sm font-semibold text-primary-600 dark:text-[#BB86FC] hover:underline"
                  >
                    Refresh dashboard
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 ${isEditorRoute ? '' : 'px-4 sm:px-6 lg:px-10 py-8'}`}>
          <div className={isEditorRoute ? '' : 'max-w-7xl mx-auto'}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/events" element={<AdminEvents />} />
              <Route path="/events/new" element={<AdminEvents />} />
              <Route path="/events/edit/:id" element={<AdminEvents />} />
              <Route path="/news" element={<AdminNews />} />
              <Route path="/news/new" element={<BlogEditor />} />
              <Route path="/news/edit/:id" element={<BlogEditor />} />
              <Route path="/gallery" element={<AdminGallery />} />
              <Route path="/linktree" element={<AdminLinktree />} />
              <Route path="/newsletter" element={<AdminNewsletter />} />
              <Route
                path="/cache"
                element={
                  <CacheControl
                    isAdmin={isAdmin}
                    onCacheCleared={() => {
                      console.log('Cache cleared successfully')
                    }}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPanel
