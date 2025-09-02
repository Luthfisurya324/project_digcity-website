import React, { useState, useEffect } from 'react'
import { eventAPI } from '../../lib/supabase'
import type { Event } from '../../lib/supabase'
import { 
  Plus, 
  Calendar, 
  Trash2, 
  Edit3, 
  MapPin, 
  Image as ImageIcon,
  Tag,
  Crop
} from 'lucide-react'
import MultipleImageUpload from './MultipleImageUpload'
import ImageCropper from './ImageCropper'

interface EventFormData {
  title: string
  description: string
  date: string
  location: string
  additional_images: string[]
  category: string
}

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    additional_images: [],
    category: 'general'
  })
  const [submitting, setSubmitting] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('url')
  const [showImageCropper, setShowImageCropper] = useState(false)
  const [editingImage, setEditingImage] = useState<string | null>(null)

  // Function to format category names from underscore to user-friendly names
  const formatCategoryName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'business': 'Business & Entrepreneurship',
      'technology': 'Technology & Innovation',
      'education': 'Education & Training',
      'workshop': 'Workshop & Skills',
      'seminar': 'Seminar & Conference',
      'networking': 'Networking & Community',
      'startup': 'Startup & Innovation',
      'digital_marketing': 'Digital Marketing',
      'finance': 'Finance & Investment',
      'healthcare': 'Healthcare & Wellness',
      'creative': 'Creative & Design',
      'sports': 'Sports & Fitness',
      'culture': 'Culture & Arts',
      'environment': 'Environment & Sustainability',
      'social_impact': 'Social Impact & Charity',
      'general': 'General'
    };

    return categoryMap[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Function to format date and time for display
  const formatEventDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }

      // Format: "Jumat, 25 April 2025 • 09:00 WIB"
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      };

      return date.toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  };

  // Function to format date only (for shorter display)
  const formatEventDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }

      // Format: "25 April 2025"
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };

      return date.toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  };

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
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await eventAPI.getAll()
      setEvents(data)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent form from refreshing the page
    setSubmitting(true)

    try {
      if (editingEvent) {
        await eventAPI.update(editingEvent.id, formData)
      } else {
        await eventAPI.create(formData)
      }
      
      await loadEvents()
      // Show success message instead of alert
      console.log('Event saved successfully!')
      
      // Close modal and reset form
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      // Show error message instead of alert
      console.error('Error saving event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      additional_images: event.additional_images || [],
      category: event.category
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id)
        await loadEvents()
        console.log('Event deleted successfully!')
      } catch (error) {
        console.error('Error deleting event:', error)
        console.error('Error deleting event. Please try again.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      additional_images: [],
      category: 'general'
    })
    setEditingEvent(null)
    setShowForm(false)
    setShowImageUpload(false)
    setImageUploadMode('url')
  }

  const handleImagesUploaded = (imageUrls: string[]) => {
    setFormData(prev => ({
      ...prev,
      additional_images: imageUrls
    }))
    setShowImageUpload(false)
  }

  const handleImageModeChange = (mode: 'url' | 'upload') => {
    setImageUploadMode(mode)
    if (mode === 'upload') {
      setShowImageUpload(true)
    }
  }

  const handleEditImage = (imageUrl: string) => {
    setEditingImage(imageUrl)
    setShowImageCropper(true)
  }

  const handleImageCropped = (croppedImageUrl: string) => {
    if (editingImage) {
      // Replace the original image with cropped version
      const newImages = formData.additional_images.map(img => 
        img === editingImage ? croppedImageUrl : img
      )
      
      setFormData(prev => ({
        ...prev,
        additional_images: newImages
      }))
    }
    
    setShowImageCropper(false)
    setEditingImage(null)
  }

  const handleMainImageSelect = (imageUrl: string) => {
    // Move selected image to front of array (first position = cover)
    const currentImages = formData.additional_images
    const selectedImageIndex = currentImages.indexOf(imageUrl)
    
    if (selectedImageIndex !== -1) {
      // Remove from current position
      const newImages = currentImages.filter((_, index) => index !== selectedImageIndex)
      // Add to front (index 0) - this will be the cover
      newImages.unshift(imageUrl)
      
      setFormData(prev => ({
        ...prev,
        additional_images: newImages
        // Remove image_url since we don't need it anymore
        // The first image in additional_images will be the cover
      }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <h1 className="text-2xl font-bold text-secondary-900">Events Management</h1>
          <p className="text-secondary-600">Manage DIGCITY events and activities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Total Events</p>
          <p className="text-2xl font-bold text-secondary-900">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Upcoming</p>
          <p className="text-2xl font-bold text-green-600">{events.filter(e => new Date(e.date) > new Date()).length}</p>
        </div>
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Past Events</p>
          <p className="text-2xl font-bold text-secondary-600">{events.filter(e => new Date(e.date) <= new Date()).length}</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Kembali ke Events</span>
              </button>
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
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Event Images</label>
                
                {/* Image Mode Selection */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => handleImageModeChange('url')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageUploadMode === 'url'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageModeChange('upload')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageUploadMode === 'upload'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Upload Images
                  </button>
                </div>



                {/* Image Upload Component */}
                {imageUploadMode === 'upload' && (
                  <div>
                    {showImageUpload ? (
                                                                       <MultipleImageUpload
                           onImagesUploaded={handleImagesUploaded}
                           contentType="events"
                           contentTitle={formData.title || 'Untitled Event'}
                           bucketName="admin-images"
                           maxSize={5}
                           maxFiles={10}
                           initialImages={formData.additional_images}
                         />
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <p className="text-gray-600 mb-3">Click to upload event images</p>
                        <button
                          type="button"
                          onClick={() => setShowImageUpload(true)}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Upload Images
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Images Display */}
                {formData.additional_images && formData.additional_images.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Current Images ({formData.additional_images.length})</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {formData.additional_images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Event image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.additional_images.filter((_, i) => i !== index)
                              setFormData(prev => ({ ...prev, additional_images: newImages }))
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Display Settings */}
                {formData.additional_images && formData.additional_images.length > 0 && (
                  <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                    <h4 className="text-sm font-medium text-secondary-700 mb-3">Image Display Settings</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-secondary-600 mb-2">Image Order (First = Cover)</label>
                        <div className="space-y-2">
                          {formData.additional_images.map((imageUrl, index) => (
                            <div 
                              key={index} 
                              className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                index === 0
                                  ? 'border-primary-500 bg-primary-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleMainImageSelect(imageUrl)}
                            >
                              <span className="text-xs text-secondary-500 w-6">{index + 1}.</span>
                              <img
                                src={imageUrl}
                                alt={`Image ${index + 1}`}
                                className="w-12 h-12 object-cover rounded border border-gray-200"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs text-secondary-600 truncate block">
                                  {imageUrl.split('/').pop()?.substring(0, 20)}...
                                </span>
                                {index === 0 && (
                                  <span className="text-xs text-primary-600 font-medium">✓ Cover</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditImage(imageUrl)
                                }}
                                className="p-1 text-secondary-500 hover:text-primary-600 transition-colors"
                                title="Edit Image"
                              >
                                <Crop size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-secondary-500 mt-2">
                          Klik gambar untuk set sebagai cover. Gambar akan dipindah ke urutan pertama dan menjadi cover.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm text-secondary-600 mb-2">Display Order</label>
                        <div className="space-y-2">
                          {formData.additional_images.map((imageUrl, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                              <span className="text-xs text-secondary-500 w-6">{index + 1}.</span>
                              <img
                                src={imageUrl}
                                alt={`Order ${index + 1}`}
                                className="w-8 h-8 object-cover rounded border border-gray-200"
                              />
                              <span className="text-xs text-secondary-600 truncate flex-1">
                                {imageUrl.split('/').pop()?.substring(0, 20)}...
                              </span>
                              {index === 0 && (
                                <span className="text-xs text-primary-600 font-medium">Cover</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">
                          Urutan gambar akan menentukan tampilan carousel. Gambar pertama adalah cover.
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <h5 className="text-sm font-medium text-secondary-700 mb-2">Preview Display</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-secondary-600 mb-1">Event Card (Cover Image)</p>
                          <div className="w-full h-24 bg-gray-100 rounded border overflow-hidden">
                            {formData.additional_images.length > 0 ? (
                              <img
                                src={formData.additional_images[0]}
                                alt="Cover image preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                No cover image
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-secondary-600 mb-1">Carousel (All Images)</p>
                          <div className="w-full h-24 bg-gray-100 rounded border overflow-hidden">
                            {formData.additional_images.length > 0 ? (
                              <div className="flex h-full">
                                {formData.additional_images.slice(0, 3).map((imageUrl, index) => (
                                  <div key={index} className="flex-1 border-r border-gray-200 last:border-r-0">
                                    <img
                                      src={imageUrl}
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                No images
                              </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                  {submitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-lg border border-secondary-200">
        <div className="p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">All Events ({events.length})</h2>
        </div>
        
        {events.length > 0 ? (
          <div className="divide-y divide-secondary-200">
            {events.map((event) => {
              const isUpcoming = new Date(event.date) > new Date()
              
              return (
                <div key={event.id} className="p-6 hover:bg-secondary-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                          <Calendar size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-secondary-900">{event.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              isUpcoming 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {isUpcoming ? 'Upcoming' : 'Past'}
                            </span>
                          </div>
                          <p className="text-secondary-600 mb-3">{event.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                            <div className="flex items-center space-x-2 text-secondary-600 mb-2">
                              <Calendar size={16} />
                              <span>{formatEventDate(event.date)}</span>
                            </div>
                            <span className="flex items-center">
                              <MapPin size={16} />
                              {event.location}
                            </span>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold">
                              {formatCategoryName(event.category)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => handleEdit(event)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center space-x-2"
                      >
                        <Edit3 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <Calendar size={48} />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">No events yet</h3>
            <p className="text-secondary-500 mb-6">Get started by creating your first event!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus size={20} className="mr-2" />
              Add First Event
            </button>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {showImageCropper && editingImage && (
        <ImageCropper
          imageUrl={editingImage}
          onCrop={handleImageCropped}
          onCancel={() => {
            setShowImageCropper(false)
            setEditingImage(null)
          }}
          aspectRatio={16/9}
          targetWidth={800}
          targetHeight={450}
        />
      )}
    </div>
  )
}

export default AdminEvents