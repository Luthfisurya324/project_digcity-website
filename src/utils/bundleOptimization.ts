/**
 * Bundle Optimization Utilities
 * Advanced code splitting and bundle optimization strategies
 */

// Dynamic import with error handling and retry logic
export const dynamicImport = async <T>(
  importFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      console.warn(`Dynamic import failed (attempt ${i + 1}/${retries}):`, error);
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Dynamic import failed after all retries');
};

// Preload module with priority
export const preloadModule = (importFn: () => Promise<any>, priority: 'high' | 'low' = 'low') => {
  if ('requestIdleCallback' in window && priority === 'low') {
    requestIdleCallback(() => {
      importFn().catch(error => {
        console.warn('Module preload failed:', error);
      });
    });
  } else {
    // High priority or no idle callback support
    setTimeout(() => {
      importFn().catch(error => {
        console.warn('Module preload failed:', error);
      });
    }, 0);
  }
};

// Bundle analyzer data collection
export const collectBundleMetrics = () => {
  const metrics = {
    totalScripts: 0,
    totalStyles: 0,
    scriptSizes: [] as number[],
    styleSizes: [] as number[],
    loadTimes: [] as number[],
    cacheHits: 0,
    cacheMisses: 0
  };

  // Analyze loaded scripts
  const scripts = document.querySelectorAll('script[src]');
  metrics.totalScripts = scripts.length;

  // Analyze loaded stylesheets
  const styles = document.querySelectorAll('link[rel="stylesheet"]');
  metrics.totalStyles = styles.length;

  // Get resource timing data
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    resources.forEach(resource => {
      if (resource.name.endsWith('.js')) {
        metrics.scriptSizes.push(resource.transferSize || 0);
        metrics.loadTimes.push(resource.duration);
        
        // Check cache status
        if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
          metrics.cacheHits++;
        } else {
          metrics.cacheMisses++;
        }
      } else if (resource.name.endsWith('.css')) {
        metrics.styleSizes.push(resource.transferSize || 0);
      }
    });
  }

  return metrics;
};

// Code splitting recommendations
export const getCodeSplittingRecommendations = () => {
  const recommendations: string[] = [];
  const metrics = collectBundleMetrics();

  // Check for large bundles
  const totalScriptSize = metrics.scriptSizes.reduce((sum, size) => sum + size, 0);
  if (totalScriptSize > 500 * 1024) { // 500KB
    recommendations.push('Consider splitting large JavaScript bundles');
  }

  // Check for too many requests
  if (metrics.totalScripts > 10) {
    recommendations.push('Consider bundling small scripts to reduce HTTP requests');
  }

  // Check cache efficiency
  const cacheHitRate = metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses);
  if (cacheHitRate < 0.8) {
    recommendations.push('Improve caching strategy for better performance');
  }

  // Check load times
  const avgLoadTime = metrics.loadTimes.reduce((sum, time) => sum + time, 0) / metrics.loadTimes.length;
  if (avgLoadTime > 1000) { // 1 second
    recommendations.push('Optimize resource loading times');
  }

  return recommendations;
};

// Module federation utilities
export const createModuleFederation = () => {
  const modules = new Map<string, Promise<any>>();
  const loadedModules = new Map<string, any>();

  return {
    // Register a remote module
    register: (name: string, url: string) => {
      if (!modules.has(name)) {
        modules.set(name, dynamicImport(() => import(/* @vite-ignore */ url)));
      }
    },

    // Load a module
    load: async (name: string) => {
      if (loadedModules.has(name)) {
        return loadedModules.get(name);
      }

      const modulePromise = modules.get(name);
      if (!modulePromise) {
        throw new Error(`Module '${name}' not registered`);
      }

      const module = await modulePromise;
      loadedModules.set(name, module);
      return module;
    },

    // Preload modules
    preload: (names: string[]) => {
      names.forEach(name => {
        const modulePromise = modules.get(name);
        if (modulePromise) {
          modulePromise.catch(() => {}); // Ignore errors for preloading
        }
      });
    },

    // Get loaded modules
    getLoaded: () => Array.from(loadedModules.keys()),

    // Clear cache
    clear: () => {
      modules.clear();
      loadedModules.clear();
    }
  };
};

// Tree shaking analyzer
export const analyzeTreeShaking = () => {
  const analysis = {
    unusedExports: [] as string[],
    largeModules: [] as string[],
    duplicateCode: [] as string[]
  };

  // This would typically be done at build time
  // Here we provide a runtime approximation
  
  if ('performance' in window) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    resources.forEach(resource => {
      if (resource.name.endsWith('.js') && resource.transferSize > 100 * 1024) { // 100KB
        analysis.largeModules.push(resource.name);
      }
    });
  }

  return analysis;
};

