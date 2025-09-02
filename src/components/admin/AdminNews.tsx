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
  Tag,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { getAdminBasePath } from '../../utils/domainDetection'

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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)

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
      setLoading(true)
      const data = await newsAPI.getAll()
      setNews(data)
    } catch (error) {
      console.error('Error loading news:', error)
      alert('Gagal memuat daftar berita. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (newsItem: News) => {
    console.log('🔍 AdminNews: handleEdit called for:', newsItem.id)
    console.log('🔍 AdminNews: Current location:', window.location.href)
    console.log('🔍 AdminNews: Current pathname:', window.location.pathname)
    console.log('🔍 AdminNews: Current hostname:', window.location.hostname)
    const base = getAdminBasePath()
    console.log('🔍 AdminNews: Navigating to', `${base}/news/edit/${newsItem.id}`)
    navigate(`${base}/news/edit/${newsItem.id}`)
  }

  const handleAddNew = () => {
    console.log('🔍 AdminNews: handleAddNew called')
    console.log('🔍 AdminNews: Current location:', window.location.href)
    console.log('🔍 AdminNews: Current pathname:', window.location.pathname)
    console.log('🔍 AdminNews: Current hostname:', window.location.hostname)
    const base = getAdminBasePath()
    console.log('🔍 AdminNews: Navigating to', `${base}/news/new`)
    navigate(`${base}/news/new`)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        setDeletingId(id)
        await newsAPI.delete(id)
        await loadNews()
        setShowSuccess('Berita berhasil dihapus!')
        setTimeout(() => setShowSuccess(null), 3000)
      } catch (error) {
        console.error('Error deleting news:', error)
        alert('Gagal menghapus berita. Silakan coba lagi.')
      } finally {
        setDeletingId(null)
      }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Tanggal tidak valid'
    }
  }

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue)
    return category ? category.label : categoryValue
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat daftar berita...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{showSuccess}</span>
        </div>
      )}

      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Manajemen Berita</h1>
          <p className="text-secondary-600">Kelola berita dan artikel DIGCITY</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Tambah Berita</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Total Berita</p>
          <p className="text-2xl font-bold text-secondary-900">{news.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Bulan Ini</p>
          <p className="text-2xl font-bold text-green-600">
            {news.filter(n => {
              try {
                const newsDate = new Date(n.published_date)
                const now = new Date()
                return newsDate.getMonth() === now.getMonth() && newsDate.getFullYear() === now.getFullYear()
              } catch {
                return false
              }
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Kategori</p>
          <p className="text-2xl font-bold text-secondary-600">
            {new Set(news.map(n => n.category)).size}
          </p>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-lg border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Semua Berita ({news.length})</h2>
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
                          <h3 className="text-lg font-semibold text-secondary-900 line-clamp-1">
                            {newsItem.title || 'Judul tidak tersedia'}
                          </h3>
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold whitespace-nowrap">
                            {getCategoryLabel(newsItem.category)}
                          </span>
                        </div>
                        <p className="text-secondary-600 mb-3 line-clamp-2">
                          {newsItem.excerpt || newsItem.content || 'Konten tidak tersedia'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(newsItem.published_date)}
                          </span>
                          <span className="flex items-center">
                            <Tag size={14} className="mr-1" />
                            {newsItem.author || 'Penulis tidak tersedia'}
                          </span>
                          {newsItem.tags && newsItem.tags.length > 0 && (
                            <span className="flex items-center">
                              <Tag size={14} className="mr-1" />
                              {newsItem.tags.slice(0, 3).join(', ')}
                              {newsItem.tags.length > 3 && ` +${newsItem.tags.length - 3}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 lg:mt-0 lg:ml-6">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem.id)}
                      disabled={deletingId === newsItem.id}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      <span>{deletingId === newsItem.id ? 'Menghapus...' : 'Hapus'}</span>
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
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Belum ada berita</h3>
            <p className="text-secondary-500 mb-6">Mulai menulis artikel pertama Anda!</p>
            <button
              onClick={handleAddNew}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
            >
              <Plus size={20} />
              <span>Tambah Berita Pertama</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminNews