import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { preloadCriticalPages } from './components/common/LazyComponents'
import { registerServiceWorker } from './utils/serviceWorker'
import { initFormatDetection } from './utils/formatDetection'
import { cacheManager } from './utils/cacheManager'
import { shouldRedirectToLinktree, shouldRedirectToAdmin, shouldRedirectToInternal } from './utils/domainDetection'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import { NotificationProvider } from './components/common/NotificationCenter'


import { SpeedInsights } from "@vercel/speed-insights/react"
import CampaignBanner from './components/common/CampaignBanner'
import { orgAPI } from './lib/supabase'

// Lazy load components
const LazyBlogPage = React.lazy(() => import('./pages/blog/BlogPage'))
const LazyBlogDetailPage = React.lazy(() => import('./pages/blog/BlogDetailPage'))
const LazyEventsPage = React.lazy(() => import('./pages/events/EventsPage'))
const LazySejarahPage = React.lazy(() => import('./pages/about/SejarahPage'))
const LazyLogoPage = React.lazy(() => import('./pages/about/LogoPage'))
const LazyVisiMisiPage = React.lazy(() => import('./pages/about/VisiMisiPage'))
const LazyStrukturOrganisasiPage = React.lazy(() => import('./pages/about/StrukturOrganisasiPage'))
const LazyGrandDesignPage = React.lazy(() => import('./pages/about/GrandDesignPage'))
const LazyGaleriPage = React.lazy(() => import('./pages/gallery/GaleriPage'))
const LazyKontakPage = React.lazy(() => import('./pages/contact/KontakPage'))
const LazyAdminPanel = React.lazy(() => import('./pages/AdminPanel'))
const LazyInternalPanel = React.lazy(() => import('./pages/InternalPanel'))
const LazyLinktreePage = React.lazy(() => import('./pages/LinktreePage'))
const LazyComplaintsPage = React.lazy(() => import('./pages/complaints/ComplaintsPage'))
const LazyResponsePage = React.lazy(() => import('./pages/complaints/ResponsePage'))
import Recap2025Page from './pages/Recap2025Page'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  // Check for subdomain redirect
  useEffect(() => {
    if (shouldRedirectToLinktree()) {
      console.log('Accessing from linktree subdomain')
    }

    if (shouldRedirectToAdmin()) {
      console.log('Accessing from admin subdomain')
    }

    if (shouldRedirectToInternal()) {
      console.log('Accessing from internal subdomain')
    }
  }, []) // Remove navigate and location dependencies to prevent re-renders

  // Deteksi apakah user mengakses dari subdomain linktree atau admin
  // Gunakan useMemo untuk mencegah re-render yang tidak perlu
  const isLinktreeSubdomain = React.useMemo(() => shouldRedirectToLinktree(), [])
  const isAdminSubdomain = React.useMemo(() => shouldRedirectToAdmin(), [])
  // Do NOT check internal subdomain here if we want path-based access
  // because it would hijack the router. Path-based access is handled by main Routes.
  const isInternalSubdomain = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'internal.digcity.my.id';
  }, [])

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

  // Check for campaign banner
  const [showCampaignBanner, setShowCampaignBanner] = React.useState(false)

  useEffect(() => {
    const checkCampaign = async () => {
      try {
        const profile = await orgAPI.getProfile()
        if (profile && profile.is_campaign_active) {
          setShowCampaignBanner(true)
        }
      } catch (e) {
        // silent fail
      }
    }

    if (!isLinktreeSubdomain && !isAdminSubdomain && !isInternalSubdomain) {
      checkCampaign()
    }
  }, [isLinktreeSubdomain, isAdminSubdomain, isInternalSubdomain])

  const handleDismissBanner = () => {
    setShowCampaignBanner(false)
  }

  // Layout component untuk halaman dengan header dan footer
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <>
      {showCampaignBanner && <CampaignBanner onDismiss={handleDismissBanner} />}
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )

  return (
    <NotificationProvider>
      <SpeedInsights />
      <div className={`min-h-screen ${isLinktreeSubdomain ? 'w-full' :
        isAdminSubdomain ? 'w-full' :
          isInternalSubdomain ? 'w-full' :
            'bg-white'
        }`}>
        {/* Performance Monitoring (Development Only) */}
        {/* Debug Info removed per request */}

        {/* Conditional rendering untuk subdomain linktree dan admin */}
        {isLinktreeSubdomain ? (
          <LazyLinktreePage />
        ) : isAdminSubdomain ? (
          <Routes>
            <Route path="/*" element={<LazyAdminPanel />} />
          </Routes>
        ) : isInternalSubdomain ? (
          <Routes>
            <Route path="/*" element={<LazyInternalPanel />} />
          </Routes>
        ) : (
          <Routes>
            {/* Admin route - no header/footer (untuk akses dari domain utama) */}
            <Route path="/admin/*" element={<LazyAdminPanel />} />

            {/* Internal route - no header/footer (untuk akses dari domain utama/localhost) */}
            <Route path="/internal/*" element={<LazyInternalPanel />} />

            {/* Main routes with header/footer */}
            <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
            <Route path="/blog" element={<PageLayout><LazyBlogPage /></PageLayout>} />
            <Route path="/blog/:slug" element={<PageLayout><LazyBlogDetailPage /></PageLayout>} />
            <Route path="/blog/recap-2025" element={<Recap2025Page />} />
            <Route path="/events" element={<PageLayout><LazyEventsPage /></PageLayout>} />
            <Route path="/sejarah" element={<PageLayout><LazySejarahPage /></PageLayout>} />
            <Route path="/logo" element={<PageLayout><LazyLogoPage /></PageLayout>} />
            <Route path="/visi-misi" element={<PageLayout><LazyVisiMisiPage /></PageLayout>} />
            <Route path="/struktur-organisasi" element={<PageLayout><LazyStrukturOrganisasiPage /></PageLayout>} />
            <Route path="/grand-design" element={<PageLayout><LazyGrandDesignPage /></PageLayout>} />
            <Route path="/galeri" element={<PageLayout><LazyGaleriPage /></PageLayout>} />
            <Route path="/kontak" element={<PageLayout><LazyKontakPage /></PageLayout>} />
            <Route path="/pengaduan" element={<PageLayout><LazyComplaintsPage /></PageLayout>} />
            <Route path="/pengaduan/respon" element={<PageLayout><LazyResponsePage /></PageLayout>} />

            {/* Linktree route - no header/footer for clean linktree experience */}
            <Route path="/linktree" element={<LazyLinktreePage />} />

            {/* Catch all route - 404 */}
            <Route path="*" element={<PageLayout><NotFoundPage /></PageLayout>} />
          </Routes>
        )}
      </div>
    </NotificationProvider>
  )
}

export default App
