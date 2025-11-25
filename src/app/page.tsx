"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}



function FAQAccordion({ item }: { item: FAQItem }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={item.question}>
        <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.question}
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 whitespace-pre-line dark:text-gray-300">
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { t, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // DOM 로드가 완료되면 스플래시 화면이 표시되는 동안 데이터 체크 시작
    const checkMemos = async () => {
      try {
        // 로컬 스토리지 접근 전 작은 지연 추가 (스플래시 화면이 표시되도록)
        await new Promise((resolve) => setTimeout(resolve, 300));

        const savedItems = localStorage.getItem("clip-memo-items");
        const items = savedItems ? JSON.parse(savedItems) : [];

        if (items.length > 0) {
          // 사용자에게 저장된 메모가 있으면 메모 페이지로 리다이렉션
          router.push("/memo");
        } else {
          // 저장된 메모가 없으면 랜딩 페이지 표시
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking memos:", error);
        // 오류 발생해도 랜딩 페이지는 표시
        setIsLoading(false);
      }
    };

    // 즉시 확인 시작
    checkMemos();

    // 백그라운드에서 오프라인 모드인지 확인
    const checkOfflineMode = () => {
      if (!navigator.onLine) {
        console.log("App started in offline mode");
        // 오프라인 모드 처리를 위한 추가 로직 가능
      }
    };

    checkOfflineMode();
  }, [router]);

  return (
    <AnimatePresence>
      {!isLoading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950">
              <nav className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3">
                  {/* <Image
                    src="/icons/icon-192x192.svg"
                    alt="Clip Memo Logo"
                    width={32}
                    height={32}
                    className="w-7 h-7 rounded-md"
                  /> */}
                  <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-[family-name:var(--font-caveat)]">
                    Clip Memo
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage("ko")}>
                      한국어
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("en")}>
                      English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </header>

            {/* Hero Section */}
            <section className="relative flex items-center justify-center min-h-screen">
              <div className="relative px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-24 text-center"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center px-3.5 py-1.5 mb-4 text-xs font-medium tracking-wide text-gray-600 uppercase rounded-full border border-gray-200 dark:border-gray-700 dark:text-gray-400"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      {t.landing.hero.badge}
                    </span>
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl dark:text-gray-50"
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="block mb-2"
                    >
                      {t.landing.hero.title_prefix}{" "}
                      <span className="relative inline-block">
                        <span className="relative z-10">{t.landing.hero.title_highlight}</span>
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-gray-100 dark:bg-gray-800 -z-0 opacity-70" />
                      </span>
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="block text-3xl text-gray-600 sm:text-4xl lg:text-6xl dark:text-gray-300"
                    >
                      {t.landing.hero.title_suffix}
                    </motion.span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-2xl mx-auto text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl dark:text-gray-400"
                  >
                    {t.landing.hero.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col items-center justify-center gap-4 mt-12 sm:flex-row"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="h-16 px-12 text-lg transition-all duration-300 border-0 bg-gray-900 hover:bg-gray-700 rounded-2xl hover:shadow-xl hover:shadow-gray-500/20 text-white"
                    >
                      <Link
                        href="/memo"
                        className="flex items-center justify-center gap-2"
                      >
                        {t.landing.hero.cta_button}
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            <motion.div
              className="flex justify-center -mt-20 mb-10 sm:-mt-32 sm:mb-2"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>

            {/* Features Section */}
            <section className="relative py-16 sm:py-24">
              <div className="relative px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-24 text-center"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center px-4 py-2 mb-4 space-x-2 text-sm font-medium text-gray-600 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full dark:bg-gray-700 animate-pulse" />
                      {t.landing.features.badge}
                    </span>
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white"
                  >
                    {t.landing.features.title_prefix}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-50 dark:via-gray-300 dark:to-gray-50">
                      {t.landing.features.title_highlight}
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="inline-block text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-[family-name:var(--font-caveat)]"
                  >
                    {t.landing.features.subtitle_prefix}{" "}{t.landing.features.subtitle_suffix}
                  </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: t.landing.features.items.copy.title,
                      description: t.landing.features.items.copy.desc,
                      icon: (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      ),
                    },
                    {
                      title: t.landing.features.items.search.title,
                      description: t.landing.features.items.search.desc,
                      icon: (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      ),
                    },
                    {
                      title: t.landing.features.items.tag.title,
                      description: t.landing.features.items.tag.desc,
                      icon: (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      ),
                    },
                    {
                      title: t.landing.features.items.pwa.title,
                      description: t.landing.features.items.pwa.desc,
                      icon: (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      ),
                    },
                    {
                      title: t.landing.features.items.local.title,
                      description: t.landing.features.items.local.desc,
                      icon: (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                        />
                      ),
                    },
                    {
                      title: (
                        <span className="flex items-center gap-2">
                          {t.landing.features.items.backup.title}
                          <span className="px-1.5 py-0.5 text-[8px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            {t.landing.features.items.backup.badge}
                          </span>
                        </span>
                      ),
                      description: t.landing.features.items.backup.desc,
                      icon: (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                      ),
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="group h-full"
                    >
                      <Card className="h-full transition-all duration-200 border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-800/30">
                        <CardContent className="p-4">
                          <div className="flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-8 h-8 text-gray-900 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-50">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  {feature.icon}
                                </svg>
                              </div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {feature.title}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {feature.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="relative py-16 sm:py-24 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="relative w-full max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-12 sm:mb-16 text-center"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium tracking-wide text-gray-600 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full dark:bg-gray-500" />
                      {t.landing.faq.badge}
                    </span>
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white"
                  >
                    {t.landing.faq.title_prefix}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-50 dark:via-gray-300 dark:to-gray-50">
                      {t.landing.faq.title_highlight}
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-3 text-base text-gray-600 sm:text-lg dark:text-gray-300"
                  >
                    {t.landing.faq.description}
                  </motion.p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="max-w-3xl mx-auto p-5 sm:p-6 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 rounded-xl shadow-sm"
                >
                  {t.landing.faq.items.map((faq, index) => (
                    <motion.div
                      key={faq.question}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <FAQAccordion item={faq} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative py-16 sm:py-24">
              <div className="relative px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-24 text-center"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center px-3.5 py-1.5 mb-4 text-xs font-medium tracking-wide text-gray-600 uppercase rounded-full border border-gray-200 dark:border-gray-700 dark:text-gray-400"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      {t.landing.testimonials.badge}
                    </span>
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4.5xl"
                  >
                    {t.landing.testimonials.title_before && (
                      <>{t.landing.testimonials.title_before}{" "}</>
                    )}
                    <span className="inline-block text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-[family-name:var(--font-caveat)]">
                      {t.landing.testimonials.title_highlight}
                    </span>
                    {t.landing.testimonials.title_after && (
                      <>{" "}{t.landing.testimonials.title_after}</>
                    )}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-xl text-gray-600 sm:text-2xl dark:text-gray-300"
                  >
                    {t.landing.testimonials.description}
                  </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      content: t.landing.testimonials.items[0].content,
                      author: t.landing.testimonials.items[0].author,
                      role: t.landing.testimonials.items[0].role,
                      rating: 4.5,
                      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=lee&backgroundColor=0ea5e9&backgroundType=gradientLinear",
                    },
                    {
                      content: t.landing.testimonials.items[1].content,
                      author: t.landing.testimonials.items[1].author,
                      role: t.landing.testimonials.items[1].role,
                      rating: 4.5,
                      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=park&backgroundColor=ec4899&backgroundType=gradientLinear",
                    },
                    {
                      content: t.landing.testimonials.items[2].content,
                      author: t.landing.testimonials.items[2].author,
                      role: t.landing.testimonials.items[2].role,
                      rating: 5,
                      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=kim&backgroundColor=10b981&backgroundType=gradientLinear",
                    },
                    {
                      content: t.landing.testimonials.items[3].content,
                      author: t.landing.testimonials.items[3].author,
                      role: t.landing.testimonials.items[3].role,
                      rating: 4.5,
                      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=choi&backgroundColor=f59e0b&backgroundType=gradientLinear",
                    },
                    {
                      content: t.landing.testimonials.items[4].content,
                      author: t.landing.testimonials.items[4].author,
                      role: t.landing.testimonials.items[4].role,
                      rating: 5,
                      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=jung&backgroundColor=8b5cf6&backgroundType=gradientLinear",
                    },
                  ].map((testimonial, index) => (
                    <motion.div
                      key={testimonial.author}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group h-full"
                    >
                      <Card className="h-full transition-all duration-200 border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-800/30">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <Image
                                src={testimonial.avatar}
                                alt={testimonial.author}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-gray-50">
                                    {testimonial.author}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {testimonial.role}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isHalfStar =
                                      star > Math.floor(testimonial.rating) &&
                                      star - 0.5 <= testimonial.rating;
                                    const isFilled =
                                      star <= Math.floor(testimonial.rating);

                                    return (
                                      <div key={star} className="relative">
                                        <svg
                                          className={`w-3.5 h-3.5 ${
                                            isFilled
                                              ? "text-amber-400"
                                              : "text-gray-300"
                                          }`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {isHalfStar && (
                                          <div className="absolute inset-0 w-1/2 overflow-hidden">
                                            <svg
                                              className="w-3.5 h-3.5 text-amber-400"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <span className="ml-1 text-xs text-gray-500">
                                    {testimonial.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                {testimonial.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-16 sm:py-24">
              <div className="relative w-full px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl mx-auto text-center"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center px-3.5 py-1.5 mb-4 text-xs font-medium tracking-wide text-gray-600 uppercase rounded-full border border-gray-200 dark:border-gray-700 dark:text-gray-400"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      {t.landing.cta.badge}
                    </span>
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white"
                  >
                    {t.landing.cta.title_prefix}{" "}
                    <span className="relative">
                      <span className="relative z-10">{t.landing.cta.title_highlight}</span>
                      <span className="absolute bottom-0 left-0 w-full h-3 bg-gray-100 dark:bg-gray-800 -z-0 opacity-70" />
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8 text-lg text-gray-600 sm:text-xl dark:text-gray-400"
                  >
                    {t.landing.cta.description_prefix}
                    <br />
                    <span className="inline-block text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-[family-name:var(--font-caveat)]">
                      {t.landing.cta.description_middle}
                    </span>
                    {" "}{t.landing.cta.description_suffix}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="h-14 px-8 text-base font-medium transition-all duration-200 bg-gray-900 border border-gray-900 rounded-lg hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:border-gray-50 dark:hover:bg-gray-100 group"
                    >
                      <Link
                        href="/memo"
                        className="flex items-center justify-center gap-2"
                      >
                        {t.landing.cta.button}
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </section>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
