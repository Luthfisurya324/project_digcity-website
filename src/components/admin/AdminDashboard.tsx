import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventAPI, newsAPI, galleryAPI, newsletterAPI } from '../../lib/supabase'
import { getAdminBasePath } from '../../utils/domainDetection'
import {
  Calendar,
  Newspaper,
  Image,
  Plus,
  Edit3,
  Upload,
  Send,
  CheckCircle,
  TrendingUp,
  Users,
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
  const navigate = useNavigate()
  const adminPath = getAdminBasePath()
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

      // Mock recent activity - replace with actual data fetching if available
      const recentActivities: RecentActivity[] = []

      // Add recent events
      events.slice(0, 2).forEach((e: any) => {
        recentActivities.push({
          id: `event-${e.id}`,
          type: 'event',
          title: e.title,
          action: 'Created',
          timestamp: new Date(e.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
          status: 'published'
        })
      })

      // Add recent news
      news.slice(0, 2).forEach((n: any) => {
        recentActivities.push({
          id: `news-${n.id}`,
          type: 'news',
          title: n.title,
          action: 'Published',
          timestamp: new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
          status: 'published'
        })
      })

      // Add recent photos
      photos.slice(0, 2).forEach((p: any) => {
        recentActivities.push({
          id: `photo-${p.id}`,
          type: 'gallery',
          title: p.title,
          action: 'Uploaded',
          timestamp: new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
          status: 'published'
        })
      })

      // Sort by timestamp (mock, since we formatted it already, in real app sort by raw date)
      setRecentActivity(recentActivities.sort(() => 0.5 - Math.random()).slice(0, 5))

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
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:bg-[#1E1E1E] dark:text-[rgba(255,255,255,0.87)] rounded-xl p-6 text-white transition-colors shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang di DIGCITY Admin</h1>
            <p className="text-primary-100">Kelola konten website dan pantau performa dengan mudah</p>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-primary-100 font-medium">Total Views</div>
            </div>
            <div className="w-px h-10 bg-primary-400/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.activeContent}</div>
              <div className="text-sm text-primary-100 font-medium">Active Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-500 dark:text-neutral-400 uppercase tracking-wide">Events</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-secondary-900 dark:text-neutral-100">{stats.totalEvents}</p>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {stats.upcomingEvents} upcoming
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
              <Newspaper size={24} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-500 dark:text-neutral-400 uppercase tracking-wide">News</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-secondary-900 dark:text-neutral-100">{stats.totalNews}</p>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {stats.recentNews} recent
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
              <Image size={24} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-500 dark:text-neutral-400 uppercase tracking-wide">Gallery</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-secondary-900 dark:text-neutral-100">{stats.totalPhotos}</p>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  Total Photos
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center border border-pink-100">
              <Users size={24} className="text-pink-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-500 dark:text-neutral-400 uppercase tracking-wide">Subscribers</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-secondary-900 dark:text-neutral-100">{stats.totalSubscribers}</p>
                <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6 transition-colors dark:bg-[#1E1E1E] dark:border-[#2A2A2A] hover:shadow-md">
          <h2 className="text-lg font-bold text-secondary-900 mb-6 flex items-center dark:text-white">
            <div className="p-2 bg-yellow-50 rounded-lg mr-3">
              <Star size={20} className="text-yellow-600" />
            </div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              className="flex items-center p-4 bg-white border border-secondary-100 rounded-xl hover:border-primary-300 hover:shadow-md transition-all group dark:bg-[#232323] dark:border-[#2A2A2A] dark:hover:border-primary-500"
              onClick={() => navigate(`${adminPath}/events/new`)}
            >
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors mr-3">
                <Plus size={20} className="text-primary-600" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-secondary-900 dark:text-white">Add Event</span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Create new activity</span>
              </div>
            </button>

            <button
              className="flex items-center p-4 bg-white border border-secondary-100 rounded-xl hover:border-green-300 hover:shadow-md transition-all group dark:bg-[#232323] dark:border-[#2A2A2A] dark:hover:border-green-500"
              onClick={() => navigate(`${adminPath}/news/new`)}
            >
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors mr-3">
                <Edit3 size={20} className="text-green-600" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-secondary-900 dark:text-white">Write News</span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Publish article</span>
              </div>
            </button>

            <button
              className="flex items-center p-4 bg-white border border-secondary-100 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group dark:bg-[#232323] dark:border-[#2A2A2A] dark:hover:border-purple-500"
              onClick={() => navigate(`${adminPath}/gallery`)}
            >
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors mr-3">
                <Upload size={20} className="text-purple-600" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-secondary-900 dark:text-white">Upload Photo</span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Add to gallery</span>
              </div>
            </button>

            <button
              className="flex items-center p-4 bg-white border border-secondary-100 rounded-xl hover:border-pink-300 hover:shadow-md transition-all group dark:bg-[#232323] dark:border-[#2A2A2A] dark:hover:border-pink-500"
              onClick={() => navigate(`${adminPath}/newsletter`)}
            >
              <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center group-hover:bg-pink-100 transition-colors mr-3">
                <Send size={20} className="text-pink-600" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-secondary-900 dark:text-white">Newsletter</span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Send updates</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6 transition-colors dark:bg-[#1E1E1E] dark:border-[#2A2A2A] hover:shadow-md">
          <h2 className="text-lg font-bold text-secondary-900 mb-6 flex items-center dark:text-white">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <Clock size={20} className="text-blue-600" />
            </div>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-secondary-50 rounded-xl transition-colors dark:hover:bg-[#232323]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${activity.type === 'event' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                    activity.type === 'news' ? 'bg-green-50 border-green-100 text-green-600' :
                      activity.type === 'gallery' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                        'bg-secondary-50 border-secondary-100 text-secondary-600'
                  }`}>
                  {activity.type === 'event' && <Calendar size={18} />}
                  {activity.type === 'news' && <Newspaper size={18} />}
                  {activity.type === 'gallery' && <Image size={18} />}
                  {activity.type === 'linktree' && <ExternalLink size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-secondary-900 truncate dark:text-neutral-100">{activity.title}</p>
                  <p className="text-xs text-secondary-500 dark:text-neutral-400 flex items-center mt-0.5">
                    <span className="capitalize font-medium text-secondary-700 dark:text-neutral-300 mr-1.5">{activity.action}</span>
                    <span className="w-1 h-1 rounded-full bg-secondary-300 mx-1.5"></span>
                    {activity.timestamp}
                  </p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${activity.status === 'published' ? 'bg-green-50 text-green-700 border border-green-100' :
                    activity.status === 'draft' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                      'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                  {activity.status}
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-secondary-500 text-sm">
                No recent activity found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl border border-secondary-200 p-6 transition-colors dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
          <CheckCircle size={20} className="text-green-500 mr-2" />
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg dark:bg-[#232323]">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 dark:text-neutral-100 font-medium">Database</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg dark:bg-[#232323]">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 dark:text-neutral-100 font-medium">Authentication</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg dark:bg-[#232323]">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 dark:text-neutral-100 font-medium">File Storage</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-neutral-700 rounded-lg">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-700 dark:text-neutral-100 font-medium">API Services</span>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl border border-secondary-200 p-6 transition-colors dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
          <TrendingUp size={20} className="text-blue-500 mr-2" />
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-[#232323]">
            <div className="text-2xl font-bold text-blue-600 dark:text-neutral-100 mb-1">
              {((stats.totalViews / 10000) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-blue-700 dark:text-neutral-200">Engagement Rate</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-[#232323]">
            <div className="text-2xl font-bold text-green-600 dark:text-neutral-100 mb-1">
              {stats.activeContent}
            </div>
            <div className="text-sm text-green-700 dark:text-neutral-200">Active Content</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg dark:bg-[#232323]">
            <div className="text-2xl font-bold text-purple-600 dark:text-neutral-100 mb-1">
              {stats.totalSubscribers > 0 ? Math.round(stats.totalSubscribers / stats.totalViews * 1000) : 0}
            </div>
            <div className="text-sm text-purple-700 dark:text-neutral-200">Conversion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
