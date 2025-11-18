import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { eventAPI, type Event } from '../../lib/supabase';
import EventDetailModal from './EventDetailModal';
import '../../styles/carousel.css';

interface EventCarouselProps {
  autoPlayInterval?: number;
  showControls?: boolean;
  maxEvents?: number;
}

const EventCarousel: React.FC<EventCarouselProps> = ({
  autoPlayInterval = 3000,
  showControls = true,
  maxEvents = 6
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs for debouncing and retry timers
  const refreshTimeoutRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  // Stable setter to avoid re-renders when data is identical
  const setEventsIfChanged = useCallback((next: Event[]) => {
    setEvents(prev => {
      if (prev.length === next.length && prev.every((e, i) => e.id === next[i].id && e.updated_at === next[i].updated_at)) {
        return prev; // no change
      }
      return next;
    });
  }, []);

  // Fetch with light retry & backoff
  const fetchUpcoming = useCallback(async (attempt: number = 1) => {
    try {
      setError(null);
      const eventsData = await eventAPI.getUpcoming(maxEvents);
      setEventsIfChanged(eventsData);
      setLoading(false);
    } catch (err: any) {
      if (attempt < 3) {
        const delay = Math.min(2000, 300 * (2 ** attempt));
        if (retryTimeoutRef.current) window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = window.setTimeout(() => {
          fetchUpcoming(attempt + 1);
        }, delay);
      } else {
        console.error('Error loading events:', err);
        setError(err?.message || 'Gagal memuat acara');
        setLoading(false);
      }
    }
  }, [maxEvents, setEventsIfChanged]);

  // Load upcoming events from Supabase (optimized)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchUpcoming(1);
    return () => {
      cancelled = true;
      if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
      if (retryTimeoutRef.current) window.clearTimeout(retryTimeoutRef.current);
    };
  }, [fetchUpcoming]);

  // Realtime subscription for events changes (debounced)
  useEffect(() => {
    const unsubscribe = eventAPI.subscribeToChanges(() => {
      if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = window.setTimeout(() => {
        fetchUpcoming(1);
      }, 250);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
    };
  }, [fetchUpcoming]);

  // Respect prefers-reduced-motion for autoplay
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) setIsAutoPlaying(false);
    const handler = (e: MediaQueryListEvent) => setIsAutoPlaying(!e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Auto-play functionality with performance optimization
  useEffect(() => {
    if (!isAutoPlaying || events.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === events.length - 1 ? 0 : prevIndex + 1;
        return nextIndex;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, events.length, autoPlayInterval]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  }, [events.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  }, [events.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Event handlers with performance optimization
  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  // Fallback UI moved below after hooks to satisfy Rules of Hooks and avoid TDZ

  // Format date function
  const formatEventDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Tanggal tidak valid';
      
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      
      return date.toLocaleDateString('id-ID', options);
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  // Format category function
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

  // Get event image with memoization
  const getEventImage = useCallback((event: Event): string => {
    if (event.additional_images && Array.isArray(event.additional_images) && event.additional_images.length > 0) {
      return event.additional_images[0];
    }
    if (event.image_url) {
      return event.image_url;
    }
    return '/placeholder-event.jpg';
  }, []);

  // Memoize formatted events data to prevent unnecessary re-renders
  const formattedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      formattedDate: formatEventDate(event.date),
      formattedCategory: formatCategoryName(event.category),
      eventImage: getEventImage(event)
    }));
  }, [events, getEventImage]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <p>Tidak dapat memuat acara: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <Calendar className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Acara & Kegiatan Terbaru</h2>
            <p className="text-lg text-primary-100 mb-8">Belum ada acara yang tersedia saat ini.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-10 bg-white" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-10 bg-white" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center text-white mb-8 sm:mb-12">
            <Calendar className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Acara & Kegiatan Terbaru</h2>
            <p className="text-base sm:text-lg text-primary-100 max-w-3xl mx-auto">
              Jangan lewatkan berbagai workshop, seminar, kompetisi, dan acara networking yang kami selenggarakan
            </p>
          </div>

          {/* Carousel Container */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Main Carousel */}
            <div className="event-carousel relative overflow-hidden rounded-2xl">
              <div 
                className="event-carousel-track flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {formattedEvents.map((event, index) => (
                  <div key={event.id} className="event-carousel-slide w-full flex-shrink-0">
                    <div 
                      className="event-card bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer mx-2 sm:mx-4"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden">
                          <img
                            src={event.eventImage}
                            alt={event.title}
                            className="event-card-image w-full h-full object-cover"
                            loading={index === currentIndex ? 'eager' : 'lazy'}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-event.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-primary-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg">
                              <span className="hidden sm:inline">{event.formattedCategory}</span>
                              <span className="sm:hidden">{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-900 mb-2 sm:mb-3 line-clamp-2">
                              {event.title}
                            </h3>
                            <p className="text-sm sm:text-base text-secondary-600 mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                              {event.description}
                            </p>
                          </div>

                          <div className="space-y-2 sm:space-y-3">
                            {/* Event Details */}
                            <div className="flex items-center text-secondary-600">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary-600 flex-shrink-0" />
                              <span className="text-xs sm:text-sm">{event.formattedDate}</span>
                            </div>
                            <div className="flex items-center text-secondary-600">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary-600 flex-shrink-0" />
                              <span className="text-xs sm:text-sm line-clamp-1">{event.location}</span>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-1 sm:pt-2">
                              <button className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors group text-sm sm:text-base">
                                <span>Lihat Detail</span>
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transition-transform group-hover:translate-x-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            {showControls && events.length > 1 && (
              <>
                {/* Previous/Next Buttons */}
                <button
                  onClick={goToPrevious}
                  className="carousel-nav-button absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-secondary-800 rounded-full shadow-lg flex items-center justify-center z-10"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="carousel-nav-button absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-secondary-800 rounded-full shadow-lg flex items-center justify-center z-10"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Dot Indicators */}
          {events.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: events.length }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`carousel-dot w-3 h-3 rounded-full ${
                    index === currentIndex
                      ? 'bg-white active'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* View All Events Button */}
          <div className="text-center mt-8">
              <a
                href="/events"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              <span>Lihat Semua Acara</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
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
    </>
  );
};

export default EventCarousel;