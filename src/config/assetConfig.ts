/**
 * Konfigurasi Asset untuk DIGCITY Website
 * Memastikan asset di-load dengan benar di development dan production
 */

export interface AssetConfig {
  baseUrl: string;
  publicPath: string;
  assetsPath: string;
  imagesPath: string;
  cssPath: string;
  jsPath: string;
  fontsPath: string;
}

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const isVercel = import.meta.env.VITE_VERCEL === 'true';

// Base configuration
const getBaseConfig = (): AssetConfig => {
  if (isDevelopment) {
    return {
      baseUrl: '/',
      publicPath: '/',
      assetsPath: '/',
      imagesPath: '/',
      cssPath: '/src/styles/',
      jsPath: '/src/',
      fontsPath: '/'
    };
  }

  if (isProduction) {
    return {
      baseUrl: 'https://digcity.my.id',
      publicPath: '/',
      assetsPath: '/assets/',
      imagesPath: '/assets/images/',
      cssPath: '/assets/css/',
      jsPath: '/assets/js/',
      fontsPath: '/assets/fonts/'
    };
  }

  // Default fallback
  return {
    baseUrl: '/',
    publicPath: '/',
    assetsPath: '/',
    imagesPath: '/',
    cssPath: '/src/styles/',
    jsPath: '/src/',
    fontsPath: '/'
  };
};

// Asset configuration instance
export const assetConfig: AssetConfig = getBaseConfig();

// Utility functions
export const getAssetUrl = (path: string, type: 'image' | 'css' | 'js' | 'font' | 'public' = 'public'): string => {
  const config = assetConfig;
  
  switch (type) {
    case 'image':
      return `${config.imagesPath}${path}`;
    case 'css':
      return `${config.cssPath}${path}`;
    case 'js':
      return `${config.jsPath}${path}`;
    case 'font':
      return `${config.fontsPath}${path}`;
    case 'public':
    default:
      return `${config.publicPath}${path}`;
  }
};

export const getPublicAssetUrl = (filename: string): string => {
  // Untuk file di folder public, selalu gunakan root path
  return `/${filename}`;
};

export const getImageUrl = (filename: string): string => {
  return assetConfig.imagesPath + filename;
};

export const getCssUrl = (filename: string): string => {
  return assetConfig.cssPath + filename;
};

export const getJsUrl = (filename: string): string => {
  return assetConfig.jsPath + filename;
};

export const getFontUrl = (filename: string): string => {
  return assetConfig.fontsPath + filename;
};

// Preload configuration
export const preloadConfig = {
  critical: [
    { path: 'logo_digcity.png', type: 'image' as const },
  ],
  fonts: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  ]
};

// Cache configuration
export const cacheConfig = {
  images: {
    maxAge: 31536000, // 1 year
    immutable: true
  },
  css: {
    maxAge: 31536000, // 1 year
    immutable: true
  },
  js: {
    maxAge: 31536000, // 1 year
    immutable: true
  },
  fonts: {
    maxAge: 31536000, // 1 year
    immutable: true
  }
};

// Error handling
export const handleAssetError = (error: Error, assetPath: string): void => {
  console.error(`Failed to load asset: ${assetPath}`, error);
  
  // In development, show more detailed errors
  if (isDevelopment) {
    console.warn(`Asset path: ${assetPath}`);
    console.warn(`Current config:`, assetConfig);
  }
  
  // In production, you might want to send this to an error tracking service
  if (isProduction) {
    // TODO: Send to error tracking service
    console.error('Asset loading failed in production');
  }
};
