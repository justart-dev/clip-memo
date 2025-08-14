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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "클립 메모는 무엇인가요?",
    answer: `클립 메모는 복잡한 기능 없이 메모의 핵심에만 집중한 간단하고 빠른 웹 앱입니다. 
    
    클릭 한 번으로 메모를 클립보드에 복사할 수 있고, URL이 포함된 메모는 클릭하면 바로 해당 사이트로 이동할 수 있습니다. 
    
    또한, 자동완성 기능으로 원하는 메모를 빠르게 찾을 수 있어요.
    
    카테고리별로 메모를 체계적으로 관리할 수 있으며, 인터넷 연결 없이도 오프라인에서 언제든 사용할 수 있어 일상적인 메모 관리 도구로 완벽합니다.`,
  },
  {
    question: "검색 자동완성은 어떻게 작동하나요?",
    answer: `2글자 이상 입력하면 메모 제목과 내용에서 일치하는 항목을 최대 5개까지 추천합니다. 제목 매칭을 우선하며, 그 이후에는 내부 알고리즘에 의해 추천됩니다.`,
  },
  {
    question: "데이터는 안전한가요?",
    answer: `모든 메모는 브라우저 로컬 스토리지에 저장되어 개인정보가 외부로 유출되지 않습니다. 
      
단, 브라우저 데이터 초기화 시 메모가 삭제되므로 중요한 내용은 백업 기능을 활용하세요.`,
  },
  {
    question: "앱으로 설치할 수 있나요?",
    answer: `네, PWA 기술로 웹에서 앱처럼 설치 가능합니다.

• PC: 브라우저 주소창의 설치 아이콘 클릭
• iPhone: 공유 버튼 → "홈 화면에 추가"  
• Android: 브라우저 메뉴 → "앱 설치"

설치하면 오프라인에서도 사용할 수 있어요.`,
  },
  {
    question: "백업과 복구는 어떻게 하나요?",
    answer:
      "메모 하단의 '백업하기' 버튼을 클릭하면 모든 메모가 클립보드에 복사됩니다. 복구할 때는 백업 데이터를 복사한 후 '복구하기' 버튼을 클릭하면 됩니다.",
  },
  {
    question: "무료로 사용할 수 있나요?",
    answer: `네, 클립 메모는 완전 무료로 제공됩니다. 광고도 없고 숨겨진 비용도 없습니다.
    
사용자들의 소중한 피드백을 통해 지속적으로 발전하고 있으며, 여러분의 의견이 더 나은 서비스를 만드는 원동력이 됩니다. 상단의 피드백 버튼을 통해 언제든 의견을 공유해주세요!`,
  },
  {
    question: "숨겨진 기능이 있다던데, 정말인가요?",
    answer: `소소한 이스터에그를 숨겨두었답니다. 직접 발견해보세요!

#모바일 #OOO #새로고침 #pull`,
  },
];

interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    content: "클립보드 복사 기능이 편하고 깔끔하네요!",
    author: "이OO",
    role: "데이터 사이언티스트",
    rating: 4.5,
    avatar:
      "https://api.dicebear.com/7.x/notionists/svg?seed=lee&backgroundColor=0ea5e9&backgroundType=gradientLinear",
  },
  {
    content:
      "자주 사용하는 명령어들을 저장해두고 바로 복사해서 쓰니까 업무 효율이 확 올랐어요.",
    author: "박OO",
    role: "웹 개발자",
    rating: 4.5,
    avatar:
      "https://api.dicebear.com/7.x/notionists/svg?seed=park&backgroundColor=ec4899&backgroundType=gradientLinear",
  },
  {
    content: "심플하면서도 필요한 기능은 다 있네요",
    author: "김OO",
    role: "스타트업 밥풀 대표",
    rating: 5,
    avatar:
      "https://api.dicebear.com/7.x/notionists/svg?seed=kim&backgroundColor=10b981&backgroundType=gradientLinear",
  },
];

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
              <nav className="flex items-center h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/icons/icon-192x192.svg"
                    alt="Clip Memo Logo"
                    width={32}
                    height={32}
                    className="w-7 h-7 rounded-md"
                  />
                  <div className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                    Clip Memo
                  </div>
                </div>
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
                      새로운 메모의 시작
                    </span>
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 text-5xl font-bold tracking-tight text-gray-900 lg:text-6.5xl dark:text-gray-50"
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="block"
                    >
                      메모를{" "}
                      <span className="relative">
                        <span className="relative z-10">더 쉽게</span>
                        <span className="absolute bottom-0 left-0 w-full h-3 bg-gray-100 dark:bg-gray-800 -z-0 opacity-70" />
                      </span>
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="block mt-2 text-4xl text-gray-600 lg:text-5.5xl dark:text-gray-300"
                    >
                      더 빠르게
                    </motion.span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-400"
                  >
                    복잡한 기능은 잊어보세요. 클립 메모와 함께라면
                    <br className="hidden md:block" />단 한 번의 클릭으로 메모를
                    저장하고 공유할 수 있습니다.
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
                        무료로 시작하기
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            <motion.div
              className="flex justify-center -mt-32 mb-2"
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
            <section className="relative py-24 -mt-32">
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
                      특별한 기능
                    </span>
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white"
                  >
                    더 쉽게,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-50 dark:via-gray-300 dark:to-gray-50">
                      더 빠르게
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-2xl mx-auto text-xl text-gray-600 sm:text-2xl dark:text-gray-300"
                  >
                    클립 메모만의 특별한 기능을 경험해보세요
                  </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "원클릭 복사",
                      description:
                        "드래그할 필요 없이 클릭 한 번으로 클립보드에 복사됩니다.",
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
                      title: "스마트 검색",
                      description:
                        "키워드로 원하는 메모를 쉽게 찾을 수 있습니다. 자동완성 기능을 통해 더욱 빠르게 검색하세요.",
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
                      title: "태그 관리",
                      description:
                        "메모를 태그로 분류하고 체계적으로 관리하세요.",
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
                      title: "PWA 지원",
                      description:
                        "앱처럼 설치하여 더욱 편리하게 사용하세요.오프라인에서도 기록은 계속돼요.",
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
                      title: "로컬 저장",
                      description:
                        "모든 데이터는 브라우저에 안전하게 저장됩니다.",
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
                        <div className="flex items-center gap-2">
                          데이터 백업
                          <span className="px-1.5 py-0.5 text-[8px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            NEW
                          </span>
                        </div>
                      ),
                      description:
                        "메모를 클립보드에 복사하여 손쉽게 복구할 수 있습니다.",
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
            <section className="relative py-16 sm:py-24 -mt-16 sm:-mt-24">
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
                      FAQ
                    </span>
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white"
                  >
                    자주 묻는{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-50 dark:via-gray-300 dark:to-gray-50">
                      질문
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-3 text-base text-gray-600 sm:text-lg dark:text-gray-300"
                  >
                    궁금하신 점을 확인해보세요
                  </motion.p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="max-w-3xl mx-auto p-5 sm:p-6 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 rounded-xl shadow-sm"
                >
                  {faqs.map((faq, index) => (
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
            <section className="relative py-24 -mt-16">
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
                      사용자 후기
                    </span>
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4.5xl"
                  >
                    클립 메모와 함께하는 분들
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-xl text-gray-600 sm:text-2xl dark:text-gray-300"
                  >
                    실제 사용자들의 생생한 후기를 만나보세요
                  </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {testimonials.map((testimonial, index) => (
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
            <section className="relative py-16 sm:py-24 -mt-32">
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
                      시작하기
                    </span>
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white"
                  >
                    지금 바로{" "}
                    <span className="relative">
                      <span className="relative z-10">시작하세요</span>
                      <span className="absolute bottom-0 left-0 w-full h-3 bg-gray-100 dark:bg-gray-800 -z-0 opacity-70" />
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8 text-lg text-gray-600 sm:text-xl dark:text-gray-400"
                  >
                    더 이상 복잡한 메모 앱은 그만!
                    <br />
                    클립 메모와 함께 심플하고 효율적인 메모 생활을 시작하세요.
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
                        무료로 시작하기
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
