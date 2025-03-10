import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import PWARegister from "./pwa";
import ClientInstallPWAWrapper from "./ClientInstallPWAWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clip Memo - 빠른 메모, 쉬운 공유",
  description:
    "필요한 내용을 빠르게 기록하고, 클립보드로 복사해 효율을 높이세요!",
  openGraph: {
    title: "Clip Memo - 빠른 메모, 쉬운 공유",
    description:
      "필요한 내용을 빠르게 기록하고, 클립보드로 복사해 효율을 높이세요!",
    type: "website",
    locale: "ko_KR",
  },

  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "클립 메모",
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWARegister />
        {children}
        <ClientInstallPWAWrapper />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
