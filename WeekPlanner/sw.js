const cacheVersion = 'v1';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
const urlsToPrefetch = ['/WeekPlanner/']

workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
);

this.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cacheVersion).then(function(cache) {
        return cache.addAll(urlsToPrefetch);
      })
    );
  });
  
  
  this.addEventListener('fetch', event => {
    let responsePromise = caches.match(event.request).then(response => {
      return response || fetch(event.request)
    });
  
    event.respondWith(responsePromise);
  });