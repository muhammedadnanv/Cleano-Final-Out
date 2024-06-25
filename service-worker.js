const CACHE_NAME = 'waste-management-v1';
const urlsToCache = [
    'index.html',
    '/index.html',
    '/style.css',
    '/wavestyle.css',
    '/app.js',
    '/manifest.json',
    '/Cleano.png',
    '/Qr.html',
    '/Qr.css',
    '/Qr.js',
    '/dashboard', // Assuming this is a folder containing dashboard related files
    '/image',     // Assuming this is a folder containing image resources
    '/img',       // Assuming this is a folder containing image resources
    '/login'      // Assuming this is a folder containing login related files
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Clone the request to not consume it
                const fetchRequest = event.request.clone();
                // Make network request and cache the response
                return fetch(fetchRequest).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});
