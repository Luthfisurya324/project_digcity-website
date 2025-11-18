import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventAPI, type Event } from '../../lib/supabase';
import EventDetailModal from './EventDetailModal';
import '../../styles/eventCard.css';
import '../../styles/carousel.css';
import '../../styles/eventCardCarousel.css';

interface EventCardCarouselProps {
  maxEvents?: number;
  showTitle?: boolean;
  className?: string;
  autoRefresh?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
}

const EventCardCarousel: React.FC<EventCardCarouselProps> = ({
  maxEvents = 6,
  showTitle = true,
  className = '',
  autoRefresh = true,
  autoPlayInterval = 4000,
  showControls = true
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const refreshTimeoutRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  const autoPlayTimeoutRef = useRef<number | null>(null);

  // Function to format category names
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

  // Function to get category color
  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      'business': 'from-blue-500 to-blue-600',
      'technology': 'from-purple-500 to-purple-600',
      'education': 'from-green-500 to-green-600',
      'workshop': 'from-orange-500 to-orange-600',
      'seminar': 'from-indigo-500 to-indigo-600',
      'networking': 'from-pink-500 to-pink-600',
      'startup': 'from-red-500 to-red-600',
      'digital_marketing': 'from-cyan-500 to-cyan-600',
      'finance': 'from-emerald-500 to-emerald-600',
      'healthcare': 'from-teal-500 to-teal-600',
      'creative': 'from-violet-500 to-violet-600',
      'sports': 'from-lime-500 to-lime-600',
      'culture': 'from-rose-500 to-rose-600',
      'environment': 'from-green-600 to-green-700',
      'social_impact': 'from-amber-500 to-amber-600',
      'general': 'from-gray-500 to-gray-600'
    };

    return colorMap[category] || 'from-primary-500 to-primary-600';
  };

  // Function to format date and time
  const formatEventDateTime = (dateString: string): { date: string; time: string; dayName: string } => {
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return { date: 'Tanggal tidak valid', time: '', dayName: '' };
      }

      const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const dateFormatted = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const timeFormatted = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      });

      return {
        date: dateFormatted,
        time: timeFormatted + ' WIB',
        dayName
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { date: 'Tanggal tidak valid', time: '', dayName: '' };
    }
  };

  // Function to check if event is upcoming (within next 7 days)
  const isUpcomingEvent = (dateString: string): boolean => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return eventDate >= now && eventDate <= sevenDaysFromNow;
  };

  // Function to get event images (same as EventsPage)
  const getEventImages = (event: Event): string[] => {
    // Use only additional_images array, first image is the cover
    if (event.additional_images && Array.isArray(event.additional_images) && event.additional_images.length > 0) {
      return event.additional_images;
    }
    
    // Fallback to image_url if no additional_images (for backward compatibility)
    if (event.image_url) {
      return [event.image_url];
    }
    
    // Default placeholder
    return ['/placeholder-event.jpg'];
  };

  // Stable setter to avoid re-renders when data is identical
  const setEventsIfChanged = useCallback((next: Event[]) => {
    setEvents(prev => {
      if (prev.length === next.length && prev.every((e, i) => e.id === next[i].id && e.updated_at === next[i].updated_at)) {
        return prev;
      }
      return next;
    });
  }, []);

  // Fetch events with retry logic
  const fetchEvents = useCallback(async (attempt: number = 1) => {
    try {
      setError(null);
      const eventsData = await eventAPI.getUpcoming(maxEvents);
      
      // Sort events by date (nearest first)
      const sortedEvents = eventsData.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
      
      setEventsIfChanged(sortedEvents);
      setLoading(false);
    } catch (err: any) {
      if (attempt < 3) {
        const delay = Math.min(2000, 300 * (2 ** attempt));
        if (retryTimeoutRef.current) window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = window.setTimeout(() => {
          fetchEvents(attempt + 1);
        }, delay);
      } else {
        console.error('Error loading events:', err);
        setError(err?.message || 'Gagal memuat acara');
        setLoading(false);
      }
    }
  }, [maxEvents, setEventsIfChanged]);

  // Navigation functions with performance optimization
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIndex = (prev + 1) % events.length;
      return nextIndex;
    });
  }, [events.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => {
      const prevIndex = (prev - 1 + events.length) % events.length;
      return prevIndex;
    });
  }, [events.length]);

  const goToSlide = useCallback((index: number) => {
    if (index !== currentIndex && index >= 0 && index < events.length) {
      setCurrentIndex(index);
    }
  }, [currentIndex, events.length]);

  // Auto-play functionality with performance optimization
  useEffect(() => {
    if (!isAutoPlaying || isPaused || events.length <= 1) {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      return;
    }

    // Use requestAnimationFrame for smoother animations
    const scheduleNext = () => {
      autoPlayTimeoutRef.current = window.setTimeout(() => {
        requestAnimationFrame(() => {
          goToNext();
        });
      }, autoPlayInterval);
    };

    scheduleNext();

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying, isPaused, events.length, autoPlayInterval, goToNext]);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) setIsAutoPlaying(false);
    const handler = (e: MediaQueryListEvent) => setIsAutoPlaying(!e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Load events on component mount
  useEffect(() => {
    setLoading(true);
    fetchEvents(1);
    
    return () => {
      if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
      if (retryTimeoutRef.current) window.clearTimeout(retryTimeoutRef.current);
      if (autoPlayTimeoutRef.current) window.clearTimeout(autoPlayTimeoutRef.current);
    };
  }, [fetchEvents]);

  // Real-time subscription for events changes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const unsubscribe = eventAPI.subscribeToChanges(() => {
      if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = window.setTimeout(() => {
        fetchEvents(1);
      }, 250);
    });
    
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
    };
  }, [fetchEvents, autoRefresh]);

  // Handle event card click
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Handle mouse enter/leave for auto-play pause with debouncing
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Memoize current event data to prevent unnecessary re-calculations
  const currentEventData = useMemo(() => {
    if (events.length === 0) return null;
    const currentEvent = events[currentIndex];
    return {
      event: currentEvent,
      ...formatEventDateTime(currentEvent.date),
      isUpcoming: isUpcomingEvent(currentEvent.date),
      categoryColor: getCategoryColor(currentEvent.category)
    };
  }, [events, currentIndex]);

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        {showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Acara yang Sudah Dilaksanakan
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
          </div>
        )}
        
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-64 sm:h-80 lg:h-96 skeleton"></div>
            <div className="p-6">
              <div className="h-4 skeleton rounded mb-2"></div>
              <div className="h-6 skeleton rounded mb-4"></div>
              <div className="h-4 skeleton rounded mb-2"></div>
              <div className="h-4 skeleton rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        {showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Acara yang Sudah Dilaksanakan
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
          </div>
        )}
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Gagal Memuat Acara</h3>
          <p className="text-secondary-600 mb-4">{error}</p>
          <button
            onClick={() => fetchEvents(1)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        {showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Acara yang Sudah Dilaksanakan
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
          </div>
        )}
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-secondary-500" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Belum Ada Acara</h3>
          <p className="text-secondary-600">Saat ini belum ada acara yang dijadwalkan. Pantau terus untuk update terbaru!</p>
        </div>
      </div>
    );
  }

  if (!currentEventData) {
    return (
      <div className={`w-full ${className}`}>
        {showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Acara yang Sudah Dilaksanakan
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
          </div>
        )}
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-secondary-500" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Belum Ada Acara</h3>
          <p className="text-secondary-600">Saat ini belum ada acara yang dijadwalkan. Pantau terus untuk update terbaru!</p>
        </div>
      </div>
    );
  }

  const { event: currentEvent, date, time, dayName, isUpcoming, categoryColor } = currentEventData;

  return (
    <div className={`w-full ${className}`}>
      {showTitle && (
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 mb-4">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-700">Kilas Balik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Acara yang Sudah Dilaksanakan
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto mb-6">
            Kilas balik berbagai acara terbaik DIGCITY. Simak dokumentasi dan highlight setiap kegiatan yang sudah terlaksana.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
        </div>
      )}

      {/* Carousel Container */}
      <div 
        className="relative max-w-4xl mx-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main Carousel */}
        <div className="event-carousel relative overflow-hidden rounded-2xl">
          <div 
            className="event-carousel-track flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {events.map((event, index) => {
              const eventDateTime = formatEventDateTime(event.date);
              const eventIsUpcoming = isUpcomingEvent(event.date);
              const eventCategoryColor = getCategoryColor(event.category);
              
              return (
                <div key={event.id} className="event-carousel-slide w-full flex-shrink-0">
                  <div 
                    className="event-card event-card-animate bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer mx-2 sm:mx-4"
                    onClick={() => handleEventClick(event)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Lihat detail acara ${event.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEventClick(event);
                      }
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                      {/* Image Section */}
                      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                        {/* Upcoming Event Badge */}
                        {eventIsUpcoming && (
                          <div className="absolute top-4 left-4 z-10">
                            <div className="upcoming-badge event-badge inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-full shadow-lg">
                              <Zap className="w-3 h-3" />
                              <span>Segera</span>
                            </div>
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <div className={`event-badge inline-flex items-center px-3 py-1 bg-gradient-to-r ${eventCategoryColor} text-white text-xs font-medium rounded-full shadow-lg`}>
                            <span className="hidden sm:inline">{formatCategoryName(event.category)}</span>
                            <span className="sm:hidden">{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                          </div>
                        </div>

                        {(() => {
                          const images = getEventImages(event);
                          const hasValidImage = images[0] && images[0] !== '/placeholder-event.jpg';
                          
                          return hasValidImage ? (
                            <img
                              src={images[0]}
                              alt={event.title}
                              className="event-image w-full h-full object-cover"
                              loading={index === currentIndex ? 'eager' : 'lazy'}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${eventCategoryColor} flex items-center justify-center"><svg class="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${eventCategoryColor} flex items-center justify-center`}>
                              <Calendar className="w-16 h-16 text-white/80" />
                            </div>
                          );
                        })()}
                        
                        {/* Gradient Overlay */}
                        <div className="event-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0"></div>
                        
                        {/* Hover Action */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <ArrowRight className="w-6 h-6 text-primary-600" />
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                          {/* Date and Time */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                            <div className="flex items-center gap-2 text-primary-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">{eventDateTime.dayName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-secondary-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{eventDateTime.time}</span>
                            </div>
                          </div>

                          {/* Event Title */}
                          <h3 className="event-title text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 mb-4 line-clamp-2">
                            {event.title}
                          </h3>

                          {/* Event Description */}
                          <p className="text-secondary-600 text-sm sm:text-base mb-6 line-clamp-4 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        <div>
                          {/* Location and Date */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-secondary-500">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-secondary-500">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">{eventDateTime.date}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-4 border-t border-secondary-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-secondary-400 font-medium uppercase tracking-wide">
                                Klik untuk detail
                              </span>
                              <div className="flex items-center gap-1 text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
                                <span className="text-sm font-medium">Lihat Detail</span>
                                <ArrowRight className="action-arrow w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="floating-decoration absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100"></div>
                    <div className="floating-decoration absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-secondary-100/50 to-primary-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        {showControls && events.length > 1 && (
          <>
            {/* Previous/Next Buttons */}
            <button
              onClick={goToPrevious}
              className="carousel-nav-button absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-secondary-800 rounded-full shadow-lg flex items-center justify-center z-10 backdrop-blur-sm"
              aria-label="Previous event"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="carousel-nav-button absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-secondary-800 rounded-full shadow-lg flex items-center justify-center z-10 backdrop-blur-sm"
              aria-label="Next event"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {events.length > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary-600 scale-125'
                  : 'bg-secondary-300 hover:bg-primary-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Event Counter */}
      {events.length > 1 && (
        <div className="text-center mt-4">
          <span className="text-sm text-secondary-500">
            {currentIndex + 1} dari {events.length} acara
          </span>
        </div>
      )}

      {/* Show More Button */}
      <div className="text-center mt-8 sm:mt-12">
        <a
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
        >
          <Users className="w-5 h-5" />
          <span>Lihat Semua Acara</span>
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
        </a>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default EventCardCarousel;