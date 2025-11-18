import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogDetailPage from '../BlogDetailPage';
import { newsAPI } from '../../../lib/supabase';

// Mock the dependencies
jest.mock('../../../lib/supabase');
jest.mock('../../hooks/useSEO');
jest.mock('../RelatedArticles');
jest.mock('../Breadcrumb');
jest.mock('../SocialShare');

const mockNewsAPI = newsAPI as jest.Mocked<typeof newsAPI>;

// Mock article data
const mockArticle = {
  id: '1',
  title: 'Test Article Title',
  content: '<p>This is a test article content with <strong>bold text</strong> and <em>italic text</em>.</p>',
  excerpt: 'This is a test article excerpt',
  author: 'Test Author',
  published_date: '2025-07-01T00:00:00Z',
  image_url: '/test-image.jpg',
  category: 'Technology',
  tags: ['tech', 'digital', 'innovation'],
  created_at: '2025-07-01T00:00:00Z',
  updated_at: '2025-07-01T00:00:00Z'
};

// Mock related articles
const mockRelatedArticles = [
  {
    id: '2',
    title: 'Related Article 1',
    content: 'Related article content 1',
    excerpt: 'Related article excerpt 1',
    author: 'Test Author',
    published_date: '2025-07-01T00:00:00Z',
    image_url: '/related-image-1.jpg',
    category: 'Technology',
    tags: ['tech', 'digital'],
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z'
  }
];

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ slug: 'test-article-title' })
}));

// Mock useSEO hook
const mockUseSEO = jest.fn();
jest.mock('../../../hooks/useSEO', () => ({
  useSEO: () => mockUseSEO()
}));

// Mock RelatedArticles component
jest.mock('../RelatedArticles', () => {
  return function MockRelatedArticles() {
    return <div data-testid="related-articles">Related Articles</div>;
  };
});

// Mock Breadcrumb component
jest.mock('../Breadcrumb', () => {
  return function MockBreadcrumb() {
    return <div data-testid="breadcrumb">Breadcrumb</div>;
  };
});

// Mock SocialShare component
jest.mock('../SocialShare', () => {
  return function MockSocialShare() {
    return <div data-testid="social-share">Social Share</div>;
  };
});

describe('BlogDetailPage', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNewsAPI.getAll.mockResolvedValue([mockArticle, ...mockRelatedArticles]);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ value: 5 })
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    renderWithRouter(<BlogDetailPage />);
    
    expect(screen.getByText('Memuat artikel...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders article content when loaded successfully', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('This is a test article excerpt')).toBeInTheDocument();
    expect(screen.getByText('Baca Selengkapnya →')).toBeInTheDocument();
  });

  it('renders article image when available', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      const image = screen.getByAltText('Test Article Title');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });
  });

  it('renders article tags when available', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('#tech')).toBeInTheDocument();
      expect(screen.getByText('#digital')).toBeInTheDocument();
      expect(screen.getByText('#innovation')).toBeInTheDocument();
    });
  });

  it('renders related articles section', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('related-articles')).toBeInTheDocument();
    });
  });

  it('renders breadcrumb navigation', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('renders social share component', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('social-share')).toBeInTheDocument();
    });
  });

  it('loads share count when article is loaded', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://api.countapi.xyz/get/digcity-share/test-article-title');
      expect(screen.getByText(/kali dibagikan/)).toBeInTheDocument();
    });
  });

  it('renders error state when article not found', async () => {
    mockNewsAPI.getAll.mockResolvedValue([]);

    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Artikel Tidak Ditemukan')).toBeInTheDocument();
      expect(screen.getByText('Artikel yang Anda cari tidak tersedia.')).toBeInTheDocument();
      expect(screen.getByText('Kembali ke Blog')).toBeInTheDocument();
    });
  });

  it('renders error state when API call fails', async () => {
    mockNewsAPI.getAll.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Artikel Tidak Ditemukan')).toBeInTheDocument();
      expect(screen.getByText('Terjadi kesalahan saat memuat artikel')).toBeInTheDocument();
    });
  });

  it('calculates reading time correctly', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      // Content has 15 words, should be 1 minute at 200 words per minute
      expect(screen.getByText('1 menit baca')).toBeInTheDocument();
    });
  });

  it('formats date correctly', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      // Should format the date in Indonesian locale
      expect(screen.getByText(/1 Juli 2025/)).toBeInTheDocument();
    });
  });

  it('navigates back to blog when back button is clicked', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      const backButton = screen.getByText('Kembali ke Blog');
      backButton.click();
      expect(mockNavigate).toHaveBeenCalledWith('/blog');
    });
  });

  it('navigates back to blog when error occurs and back button is clicked', async () => {
    mockNewsAPI.getAll.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      const backButton = screen.getByText('Kembali ke Blog');
      backButton.click();
      expect(mockNavigate).toHaveBeenCalledWith('/blog');
    });
  });

  it('calls useSEO hook with correct parameters', async () => {
    renderWithRouter(<BlogDetailPage />);

    await waitFor(() => {
      expect(mockUseSEO).toHaveBeenCalledWith({
        title: 'Test Article Title - Blog DIGCITY',
        description: 'This is a test article excerpt',
        keywords: 'tech, digital, innovation, Technology, DIGCITY, blog, artikel',
        ogImage: '/test-image.jpg',
        canonicalUrl: 'https://digcity.my.id/blog/test-article-title',
        structuredData: expect.objectContaining({
          '@type': 'Article',
          headline: 'Test Article Title',
          description: 'This is a test article excerpt'
        })
      });
    });
  });
});
