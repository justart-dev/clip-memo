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
    template: "%s | Clip memo",
    default: "클립 메모 - 빠르게 복사하는 메모장",
  },
  description:
    "클립메모로 복사하고 싶은 텍스트를 손쉽게 저장하고 관리하세요. 원클릭 복사 기능으로 필요할 때 즉시 사용할 수 있으며, 강력한 검색으로 저장된 텍스트를 빠르게 찾을 수 있습니다. PWA 지원으로 앱처럼 설치하여 사용할 수 있어 더욱 편리합니다. 자주 사용하는 텍스트를 클립메모와 함께 스마트하게 관리하세요.",
  keywords: ["메모장", "클립보드", "복사", "생산성"],
  authors: [{ name: "클립 메모" }],
  creator: "클립 메모",
  publisher: "클립 메모",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "클립 메모 - 빠르게 복사하는 메모장",
    description:
      "클립메모로 복사하고 싶은 텍스트를 손쉽게 저장하고 관리하세요. 원클릭 복사 기능으로 필요할 때 즉시 사용할 수 있으며, 강력한 검색으로 저장된 텍스트를 빠르게 찾을 수 있습니다. PWA 지원으로 앱처럼 설치하여 사용할 수 있어 더욱 편리합니다. 자주 사용하는 텍스트를 클립메모와 함께 스마트하게 관리하세요.",
    url: "https://clip-memo.vercel.app",
    siteName: "클립 메모",
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
        <meta name="google-site-verification" content="vhwJw57Gjn2GqP4ls2gFNnU2QPZLp9OwT6g7aOxP3yM" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "클립메모",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web, PWA",
              description:
                "클립메모로 복사하고 싶은 텍스트를 손쉽게 저장하고 관리하세요. 원클릭 복사 기능으로 필요할 때 즉시 사용할 수 있습니다.",
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
