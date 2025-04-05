const STATIC_CACHE_NAME = "clip-memo-static-v2";
const DYNAMIC_CACHE_NAME = "clip-memo-dynamic-v2";
const DATA_CACHE_NAME = "clip-memo-data-v1";

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
  // CSS 및 JS 파일
  "/_next/static/css/",
  "/_next/static/chunks/",
  "/_next/static/media/",
  // 폰트 파일
  "/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",
  // 앱 기능에 필요한 주요 이미지 파일들
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(urlsToCache);
      }),
      caches.open(DYNAMIC_CACHE_NAME),
      caches.open(DATA_CACHE_NAME),
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

// 네트워크 요청 가로채기
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 요청 처리 - 네트워크 우선, 실패 시 캐시
  if (url.pathname.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 응답 복제 후 캐시에 저장
          const responseClone = response.clone();
          caches.open(DATA_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          console.log("Falling back to cache for API request");
          return caches.match(request).then((cachedResponse) => {
            return (
              cachedResponse ||
              new Response(
                JSON.stringify({ error: "Cannot fetch data, offline mode" }),
                {
                  headers: { "Content-Type": "application/json" },
                }
              )
            );
          });
        })
    );
    return;
  }

  // 정적 자원 처리 - 캐시 우선, 실패 시 네트워크
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image" ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request)
            .then((fetchResponse) => {
              return caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
              });
            })
            .catch(() => {
              if (
                request.destination === "image" ||
                url.pathname.match(/\.(jpg|jpeg|png|gif|svg)$/)
              ) {
                return caches.match("/icons/icon-192x192.svg");
              }
              return new Response("Not found", { status: 404 });
            })
        );
      })
    );
    return;
  }

  // HTML 페이지 요청 처리 - 네트워크 우선, 실패 시 캐시
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

// 캐시 정리
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [
    STATIC_CACHE_NAME,
    DYNAMIC_CACHE_NAME,
    DATA_CACHE_NAME,
  ];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Deleting outdated cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log("Service Worker activated and cache cleaned up");
        // 새 서비스 워커가 활성화되면 모든 클라이언트 제어 요청
        return self.clients.claim();
      });
    })
  );
});

// 백그라운드 동기화
self.addEventListener("sync", function (event) {
  if (event.tag === "sync-memos") {
    event.waitUntil(syncMemos());
  }
});

// 메모 동기화 함수
async function syncMemos() {
  try {
    // IndexedDB나 localStorage에서 동기화할 데이터를 가져와 처리하는 로직
    // 오프라인 상태에서 생성된 메모를 온라인 상태가 되면 동기화
    const offlineData = localStorage.getItem("offline-memos");
    if (offlineData) {
      // 서버에 데이터 동기화 로직
      localStorage.removeItem("offline-memos");
    }
  } catch (err) {
    console.error("Background sync failed:", err);
  }
}
