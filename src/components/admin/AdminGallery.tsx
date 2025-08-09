import React, { useState, useEffect } from 'react'
import { galleryAPI } from '../../lib/supabase'
import type { Gallery } from '../../lib/supabase'

interface GalleryFormData {
  title: string
  description: string
  image_url: string
  category: string
  event_date: string
  tags: string[]
}

const AdminGallery: React.FC = () => {
  const [gallery, setGallery] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Gallery | null>(null)
  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    description: '',
    image_url: '',
    category: 'DIGIMON',
    event_date: '',
    tags: []
  })
  const [submitting, setSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { value: 'DIGIMON', label: 'DIGIMON' },
    { value: 'Level Up Day', label: 'Level Up Day' },
    { value: 'SCBD', label: 'SCBD' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Competition', label: 'Competition' },
    { value: 'Other', label: 'Other' }
  ]

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      const data = await galleryAPI.getAll()
      setGallery(data)
    } catch (error) {
      console.error('Error loading gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingItem) {
        await galleryAPI.update(editingItem.id, formData)
      } else {
        await galleryAPI.create(formData)
      }
      
      await loadGallery()
      resetForm()
    } catch (error) {
      console.error('Error saving gallery item:', error)
      alert('Error saving gallery item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: Gallery) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      category: item.category,
      event_date: new Date(item.event_date).toISOString().slice(0, 10),
      tags: item.tags || []
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await galleryAPI.delete(id)
        await loadGallery()
      } catch (error) {
        console.error('Error deleting gallery item:', error)
        alert('Error deleting gallery item. Please try again.')
      }
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'DIGIMON',
      event_date: '',
      tags: []
    })
    setEditingItem(null)
    setShowForm(false)
    setTagInput('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredGallery = selectedCategory === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Gallery Management</h1>
          <p className="text-secondary-600 mt-2">Manage DIGCITY event photos and memories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <span>📸</span>
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
            }`}
          >
            All ({gallery.length})
          </button>
          {categories.map((cat) => {
            const count = gallery.filter(item => item.category === cat.value).length
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
                }`}
              >
                {cat.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
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
                  placeholder="Photo title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Photo description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
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
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Saving...' : (editingItem ? 'Update Photo' : 'Add Photo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {selectedCategory === 'all' ? 'All Photos' : selectedCategory} ({filteredGallery.length})
          </h2>
        </div>
        
        {filteredGallery.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <div key={item.id} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/300'
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-secondary-900 text-sm line-clamp-2">{item.title}</h3>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-primary-600 hover:text-primary-800 p-1"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-secondary-600 mb-2 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex px-2 py-1 rounded-full bg-primary-100 text-primary-800 font-medium">
                        {item.category}
                      </span>
                      <span className="text-secondary-500">
                        {formatDate(item.event_date)}
                      </span>
                    </div>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              {selectedCategory === 'all' ? 'No photos yet' : `No photos in ${selectedCategory}`}
            </h3>
            <p className="text-secondary-500 mb-4">
              {selectedCategory === 'all' 
                ? 'Start building your gallery by adding the first photo.' 
                : `Add photos to the ${selectedCategory} category.`}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add First Photo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminGallery