import React, { useState, useEffect } from 'react'
import { linktreeAPI, LinktreeData, LinktreeLink, SocialLink, ContactInfo } from '../../lib/linktreeAPI'
import ImageUpload from './ImageUpload'
import { 
  Link, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Globe, 
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

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    avatar: ''
  })

  const [linkForm, setLinkForm] = useState({
    href: '',
    title: '',
    description: '',
    icon: '',
    variant: 'primary',
    is_external: false
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

  useEffect(() => {
    loadLinktreeData()
  }, [])

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
    } catch (error) {
      console.error('Error loading linktree data:', error)
      showMessage('error', 'Gagal memuat data linktree')
    } finally {
      setLoading(false)
    }
  }

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
        is_active: true,
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
          is_external: false
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

  const handleAddSocial = async () => {
    if (!linktreeData) return

    try {
      const socialId = await linktreeAPI.addSocialLink({
        linktree_id: linktreeData.id,
        platform: socialForm.platform,
        value: socialForm.value,
        href: socialForm.href,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

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
        </div>
      </div>

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
        
        <div className="space-y-3">
          {links.length === 0 ? (
            <div className="text-center py-8 text-secondary-500">
              <Link size={48} className="mx-auto mb-2 text-secondary-300" />
              <p>Belum ada link yang ditambahkan</p>
            </div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
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
                  <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-lg transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteLink(link.id)}
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
                  <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-lg transition-colors">
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
                  <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-lg transition-colors">
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
              bucketName="images"
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
                disabled={!linkForm.title || !linkForm.href}
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
                  type="url"
                  value={socialForm.href}
                  onChange={(e) => setSocialForm({...socialForm, href: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
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
                disabled={!socialForm.platform || !socialForm.value}
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
                  type="url"
                  value={contactForm.href}
                  onChange={(e) => setContactForm({...contactForm, href: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
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
                disabled={!contactForm.platform || !contactForm.value}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-secondary-300 disabled:cursor-not-allowed"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLinktree
