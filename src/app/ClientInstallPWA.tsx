"use client";

import dynamic from "next/dynamic";

const InstallPWA = dynamic(() => import("@/components/InstallPWA"), {
  ssr: false,
});

export default function ClientInstallPWA() {
  return <InstallPWA />;
}
