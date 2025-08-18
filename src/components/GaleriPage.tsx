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

  // Use only Supabase data - no fallback dummy data
  const currentGallery = galleryItems;
  
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
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/25 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 border border-white/30 rounded-full"></div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Galeri <span className="text-primary-200">DIGCITY</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Dokumentasi perjalanan dan pencapaian dalam membangun ekosistem bisnis digital yang berdampak
          </p>
          
          <button 
            onClick={() => document.getElementById('gallery-grid')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center bg-white text-primary-600 px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:bg-primary-50 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Jelajahi Galeri
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Pencapaian DIGCITY
              </h2>
              <p className="text-primary-100 max-w-xl mx-auto">
                Dokumentasi perjalanan dalam membangun ekosistem bisnis digital
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3 group-hover:bg-white/20 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">25+</div>
                  <div className="text-primary-100 text-sm md:text-base">Program Kegiatan</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3 group-hover:bg-white/20 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">300+</div>
                  <div className="text-primary-100 text-sm md:text-base">Peserta Terlibat</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3 group-hover:bg-white/20 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">8</div>
                  <div className="text-primary-100 text-sm md:text-base">Level Up Day</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3 group-hover:bg-white/20 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">2</div>
                  <div className="text-primary-100 text-sm md:text-base">DIGIMON</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Kategori Galeri</h3>
            <p className="text-gray-600 text-sm">Pilih kategori untuk melihat foto-foto spesifik</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white border-primary-600 shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 shadow-sm hover:shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section id="gallery-grid" className="py-16">
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
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              Bergabunglah dalam berbagai program unggulan DIGCITY untuk mengembangkan potensi bisnis digital Anda dan memperluas jaringan profesional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">DIGIMON 2025</h3>
              <p className="text-secondary-600 text-sm mb-3">Maret 2025</p>
              <p className="text-secondary-600 text-sm">Kompetisi bisnis digital terbesar yang menghadirkan inovasi dan kolaborasi mahasiswa</p>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Level Up Day: AI & Business</h3>
              <p className="text-secondary-600 text-sm mb-3">Februari 2025</p>
              <p className="text-secondary-600 text-sm">Workshop intensif pengembangan skill AI untuk transformasi bisnis digital</p>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">SCBD: Startup Mentoring</h3>
              <p className="text-secondary-600 text-sm mb-3">Januari 2025</p>
              <p className="text-secondary-600 text-sm">Program mentoring komprehensif untuk pengembangan startup dan bisnis digital</p>
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