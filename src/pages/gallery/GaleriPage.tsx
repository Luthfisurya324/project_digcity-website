import React, { useState, useEffect, useCallback } from 'react';
import { galleryAPI, type Gallery } from '../../lib/supabase';
import { Camera } from 'lucide-react';

const GaleriPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = useCallback(async () => {
    try {
      const galleryData = await galleryAPI.getAll();
      setGalleryItems(galleryData);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  }, []);


  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  // Use only Supabase data - no fallback dummy data
  const currentGallery = galleryItems;
  
  const categoryDisplayNames: Record<string, string> = {
    digimon: 'DIGIMON',
    levelup: 'Level Up Day',
    scbd: 'SCBD',
    merchandise: 'Merchandise',
    networking: 'Networking',
    social_impact: 'Social Impact',
    workshop: 'Workshop',
    seminar: 'Seminar',
    competition: 'Kompetisi',
    social: 'Social Activity'
  };

  const formatCategoryName = (cat: string) => {
    if (categoryDisplayNames[cat]) return categoryDisplayNames[cat];
    return cat.split(/[_-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const categories = [
    { id: 'Semua', name: 'Semua' },
    ...Array.from(new Set(currentGallery.map(item => item.category))).map(cat => ({
      id: cat,
      name: formatCategoryName(cat)
    }))
  ];
  
  const filteredItems = selectedCategory === 'Semua' 
    ? currentGallery 
    : currentGallery.filter(item => item.category === selectedCategory);

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pt-28 md:pb-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-secondary-200 text-secondary-700 text-sm mb-4">
                <Camera className="w-4 h-4 text-primary-500" />
                Gallery
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900 mb-6">
                Galeri DIGCITY
              </h1>
              <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
                Dokumentasi perjalanan dan pencapaian dalam membangun ekosistem bisnis digital yang berdampak
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`interactive-element px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full transition-colors duration-200 shadow-sm border ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-secondary-700 border-gray-200 hover:bg-primary-600 hover:text-white hover:border-primary-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section id="gallery-grid" className="pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative bg-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer aspect-[4/3]"
                    onClick={() => setSelectedImage(item.image_url)}
                  >
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-2 w-fit ${
                        item.category === 'digimon' ? 'bg-blue-600' :
                        item.category === 'levelup' ? 'bg-orange-600' :
                        item.category === 'scbd' ? 'bg-indigo-600' :
                        item.category === 'social_impact' ? 'bg-green-600' :
                        'bg-primary-600'
                      }`}>
                          {categories.find(cat => cat.id === item.category)?.name || item.category}
                        </span>
                      <h3 className="text-white font-bold text-lg line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada foto ditemukan</h3>
                  <p className="text-gray-500">Belum ada dokumentasi untuk kategori yang dipilih.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal untuk gambar yang dipilih */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="relative max-w-6xl max-h-full w-full flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Gallery item"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriPage;