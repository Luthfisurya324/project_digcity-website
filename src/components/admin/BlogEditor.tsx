import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { newsAPI } from '../../lib/supabase'
import { getAdminBasePath } from '../../utils/domainDetection'
import type { News } from '../../lib/supabase'
import '../../styles/blog.css'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  BookOpen
} from 'lucide-react'

interface BlogFormData {
  title: string
  content: string
  excerpt: string
  author: string
  published_date: string
  image_url: string
  category: string
  tags: string[]
}

interface FormErrors {
  title?: string
  content?: string
  excerpt?: string
  author?: string
  image_url?: string
}

const BlogEditor: React.FC = () => {
  console.log('BlogEditor component loaded')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  console.log('BlogEditor id:', id)
  const adminBasePath = getAdminBasePath()
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    published_date: new Date().toISOString().slice(0, 10),
    image_url: '',
    category: 'general',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const categories = [
    { value: 'DIGIMON', label: 'DIGIMON' },
    { value: 'Level Up Day', label: 'Level Up Day' },
    { value: 'SCBD', label: 'SCBD' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'general', label: 'General' }
  ]

  useEffect(() => {
    console.log('🔍 BlogEditor: useEffect triggered, id:', id)
    if (id && id !== 'new') {
      console.log('🔍 BlogEditor: Loading existing news with id:', id)
      loadNews()
    } else {
      console.log('🔍 BlogEditor: Creating new news, id:', id)
    }
  }, [id])

  const loadNews = async () => {
    console.log('🔍 BlogEditor: loadNews called for id:', id)
    setLoading(true)
    try {
      const news = await newsAPI.getById(id!)
      console.log('🔍 BlogEditor: News loaded:', news)
      if (news) {
        setFormData({
          title: news.title || '',
          content: news.content || '',
          excerpt: news.excerpt || '',
          author: news.author || '',
          published_date: news.published_date || new Date().toISOString().slice(0, 10),
          image_url: news.image_url || '',
          category: news.category || 'general',
          tags: news.tags || []
        })
        console.log('🔍 BlogEditor: Form data updated')
      }
    } catch (error) {
      console.error('🔍 BlogEditor: Error loading news:', error)
      alert('Gagal memuat artikel. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul artikel wajib diisi'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Konten artikel wajib diisi'
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt wajib diisi'
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi'
    }
    
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'URL gambar tidak valid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    setErrors({})

    try {
      if (id && id !== 'new') {
        await newsAPI.update(id, formData)
        setShowSuccess(true)
        setTimeout(() => {
          navigate(`${adminBasePath}/news`)
        }, 1500)
      } else {
        await newsAPI.create(formData)
        setShowSuccess(true)
        setTimeout(() => {
          navigate(`${adminBasePath}/news`)
        }, 1500)
      }
    } catch (error) {
      console.error('Error saving news:', error)
      alert('Gagal menyimpan artikel. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) })
  }

  const insertContent = (content: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = formData.content.substring(0, start) + content + formData.content.substring(end)
      setFormData({ ...formData, content: newContent })
      
      // Set cursor position after inserted content
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + content.length, start + content.length)
      }, 0)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Memuat editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Artikel berhasil disimpan! Mengalihkan...</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`${adminBasePath}/news`)}
                className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke News
              </button>
              <h1 className="text-xl font-semibold text-secondary-900">
                {id && id !== 'new' ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  sidebarOpen 
                    ? 'bg-white border-secondary-300 text-secondary-700 hover:bg-secondary-50' 
                    : 'bg-primary-50 border-primary-200 text-primary-700'
                }`}
                title="Toggle panel samping"
              >
                {sidebarOpen ? 'Sembunyikan Panel' : 'Tampilkan Panel'}
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  previewMode 
                    ? 'bg-primary-50 border-primary-200 text-primary-700' 
                    : 'bg-white border-secondary-300 text-secondary-700 hover:bg-secondary-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-6 ${sidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Main Editor */}
          <div className={`${sidebarOpen ? 'lg:col-span-2' : 'lg:col-span-3'} min-h-0`}> 
            <div className="bg-white rounded-lg shadow-sm border h-full overflow-auto">
              {previewMode ? (
                /* Preview Mode - Mirroring BlogDetailPage */
                <article className="p-8">
                  {/* Category Badge */}
                  <div className="mb-6">
                    <span className="inline-block bg-primary-100 text-primary-600 text-sm px-4 py-2 rounded-full font-medium">
                      {formData.category}
                    </span>
                  </div>

                  {/* Article Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
                    {formData.title || 'Judul Artikel'}
                  </h1>

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 text-sm text-secondary-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{formData.author || 'Penulis'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formData.published_date ? formatDate(formData.published_date) : 'Tanggal'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Preview Mode</span>
                    </div>
                  </div>

                  {/* Article Image */}
                  {formData.image_url && (
                    <div className="mb-8">
                      <img
                        src={formData.image_url}
                        alt={formData.title}
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="blog-content mb-8">
                    <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
                  </div>

                  {/* Article Tags */}
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-secondary-100 text-secondary-700 text-sm px-3 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ) : (
                /* Edit Mode */
                <div className="p-8 space-y-8">
                  {/* Category Badge */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="inline-block bg-primary-100 text-primary-600 text-sm px-4 py-2 rounded-full font-medium border-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Judul Artikel <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value })
                        if (errors.title) setErrors({ ...errors, title: undefined })
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-3xl sm:text-4xl font-bold text-secondary-900 leading-tight ${
                        errors.title ? 'border-red-300' : 'border-secondary-300'
                      }`}
                      placeholder="Judul Artikel Anda..."
                    />
                    {errors.title && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-secondary-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => {
                          setFormData({ ...formData, author: e.target.value })
                          if (errors.author) setErrors({ ...errors, author: undefined })
                        }}
                        className={`bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-secondary-600 ${
                          errors.author ? 'text-red-600' : ''
                        }`}
                        placeholder="Nama penulis"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <input
                        type="date"
                        value={formData.published_date}
                        onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-secondary-600"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Edit Mode</span>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  {formData.image_url && (
                    <div className="mb-8">
                      <img
                        src={formData.image_url}
                        alt={formData.title}
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                      />
                      <div className="mt-2">
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => {
                            setFormData({ ...formData, image_url: e.target.value })
                            if (errors.image_url) setErrors({ ...errors, image_url: undefined })
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${
                            errors.image_url ? 'border-red-300' : 'border-secondary-300'
                          }`}
                          placeholder="URL gambar artikel"
                        />
                      </div>
                    </div>
                  )}

                  {!formData.image_url && (
                    <div className="mb-8 p-6 border-2 border-dashed border-secondary-300 rounded-lg text-center">
                      <ImageIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-secondary-900 mb-2">Tambahkan Gambar Artikel</h3>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => {
                          setFormData({ ...formData, image_url: e.target.value })
                          if (errors.image_url) setErrors({ ...errors, image_url: undefined })
                        }}
                        className={`w-full max-w-md mx-auto px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.image_url ? 'border-red-300' : 'border-secondary-300'
                        }`}
                        placeholder="Masukkan URL gambar"
                      />
                    </div>
                  )}

                  {/* Content Editor */}
                  <div className="blog-content">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-lg font-semibold text-secondary-900">
                        Konten Artikel <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-1 bg-secondary-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => insertContent('**')}
                          className="p-2 hover:bg-white rounded text-secondary-600 hover:text-secondary-900 transition-colors"
                          title="Bold"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContent('*')}
                          className="p-2 hover:bg-white rounded text-secondary-600 hover:text-secondary-900 transition-colors"
                          title="Italic"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContent('\n- ')}
                          className="p-2 hover:bg-white rounded text-secondary-600 hover:text-secondary-900 transition-colors"
                          title="List"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContent('\n> ')}
                          className="p-2 hover:bg-white rounded text-secondary-600 hover:text-secondary-900 transition-colors"
                          title="Quote"
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContent('`')}
                          className="p-2 hover:bg-white rounded text-secondary-600 hover:text-secondary-900 transition-colors"
                          title="Code"
                        >
                          <Code className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="content"
                      required
                      rows={20}
                      value={formData.content}
                      onChange={(e) => {
                        setFormData({ ...formData, content: e.target.value })
                        if (errors.content) setErrors({ ...errors, content: undefined })
                      }}
                      className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base leading-relaxed ${
                        errors.content ? 'border-red-300' : 'border-secondary-300'
                      }`}
                      placeholder="Tulis konten artikel Anda di sini...&#10;&#10;Tips:&#10;- Gunakan **teks** untuk bold&#10;- Gunakan *teks* untuk italic&#10;- Gunakan - untuk list&#10;- Gunakan > untuk quote&#10;- Gunakan `kode` untuk inline code"
                    />
                    {errors.content && (
                      <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.content}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags Section */}
                  {formData.tags && formData.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-secondary-100 text-secondary-700 text-sm px-3 py-1 rounded-full"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-secondary-900 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            placeholder="Tambahkan tag..."
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                          >
                            Tambah
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add tags input when no tags exist */}
                  {(!formData.tags || formData.tags.length === 0) && (
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tags:</h3>
                      <div className="p-3 bg-secondary-50 rounded-lg">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            placeholder="Tambahkan tag..."
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                          >
                            Tambah
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          {sidebarOpen && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Informasi Dasar</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => {
                      setFormData({ ...formData, excerpt: e.target.value })
                      if (errors.excerpt) setErrors({ ...errors, excerpt: undefined })
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.excerpt ? 'border-red-300' : 'border-secondary-300'
                    }`}
                    placeholder="Ringkasan singkat artikel..."
                  />
                  {errors.excerpt && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.excerpt}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Penulis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => {
                      setFormData({ ...formData, author: e.target.value })
                      if (errors.author) setErrors({ ...errors, author: undefined })
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.author ? 'border-red-300' : 'border-secondary-300'
                    }`}
                    placeholder="Nama penulis"
                  />
                  {errors.author && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.author}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Tanggal Publikasi</label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Gambar Artikel</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">URL Gambar</label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value })
                        if (errors.image_url) setErrors({ ...errors, image_url: undefined })
                      }}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.image_url ? 'border-red-300' : 'border-secondary-300'
                      }`}
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      className="p-2 bg-secondary-100 hover:bg-secondary-200 rounded-lg transition-colors duration-200"
                      title="Upload Image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.image_url && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.image_url}</span>
                    </div>
                  )}
                </div>
                {formData.image_url && (
                  <div>
                    <img 
                      src={formData.image_url} 
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tags</h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tambahkan tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-secondary-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogEditor
