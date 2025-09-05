import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* iOS Safari status bar color - 우선순위를 위해 최상단 배치 */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />

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
            html, body {
              background-color: #ffffff !important;
            }
            
            
            @keyframes fade-in {
              0% {
                opacity: 0;
                transform: translateY(-10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
            
            /* 토스트 컨테이너만 가운데 위치 */
            [data-sonner-toaster] {
              position: fixed !important;
              top: 80px !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              z-index: 10000 !important;
            }
            
            /* 토스트들이 세로로 쌓이되 원래 UI 유지 */
            [data-sonner-toaster] ol {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              gap: 8px !important;
            }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <PWARegister />
        {children}
        <ClientInstallPWAWrapper />
        <Analytics />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
