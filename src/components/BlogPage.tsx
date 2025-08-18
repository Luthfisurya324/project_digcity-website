import React, { useState, useEffect } from 'react';
import { newsAPI, newsletterAPI, type News } from '../lib/supabase';

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Newsletter states
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'success' | 'error' | null>(null);

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

  // Use only Supabase data - no fallback dummy data
  const displayPosts = blogPosts;

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

  // Newsletter subscription handler
  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionMessage('Silakan masukkan email Anda');
      setSubscriptionStatus('error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionMessage('Format email tidak valid');
      setSubscriptionStatus('error');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage('');
    setSubscriptionStatus(null);

    try {
      await newsletterAPI.subscribe(email);
      setSubscriptionMessage('Terima kasih! Anda berhasil berlangganan newsletter DIGCITY.');
      setSubscriptionStatus('success');
      setEmail('');
    } catch (error: any) {
      setSubscriptionMessage(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Clear subscription message after 5 seconds
  useEffect(() => {
    if (subscriptionMessage) {
      const timer = setTimeout(() => {
        setSubscriptionMessage('');
        setSubscriptionStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionMessage]);

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
          {filteredPosts.length > 0 ? (
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
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Belum Ada Berita</h3>
                <p className="text-secondary-600">Saat ini belum ada berita yang tersedia. Silakan kembali lagi nanti untuk update terbaru dari DIGCITY.</p>
              </div>
            </div>
          )}

          {/* Load More Button - only show if there are posts */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200">
                Muat Lebih Banyak
              </button>
            </div>
          )}
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
            <form onSubmit={handleNewsletterSubscription} className="max-w-md mx-auto">
              <div className="flex gap-4 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                >
                  {isSubscribing ? 'Memproses...' : 'Berlangganan'}
                </button>
              </div>
              
              {/* Subscription message */}
              {subscriptionMessage && (
                <div className={`text-center text-sm p-3 rounded-lg ${
                  subscriptionStatus === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {subscriptionMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;