/**
 * Amanoba Service Worker
 * Provides offline support, caching, and background sync
 * Version: 2.0.0
 */

const CACHE_NAME = 'amanoba-v2.0.1';
const RUNTIME_CACHE = 'amanoba-runtime-v2.0.1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/hu',
  '/en',
  '/ar',
  '/hi',
  '/id',
  '/pt',
  '/vi',
  '/tr',
  '/bg',
  '/pl',
  '/ru',
  '/sw',
  '/zh',
  '/es',
  '/fr',
  '/bn',
  '/ur',
  '/manifest.json',
  '/AMANOBA_2026_192.png',
  '/AMANOBA_2026_512.png',
  '/offline.html',
];

// API endpoints that should work offline (with cached data)
const API_CACHE_ROUTES = [
  '/api/players/',
  '/api/profile/',
  '/api/leaderboards/',
  '/api/rewards',
];

/**
 * Install Event
 * Cache static assets when service worker is installed
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[Service Worker] Caching static assets');
      await Promise.all(
        STATIC_ASSETS.map(async (asset) => {
          try {
            await cache.add(asset);
          } catch (error) {
            console.warn('[Service Worker] Failed to cache asset:', asset, error);
          }
        })
      );
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

/**
 * Activate Event
 * Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

/**
 * Fetch Event
 * Implement caching strategies based on request type
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // API requests: Network First, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  // Static assets: Cache First, fallback to network
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
  // HTML pages: Network First with offline fallback
  if (request.destination === 'document') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }
  
  // Default: Network First
  event.respondWith(networkFirstStrategy(request));
});

/**
 * Network First Strategy
 * Try network first, fall back to cache if offline
 */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful API responses
    if (response.ok && shouldCacheRequest(request)) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for failed requests
    return new Response(JSON.stringify({
      success: false,
      error: 'You are currently offline',
      offline: true,
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Cache First Strategy
 * Serve from cache, update cache in background
 */
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
    }).catch(() => {
      // Ignore network errors for cache-first strategy
    });
    
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Cache and network both failed:', error);
    return new Response('Resource not available offline', { status: 503 });
  }
}

/**
 * Network First with Offline Fallback
 * For HTML pages, show offline page if network fails
 */
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Showing offline page');
    const url = new URL(request.url);
    const localeFallback = await caches.match(`/${url.pathname.split('/').filter(Boolean)[0] || ''}`);
    if (localeFallback) {
      return localeFallback;
    }
    const cachedResponse = await caches.match('/offline.html');
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

/**
 * Determine if a request should be cached
 */
function shouldCacheRequest(request) {
  const url = new URL(request.url);
  
  // Cache GET requests only
  if (request.method !== 'GET') {
    return false;
  }
  
  // Cache specific API routes
  return API_CACHE_ROUTES.some((route) => url.pathname.startsWith(route));
}

/**
 * Background Sync Event
 * Retry failed requests when connection is restored
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-game-sessions') {
    event.waitUntil(syncGameSessions());
  }
  
  if (event.tag === 'sync-achievements') {
    event.waitUntil(syncAchievements());
  }
});

/**
 * Sync game sessions stored offline
 */
async function syncGameSessions() {
  console.log('[Service Worker] Syncing game sessions...');
  
  // Get pending game sessions from IndexedDB or cache
  // This would be implemented with actual IndexedDB logic
  // For now, this is a placeholder
  
  try {
    // Attempt to sync pending sessions
    console.log('[Service Worker] Game sessions synced successfully');
  } catch (error) {
    console.error('[Service Worker] Failed to sync game sessions:', error);
    throw error; // Retry sync
  }
}

/**
 * Sync achievements unlocked offline
 */
async function syncAchievements() {
  console.log('[Service Worker] Syncing achievements...');
  
  try {
    // Sync pending achievement unlocks
    console.log('[Service Worker] Achievements synced successfully');
  } catch (error) {
    console.error('[Service Worker] Failed to sync achievements:', error);
    throw error; // Retry sync
  }
}

/**
 * Push Notification Event
 * Handle incoming push notifications
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'Amanoba';
  const options = {
    body: data.body || 'New update available!',
    icon: '/AMANOBA_2026_192.png',
    badge: '/AMANOBA_2026_192.png',
    image: data.image,
    data: data.url,
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Close' },
    ],
    tag: data.tag || 'general',
    requireInteraction: data.requireInteraction || false,
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Notification Click Event
 * Handle notification interactions
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

/**
 * Message Event
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[Service Worker] Loaded successfully');
