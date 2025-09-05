import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { newsAPI } from '../../lib/supabase'
import type { News } from '../../lib/supabase'
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
  Underline,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette
} from 'lucide-react'
import Breadcrumb from '../Breadcrumb'
import SocialShare from '../SocialShare'
import RelatedArticles from '../RelatedArticles'
import ImageUpload from './ImageUpload'
import '../../styles/blog.css'
import { getAdminBasePath } from '../../utils/domainDetection'

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
  const base = getAdminBasePath()
  console.log('BlogEditor id:', id)
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [readingTime, setReadingTime] = useState(0)
  const [relatedArticles, setRelatedArticles] = useState<News[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [selectedImageEl, setSelectedImageEl] = useState<HTMLImageElement | null>(null)
  const [textColor, setTextColor] = useState<string>('#111827')
  
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

  const categories = [
    { value: 'business', label: 'Business & Entrepreneurship' },
    { value: 'technology', label: 'Technology & Innovation' },
    { value: 'education', label: 'Education & Training' },
    { value: 'workshop', label: 'Workshop & Skills' },
    { value: 'seminar', label: 'Seminar & Conference' },
    { value: 'networking', label: 'Networking & Community' },
    { value: 'startup', label: 'Startup & Innovation' },
    { value: 'digital_marketing', label: 'Digital Marketing' },
    { value: 'finance', label: 'Finance & Investment' },
    { value: 'healthcare', label: 'Healthcare & Wellness' },
    { value: 'creative', label: 'Creative & Design' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'culture', label: 'Culture & Arts' },
    { value: 'environment', label: 'Environment & Sustainability' },
    { value: 'social_impact', label: 'Social Impact & Charity' },
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

  useEffect(() => {
    // hitung reading time saat konten berubah
    const wordsPerMinute = 200
    const wordCount = (formData.content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
    setReadingTime(Math.max(1, Math.ceil(wordCount / wordsPerMinute)))
  }, [formData.content])

  useEffect(() => {
    // muat artikel terkait untuk pratinjau bagian RelatedArticles
    const loadRelated = async () => {
      try {
        const all = await newsAPI.getAll()
        const base = id && id !== 'new' ? all.filter(a => a.id !== id) : all
        const related = base
          .filter(a => a.category === formData.category || a.tags?.some(t => formData.tags.includes(t)))
          .slice(0, 3)
        setRelatedArticles(related)
      } catch (e) {
        console.warn('Gagal memuat artikel terkait', e)
      }
    }
    loadRelated()
  }, [id, formData.category, formData.tags])

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
          navigate(`${base}/news`)
        }, 1500)
      } else {
        await newsAPI.create(formData)
        setShowSuccess(true)
        setTimeout(() => {
          navigate(`${base}/news`)
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
    // sisipkan raw HTML ke posisi kursor pada contenteditable
    if (!contentRef.current) return
    contentRef.current.focus()
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    const el = document.createElement('span')
    el.innerHTML = content
    const frag = document.createDocumentFragment()
    let node
    let lastNode: ChildNode | null = null
    while ((node = el.firstChild as ChildNode)) {
      lastNode = frag.appendChild(node)
    }
    range.deleteContents()
    range.insertNode(frag)
    if (lastNode) {
      range.setStartAfter(lastNode)
      range.setEndAfter(lastNode)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    setFormData({ ...formData, content: contentRef.current.innerHTML })
  }

  const exec = (command: string, value?: string) => {
    if (!contentRef.current) return
    contentRef.current.focus()
    document.execCommand(command, false, value)
    setFormData({ ...formData, content: contentRef.current.innerHTML })
  }

  const applyHeading = (level: 1 | 2 | 3) => {
    exec('formatBlock', 'H' + String(level))
  }

  const applyBlockquote = () => exec('formatBlock', 'BLOCKQUOTE')
  const applyList = (ordered = false) => exec(ordered ? 'insertOrderedList' : 'insertUnorderedList')
  const applyAlign = (dir: 'left' | 'center' | 'right') => exec('justify' + dir.charAt(0).toUpperCase() + dir.slice(1))
  const applyColor = (color: string) => {
    setTextColor(color)
    exec('foreColor', color)
  }

  const insertLink = () => {
    const url = window.prompt('Masukkan URL tautan:')
    if (url) exec('createLink', url)
  }

  const insertImageByUrl = () => {
    const url = window.prompt('Masukkan URL gambar:')
    if (!url) return
    exec('insertImage', url)
  }

  const onContentInput = () => {
    if (!contentRef.current) return
    setFormData({ ...formData, content: contentRef.current.innerHTML })
    if (errors.content) setErrors({ ...errors, content: undefined })
  }

  const onEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target && target.tagName === 'IMG') {
      setSelectedImageEl(target as HTMLImageElement)
    } else {
      setSelectedImageEl(null)
    }
  }

  const onEditorBlur = () => {
    if (!contentRef.current) return
    // Bersihkan nilai HTML kosong agar placeholder bisa muncul kembali tanpa overlap
    const raw = contentRef.current.innerHTML
    const cleaned = raw
      .replace(/\u00A0/g, ' ') // nbsp ke spasi
      .replace(/<br\s*\/?>(?=\s*$)/gi, '') // br di akhir
      .replace(/<div>\s*<br\s*\/>\s*<\/div>\s*$/i, '') // div kosong berisi br
      .trim()
    if (cleaned === '' || cleaned === '<p></p>' || cleaned === '<p> </p>') {
      contentRef.current.innerHTML = ''
      setFormData({ ...formData, content: '' })
    }
  }

  const updateSelectedImageWidth = (percent: number) => {
    if (!selectedImageEl) return
    selectedImageEl.style.width = `${percent}%`
    setFormData({ ...formData, content: contentRef.current?.innerHTML || formData.content })
  }

  const updateSelectedImageAlign = (align: 'left' | 'center' | 'right') => {
    if (!selectedImageEl) return
    selectedImageEl.style.display = 'block'
    selectedImageEl.style.float = 'none'
    selectedImageEl.style.margin = '1rem 0'
    if (align === 'center') {
      selectedImageEl.style.marginLeft = 'auto'
      selectedImageEl.style.marginRight = 'auto'
    } else if (align === 'left') {
      selectedImageEl.style.float = 'left'
      selectedImageEl.style.marginRight = '1rem'
      selectedImageEl.style.marginLeft = '0'
    } else if (align === 'right') {
      selectedImageEl.style.float = 'right'
      selectedImageEl.style.marginLeft = '1rem'
      selectedImageEl.style.marginRight = '0'
    }
    setFormData({ ...formData, content: contentRef.current?.innerHTML || formData.content })
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
          <p className="text-secondary-600">Loading...</p>
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
      {/* Breadcrumb agar konsisten dengan halaman detail */}
      <Breadcrumb />

      {/* Back Button + Action Bar */}
      <div className="bg-white border-b border-secondary-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`${base}/news`)}
            className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke News
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                previewMode 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-secondary-300 text-secondary-700 hover:bg-secondary-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>

      {/* Article Editor Area */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Badge or Selector */}
        <div className="mb-6">
          {previewMode ? (
            <span className="inline-block bg-primary-100 text-primary-600 text-sm px-4 py-2 rounded-full font-medium">
              {formData.category}
            </span>
          ) : (
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="inline-block bg-primary-100 text-primary-700 text-sm px-4 py-2 rounded-full font-medium border border-primary-200"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Title */}
        {previewMode ? (
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
            {formData.title || 'Judul Artikel'}
          </h1>
        ) : (
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value })
              if (errors.title) setErrors({ ...errors, title: undefined })
            }}
            placeholder="Judul Artikel"
            className={`w-full text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight bg-transparent border-0 focus:outline-none focus:ring-0 ${
              errors.title ? 'ring-2 ring-red-300 rounded' : ''
            }`}
          />
        )}
        {errors.title && (
          <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.title}</span>
          </div>
        )}

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 text-sm text-secondary-600">
          <div className="flex items-center gap-2">
            <span>Oleh:</span>
            {previewMode ? (
              <span className="text-secondary-900">{formData.author || 'Penulis'}</span>
            ) : (
              <input
                type="text"
                value={formData.author}
                onChange={(e) => {
                  setFormData({ ...formData, author: e.target.value })
                  if (errors.author) setErrors({ ...errors, author: undefined })
                }}
                placeholder="Nama Penulis"
                className="bg-white border border-secondary-300 rounded px-3 py-1 text-secondary-900"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>{formData.published_date ? formatDate(formData.published_date) : 'Tanggal'}</span>
            {!previewMode && (
              <input
                type="date"
                value={formData.published_date}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="bg-white border border-secondary-300 rounded px-3 py-1"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>{readingTime} menit baca</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Dibaca</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt={formData.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
            />
          )}
          {!previewMode && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value })
                  if (errors.image_url) setErrors({ ...errors, image_url: undefined })
                }}
                placeholder="https://example.com/image.jpg"
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.image_url ? 'border-red-300' : 'border-secondary-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowImageUpload((s) => !s)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200"
                title="Upload Image"
              >
                <ImageIcon className="w-4 h-4" />
                Upload
              </button>
            </div>
          )}
          {!previewMode && showImageUpload && (
            <div className="mt-4">
              <ImageUpload
                folderPath="news/hero"
                bucketName="events-images"
                onImageUploaded={(url) => {
                  setFormData({ ...formData, image_url: url })
                  setShowImageUpload(false)
                }}
                onCancel={() => setShowImageUpload(false)}
              />
            </div>
          )}
          {errors.image_url && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.image_url}</span>
            </div>
          )}
        </div>

        {/* Content Toolbar (Edit mode only) */}
        {!previewMode && (
          <div className="bg-white border border-secondary-200 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-2">
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => exec('bold')} title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => exec('italic')} title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => exec('underline')} title="Underline">
              <Underline className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-secondary-200 mx-1" />
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => applyHeading(1)} title="H1">
              <Heading1 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => applyHeading(2)} title="H2">
              <Heading2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => applyHeading(3)} title="H3">
              <Heading3 className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-secondary-200 mx-1" />
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => applyList(false)} title="Bullet List">
              <List className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => applyBlockquote()} title="Quote">
              <Quote className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => insertContent('<pre><code>kode</code></pre>')} title="Code Block">
              <Code className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-secondary-200 mx-1" />
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => applyAlign('left')} title="Align Left">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => applyAlign('center')} title="Align Center">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={() => applyAlign('right')} title="Align Right">
              <AlignRight className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-secondary-200 mx-1" />
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-secondary-500" />
              <input
                type="color"
                value={textColor}
                onChange={(e) => applyColor(e.target.value)}
                className="w-8 h-8 p-0 border border-secondary-200 rounded"
                title="Warna teks"
              />
            </div>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={insertLink} title="Link">
              <LinkIcon className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded" onClick={insertImageByUrl} title="Sisipkan Gambar via URL">
              <ImageIcon className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700" onClick={() => setShowImageUpload(true)} title="Upload & Sisipkan Gambar">
              Upload Gambar
            </button>
          </div>
        )}

        {/* Inline ImageUpload for content images */}
        {!previewMode && showImageUpload && (
          <div className="mb-4">
            <ImageUpload
              folderPath="news/content"
              bucketName="events-images"
              onImageUploaded={(url) => {
                setShowImageUpload(false)
                insertContent(`<img src="${url}" alt="image" />`)
              }}
              onCancel={() => setShowImageUpload(false)}
            />
          </div>
        )}

        {/* Content Editor / Preview */}
        <div className="blog-content mb-8">
          {previewMode ? (
            <div dangerouslySetInnerHTML={{ __html: formData.content || '' }} />
          ) : (
            <div
              ref={contentRef}
              className="min-h-[300px] bg-white border border-secondary-200 rounded-lg p-4 focus:outline-none editor-placeholder caret-primary-600 cursor-text"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Tulis konten artikel Anda di sini..."
              onInput={onContentInput}
              onClick={onEditorClick}
              onBlur={onEditorBlur}
              dangerouslySetInnerHTML={{ __html: formData.content || '' }}
            />
          )}
          {errors.content && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.content}</span>
            </div>
          )}
        </div>

        {/* Selected Image Controls */}
        {!previewMode && selectedImageEl && (
          <div className="mb-8 bg-white border border-secondary-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-secondary-700">Atur gambar terpilih:</span>
            <input
              type="range"
              min={10}
              max={100}
              defaultValue={parseInt(selectedImageEl.style.width || '100')}
              onChange={(e) => updateSelectedImageWidth(parseInt(e.target.value))}
            />
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => updateSelectedImageAlign('left')}>Kiri</button>
              <button className="px-3 py-1 border rounded" onClick={() => updateSelectedImageAlign('center')}>Tengah</button>
              <button className="px-3 py-1 border rounded" onClick={() => updateSelectedImageAlign('right')}>Kanan</button>
            </div>
          </div>
        )}

        {/* Excerpt */}
        <div className="mb-8">
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

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tags:</h3>
          {!previewMode && (
            <div className="flex gap-2 mb-3">
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
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Tambah
              </button>
            </div>
          )}
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-secondary-100 text-secondary-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                  {!previewMode && (
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-secondary-500 hover:text-secondary-700"
                      aria-label={`Hapus tag ${tag}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Share Bar */}
        <div className="flex items-center justify-between py-6 border-t border-secondary-200">
          <div className="flex items-center gap-2 text-secondary-600">
            <span className="text-sm">Bagikan artikel ini</span>
          </div>
          <SocialShare
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={formData.title || 'Artikel DIGCITY'}
            description={formData.excerpt || ''}
            hashtags={formData.tags}
          />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <RelatedArticles 
          articles={relatedArticles}
          currentArticleId={id && id !== 'new' ? id : relatedArticles[0].id}
          maxArticles={3}
        />
      )}

      {/* Newsletter CTA */}
      <section className="bg-primary-600 py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Tetap Update dengan DIGCITY
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Dapatkan artikel terbaru seputar bisnis digital, teknologi, dan kegiatan DIGCITY langsung di email Anda
          </p>
          <Link
            to="/blog"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
          >
            Lihat Semua Artikel
          </Link>
        </div>
      </section>
    </div>
  )
}

export default BlogEditor
