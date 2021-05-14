const cacheVersion = 'v1';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
const urlsToPrefetch = ['/WeekPlanner/', '/WeekPlanner/js/jquery-3.5.1.min.js',
   '/WeekPlanner/js/code.js', '/WeekPlanner/js/jquery-ui.min.js', '/WeekPlanner/js/jquery.ui.touch-punch.min.js',
   '/WeekPlanner/js/idb.min.js', '/WeekPlanner/css/style.css', '/icons/apple-icon-180.png']

workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 24 * 60 * 60 * 60,
        }),
      ],
    })
  
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