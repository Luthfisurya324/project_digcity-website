import { useState, useEffect } from 'react'
import Header from './components/Header'
import HomePage from './components/HomePage'
import BlogPage from './components/BlogPage'
import EventsPage from './components/EventsPage'
import SejarahPage from './components/SejarahPage'
import LogoPage from './components/LogoPage'
import VisiMisiPage from './components/VisiMisiPage'
import StrukturOrganisasiPage from './components/StrukturOrganisasiPage'
import GrandDesignPage from './components/GrandDesignPage'
import GaleriPage from './components/GaleriPage'
import KontakPage from './components/KontakPage'
import AdminPage from './pages/AdminPage'
import Footer from './components/Footer'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

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

  // Update page + URL when user navigates via UI
  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    navigateToPage(page)
    // Reset scroll position to top
    window.scrollTo(0, 0)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />
      case 'blog':
        return <BlogPage />
      case 'events':
        return <EventsPage />
      case 'sejarah':
        return <SejarahPage />
      case 'logo':
        return <LogoPage />
      case 'visi-misi':
        return <VisiMisiPage />
      case 'struktur-organisasi':
        return <StrukturOrganisasiPage onPageChange={handlePageChange} />
      case 'grand-design':
        return <GrandDesignPage onPageChange={handlePageChange} />
      case 'galeri':
        return <GaleriPage />
      case 'kontak':
        return <KontakPage />
      case 'admin':
        return <AdminPage />
      default:
        return <HomePage onPageChange={handlePageChange} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
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
