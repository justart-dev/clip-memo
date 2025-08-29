"use client";

import { useEffect } from "react";

interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // 페이지 로드 완료 후 서비스 워커 등록 (더 빠른 초기 렌더링을 위해)
      window.addEventListener("load", async () => {
        try {
          const registration = (await navigator.serviceWorker.register(
            "/service-worker.js",
            {
              scope: "/",
            }
          )) as ServiceWorkerRegistrationWithSync;

          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );

          // 서비스 워커 업데이트 확인
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            console.log("Service Worker update found!");

            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("New content is available, please refresh.");
                  // 여기에 사용자에게 새 버전이 사용 가능함을 알리는 UI 표시 가능
                }
              });
            }
          });

          // 백그라운드 동기화 지원 확인 및 등록
          if (registration.sync) {
            try {
              await registration.sync.register("sync-memos");
              console.log("Background sync registered!");
            } catch (syncError) {
              console.error("Background sync registration failed:", syncError);
            }
          }

          // 컨트롤러 변경 이벤트 처리
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            console.log("Service worker is now controlling the page");
          });
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      });
    }

    // 오프라인/온라인 상태 처리
    const handleOnlineStatus = () => {
      const offlineIndicator = document.getElementById("offline-indicator");
      if (navigator.onLine) {
        console.log("App is online");
        if (offlineIndicator) {
          offlineIndicator.style.display = "none";
        }
      } else {
        console.log("App is offline");
        if (!offlineIndicator) {
          const indicator = document.createElement("div");
          indicator.id = "offline-indicator";
          indicator.style.position = "fixed";
          indicator.style.bottom = "20px";
          indicator.style.right = "20px";
          indicator.style.backgroundColor = "#ef4444";
          indicator.style.color = "white";
          indicator.style.padding = "8px 16px";
          indicator.style.borderRadius = "20px";
          indicator.style.fontSize = "14px";
          indicator.style.zIndex = "9999";
          indicator.style.boxShadow =
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
          indicator.textContent = "오프라인 모드";
          document.body.appendChild(indicator);
        }
      }
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // 초기 상태 확인
    handleOnlineStatus();

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  return null;
}

export default PWARegister;
