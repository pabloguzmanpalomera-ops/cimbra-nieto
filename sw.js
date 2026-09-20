const CACHE_NAME = "cimbra-nieto-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./ICONOS/icon-192.png",
  "./ICONOS/icon-512.png",
  "./ICONOS/apple-touch-icon.png",
  "./ICONOS/favicon-32.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => {
        return cached || caches.match("./index.html");
      }))
  );
});
