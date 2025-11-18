import React, { useState, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { linktreeAPI, LinktreeData, LinktreeLink, SocialLink, ContactInfo } from '../../lib/linktreeAPI'
import ImageUpload from './ImageUpload'
import LinktreeLayout from '../linktree/LinktreeLayout'
import LinktreeButton from '../linktree/LinktreeButton'
import LinktreeCard from '../linktree/LinktreeCard'
// Removed Grid Editor: focus on drag-and-drop order for Links only
import { 
  Link, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Globe, 
  FileText,
  Calendar,
  Image,
  Newspaper,
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Phone,
  Mail,
  MapPin,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const isValidUrl = (value: string): boolean => {
  if (!value) return true
  // Allow common schemes used in contacts: http, https, mailto, tel
  if (/^(mailto:|tel:)/i.test(value)) return true
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// Sanitize helpers
const cleanUrl = (value: string): string => {
  return value.replace(/[`'"\s]+/g, '').trim()
}

const cleanHandle = (value: string): string => {
  const v = value.trim().replace(/[`'"\s]+/g, '')
  return v.startsWith('@') ? v : `@${v}`
}

const AdminLinktree: React.FC = () => {
  const [linktreeData, setLinktreeData] = useState<LinktreeData | null>(null)
  const [links, setLinks] = useState<LinktreeLink[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showAddLink, setShowAddLink] = useState(false)
  const [showAddSocial, setShowAddSocial] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop')
  // Removed Grid Editor states; we keep simple list sorting for Links

  // DnD sensors (for drag-and-drop interactions)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // Active drag state (for overlay)
  const [activeLinkDragId, setActiveLinkDragId] = useState<string | null>(null)
  const linkOrderSaveTimerRef = useRef<number | undefined>(undefined)
  const formSaveTimerRef = useRef<number | undefined>(undefined)

  // Edit modals state
  const [showEditLink, setShowEditLink] = useState(false)
  const [editingLink, setEditingLink] = useState<LinktreeLink | null>(null)
  const [showEditSocial, setShowEditSocial] = useState(false)
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null)
  const [showEditContact, setShowEditContact] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    avatar: ''
  })
  const [isDirty, setIsDirty] = useState(false)

  const [linkForm, setLinkForm] = useState({
    href: '',
    title: '',
    description: '',
    icon: '',
    variant: 'primary',
    is_external: false,
    is_active: true
  })

  const [socialForm, setSocialForm] = useState({
    platform: '',
    value: '',
    href: ''
  })

  const [contactForm, setContactForm] = useState({
    platform: '',
    value: '',
    href: ''
  })

  // Instagram Acara Card removed per request

  // Icon mapping to mirror LinktreePage rendering
  const IconMap: Record<string, React.ReactNode> = {
    Globe: <Globe size={24} />,
    FileText: <FileText size={24} />,
    Calendar: <Calendar size={24} />,
    Image: <Image size={24} />,
    Newspaper: <Newspaper size={24} />,
    Mail: <Mail size={24} />,
    // Optional: additional icons used by config
  }

  useEffect(() => {
    loadLinktreeData()
  }, [])

  // Realtime subscription to reflect external changes
  useEffect(() => {
    const unsubscribe = linktreeAPI.subscribeToChanges(async () => {
      try {
        await loadLinktreeData()
      } catch (err) {
        console.warn('Realtime admin sync failed', err)
      }
    })

    return () => unsubscribe()
  }, [])

  // Track dirty state on form changes
  useEffect(() => {
    if (!loading) {
      setIsDirty(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.title, formData.subtitle, formData.description, formData.avatar])

  // Autosave dengan debounce untuk form profile
  useEffect(() => {
    if (!editing || !linktreeData) return
    if (formSaveTimerRef.current) window.clearTimeout(formSaveTimerRef.current)
    formSaveTimerRef.current = window.setTimeout(async () => {
      if (isDirty) {
        try {
          const ok = await linktreeAPI.updateLinktree(linktreeData.id, formData)
          if (ok) {
            showMessage('success', 'Autosave berhasil')
            setIsDirty(false)
          }
        } catch (err) {
          console.error('Error autosave (debounce):', err)
        }
      }
    }, 800)
    return () => {
      if (formSaveTimerRef.current) window.clearTimeout(formSaveTimerRef.current)
    }
  }, [editing, linktreeData, formData, isDirty])

  const loadLinktreeData = async () => {
    try {
      setLoading(true)
      const data = await linktreeAPI.getAllLinktreeData()
      
      if (data.linktree) {
        setLinktreeData(data.linktree)
        setFormData({
          title: data.linktree.title || '',
          subtitle: data.linktree.subtitle || '',
          description: data.linktree.description || '',
          avatar: data.linktree.avatar || ''
        })
      }
      
      setLinks(data.links)
      setSocialLinks(data.socialLinks)
      setContactInfo(data.contactInfo)

      // Removed grid initialization; preview will render in simple vertical order

      // Instagram Acara Card removed per request
    } catch (error) {
      console.error('Error loading linktree data:', error)
      showMessage('error', 'Gagal memuat data linktree')
    } finally {
      setLoading(false)
    }
  }

  // Removed layout persistence; focusing only on link order management

  // Removed layout history (undo/redo) related to grid editor

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleSave = async () => {
    if (!linktreeData) return

    try {
      const success = await linktreeAPI.updateLinktree(linktreeData.id, formData)
      if (success) {
        showMessage('success', 'Data linktree berhasil disimpan')
        setEditing(false)
        await loadLinktreeData()
      } else {
        showMessage('error', 'Gagal menyimpan data linktree')
      }
    } catch (error) {
      console.error('Error saving linktree:', error)
      showMessage('error', 'Gagal menyimpan data linktree')
    }
  }

  const handleAddLink = async () => {
    if (!linktreeData) return

    try {
      const linkId = await linktreeAPI.addLink({
        linktree_id: linktreeData.id,
        href: linkForm.href,
        title: linkForm.title,
        description: linkForm.description,
        icon: linkForm.icon,
        variant: linkForm.variant,
        is_external: linkForm.is_external,
        is_active: linkForm.is_active,
        order_index: links.length
      })

      if (linkId) {
        showMessage('success', 'Link berhasil ditambahkan')
        setShowAddLink(false)
        setLinkForm({
          href: '',
          title: '',
          description: '',
          icon: '',
          variant: 'primary',
          is_external: false,
          is_active: true
        })
        await loadLinktreeData()
      } else {
        showMessage('error', 'Gagal menambahkan link')
      }
    } catch (error) {
      console.error('Error adding link:', error)
      showMessage('error', 'Gagal menambahkan link')
    }
  }

  const handleUpdateLink = async () => {
    if (!editingLink) return
    try {
      const success = await linktreeAPI.updateLink(editingLink.id, {
        href: editingLink.href,
        title: editingLink.title,
        description: editingLink.description,
        icon: editingLink.icon,
        variant: editingLink.variant,
        is_external: editingLink.is_external,
        is_active: editingLink.is_active,
        order_index: editingLink.order_index
      })
      if (success) {
        showMessage('success', 'Link berhasil diperbarui')
        setShowEditLink(false)
        setEditingLink(null)
        await loadLinktreeData()
      } else {
        showMessage('error', 'Gagal memperbarui link')
      }
    } catch (error) {
      console.error('Error updating link:', error)
      showMessage('error', 'Gagal memperbarui link')
    }
  }

  const handleAddSocial = async () => {
    if (!linktreeData) return

    try {
      const socialId = await linktreeAPI.addSocialLink({
        linktree_id: linktreeData.id,
        platform: socialForm.platform,
        value: cleanHandle(socialForm.value),
        href: socialForm.href ? cleanUrl(socialForm.href) : socialForm.href,
        is_active: true
      })

      if (socialId) {
        showMessage('success', 'Social media link berhasil ditambahkan')
        setShowAddSocial(false)
        setSocialForm({
          platform: '',
          value: '',
          href: ''
        })
        await loadLinktreeData()
      } else {
        showMessage('error', 'Gagal menambahkan social media link')
      }
    } catch (error) {
      console.error('Error adding social link:', error)
      showMessage('error', 'Gagal menambahkan social media link')
    }
  }

  const handleUpdateSocial = async () => {
    if (!editingSocial) return
    try {
      const success = await linktreeAPI.updateSocialLink(editingSocial.id, {
        platform: editingSocial.platform,
        value: cleanHandle(editingSocial.value),
        href: editingSocial.href ? cleanUrl(editingSocial.href) : editingSocial.href,
        is_active: editingSocial.is_active
      })
      if (success) {
        showMessage('success', 'Social media link berhasil diperbarui')
        setShowEditSocial(false)
        setEditingSocial(null)
        await loadLinktreeData()
      } else {
        showMessage('error', 'Gagal memperbarui social media link')
      }
    } catch (error) {
      console.error('Error updating social link:', error)
      showMessage('error', 'Gagal memperbarui social media link')
    }
  }

  const handleAddContact = async () => {
    if (!linktreeData) return

    try {
      const contactId = await linktreeAPI.addContactInfo({
        linktree_id: linktreeData.id,
        platform: contactForm.platform,
        value: contactForm.value,
        href: contactForm.href,
        is_active: true
      })

      if (contactId) {
        showMessage('success', 'Contact info berhasil ditambahkan')
        setShowAddContact(false)
        setContactForm({
          platform: '',
          value: '',
          href: ''
        })
        await loadLinktreeData()
      } else {
        showMessage('error', 'Gagal menambahkan contact info')
      }
    } catch (error) {
      console.error('Error adding contact info:', error)
      showMessage('error', 'Gagal menambahkan contact info')
    }
  }

  const handleUpdateContact = async () => {
    if (!editingContact) return
    try {
      const success = await linktreeAPI.updateContactInfo(editingContact.id, {
        platform: editingContact.platform,
        value: editingContact.value,
        href: editingContact.href,
        is_active: editingContact.is_active
      })
      if (success) {
        showMessage('success', 'Contact info berhasil diperbarui')
        setShowEditContact(false)
        setEditingContact(null)
        await loadLinktreeData()
      } else {
        showMessage('error', 'Gagal memperbarui contact info')
      }
    } catch (error) {
      console.error('Error updating contact info:', error)
      showMessage('error', 'Gagal memperbarui contact info')
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus link ini?')) {
      try {
        const success = await linktreeAPI.deleteLink(id)
        if (success) {
          showMessage('success', 'Link berhasil dihapus')
          await loadLinktreeData()
        } else {
          showMessage('error', 'Gagal menghapus link')
        }
      } catch (error) {
        console.error('Error deleting link:', error)
        showMessage('error', 'Gagal menghapus link')
      }
    }
  }

  // Instagram Acara Card handlers removed per request

  // Instagram Acara Card handlers removed per request

  // ===== Drag and Drop: Links sorting =====
  const [linksOrderHistory, setLinksOrderHistory] = useState<string[][]>([])
  const [linksOrderFuture, setLinksOrderFuture] = useState<string[][]>([])
  const pushLinksHistory = (prevOrder: string[]) => {
    setLinksOrderHistory(h => [...h, prevOrder])
    setLinksOrderFuture([])
  }

  const scheduleSaveLinkOrder = (orderIds: string[]) => {
    if (linkOrderSaveTimerRef.current) window.clearTimeout(linkOrderSaveTimerRef.current)
    linkOrderSaveTimerRef.current = window.setTimeout(async () => {
      try {
        const ok = await linktreeAPI.reorderLinks(orderIds)
        if (!ok) {
          showMessage('error', 'Gagal menyimpan urutan links')
        } else {
          showMessage('success', 'Urutan links diperbarui')
        }
      } catch (err) {
        console.error('Error reorder links:', err)
        showMessage('error', 'Gagal menyimpan urutan links')
      }
    }, 600)
  }

  const handleLinkDragStart = (event: DragStartEvent) => {
    setActiveLinkDragId(String(event.active.id))
  }

  const handleLinkDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = links.findIndex(l => l.id === String(active.id))
    const newIndex = links.findIndex(l => l.id === String(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    const prevOrder = links.map(l => l.id)
    const newLinks = arrayMove(links, oldIndex, newIndex).map((l, idx) => ({ ...l, order_index: idx }))
    setLinks(newLinks)
    pushLinksHistory(prevOrder)
    scheduleSaveLinkOrder(newLinks.map(l => l.id))
    setActiveLinkDragId(null)
  }

  const undoLinksOrder = () => {
    if (linksOrderHistory.length === 0) return
    const prev = linksOrderHistory[linksOrderHistory.length - 1]
    setLinksOrderHistory(h => h.slice(0, -1))
    setLinksOrderFuture(f => [links.map(l => l.id), ...f])
    const byId: Record<string, LinktreeLink> = Object.fromEntries(links.map(l => [l.id, l]))
    const ordered = prev.map(id => byId[id]).filter(Boolean) as LinktreeLink[]
    const updated = ordered.map((l, idx) => ({ ...l, order_index: idx }))
    setLinks(updated)
    scheduleSaveLinkOrder(prev)
  }

  const redoLinksOrder = () => {
    if (linksOrderFuture.length === 0) return
    const next = linksOrderFuture[0]
    setLinksOrderFuture(f => f.slice(1))
    setLinksOrderHistory(h => [...h, links.map(l => l.id)])
    const byId: Record<string, LinktreeLink> = Object.fromEntries(links.map(l => [l.id, l]))
    const ordered = next.map(id => byId[id]).filter(Boolean) as LinktreeLink[]
    const updated = ordered.map((l, idx) => ({ ...l, order_index: idx }))
    setLinks(updated)
    scheduleSaveLinkOrder(next)
  }

  const handleDeleteSocial = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus social media link ini?')) {
      try {
        const success = await linktreeAPI.deleteSocialLink(id)
        if (success) {
          showMessage('success', 'Social media link berhasil dihapus')
          await loadLinktreeData()
        } else {
          showMessage('error', 'Gagal menghapus social media link')
        }
      } catch (error) {
        console.error('Error deleting social link:', error)
        showMessage('error', 'Gagal menghapus social media link')
      }
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus contact info ini?')) {
      try {
        const success = await linktreeAPI.deleteContactInfo(id)
        if (success) {
          showMessage('success', 'Contact info berhasil dihapus')
          await loadLinktreeData()
        } else {
          showMessage('error', 'Gagal menghapus contact info')
        }
      } catch (error) {
        console.error('Error deleting contact info:', error)
        showMessage('error', 'Gagal menghapus contact info')
      }
    }
  }

  const handleImageUploaded = (imageUrl: string) => {
    setFormData({ ...formData, avatar: imageUrl })
    setShowImageUpload(false)
    showMessage('success', 'Avatar berhasil diupload')
  }

  const handleResetContent = async () => {
    if (confirm('Semua konten LinkTree akan dihapus. Lanjutkan?')) {
      try {
        const ok = await linktreeAPI.resetLinktreeContent()
        if (ok) {
          showMessage('success', 'Konten LinkTree berhasil dibersihkan')
          await loadLinktreeData()
        } else {
          showMessage('error', 'Gagal membersihkan konten LinkTree')
        }
      } catch (error) {
        console.error('Error resetting linktree content:', error)
        showMessage('error', 'Gagal membersihkan konten LinkTree')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // ===== Preview data (real-time) =====
  // Merge edits/drafts into preview without requiring save
  const previewLinksBase: LinktreeLink[] = links.map(l => {
    if (showEditLink && editingLink && l.id === editingLink.id) {
      return editingLink
    }
    return l
  })

  // Show draft link while typing in Add Link modal
  const previewLinksWithDraft: LinktreeLink[] = showAddLink && linkForm.title && linkForm.href
    ? [...previewLinksBase, {
        id: 'draft-link',
        linktree_id: linktreeData?.id || '',
        href: linkForm.href,
        title: linkForm.title,
        description: linkForm.description,
        icon: linkForm.icon,
        variant: linkForm.variant,
        is_external: linkForm.is_external,
        is_active: true,
        order_index: previewLinksBase.length
      }]
    : previewLinksBase

  const activeLinksPreview = previewLinksWithDraft
    .map(l => ({
      id: l.id,
      href: l.href,
      title: l.title,
      description: l.description,
      icon: l.icon,
      variant: (l.variant as 'primary' | 'secondary' | 'accent') || 'primary',
      isExternal: l.is_external,
      isActive: l.is_active,
      order: l.order_index
    }))
    .filter(l => l.isActive)
    .sort((a, b) => a.order - b.order)

  const previewSocialBase: SocialLink[] = socialLinks.map(s => {
    if (showEditSocial && editingSocial && s.id === editingSocial.id) {
      return editingSocial
    }
    return s
  })

  const previewSocialWithDraft: SocialLink[] = showAddSocial && socialForm.platform && socialForm.value
    ? [...previewSocialBase, {
        id: 'draft-social',
        linktree_id: linktreeData?.id || '',
        platform: socialForm.platform as any,
        value: socialForm.value,
        href: socialForm.href,
        is_active: true
      }]
    : previewSocialBase

  const socialPreview = previewSocialWithDraft
    .filter(s => s.is_active)
    .map(s => ({
      platform: s.platform as 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'tiktok',
      value: s.value,
      href: s.href
    }))

  const previewContactBase: ContactInfo[] = contactInfo.map(c => {
    if (showEditContact && editingContact && c.id === editingContact.id) {
      return editingContact
    }
    return c
  })

  const previewContactWithDraft: ContactInfo[] = showAddContact && contactForm.platform && contactForm.value
    ? [...previewContactBase, {
        id: 'draft-contact',
        linktree_id: linktreeData?.id || '',
        platform: contactForm.platform as any,
        value: contactForm.value,
        href: contactForm.href,
        is_active: true
      }]
    : previewContactBase

  const contactPreview = previewContactWithDraft
    .filter(c => c.is_active)
    .map(c => ({
      platform: (c.platform === 'address' || c.platform === 'website' ? 'location' : c.platform) as 'email' | 'phone' | 'location',
      value: c.value,
      href: c.href
    }))

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Linktree Management</h1>
          <p className="text-secondary-600">Kelola profil dan link linktree DigCity</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImageUpload(true)}
            className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
          >
            Upload Avatar
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            {editing ? <X size={16} /> : <Edit3 size={16} />}
            <span>{editing ? 'Cancel' : 'Edit'}</span>
          </button>
          <button
            onClick={handleResetContent}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reset Konten
          </button>
        </div>
      </div>
      {/* Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50"
            />
            {!formData.title && editing && (
              <p className="text-xs text-red-600 mt-1">Title wajib diisi</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              disabled={!editing}
              rows={3}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Avatar URL</label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              disabled={!editing}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50"
            />
            {formData.avatar && (
              <img 
                src={formData.avatar} 
                alt="Avatar" 
                className="w-16 h-16 object-cover rounded-lg mt-2 border border-secondary-200"
              />
            )}
          </div>
        </div>
        {editing && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={!formData.title}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
          </div>

          {/* Links Section */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Links</h2>
              <button
                onClick={() => setShowAddLink(true)}
                className="bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Link</span>
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={undoLinksOrder} className="px-3 py-1.5 rounded bg-secondary-100 border border-secondary-200 text-secondary-700 disabled:opacity-50" disabled={linksOrderHistory.length===0}>Undo</button>
              <button onClick={redoLinksOrder} className="px-3 py-1.5 rounded bg-secondary-100 border border-secondary-200 text-secondary-700 disabled:opacity-50" disabled={linksOrderFuture.length===0}>Redo</button>
            </div>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleLinkDragStart} onDragEnd={handleLinkDragEnd}>
              <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {links.length === 0 ? (
                    <div className="text-center py-8 text-secondary-500">
                      <Link size={48} className="mx-auto mb-2 text-secondary-300" />
                      <p>Belum ada link yang ditambahkan</p>
                    </div>
                  ) : (
                    links.map((link) => (
                      <SortableLinkRow key={link.id} link={link} onEdit={() => { setEditingLink(link); setShowEditLink(true) }} onDelete={() => handleDeleteLink(link.id)} />
                    ))
                  )}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeLinkDragId ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-primary-200 shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Link size={20} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">Dragging item…</p>
                        <p className="text-sm text-secondary-600">Geser untuk mengurutkan</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Layout Editor removed per request: focus on link ordering only */}

          {/* Social Links Section */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Social Media Links</h2>
              <button
                onClick={() => setShowAddSocial(true)}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Social</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {socialLinks.length === 0 ? (
                <div className="md:col-span-2 text-center py-8 text-secondary-500">
                  <Instagram size={48} className="mx-auto mb-2 text-secondary-300" />
                  <p>Belum ada social media link yang ditambahkan</p>
                </div>
              ) : (
                socialLinks.map((social) => (
                  <div key={social.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        {social.platform === 'instagram' && <Instagram size={16} className="text-green-600" />}
                        {social.platform === 'facebook' && <Facebook size={16} className="text-blue-600" />}
                        {social.platform === 'twitter' && <Twitter size={16} className="text-blue-400" />}
                        {social.platform === 'youtube' && <Youtube size={16} className="text-red-600" />}
                        {!['instagram', 'facebook', 'twitter', 'youtube'].includes(social.platform) && <Globe size={16} className="text-secondary-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900 capitalize">{social.platform}</p>
                        <p className="text-sm text-secondary-600">{social.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => { setEditingSocial(social); setShowEditSocial(true) }}
                        className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-lg transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSocial(social.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Instagram Acara Card removed per request */}

          {/* Contact Info Section */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Contact Information</h2>
              <button
                onClick={() => setShowAddContact(true)}
                className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Contact</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contactInfo.length === 0 ? (
                <div className="md:col-span-2 text-center py-8 text-secondary-500">
                  <Phone size={48} className="mx-auto mb-2 text-secondary-300" />
                  <p>Belum ada contact info yang ditambahkan</p>
                </div>
              ) : (
                contactInfo.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        {contact.platform === 'phone' && <Phone size={16} className="text-purple-600" />}
                        {contact.platform === 'email' && <Mail size={16} className="text-purple-600" />}
                        {contact.platform === 'address' && <MapPin size={16} className="text-purple-600" />}
                        {!['phone', 'email', 'address'].includes(contact.platform) && <Globe size={16} className="text-secondary-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900 capitalize">{contact.platform}</p>
                        <p className="text-sm text-secondary-600">{contact.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => { setEditingContact(contact); setShowEditContact(true) }}
                        className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-lg transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="bg-white rounded-xl border border-secondary-200 p-0 lg:p-6">
          <div className="flex items-center justify-between p-4 border-b border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-900">Live Preview</h2>
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded-lg border ${previewDevice==='mobile' ? 'bg-secondary-100 border-secondary-300' : 'bg-white border-secondary-200'}`}
              >Mobile</button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`px-3 py-1.5 rounded-lg border ${previewDevice==='tablet' ? 'bg-secondary-100 border-secondary-300' : 'bg-white border-secondary-200'}`}
              >Tablet</button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded-lg border ${previewDevice==='desktop' ? 'bg-secondary-100 border-secondary-300' : 'bg-white border-secondary-200'}`}
              >Desktop</button>
            </div>
          </div>
          <div className="flex items-center justify-center p-4">
            <div className={`${previewDevice==='mobile' ? 'w-[390px]' : previewDevice==='tablet' ? 'w-[768px]' : 'w-full'} border border-secondary-200 rounded-xl overflow-hidden shadow-sm`}> 
              <div className="h-[720px] overflow-y-auto">
                <LinktreeLayout
                  title={formData.title || linktreeData?.title || 'DigCity'}
                  subtitle={formData.subtitle || linktreeData?.subtitle || 'Digital Innovation Community'}
                  avatar={formData.avatar || linktreeData?.avatar}
                >
                  {(() => {
                    return (
                      <>
                        {activeLinksPreview.map((l) => (
                          <LinktreeButton
                            key={l.id}
                            href={l.href}
                            title={l.title}
                            description={l.description}
                            icon={l.icon ? (IconMap[l.icon] || <Globe size={24} />) : <Globe size={24} />}
                            variant={l.variant}
                            isExternal={l.isExternal}
                          />
                        ))}

                        <LinktreeCard
                          title="Follow Us"
                          content="Ikuti kami di social media untuk update terbaru tentang acara, workshop, dan kegiatan DIGCITY"
                          socialLinks={socialPreview}
                          variant="social"
                        />

                        {/* Instagram Acara Card removed per request */}

                        <LinktreeCard
                          title="Contact Info"
                          content="Hubungi kami untuk informasi lebih lanjut tentang keanggotaan, acara, atau kolaborasi"
                          socialLinks={contactPreview}
                          variant="contact"
                        />

                        <LinktreeCard
                          title="Tentang DIGCITY"
                          content="DIGCITY adalah Himpunan Mahasiswa Bisnis Digital Universitas Ibn Khaldun Bogor yang menekankan nilai Berdampak, Adaptif, Inovatif, dan Kompeten dalam pengembangan potensi mahasiswa."
                          variant="info"
                        />

                        <LinktreeCard
                          title="Nilai-Nilai Kami"
                          content="Berdampak - Adaptif - Inovatif - Kompeten"
                          variant="info"
                        />
                      </>
                    )
                  })()}
                </LinktreeLayout>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Upload Avatar</h3>
              <button
                onClick={() => setShowImageUpload(false)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <X size={20} />
              </button>
            </div>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              onCancel={() => setShowImageUpload(false)}
              bucketName="admin-images"
              folderPath="linktree"
              maxSize={2}
            />
          </div>
        </div>
      )}

      {/* Add Link Modal */}
      {showAddLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Add New Link</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Title</label>
          <input
            type="text"
            value={linkForm.title}
            onChange={(e) => setLinkForm({...linkForm, title: e.target.value})}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter link title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">URL</label>
          <input
            type="url"
            value={linkForm.href}
            onChange={(e) => setLinkForm({...linkForm, href: e.target.value})}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://example.com"
          />
          {linkForm.href && !isValidUrl(linkForm.href) && (
            <p className="text-xs text-red-600 mt-1">Masukkan URL yang valid (http/https)</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
          <textarea
            value={linkForm.description}
            onChange={(e) => setLinkForm({...linkForm, description: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Optional description"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Icon</label>
            <select
              value={linkForm.icon}
              onChange={(e) => setLinkForm({...linkForm, icon: e.target.value})}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">None</option>
              <option value="Globe">Globe</option>
              <option value="FileText">FileText</option>
              <option value="Calendar">Calendar</option>
              <option value="Image">Image</option>
              <option value="Newspaper">Newspaper</option>
              <option value="Mail">Mail</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Variant</label>
            <select
              value={linkForm.variant}
              onChange={(e) => setLinkForm({...linkForm, variant: e.target.value})}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={linkForm.is_external}
              onChange={(e) => setLinkForm({...linkForm, is_external: e.target.checked})}
            />
            Open in new tab
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={linkForm.is_active}
              onChange={(e) => setLinkForm({...linkForm, is_active: e.target.checked})}
            />
            Active
          </label>
        </div>
      </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddLink(false)}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                disabled={!linkForm.title || !linkForm.href || !isValidUrl(linkForm.href)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-secondary-300 disabled:cursor-not-allowed"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Social Modal */}
      {showAddSocial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Add Social Media Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Platform</label>
                <select
                  value={socialForm.platform}
                  onChange={(e) => setSocialForm({...socialForm, platform: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Platform</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Username/Value</label>
                <input
                  type="text"
                  value={socialForm.value}
                  onChange={(e) => setSocialForm({...socialForm, value: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="@username or value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">URL (Optional)</label>
                <input
                  type="text"
                  value={socialForm.href}
                  onChange={(e) => setSocialForm({...socialForm, href: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com atau mailto:user@example.com atau tel:+62812..."
                />
                {socialForm.href && !isValidUrl(socialForm.href) && (
                  <p className="text-xs text-red-600 mt-1">Masukkan URL yang valid (http/https/mailto/tel)</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddSocial(false)}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSocial}
                disabled={!socialForm.platform || !socialForm.value || (socialForm.href ? !isValidUrl(socialForm.href) : false)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-secondary-300 disabled:cursor-not-allowed"
              >
                Add Social
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Add Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Type</label>
                <select
                  value={contactForm.platform}
                  onChange={(e) => setContactForm({...contactForm, platform: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="address">Address</option>
                  <option value="website">Website</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Value</label>
                <input
                  type="text"
                  value={contactForm.value}
                  onChange={(e) => setContactForm({...contactForm, value: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter contact value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">URL (Optional)</label>
                <input
                  type="text"
                  value={contactForm.href}
                  onChange={(e) => setContactForm({...contactForm, href: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com atau mailto:user@example.com atau tel:+62812..."
                />
                {contactForm.href && !isValidUrl(contactForm.href) && (
                  <p className="text-xs text-red-600 mt-1">Masukkan URL yang valid (http/https/mailto/tel)</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddContact(false)}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                disabled={!contactForm.platform || !contactForm.value || (contactForm.href ? !isValidUrl(contactForm.href) : false)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-secondary-300 disabled:cursor-not-allowed"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Link Modal */}
      {showEditLink && editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Edit Link</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Title</label>
          <input
            type="text"
            value={editingLink.title}
            onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">URL</label>
          <input
            type="url"
            value={editingLink.href}
            onChange={(e) => setEditingLink({ ...editingLink, href: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
          <textarea
            value={editingLink.description || ''}
            onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Icon</label>
            <select
              value={editingLink.icon || ''}
              onChange={(e) => setEditingLink({ ...editingLink, icon: e.target.value })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">None</option>
              <option value="Globe">Globe</option>
              <option value="FileText">FileText</option>
              <option value="Calendar">Calendar</option>
              <option value="Image">Image</option>
              <option value="Newspaper">Newspaper</option>
              <option value="Mail">Mail</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Variant</label>
            <select
              value={editingLink.variant}
              onChange={(e) => setEditingLink({ ...editingLink, variant: e.target.value as any })}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={editingLink.is_external}
              onChange={(e) => setEditingLink({ ...editingLink, is_external: e.target.checked })}
            />
            Open in new tab
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={editingLink.is_active}
              onChange={(e) => setEditingLink({ ...editingLink, is_active: e.target.checked })}
            />
            Active
          </label>
        </div>
      </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => { setShowEditLink(false); setEditingLink(null) }}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateLink}
                disabled={!editingLink.title || !editingLink.href}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-secondary-300 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Social Modal */}
      {showEditSocial && editingSocial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Edit Social Media Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Platform</label>
                <input
                  type="text"
                  value={editingSocial.platform}
                  onChange={(e) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Username/Value</label>
                <input
                  type="text"
                  value={editingSocial.value}
                  onChange={(e) => setEditingSocial({ ...editingSocial, value: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">URL (Optional)</label>
                <input
                  type="text"
                  value={editingSocial.href || ''}
                  onChange={(e) => setEditingSocial({ ...editingSocial, href: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {editingSocial.href && !isValidUrl(editingSocial.href) && (
                  <p className="text-xs text-red-600 mt-1">Masukkan URL yang valid (http/https/mailto/tel)</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => { setShowEditSocial(false); setEditingSocial(null) }}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSocial}
                disabled={!editingSocial.platform || !editingSocial.value || (editingSocial.href ? !isValidUrl(editingSocial.href) : false)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-secondary-300 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditContact && editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Edit Contact Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Platform</label>
                <input
                  type="text"
                  value={editingContact.platform}
                  onChange={(e) => setEditingContact({ ...editingContact, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Value</label>
                <input
                  type="text"
                  value={editingContact.value}
                  onChange={(e) => setEditingContact({ ...editingContact, value: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text sm font-medium text-secondary-700 mb-2">URL (Optional)</label>
                <input
                  type="text"
                  value={editingContact.href || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, href: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {editingContact.href && !isValidUrl(editingContact.href) && (
                  <p className="text-xs text-red-600 mt-1">Masukkan URL yang valid (http/https/mailto/tel)</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => { setShowEditContact(false); setEditingContact(null) }}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContact}
                disabled={!editingContact.platform || !editingContact.value || (editingContact.href ? !isValidUrl(editingContact.href) : false)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-secondary-300 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLinktree

// ===== Sortable Row component for Links =====
interface SortableLinkRowProps {
  link: LinktreeLink
  onEdit: () => void
  onDelete: () => void
}

const SortableLinkRow: React.FC<SortableLinkRowProps> = ({ link, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? '0 8px 20px rgba(30,64,175,0.15)' : undefined,
    border: isDragging ? '1px dashed #93c5fd' : undefined,
    background: isDragging ? '#f8fafc' : undefined
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <button
          className="w-8 h-8 bg-white border border-secondary-200 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Drag untuk mengurutkan"
          {...attributes}
          {...listeners}
        >
          <span className="w-3 h-3 bg-secondary-300 rounded-sm" />
        </button>
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Link size={20} className="text-primary-600" />
        </div>
        <div>
          <p className="font-medium text-secondary-900">{link.title}</p>
          <p className="text-sm text-secondary-600">{link.href}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-lg transition-colors">
          <Eye size={16} />
        </button>
        <button 
          onClick={onEdit}
          className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-lg transition-colors">
          <Edit3 size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
