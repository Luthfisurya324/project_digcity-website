import React, { useState, useEffect } from 'react'
import { eventAPI, newsAPI, galleryAPI, newsletterAPI } from '../../lib/supabase'
import type { Event, News } from '../../lib/supabase'

interface DashboardStats {
  totalEvents: number
  totalNews: number
  totalGallery: number
  totalNewsletter: number
  recentEvents: Event[]
  recentNews: News[]
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalNews: 0,
    totalGallery: 0,
    totalNewsletter: 0,
    recentEvents: [],
    recentNews: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [events, news, gallery, newsletterCount] = await Promise.all([
        eventAPI.getAll(),
        newsAPI.getAll(),
        galleryAPI.getAll(),
        newsletterAPI.getSubscriberCount()
      ])

      setStats({
        totalEvents: events.length,
        totalNews: news.length,
        totalGallery: gallery.length,
        totalNewsletter: newsletterCount,
        recentEvents: events.slice(0, 5),
        recentNews: news.slice(0, 5)
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: '📅',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total News',
      value: stats.totalNews,
      icon: '📰',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Gallery',
      value: stats.totalGallery,
      icon: '🖼️',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.totalNewsletter,
      icon: '📧',
      color: 'bg-pink-500',
      textColor: 'text-pink-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600 mt-2">Welcome to DIGCITY Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">{card.title}</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Events</h2>
          </div>
          <div className="p-6">
            {stats.recentEvents.length > 0 ? (
              <div className="space-y-4">
                {stats.recentEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">{event.title}</p>
                      <p className="text-xs text-secondary-500">{formatDate(event.date)}</p>
                      <p className="text-xs text-secondary-600 mt-1">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 text-center py-8">No events found</p>
            )}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-secondary-900">Recent News</h2>
          </div>
          <div className="p-6">
            {stats.recentNews.length > 0 ? (
              <div className="space-y-4">
                {stats.recentNews.map((news) => (
                  <div key={news.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">{news.title}</p>
                      <p className="text-xs text-secondary-500">{formatDate(news.published_date)}</p>
                      <p className="text-xs text-secondary-600 mt-1">By {news.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 text-center py-8">No news found</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">📅</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-secondary-900">Add New Event</p>
              <p className="text-sm text-secondary-500">Create a new event</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">📰</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-secondary-900">Add New Article</p>
              <p className="text-sm text-secondary-500">Write a new article</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600">🖼️</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-secondary-900">Add Gallery Item</p>
              <p className="text-sm text-secondary-500">Upload new photos</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard