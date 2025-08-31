import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminEvents from '../components/admin/AdminEvents'
import AdminNews from '../components/admin/AdminNews'
import BlogEditor from '../components/admin/BlogEditor'
import AdminGallery from '../components/admin/AdminGallery'
import AdminLinktree from '../components/admin/AdminLinktree'
import AdminNewsletter from '../components/admin/AdminNewsletter'
import AdminLogin from '../components/admin/AdminLogin'
import CacheControl from '../components/CacheControl'
import { supabase, authAPI } from '../lib/supabase'

// Admin Layout Component
const AdminLayout: React.FC<{ 
  children: React.ReactNode
  currentSection: string
  setCurrentSection: (section: string) => void
}> = ({ children, currentSection, setCurrentSection }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Update current section when path changes
  useEffect(() => {
    const path = location.pathname
    if (path === '/admin' || path === '/admin/') {
      setCurrentSection('dashboard')
    } else if (path.startsWith('/admin/events')) {
      setCurrentSection('events')
    } else if (path.startsWith('/admin/news')) {
      setCurrentSection('news')
    } else if (path.startsWith('/admin/gallery')) {
      setCurrentSection('gallery')
    } else if (path.startsWith('/admin/linktree')) {
      setCurrentSection('linktree')
    } else if (path.startsWith('/admin/newsletter')) {
      setCurrentSection('newsletter')
    } else if (path.startsWith('/admin/cache')) {
      setCurrentSection('cache')
    }
  }, [location.pathname, setCurrentSection])

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          console.log('User authenticated:', user.email)
          
          // Check if user is admin using authAPI
          try {
            const isAdminUser = await authAPI.isAdmin()
            setIsAdmin(isAdminUser)
          } catch (err) {
            console.error('Error checking admin status:', err)
            // Fallback: assume admin if we can't check
            setIsAdmin(true)
          }
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin status...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <AdminLogin />
  }

  const handleTabClick = (section: string) => {
    setCurrentSection(section)
    switch (section) {
      case 'dashboard':
        navigate('/admin')
        break
      case 'events':
        navigate('/admin/events')
        break
      case 'news':
        navigate('/admin/news')
        break
      case 'gallery':
        navigate('/admin/gallery')
        break
      case 'linktree':
        navigate('/admin/linktree')
        break
      case 'newsletter':
        navigate('/admin/newsletter')
        break
      case 'cache':
        navigate('/admin/cache')
        break
      default:
        navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin Dashboard</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentSection === 'dashboard'
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleTabClick('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentSection === 'events' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => handleTabClick('news')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentSection === 'news' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              News
            </button>
            <button
              onClick={() => handleTabClick('gallery')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentSection === 'gallery' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => handleTabClick('linktree')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentSection === 'linktree' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Linktree
            </button>
            <button
              onClick={() => handleTabClick('newsletter')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentSection === 'newsletter' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Newsletter
            </button>
            <button
              onClick={() => handleTabClick('cache')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentSection === 'cache' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cache
            </button>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}

// Main Admin Page Component
const AdminPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('dashboard')
  
  return (
    <AdminLayout currentSection={currentSection} setCurrentSection={setCurrentSection}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/events" element={<AdminEvents />} />
        <Route path="/news" element={<AdminNews />} />
        <Route path="/news/new" element={<BlogEditor />} />
        <Route path="/news/edit/:id" element={<BlogEditor />} />
        <Route path="/gallery" element={<AdminGallery />} />
        <Route path="/linktree" element={<AdminLinktree />} />
        <Route path="/newsletter" element={<AdminNewsletter />} />
        <Route path="/cache" element={<CacheControl />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminPage