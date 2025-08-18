import { useState, useEffect } from 'react'
import Header from './components/Header'
import HomePage from './components/HomePage'
import Footer from './components/Footer'
import { useSEO } from './hooks/useSEO'
import { getSEOConfig } from './config/seoConfig'
import { usePerformance, useServiceWorker } from './hooks/usePerformance'
import {
  LazyBlogPage,
  LazyEventsPage,
  LazySejarahPage,
  LazyLogoPage,
  LazyVisiMisiPage,
  LazyStrukturOrganisasiPage,
  LazyGrandDesignPage,
  LazyGaleriPage,
  LazyKontakPage,
  LazyAdminPage,
  preloadCriticalPages,
  preloadPage
} from './components/LazyComponents'
import PerformanceMonitor, { PerformanceAlert } from './components/PerformanceMonitor'
import { initFormatDetection } from './utils/formatDetection'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  
  // Initialize performance monitoring and service worker
  const { preloadCriticalResources } = usePerformance()
  const { registerServiceWorker } = useServiceWorker()

  // Helper: derive page id from current location
  const getPageFromLocation = (): string => {
    // Prefer pathname (e.g., /events). Fallback to hash if provided.
    const hash = window.location.hash.replace('#', '')
    let path = window.location.pathname || '/'

    // Normalize when app is served from subpath (strip trailing slash)
    // Keep only first segment after leading slash
    if (path !== '/') {
      const segments = path.split('/').filter(Boolean)
      if (segments.length > 0) {
        return segments[0]
      }
    }

    // Fallback: support legacy hash-based admin
    if (hash === 'admin') return 'admin'

    return 'home'
  }

  // Helper: push/replace browser URL without full page reload
  const navigateToPage = (page: string, replace = false) => {
    const targetPath = page === 'home' ? '/' : `/${page}`
    const state = { page }
    if (replace) {
      window.history.replaceState(state, '', targetPath)
    } else {
      window.history.pushState(state, '', targetPath)
    }
  }

  // Initialize route and listen to back/forward navigation
  useEffect(() => {
    const initialPage = getPageFromLocation()
    setCurrentPage(initialPage)
    // Normalize URL to / or /page on first load
    navigateToPage(initialPage, true)

    const handlePopState = () => {
      const pageFromPath = getPageFromLocation()
      setCurrentPage(pageFromPath)
      // Reset scroll position to top when using browser back/forward
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  
  // Initialize service worker and performance optimizations
  useEffect(() => {
    // Register service worker for caching and offline support
    registerServiceWorker().catch(error => {
      console.warn('Service Worker registration failed:', error)
    })
    
    // Initialize format detection for modern image formats
    initFormatDetection()
    
    // Preload critical resources
    preloadCriticalResources()
    
    // Preload critical pages
    preloadCriticalPages()
    
    // Add manifest link if not already present
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link')
      manifestLink.rel = 'manifest'
      manifestLink.href = '/manifest.json'
      document.head.appendChild(manifestLink)
    }
    
    // Add theme-color meta tag if not already present
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColorMeta = document.createElement('meta')
      themeColorMeta.name = 'theme-color'
      themeColorMeta.content = '#1e40af'
      document.head.appendChild(themeColorMeta)
    }
  }, [registerServiceWorker, preloadCriticalResources])

  // Update page + URL when user navigates via UI
  const handlePageChange = (page: string) => {
    // Preload the target page before navigation with current page context
    preloadPage(page, currentPage)
    
    setCurrentPage(page)
    navigateToPage(page)
    // Reset scroll position to top
    window.scrollTo(0, 0)
  }

  // Update SEO data when page changes
  const seoConfig = getSEOConfig(currentPage)
  useSEO(seoConfig)

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />
      case 'blog':
        return <LazyBlogPage />
      case 'events':
        return <LazyEventsPage />
      case 'sejarah':
        return <LazySejarahPage />
      case 'logo':
        return <LazyLogoPage />
      case 'visi-misi':
        return <LazyVisiMisiPage />
      case 'struktur-organisasi':
        return <LazyStrukturOrganisasiPage onPageChange={handlePageChange} />
      case 'grand-design':
        return <LazyGrandDesignPage onPageChange={handlePageChange} />
      case 'galeri':
        return <LazyGaleriPage />
      case 'kontak':
        return <LazyKontakPage />
      case 'admin':
        return <LazyAdminPage />
      default:
        return <HomePage onPageChange={handlePageChange} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Performance Monitoring (Development Only) */}
      <PerformanceAlert threshold={60} />
      <PerformanceMonitor enabled={process.env.NODE_ENV === 'development'} />
      
      {currentPage !== 'admin' && (
        <Header currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      <main>
        {renderPage()}
      </main>
      {currentPage !== 'admin' && <Footer />}
    </div>
  )
}

export default App
