import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsAPI, newsletterAPI, type News } from '../lib/supabase';

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Pagination states
  const [displayedPosts, setDisplayedPosts] = useState<News[]>([]);
  const [postsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
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
      // Initialize displayed posts with first page
      const initialPosts = news.slice(0, postsPerPage);
      setDisplayedPosts(initialPosts);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts by category
  const filteredPosts = selectedCategory === 'Semua' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Get displayed posts based on current filter and pagination
  const currentDisplayedPosts = selectedCategory === 'Semua' 
    ? displayedPosts 
    : filteredPosts.slice(0, currentPage * postsPerPage);

  // Check if there are more posts to load
  const hasMorePosts = filteredPosts.length > currentDisplayedPosts.length;

  // Load more posts function
  const loadMorePosts = useCallback(async () => {
    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = currentPage + 1;
      
      if (selectedCategory === 'Semua') {
        const startIndex = currentPage * postsPerPage;
        const endIndex = nextPage * postsPerPage;
        const newPosts = blogPosts.slice(startIndex, endIndex);
        setDisplayedPosts(prev => [...prev, ...newPosts]);
      }
      
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 500); // Small delay to show loading state
  }, [currentPage, selectedCategory, blogPosts, postsPerPage]);

  // Reset pagination when category changes
  useEffect(() => {
    if (selectedCategory === 'Semua') {
      setDisplayedPosts(blogPosts.slice(0, postsPerPage));
    }
    setCurrentPage(1);
  }, [selectedCategory, blogPosts, postsPerPage]);

  // Get unique categories
  const categories = ['Semua', ...Array.from(new Set(blogPosts.map(post => post.category)))]

  const formatCategoryName = (category: string): string => {
    const map: Record<string, string> = {
      business: 'Business & Entrepreneurship',
      technology: 'Technology & Innovation',
      education: 'Education & Training',
      workshop: 'Workshop & Skills',
      seminar: 'Seminar & Conference',
      networking: 'Networking & Community',
      startup: 'Startup & Innovation',
      digital_marketing: 'Digital Marketing',
      finance: 'Finance & Investment',
      healthcare: 'Healthcare & Wellness',
      creative: 'Creative & Design',
      sports: 'Sports & Fitness',
      culture: 'Culture & Arts',
      environment: 'Environment & Sustainability',
      social_impact: 'Social Impact & Charity',
      general: 'General'
    }
    return map[category] || category
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Newsletter subscription handler
  const handleNewsletterSubscription = useCallback(async (e: React.FormEvent) => {
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
  }, [email]);

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-secondary-200 text-secondary-700 text-sm mb-4">
                <Newspaper className="w-4 h-4 text-primary-500" />
                News & Articles
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary-900 mb-6">
                Berita & Artikel
              </h1>
              <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
                Ikuti perkembangan terbaru DIGCITY, prestasi anggota, dan berbagai kegiatan organisasi
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
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`interactive-element px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full transition-colors duration-200 shadow-sm ${
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
      <section className="pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentDisplayedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {currentDisplayedPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 sm:h-52 object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                    <span className="inline-block bg-primary-100 text-primary-600 text-xs px-3 py-1 rounded-full font-medium w-fit">
                      {post.category}
                    </span>
                    <span className="text-xs sm:text-sm text-secondary-500">{formatDate(post.published_date)}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-secondary-900 mb-3 line-clamp-2 break-words">
                    {post.title}
                  </h2>
                  <p className="text-sm sm:text-base text-secondary-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs sm:text-sm text-secondary-500">Oleh {post.author}</span>
                    <Link 
                      to={`/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                      className="interactive-element text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm text-left sm:text-right"
                    >
                      Baca Selengkapnya →
                    </Link>
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

          {/* Load More Button - only show if there are more posts to load */}
          {hasMorePosts && (
            <div className="text-center mt-8 sm:mt-12">
              <button 
                onClick={loadMorePosts}
                disabled={loadingMore}
                className="interactive-element bg-primary-600 text-white px-6 sm:px-8 py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 w-full sm:w-auto max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Memuat...</span>
                  </div>
                ) : (
                  'Muat Lebih Banyak'
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Berlangganan Newsletter
            </h2>
            <p className="text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Dapatkan update terbaru tentang kegiatan DIGCITY langsung di email Anda
            </p>
            <form onSubmit={handleNewsletterSubscription} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  disabled={isSubscribing}
                  className="interactive-element flex-1 px-4 py-3 text-sm sm:text-base rounded-lg border-0 focus:ring-2 focus:ring-primary-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="interactive-element bg-white text-primary-600 px-6 py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] sm:min-w-[140px] whitespace-nowrap"
                >
                  {isSubscribing ? 'Memproses...' : 'Berlangganan'}
                </button>
              </div>
              
              {/* Subscription message */}
              {subscriptionMessage && (
                <div className={`text-center text-xs sm:text-sm p-3 rounded-lg mx-4 sm:mx-0 ${
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