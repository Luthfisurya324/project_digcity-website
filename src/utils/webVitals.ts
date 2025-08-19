/**
 * Web Vitals Measurement and Reporting Utilities
 * This file provides functions to measure and report Core Web Vitals
 */

// Global gtag declaration
declare global {
  function gtag(...args: any[]): void;
}

// Core Web Vitals thresholds (in milliseconds)
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint
  LCP: {
    GOOD: 2500,
    NEEDS_IMPROVEMENT: 4000
  },
  // First Input Delay
  FID: {
    GOOD: 100,
    NEEDS_IMPROVEMENT: 300
  },
  // Cumulative Layout Shift
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25
  },
  // First Contentful Paint
  FCP: {
    GOOD: 1800,
    NEEDS_IMPROVEMENT: 3000
  },
  // Time to First Byte
  TTFB: {
    GOOD: 800,
    NEEDS_IMPROVEMENT: 1800
  },
  // Interaction to Next Paint
  INP: {
    GOOD: 200,
    NEEDS_IMPROVEMENT: 500
  }
};

// Performance metric interface
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  id?: string;
  navigationType?: string;
}

// Web Vitals data interface
export interface WebVitalsData {
  lcp?: PerformanceMetric;
  fid?: PerformanceMetric;
  cls?: PerformanceMetric;
  fcp?: PerformanceMetric;
  ttfb?: PerformanceMetric;
  inp?: PerformanceMetric;
}

// Performance observer callback type
type PerformanceCallback = (metric: PerformanceMetric) => void;

// Global storage for metrics
const webVitalsData: WebVitalsData = {};
const callbacks: PerformanceCallback[] = [];

/**
 * Get rating based on metric value and thresholds
 */
function getRating(value: number, thresholds: { GOOD: number; NEEDS_IMPROVEMENT: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.GOOD) return 'good';
  if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement';
  return 'poor';
}

/**
 * Generate unique ID for metric
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get navigation type
 */
function getNavigationType(): string {
  if ('navigation' in performance && 'type' in performance.navigation) {
    const types = ['navigate', 'reload', 'back_forward', 'prerender'];
    return types[performance.navigation.type] || 'navigate';
  }
  return 'navigate';
}

/**
 * Report metric to all registered callbacks
 */
function reportMetric(metric: PerformanceMetric): void {
  callbacks.forEach(callback => {
    try {
      callback(metric);
    } catch (error) {
      console.warn('Error in web vitals callback:', error);
    }
  });
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
function measureLCP(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      
      if (lastEntry) {
        const value = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
        const metric: PerformanceMetric = {
          name: 'LCP',
          value: Math.round(value),
          rating: getRating(value, WEB_VITALS_THRESHOLDS.LCP),
          timestamp: Date.now(),
          id: generateId(),
          navigationType: getNavigationType()
        };
        
        webVitalsData.lcp = metric;
        reportMetric(metric);
      }
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.warn('Error measuring LCP:', error);
  }
}

/**
 * Measure First Input Delay (FID)
 */
function measureFID(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as PerformanceEntry & { processingStart?: number };
      
      if (firstEntry) {
        const value = firstEntry.processingStart ? firstEntry.processingStart - firstEntry.startTime : 0;
        const metric: PerformanceMetric = {
          name: 'FID',
          value: Math.round(value),
          rating: getRating(value, WEB_VITALS_THRESHOLDS.FID),
          timestamp: Date.now(),
          id: generateId(),
          navigationType: getNavigationType()
        };
        
        webVitalsData.fid = metric;
        reportMetric(metric);
      }
    });
    
    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.warn('Error measuring FID:', error);
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
function measureCLS(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      for (const entry of entries) {
        const layoutShiftEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
        
        if (!layoutShiftEntry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
          
          if (sessionValue && 
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += layoutShiftEntry.value || 0;
            sessionEntries.push(entry);
          } else {
            sessionValue = layoutShiftEntry.value || 0;
            sessionEntries = [entry];
          }
          
          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            
            const metric: PerformanceMetric = {
              name: 'CLS',
              value: Math.round(clsValue * 1000) / 1000,
              rating: getRating(clsValue, WEB_VITALS_THRESHOLDS.CLS),
              timestamp: Date.now(),
              id: generateId(),
              navigationType: getNavigationType()
            };
            
            webVitalsData.cls = metric;
            reportMetric(metric);
          }
        }
      }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.warn('Error measuring CLS:', error);
  }
}

/**
 * Measure First Contentful Paint (FCP)
 */
