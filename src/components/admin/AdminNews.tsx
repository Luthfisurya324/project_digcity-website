import React, { useState, useEffect } from 'react'
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
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    published_date: new Date().toISOString().slice(0, 10),
    image_url: '',
    category: 'general',
    tags: []
  })
  const [submitting, setSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingNews) {
        await newsAPI.update(editingNews.id, formData)
      } else {
        await newsAPI.create(formData)
      }
      
      await loadNews()
      resetForm()
    } catch (error) {
      console.error('Error saving news:', error)
      alert('Error saving news. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt || '',
      author: newsItem.author,
      published_date: new Date(newsItem.published_date).toISOString().slice(0, 10),
      image_url: newsItem.image_url || '',
      category: newsItem.category,
      tags: newsItem.tags || []
    })
    setShowForm(true)
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

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      published_date: new Date().toISOString().slice(0, 10),
      image_url: '',
      category: 'general',
      tags: []
    })
    setEditingNews(null)
    setShowForm(false)
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
          onClick={() => setShowForm(true)}
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingNews ? 'Edit News' : 'Write New Article'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="News title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Content</label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Write your news content here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Author</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Publish Date</label>
                  <input
                    type="date"
                    required
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Saving...' : (editingNews ? 'Update News' : 'Publish News')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              onClick={() => setShowForm(true)}
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