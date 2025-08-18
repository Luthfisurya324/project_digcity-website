import React, { useState, useRef, useEffect } from 'react';
import { getOptimizedImageProps, LazyImageLoader, generateBlurPlaceholder, getOptimalImageFormat, checkFormatSupport } from '../utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  lazy?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  lazy = true,
  quality = 80,
  placeholder = 'blur',
  onLoad,
  onError,
  sizes,
  srcSet,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string>('');
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [, setSupportsModernFormats] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const lazyLoaderRef = useRef<LazyImageLoader | null>(null);

  // Check modern format support and optimize image source
  useEffect(() => {
    const optimizeImageSource = async () => {
      try {
        // Check if browser supports modern formats
        const [webpSupport, avifSupport] = await Promise.all([
          checkFormatSupport('webp'),
          checkFormatSupport('avif')
        ]);
        
        setSupportsModernFormats(webpSupport || avifSupport);
        
        // Get optimal image format
        const optimalSrc = await getOptimalImageFormat(src);
        setOptimizedSrc(optimalSrc);
      } catch (error) {
        console.warn('Failed to optimize image format:', error);
        setOptimizedSrc(src);
      }
    };

    optimizeImageSource();
  }, [src]);

  // Generate blur placeholder
  useEffect(() => {
    if (placeholder === 'blur' && width && height) {
      const blurUrl = generateBlurPlaceholder(Math.min(width / 10, 40), Math.min(height / 10, 40));
      setBlurDataUrl(blurUrl);
    }
  }, [placeholder, width, height]);

  // Initialize lazy loader
  useEffect(() => {
    if (lazy && !priority) {
      lazyLoaderRef.current = new LazyImageLoader();
      return () => {
        lazyLoaderRef.current?.disconnect();
      };
    }
  }, [lazy, priority]);

  // Setup lazy loading
  useEffect(() => {
    if (imgRef.current && lazy && !priority && lazyLoaderRef.current) {
      lazyLoaderRef.current.observe(imgRef.current);
    }
  }, [lazy, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageProps = getOptimizedImageProps(optimizedSrc, alt, {
    width,
    height,
    lazy: lazy && !priority,
    priority
  });

  const imgClasses = [
    className,
    'transition-opacity duration-300',
    isLoaded ? 'opacity-100' : 'opacity-0',
    hasError ? 'bg-gray-200' : ''
  ].filter(Boolean).join(' ');

  const placeholderClasses = [
    'absolute inset-0 transition-opacity duration-300',
    isLoaded ? 'opacity-0' : 'opacity-100',
    placeholder === 'blur' ? 'blur-sm' : 'bg-gray-200'
  ].filter(Boolean).join(' ');

  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{ width, height }}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      {...imageProps}
      {...(lazy && !priority && {
        'data-src': optimizedSrc,
        src: blurDataUrl || undefined
      })}
      {...(srcSet && { srcSet })}
      {...(sizes && { sizes })}
      className={imgClasses}
      onLoad={handleLoad}
      onError={handleError}
      style={{ width, height }}
      {...props}
    />
  );
};

export default OptimizedImage;

// Higher-order component for responsive images
export const ResponsiveImage: React.FC<OptimizedImageProps & {
  breakpoints?: { [key: string]: { width: number; height?: number } };
}> = ({ breakpoints, ...props }) => {
  const defaultBreakpoints = {
    sm: { width: 640 },
    md: { width: 768 },
    lg: { width: 1024 },
    xl: { width: 1280 }
  };

  const responsiveBreakpoints = { ...defaultBreakpoints, ...breakpoints };
  
  const generateSizes = () => {
    const sizeEntries = Object.entries(responsiveBreakpoints)
      .map(([_, { width }]) => `(max-width: ${width}px) 100vw`)
      .reverse();
    
    return [...sizeEntries, '100vw'].join(', ');
  };

  const generateSrcSet = () => {
    if (props.srcSet) return props.srcSet;
    
    return Object.values(responsiveBreakpoints)
      .map(({ width }) => {
        const scaledSrc = props.src.replace(/\.(\w+)$/, `_${width}w.$1`);
        return `${scaledSrc} ${width}w`;
      })
      .join(', ');
  };

  return (
    <OptimizedImage
      {...props}
      sizes={props.sizes || generateSizes()}
      srcSet={generateSrcSet()}
    />
  );
};

// Avatar component with optimized loading
export const OptimizedAvatar: React.FC<{
  src: string;
  alt: string;
  size?: number;
  className?: string;
}> = ({ src, alt, size = 40, className = '' }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      priority={size <= 64} // Prioritize small avatars
      placeholder="blur"
    />
  );
};

// Logo component with preloading
export const OptimizedLogo: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}> = ({ src, alt, width = 120, height = 40, className = '' }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={true} // Always prioritize logos
      lazy={false}
      placeholder="empty"
    />
  );
};