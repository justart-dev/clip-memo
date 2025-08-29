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

// PWA가 설치되었는지 확인하는 함수 (단순화)
const isPWAInstalled = (): boolean => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as NavigatorWithStandalone).standalone === true)
  );
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
    // 현재 환경 확인
    const currentEnv = getEnvironment();
    setEnvironment(currentEnv);

    // PWA 환경이면 설치 버튼을 표시하지 않음
    if (currentEnv === "pwa" || currentEnv === "ios-pwa") {
      setIsInstalled(true);
      setSupportsPWA(false);
      return;
    }

    // 설치 상태 확인
    const installed = isPWAInstalled();
    setIsInstalled(installed);
    if (installed) {
      setSupportsPWA(false);
    }

    // iOS가 아닌 경우에만 beforeinstallprompt 이벤트 처리
    if (!isIOS) {
      // 저장된 deferredPrompt 확인
      const savedPrompt = window.deferredPrompt;
      if (savedPrompt && !installed) {
        setSupportsPWA(true);
        setPromptInstall(savedPrompt);
      } else if (!installed && 'serviceWorker' in navigator && 
                 (location.protocol === 'https:' || location.hostname === 'localhost')) {
        // PWA 기본 조건을 만족하면 설치 버튼 표시
        setSupportsPWA(true);
      }

      const handler = (e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        if (!isPWAInstalled()) {
          window.deferredPrompt = e;
          setSupportsPWA(true);
          setPromptInstall(e);
          setIsInstalled(false);
        }
      };

      window.addEventListener("beforeinstallprompt", handler);

      // appinstalled 이벤트 리스너 추가
      const handleAppInstalled = () => {
        setIsInstalled(true);
        setSupportsPWA(false);
        setEnvironment("pwa");
        window.deferredPrompt = null;
      };

      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    } else {
      // iOS의 경우 PWA 설치 가능하고 설치되지 않은 경우에만 표시
      setSupportsPWA(!installed);
    }

    // 가시성 변경 시 재확인 (앱 설치 후 돌아올 때 감지)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const newEnv = getEnvironment();
        setEnvironment(newEnv);
        if (newEnv === "pwa" || newEnv === "ios-pwa") {
          setIsInstalled(true);
          setSupportsPWA(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isIOS]);


  const handleInstallClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isIOS) {
      alert(
        "Safari 브라우저의 '공유' 버튼을 눌러\n'홈 화면에 추가'를 선택해주세요."
      );
      return;
    }

    // beforeinstallprompt 이벤트가 있는 경우 사용
    if (promptInstall) {
      promptInstall.prompt();
      promptInstall.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
          window.deferredPrompt = null;
        }
      });
    } else {
      // beforeinstallprompt 이벤트가 없는 경우 브라우저별 안내
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('chrome')) {
        alert(
          "Chrome 브라우저의 주소창 오른쪽에 있는\n'앱 설치' 아이콘을 클릭하거나,\n메뉴(⋮) > '앱 설치'를 선택해주세요."
        );
      } else if (userAgent.includes('samsung')) {
        alert(
          "Samsung Internet의 메뉴를 열고\n'앱 설치' 또는 '홈 화면에 추가'를\n선택해주세요."
        );
      } else {
        alert(
          "브라우저 메뉴에서\n'홈 화면에 추가' 또는 '앱 설치'를\n선택해주세요."
        );
      }
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    setSupportsPWA(false);
  };

  const handleReinstall = (e: React.MouseEvent) => {
    e.preventDefault();
    
    setIsInstalled(false);
    
    if (isIOS) {
      setSupportsPWA(true);
      alert(
        "Safari 브라우저의 '공유' 버튼을 눌러\n'홈 화면에 추가'를 선택해주세요."
      );
      return;
    }
    
    const savedPrompt = window.deferredPrompt;
    if (savedPrompt) {
      setSupportsPWA(true);
      setPromptInstall(savedPrompt);
      savedPrompt.prompt();
      savedPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
          window.deferredPrompt = null;
        }
      });
    } else {
      setSupportsPWA(true);
    }
  };

  // PWA 환경인 경우 항상 숨김
  if (environment === "pwa" || environment === "ios-pwa") {
    return null;
  }

  // 브라우저 환경에서 설치된 앱 사용 안내 또는 설치 버튼 표시
  if (environment === "browser") {
    if (isInstalled) {
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
          <div className="mt-4">
            <button
              onClick={handleReinstall}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              재설치하기
            </button>
          </div>
        </div>
      </div>
    );
    }
    
    // 설치 가능한 경우 설치 버튼 표시
    if (supportsPWA) {
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
  }

  return null;
};

export default InstallPWA;
