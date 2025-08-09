import React, { useState, useEffect } from 'react';
import { newsAPI, type News } from '../lib/supabase';

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const news = await newsAPI.getAll();
      setBlogPosts(news);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Static fallback data if no data from Supabase
  const fallbackPosts: News[] = [
    {
      id: '1',
      title: "DIGCITY Raih Juara 1 Kompetisi Business Plan Nasional",
      content: "Tim DIGCITY berhasil meraih juara pertama dalam kompetisi business plan tingkat nasional dengan inovasi platform e-commerce untuk UMKM. Pencapaian ini merupakan hasil kerja keras tim yang terdiri dari mahasiswa terbaik dari berbagai jurusan.",
      excerpt: "Tim DIGCITY berhasil meraih juara pertama dalam kompetisi business plan tingkat nasional dengan inovasi platform e-commerce untuk UMKM.",
      published_date: "2024-01-15",
      author: "Admin DIGCITY",
      category: "Prestasi",
      tags: ['kompetisi', 'prestasi', 'business plan'],
      image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z"
    }
  ];

  // Use Supabase data if available, otherwise use fallback
  const displayPosts = blogPosts.length > 0 ? blogPosts : fallbackPosts;

  // Filter posts by category
  const filteredPosts = selectedCategory === 'Semua' 
    ? displayPosts 
    : displayPosts.filter(post => post.category === selectedCategory);

  // Get unique categories
  const categories = ['Semua', ...Array.from(new Set(displayPosts.map(post => post.category)))];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Memuat berita...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Berita & Artikel
            </h1>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              Ikuti perkembangan terbaru DIGCITY, prestasi anggota, dan berbagai kegiatan organisasi
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-colors duration-200 shadow-sm ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-700 hover:bg-primary-600 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-primary-100 text-primary-600 text-xs px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-secondary-500">{formatDate(post.published_date)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-secondary-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-500">Oleh {post.author}</span>
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Berlangganan Newsletter
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Dapatkan update terbaru tentang kegiatan DIGCITY langsung di email Anda
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-300 focus:outline-none"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200">
                Berlangganan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;