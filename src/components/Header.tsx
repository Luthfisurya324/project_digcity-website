import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedLogo } from './OptimizedImage';
import CacheStatus from './CacheStatus';


interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  // Handle mobile menu body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    setIsAboutDropdownOpen(false); // Close desktop dropdown when opening mobile menu
  }, []);



  const handleDropdownMouseEnter = useCallback(() => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsAboutDropdownOpen(true);
  }, [dropdownTimeout]);

  const handleDropdownMouseLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 150);
    setDropdownTimeout(timeout);
  }, []);

  const navItems = useMemo(() => [
    { id: 'home', label: 'Beranda' },
    { id: 'blog', label: 'Berita' },
    { id: 'events', label: 'Acara' },
  ], []);

  const aboutMenuItems = useMemo(() => [
    { id: 'sejarah', label: 'Sejarah' },
    { id: 'logo', label: 'Logo' },
    { id: 'visi-misi', label: 'Visi Misi' },
    { id: 'struktur-organisasi', label: 'Struktur Organisasi' },
    { id: 'grand-design', label: 'Grand Design DIGCITY' },
    { id: 'galeri', label: 'Galeri DIGCITY' },
    { id: 'kontak', label: 'Kontak Kami' },
  ], []);



  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-secondary-200 shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onPageChange('home')}
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-1"
              aria-label="Kembali ke beranda DIGCITY"
            >
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <OptimizedLogo 
                  src="/logo_digcity.png" 
                  alt="Logo DIGCITY - Himpunan Mahasiswa Bisnis Digital UIKA Bogor" 
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex flex-col justify-center text-left">
                <h1 className="text-xl font-bold text-secondary-900 leading-tight">DIGCITY</h1>
                <p className="text-sm text-secondary-600 leading-tight">Digital Business Student Society</p>
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Menu utama">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}

                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  currentPage === item.id
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
            
            {/* Tentang Kami Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button 
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 interactive-element"
                aria-expanded={isAboutDropdownOpen}
                aria-haspopup="true"
                aria-label="Menu tentang kami"
              >
               Tentang Kami
               <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              
              {/* Dropdown Menu */}
              {isAboutDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-secondary-200 py-2 z-30 dropdown-menu"
                  role="menu"
                  aria-label="Submenu tentang kami"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {aboutMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        setIsAboutDropdownOpen(false);
                      }}

                      className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${
                        currentPage === item.id
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-secondary-700'
                      }`}
                      role="menuitem"
                      aria-current={currentPage === item.id ? 'page' : undefined}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Cache Status */}
          <div className="hidden lg:flex items-center">
            <CacheStatus showDetails={false} className="text-xs" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
                onClick={handleMobileMenuToggle}
                className="relative p-3 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 focus-ring min-w-[48px] min-h-[48px] flex items-center justify-center interactive-element"
                aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={isMobileMenuOpen}
            >
              <div className="relative w-7 h-7">
                <Menu 
                  className={`absolute inset-0 w-7 h-7 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'}`} 
                />
                <X
                  className={`absolute inset-0 w-7 h-7 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'}`} 
                />
              </div>
            </button>
          </div>
        </div>
      </div>



      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring',
                damping: 25,
                stiffness: 200,
                duration: 0.3
              }}
              className="fixed top-0 right-0 z-[60] h-screen w-80 max-w-[90vw] sm:max-w-[85vw] sm:w-96 bg-white shadow-2xl md:hidden flex flex-col mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-200 bg-white">
          <div className="flex items-center space-x-4">
            <OptimizedLogo 
              src="/logo_digcity.png" 
              alt="DIGCITY Logo" 
              width={40}
              height={40}
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <div className="min-w-0">
              <h2 id="mobile-menu-title" className="text-lg font-bold text-secondary-900 leading-tight">DIGCITY</h2>
              <p className="text-xs text-secondary-600 leading-tight">Menu Navigasi</p>
            </div>
          </div>
          <button 
            onClick={handleMobileMenuToggle}
            className="p-2.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-xl transition-colors focus-ring flex-shrink-0 interactive-element"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex-1 overflow-y-auto mobile-menu-scroll pb-6">
          {/* Main Navigation */}
          <div className="px-6 py-4 mobile-menu-responsive mobile-menu-compact">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-5"
            >
              Menu Utama
            </motion.h3>
            <nav className="space-y-3">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-between focus-ring interactive-element ${
                    currentPage === item.id
                      ? 'text-primary-600 bg-primary-50 shadow-sm border border-primary-100'
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {item.label}
                  {currentPage === item.id && (
                    <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* About Section */}
          <div className="px-6 py-4 border-t border-secondary-100 mobile-menu-responsive mobile-menu-compact">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-5"
            >
              Tentang Kami
            </motion.h3>
            <nav className="space-y-3">
              {aboutMenuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1), duration: 0.3 }}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base transition-all duration-200 flex items-center justify-between focus-ring interactive-element ${
                    currentPage === item.id
                      ? 'text-primary-600 bg-primary-50 shadow-sm font-medium border border-primary-100'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {item.label}
                  {currentPage === item.id && (
                    <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.3 }}
          className="mt-auto px-6 py-4 border-t border-secondary-100 bg-secondary-25"
        >
          <div className="text-center">
            <p className="text-sm text-secondary-600 mb-2 font-medium">Digital Business Student Society</p>
            <p className="text-xs text-secondary-500">Universitas Ibn Khaldun Bogor</p>
          </div>
        </motion.div>
      </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;