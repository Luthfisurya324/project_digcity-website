import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { authAPI } from '../lib/supabase'
import { runSupabaseTests } from '../utils/supabaseTest'
import { getAdminBasePath } from '../utils/domainDetection'
import AdminLogin from '../components/admin/AdminLogin'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminEvents from '../components/admin/AdminEvents'
import AdminNews from '../components/admin/AdminNews'
import BlogEditor from '../components/admin/BlogEditor'
import AdminGallery from '../components/admin/AdminGallery'
import AdminNewsletter from '../components/admin/AdminNewsletter'
import AdminLinktree from '../components/admin/AdminLinktree'
import CacheControl from '../components/CacheControl'
import { 
  BarChart3, 
  Calendar, 
  Newspaper, 
  Image, 
  Mail, 
  Trash2,
  User,
  Settings,
  Link,
  Home
} from 'lucide-react'

interface User {
  id: string
  email: string
  role: string
}

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkUser()
  }, [])

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

  const handleLogin = async (email: string, password: string) => {
    try {
      await authAPI.signIn(email, password)
      await checkUser()
    } catch (error) {
      throw error
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
    
    switch (tabId) {
      case 'dashboard':
        navigate(`${adminBasePath}`)
        break
      case 'events':
        navigate(`${adminBasePath}/events`)
        break
      case 'news':
        navigate(`${adminBasePath}/news`)
        break
      case 'gallery':
        navigate(`${adminBasePath}/gallery`)
        break
      case 'linktree':
        navigate(`${adminBasePath}/linktree`)
        break
      case 'newsletter':
        navigate(`${adminBasePath}/newsletter`)
        break
      case 'cache':
        navigate(`${adminBasePath}/cache`)
        break
      default:
        navigate(`${adminBasePath}`)
    }
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

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 size={18} />, color: 'text-blue-600' },
    { id: 'events', name: 'Events', icon: <Calendar size={18} />, color: 'text-green-600' },
    { id: 'news', name: 'News', icon: <Newspaper size={18} />, color: 'text-purple-600' },
    { id: 'gallery', name: 'Gallery', icon: <Image size={18} />, color: 'text-pink-600' },
    { id: 'linktree', name: 'Linktree', icon: <Link size={18} />, color: 'text-orange-600' },
    { id: 'newsletter', name: 'Newsletter', icon: <Mail size={18} />, color: 'text-indigo-600' },
    { id: 'cache', name: 'Cache', icon: <Trash2 size={18} />, color: 'text-gray-600' }
  ]

  const activeTab = getActiveTab()

  // Detect if current route is Blog Editor (new or edit) to enable fullscreen mode
  const adminBasePath = getAdminBasePath()
  const isEditorRoute = location.pathname === `${adminBasePath}/news/new` || location.pathname.startsWith(`${adminBasePath}/news/edit/`)

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-white">
      {/* Clean Header - hidden on editor routes */}
      {!isEditorRoute && (
        <header className="bg-white/90 backdrop-blur border-b border-secondary-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Home size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900">DIGCITY Admin</h1>
                  <p className="text-sm text-secondary-500">Content Management System</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2 bg-white/70 backdrop-blur rounded-lg px-3 py-2 border border-secondary-200">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.email.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-secondary-700">{user.email}</span>
                </div>
                <button
                  onClick={async () => {
                    console.log('🧪 Running Supabase tests...')
                    await runSupabaseTests()
                  }}
                  className="bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 text-sm font-medium"
                  title="Test Supabase connection"
                >
                  🧪 Test
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className={isEditorRoute ? '' : 'flex'}>
        {/* Clean Sidebar - hidden on editor routes */}
        {!isEditorRoute && (
          <aside className="w-64 bg-white/90 backdrop-blur border-r border-secondary-200 min-h-screen">
            <div className="p-6">
              <div className="mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
                  <User size={24} className="text-primary-600" />
                </div>
                <p className="font-semibold text-secondary-900">Welcome back!</p>
                <p className="text-sm text-secondary-600">Manage your content</p>
              </div>
            </div>
            <nav className="px-4 pb-6">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 border border-primary-200 text-primary-700 shadow-sm'
                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                    }`}
                  >
                    <span className={`flex-shrink-0 ${activeTab === tab.id ? 'text-primary-600' : tab.color}`}>
                      {tab.icon}
                    </span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isEditorRoute ? '' : 'p-6 overflow-y-auto'}`}>
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
              <Route path="/cache" element={
                <CacheControl isAdmin={isAdmin} onCacheCleared={() => {
                  console.log('Cache cleared successfully');
                }} />
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPanel
