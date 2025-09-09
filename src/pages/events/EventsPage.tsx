import React, { useState, useEffect, useCallback } from 'react';
import { eventAPI, type Event } from '../../lib/supabase';
import { Calendar, MapPin } from 'lucide-react';
import ImageCarousel from '../../components/ui/ImageCarousel';
import EventDetailModal from '../../components/ui/EventDetailModal';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await eventAPI.getAll();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Use only Supabase data - no fallback dummy data
  const displayEvents = events;
  
  // Filter events based on selected category only
  const filteredEvents = displayEvents.filter(event => {
    const categoryMatch = selectedCategory === 'Semua' || event.category === selectedCategory;
    return categoryMatch;
  });

  // Get unique categories
  const categories = ['Semua', ...Array.from(new Set(displayEvents.map(event => event.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-white">
      {/* Header Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Decorative gradient blobs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-primary-400 to-secondary-400" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-secondary-300 to-primary-300" />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-secondary-300" />
          </svg>
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-secondary-200 text-secondary-700 text-sm mb-4">
                <Calendar className="w-4 h-4 text-primary-500" />
                Events & Activities
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900 mb-6">
                Acara & Kegiatan
              </h1>
              <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
                Ikuti berbagai acara menarik yang diselenggarakan oleh DIGCITY untuk mengembangkan skill dan networking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm sm:text-base text-secondary-600 mb-6 sm:mb-8">
              Temukan acara yang sesuai dengan minat Anda
            </p>
            
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-2 items-center">
                <span className="text-xs sm:text-sm font-medium text-secondary-700 mb-2 sm:mb-0 sm:mr-2">Kategori:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border transition-colors duration-200 interactive-element ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-secondary-700 border-secondary-200 hover:bg-primary-600 hover:text-white hover:border-primary-600'
                      }`}
                    >
                      {category === 'Semua' ? 'Semua' : formatCategoryName(category)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-6 sm:mb-8 text-center sm:text-left">Acara & Kegiatan</h2>
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredEvents.map((event) => {
                // Get all images for the event (no duplication)
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
                
                return (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200 cursor-pointer transform hover:scale-105"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      {images.length > 1 ? (
                        <ImageCarousel
                          images={images}
                          autoPlay={true}
                          autoPlayInterval={3000}
                          showControls={false}
                          showThumbnails={false}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100">
                          <img
                            src={images[0]}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: 'center',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Click indicator */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 text-secondary-900 px-3 py-1 rounded-full text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
                          Click to view details
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-primary-100 text-primary-600 text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                          {formatCategoryName(event.category)}
                        </span>
                        {images.length > 1 && (
                          <span className="text-xs text-secondary-500 flex items-center">
                            <span className="w-2 h-2 bg-primary-500 rounded-full mr-1"></span>
                            {images.length} images
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2 sm:mb-3">
                        {event.title}
                      </h3>
                      <p className="text-sm sm:text-base text-secondary-600 mb-3 sm:mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs sm:text-sm text-secondary-600">
                          <Calendar className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                          {formatEventDate(event.date)}
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-secondary-600">
                          <MapPin className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-secondary-600 px-4">Tidak ada acara yang ditemukan untuk kategori ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
            Ingin Mengadakan Acara Bersama?
          </h2>
          <p className="text-sm sm:text-base text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Hubungi kami untuk berkolaborasi dalam mengadakan acara atau workshop yang bermanfaat
          </p>
          <button className="bg-white text-primary-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-50 transition-colors duration-200">
            Hubungi Kami
          </button>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default EventsPage;