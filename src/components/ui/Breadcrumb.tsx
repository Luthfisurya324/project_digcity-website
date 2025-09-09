import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [], showHome = true }) => {
  const location = useLocation();
  
  // Generate breadcrumb items based on current location if none provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    if (showHome) {
      breadcrumbs.push({
        label: 'Beranda',
        path: '/',
        isActive: pathSegments.length === 0
      });
    }
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment;
      if (segment === 'blog') label = 'Blog';
      else if (segment === 'events') label = 'Events';
      else if (segment === 'sejarah') label = 'Sejarah';
      else if (segment === 'logo') label = 'Logo';
      else if (segment === 'visi-misi') label = 'Visi & Misi';
      else if (segment === 'struktur-organisasi') label = 'Struktur Organisasi';
      else if (segment === 'grand-design') label = 'Grand Design';
      else if (segment === 'galeri') label = 'Galeri';
      else if (segment === 'kontak') label = 'Kontak';
      else if (segment === 'admin') label = 'Admin';
      else {
        // For blog articles, try to get the title from the URL
        if (segment && pathSegments[index - 1] === 'blog') {
          label = segment.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      }
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();
  
  if (breadcrumbItems.length <= 1) {
    return null;
  }
  
  return (
    <nav className="bg-white border-b border-secondary-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-secondary-400 mx-2" data-testid="chevron-right" />
              )}
              
              {item.isActive ? (
                <span 
                  className="text-secondary-900 font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-1"
                >
                  {item.path === '/' && <Home className="w-4 h-4" />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
