const CACHE_NAME = 'sumup-banking-premium-v2.0';
const STATIC_CACHE = 'sumup-static-v2.0';
const DYNAMIC_CACHE = 'sumup-dynamic-v2.0';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/icon-192.svg'
];

const FALLBACK_PAGE = '/index.html';

// Advanced caching strategies
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache core assets
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(CORE_ASSETS);
      }),
      // Pre-cache dynamic content
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.add(FALLBACK_PAGE);
      })
    ]).then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Advanced fetch handling with network-first strategy for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached fallback for navigation
          return caches.match(FALLBACK_PAGE);
        })
    );
    return;
  }

  // Handle static assets (cache-first strategy)
  if (CORE_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchResponse => {
          // Cache new static assets
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        });
      })
    );
    return;
  }

  // Handle other requests (network-first with cache fallback)
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached version if available
        return caches.match(request).then(response => {
          return response || caches.match(FALLBACK_PAGE);
        });
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions when connection is restored
      handleBackgroundSync()
    );
  }
});

async function handleBackgroundSync() {
  try {
    // Process any queued offline actions
    const offlineActions = await getOfflineActions();
    for (const action of offlineActions) {
      await processOfflineAction(action);
    }
    await clearOfflineActions();
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getOfflineActions() {
  // Retrieve offline actions from IndexedDB or localStorage
  return JSON.parse(localStorage.getItem('offlineActions') || '[]');
}

async function processOfflineAction(action) {
  // Process individual offline actions
  console.log('Processing offline action:', action);
}

async function clearOfflineActions() {
  localStorage.removeItem('offlineActions');
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New banking notification',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    vibrate: [200, 100, 200],
    tag: 'banking-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-192.svg'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'SumUp Banking', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MARK') {
    // Log performance metrics
    console.log('Performance mark:', event.data.mark);
  }
});