// Bundle size tracker
export class BundleSizeTracker {
  private sizes = new Map<string, number>();
  private timestamps = new Map<string, number>();

  track(bundleName: string, size: number) {
    this.sizes.set(bundleName, size);
    this.timestamps.set(bundleName, Date.now());
  }

  getSize(bundleName: string): number | undefined {
    return this.sizes.get(bundleName);
  }

  getTotalSize(): number {
    return Array.from(this.sizes.values()).reduce((sum, size) => sum + size, 0);
  }

  getSizeHistory(): Array<{ name: string; size: number; timestamp: number }> {
    return Array.from(this.sizes.entries()).map(([name, size]) => ({
      name,
      size,
      timestamp: this.timestamps.get(name) || 0
    }));
  }

  clear() {
    this.sizes.clear();
    this.timestamps.clear();
  }
}

// Lazy loading with intersection observer
export const createLazyLoader = (options: IntersectionObserverInit = {}) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  const observers = new Map<Element, () => void>();
  let observer: IntersectionObserver | null = null;

  const initObserver = () => {
    if (!observer && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const callback = observers.get(entry.target);
            if (callback) {
              callback();
              observer?.unobserve(entry.target);
              observers.delete(entry.target);
            }
          }
        });
      }, defaultOptions);
    }
  };

  return {
    observe: (element: Element, callback: () => void) => {
      initObserver();
      if (observer) {
        observers.set(element, callback);
        observer.observe(element);
      } else {
        // Fallback for browsers without IntersectionObserver
        callback();
      }
    },

    unobserve: (element: Element) => {
      if (observer) {
        observer.unobserve(element);
        observers.delete(element);
      }
    },

    disconnect: () => {
      if (observer) {
        observer.disconnect();
        observers.clear();
      }
    }
  };
};

// Resource prioritization
export const prioritizeResources = () => {
  const criticalResources = [
    '/logo_digcity.png',
    '/digital-innovation.png',
    '/src/styles/performance.css'
  ];

  const nonCriticalResources: string[] = [
    // Add non-critical resources here
  ];

  // Preload critical resources
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.png') || resource.endsWith('.jpg') || resource.endsWith('.svg')) {
      link.as = 'image';
    } else if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    }
    
    document.head.appendChild(link);
  });

  // Lazy load non-critical resources
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      nonCriticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
      });
    });
  }
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  const budget = {
    maxBundleSize: 500 * 1024, // 500KB
    maxResourceCount: 50,
    maxLoadTime: 3000 // 3 seconds
  };

  const violations: string[] = [];
  const metrics = collectBundleMetrics();

  // Check bundle size
  const totalSize = metrics.scriptSizes.reduce((sum, size) => sum + size, 0);
  if (totalSize > budget.maxBundleSize) {
    violations.push(`Bundle size (${Math.round(totalSize / 1024)}KB) exceeds budget (${budget.maxBundleSize / 1024}KB)`);
  }

  // Check resource count
  const totalResources = metrics.totalScripts + metrics.totalStyles;
  if (totalResources > budget.maxResourceCount) {
    violations.push(`Resource count (${totalResources}) exceeds budget (${budget.maxResourceCount})`);
  }

  // Check load time
  const maxLoadTime = Math.max(...metrics.loadTimes);
  if (maxLoadTime > budget.maxLoadTime) {
    violations.push(`Max load time (${Math.round(maxLoadTime)}ms) exceeds budget (${budget.maxLoadTime}ms)`);
  }

  return {
    passed: violations.length === 0,
    violations,
    metrics: {
      bundleSize: totalSize,
      resourceCount: totalResources,
      maxLoadTime
    }
  };
};

// Initialize bundle optimization
export const initBundleOptimization = () => {
  // Prioritize resources
  prioritizeResources();

  // Track bundle metrics
  const tracker = new BundleSizeTracker();
  
  // Monitor performance budget in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      const budgetCheck = checkPerformanceBudget();
      if (!budgetCheck.passed) {
        console.warn('Performance budget violations:', budgetCheck.violations);
      }
    }, 5000);
  }

  return {
    tracker,
    lazyLoader: createLazyLoader(),
    moduleFederation: createModuleFederation()
  };
};

// Export singleton instance
export const bundleOptimization = initBundleOptimization();