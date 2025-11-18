import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, BookOpen, Heart, Share2 } from 'lucide-react';
import { newsAPI, type News } from '../../lib/supabase';
import { useSEO } from '../../hooks/useSEO';
import RelatedArticles from '../../components/ui/RelatedArticles';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SocialShare from '../../components/ui/SocialShare';
import '../../styles/blog.css';

const FONT_SIZE_STORAGE_KEY = 'digcity_blog_font_size';
const FONT_SIZE_MIN = 90;
const FONT_SIZE_MAX = 125;
const FONT_SIZE_STEP = 5;

const clampFontSize = (value: number) => Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, value));

const getInitialFontSize = () => {
  if (typeof window === 'undefined') return 100;
  const storedValue = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
  if (!storedValue) return 100;
  const parsed = parseInt(storedValue, 10);
  return Number.isNaN(parsed) ? 100 : clampFontSize(parsed);
};

type BlogContentStyle = React.CSSProperties & {
  '--blog-font-scale'?: string;
};

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<News[]>([]);
  const [readingTime, setReadingTime] = useState(0);
  const [fontSizePercent, setFontSizePercent] = useState<number>(() => getInitialFontSize());
  const fontScale = fontSizePercent / 100;
  const blogContentStyle = useMemo<BlogContentStyle>(() => ({
    '--blog-font-scale': fontScale.toString()
  }), [fontScale]);

  const handleFontSizeChange = (value: number) => {
    setFontSizePercent(clampFontSize(value));
  };

  const handleFontSizeReset = () => {
    setFontSizePercent(100);
  };

  const FontSizeControls = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-secondary-900">Sesuaikan Ukuran Teks</p>
          <p className="text-xs text-secondary-500">Atur kenyamanan membaca Anda</p>
        </div>
        <span className="text-sm font-semibold text-secondary-900">{fontSizePercent}%</span>
      </div>
      <input
        type="range"
        min={FONT_SIZE_MIN}
        max={FONT_SIZE_MAX}
        step={FONT_SIZE_STEP}
        value={fontSizePercent}
        onChange={(event) => handleFontSizeChange(Number(event.target.value))}
        className="w-full accent-primary-600"
        aria-label="Atur ukuran teks artikel"
      />
      <div className="flex justify-between text-secondary-500 text-xs mt-3">
        <span className="text-sm font-semibold">Aa</span>
        <span className="text-lg font-semibold">Aa</span>
      </div>
      {fontSizePercent !== 100 && (
        <button
          type="button"
          onClick={handleFontSizeReset}
          className="mt-4 text-xs font-semibold text-primary-600 hover:text-primary-700"
        >
          Reset ukuran teks
        </button>
      )}
    </>
  );

  // Share tracking
  const shareOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://digcity.my.id';
  const shareUrl = slug ? `${shareOrigin}/blog/${slug}` : shareOrigin;
  const [shareCount, setShareCount] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isCancelled = false;

    const fetchShareCount = async () => {
      try {
        const response = await fetch(`https://api.countapi.xyz/get/digcity-share/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch share count');
        const data = await response.json();
        if (!isCancelled) {
          setShareCount(typeof data.value === 'number' ? data.value : 0);
        }
      } catch (error) {
        console.warn('Unable to fetch share count', error);
        if (!isCancelled) {
          setShareCount(null);
        }
      }
    };

    fetchShareCount();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSizePercent.toString());
  }, [fontSizePercent]);

  const recordShare = useCallback(async () => {
    if (!slug) return;
    try {
      const response = await fetch(`https://api.countapi.xyz/hit/digcity-share/${slug}`);
      if (!response.ok) throw new Error('Failed to increment share count');
      const data = await response.json();
      setShareCount(typeof data.value === 'number' ? data.value : null);
    } catch (error) {
      console.warn('Unable to record share event', error);
    }
  }, [slug]);

  // SEO hook
  useSEO({
    title: article ? `${article.title} - Blog DIGCITY` : 'Artikel - Blog DIGCITY',
    description: article?.excerpt || 'Baca artikel menarik seputar bisnis digital dan teknologi dari DIGCITY',
    keywords: article ? `${article.tags.join(', ')}, ${article.category}, DIGCITY, blog, artikel` : 'blog DIGCITY, artikel, berita',
    ogImage: article?.image_url,
    canonicalUrl: `https://digcity.my.id/blog/${slug}`,
    structuredData: article ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: article.image_url ? `https://digcity.my.id${article.image_url}` : undefined,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'DIGCITY',
        logo: {
          '@type': 'ImageObject',
          url: 'https://digcity.my.id/logo_digcity.png'
        }
      },
      datePublished: article.published_date,
      dateModified: article.updated_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://digcity.my.id/blog/${slug}`
      },
      articleSection: article.category,
      keywords: article.tags.join(', '),
      wordCount: article.content.split(' ').length
    } : undefined
  });

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load article by slug (we'll need to modify the API to support slug)
      const articles = await newsAPI.getAll();
      const foundArticle = articles.find(art => 
        art.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') === slug
      );
      
      if (foundArticle) {
        setArticle(foundArticle);
        calculateReadingTime(foundArticle.content);
        loadRelatedArticles(foundArticle);
      } else {
        setError('Artikel tidak ditemukan');
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setError('Terjadi kesalahan saat memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const time = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(time);
  };

  const loadRelatedArticles = async (currentArticle: News) => {
    try {
      const allArticles = await newsAPI.getAll();
      const related = allArticles
        .filter(art => 
          art.id !== currentArticle.id && 
          (art.category === currentArticle.category || 
           art.tags.some(tag => currentArticle.tags.includes(tag)))
        )
        .slice(0, 3);
      setRelatedArticles(related);
    } catch (err) {
      console.error('Error loading related articles:', err);
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



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-secondary-600 mb-6">{error || 'Artikel yang Anda cari tidak tersedia.'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
          >
            Kembali ke Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-secondary-50">
      <Breadcrumb />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pb-20 space-y-6">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke blog
          </button>

          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
            <span>Blog</span>
            <span className="opacity-60">•</span>
            <span>{article.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">{article.title}</h1>

          {article.excerpt && (
            <p className="text-white/80 text-base sm:text-lg max-w-3xl">{article.excerpt}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {readingTime} menit baca
            </span>
                {shareCount !== null && (
                  <span className="inline-flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    {shareCount} {shareCount === 1 ? 'kali dibagikan' : 'kali dibagikan'}
                  </span>
                )}
          </div>
        </div>
      </section>

      {/* Article */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 lg:-mt-16 pb-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary-100">
          {article.image_url && (
            <div className="w-full">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-72 sm:h-[420px] object-cover"
              />
            </div>
          )}

          <div className="lg:hidden border-b border-secondary-100 px-6 sm:px-8 py-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary-100">
              <FontSizeControls />
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(250px,1fr)]">
            <div className="p-6 sm:p-10 space-y-10">
              <div
                className="blog-content text-lg leading-relaxed text-secondary-900"
                style={blogContentStyle}
              >
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="border-t border-secondary-100 pt-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-secondary-400 mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-50 text-secondary-700 text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="bg-secondary-50 p-6 sm:p-8 flex flex-col gap-8 border-t lg:border-t-0 lg:border-l border-secondary-100">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-secondary-400">Bagikan</p>
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-secondary-500" />
                  <span className="text-secondary-700 text-sm">Bantu artikel ini menjangkau pembaca lain.</span>
                </div>
                <SocialShare
                  url={shareUrl}
                  title={article.title}
                  description={article.excerpt}
                  hashtags={article.tags}
                  onShare={recordShare}
                />
              </div>

              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-secondary-400">Informasi Artikel</p>
                <div className="space-y-3 text-sm text-secondary-700">
                  <div>
                    <p className="text-secondary-500 text-xs">Penulis</p>
                    <p className="font-semibold">{article.author}</p>
                  </div>
                  <div>
                    <p className="text-secondary-500 text-xs">Kategori</p>
                    <p className="font-semibold capitalize">{article.category}</p>
                  </div>
                  <div>
                    <p className="text-secondary-500 text-xs">Dipublikasikan</p>
                    <p className="font-semibold">{formatDate(article.published_date)}</p>
                  </div>
                  <div>
                    <p className="text-secondary-500 text-xs">Waktu baca</p>
                    <p className="font-semibold">{readingTime} menit</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary-100 hidden lg:block">
                <FontSizeControls />
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary-100">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">Suka artikelnya?</p>
                    <p className="text-xs text-secondary-500">Bagikan ke media sosial favorit Anda.</p>
                  </div>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full text-primary-600 hover:text-primary-700 text-sm font-semibold"
                >
                  Kembali ke atas
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {relatedArticles.length > 0 && (
        <RelatedArticles 
          articles={relatedArticles}
          currentArticleId={article.id}
          maxArticles={3}
        />
      )}

      <section className="bg-primary-600 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Tetap Update dengan DIGCITY
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Dapatkan artikel terbaru seputar bisnis digital, teknologi, dan kegiatan DIGCITY langsung di email Anda
          </p>
          <Link
            to="/blog"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
          >
            Lihat Semua Artikel
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;