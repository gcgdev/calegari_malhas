const CACHE_NAME = "site-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./atacado-de-malhas.html",
  "./manifest.json",
  "./assets/site.css",
  "./assets/site.js",
  "./assets/analytics.js",
  "./assets/img/favicon.png",
  "./assets/img/fabrica.webp",
  "./assets/img/malha-por-quilo.webp",
  "./assets/img/pwa-192.png",
  "./assets/img/pwa-512.png",
  "./assets/img/logo.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(CORE_ASSETS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(function (networkResponse) {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(function () {
          return caches.match("./index.html");
        });
    })
  );
});
