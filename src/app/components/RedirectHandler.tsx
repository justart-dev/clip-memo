"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    const savedItems = localStorage.getItem("clip-memo-items");
    const items = savedItems ? JSON.parse(savedItems) : [];

    if (items.length > 0) {
      router.push("/memo");
    }
  }, [router]);

  return null;
}
