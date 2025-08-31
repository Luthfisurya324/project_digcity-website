import { useEffect, useRef, useCallback } from 'react'

interface PerformanceMetrics {
  FCP: number | null
  LCP: number | null
  FID: number | null
  CLS: number | null
  TTFB: number | null
}

export const usePerformance = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null
  })

  const observersRef = useRef<PerformanceObserver[]>([])
  const loggedMetrics = useRef<Set<string>>(new Set())

  // Measure Core Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Helper function untuk log metrics dengan debouncing
    const logMetric = (metricName: string, value: number) => {
      const key = `${metricName}-${Math.round(value)}`
      if (!loggedMetrics.current.has(key)) {
        console.log(`${metricName}:`, value)
        loggedMetrics.current.add(key)
      }
    }

    // First Contentful Paint (FCP)
    const measureFCP = () => {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            metricsRef.current.FCP = entry.startTime
            logMetric('FCP', entry.startTime)
          }
        })
      })
      observer.observe({ entryTypes: ['paint'] })
      observersRef.current.push(observer)
    }

    // Largest Contentful Paint (LCP)
    const measureLCP = () => {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          metricsRef.current.LCP = lastEntry.startTime
          logMetric('LCP', lastEntry.startTime)
        }
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      observersRef.current.push(observer)
    }

    // First Input Delay (FID)
    const measureFID = () => {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry: any) => {
          const fidValue = entry.processingStart - entry.startTime
          metricsRef.current.FID = fidValue
          logMetric('FID', fidValue)
        })
      })
      observer.observe({ entryTypes: ['first-input'] })
      observersRef.current.push(observer)
    }

    // Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      let clsValue = 0
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        metricsRef.current.CLS = clsValue
        logMetric('CLS', clsValue)
      })
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] })
        observersRef.current.push(observer)
      } catch (e) {
        console.warn('CLS observation not supported')
      }
    }

    // Time to First Byte (TTFB)
    const measureTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        const ttfbValue = navigationEntry.responseStart - navigationEntry.requestStart
        metricsRef.current.TTFB = ttfbValue
        logMetric('TTFB', ttfbValue)
      }
    }

    measureFCP()
    measureLCP()
    measureFID()
    measureCLS()
    measureTTFB()

    // Cleanup function
    return () => {
      observersRef.current.forEach(observer => {
        try {
          observer.disconnect()
        } catch (e) {
          console.warn('Error disconnecting observer:', e)
        }
      })
      observersRef.current = []
      loggedMetrics.current.clear()
    }
  }, [])

  // Optimize font loading
  const optimizeFontLoading = useCallback(() => {
    if (typeof window === 'undefined') return

    // Note: Font preloading removed to prevent 404 errors
    // Google Fonts will be loaded via CSS link in index.html
    // This prevents preload of potentially invalid font URLs

    // Add font-display: swap to existing font faces
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `
    document.head.appendChild(style)
  }, [])

  // Implement resource hints
  const addResourceHints = useCallback(() => {
    if (typeof window === 'undefined') return

    // DNS prefetch for external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com'
    ]

    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })

    // Preconnect to critical third-party origins
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }, [])

  // Lazy load non-critical resources
  const lazyLoadNonCritical = useCallback(() => {
    if (typeof window === 'undefined') return

    // Defer non-critical JavaScript
    const deferredScripts: string[] = [
      // Add non-critical scripts here
    ]

    deferredScripts.forEach(script => {
      const scriptElement = document.createElement('script')
      scriptElement.src = script
      scriptElement.defer = true
      document.head.appendChild(scriptElement)
    })
  }, [])

  // Initialize all optimizations
  const initializeOptimizations = useCallback(() => {
    if (typeof window === 'undefined') return

    // Initialize font optimization
    optimizeFontLoading()
    
    // Add resource hints
    addResourceHints()
    
    // Lazy load non-critical resources
    lazyLoadNonCritical()
  }, [optimizeFontLoading, addResourceHints, lazyLoadNonCritical])

  // Get current metrics
  const getMetrics = useCallback(() => {
    return { ...metricsRef.current }
  }, [])

  // Reset metrics
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      FCP: null,
      LCP: null,
      FID: null,
      CLS: null,
      TTFB: null
    }
  }, [])

  // Initialize optimizations on mount
  useEffect(() => {
    initializeOptimizations()
  }, [initializeOptimizations])

  return {
    metrics: metricsRef.current,
    getMetrics,
    resetMetrics,
    initializeOptimizations
  }
}

// Hook for component preloading
export const useComponentPreload = () => {
  const componentCache = new Map<string, any>()
  const preloadCache = new Set<string>()

  // Preload component without rendering
  const preloadComponent = useCallback((componentPath: string) => {
    try {
      // Skip if already preloaded
      if (preloadCache.has(componentPath)) return

      // Add to preload cache
      preloadCache.add(componentPath)
    } catch (error) {
      console.warn(`Failed to preload component: ${componentPath}`, error)
    }
  }, [])

  return {
    preloadComponent
  }
}

// Hook for intersection-based preloading
export const useIntersectionPreload = (pageName: string, options?: {
  threshold?: number
  rootMargin?: string
}) => {
  const { preloadComponent } = useComponentPreload()

  const intersectionCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Preload with priority consideration
        requestIdleCallback(() => {
          preloadComponent(pageName)
        })
      }
    })
  }, [pageName, preloadComponent])

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(intersectionCallback, {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '50px'
      })
      observer.observe(node)
      return () => observer.disconnect()
    }
  }, [intersectionCallback, options])

  return { ref }
}

// Hook for hover-based preloading with debounce
export const useHoverPreload = (pageName: string, delay = 300) => {
  const { preloadComponent } = useComponentPreload()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleHover = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      preloadComponent(pageName)
    }, delay)
  }, [pageName, delay])

  const handleLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    handleHover,
    handleLeave
  }
}