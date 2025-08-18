import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'blog', label: 'Berita' },
    { id: 'events', label: 'Acara' },
  ];

  const aboutMenuItems = [
    { id: 'sejarah', label: 'Sejarah' },
    { id: 'logo', label: 'Logo' },
    { id: 'visi-misi', label: 'Visi Misi' },
    { id: 'struktur-organisasi', label: 'Struktur Organisasi' },
    { id: 'grand-design', label: 'Grand Design DIGCITY' },
    { id: 'galeri', label: 'Galeri DIGCITY' },
    { id: 'kontak', label: 'Kontak Kami' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-secondary-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/logo_digcity.png" 
                alt="DIGCITY Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">DIGCITY</h1>
              <p className="text-sm text-secondary-600">Digital Business Student Society</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Tentang Kami Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => {
                if (dropdownTimeout) {
                  clearTimeout(dropdownTimeout);
                  setDropdownTimeout(null);
                }
                setIsAboutDropdownOpen(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setIsAboutDropdownOpen(false);
                }, 150);
                setDropdownTimeout(timeout);
              }}
            >
              <button className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 flex items-center">
               Tentang Kami
               <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isAboutDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-secondary-200 py-2 z-50"
                  onMouseEnter={() => {
                    if (dropdownTimeout) {
                      clearTimeout(dropdownTimeout);
                      setDropdownTimeout(null);
                    }
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setIsAboutDropdownOpen(false);
                    }, 150);
                    setDropdownTimeout(timeout);
                  }}
                >
                  {aboutMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        setIsAboutDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 hover:bg-primary-50 hover:text-primary-600 ${
                        currentPage === item.id
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-secondary-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
-            <button className="text-secondary-700 hover:text-primary-600">
-              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
-                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
-              </svg>
-            </button>
+            <button className="text-secondary-700 hover:text-primary-600">
+              <Menu className="w-6 h-6" />
+            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;