function measureFCP(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        const value = fcpEntry.startTime;
        const metric: PerformanceMetric = {
          name: 'FCP',
          value: Math.round(value),
          rating: getRating(value, WEB_VITALS_THRESHOLDS.FCP),
          timestamp: Date.now(),
          id: generateId(),
          navigationType: getNavigationType()
        };
        
        webVitalsData.fcp = metric;
        reportMetric(metric);
      }
    });
    
    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.warn('Error measuring FCP:', error);
  }
}

/**
 * Measure Time to First Byte (TTFB)
 */
function measureTTFB(): void {
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigationEntry) {
      const value = navigationEntry.responseStart - navigationEntry.requestStart;
      const metric: PerformanceMetric = {
        name: 'TTFB',
        value: Math.round(value),
        rating: getRating(value, WEB_VITALS_THRESHOLDS.TTFB),
        timestamp: Date.now(),
        id: generateId(),
        navigationType: getNavigationType()
      };
      
      webVitalsData.ttfb = metric;
      reportMetric(metric);
    }
  } catch (error) {
    console.warn('Error measuring TTFB:', error);
  }
}

/**
 * Measure Interaction to Next Paint (INP)
 */
function measureINP(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    let longestInteraction = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      for (const entry of entries) {
        const eventEntry = entry as PerformanceEntry & { duration?: number };
        
        if (eventEntry.duration && eventEntry.duration > longestInteraction) {
          longestInteraction = eventEntry.duration;
          
          const metric: PerformanceMetric = {
            name: 'INP',
            value: Math.round(longestInteraction),
            rating: getRating(longestInteraction, WEB_VITALS_THRESHOLDS.INP),
            timestamp: Date.now(),
            id: generateId(),
            navigationType: getNavigationType()
          };
          
          webVitalsData.inp = metric;
          reportMetric(metric);
        }
      }
    });
    
    observer.observe({ type: 'event', buffered: true });
  } catch (error) {
    console.warn('Error measuring INP:', error);
  }
}

/**
 * Initialize all Web Vitals measurements
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined') return;
  
  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      measureFCP();
      measureLCP();
      measureFID();
      measureCLS();
      measureTTFB();
      measureINP();
    });
  } else {
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();
    measureINP();
  }
}

/**
 * Register callback for Web Vitals updates
 */
export function onWebVitals(callback: PerformanceCallback): () => void {
  callbacks.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  };
}

/**
 * Get current Web Vitals data
 */
export function getWebVitalsData(): WebVitalsData {
  return { ...webVitalsData };
}

/**
 * Send Web Vitals to analytics service
 */
export function sendWebVitalsToAnalytics(metric: PerformanceMetric): void {
  // Example implementation - replace with your analytics service
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      custom_map: {
        metric_rating: metric.rating,
        navigation_type: metric.navigationType
      }
    });
  }
  
  // Console logging for development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      timestamp: new Date(metric.timestamp).toISOString()
    });
  }
}

/**
 * Get performance score based on all metrics
 */
export function getPerformanceScore(): number {
  const metrics = Object.values(webVitalsData);
  if (metrics.length === 0) return 0;
  
  const scores = metrics.map(metric => {
    switch (metric.rating) {
      case 'good': return 100;
      case 'needs-improvement': return 50;
      case 'poor': return 0;
      default: return 0;
    }
  });
  
  return Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length);
}

/**
 * Get performance recommendations
 */
export function getPerformanceRecommendations(): string[] {
  const recommendations: string[] = [];
  
  if (webVitalsData.lcp && webVitalsData.lcp.rating !== 'good') {
    recommendations.push('Optimize Largest Contentful Paint by reducing server response times and optimizing images');
  }
  
  if (webVitalsData.fid && webVitalsData.fid.rating !== 'good') {
    recommendations.push('Improve First Input Delay by reducing JavaScript execution time and using web workers');
  }
  
  if (webVitalsData.cls && webVitalsData.cls.rating !== 'good') {
    recommendations.push('Reduce Cumulative Layout Shift by setting dimensions for images and avoiding dynamic content insertion');
  }
  
  if (webVitalsData.fcp && webVitalsData.fcp.rating !== 'good') {
    recommendations.push('Optimize First Contentful Paint by eliminating render-blocking resources and optimizing fonts');
  }
  
  if (webVitalsData.ttfb && webVitalsData.ttfb.rating !== 'good') {
    recommendations.push('Improve Time to First Byte by optimizing server performance and using CDN');
  }
  
  return recommendations;
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  initWebVitals();
  
  // Register default analytics callback
  onWebVitals(sendWebVitalsToAnalytics);
}