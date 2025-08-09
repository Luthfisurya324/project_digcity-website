import React, { useState, useEffect } from 'react'
import { authAPI } from '../lib/supabase'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminEvents from './admin/AdminEvents'
import AdminNews from './admin/AdminNews'
import AdminGallery from './admin/AdminGallery'

interface User {
  id: string
  email: string
  role: string
}

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser()
      if (currentUser) {
        const adminStatus = await authAPI.isAdmin()
        setIsAdmin(adminStatus)
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          role: adminStatus ? 'admin' : 'viewer'
        })
      } else {
        // No user session, reset state
        setUser(null)
        setIsAdmin(false)
      }
    } catch (error) {
      // Handle auth session missing error gracefully
      console.log('No active session found')
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
      setActiveTab('dashboard')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <AdminLogin onLogin={handleLogin} />
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'news', name: 'News', icon: '📰' },
    { id: 'gallery', name: 'Gallery', icon: '🖼️' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />
      case 'events':
        return <AdminEvents />
      case 'news':
        return <AdminNews />
      case 'gallery':
        return <AdminGallery />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-secondary-900">DIGCITY Admin</h1>
              <span className="text-sm text-secondary-500">Panel Administrasi</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-600">Welcome, {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-secondary-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default AdminPanel