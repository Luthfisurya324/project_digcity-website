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

  // Handle hash routing for admin access
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove the # symbol
      if (hash === 'admin') {
        setCurrentPage('admin')
      }
    }

    // Check initial hash on load
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Update hash when page changes
  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    if (page === 'admin') {
      window.location.hash = 'admin'
    } else {
      window.location.hash = ''
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
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
        return <StrukturOrganisasiPage />
      case 'grand-design':
        return <GrandDesignPage />
      case 'galeri':
        return <GaleriPage />
      case 'kontak':
        return <KontakPage />
      case 'admin':
        return <AdminPage />
      default:
        return <HomePage />
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
