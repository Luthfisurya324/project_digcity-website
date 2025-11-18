import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SocialShare from '../SocialShare';

// Mock navigator.share
const mockNavigatorShare = jest.fn();

// Mock navigator.clipboard
const mockClipboardWriteText = jest.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockClipboardWriteText },
  writable: true
});

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true
});

describe('SocialShare', () => {
  const defaultProps = {
    url: 'https://example.com/article',
    title: 'Test Article Title',
    description: 'Test article description',
    hashtags: ['test', 'article', 'blog']
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(navigator, 'share', {
      value: mockNavigatorShare,
      writable: true
    });
    mockNavigatorShare.mockResolvedValue(undefined);
    mockClipboardWriteText.mockResolvedValue(undefined);
    mockWindowOpen.mockReturnValue(null);
  });

  it('renders share button with correct text', () => {
    render(<SocialShare {...defaultProps} />);
    
    expect(screen.getByText('Bagikan')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls navigator.share when share button is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(mockNavigatorShare).toHaveBeenCalledWith({
        title: 'Test Article Title',
        text: 'Test article description',
        url: 'https://example.com/article'
      });
    });
  });

  it('shows share options when navigator.share is not available', async () => {
    // Mock navigator.share as undefined
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true
    });

    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bagikan Artikel')).toBeInTheDocument();
    });
  });

  it('shows share options when navigator.share throws error', async () => {
    mockNavigatorShare.mockRejectedValue(new Error('Share failed'));

    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bagikan Artikel')).toBeInTheDocument();
    });
  });

  it('calls onShare when native share succeeds', async () => {
    const handleShare = jest.fn();
    render(<SocialShare {...defaultProps} onShare={handleShare} />);

    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(handleShare).toHaveBeenCalled();
    });
  });

  it('renders all social media platforms', () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Telegram')).toBeInTheDocument();
  });

  it('opens Facebook share URL when Facebook button is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const facebookButton = screen.getByText('Facebook');
      fireEvent.click(facebookButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer/sharer.php'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
    });
  });

  it('calls onShare when copy link button is clicked', async () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true
    });
    const handleShare = jest.fn();
    render(<SocialShare {...defaultProps} onShare={handleShare} />);

    fireEvent.click(screen.getByText('Bagikan'));
    await waitFor(() => screen.getByText('Bagikan Artikel'));

    const copyButton = screen.getByText('Salin Link');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(handleShare).toHaveBeenCalled();
    });
  });

  it('opens Twitter share URL when Twitter button is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const twitterButton = screen.getByText('Twitter');
      fireEvent.click(twitterButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
    });
  });

  it('opens LinkedIn share URL when LinkedIn button is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const linkedinButton = screen.getByText('LinkedIn');
      fireEvent.click(linkedinButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com/sharing/share-offsite'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
    });
  });

  it('opens WhatsApp share URL when WhatsApp button is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const whatsappButton = screen.getByText('WhatsApp');
      fireEvent.click(whatsappButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('wa.me'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
    });
  });

  it('opens Telegram share URL when Telegram button is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const telegramButton = screen.getByText('Telegram');
      fireEvent.click(telegramButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('t.me/share/url'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
    });
  });

  it('copies link to clipboard when copy button is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const copyButton = screen.getByText('Salin Link');
      fireEvent.click(copyButton);
      
      expect(mockClipboardWriteText).toHaveBeenCalledWith('https://example.com/article');
    });
  });

  it('shows success message when link is copied', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const copyButton = screen.getByText('Salin Link');
      fireEvent.click(copyButton);
      
      expect(screen.getByText('Link Disalin!')).toBeInTheDocument();
      expect(screen.getByText('Link Disalin!')).toHaveClass('text-green-600');
    });
  });

  it('hides success message after 2 seconds', async () => {
    jest.useFakeTimers();
    
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const copyButton = screen.getByText('Salin Link');
      fireEvent.click(copyButton);
      
      expect(screen.getByText('Link Disalin!')).toBeInTheDocument();
    });
    
    // Fast-forward time
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(screen.queryByText('Link Disalin!')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  it('closes share options when close button is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bagikan Artikel')).toBeInTheDocument();
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Bagikan Artikel')).not.toBeInTheDocument();
    });
  });

  it('closes share options when backdrop is clicked', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bagikan Artikel')).toBeInTheDocument();
      
      const backdrop = screen.getByTestId('backdrop');
      fireEvent.click(backdrop);
      
      expect(screen.queryByText('Bagikan Artikel')).not.toBeInTheDocument();
    });
  });

  it('uses default hashtags when none provided', () => {
    render(<SocialShare url="https://example.com" title="Test" description="Test" />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    // Should use default hashtags: DIGCITY, BisnisDigital, UIKA
    expect(screen.getByText('DIGCITY')).toBeInTheDocument();
    expect(screen.getByText('BisnisDigital')).toBeInTheDocument();
    expect(screen.getByText('UIKA')).toBeInTheDocument();
  });

  it('handles clipboard API failure gracefully', async () => {
    mockClipboardWriteText.mockRejectedValue(new Error('Clipboard failed'));
    
    // Mock document.execCommand for fallback
    const mockExecCommand = jest.fn();
    Object.defineProperty(document, 'execCommand', {
      value: mockExecCommand,
      writable: true
    });
    
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const copyButton = screen.getByText('Salin Link');
      fireEvent.click(copyButton);
      
      // Should still show success message due to fallback
      expect(screen.getByText('Link Disalin!')).toBeInTheDocument();
    });
  });

  it('applies correct styling classes to social media buttons', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const facebookButton = screen.getByText('Facebook').closest('button');
      const twitterButton = screen.getByText('Twitter').closest('button');
      const linkedinButton = screen.getByText('LinkedIn').closest('button');
      
      expect(facebookButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
      expect(twitterButton).toHaveClass('bg-sky-500', 'hover:bg-sky-600');
      expect(linkedinButton).toHaveClass('bg-blue-700', 'hover:bg-blue-800');
    });
  });

  it('renders with correct z-index for dropdown', async () => {
    render(<SocialShare {...defaultProps} />);
    
    const shareButton = screen.getByText('Bagikan');
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      const dropdown = screen.getByText('Bagikan Artikel').closest('div');
      expect(dropdown).toHaveClass('z-50');
    });
  });
});
