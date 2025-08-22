/**
 * Utility untuk memastikan asset di-load dengan benar di production
 */

// Base URL untuk asset
const getAssetBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/';
  }
  // Di production, gunakan base URL yang sama
  return '/';
};

// Fungsi untuk mendapatkan path asset yang benar
export const getAssetPath = (path: string): string => {
  const baseUrl = getAssetBaseUrl();
  
  // Jika path sudah dimulai dengan http atau https, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Jika path dimulai dengan /, gunakan base URL
  if (path.startsWith('/')) {
    return `${baseUrl}${path.slice(1)}`;
  }
  
  // Jika tidak, tambahkan base URL
  return `${baseUrl}${path}`;
};

// Fungsi untuk preload asset
export const preloadAsset = (path: string, type: 'image' | 'script' | 'style' | 'font') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = getAssetPath(path);
  
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
    case 'font':
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      break;
  }
  
  document.head.appendChild(link);
};

// Fungsi untuk memastikan asset tersedia
export const ensureAssetLoaded = (path: string, type: 'image' | 'script' | 'style' | 'font'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const assetPath = getAssetPath(path);
    
    if (type === 'image') {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${assetPath}`));
      img.src = assetPath;
    } else if (type === 'script') {
      const script = document.createElement('script');
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${assetPath}`));
      script.src = assetPath;
      document.head.appendChild(script);
    } else if (type === 'style') {
      const link = document.createElement('link');
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load style: ${assetPath}`));
      link.rel = 'stylesheet';
      link.href = assetPath;
      document.head.appendChild(link);
    } else if (type === 'font') {
      // Font loading lebih kompleks, gunakan FontFace API jika tersedia
      if ('FontFace' in window) {
        const font = new FontFace('custom-font', `url(${assetPath})`);
        font.load().then(() => resolve()).catch(reject);
      } else {
        // Fallback untuk browser lama
        resolve();
      }
    }
  });
};

// Fungsi untuk mendapatkan URL asset yang benar untuk komponen
export const getImageSrc = (filename: string): string => {
  return getAssetPath(`/${filename}`);
};

// Fungsi untuk mendapatkan URL CSS yang benar
export const getCssSrc = (filename: string): string => {
  return getAssetPath(`/src/styles/${filename}`);
};

// Fungsi untuk mendapatkan URL JS yang benar
export const getJsSrc = (filename: string): string => {
  return getAssetPath(`/src/${filename}`);
};
