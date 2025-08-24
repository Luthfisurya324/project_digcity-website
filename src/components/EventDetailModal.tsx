import React from 'react'
import { X, Calendar, MapPin, Tag, Clock } from 'lucide-react'
import ImageCarousel from './ImageCarousel'
import type { Event } from '../lib/supabase'

interface EventDetailModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null

  // Parse images from event
  const getEventImages = (event: Event): string[] => {
    const images: string[] = []
    
    // Add main image if exists
    if (event.image_url) {
      images.push(event.image_url)
    }
    
    // Add additional images if they exist in the event data
    // This will be populated when we update the database schema
    if (event.additional_images && Array.isArray(event.additional_images)) {
      images.push(...event.additional_images)
    }
    
    return images.length > 0 ? images : ['/placeholder-event.jpg']
  }

  const images = getEventImages(event)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = new Date(event.date) > new Date()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Close button outside modal */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 w-12 h-12 bg-white hover:bg-gray-100 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
      >
        <X size={24} />
      </button>
      
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">{event.title}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isUpcoming 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {isUpcoming ? 'Upcoming' : 'Past Event'}
              </span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                {event.category}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Carousel */}
          <div className="mb-6">
            <ImageCarousel
              images={images}
              autoPlay={true}
              autoPlayInterval={4000}
              showControls={true}
              showThumbnails={true}
              className="w-full h-80"
            />
          </div>

          {/* Event Details - Simplified Layout */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Description</h3>
              <p className="text-secondary-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-secondary-900 text-sm">Date & Time</p>
                  <p className="text-secondary-600 text-sm">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-secondary-900 text-sm">Location</p>
                  <p className="text-secondary-600 text-sm">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              {isUpcoming && (
                <button className="bg-primary-600 text-white py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Register for Event
                </button>
              )}
              
              <button className="bg-secondary-100 text-secondary-700 py-2 px-6 rounded-lg hover:bg-secondary-200 transition-colors font-medium">
                Share Event
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default EventDetailModal
