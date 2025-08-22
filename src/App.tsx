import React, { useState, useEffect, useCallback } from 'react'
import { usePerformance } from './hooks/usePerformance'
import { preloadCriticalPages, preloadPage } from './components/LazyComponents'
import { registerServiceWorker } from './utils/serviceWorker'
import { initFormatDetection } from './utils/formatDetection'
import { getSEOConfig } from './config/seoConfig'
import { useSEO } from './hooks/useSEO'
import { cacheManager } from './utils/cacheManager'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import PerformanceAlert from './components/PerformanceMonitor'
import PerformanceMonitor from './components/PerformanceMonitor'
import ImageTest from './components/ImageTest'

// Lazy load components for better performance
const LazyBlogPage = React.lazy(() => import('./components/BlogPage'))
const LazyEventsPage = React.lazy(() => import('./components/EventsPage'))
const LazySejarahPage = React.lazy(() => import('./components/SejarahPage'))
const LazyLogoPage = React.lazy(() => import('./components/LogoPage'))
const LazyVisiMisiPage = React.lazy(() => import('./components/VisiMisiPage'))
const LazyStrukturOrganisasiPage = React.lazy(() => import('./components/StrukturOrganisasiPage'))
const LazyGrandDesignPage = React.lazy(() => import('./components/GrandDesignPage'))
const LazyGaleriPage = React.lazy(() => import('./components/GaleriPage'))
const LazyKontakPage = React.lazy(() => import('./components/KontakPage'))
const LazyAdminPage = React.lazy(() => import('./pages/AdminPage'))

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoading, setIsLoading] = useState(false)

  // Initialize performance monitoring
  const { initializeOptimizations } = usePerformance()

  // Parse current URL to determine initial page
  const parseInitialPage = useCallback(() => {
    const path = window.location.pathname
    if (path === '/' || path === '') return 'home'
    
    // Remove leading slash and get page name
    const page = path.substring(1)
    const validPages = [
      'home', 'blog', 'events', 'sejarah', 'logo', 'visi-misi',
      'struktur-organisasi', 'grand-design', 'galeri', 'kontak', 'admin'
    ]
    
    return validPages.includes(page) ? page : 'home'
  }, [])

  // Navigation handler
  const navigateToPage = useCallback((page: string) => {
    const validPages = [
      'home', 'blog', 'events', 'sejarah', 'logo', 'visi-misi',
      'struktur-organisasi', 'grand-design', 'galeri', 'kontak', 'admin'
    ]
    
    if (validPages.includes(page)) {
      setCurrentPage(page)
      // Update URL without page reload
      const url = page === 'home' ? '/' : `/${page}`
      window.history.pushState({ page }, '', url)
    }
  }, [])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.page) {
        setCurrentPage(event.state.page)
      } else {
        // Handle direct URL access or refresh
        setCurrentPage(parseInitialPage())
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [parseInitialPage])

  // Initialize page based on current URL
  useEffect(() => {
    setCurrentPage(parseInitialPage())
  }, [parseInitialPage])

  // Initialize service worker and performance optimizations
  useEffect(() => {
    // Register service worker for caching and offline support
    registerServiceWorker().catch(error => {
      console.warn('Service Worker registration failed:', error)
    })
    
    // Initialize format detection for modern image formats
    initFormatDetection()
    
    // Preload critical pages
    preloadCriticalPages()
    
    // Setup cache manager
    cacheManager.setupAutoClear()
    
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
  }, [])

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
      case 'test':
        return <ImageTest />
      default:
        return <HomePage onPageChange={handlePageChange} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Performance Monitoring (Development Only) */}
      <PerformanceAlert />
      <PerformanceMonitor enabled={import.meta.env.DEV} />
      
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
