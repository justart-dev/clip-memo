"use client";

import React, { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

// iOS Safari용 Navigator 인터페이스 확장
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

// PWA가 설치되었는지 확인하는 함수
const isPWAInstalled = (): boolean => {
  // 1. display-mode 확인 (standalone, fullscreen, minimal-ui 모두 PWA로 간주)
  if (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches
  ) {
    return true;
  }

  // 2. iOS Safari에서 홈 화면에 추가된 경우 확인
  if (
    ("standalone" in window.navigator &&
      (window.navigator as NavigatorWithStandalone).standalone === true) || // iOS Safari
    window.matchMedia("(display-mode: standalone)").matches // 다른 브라우저
  ) {
    return true;
  }

  // 3. localStorage에 설치 상태가 저장되어 있는지 확인
  if (localStorage.getItem("pwa-installed") === "true") {
    return true;
  }

  return false;
};

// 현재 실행 환경을 확인하는 함수
const getEnvironment = (): "browser" | "pwa" | "ios-pwa" => {
  // standalone 모드 확인 (PWA)
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return "pwa";
  }

  // iOS의 홈스크린 앱 확인
  if (
    "standalone" in window.navigator &&
    (window.navigator as NavigatorWithStandalone).standalone === true
  ) {
    return "ios-pwa";
  }

  // 그 외는 브라우저로 간주
  return "browser";
};

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [environment, setEnvironment] = useState<"browser" | "pwa" | "ios-pwa">(
    "browser"
  );

  // iOS 여부 확인
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // 컴포넌트 마운트 시 설치 상태 확인
  useEffect(() => {
    console.log("InstallPWA component mounted");

    // 현재 환경 확인
    const currentEnv = getEnvironment();
    setEnvironment(currentEnv);
    console.log("Current environment:", currentEnv);

    // PWA 환경이면 설치 버튼을 표시하지 않음
    if (currentEnv === "pwa" || currentEnv === "ios-pwa") {
      setIsInstalled(true);
      setSupportsPWA(false);
      return;
    }

    // 설치 상태 확인 및 설정
    const checkInstallState = () => {
      const installed = isPWAInstalled();
      console.log("Is PWA installed check result:", installed);
      setIsInstalled(installed);
      if (installed) {
        setSupportsPWA(false);
      }
    };

    // 초기 확인
    checkInstallState();

    // iOS가 아닌 경우에만 beforeinstallprompt 이벤트 처리
    if (!isIOS) {
      // 저장된 deferredPrompt 확인
      const savedPrompt = window.deferredPrompt;
      if (savedPrompt && !isPWAInstalled()) {
        console.log("Found saved install prompt");
        setSupportsPWA(true);
        setPromptInstall(savedPrompt);
      }

      const handler = (e: BeforeInstallPromptEvent) => {
        console.log("beforeinstallprompt event fired", e);
        e.preventDefault();
        if (!isPWAInstalled()) {
          // 전역 변수에 저장
          window.deferredPrompt = e;
          setSupportsPWA(true);
          setPromptInstall(e);
          setIsInstalled(false);
        }
      };

      // 디버깅용 - 이벤트 리스너가 등록되었는지 확인
      console.log("Adding beforeinstallprompt event listener");
      window.addEventListener("beforeinstallprompt", handler);

      // appinstalled 이벤트 리스너 추가
      const handleAppInstalled = () => {
        console.log("App was installed");
        setIsInstalled(true);
        setSupportsPWA(false);
        setEnvironment("pwa");
        localStorage.setItem("pwa-installed", "true");
        // 설치 완료 후 저장된 프롬프트 제거
        window.deferredPrompt = null;
      };

      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        console.log("Removing event listeners");
        window.removeEventListener("beforeinstallprompt", handler);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    } else {
      // iOS의 경우 PWA 설치 가능하고 설치되지 않은 경우에만 표시
      setSupportsPWA(!isPWAInstalled());
    }

    // 가시성 변경 시 재확인 (앱 설치 후 돌아올 때 감지)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const newEnv = getEnvironment();
        setEnvironment(newEnv);
        if (newEnv === "pwa" || newEnv === "ios-pwa") {
          setIsInstalled(true);
          setSupportsPWA(false);
        } else {
          checkInstallState();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isIOS]);

  // 디버깅용 - 상태 변경 시 로깅
  useEffect(() => {
    console.log(
      "State updated - environment:",
      environment,
      "supportsPWA:",
      supportsPWA,
      "isInstalled:",
      isInstalled
    );
  }, [environment, supportsPWA, isInstalled]);

  const handleInstallClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isIOS) {
      alert(
        "Safari 브라우저의 '공유' 버튼을 눌러\n'홈 화면에 추가'를 선택해주세요."
      );
      return;
    }

    if (!promptInstall) return;

    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
        setIsInstalled(true);
        localStorage.setItem("pwa-installed", "true");
        // 설치 완료 후 저장된 프롬프트 제거
        window.deferredPrompt = null;
      } else {
        console.log("User dismissed the install prompt");
      }
    });
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Dismiss button clicked");
    setSupportsPWA(false);
    setIsInstalled(false);
    // 닫기 버튼을 눌러도 프롬프트는 유지
  };

  // PWA 환경인 경우 항상 숨김
  if (environment === "pwa" || environment === "ios-pwa") {
    return null;
  }

  // 설치할 수 없고, 설치되지도 않은 경우 숨김
  if (!supportsPWA && !isInstalled) {
    return null;
  }

  // 브라우저에서 접속했고, 이미 설치된 경우 PWA 사용 안내 메시지 표시
  if (isInstalled && environment === "browser") {
    return (
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-slide-up relative">
          {/* X 버튼 */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex items-center">
            <div className="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base m-0">
                설치된 앱 사용 가능
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm m-0">
                홈 화면에서 설치된 앱을 실행해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 설치 버튼 표시 (브라우저 환경에서만)
  if (environment === "browser" && !isInstalled) {
    console.log("Rendering PWA install button - supportsPWA:", supportsPWA);
    return (
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-slide-up relative">
          {/* X 버튼 */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex items-center mb-4">
            <div className="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base m-0">
                앱 설치하기
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm m-0">
                더 빠르고 편리한 경험을 위해 앱을 설치하세요
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            설치하기
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default InstallPWA;
