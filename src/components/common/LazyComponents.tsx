import React, { lazy, Suspense, type ComponentType } from 'react'

// Optimized loading component with reduced animation overhead
const LoadingSpinner = React.memo(() => (
  <div className="flex items-center justify-center min-h-[400px]" role="status" aria-label="Loading">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin will-change-transform"></div>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
))

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component loading error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error!} />
    }

    return this.props.children
  }
}

// Default error fallback
const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
    <div className="text-red-600 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
    <p className="text-gray-600 mb-4">Failed to load this page. Please try refreshing.</p>
    <button 
      onClick={() => window.location.reload()} 
      className="interactive-element px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Refresh Page
    </button>
    {import.meta.env.DEV && (
      <details className="mt-4 text-left">
        <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
        <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-w-md">
          {error.message}
        </pre>
      </details>
    )}
  </div>
)

// Higher-order component for lazy loading with error boundary and optimized rendering
function withLazyLoading<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallbackComponent: React.ComponentType = LoadingSpinner,
  errorFallback?: React.ComponentType<{ error: Error }>
) {
  const LazyComponent = lazy(importFunc)
  
  return React.memo(function LazyWrapper(props: T) {
    const FallbackComponent = fallbackComponent
    return (
      <LazyErrorBoundary fallback={errorFallback}>
        <Suspense fallback={<FallbackComponent />}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyErrorBoundary>
    )
  })
}

// Lazy loaded components
export const LazyBlogPage = withLazyLoading(
  () => import('../../pages/blog/BlogPage'),
  LoadingSpinner
)

export const LazyBlogDetailPage = withLazyLoading(
  () => import('../../pages/blog/BlogDetailPage'),
  LoadingSpinner
)

export const LazyEventsPage = withLazyLoading(
  () => import('../../pages/events/EventsPage'),
  LoadingSpinner
)

export const LazySejarahPage = withLazyLoading(
  () => import('../../pages/about/SejarahPage'),
  LoadingSpinner
)

export const LazyLogoPage = withLazyLoading(
  () => import('../../pages/about/LogoPage'),
  LoadingSpinner
)

export const LazyVisiMisiPage = withLazyLoading(
  () => import('../../pages/about/VisiMisiPage'),
  LoadingSpinner
)

export const LazyStrukturOrganisasiPage = withLazyLoading(
  () => import('../../pages/about/StrukturOrganisasiPage'),
  LoadingSpinner
)

export const LazyGrandDesignPage = withLazyLoading(
  () => import('../../pages/about/GrandDesignPage'),
  LoadingSpinner
)

export const LazyGaleriPage = withLazyLoading(
  () => import('../../pages/gallery/GaleriPage'),
  LoadingSpinner
)

export const LazyKontakPage = withLazyLoading(
  () => import('../../pages/contact/KontakPage'),
  LoadingSpinner
)

export const LazyAdminPage = withLazyLoading(
  () => import('../../pages/AdminPanel'),
  LoadingSpinner
)

// Preload functions for critical pages
// Enhanced preload cache to avoid duplicate loading
const preloadCache = new Set<string>()
const componentCache = new Map<string, Promise<any>>()

// Predictive preloading based on user behavior
const userBehaviorTracker = {
  visitedPages: new Set<string>(),
  navigationPatterns: new Map<string, string[]>(),
  
  trackVisit(page: string, previousPage?: string) {
    this.visitedPages.add(page)
    if (previousPage) {
      const pattern = this.navigationPatterns.get(previousPage) || []
      pattern.push(page)
      this.navigationPatterns.set(previousPage, pattern)
    }
  },
  
  getPredictedPages(currentPage: string): string[] {
    const patterns = this.navigationPatterns.get(currentPage) || []
    // Return most frequently visited pages from current page
    const frequency = new Map<string, number>()
    patterns.forEach(page => {
      frequency.set(page, (frequency.get(page) || 0) + 1)
    })
    return Array.from(frequency.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([page]) => page)
  }
}

// Optimized preload function for critical pages with enhanced caching
export const preloadCriticalPages = () => {
  // Enhanced critical pages based on analytics and user patterns
  const criticalPages = [
    { name: 'blog', importFunc: () => import('../../pages/blog/BlogPage'), priority: 'high' },
    { name: 'events', importFunc: () => import('../../pages/events/EventsPage'), priority: 'high' },
    { name: 'kontak', importFunc: () => import('../../pages/contact/KontakPage'), priority: 'medium' },
    { name: 'galeri', importFunc: () => import('../../pages/gallery/GaleriPage'), priority: 'medium' },
    { name: 'grand-design', importFunc: () => import('../../pages/about/GrandDesignPage'), priority: 'low' }
  ]
  
  const preloadWithIdleCallback = () => {
    criticalPages.forEach(({ name, importFunc, priority }, index) => {
      // Skip if already preloaded
      if (preloadCache.has(name)) return
      
      const delay = priority === 'high' ? index * 30 : index * 100
      
      setTimeout(() => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            preloadCache.add(name)
            const promise = importFunc().catch(error => {
              console.warn(`Failed to preload critical page ${name}:`, error)
              preloadCache.delete(name) // Remove from cache on failure
            })
            componentCache.set(name, promise)
          }, { timeout: priority === 'high' ? 2000 : 5000 })
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            preloadCache.add(name)
            const promise = importFunc().catch(error => {
              console.warn(`Failed to preload critical page ${name}:`, error)
              preloadCache.delete(name)
            })
            componentCache.set(name, promise)
          }, 100)
        }
      }, delay)
    })
  }
  
  preloadWithIdleCallback()
}

