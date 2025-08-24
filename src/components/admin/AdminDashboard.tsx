import React, { useState, useEffect } from 'react'
import { eventAPI, newsAPI, galleryAPI, newsletterAPI } from '../../lib/supabase'
import { 
  Calendar, 
  Newspaper, 
  Image, 
  Mail, 
  Plus, 
  Edit3, 
  Upload, 
  Send,
  CheckCircle,
  TrendingUp,
  Users,
  Eye,
  ExternalLink,
  Clock,
  Star
} from 'lucide-react'

interface DashboardStats {
  totalEvents: number
  totalNews: number
  totalPhotos: number
  totalSubscribers: number
  upcomingEvents: number
  recentNews: number
  totalViews: number
  activeContent: number
}

interface RecentActivity {
  id: string
  type: 'event' | 'news' | 'gallery' | 'linktree'
  title: string
  action: string
  timestamp: string
  status: 'published' | 'draft' | 'archived'
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalNews: 0,
    totalPhotos: 0,
    totalSubscribers: 0,
    upcomingEvents: 0,
    recentNews: 0,
    totalViews: 0,
    activeContent: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [events, news, photos, subscribers] = await Promise.all([
        eventAPI.getAll(),
        newsAPI.getAll(),
        galleryAPI.getAll(),
        newsletterAPI.getAllSubscribers()
      ])

      const upcomingEvents = events.filter((e: any) => new Date(e.date) > new Date()).length
      const recentNews = news.slice(0, 3).length
      const activeContent = events.length + news.length + photos.length

      setStats({
        totalEvents: events.length,
        totalNews: news.length,
        totalPhotos: photos.length,
        totalSubscribers: subscribers.length,
        upcomingEvents,
        recentNews,
        totalViews: Math.floor(Math.random() * 10000) + 5000, // Mock data for now
        activeContent
      })

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'event',
          title: 'Workshop Digital Marketing',
          action: 'Published',
          timestamp: '2 hours ago',
          status: 'published'
        },
        {
          id: '2',
          type: 'news',
          title: 'Update Kebijakan Digital City',
          action: 'Updated',
          timestamp: '1 day ago',
          status: 'published'
        },
        {
          id: '3',
          type: 'gallery',
          title: 'Event Photos - Tech Summit 2025',
          action: 'Uploaded',
          timestamp: '3 days ago',
          status: 'published'
        }
      ])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang di DIGCITY Admin</h1>
            <p className="text-primary-100">Kelola konten website dan pantau performa dengan mudah</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-primary-100">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.activeContent}</div>
              <div className="text-sm text-primary-100">Active Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-secondary-200 p-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-secondary-600">Events</p>
              <p className="text-xl font-bold text-secondary-900">{stats.totalEvents}</p>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                {stats.upcomingEvents} upcoming
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-200 p-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <Newspaper size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-secondary-600">News</p>
              <p className="text-xl font-bold text-secondary-900">{stats.totalNews}</p>
              <p className="text-xs text-blue-600 flex items-center">
                <Clock size={12} className="mr-1" />
                {stats.recentNews} recent
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-200 p-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Image size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-secondary-600">Gallery</p>
              <p className="text-xl font-bold text-secondary-900">{stats.totalPhotos}</p>
              <p className="text-xs text-purple-600 flex items-center">
                <Eye size={12} className="mr-1" />
                Photos
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-200 p-4 hover:shadow-lg transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-secondary-600">Subscribers</p>
              <p className="text-xl font-bold text-secondary-900">{stats.totalSubscribers}</p>
              <p className="text-xs text-pink-600 flex items-center">
                <Mail size={12} className="mr-1" />
                Newsletter
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Star size={20} className="text-yellow-500 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="flex items-center space-x-3 p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Plus size={16} className="text-primary-600" />
              </div>
              <span className="text-primary-700 font-medium text-sm">Add Event</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Edit3 size={16} className="text-green-600" />
              </div>
              <span className="text-green-700 font-medium text-sm">Write News</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Upload size={16} className="text-purple-600" />
              </div>
              <span className="text-purple-700 font-medium text-sm">Upload Photo</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors group">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                <Send size={16} className="text-pink-600" />
              </div>
              <span className="text-pink-700 font-medium text-sm">Send Newsletter</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Clock size={20} className="text-secondary-500 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'event' ? 'bg-blue-100' :
                  activity.type === 'news' ? 'bg-green-100' :
                  activity.type === 'gallery' ? 'bg-purple-100' : 'bg-secondary-100'
                }`}>
                  {activity.type === 'event' && <Calendar size={16} className="text-blue-600" />}
                  {activity.type === 'news' && <Newspaper size={16} className="text-green-600" />}
                  {activity.type === 'gallery' && <Image size={16} className="text-purple-600" />}
                  {activity.type === 'linktree' && <ExternalLink size={16} className="text-secondary-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-secondary-900 text-sm">{activity.title}</p>
                  <p className="text-xs text-secondary-600">{activity.action} • {activity.timestamp}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'published' ? 'bg-green-100 text-green-700' :
                  activity.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl border border-secondary-200 p-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
          <CheckCircle size={20} className="text-green-500 mr-2" />
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 font-medium">Database</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 font-medium">Authentication</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 font-medium">File Storage</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 font-medium">API Services</span>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl border border-secondary-200 p-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
          <TrendingUp size={20} className="text-blue-500 mr-2" />
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {((stats.totalViews / 10000) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-blue-700">Engagement Rate</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.activeContent}
            </div>
            <div className="text-sm text-green-700">Active Content</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.totalSubscribers > 0 ? Math.round(stats.totalSubscribers / stats.totalViews * 1000) : 0}
            </div>
            <div className="text-sm text-purple-700">Conversion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard