import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogPage from '../BlogPage';
import { newsAPI, newsletterAPI } from '../../../lib/supabase';

// Mock the dependencies
jest.mock('../../../lib/supabase');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>
}));

const mockNewsAPI = newsAPI as jest.Mocked<typeof newsAPI>;
const mockNewsletterAPI = newsletterAPI as jest.Mocked<typeof newsletterAPI>;

// Mock article data
const mockArticles = [
  {
    id: '1',
    title: 'First Article Title',
    content: 'This is the first article content',
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
    content: 'This is the second article content',
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
    content: 'This is the third article content',
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

describe('BlogPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNewsAPI.getAll.mockResolvedValue(mockArticles);
    mockNewsletterAPI.subscribe.mockResolvedValue(undefined);
  });

  it('renders loading state initially', () => {
    renderWithRouter(<BlogPage />);
    
    expect(screen.getByText('Memuat berita...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders blog posts when loaded successfully', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText('First Article Title')).toBeInTheDocument();
      expect(screen.getByText('Second Article Title')).toBeInTheDocument();
      expect(screen.getByText('Third Article Title')).toBeInTheDocument();
    });
  });

  it('renders blog header section', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText('Berita & Artikel')).toBeInTheDocument();
      expect(screen.getByText('Ikuti perkembangan terbaru DIGCITY, prestasi anggota, dan berbagai kegiatan organisasi')).toBeInTheDocument();
    });
  });

  it('renders category filter buttons', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText('Semua')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Business')).toBeInTheDocument();
    });
  });

  it('filters articles by category when category button is clicked', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const technologyButton = screen.getByText('Technology');
      fireEvent.click(technologyButton);

      // Should show only technology articles
      expect(screen.getByText('First Article Title')).toBeInTheDocument();
      expect(screen.queryByText('Second Article Title')).not.toBeInTheDocument();
      expect(screen.getByText('Third Article Title')).toBeInTheDocument();
    });
  });

  it('shows all articles when "Semua" category is selected', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const semuaButton = screen.getByText('Semua');
      fireEvent.click(semuaButton);

      // Should show all articles
      expect(screen.getByText('First Article Title')).toBeInTheDocument();
      expect(screen.getByText('Second Article Title')).toBeInTheDocument();
      expect(screen.getByText('Third Article Title')).toBeInTheDocument();
    });
  });

  it('renders article cards with correct information', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      // Check first article
      expect(screen.getByText('First Article Title')).toBeInTheDocument();
      expect(screen.getByText('This is the first article excerpt')).toBeInTheDocument();
      expect(screen.getByText('Test Author 1')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('1 Juli 2025')).toBeInTheDocument();
    });
  });

  it('renders article images when available', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      
      expect(images[0]).toHaveAttribute('src', '/image1.jpg');
      expect(images[0]).toHaveAttribute('alt', 'First Article Title');
    });
  });

  it('renders "Baca Selengkapnya" links for each article', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const readMoreLinks = screen.getAllByText('Baca Selengkapnya →');
      expect(readMoreLinks).toHaveLength(3);
      
      // Check that links point to correct URLs
      expect(readMoreLinks[0]).toHaveAttribute('href', '/blog/first-article-title');
      expect(readMoreLinks[1]).toHaveAttribute('href', '/blog/second-article-title');
      expect(readMoreLinks[2]).toHaveAttribute('href', '/blog/third-article-title');
    });
  });

  it('renders newsletter subscription section', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText('Berlangganan Newsletter')).toBeInTheDocument();
      expect(screen.getByText('Dapatkan update terbaru tentang kegiatan DIGCITY langsung di email Anda')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Masukkan email Anda')).toBeInTheDocument();
      expect(screen.getByText('Berlangganan')).toBeInTheDocument();
    });
  });

  it('handles newsletter subscription successfully', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('Masukkan email Anda');
      const subscribeButton = screen.getByText('Berlangganan');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(subscribeButton);

      expect(mockNewsletterAPI.subscribe).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows success message after successful newsletter subscription', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('Masukkan email Anda');
      const subscribeButton = screen.getByText('Berlangganan');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(subscribeButton);

      expect(screen.getByText('Terima kasih! Anda berhasil berlangganan newsletter DIGCITY.')).toBeInTheDocument();
    });
  });

  it('shows error message for invalid email format', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('Masukkan email Anda');
      const subscribeButton = screen.getByText('Berlangganan');

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(subscribeButton);

      expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
    });
  });

  it('shows error message for empty email', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const subscribeButton = screen.getByText('Berlangganan');
      fireEvent.click(subscribeButton);

      expect(screen.getByText('Silakan masukkan email Anda')).toBeInTheDocument();
    });
  });

  it('shows error message when newsletter subscription fails', async () => {
    mockNewsletterAPI.subscribe.mockRejectedValue(new Error('Subscription failed'));

    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('Masukkan email Anda');
      const subscribeButton = screen.getByText('Berlangganan');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(subscribeButton);

      expect(screen.getByText('Terjadi kesalahan. Silakan coba lagi.')).toBeInTheDocument();
    });
  });

  it('clears email input after successful subscription', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('Masukkan email Anda');
      const subscribeButton = screen.getByText('Berlangganan');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(subscribeButton);

      expect(emailInput).toHaveValue('');
    });
  });

  it('shows "Load More" button when there are more articles', async () => {
    // Mock more articles to trigger pagination
    const manyArticles = Array.from({ length: 10 }, (_, i) => ({
      ...mockArticles[0],
      id: `article-${i}`,
      title: `Article ${i + 1}`
    }));

    mockNewsAPI.getAll.mockResolvedValue(manyArticles);

    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText('Muat Lebih Banyak')).toBeInTheDocument();
    });
  });

  it('loads more articles when "Load More" button is clicked', async () => {
    // Mock more articles to trigger pagination
    const manyArticles = Array.from({ length: 10 }, (_, i) => ({
      ...mockArticles[0],
      id: `article-${i}`,
      title: `Article ${i + 1}`
    }));

    mockNewsAPI.getAll.mockResolvedValue(manyArticles);

    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const loadMoreButton = screen.getByText('Muat Lebih Banyak');
      fireEvent.click(loadMoreButton);

      // Should show loading state
      expect(screen.getByText('Memuat...')).toBeInTheDocument();
    });
  });

  it('shows "Belum Ada Berita" when no articles are available', async () => {
    mockNewsAPI.getAll.mockResolvedValue([]);

    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText('Belum Ada Berita')).toBeInTheDocument();
      expect(screen.getByText('Saat ini belum ada berita yang tersedia. Silakan kembali lagi nanti untuk update terbaru dari DIGCITY.')).toBeInTheDocument();
    });
  });

  it('formats dates correctly', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText('1 Juli 2025')).toBeInTheDocument();
      expect(screen.getByText('2 Juli 2025')).toBeInTheDocument();
      expect(screen.getByText('3 Juli 2025')).toBeInTheDocument();
    });
  });

  it('applies correct styling classes to category buttons', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const semuaButton = screen.getByText('Semua');
      const technologyButton = screen.getByText('Technology');

      // "Semua" should be active by default
      expect(semuaButton).toHaveClass('bg-primary-600', 'text-white');
      expect(technologyButton).toHaveClass('bg-white', 'text-secondary-700');
    });
  });

  it('updates active category button styling when clicked', async () => {
    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      const semuaButton = screen.getByText('Semua');
      const technologyButton = screen.getByText('Technology');

      fireEvent.click(technologyButton);

      // Technology should now be active
      expect(technologyButton).toHaveClass('bg-primary-600', 'text-white');
      expect(semuaButton).toHaveClass('bg-white', 'text-secondary-700');
    });
  });

  it('handles API errors gracefully', async () => {
    mockNewsAPI.getAll.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<BlogPage />);

    await waitFor(() => {
      // Should still show the page structure even if articles fail to load
      expect(screen.getByText('Berita & Artikel')).toBeInTheDocument();
      expect(screen.getByText('Berlangganan Newsletter')).toBeInTheDocument();
    });
  });
});
