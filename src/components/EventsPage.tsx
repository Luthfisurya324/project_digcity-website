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

  // Static fallback data if no data from Supabase
  const fallbackEvents: Event[] = [
    {
      id: '1',
      title: "Digital Business Summit 2024",
      description: "Summit tahunan yang membahas tren terbaru dalam bisnis digital, menghadirkan pembicara dari industri teknologi terkemuka.",
      date: "2024-02-25",
      location: "Aula Utama UIKA Bogor",
      category: "Summit",
      image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z"
    },
    {
      id: '2',
      title: "Workshop E-Commerce Strategy",
      description: "Workshop praktis tentang strategi e-commerce untuk UMKM, mulai dari setup toko online hingga digital marketing.",
      date: "2024-02-15",
      location: "Lab Komputer Gedung B",
      category: "Workshop",
      image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-10T00:00:00Z"
    },
    {
      id: '3',
      title: "Startup Pitch Competition",
      description: "Kompetisi pitch startup untuk mahasiswa dengan hadiah total 50 juta rupiah dan mentoring dari investor.",
      date: "2024-02-10",
      location: "Auditorium UIKA Bogor",
      category: "Kompetisi",
      image_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop",
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-05T00:00:00Z"
    },
    {
      id: '4',
      title: "Networking Night: Meet the Alumni",
      description: "Acara networking dengan alumni DIGCITY yang sukses di berbagai bidang bisnis digital dan teknologi.",
      date: "2024-02-05",
      location: "Hotel Santika Bogor",
      category: "Networking",
      image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: '5',
      title: "Digital Marketing Bootcamp",
      description: "Bootcamp intensif 3 hari tentang digital marketing, SEO, social media marketing, dan Google Ads.",
      date: "2024-01-28",
      location: "Ruang Seminar Gedung C",
      category: "Bootcamp",
      image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      created_at: "2023-12-20T00:00:00Z",
      updated_at: "2023-12-20T00:00:00Z"
    },
    {
      id: '6',
      title: "Tech Talk: AI in Business",
      description: "Diskusi tentang implementasi artificial intelligence dalam bisnis modern dan peluang karir di bidang AI.",
      date: "2024-01-20",
      location: "Online via Zoom",
      category: "Tech Talk",
      image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      created_at: "2023-12-15T00:00:00Z",
      updated_at: "2023-12-15T00:00:00Z"
    }
  ];



  // Use fallback data if no events from API
  const displayEvents = events.length > 0 ? events : fallbackEvents;
  
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