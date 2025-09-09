import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';

const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('Breadcrumb', () => {
  it('renders nothing when only one path segment', () => {
    const { container } = renderWithRouter(<Breadcrumb />, ['/']);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders breadcrumb for blog page', () => {
    renderWithRouter(<Breadcrumb />, ['/blog']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    
    const berandaLink = screen.getByText('Beranda').closest('a');
    const blogLink = screen.getByText('Blog').closest('a');
    
    expect(berandaLink).toHaveAttribute('href', '/');
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('renders breadcrumb for blog article', () => {
    renderWithRouter(<Breadcrumb />, ['/blog/test-article-title']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    
    const berandaLink = screen.getByText('Beranda').closest('a');
    const blogLink = screen.getByText('Blog').closest('a');
    const articleText = screen.getByText('Test Article Title');
    
    expect(berandaLink).toHaveAttribute('href', '/');
    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(articleText).not.toHaveAttribute('href'); // Current page, not a link
  });

  it('renders breadcrumb for events page', () => {
    renderWithRouter(<Breadcrumb />, ['/events']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('renders breadcrumb for sejarah page', () => {
    renderWithRouter(<Breadcrumb />, ['/sejarah']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Sejarah')).toBeInTheDocument();
  });

  it('renders breadcrumb for logo page', () => {
    renderWithRouter(<Breadcrumb />, ['/logo']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('renders breadcrumb for visi-misi page', () => {
    renderWithRouter(<Breadcrumb />, ['/visi-misi']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Visi & Misi')).toBeInTheDocument();
  });

  it('renders breadcrumb for struktur-organisasi page', () => {
    renderWithRouter(<Breadcrumb />, ['/struktur-organisasi']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Struktur Organisasi')).toBeInTheDocument();
  });

  it('renders breadcrumb for grand-design page', () => {
    renderWithRouter(<Breadcrumb />, ['/grand-design']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Grand Design')).toBeInTheDocument();
  });

  it('renders breadcrumb for galeri page', () => {
    renderWithRouter(<Breadcrumb />, ['/galeri']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Galeri')).toBeInTheDocument();
  });

  it('renders breadcrumb for kontak page', () => {
    renderWithRouter(<Breadcrumb />, ['/kontak']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Kontak')).toBeInTheDocument();
  });

  it('renders breadcrumb for admin page', () => {
    renderWithRouter(<Breadcrumb />, ['/admin']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders breadcrumb with custom items', () => {
    const customItems = [
      { label: 'Custom Page', path: '/custom', isActive: false },
      { label: 'Custom Subpage', path: '/custom/sub', isActive: true }
    ];
    
    renderWithRouter(<Breadcrumb items={customItems} />);
    
    expect(screen.getByText('Custom Page')).toBeInTheDocument();
    expect(screen.getByText('Custom Subpage')).toBeInTheDocument();
    
    const customPageLink = screen.getByText('Custom Page').closest('a');
    const customSubpageText = screen.getByText('Custom Subpage');
    
    expect(customPageLink).toHaveAttribute('href', '/custom');
    expect(customSubpageText).not.toHaveAttribute('href'); // Active page
  });

  it('renders breadcrumb without home when showHome is false', () => {
    renderWithRouter(<Breadcrumb showHome={false} />, ['/blog']);
    
    expect(screen.queryByText('Beranda')).not.toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('renders home icon for beranda link', () => {
    renderWithRouter(<Breadcrumb />, ['/blog']);
    
    const berandaLink = screen.getByText('Beranda').closest('a');
    expect(berandaLink).toBeInTheDocument();
    
    // Check if home icon is present
    const homeIcon = berandaLink?.querySelector('svg');
    expect(homeIcon).toBeInTheDocument();
  });

  it('renders chevron separators between breadcrumb items', () => {
    renderWithRouter(<Breadcrumb />, ['/blog/test-article']);
    
    const chevrons = screen.getAllByTestId('chevron-right');
    expect(chevrons).toHaveLength(2); // Between beranda-blog and blog-article
  });

  it('applies correct styling classes', () => {
    renderWithRouter(<Breadcrumb />, ['/blog']);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-white', 'border-b', 'border-secondary-200');
    
    const berandaLink = screen.getByText('Beranda').closest('a');
    expect(berandaLink).toHaveClass('text-secondary-600', 'hover:text-primary-600');
    
    const blogText = screen.getByText('Blog');
    expect(blogText).toHaveClass('text-secondary-900', 'font-medium');
  });

  it('handles complex nested paths correctly', () => {
    renderWithRouter(<Breadcrumb />, ['/blog/category/subcategory/article-title']);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Subcategory')).toBeInTheDocument();
    expect(screen.getByText('Article Title')).toBeInTheDocument();
  });

  it('handles special characters in URL segments', () => {
    renderWithRouter(<Breadcrumb />, ['/blog/artikel-dengan-spasi-dan-123']);
    
    expect(screen.getByText('Artikel Dengan Spasi Dan 123')).toBeInTheDocument();
  });

  it('handles empty path segments gracefully', () => {
    renderWithRouter(<Breadcrumb />, ['//blog//']);
    
    // Should still render breadcrumb for valid segments
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('applies aria-current attribute to current page', () => {
    renderWithRouter(<Breadcrumb />, ['/blog/test-article']);
    
    const currentPage = screen.getByText('Test Article');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('applies aria-label to navigation', () => {
    renderWithRouter(<Breadcrumb />, ['/blog']);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});
