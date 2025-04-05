import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import PWARegister from "./pwa";
import ClientInstallPWAWrapper from "./ClientInstallPWAWrapper";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://clip-memo.vercel.app"),
  title: {
    template: "%s | Clip Memo",
    default: "Clip Memo - 빠르게 복사하는 메모장",
  },
  description:
    "Clip Memo로 복사하고 싶은 텍스트를 손쉽게 저장하고 관리하세요. 원클릭 복사 기능으로 필요할 때 즉시 사용할 수 있으며, 강력한 검색으로 저장된 텍스트를 빠르게 찾을 수 있습니다. PWA 지원으로 앱처럼 설치하여 사용할 수 있어 더욱 편리합니다. 자주 사용하는 텍스트를 Clip Memo와 함께 스마트하게 관리하세요.",
  keywords: ["메모장", "클립보드", "복사", "생산성"],
  authors: [{ name: "Clip Memo" }],
  creator: "Clip Memo",
  publisher: "Clip Memo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Clip Memo - 빠르게 복사하는 메모장",
    description:
      "Clip Memo로 복사하고 싶은 텍스트를 손쉽게 저장하고 관리하세요. 원클릭 복사 기능으로 필요할 때 즉시 사용할 수 있으며, 강력한 검색으로 저장된 텍스트를 빠르게 찾을 수 있습니다. PWA 지원으로 앱처럼 설치하여 사용할 수 있어 더욱 편리합니다. 자주 사용하는 텍스트를 Clip Memo와 함께 스마트하게 관리하세요.",
    url: "https://clip-memo.vercel.app",
    siteName: "Clip Memo",
    locale: "ko_KR",
    type: "website",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="google-site-verification"
          content="vhwJw57Gjn2GqP4ls2gFNnU2QPZLp9OwT6g7aOxP3yM"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Clip Memo",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web, PWA",
              description:
                "Clip Memo로 복사하고 싶은 텍스트를 손쉽게 저장하고 관리하세요. 원클릭 복사 기능으로 필요할 때 즉시 사용할 수 있습니다.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              featureList: [
                "원클릭 텍스트 복사",
                "빠른 검색 기능",
                "PWA 지원",
                "간편한 메모 관리",
              ],
            }),
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            #splash-screen {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background-color: #ffffff;
              z-index: 9999;
              transition: opacity 0.5s ease-out;
            }
            .dark #splash-screen {
              background-color: #111827;
            }
            #splash-screen.fade-out {
              opacity: 0;
            }
            .splash-logo {
              width: 80px;
              height: 80px;
              margin-bottom: 20px;
              animation: pulse 2s infinite;
            }
            .splash-title {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 20px;
              color: #000000;
            }
            .dark .splash-title {
              color: #FFFFFF;
            }
            .splash-spinner {
              width: 40px;
              height: 40px;
              border: 4px solid rgba(79, 70, 229, 0.2);
              border-radius: 50%;
              border-left-color: #4F46E5;
              animation: spin 1s linear infinite;
            }
            .dark .splash-spinner {
              border: 4px solid rgba(129, 140, 248, 0.2);
              border-left-color: #818CF8;
            }
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.8;
                transform: scale(0.95);
              }
            }
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // 스플래시 화면 처리 스크립트
            window.addEventListener('load', function() {
              // 페이지가 완전히 로드된 후 약간의 지연 시간을 두고 스플래시 화면 숨기기
              setTimeout(function() {
                const splashScreen = document.getElementById('splash-screen');
                if (splashScreen) {
                  splashScreen.classList.add('fade-out');
                  setTimeout(function() {
                    splashScreen.style.display = 'none';
                  }, 500); // 페이드 아웃 애니메이션 시간
                }
              }, 1000); // 최소 1초 동안 스플래시 화면 표시
            });

            // 오프라인 상태 감지 및 처리
            window.addEventListener('online', function() {
              console.log('온라인 상태가 되었습니다.');
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                // 백그라운드 동기화 요청
                navigator.serviceWorker.ready.then(function(registration) {
                  if ('sync' in registration) {
                    registration.sync.register('sync-memos');
                  }
                });
              }
            });

            window.addEventListener('offline', function() {
              console.log('오프라인 상태가 되었습니다.');
            });
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <div id="splash-screen">
          <Image
            src="/icons/icon-192x192.svg"
            alt="Clip Memo Logo"
            width={80}
            height={80}
            className="splash-logo"
            priority
          />
          <div className="splash-title">Clip Memo</div>
        </div>
        <PWARegister />
        {children}
        <ClientInstallPWAWrapper />
        <Analytics />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
