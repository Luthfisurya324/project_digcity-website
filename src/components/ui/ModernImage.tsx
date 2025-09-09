import React, { useState, useRef, useEffect } from 'react';
import { generateModernImageSrcSet } from '../../utils/imageOptimization';
import type { ImageOptimizationOptions } from '../../utils/imageOptimization';

interface ModernImageProps extends ImageOptimizationOptions {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  responsiveSizes?: number[];
}

/**
 * Modern image component with WebP/AVIF support and responsive loading
 */
export const ModernImage: React.FC<ModernImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  lazy = true,
  quality = 80,
  sizes = '100vw',
  onLoad,
  onError,
  style,
  responsiveSizes = [480, 768, 1024, 1280, 1920],
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sources, setSources] = useState<Array<{ srcSet: string; type: string }>>([]);
  const pictureRef = useRef<HTMLPictureElement>(null);

  // Generate modern image sources
  useEffect(() => {
    const generateSources = async () => {
      try {
        const modernSources = await generateModernImageSrcSet(src, responsiveSizes);
        setSources(modernSources);
      } catch (error) {
        console.warn('Failed to generate modern image sources:', error);
        // Fallback to original image
        setSources([{ srcSet: src, type: 'image/jpeg' }]);
      }
    };

    generateSources();
  }, [src, responsiveSizes]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imgClasses = [
    className,
    'transition-opacity duration-300',
    isLoaded ? 'opacity-100' : 'opacity-0',
    hasError ? 'bg-gray-200' : ''
  ].filter(Boolean).join(' ');

  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{ width, height, ...style }}
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
    <picture ref={pictureRef} className="block">
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          type={source.type}
          sizes={sizes}
        />
      ))}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={imgClasses}
        style={style}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </picture>
  );
};

/**
 * Hero image component with modern formats and critical loading
 */
export const ModernHeroImage: React.FC<ModernImageProps> = (props) => {
  return (
    <ModernImage
      {...props}
      priority={true}
      lazy={false}
      sizes="100vw"
      responsiveSizes={[768, 1024, 1280, 1536, 1920]}
      className={`w-full h-full object-cover ${props.className || ''}`}
    />
  );
};

/**
 * Card image component with modern formats and lazy loading
 */
export const ModernCardImage: React.FC<ModernImageProps> = (props) => {
  return (
    <ModernImage
      {...props}
      lazy={true}
      priority={false}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      responsiveSizes={[400, 600, 800, 1000]}
      className={`w-full h-full object-cover ${props.className || ''}`}
    />
  );
};

/**
 * Thumbnail image component with modern formats
 */
export const ModernThumbnail: React.FC<ModernImageProps & { size?: number }> = ({ 
  size = 150, 
  ...props 
}) => {
  return (
    <ModernImage
      {...props}
      width={size}
      height={size}
      lazy={true}
      priority={false}
      sizes={`${size}px`}
      responsiveSizes={[size, size * 1.5, size * 2]}
      className={`rounded-lg object-cover ${props.className || ''}`}
    />
  );
};

export default ModernImage;