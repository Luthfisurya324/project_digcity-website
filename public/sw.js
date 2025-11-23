// Service Worker for DIGCITY Website
// Implements caching strategies for better performance and offline experience

// Dynamic cache names based on timestamp
const getCacheNames = () => {
  const timestamp = Date.now().toString(36);
  return {
    STATIC_CACHE: `digcity-static-${timestamp}`,
    DYNAMIC_CACHE: `digcity-dynamic-${timestamp}`,
    IMAGE_CACHE: `digcity-images-${timestamp}`,
    VERSION: `digcity-${timestamp}`
  };
};

let CACHE_NAMES = getCacheNames();

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo_digcity.png'
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  // Generate new cache names for this installation
  CACHE_NAMES = getCacheNames();
  
  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAMES.STATIC_CACHE && 
                cacheName !== CACHE_NAMES.DYNAMIC_CACHE && 
                cacheName !== CACHE_NAMES.IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (except for fonts and images)
  if (url.origin !== location.origin && 
      !isFont(request) && 
      !isImage(request)) {
    return;
  }
  
  // Skip development-only resources
  if (url.pathname.includes('/src/') || 
      url.pathname.includes('/@vite/') ||
      url.pathname.includes('.tsx') ||
      url.pathname.includes('.ts')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Main request handler
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Route requests to appropriate cache strategy
    if (isStaticAsset(request)) {
      return await cacheFirst(request, CACHE_NAMES.STATIC_CACHE);
    }
    
    if (isImage(request)) {
      return await cacheFirst(request, CACHE_NAMES.IMAGE_CACHE);
    }
    
    if (isFont(request)) {
      return await cacheFirst(request, CACHE_NAMES.STATIC_CACHE);
    }
    
    if (isAPI(request)) {
      return await networkFirst(request, CACHE_NAMES.DYNAMIC_CACHE);
    }
    
    if (isHTML(request)) {
      return await staleWhileRevalidate(request, CACHE_NAMES.DYNAMIC_CACHE);
    }
    
    // Default: network first for other requests
    return await networkFirst(request, CACHE_NAMES.DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('Service Worker: Request failed:', error);
    
    // Return offline fallback if available
    return await getOfflineFallback(request);
  }
}

// Cache First Strategy - good for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First Strategy - good for API calls
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy - good for HTML pages
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cached version
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return await networkResponsePromise;
}

// Helper functions to identify request types
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/) ||
         STATIC_ASSETS.some(asset => url.pathname === asset);
}

function isImage(request) {
  return request.destination === 'image' ||
         request.url.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/i);
}

function isFont(request) {
  return request.destination === 'font' ||
         request.url.match(/\.(woff|woff2|ttf|eot)$/i);
}

function isAPI(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') ||
         url.hostname !== location.hostname;
}

function isHTML(request) {
  return request.destination === 'document' ||
         request.headers.get('accept')?.includes('text/html');
}

// Offline fallback
async function getOfflineFallback(request) {
  if (isHTML(request)) {
    const cache = await caches.open(CACHE_NAMES.STATIC_CACHE);
    return await cache.match('/') || 
           await cache.match('/index.html');
  }
  
  if (isImage(request)) {
    // Return a placeholder image or cached logo
    const cache = await caches.open(CACHE_NAMES.IMAGE_CACHE);
    return await cache.match('/logo_digcity.png');
  }
  
  // For other requests, throw error to let the app handle it
  throw new Error('No offline fallback available');
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  // For example, retry failed API calls
  console.log('Service Worker: Background sync triggered');
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/logo_digcity.png',
      badge: '/logo_digcity.png',
      data: data.data || {},
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action clicks
    console.log('Notification action clicked:', event.action);
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow('/') // Open the app
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAMES.VERSION });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('Service Worker: Unknown message type:', type);
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Periodic cache cleanup
setInterval(async () => {
  try {
    const cache = await caches.open(CACHE_NAMES.DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Remove old entries (older than 7 days)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const request of requests) {
      try {
        const response = await cache.match(request);
        const dateHeader = response?.headers.get('date');
        
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (responseDate < oneWeekAgo) {
            await cache.delete(request);
            console.log('Service Worker: Expired cache deleted:', request.url);
          }
        }
      } catch (error) {
        // Skip jika ada error pada request tertentu
        continue;
      }
    }
    
    // Clear old cache versions
    const allCacheNames = await caches.keys();
    const currentCaches = [
      CACHE_NAMES.STATIC_CACHE,
      CACHE_NAMES.DYNAMIC_CACHE,
      CACHE_NAMES.IMAGE_CACHE
    ];
    
    for (const cacheName of allCacheNames) {
      if (!currentCaches.includes(cacheName)) {
        await caches.delete(cacheName);
        console.log('Service Worker: Old cache version deleted:', cacheName);
      }
    }
  } catch (error) {
    console.error('Service Worker: Cache cleanup failed:', error);
  }
}, 24 * 60 * 60 * 1000); // Run daily

console.log('Service Worker: Loaded successfully');
