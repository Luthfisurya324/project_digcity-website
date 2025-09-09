import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Clock } from 'lucide-react';
import { type News } from '../../lib/supabase';

interface RelatedArticlesProps {
  articles: News[];
  currentArticleId: string;
  maxArticles?: number;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ 
  articles, 
  currentArticleId, 
  maxArticles = 3 
}) => {
  // Filter out current article and limit to max articles
  const relatedArticles = articles
    .filter(article => article.id !== currentArticleId)
    .slice(0, maxArticles);

  if (relatedArticles.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <section className="bg-white border-t border-secondary-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-4">
            Artikel Terkait
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Temukan artikel menarik lainnya seputar bisnis digital, teknologi, dan kegiatan DIGCITY
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {relatedArticles.map((article) => {
            const slug = generateSlug(article.title);
            const readingTime = calculateReadingTime(article.content);

            return (
              <article 
                key={article.id} 
                className="bg-secondary-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {article.image_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-4 sm:p-6">
                  {/* Article Meta */}
                  <div className="flex items-center justify-between mb-3 text-xs text-secondary-500">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.published_date)}</span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-lg font-bold text-secondary-900 mb-3 line-clamp-2 leading-tight">
                    <Link 
                      to={`/blog/${slug}`}
                      className="hover:text-primary-600 transition-colors duration-200"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  {/* Article Excerpt */}
                  <p className="text-sm text-secondary-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Article Stats */}
                  <div className="flex items-center justify-between mb-4 text-xs text-secondary-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{readingTime} menit baca</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      <span>Dibaca</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-secondary-200 text-secondary-700 text-xs px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="inline-block bg-secondary-200 text-secondary-700 text-xs px-2 py-1 rounded">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Read More Link */}
                  <Link
                    to={`/blog/${slug}`}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
                  >
                    Baca Selengkapnya
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Articles CTA */}
        <div className="text-center mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
          >
            Lihat Semua Artikel
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