// Enhanced preload function with caching and predictive loading
export const preloadPage = (pageName: string, currentPage?: string) => {
  // Skip if already preloaded or cached
  if (preloadCache.has(pageName) || componentCache.has(pageName)) {
    return componentCache.get(pageName)
  }
  
  const pageImports: Record<string, () => Promise<any>> = {
    blog: () => import('../../pages/blog/BlogPage'),
    'blog-detail': () => import('../../pages/blog/BlogDetailPage'),
    events: () => import('../../pages/events/EventsPage'),
    sejarah: () => import('../../pages/about/SejarahPage'),
    logo: () => import('../../pages/about/LogoPage'),
    'visi-misi': () => import('../../pages/about/VisiMisiPage'),
    'struktur-organisasi': () => import('../../pages/about/StrukturOrganisasiPage'),
    'grand-design': () => import('../../pages/about/GrandDesignPage'),
    galeri: () => import('../../pages/gallery/GaleriPage'),
    kontak: () => import('../../pages/contact/KontakPage'),
    admin: () => import('../../pages/AdminPanel')
  }
  
  const importFunc = pageImports[pageName]
  if (importFunc) {
    preloadCache.add(pageName)
    
    const loadPromise = new Promise<any>((resolve, reject) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          importFunc()
            .then(resolve)
            .catch(error => {
              console.warn(`Failed to preload page ${pageName}:`, error)
              preloadCache.delete(pageName)
              reject(error)
            })
        }, { timeout: 3000 })
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          importFunc()
            .then(resolve)
            .catch(error => {
              console.warn(`Failed to preload page ${pageName}:`, error)
              preloadCache.delete(pageName)
              reject(error)
            })
        }, 100)
      }
    })
    
    componentCache.set(pageName, loadPromise)
    
    // Track user behavior and preload predicted pages
    if (currentPage) {
      userBehaviorTracker.trackVisit(pageName, currentPage)
      const predictedPages = userBehaviorTracker.getPredictedPages(pageName)
      
      // Preload predicted pages with lower priority
      predictedPages.forEach((predictedPage, index) => {
        setTimeout(() => {
          if (!preloadCache.has(predictedPage)) {
            preloadPage(predictedPage)
          }
        }, (index + 1) * 200)
      })
    }
    
    return loadPromise
  }
  
  return Promise.resolve(null)
}

// Enhanced intersection observer hook with adaptive thresholds
export const useIntersectionPreload = (pageName: string, options?: {
  threshold?: number
  rootMargin?: string
  priority?: 'high' | 'medium' | 'low'
}) => {
  const { threshold = 0.1, rootMargin = '100px', priority = 'medium' } = options || {}
  const [ref, setRef] = React.useState<HTMLElement | null>(null)
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  
  React.useEffect(() => {
    if (!ref) return
    
    // Adaptive threshold based on connection speed
    const connection = (navigator as any).connection
    const adaptiveThreshold = connection?.effectiveType === '4g' ? threshold : Math.max(threshold * 2, 0.3)
    const adaptiveRootMargin = connection?.effectiveType === '4g' ? rootMargin : '50px'
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Preload with priority consideration
            const delay = priority === 'high' ? 0 : priority === 'medium' ? 50 : 150
            
            setTimeout(() => {
              preloadPage(pageName)
            }, delay)
            
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { 
        threshold: adaptiveThreshold,
        rootMargin: adaptiveRootMargin
      }
    )
    
    observerRef.current.observe(ref)
    
    return () => {
      observerRef.current?.disconnect()
    }
  }, [ref, pageName, threshold, rootMargin, priority])
  
  return setRef
}

// Hook for hover-based preloading with debounce
export const useHoverPreload = (pageName: string, delay = 300) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  
  const handleMouseEnter = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      preloadPage(pageName)
    }, delay)
  }, [pageName, delay])
  
  const handleMouseLeave = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])
  
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return { handleMouseEnter, handleMouseLeave }
}

// Performance monitoring for lazy loading
export const getLazyLoadingMetrics = () => {
  return {
    preloadedComponents: preloadCache.size,
    cachedComponents: componentCache.size,
    visitedPages: userBehaviorTracker.visitedPages.size,
    navigationPatterns: Object.fromEntries(userBehaviorTracker.navigationPatterns)
  }
}

// Export loading and error components for reuse
export { LoadingSpinner, DefaultErrorFallback, LazyErrorBoundary }