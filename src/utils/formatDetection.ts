/**
 * Browser format detection and HTML class management
 */

import { checkFormatSupport } from './imageOptimization';

/**
 * Add format support classes to HTML element
 */
export const addFormatSupportClasses = async (): Promise<void> => {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  
  try {
    // Check WebP support
    const webpSupported = await checkFormatSupport('webp');
    if (webpSupported) {
      html.classList.add('webp');
    } else {
      html.classList.add('no-webp');
    }

    // Check AVIF support
    const avifSupported = await checkFormatSupport('avif');
    if (avifSupported) {
      html.classList.add('avif');
    } else {
      html.classList.add('no-avif');
    }

    // Add modern formats class if any modern format is supported
    if (webpSupported || avifSupported) {
      html.classList.add('modern-formats');
    } else {
      html.classList.add('legacy-formats');
    }

  } catch (error) {
    console.warn('Failed to detect image format support:', error);
    html.classList.add('no-webp', 'no-avif', 'legacy-formats');
  }
};

/**
 * Get supported image formats in order of preference
 */
export const getSupportedFormats = async (): Promise<string[]> => {
  const formats: string[] = [];
  
  try {
    if (await checkFormatSupport('avif')) {
      formats.push('avif');
    }
    
    if (await checkFormatSupport('webp')) {
      formats.push('webp');
    }
    
    // Always include fallback formats
    formats.push('jpg', 'jpeg', 'png');
    
  } catch (error) {
    console.warn('Failed to check format support:', error);
    return ['jpg', 'jpeg', 'png'];
  }
  
  return formats;
};

/**
 * Check if browser supports modern image formats
 */
export const supportsModernFormats = async (): Promise<boolean> => {
  try {
    const [webp, avif] = await Promise.all([
      checkFormatSupport('webp'),
      checkFormatSupport('avif')
    ]);
    
    return webp || avif;
  } catch (error) {
    console.warn('Failed to check modern format support:', error);
    return false;
  }
};

/**
 * Initialize format detection on page load
 */
export const initFormatDetection = (): void => {
  if (typeof window !== 'undefined') {
    // Run immediately if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addFormatSupportClasses);
    } else {
      addFormatSupportClasses();
    }
  }
};

/**
 * Get optimal image URL based on browser support
 */
export const getOptimalImageUrl = async (baseUrl: string, availableFormats: string[] = ['avif', 'webp', 'jpg']): Promise<string> => {
  const supportedFormats = await getSupportedFormats();
  
  // Find the first supported format that's available
  for (const format of supportedFormats) {
    if (availableFormats.includes(format)) {
      return baseUrl.replace(/\.(\w+)$/, `.${format}`);
    }
  }
  
  // Fallback to original URL
  return baseUrl;
};

/**
 * Performance monitoring for image format detection
 */
export const measureFormatDetectionPerformance = async (): Promise<{ webp: number; avif: number; total: number }> => {
  const startTime = performance.now();
  
  const webpStart = performance.now();
  await checkFormatSupport('webp');
  const webpTime = performance.now() - webpStart;
  
  const avifStart = performance.now();
  await checkFormatSupport('avif');
  const avifTime = performance.now() - avifStart;
  
  const totalTime = performance.now() - startTime;
  
  return {
    webp: webpTime,
    avif: avifTime,
    total: totalTime
  };
};