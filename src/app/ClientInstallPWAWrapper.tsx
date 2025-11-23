"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const InstallPWA = dynamic(() => import("@/components/InstallPWA"), {
  ssr: false,
});

export default function ClientInstallPWAWrapper() {
  const pathname = usePathname();

  // 루트 경로('/')에서는 PWA 설치 프롬프트를 표시하지 않음
  if (pathname === "/") return null;

  return <InstallPWA />;
}
