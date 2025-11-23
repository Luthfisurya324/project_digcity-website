/**
 * Domain detection utility untuk handling subdomain routing
 * Deteksi apakah user mengakses dari subdomain linktree dan redirect ke halaman yang sesuai
 */

export const isLinktreeSubdomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return hostname === 'linktree.digcity.my.id';
};

export const isAdminSubdomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Development environment: localhost, 127.0.0.1, etc.
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
    return false; // Treat as domain utama for consistency
  }
  
  return hostname === 'admin.digcity.my.id';
};

export const isInternalSubdomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return hostname === 'internal.digcity.my.id';
};

export const shouldRedirectToLinktree = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Jika mengakses dari subdomain linktree, langsung return true
  // Tidak perlu check path karena kita akan render LinktreePage langsung
  return hostname === 'linktree.digcity.my.id';
};

export const shouldRedirectToAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Jika mengakses dari subdomain admin, langsung return true
  return hostname === 'admin.digcity.my.id';
};

export const shouldRedirectToInternal = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // 1. Real subdomain
  if (hostname === 'internal.digcity.my.id') {
    return true;
  }
  
  // 2. Development path bypass:
  // Actually, for localhost path-based access, we should NOT redirect to subdomain mode
  // because App.tsx handles path routing separately.
  // If we return true here, App.tsx might assume we are in subdomain mode and mess up routing.
  
  return false;
};

export const redirectToLinktree = (): void => {
  if (typeof window === 'undefined') return;
  
  // Redirect ke path /linktree di domain yang sama
  window.location.pathname = '/linktree';
};

export const getCanonicalUrl = (): string => {
  if (typeof window === 'undefined') return '';
  
  const isLinktreeDomain = isLinktreeSubdomain();
  const currentPath = window.location.pathname;
  
  if (isLinktreeDomain || currentPath === '/linktree') {
    return 'https://linktree.digcity.my.id';
  }
  
  return 'https://digcity.my.id';
};

export const getDomainInfo = () => {
  if (typeof window === 'undefined') {
    return {
      isLinktreeSubdomain: false,
      hostname: '',
      shouldRedirect: false
    };
  }
  
  const hostname = window.location.hostname;
  const isLinktreeDomain = hostname === 'linktree.digcity.my.id';
  const shouldRedirect = shouldRedirectToLinktree();
  
  return {
    isLinktreeSubdomain: isLinktreeDomain,
    hostname,
    shouldRedirect
  };
};

/**
 * Get admin base path based on current environment
 * Development: /admin (consistent with production domain utama)
 * Admin subdomain: / (no prefix needed)
 */
export const getAdminBasePath = (): string => {
  if (typeof window === 'undefined') return '/admin';
  
  const hostname = window.location.hostname;
  
  // Development environment: treat as domain utama
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
    return '/admin';
  }
  
  // Admin subdomain: no prefix needed
  if (hostname === 'admin.digcity.my.id') {
    return '';
  }
  
  // Production domain utama: use /admin prefix
  return '/admin';
};

/**
 * Get internal base path based on current environment
 */
export const getInternalBasePath = (): string => {
  if (typeof window === 'undefined') return '/internal';
  
  const hostname = window.location.hostname;
  
  // Development environment or main domain: use /internal prefix
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost') || hostname === 'digcity.my.id') {
    return '/internal';
  }
  
  // Internal subdomain: no prefix needed
  if (hostname === 'internal.digcity.my.id') {
    return '';
  }
  
  // Fallback
  return '/internal';
};

/**
 * Check if current environment is development
 */
export const isDevelopment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost');
};
