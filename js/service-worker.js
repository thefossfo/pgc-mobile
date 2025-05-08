// service-worker.js

const CACHE_NAME = 'my-app-cache-v1'; // Choose a unique cache name for your app
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.png' // Add any other static assets you want to cache
];

// Install event: triggered when the service worker is first installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // Cache the initial set of assets
      })
  );
});

// Activate event: triggered when the service worker becomes active
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName); // Clean up any old caches
          }
        })
      );
    })
  );
});

// Fetch event: triggered for every network request made by the app
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cache
        if (response) {
          return response;
        }

        // Not in cache - fetch from the network
        return fetch(event.request).then(
          (response) => {
            // Check if the response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache); // Store the fetched response in the cache
              });

            return response;
          }
        );
      })
  );
});
