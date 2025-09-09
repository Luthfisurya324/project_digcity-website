import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, BookOpen, Eye, Heart } from 'lucide-react';
import { newsAPI, type News } from '../../lib/supabase';
import { useSEO } from '../../hooks/useSEO';
import RelatedArticles from '../../components/ui/RelatedArticles';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SocialShare from '../../components/ui/SocialShare';
import '../../styles/blog.css';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<News[]>([]);
  const [readingTime, setReadingTime] = useState(0);

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
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-secondary-50">
      {/* Breadcrumb Navigation */}
      <Breadcrumb />
      
      {/* Back Button */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Blog
          </button>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="inline-block bg-primary-100 text-primary-600 text-sm px-4 py-2 rounded-full font-medium">
            {article.category}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight break-words">
          {article.title}
        </h1>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 text-sm text-secondary-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.published_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{readingTime} menit baca</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Dibaca</span>
          </div>
        </div>

        {/* Article Image */}
        {article.image_url && (
          <div className="mb-8">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="blog-content mb-8">
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-secondary-100 text-secondary-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="flex items-center justify-between py-6 border-t border-secondary-200">
          <div className="flex items-center gap-2 text-secondary-600">
            <Heart className="w-5 h-5" />
            <span className="text-sm">Bagikan artikel ini</span>
          </div>
          <SocialShare
            url={window.location.href}
            title={article.title}
            description={article.excerpt}
            hashtags={article.tags}
          />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <RelatedArticles 
          articles={relatedArticles}
          currentArticleId={article.id}
          maxArticles={3}
        />
      )}

      {/* Newsletter CTA */}
      <section className="bg-primary-600 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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