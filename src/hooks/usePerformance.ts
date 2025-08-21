import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  initWebVitals, 
  onWebVitals, 
  getWebVitalsData, 
  getPerformanceScore,
  getPerformanceRecommendations,
  type PerformanceMetric,
  type WebVitalsData
} from '../utils/webVitals';

/**
 * Performance monitoring and optimization hook
 */
export const usePerformance = () => {
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const [metrics, setMetrics] = useState<WebVitalsData>({});
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const metricsRef = useRef<{
    FCP?: number;
    LCP?: number;
    FID?: number;
    CLS?: number;
    TTFB?: number;
  }>({});

  // Measure Core Web Vitals
  const measureCoreWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    const measureFCP = () => {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        metricsRef.current.FCP = fcpEntry.startTime;
        console.log('FCP:', fcpEntry.startTime);
      }
    };

    // Largest Contentful Paint (LCP)
    const measureLCP = () => {
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          metricsRef.current.LCP = lastEntry.startTime;
          console.log('LCP:', lastEntry.startTime);
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observation not supported');
        }
      }
    };

    // First Input Delay (FID)
    const measureFID = () => {
      if ('PerformanceObserver' in window) {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            metricsRef.current.FID = entry.processingStart - entry.startTime;
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observation not supported');
        }
      }
    };

    // Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          metricsRef.current.CLS = clsValue;
          console.log('CLS:', clsValue);
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observation not supported');
        }
      }
    };

    // Time to First Byte (TTFB)
    const measureTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metricsRef.current.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
        console.log('TTFB:', navigationEntry.responseStart - navigationEntry.requestStart);
      }
    };

    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();
  }, []);

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    if (typeof window === 'undefined') return;

    const criticalResources = [
      { href: '/logo_digcity.png', as: 'image', type: 'image/png', priority: 'high' }
      // Note: Removed vite.svg preload to prevent unused preload warnings
    ];

    criticalResources.forEach(resource => {
      // Check if already preloaded
      const existing = document.querySelector(`link[href="${resource.href}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.as;
      link.href = resource.href;
      if (resource.type) link.type = resource.type;
      if (resource.priority === 'high') {
        link.fetchPriority = 'high';
      }
      if (resource.as === 'script') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }, []);

  // Optimize font loading
  const optimizeFontLoading = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Note: Font preloading removed to prevent 404 errors
    // Google Fonts will be loaded via CSS link in index.html
    // This prevents preload of potentially invalid font URLs

    // Add font-display: swap to existing font faces
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Implement resource hints
  const addResourceHints = useCallback(() => {
    if (typeof window === 'undefined') return;

    // DNS prefetch for external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Preconnect to critical third-party origins
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);

  // Lazy load non-critical resources
  const lazyLoadNonCritical = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Defer non-critical JavaScript
    const deferredScripts: string[] = [
      // Add non-critical scripts here
    ];

    deferredScripts.forEach(script => {
      const scriptElement = document.createElement('script');
      scriptElement.src = script;
      scriptElement.defer = true;
      document.head.appendChild(scriptElement);
    });
  }, []);

  // Monitor and report performance metrics
  const reportPerformanceMetrics = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Report to analytics or monitoring service
    setTimeout(() => {
      const metrics = metricsRef.current;
      
      // You can send these metrics to your analytics service
      console.log('Performance Metrics:', {
        FCP: metrics.FCP,
        LCP: metrics.LCP,
        FID: metrics.FID,
        CLS: metrics.CLS,
        TTFB: metrics.TTFB
      });

      // Example: Send to Google Analytics
      // if (window.gtag) {
      //   Object.entries(metrics).forEach(([metric, value]) => {
      //     if (value !== undefined) {
      //       window.gtag('event', metric, {
      //         event_category: 'Web Vitals',
      //         value: Math.round(value),
      //         non_interaction: true
      //       });
      //     }
      //   });
      // }
    }, 3000);
  }, []);

  // Get current Web Vitals data
  const getCurrentMetrics = useCallback(() => {
    return getWebVitalsData();
  }, []);

  // Initialize performance optimizations
  useEffect(() => {
    // Initialize Web Vitals measurement
    initWebVitals();
    
    // Subscribe to Web Vitals updates
    const unsubscribe = onWebVitals((metric: PerformanceMetric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name.toLowerCase()]: metric
      }));
      
      // Update performance score and recommendations
      setTimeout(() => {
        setPerformanceScore(getPerformanceScore());
        setRecommendations(getPerformanceRecommendations());
      }, 100);
    });

    preloadCriticalResources();
    optimizeFontLoading();
    addResourceHints();
    lazyLoadNonCritical();
    measureCoreWebVitals();
    reportPerformanceMetrics();
    setIsLoading(false);

    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
      unsubscribe();
    };
  }, []);

  return {
    metrics,
    performanceScore,
    recommendations,
    isLoading,
    preloadCriticalResources,
    measureCoreWebVitals,
    reportPerformanceMetrics,
    getCurrentMetrics
  };
};

/**
 * Hook for code splitting and lazy loading components
 */
export const useLazyLoading = () => {
  const loadComponent = useCallback(async (componentPath: string) => {
    try {
      const module = await import(/* @vite-ignore */ componentPath);
      return module.default || module;
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error);
      throw error;
    }
  }, []);

  const preloadComponent = useCallback((componentPath: string) => {
    // Preload component without rendering
    import(/* @vite-ignore */ componentPath).catch(error => {
      console.warn(`Failed to preload component: ${componentPath}`, error);
    });
  }, []);

  return {
    loadComponent,
    preloadComponent
  };
};

/**
 * Hook for optimizing images and media
 */
export const useMediaOptimization = () => {
  const optimizeImage = useCallback((src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}) => {
    const { width, height, quality = 80, format = 'auto' } = options;
    
    // In a real implementation, you might use a service like Cloudinary or ImageKit
    // For now, we'll return the original src with query parameters
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 80) params.set('q', quality.toString());
    if (format !== 'auto') params.set('f', format);
    
    const queryString = params.toString();
    return queryString ? `${src}?${queryString}` : src;
  }, []);

  const generateSrcSet = useCallback((src: string, sizes: number[]) => {
    return sizes
      .map(size => `${optimizeImage(src, { width: size })} ${size}w`)
      .join(', ');
  }, [optimizeImage]);

  return {
    optimizeImage,
    generateSrcSet
  };
};

/**
 * Hook for service worker and caching
 */
export const useServiceWorker = () => {
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    } else {
      console.warn('Service Worker not supported');
    }
  }, []);

  const updateServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  }, []);

  return {
    registerServiceWorker,
    updateServiceWorker
  };
};