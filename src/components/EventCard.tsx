import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { eventAPI, type Event } from '../lib/supabase';
import EventDetailModal from './EventDetailModal';
import '../styles/eventCard.css';

interface EventCardProps {
  maxEvents?: number;
  showTitle?: boolean;
  className?: string;
  autoRefresh?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  maxEvents = 6,
  showTitle = true,
  className = '',
  autoRefresh = true
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const refreshTimeoutRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

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

  // Load events on component mount
  useEffect(() => {
    setLoading(true);
    fetchEvents(1);
    
    return () => {
      if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
      if (retryTimeoutRef.current) window.clearTimeout(retryTimeoutRef.current);
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

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        {showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Acara Mendatang
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-48 skeleton"></div>
              <div className="p-6">
                <div className="h-4 skeleton rounded mb-2"></div>
                <div className="h-6 skeleton rounded mb-4"></div>
                <div className="h-4 skeleton rounded mb-2"></div>
                <div className="h-4 skeleton rounded w-3/4"></div>
              </div>
            </div>
          ))}
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
              Acara Mendatang
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
              Acara Mendatang
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

  return (
    <div className={`w-full ${className}`}>
      {showTitle && (
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 mb-4">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-700">Acara Terbaru</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Acara Mendatang
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto mb-6">
            Jangan lewatkan berbagai acara menarik dari DIGCITY. Bergabunglah dengan komunitas digital business yang dinamis!
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {events.map((event, index) => {
          const { date, time, dayName } = formatEventDateTime(event.date);
          const isUpcoming = isUpcomingEvent(event.date);
          const categoryColor = getCategoryColor(event.category);
          
          return (
            <div
              key={event.id}
              className={`event-card event-card-animate group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer ${
                hoveredCard === event.id ? 'scale-105' : ''
              }`}
              onClick={() => handleEventClick(event)}
              onMouseEnter={() => setHoveredCard(event.id)}
              onMouseLeave={() => setHoveredCard(null)}
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
              {/* Upcoming Event Badge */}
              {isUpcoming && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="upcoming-badge event-badge inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-full shadow-lg">
                    <Zap className="w-3 h-3" />
                    <span>Segera</span>
                  </div>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`event-badge inline-flex items-center px-3 py-1 bg-gradient-to-r ${categoryColor} text-white text-xs font-medium rounded-full shadow-lg`}>
                  {formatCategoryName(event.category)}
                </div>
              </div>

              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="event-image w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
                    <Calendar className="w-16 h-16 text-white/80" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Hover Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ArrowRight className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                {/* Date and Time */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-primary-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{dayName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{time}</span>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="event-title text-lg font-bold text-secondary-900 mb-3 line-clamp-2">
                  {event.title}
                </h3>

                {/* Event Description */}
                <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Location and Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary-500">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary-500">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{date}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-4 border-t border-secondary-100">
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

              {/* Decorative Elements */}
              <div className="floating-decoration absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100"></div>
              <div className="floating-decoration absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-secondary-100/50 to-primary-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100"></div>
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      {events.length >= maxEvents && (
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
      )}

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

export default EventCard;