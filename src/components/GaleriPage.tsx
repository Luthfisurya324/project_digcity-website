import React, { useState, useEffect } from 'react';
import { galleryAPI, type Gallery } from '../lib/supabase';

const GaleriPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const galleryData = await galleryAPI.getAll();
      setGalleryItems(galleryData);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Static fallback data if no data from Supabase
  const fallbackGallery: Gallery[] = [
    {
      id: '1',
      title: 'DIGIMON: Digital Business Competition',
      category: 'digimon',
      event_date: '2024-03-15',
      description: 'Kompetisi bisnis digital terbesar DIGCITY dengan hadiah jutaan rupiah',
      image_url: '/images/digimon-2024.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Level Up Day: Digital Marketing',
      category: 'levelup',
      event_date: '2024-02-22',
      description: 'Program peningkatan skill digital marketing untuk mahasiswa',
      image_url: '/images/levelup-marketing.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      title: 'SCBD: Startup Clinic Business Development',
      category: 'scbd',
      event_date: '2024-01-10',
      description: 'Klinik konsultasi dan pengembangan bisnis startup',
      image_url: '/images/scbd-clinic.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '4',
      title: 'DIGCITY Merchandise Launch',
      category: 'merchandise',
      event_date: '2023-12-05',
      description: 'Peluncuran merchandise resmi DIGCITY dengan desain eksklusif',
      image_url: '/images/merchandise-launch.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '5',
      title: 'Industry Partnership Forum',
      category: 'networking',
      event_date: '2023-11-18',
      description: 'Forum kemitraan dengan industri digital dan startup',
      image_url: '/images/partnership-forum.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '6',
      title: 'Level Up Day: E-commerce Strategy',
      category: 'levelup',
      event_date: '2023-10-25',
      description: 'Workshop strategi e-commerce untuk mahasiswa entrepreneur',
      image_url: '/images/levelup-ecommerce.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '7',
      title: 'DIGIMON Bootcamp',
      category: 'digimon',
      event_date: '2023-09-12',
      description: 'Bootcamp persiapan kompetisi DIGIMON dengan mentor berpengalaman',
      image_url: '/images/digimon-bootcamp.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '8',
      title: 'DIGCITY Alumni Gathering',
      category: 'networking',
      event_date: '2023-08-08',
      description: 'Pertemuan alumni DIGCITY untuk berbagi pengalaman dan networking',
      image_url: '/images/alumni-gathering.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '9',
      title: 'SCBD: Digital Transformation Workshop',
      category: 'scbd',
      event_date: '2023-07-20',
      description: 'Workshop transformasi digital untuk UMKM dan startup',
      image_url: '/images/scbd-transformation.jpg',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    }
  ];

  const currentGallery = galleryItems.length > 0 ? galleryItems : fallbackGallery;
  
  const categories = [
    { id: 'Semua', name: 'Semua' },
    ...Array.from(new Set(currentGallery.map(item => item.category))).map(cat => ({
      id: cat,
      name: cat === 'digimon' ? 'DIGIMON' : 
           cat === 'levelup' ? 'Level Up Day' :
           cat === 'scbd' ? 'SCBD' :
           cat === 'merchandise' ? 'Merchandise' :
           cat === 'networking' ? 'Networking' : cat
    }))
  ];
  
  const filteredItems = selectedCategory === 'Semua' 
    ? currentGallery 
    : currentGallery.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workshop': return 'bg-primary-100 text-primary-800';
      case 'seminar': return 'bg-secondary-100 text-secondary-800';
      case 'competition': return 'bg-accent-100 text-accent-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'networking': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Galeri DIGCITY
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Dokumentasi perjalanan dan pencapaian DIGCITY melalui berbagai kegiatan dan program yang telah dilaksanakan
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">25+</div>
              <div className="text-secondary-600">Program</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600 mb-2">500+</div>
              <div className="text-secondary-600">Peserta</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">10+</div>
              <div className="text-secondary-600">Level Up Day</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5+</div>
              <div className="text-secondary-600">DIGIMON</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-secondary-700 hover:bg-primary-50 hover:text-primary-600 shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 cursor-pointer"
                         onClick={() => setSelectedImage(item.image_url)}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {categories.find(cat => cat.id === item.category)?.name || item.category}
                        </span>
                      </div>

                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-secondary-500 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(item.event_date)}
                      </div>
                      <h3 className="text-lg font-bold text-secondary-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-secondary-600 text-sm mb-4">
                        {item.description}
                      </p>
                      <button 
                        onClick={() => setSelectedImage(item.image_url)}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                      >
                        Lihat Detail
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">Tidak ada foto untuk kategori ini</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Kegiatan Mendatang
            </h2>
            <p className="text-lg text-secondary-600">
              Jangan lewatkan kegiatan-kegiatan menarik yang akan datang
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">DIGIMON 2025</h3>
              <p className="text-secondary-600 text-sm mb-3">Maret 2025</p>
              <p className="text-secondary-600 text-sm">Kompetisi bisnis digital terbesar tahun ini</p>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Level Up Day: AI & Business</h3>
              <p className="text-secondary-600 text-sm mb-3">Februari 2025</p>
              <p className="text-secondary-600 text-sm">Workshop AI untuk pengembangan bisnis</p>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">SCBD: Startup Mentoring</h3>
              <p className="text-secondary-600 text-sm mb-3">Januari 2025</p>
              <p className="text-secondary-600 text-sm">Program mentoring untuk startup pemula</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal untuk gambar yang dipilih */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Gallery item"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriPage;