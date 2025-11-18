import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { newsAPI, authAPI, supabase } from '../../lib/supabase'
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
  Palette,
  Calendar,
  Tag,
  Plus
} from 'lucide-react'
import SocialShare from '../SocialShare'
import RelatedArticles from '../RelatedArticles'
import ImageUpload from './ImageUpload'
import EventImagePicker from './EventImagePicker'
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

const countWords = (html: string): number => {
  if (!html) return 0
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length
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
  const [splitPreview, setSplitPreview] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [readingTime, setReadingTime] = useState(0)
  const [relatedArticles, setRelatedArticles] = useState<News[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const [showHeroImageUpload, setShowHeroImageUpload] = useState(false)
  const [showContentImageUpload, setShowContentImageUpload] = useState(false)
  const [showEventImagePicker, setShowEventImagePicker] = useState(false)
  const [imagePickerTarget, setImagePickerTarget] = useState<'hero' | 'content' | null>(null)
  const [selectedImageEl, setSelectedImageEl] = useState<HTMLImageElement | null>(null)
  const [textColor, setTextColor] = useState<string>('#111827')
  
  // Hydration flag to control when we should sync DOM editor content from state
  const [editorHydrated, setEditorHydrated] = useState(false)
  
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

  const isEditing = Boolean(id && id !== 'new')
  const pageTitle = isEditing ? 'Edit Artikel Berita' : 'Artikel Berita Baru'
  const pageSubtitle = isEditing
    ? 'Perbarui konten berita sebelum dipublikasikan ulang.'
    : 'Tulis berita baru untuk pembaca komunitas DIGCITY.'
  const wordCount = countWords(formData.content)
  const tagsCount = formData.tags.length
  const heroImageFilled = Boolean(formData.image_url)
  const currentCategoryLabel =
    categories.find((category) => category.value === formData.category)?.label || 'Belum dipilih'
  const completionChecklist = [
    { key: 'title', label: 'Judul artikel', isDone: formData.title.trim().length >= 5 },
    { key: 'content', label: 'Konten utama', isDone: formData.content.trim().length > 0 },
    { key: 'excerpt', label: 'Ringkasan/Excerpt', isDone: formData.excerpt.trim().length >= 20 },
    { key: 'author', label: 'Nama penulis', isDone: formData.author.trim().length > 0 },
    { key: 'image', label: 'Gambar utama', isDone: heroImageFilled }
  ]
  const completionScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (completionChecklist.filter((item) => item.isDone).length / completionChecklist.length) * 100
      )
    )
  )

  useEffect(() => {
    console.log('🔍 BlogEditor: useEffect triggered, id:', id)
    if (isEditing) {
      console.log('🔍 BlogEditor: Loading existing news with id:', id)
      loadNews()
    } else {
      console.log('🔍 BlogEditor: Creating new news, id:', id)
      // ensure fresh editor for new item
      setEditorHydrated(false)
    }
  }, [id, isEditing])

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

  // Sinkronisasi satu kali: isi editor dengan formData.content saat masuk edit mode
  useEffect(() => {
    if (!previewMode && contentRef.current && !editorHydrated) {
      contentRef.current.innerHTML = formData.content || ''
      setEditorHydrated(true)
    }
  }, [previewMode, editorHydrated, formData.content])

  // Ketika toggle dari preview -> edit, izinkan re-hydration sekali
  useEffect(() => {
    if (!previewMode) {
      setEditorHydrated(false)
    }
  }, [previewMode])

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
        // mark editor to rehydrate once in edit mode
        setEditorHydrated(false)
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
    // Tambahan validasi ringan untuk UX yang lebih baik
    if (formData.title && formData.title.trim().length < 5) {
      newErrors.title = 'Judul terlalu pendek (min. 5 karakter)'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Konten artikel wajib diisi'
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt wajib diisi'
    }
    if (formData.excerpt && formData.excerpt.trim().length < 20) {
      newErrors.excerpt = 'Excerpt terlalu pendek (min. 20 karakter)'
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

    try {
      // Preflight: ensure session exists and user is admin
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        alert('Sesi login Anda sudah berakhir. Silakan login ulang sebagai admin untuk menyimpan artikel.')
        navigate(`${base}`)
        return
      }

      // Optionally refresh soon-to-expire session
      const now = Math.floor(Date.now() / 1000)
      if ((session as any).expires_at && (session as any).expires_at < now + 30) {
        try {
          await supabase.auth.refreshSession()
        } catch (e) {
          console.warn('Gagal refresh session, melanjutkan dengan session saat ini.')
        }
      }

      const isAdmin = await authAPI.isAdmin()
      if (!isAdmin) {
        alert('Akses ditolak. Hanya admin yang dapat membuat atau mengubah artikel.')
        return
      }

      setSaving(true)
      setErrors({})

      if (id && id !== 'new') {
        await newsAPI.update(id, formData)
      } else {
        await newsAPI.create(formData)
      }

      setShowSuccess(true)
      setTimeout(() => {
        navigate(`${base}/news`)
      }, 1500)
    } catch (error: any) {
      console.error('Error saving news:', error)
      if (error?.code === '42501' || error?.status === 403) {
        alert('Gagal menyimpan: ditolak oleh kebijakan keamanan (RLS). Pastikan Anda login sebagai admin dan coba login ulang.')
      } else {
        alert('Gagal menyimpan artikel. Silakan coba lagi.')
      }
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
    setFormData(prev => ({ ...prev, content: contentRef.current!.innerHTML }))
  }

  const exec = (command: string, value?: string) => {
    if (!contentRef.current) return
    contentRef.current.focus()
    document.execCommand(command, false, value)
    setFormData(prev => ({ ...prev, content: contentRef.current!.innerHTML }))
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
    setFormData(prev => ({ ...prev, content: contentRef.current!.innerHTML }))
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

  const openEventImagePicker = (target: 'hero' | 'content') => {
    setImagePickerTarget(target)
    setShowHeroImageUpload(false)
    setShowContentImageUpload(false)
    setShowEventImagePicker(true)
  }

  const handleEventImageSelect = (url: string) => {
    if (imagePickerTarget === 'hero') {
      setFormData(prev => ({ ...prev, image_url: url }))
    } else if (imagePickerTarget === 'content') {
      insertContent(`<img src="${url}" alt="${formData.title || 'Konten berita'}" />`)
    }
    setShowEventImagePicker(false)
    setImagePickerTarget(null)
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
      {/* Page Header */}
      <header className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 text-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/85">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate(`${base}/news`)}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke News
              </button>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em]">
                <span>Admin</span>
                <span className="opacity-60">•</span>
                <span>News</span>
                <span className="opacity-60">•</span>
                <span>{isEditing ? 'Edit' : 'Baru'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wide">
                {isEditing ? 'Mode Edit' : 'Draft Baru'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wide">
                Preview {previewMode ? 'Aktif' : 'Mati'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-[0.4em]">Editor Berita DIGCITY</p>
              <h1 className="text-3xl font-semibold leading-tight">{pageTitle}</h1>
              <p className="text-white/85 mt-2 max-w-2xl">{pageSubtitle}</p>
              <div className="flex flex-wrap gap-3 mt-4 text-xs text-white/80">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10">
                  <Calendar className="w-4 h-4" />
                  {formData.published_date ? formatDate(formData.published_date) : 'Tanggal belum dipilih'}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10">
                  <Tag className="w-4 h-4" />
                  {currentCategoryLabel}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const next = !previewMode
                  setPreviewMode(next)
                  if (next) setSplitPreview(false)
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  previewMode
                    ? 'bg-white/25 border-white/40 text-white shadow-sm'
                    : 'bg-white/10 border-white/30 text-white/90 hover:bg-white/20'
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Kembali ke Edit' : 'Aktifkan Preview'}
              </button>
              <button
                onClick={() => {
                  const next = !splitPreview
                  setSplitPreview(next)
                  if (next) setPreviewMode(false)
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  splitPreview
                    ? 'bg-white/25 border-white/40 text-white shadow-sm'
                    : 'bg-white/10 border-white/30 text-white/90 hover:bg-white/20'
                }`}
                title="Tampilkan editor & preview berdampingan"
              >
                <Eye className="w-4 h-4" />
                {splitPreview ? 'Matikan Split' : 'Split Preview'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-50 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Artikel'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Editor & Preview Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Quick Summary */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="bg-white border border-secondary-100 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-secondary-500">Progress penulisan</p>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-semibold text-secondary-900">{completionScore}%</span>
              <span className="text-secondary-500 text-sm">lengkap</span>
            </div>
            <div className="w-full h-2 bg-secondary-100 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <p className="text-xs text-secondary-500 mt-3">Lengkapi semua field wajib sebelum publikasi.</p>
          </div>
          <div className="bg-white border border-secondary-100 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-secondary-500">Isi artikel</p>
            <div className="flex items-baseline gap-2 mt-3 text-secondary-900">
              <span className="text-3xl font-semibold">{wordCount}</span>
              <span className="text-sm">kata</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-secondary-600 mt-3">
              <span className={`flex items-center gap-1 ${heroImageFilled ? 'text-green-600' : ''}`}>
                <ImageIcon className="w-4 h-4" />
                {heroImageFilled ? 'Gambar utama siap' : 'Belum ada gambar'}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {tagsCount} tag
              </span>
            </div>
          </div>
          <div className="bg-white border border-secondary-100 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-secondary-500">Jadwal publikasi</p>
            <div className="mt-3">
              <p className="text-secondary-900 font-semibold">
                {formData.published_date ? formatDate(formData.published_date) : 'Belum ditentukan'}
              </p>
              <p className="text-secondary-500 text-sm mt-1">Sesuaikan tanggal ketika artikel siap tayang.</p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-50 text-secondary-700 text-xs font-semibold mt-4">
              {currentCategoryLabel}
            </span>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column: Judul, Gambar Utama, Konten, Excerpt */}
          <div className="md:col-span-2 space-y-6">
            {/* Section: Judul Artikel */}
            <section className="bg-white border border-secondary-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-secondary-900">Judul Artikel</h2>
                  <p className="text-sm text-secondary-600">Gunakan judul informatif dan singkat (disarankan 5–12 kata).</p>
                </div>
              </div>
              {previewMode ? (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 leading-tight break-words">
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
                  placeholder="Tulis judul artikel di sini"
                  aria-label="Judul artikel"
                  className={`w-full text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 bg-transparent border-b focus:outline-none focus:ring-0 pb-2 ${
                    errors.title ? 'border-red-300' : 'border-secondary-200'
                  }`}
                />
              )}
              {errors.title && (
                <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.title}</span>
                </div>
              )}
            </section>

            {/* Section: Gambar Utama */}
            <section className="bg-white border border-secondary-200 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-secondary-900">Gambar Utama</h2>
                <p className="text-sm text-secondary-600">Format disarankan 1200×630 (ratio 1.91:1). Gunakan gambar tajam dan relevan.</p>
              </div>
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt={formData.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow"
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
                    placeholder="https://contoh.com/gambar.jpg"
                    aria-label="URL gambar utama"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.image_url ? 'border-red-300' : 'border-secondary-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowHeroImageUpload((s) => { const next = !s; if (next) setShowContentImageUpload(false); return next; })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200"
                    title="Upload Image"
                    aria-label="Upload gambar utama"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => openEventImagePicker('hero')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100"
                    title="Pilih dari galeri event"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Dari Event
                  </button>
                </div>
              )}
              {!previewMode && showHeroImageUpload && (
                <div className="mt-4">
                  <ImageUpload
                    folderPath="news/hero"
                    bucketName="events-images"
                    onImageUploaded={(url) => {
                      setFormData({ ...formData, image_url: url })
                      setShowHeroImageUpload(false)
                    }}
                    onCancel={() => setShowHeroImageUpload(false)}
                  />
                </div>
              )}
              {errors.image_url && (
                <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.image_url}</span>
                </div>
              )}
            </section>

            {/* Section: Konten Artikel */}
            <section className="bg-white border border-secondary-200 rounded-lg p-0">
              {!previewMode && (
                <div className="sticky top-20 z-10 bg-white border-b border-secondary-200 rounded-t-lg p-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-secondary-500 px-2">Formatting</span>
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
                  <span className="text-xs text-secondary-500 px-2">Headings</span>
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
                  <span className="text-xs text-secondary-500 px-2">Blocks</span>
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
                  <span className="text-xs text-secondary-500 px-2">Alignment</span>
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
                  <span className="text-xs text-secondary-500 px-2">Insert</span>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-secondary-500" />
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => applyColor(e.target.value)}
                      className="w-8 h-8 p-0 border border-secondary-200 rounded"
                      title="Warna teks"
                      aria-label="Pilih warna teks"
                    />
                  </div>
                  <button className="p-2 hover:bg-secondary-100 rounded" onClick={insertLink} title="Link" aria-label="Sisipkan link">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-secondary-100 rounded" onClick={insertImageByUrl} title="Sisipkan gambar via URL" aria-label="Sisipkan gambar via URL">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                    onClick={() => { setShowContentImageUpload(true); setShowHeroImageUpload(false); }}
                    title="Upload & sisipkan gambar"
                  >
                    Upload Gambar
                  </button>
                  <button
                    className="px-3 py-2 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                    onClick={() => openEventImagePicker('content')}
                    title="Pilih gambar event"
                  >
                    Galeri Event
                  </button>
                </div>
              )}

              {/* Editor + Optional Split Preview */}
              <div className={`p-4 ${splitPreview ? 'grid md:grid-cols-2 gap-4' : ''}`}>
                {previewMode ? (
                  <div
                    className="blog-content text-secondary-900 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: formData.content || '' }}
                  />
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
                  />
                )}

                {splitPreview && (
                  <div
                    className="blog-content border border-secondary-200 rounded-lg p-4 bg-secondary-50 text-secondary-900 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: formData.content || '' }}
                  />
                )}
              </div>
              {errors.content && (
                <div className="flex items-center space-x-1 px-4 pb-4 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.content}</span>
                </div>
              )}
              {!previewMode && showContentImageUpload && (
                <div className="px-4 pb-4">
                  <ImageUpload
                    folderPath="news/content"
                    bucketName="events-images"
                    onImageUploaded={(url) => {
                      insertContent(`<img src="${url}" alt="${formData.title || 'Konten berita'}" />`)
                      setShowContentImageUpload(false)
                    }}
                    onCancel={() => setShowContentImageUpload(false)}
                  />
                </div>
              )}
              {!previewMode && selectedImageEl && (
                <div className="px-4 pb-4 flex flex-wrap items-center gap-3">
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
            </section>

            {/* Section: Ringkasan (Excerpt) */}
            <section className="bg-white border border-secondary-200 rounded-lg p-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Ringkasan (Excerpt) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-secondary-500 mb-2">1–2 kalimat yang merangkum inti artikel. Ditampilkan di listing.</p>
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
                aria-label="Excerpt artikel"
              />
              {errors.excerpt && (
                <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.excerpt}</span>
                </div>
              )}
            </section>
          </div>

          {/* Right column: Metadata & Tags */}
          <div className="space-y-6">
            {/* Section: Informasi Artikel */}
            <section className="bg-white border border-secondary-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Informasi Artikel</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Penulis <span className="text-red-500">*</span></label>
                  {previewMode ? (
                    <p className="text-secondary-900">{formData.author || 'Penulis'}</p>
                  ) : (
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => {
                        setFormData({ ...formData, author: e.target.value })
                        if (errors.author) setErrors({ ...errors, author: undefined })
                      }}
                      placeholder="Nama Penulis"
                      aria-label="Nama penulis"
                      className="w-full bg-white border border-secondary-300 rounded px-3 py-2 text-secondary-900"
                    />
                  )}
                  {errors.author && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.author}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Tanggal Publikasi</label>
                  {previewMode ? (
                    <p className="text-secondary-900">{formData.published_date ? formatDate(formData.published_date) : 'Tanggal'}</p>
                  ) : (
                    <input
                      type="date"
                      value={formData.published_date}
                      onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                      aria-label="Tanggal publikasi"
                      className="w-full bg-white border border-secondary-300 rounded px-3 py-2"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Kategori</label>
                  {previewMode ? (
                    <span className="inline-block bg-primary-100 text-primary-600 text-xs px-3 py-1 rounded-full font-medium">
                      {formData.category}
                    </span>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      aria-label="Kategori artikel"
                      className="w-full bg-white border border-secondary-300 rounded px-3 py-2"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="text-sm text-secondary-600">Perkiraan waktu baca: {readingTime} menit</div>
              </div>
            </section>

            {/* Section: Tags */}
            <section className="bg-white border border-secondary-200 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-secondary-900">Tags</h2>
                <p className="text-sm text-secondary-500 mt-1">Gunakan 1–3 kata per tag untuk membantu pencarian artikel.</p>
              </div>
              {!previewMode && (
                <div className="flex flex-col gap-3 mb-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-secondary-400"
                    placeholder="Tambahkan tag..."
                    aria-label="Input tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
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
            </section>

            {/* Section: Checklist */}
            <section className="bg-white border border-secondary-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-secondary-900">Checklist Publikasi</h2>
                <span className="text-sm text-secondary-500">{completionScore}% lengkap</span>
              </div>
              <ul className="space-y-3">
                {completionChecklist.map((item) => (
                  <li key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.isDone ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-secondary-300" />
                      )}
                      <span className={`text-sm ${item.isDone ? 'text-secondary-900' : 'text-secondary-500'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.isDone ? 'bg-green-50 text-green-700' : 'bg-secondary-100 text-secondary-600'
                      }`}
                    >
                      {item.isDone ? 'Siap' : 'Lengkapi'}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section: Tips */}
            <section className="bg-secondary-50 border border-secondary-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-3">Tips Penulisan Cepat</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-secondary-600">
                <li>Gunakan gambar horizontal minimal 1200px agar tampilan blog tetap tajam.</li>
                <li>Tulis excerpt 20–30 kata agar ringkasan tidak terpotong di listing.</li>
                <li>Sisipkan minimal 3 tag untuk membantu pencarian artikel terkait.</li>
                <li>Gunakan heading (H2/H3) untuk memecah konten panjang.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Preview-only sections: Share, Related, Newsletter */}
      {(previewMode || splitPreview) && (
        <>
          {/* Share Bar */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>

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
        </>
      )}

      <EventImagePicker
        isOpen={showEventImagePicker}
        onClose={() => {
          setShowEventImagePicker(false)
          setImagePickerTarget(null)
        }}
        onSelect={handleEventImageSelect}
      />
    </div>
  )
}

export default BlogEditor
