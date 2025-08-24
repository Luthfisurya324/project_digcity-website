import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { usePerformance } from './hooks/usePerformance'
import { preloadCriticalPages } from './components/LazyComponents'
import { registerServiceWorker } from './utils/serviceWorker'
import { initFormatDetection } from './utils/formatDetection'
import { cacheManager } from './utils/cacheManager'
import { shouldRedirectToLinktree, shouldRedirectToAdmin } from './utils/domainDetection'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import PerformanceMonitor from './components/PerformanceMonitor'
import DebugInfo from './components/DebugInfo'

// Lazy load components
const LazyBlogPage = React.lazy(() => import('./components/BlogPage'))
const LazyBlogDetailPage = React.lazy(() => import('./components/BlogDetailPage'))
const LazyEventsPage = React.lazy(() => import('./components/EventsPage'))
const LazySejarahPage = React.lazy(() => import('./components/SejarahPage'))
const LazyLogoPage = React.lazy(() => import('./components/LogoPage'))
const LazyVisiMisiPage = React.lazy(() => import('./components/VisiMisiPage'))
const LazyStrukturOrganisasiPage = React.lazy(() => import('./components/StrukturOrganisasiPage'))
const LazyGrandDesignPage = React.lazy(() => import('./components/GrandDesignPage'))
const LazyGaleriPage = React.lazy(() => import('./components/GaleriPage'))
const LazyKontakPage = React.lazy(() => import('./components/KontakPage'))
const LazyAdminPage = React.lazy(() => import('./pages/AdminPage'))
const LazyLinktreePage = React.lazy(() => import('./pages/LinktreePage'))

function App() {
  // Initialize performance monitoring
  usePerformance()
  const navigate = useNavigate()
  const location = useLocation()

           // Check for subdomain redirect
         useEffect(() => {
           if (shouldRedirectToLinktree()) {
             // Jika di subdomain linktree, langsung render LinktreePage
             // Tidak perlu redirect, biarkan React Router handle
             console.log('Accessing from linktree subdomain')
           }
           
           if (shouldRedirectToAdmin()) {
             // Jika di subdomain admin, langsung render AdminPage
             console.log('Accessing from admin subdomain')
           }
         }, [navigate, location])

         // Deteksi apakah user mengakses dari subdomain linktree atau admin
         const isLinktreeSubdomain = shouldRedirectToLinktree()
         const isAdminSubdomain = shouldRedirectToAdmin()

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

  // Layout component untuk halaman dengan header dan footer
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )

           return (
           <div className={`min-h-screen ${
             isLinktreeSubdomain ? 'w-full' : 
             isAdminSubdomain ? 'w-full' : 
             'bg-white'
           }`}>
           {/* Performance Monitoring (Development Only) */}
           <PerformanceMonitor enabled={import.meta.env.DEV} />
           
           {/* Debug Info (Development Only) */}
           <DebugInfo enabled={import.meta.env.DEV} />
           
           {/* Conditional rendering untuk subdomain linktree dan admin */}
           {isLinktreeSubdomain ? (
             <LazyLinktreePage />
           ) : isAdminSubdomain ? (
             <LazyAdminPage />
           ) : (
        <Routes>
                           {/* Admin route - no header/footer (untuk akses dari domain utama) */}
                 <Route path="/admin" element={<LazyAdminPage />} />
          
          {/* Main routes with header/footer */}
          <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
          <Route path="/blog" element={<PageLayout><LazyBlogPage /></PageLayout>} />
          <Route path="/blog/:slug" element={<PageLayout><LazyBlogDetailPage /></PageLayout>} />
          <Route path="/events" element={<PageLayout><LazyEventsPage /></PageLayout>} />
          <Route path="/sejarah" element={<PageLayout><LazySejarahPage /></PageLayout>} />
          <Route path="/logo" element={<PageLayout><LazyLogoPage /></PageLayout>} />
          <Route path="/visi-misi" element={<PageLayout><LazyVisiMisiPage /></PageLayout>} />
          <Route path="/struktur-organisasi" element={<PageLayout><LazyStrukturOrganisasiPage /></PageLayout>} />
          <Route path="/grand-design" element={<PageLayout><LazyGrandDesignPage /></PageLayout>} />
          <Route path="/galeri" element={<PageLayout><LazyGaleriPage /></PageLayout>} />
          <Route path="/kontak" element={<PageLayout><LazyKontakPage /></PageLayout>} />
          
          {/* Linktree route - no header/footer for clean linktree experience */}
          <Route path="/linktree" element={<LazyLinktreePage />} />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  )
}

export default App
