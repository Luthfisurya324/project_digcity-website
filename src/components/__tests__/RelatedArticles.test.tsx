import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RelatedArticles from '../RelatedArticles';
import { type News } from '../../lib/supabase';

// Mock article data
const mockArticles: News[] = [
  {
    id: '1',
    title: 'First Article Title',
    content: 'This is the first article content with many words to test reading time calculation',
    excerpt: 'This is the first article excerpt',
    author: 'Test Author 1',
    published_date: '2025-07-01T00:00:00Z',
    image_url: '/image1.jpg',
    category: 'Technology',
    tags: ['tech', 'digital'],
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Second Article Title',
    content: 'This is the second article content with many words to test reading time calculation',
    excerpt: 'This is the second article excerpt',
    author: 'Test Author 2',
    published_date: '2025-07-02T00:00:00Z',
    image_url: '/image2.jpg',
    category: 'Business',
    tags: ['business', 'startup'],
    created_at: '2025-07-02T00:00:00Z',
    updated_at: '2025-07-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Third Article Title',
    content: 'This is the third article content with many words to test reading time calculation',
    excerpt: 'This is the third article excerpt',
    author: 'Test Author 3',
    published_date: '2025-07-03T00:00:00Z',
    image_url: '/image3.jpg',
    category: 'Technology',
    tags: ['tech', 'innovation'],
    created_at: '2025-07-03T00:00:00Z',
    updated_at: '2025-07-03T00:00:00Z'
  }
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('RelatedArticles', () => {
  it('renders nothing when no articles provided', () => {
    const { container } = renderWithRouter(
      <RelatedArticles articles={[]} currentArticleId="1" />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when only current article provided', () => {
    const { container } = renderWithRouter(
      <RelatedArticles articles={[mockArticles[0]]} currentArticleId="1" />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders related articles section with title and description', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    expect(screen.getByText('Artikel Terkait')).toBeInTheDocument();
    expect(screen.getByText('Temukan artikel menarik lainnya seputar bisnis digital, teknologi, dan kegiatan DIGCITY')).toBeInTheDocument();
  });

  it('filters out current article from related articles', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    // Should not show the first article (current article)
    expect(screen.queryByText('First Article Title')).not.toBeInTheDocument();
    
    // Should show other articles
    expect(screen.getByText('Second Article Title')).toBeInTheDocument();
    expect(screen.getByText('Third Article Title')).toBeInTheDocument();
  });

  it('renders article cards with correct information', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    // Check second article
    expect(screen.getByText('Second Article Title')).toBeInTheDocument();
    expect(screen.getByText('This is the second article excerpt')).toBeInTheDocument();
    expect(screen.getByText('Test Author 2')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    
    // Check third article
    expect(screen.getByText('Third Article Title')).toBeInTheDocument();
    expect(screen.getByText('This is the third article excerpt')).toBeInTheDocument();
    expect(screen.getByText('Test Author 3')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders article images when available', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // Two related articles
    
    expect(images[0]).toHaveAttribute('src', '/image2.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Second Article Title');
    
    expect(images[1]).toHaveAttribute('src', '/image3.jpg');
    expect(images[1]).toHaveAttribute('alt', 'Third Article Title');
  });

  it('renders article tags correctly', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    // Check tags for second article
    expect(screen.getByText('#business')).toBeInTheDocument();
    expect(screen.getByText('#startup')).toBeInTheDocument();
    
    // Check tags for third article
    expect(screen.getByText('#tech')).toBeInTheDocument();
    expect(screen.getByText('#innovation')).toBeInTheDocument();
  });

  it('shows tag count when there are more than 3 tags', () => {
    const articleWithManyTags = {
      ...mockArticles[0],
      id: '4',
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
    };
    
    renderWithRouter(
      <RelatedArticles articles={[articleWithManyTags]} currentArticleId="1" />
    );
    
    expect(screen.getByText('#tag1')).toBeInTheDocument();
    expect(screen.getByText('#tag2')).toBeInTheDocument();
    expect(screen.getByText('#tag3')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument(); // Shows +2 for remaining tags
  });

  it('calculates reading time correctly', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    // Content has 15 words, should be 1 minute at 200 words per minute
    const readingTimes = screen.getAllByText(/menit baca/);
    expect(readingTimes).toHaveLength(2);
    expect(readingTimes[0]).toHaveTextContent('1 menit baca');
    expect(readingTimes[1]).toHaveTextContent('1 menit baca');
  });

  it('formats dates correctly', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    // Should format dates in Indonesian locale
    expect(screen.getByText(/2 Jul 2025/)).toBeInTheDocument(); // Second article
    expect(screen.getByText(/3 Jul 2025/)).toBeInTheDocument(); // Third article
  });

  it('generates correct slugs for article links', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    const links = screen.getAllByText('Baca Selengkapnya');
    expect(links).toHaveLength(2);
    
    // Check that links point to correct URLs
    expect(links[0].closest('a')).toHaveAttribute('href', '/blog/second-article-title');
    expect(links[1].closest('a')).toHaveAttribute('href', '/blog/third-article-title');
  });

  it('renders view all articles CTA button', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    const ctaButton = screen.getByText('Lihat Semua Artikel');
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.closest('a')).toHaveAttribute('href', '/blog');
  });

  it('respects maxArticles prop', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" maxArticles={1} />
    );
    
    // Should only show one related article
    expect(screen.getByText('Second Article Title')).toBeInTheDocument();
    expect(screen.queryByText('Third Article Title')).not.toBeInTheDocument();
  });

  it('applies hover effects and transitions', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    const articleCards = screen.getAllByRole('article');
    expect(articleCards).toHaveLength(2);
    
    // Check that cards have hover effects
    articleCards.forEach(card => {
      expect(card).toHaveClass('hover:shadow-lg', 'transition-all', 'duration-300', 'hover:-translate-y-1');
    });
  });

  it('renders images with lazy loading', () => {
    renderWithRouter(
      <RelatedArticles articles={mockArticles} currentArticleId="1" />
    );
    
    const images = screen.getAllByRole('img');
    images.forEach(image => {
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  it('handles articles without images gracefully', () => {
    const articleWithoutImage = {
      ...mockArticles[0],
      id: '5',
      image_url: undefined
    };
    
    renderWithRouter(
      <RelatedArticles articles={[articleWithoutImage]} currentArticleId="1" />
    );
    
    // Should still render the article card without image
    expect(screen.getByText('First Article Title')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('handles articles without tags gracefully', () => {
    const articleWithoutTags = {
      ...mockArticles[0],
      id: '6',
      tags: []
    };
    
    renderWithRouter(
      <RelatedArticles articles={[articleWithoutTags]} currentArticleId="1" />
    );
    
    // Should render without tags section
    expect(screen.getByText('First Article Title')).toBeInTheDocument();
    expect(screen.queryByText('#')).not.toBeInTheDocument();
  });
});
