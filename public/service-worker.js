const STATIC_CACHE_NAME = "clip-memo-static-v1";
const DYNAMIC_CACHE_NAME = "clip-memo-dynamic-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
  "/file.svg",
  "/globe.svg",
  "/window.svg",
  "/_next/static/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(urlsToCache);
      }),
      caches.open(DYNAMIC_CACHE_NAME),
    ])
      .then(() => {
        console.log("Cache installation completed");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Cache installation failed:", error);
      })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // API 요청 처리
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // 정적 자원 처리
  if (request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return (
          response ||
          fetch(request)
            .then((fetchResponse) => {
              return caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
              });
            })
            .catch(() => {
              if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                return caches.match("/icons/icon-192x192.svg");
              }
              return caches.match("/offline.html");
            })
        );
      })
    );
    return;
  }

  // HTML 페이지 요청 처리
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          if (response) return response;
          return caches.match("/offline.html");
        });
      })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
