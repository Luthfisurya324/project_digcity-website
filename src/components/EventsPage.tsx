import React, { useState, useEffect } from 'react';
import { eventAPI, type Event } from '../lib/supabase';
import { Calendar, MapPin } from 'lucide-react';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');


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
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Memuat events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header Section */}
      <section className="relative bg-white py-16 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 w-full h-full text-secondary-100">
            <defs>
              <pattern id="gridEvents" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridEvents)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/60 to-secondary-50/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Acara & Kegiatan
            </h1>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto mb-8">
              Ikuti berbagai acara menarik yang diselenggarakan oleh DIGCITY untuk mengembangkan skill dan networking
            </p>
            
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-secondary-700 self-center mr-2">Kategori:</span>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-secondary-700 border-secondary-200 hover:bg-primary-600 hover:text-white hover:border-primary-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Acara & Kegiatan</h2>
          
          {filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block bg-primary-100 text-primary-600 text-xs px-3 py-1 rounded-full font-medium">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-secondary-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">Tidak ada acara yang ditemukan untuk kategori ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ingin Mengadakan Acara Bersama?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk berkolaborasi dalam mengadakan acara atau workshop yang bermanfaat
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200">
            Hubungi Kami
          </button>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;