"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ko, Translations } from "@/locales/ko";
import { en } from "@/locales/en";

type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ko");
  const [t, setT] = useState<Translations>(ko);

  useEffect(() => {
    // 초기 로드 시 로컬 스토리지 확인
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "ko" || savedLang === "en")) {
      setLanguageState(savedLang);
      setT(savedLang === "ko" ? ko : en);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setT(lang === "ko" ? ko : en);
    localStorage.setItem("language", lang);
  };

  // 하이드레이션 불일치 방지를 위해 로드 전에는 렌더링하지 않음 (선택사항)
  // 여기서는 기본값(ko)으로 렌더링하되, useEffect에서 업데이트
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
