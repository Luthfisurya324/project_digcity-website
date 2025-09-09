import React from 'react'
import { X, Calendar, MapPin, Tag, Clock } from 'lucide-react'
import ImageCarousel from './ImageCarousel'
import type { Event } from '../../lib/supabase'
import '../../styles/carousel.css'

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

  // Parse images from event (no duplication)
  const getEventImages = (event: Event): string[] => {
    // Use only additional_images array, first image is the cover
    if (event.additional_images && Array.isArray(event.additional_images) && event.additional_images.length > 0) {
      return event.additional_images
    }
    
    // Fallback to image_url if no additional_images (for backward compatibility)
    if (event.image_url) {
      return [event.image_url]
    }
    
    // Default placeholder
    return ['/placeholder-event.jpg']
  }

  const images = getEventImages(event)
  const formatDate = (dateString: string) => {
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
  }

  const isUpcoming = new Date(event.date) > new Date()

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Close button outside modal */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 w-12 h-12 bg-white hover:bg-gray-100 text-gray-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>
      
      <div className="modal-content bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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
                {formatCategoryName(event.category)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Carousel dengan ukuran tetap */}
          <div className="mb-6">
            <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <ImageCarousel
                images={images}
                autoPlay={true}
                autoPlayInterval={4000}
                showControls={true}
                showThumbnails={true}
                className="w-full h-full"
              />
            </div>
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
