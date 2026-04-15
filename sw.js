const CACHE_NAME = "swish-qr-cache-v4"; // Update version to force cache refresh
const PRECACHE_URLS = [
];

// Install event: cache files
self.addEventListener("install", (event) => {
    console.log("[SW] Install event");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting(); // Activate SW immediately
});

// Activate event: cleanup old caches
self.addEventListener("activate", (event) => {
    console.log("[SW] Activate event");
    event.waitUntil(
        caches.keys().then((keys) => 
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("[SW] Deleting old cache:", key);
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim(); // Take control of all clients immediately
});

// Fetch event: cache-first strategy with network 
