"use client";

import React, { useState, useEffect } from "react";

// 타입 정의
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Window 인터페이스 확장
declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
    MSStream?: unknown;
  }
}

// iOS Safari용 Navigator 인터페이스 확장
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

// PWA 실행 모드 확인 (현재 PWA로 실행 중인지)
const isRunningInPWA = (): boolean => {
  if (typeof window === "undefined") return false;
  
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as NavigatorWithStandalone).standalone === true)
  );
};

// iOS 환경 확인
const isIOS = (): boolean => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPWA, setIsPWA] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // 초기 환경 감지
    const pwaActive = isRunningInPWA();
    const ios = isIOS();
    
    setIsPWA(pwaActive);
    setIsIOSDevice(ios);

    // 이미 PWA로 실행 중이면 설치 버튼 표시 안 함
    if (pwaActive) {
      return;
    }

    // 1. iOS 처리
    if (ios) {
      // iOS는 beforeinstallprompt 이벤트가 없으므로, PWA가 아니고 iOS라면 설치 안내 가능 상태로 설정
      setSupportsPWA(true);
      return;
    }

    // 2. 안드로이드/데스크톱 처리 (beforeinstallprompt 이벤트)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      // 이벤트를 저장해두고 나중에 트리거
      window.deferredPrompt = promptEvent;
      setPromptInstall(promptEvent);
      setSupportsPWA(true);
    };

    // 이미 이벤트가 발생했을 수 있으므로 확인
    if (window.deferredPrompt) {
      setPromptInstall(window.deferredPrompt);
      setSupportsPWA(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 3. 설치 완료 감지
    const handleAppInstalled = () => {
      setIsPWA(true);
      setSupportsPWA(false);
      setPromptInstall(null);
      window.deferredPrompt = null;
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isIOSDevice) {
      alert("Safari 브라우저 하단의 '공유' 버튼을 누르고\n'홈 화면에 추가'를 선택해주세요.");
      return;
    }

    if (!promptInstall) {
      // 프롬프트가 없는 경우 (수동 안내)
      alert("브라우저 메뉴에서 '앱 설치' 또는 '홈 화면에 추가'를 선택해주세요.");
      return;
    }

    // 설치 프롬프트 표시
    promptInstall.prompt();
    
    // 사용자 응답 대기
    const { outcome } = await promptInstall.userChoice;
    
    if (outcome === "accepted") {
      setSupportsPWA(false);
    }
    
    // 프롬프트는 한 번만 사용 가능하므로 초기화
    setPromptInstall(null);
    window.deferredPrompt = null;
  };

  const handleDismiss = () => {
    setSupportsPWA(false);
  };

  // PWA로 실행 중이면 아무것도 표시하지 않음
  if (isPWA) return null;

  // 설치가 지원되지 않거나 이미 닫은 경우 표시하지 않음
  if (!supportsPWA) return null;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-slide-up relative border border-gray-100 dark:border-gray-700">
        {/* 닫기 버튼 */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
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
          <div className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
            {/* 다운로드 아이콘 */}
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
          <div className="flex-grow pr-6">
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base m-0">
              앱 설치하기
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm m-0 mt-0.5">
              더 빠르고 편리한 사용을 위해 앱을 설치하세요.
            </p>
          </div>
        </div>
        
        <button
          onClick={handleInstallClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>설치하기</span>
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;
