/**
 * Image optimization utilities for better performance and SEO
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  lazy?: boolean;
  priority?: boolean;
}

/**
 * Generate optimized image attributes for better performance
 */
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  options: ImageOptimizationOptions = {}
) => {
  const {
    width,
    height,
    lazy = true,
    priority = false
  } = options;

  const baseProps = {
    src,
    alt,
    ...(width && { width }),
    ...(height && { height }),
    decoding: priority ? 'sync' : 'async',
    loading: lazy && !priority ? 'lazy' : 'eager'
  } as const;

  return baseProps;
};

/**
 * Generate responsive image srcset for different screen sizes
 */
export const generateResponsiveImageProps = (
  baseSrc: string,
  alt: string,
  sizes: { width: number; suffix?: string }[]
) => {
  const srcSet = sizes
    .map(({ width, suffix = '' }) => {
      const src = baseSrc.replace(/\.(\w+)$/, `${suffix}.$1`);
      return `${src} ${width}w`;
    })
    .join(', ');

  return {
    src: baseSrc,
    srcSet,
    alt,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  };
};

/**
 * Preload critical images for better performance
 */
export const preloadImage = (src: string, as: 'image' = 'image') => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = src;
    document.head.appendChild(link);
  }
};

/**
 * Lazy load images with Intersection Observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
              this.observer?.unobserve(img);
              this.images.delete(img);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
    }
  }

  observe(img: HTMLImageElement) {
    if (this.observer && img) {
      this.images.add(img);
      this.observer.observe(img);
    }
  }

  private loadImage(img: HTMLImageElement) {
    const dataSrc = img.getAttribute('data-src');
    const dataSrcSet = img.getAttribute('data-srcset');
    
    if (dataSrc) {
      img.src = dataSrc;
      img.removeAttribute('data-src');
    }
    
    if (dataSrcSet) {
      img.srcset = dataSrcSet;
      img.removeAttribute('data-srcset');
    }
    
    img.classList.add('loaded');
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

/**
 * Image format detection and fallback
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = async (originalSrc: string): Promise<string> => {
  const extension = originalSrc.split('.').pop()?.toLowerCase();
  
  // If it's already an optimized format, return as is
  if (extension === 'webp' || extension === 'avif') {
    return originalSrc;
  }
  
  // For now, return original source to avoid 404 errors
  // In production, you would check if optimized versions exist
  return originalSrc;
  
  // TODO: Implement server-side image optimization or check file existence
  // if (await supportsAVIF()) {
  //   return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
  // } else if (await supportsWebP()) {
  //   return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  // }
};

/**
 * Generate picture element with multiple format sources
 */
export const generatePictureElement = (baseSrc: string, alt: string, options: ImageOptimizationOptions = {}) => {
  const { width, height, lazy = true, priority = false } = options;
  
  const sources = [
    {
      srcSet: baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif'),
      type: 'image/avif'
    },
    {
      srcSet: baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
      type: 'image/webp'
    }
  ];
  
  return {
    sources,
    img: {
      src: baseSrc,
      alt,
      width,
      height,
      loading: lazy && !priority ? 'lazy' : 'eager',
      decoding: priority ? 'sync' : 'async'
    }
  };
};

/**
 * Modern image format detection with caching
 */
const formatSupportCache = new Map<string, boolean>();

export const checkFormatSupport = async (format: 'webp' | 'avif'): Promise<boolean> => {
  if (formatSupportCache.has(format)) {
    return formatSupportCache.get(format)!;
  }
  
  const supported = format === 'webp' ? await supportsWebP() : await supportsAVIF();
  formatSupportCache.set(format, supported);
  return supported;
};

/**
 * Generate responsive image with modern formats
 */
export const generateModernImageSrcSet = async (baseSrc: string, sizes: number[] = [480, 768, 1024, 1280, 1920]) => {
  const [supportsAvif, supportsWebp] = await Promise.all([
    checkFormatSupport('avif'),
    checkFormatSupport('webp')
  ]);
  
  const generateSrcSet = (format: string) => {
    return sizes.map(size => {
      const src = baseSrc.replace(/\.(\w+)$/, `_${size}w.${format}`);
      return `${src} ${size}w`;
    }).join(', ');
  };
  
  const sources = [];
  
  if (supportsAvif) {
    sources.push({
      srcSet: generateSrcSet('avif'),
      type: 'image/avif'
    });
  }
  
  if (supportsWebp) {
    sources.push({
      srcSet: generateSrcSet('webp'),
      type: 'image/webp'
    });
  }
  
  // Fallback to original format
  const originalExt = baseSrc.split('.').pop();
  sources.push({
    srcSet: generateSrcSet(originalExt || 'jpg'),
    type: `image/${originalExt}`
  });
  
  return sources;
};

/**
 * Image compression utility (client-side)
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve: (value: Blob) => void, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generate blur placeholder for images
 */
export const generateBlurPlaceholder = (width: number = 10, height: number = 10): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = width;
  canvas.height = height;
  
  // Create a simple gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
};