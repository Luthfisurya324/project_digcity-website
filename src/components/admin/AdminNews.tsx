import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { newsAPI } from '../../lib/supabase'
import type { News } from '../../lib/supabase'
import { 
  Plus, 
  Newspaper, 
  Trash2, 
  Edit3, 
  Calendar, 
  Image as ImageIcon,
  Tag
} from 'lucide-react'

interface NewsFormData {
  title: string
  content: string
  excerpt: string
  author: string
  published_date: string
  image_url: string
  category: string
  tags: string[]
}

const AdminNews: React.FC = () => {
  const navigate = useNavigate()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  const categories = [
    { value: 'DIGIMON', label: 'DIGIMON' },
    { value: 'Level Up Day', label: 'Level Up Day' },
    { value: 'SCBD', label: 'SCBD' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'general', label: 'General' }
  ]

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const data = await newsAPI.getAll()
      setNews(data)
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (newsItem: News) => {
    console.log('Navigating to edit:', newsItem.id)
    // Use absolute URL for admin subdomain
    const currentHost = window.location.host
    const isAdminSubdomain = currentHost.startsWith('admin.')
    
    if (isAdminSubdomain) {
      // If on admin subdomain, use relative path
      console.log('Admin subdomain detected, navigating to /news/edit/' + newsItem.id)
      window.location.href = `/news/edit/${newsItem.id}`
    } else {
      // If on main domain, use full path
      console.log('Main domain detected, navigating to /admin/news/edit/' + newsItem.id)
      window.location.href = `/admin/news/edit/${newsItem.id}`
    }
  }

  const handleAddNew = () => {
    console.log('Navigating to /admin/news/new')
    // Use absolute URL for admin subdomain
    const currentHost = window.location.host
    const isAdminSubdomain = currentHost.startsWith('admin.')
    
    if (isAdminSubdomain) {
      // If on admin subdomain, use relative path
      console.log('Admin subdomain detected, navigating to /news/new')
      window.location.href = '/news/new'
    } else {
      // If on main domain, use full path
      console.log('Main domain detected, navigating to /admin/news/new')
      window.location.href = '/admin/news/new'
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        await newsAPI.delete(id)
        await loadNews()
      } catch (error) {
        console.error('Error deleting news:', error)
        alert('Error deleting news. Please try again.')
      }
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

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">News Management</h1>
          <p className="text-secondary-600">Manage DIGCITY news and articles</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add News</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Total News</p>
          <p className="text-2xl font-bold text-secondary-900">{news.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">This Month</p>
          <p className="text-2xl font-bold text-green-600">
            {news.filter(n => {
              const newsDate = new Date(n.published_date)
              const now = new Date()
              return newsDate.getMonth() === now.getMonth() && newsDate.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Categories</p>
          <p className="text-2xl font-bold text-secondary-600">
            {new Set(news.map(n => n.category)).size}
          </p>
        </div>
      </div>



      {/* News List */}
      <div className="bg-white rounded-lg border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">All News ({news.length})</h2>
        </div>
        
        {news.length > 0 ? (
          <div className="divide-y divide-secondary-200">
            {news.map((newsItem) => (
              <div key={newsItem.id} className="p-6 hover:bg-secondary-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        <Newspaper size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-secondary-900">{newsItem.title}</h3>
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold">
                            {newsItem.category}
                          </span>
                        </div>
                        <p className="text-secondary-600 mb-3 line-clamp-2">{newsItem.content}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(newsItem.published_date)}
                          </span>
                          <span className="flex items-center">
                            <Tag size={14} className="mr-1" />
                            {newsItem.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 lg:mt-0 lg:ml-6">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <Newspaper size={48} />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">No news yet</h3>
            <p className="text-secondary-500 mb-6">Start writing your first article!</p>
            <button
              onClick={handleAddNew}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Plus size={20} className="mr-2" />
              Add First News
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminNews