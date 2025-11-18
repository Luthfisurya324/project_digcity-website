import React, { useEffect, useMemo, useState } from 'react'
import { X, Search, Calendar, MapPin, Image as ImageIcon, ChevronDown } from 'lucide-react'
import type { Event } from '../../lib/supabase'
import { eventAPI } from '../../lib/supabase'

interface EventImagePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string) => void
}

const EventImagePicker: React.FC<EventImagePickerProps> = ({ isOpen, onClose, onSelect }) => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isOpen) {
      fetchEvents()
    }
  }, [isOpen])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await eventAPI.getAll()
      setEvents(data)
    } catch (err) {
      console.error('Failed to load events for image picker:', err)
      setError('Gagal memuat daftar event.')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events
    return events.filter(event =>
      event.title.toLowerCase().includes(search.trim().toLowerCase())
    )
  }, [events, search])

  const extractImages = (event: Event): string[] => {
    const baseImages: string[] = []
    if (event.image_url) baseImages.push(event.image_url)
    if (Array.isArray(event.additional_images)) {
      event.additional_images.forEach(img => {
        if (img && !baseImages.includes(img)) {
          baseImages.push(img)
        }
      })
    }
    return baseImages
  }

  const getOptimizedUrl = (url: string, width: number = 640) => {
    if (!url.includes('/object/public/')) return url
    const hasQuery = url.includes('?')
    const params = `width=${width}&quality=70`
    return hasQuery ? `${url}&${params}` : `${url}?${params}`
  }

  const toggleExpanded = (eventId: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev)
      if (next.has(eventId)) {
        next.delete(eventId)
      } else {
        next.add(eventId)
      }
      return next
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col border border-secondary-100">
        <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">Pilih Gambar dari Event</h2>
            <p className="text-sm text-secondary-500">
              Reuse gambar event yang sudah pernah diunggah agar brand tetap konsisten.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary-100 text-secondary-500"
            aria-label="Tutup pemilih gambar event"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-secondary-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari event berdasarkan judul..."
              className="w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <p className="text-xs text-secondary-500">
            Total event: {events.length} • Menampilkan {filteredEvents.length} event
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 bg-secondary-50/60">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-secondary-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4" />
              Memuat galeri event...
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-secondary-600">
              Tidak ada event yang cocok dengan pencarian.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(event => {
                const images = extractImages(event)
                if (!images.length) return null
                const isExpanded = expandedEvents.has(event.id)
                const displayImages = isExpanded ? images : images.slice(0, 4)
                return (
                  <div key={event.id} className="bg-white border border-secondary-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3 justify-between">
                      <div>
                        <p className="font-semibold text-secondary-900">{event.title}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-secondary-500 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {event.date
                              ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                              : 'Tanggal tidak tersedia'}
                          </span>
                          {event.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary-100 text-secondary-600">
                          {images.length} gambar
                        </span>
                        {images.length > 4 && (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(event.id)}
                            className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                          >
                            {isExpanded ? 'Tutup' : 'Lihat semua'}
                            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                      {displayImages.map((imageUrl, index) => (
                        <button
                          type="button"
                          key={`${event.id}-${index}`}
                          onClick={() => onSelect(imageUrl)}
                          className="group relative block rounded-xl overflow-hidden border border-secondary-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <img
                            src={getOptimizedUrl(imageUrl)}
                            alt={`${event.title} ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">Gunakan Gambar</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-secondary-100 bg-white flex items-center justify-between text-sm text-secondary-600">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Klik salah satu gambar untuk menggunakannya di artikel Anda.</span>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-500 hover:text-secondary-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventImagePicker

