"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "클립 메모는 어떤 앱인가요?",
    answer:
      "클립 메모는 빠르고 간편하게 메모를 작성하고 관리할 수 있는 웹 앱입니다. 카테고리별로 메모를 구분하고, 원하는 내용을 클립보드에 빠르게 복사할 수 있습니다.",
  },
  {
    question: "저장된 메모는 어디에 보관되나요?",
    answer:
      "모든 메모는 사용자의 브라우저 로컬 스토리지에 안전하게 저장됩니다. 서버에 데이터를 저장하지 않기 때문에 개인정보가 유출될 걱정이 없습니다.",
  },
  {
    question: "다른 기기와 동기화가 가능한가요?",
    answer:
      "현재 버전에서는 기기 간 동기화를 지원하지 않습니다. 추후 업데이트를 통해 클라우드 동기화 기능을 추가할 예정입니다.",
  },
  {
    question: "PWA가 무엇인가요?",
    answer: `PWA(Progressive Web App)는 웹사이트를 모바일이나 데스크톱에 앱처럼 설치할 수 있게 해주는 최신 웹 기술입니다. 웹의 편리함과 앱의 장점을 모두 제공하여, 브라우저를 열지 않고도 바로 실행할 수 있습니다.
      
      PWA로 설치하면 앱 아이콘이 홈 화면이나 시작 메뉴에 추가되어 빠르게 실행할 수 있고, 오프라인에서도 사용할 수 있습니다. 또한 브라우저를 열지 않고도 네이티브 앱과 동일한 사용자 경험을 제공받으며, 자동 업데이트와 푸시 알림 등의 기능도 사용할 수 있습니다.
      `,
  },

  {
    question: "PWA 설치는 어떻게 하나요?",
    answer: `설치 방법은 사용 중인 기기에 따라 다릅니다:

• Mac (Chrome/Edge/Arc)
    1. 브라우저 주소창 오른쪽의 설치 아이콘(↓) 클릭
    2. "설치" 버튼 클릭

• Windows (Chrome/Edge)
    1. 브라우저 주소창 오른쪽의 설치 아이콘(↓) 클릭
    2. "설치" 버튼 클릭

• iPhone/iPad (Safari)
    1. 공유 버튼(□↑) 탭
    2. "홈 화면에 추가" 선택
    3. "추가" 버튼 탭

• Android (Chrome)
    1. 브라우저 메뉴(⋮) 탭
    2. "앱 설치" 또는 "홈 화면에 추가" 선택
    3. "설치" 버튼 탭`,
  },
  {
    question: "메모를 카테고리별로 관리할 수 있나요?",
    answer:
      "네, 메모를 카테고리별로 구분하여 관리할 수 있습니다. 원하는 카테고리를 직접 추가하고, 메모를 해당 카테고리에 할당할 수 있어 체계적인 메모 관리가 가능합니다.",
  },
];

interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    content:
      "메모 앱을 여러 개 써봤지만, 클립 메모만큼 직관적이고 빠른 앱은 처음입니다. 특히 클립보드 복사 기능이 정말 편리해요!",
    author: "김지훈",
    role: "프리랜서 개발자",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Crect width='48' height='48' rx='24' fill='%234F46E5'/%3E%3Cpath d='M24 13C19.0294 13 15 17.0294 15 22C15 24.9003 16.3588 27.4659 18.5012 29.0556C19.4961 29.8295 18.9767 31.3223 17.7796 31.6249C15.5186 32.1812 13.6057 33.3251 12.1896 34.9111C11.1537 36.0764 12.0241 38 13.6622 38H34.3378C35.9759 38 36.8463 36.0764 35.8104 34.9111C34.3943 33.3251 32.4814 32.1812 30.2204 31.6249C29.0233 31.3223 28.5039 29.8295 29.4988 29.0556C31.6412 27.4659 33 24.9003 33 22C33 17.0294 28.9706 13 24 13Z' fill='white'/%3E%3Cpath d='M21 21C21 21 22.5 22.5 24 22.5C25.5 22.5 27 21 27 21' stroke='%234F46E5' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='19' cy='18' r='1.5' fill='%234F46E5'/%3E%3Ccircle cx='29' cy='18' r='1.5' fill='%234F46E5'/%3E%3C/svg%3E",
  },
  {
    content:
      "PWA로 설치해서 사용하니 네이티브 앱처럼 빠르고, 오프라인에서도 잘 작동해요. 일상적인 메모 도구로 완벽합니다.",
    author: "이서연",
    role: "디자이너",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Crect width='48' height='48' rx='24' fill='%23EC4899'/%3E%3Cpath d='M24 13C19.0294 13 15 17.0294 15 22C15 24.9003 16.3588 27.4659 18.5012 29.0556C19.4961 29.8295 18.9767 31.3223 17.7796 31.6249C15.5186 32.1812 13.6057 33.3251 12.1896 34.9111C11.1537 36.0764 12.0241 38 13.6622 38H34.3378C35.9759 38 36.8463 36.0764 35.8104 34.9111C34.3943 33.3251 32.4814 32.1812 30.2204 31.6249C29.0233 31.3223 28.5039 29.8295 29.4988 29.0556C31.6412 27.4659 33 24.9003 33 22C33 17.0294 28.9706 13 24 13Z' fill='white'/%3E%3Cpath d='M21 21C21 21 22.5 22.5 24 22.5C25.5 22.5 27 21 27 21' stroke='%23EC4899' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='19' cy='18' r='1.5' fill='%23EC4899'/%3E%3Ccircle cx='29' cy='18' r='1.5' fill='%23EC4899'/%3E%3Cpath d='M20 16L28 16' stroke='%23EC4899' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    content:
      "카테고리 기능이 있어서 업무용, 개인용 메모를 깔끔하게 구분해서 관리할 수 있어요. 심플하면서도 필요한 기능은 다 있네요!",
    author: "박현우",
    role: "대학원생",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Crect width='48' height='48' rx='24' fill='%2310B981'/%3E%3Cpath d='M24 13C19.0294 13 15 17.0294 15 22C15 24.9003 16.3588 27.4659 18.5012 29.0556C19.4961 29.8295 18.9767 31.3223 17.7796 31.6249C15.5186 32.1812 13.6057 33.3251 12.1896 34.9111C11.1537 36.0764 12.0241 38 13.6622 38H34.3378C35.9759 38 36.8463 36.0764 35.8104 34.9111C34.3943 33.3251 32.4814 32.1812 30.2204 31.6249C29.0233 31.3223 28.5039 29.8295 29.4988 29.0556C31.6412 27.4659 33 24.9003 33 22C33 17.0294 28.9706 13 24 13Z' fill='white'/%3E%3Cpath d='M21 21C21 21 22.5 22.5 24 22.5C25.5 22.5 27 21 27 21' stroke='%2310B981' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='19' cy='18' r='1.5' fill='%2310B981'/%3E%3Ccircle cx='29' cy='18' r='1.5' fill='%2310B981'/%3E%3Cpath d='M20 15H28M24 15V17' stroke='%2310B981' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E",
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
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-50 dark:bg-gray-900 backdrop-blur-md">
        <nav className="flex items-center h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Image
              src="/icons/icon-192x192.svg"
              alt="Clip Memo Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
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
              className="inline-flex items-center px-4 py-2 mb-4 space-x-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-full dark:bg-gray-800/30 dark:text-gray-300"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full dark:bg-indigo-400 animate-pulse" />
                새로운 메모의 시작
              </span>
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-6xl font-bold tracking-tight text-gray-900 lg:text-7xl dark:text-white"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="block"
              >
                메모를{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-400">
                  더 쉽게
                </span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="block mt-2 text-5xl text-gray-700 lg:text-6xl dark:text-gray-300"
              >
                더 빠르게
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl leading-relaxed text-gray-600 sm:text-2xl dark:text-gray-300"
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
                className="h-16 px-12 text-lg transition-all duration-300 border-0 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/20"
              >
                <Link
                  href="/memo"
                  className="flex items-center justify-center gap-2"
                >
                  무료로 시작하기
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
              className="inline-flex items-center px-4 py-2 mb-4 space-x-2 text-sm font-medium text-indigo-600 rounded-full bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full dark:bg-indigo-400 animate-pulse" />
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-400">
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

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                title: "빠른 기록",
                description:
                  "생각나는 순간 바로 메모하세요. 카테고리별로 자동 정리되어 찾기도 쉽습니다.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                ),
              },
              {
                title: "원클릭 복사",
                description:
                  "드래그할 필요 없이 클릭 한 번으로 클립보드에 복사됩니다. 필요할 때 바로 붙여넣기하세요.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                ),
              },
              {
                title: "앱처럼 사용",
                description:
                  "PWA로 설치하면 네이티브 앱처럼 사용할 수 있습니다. 오프라인에서도 완벽하게 동작합니다.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative bg-gray-50 dark:bg-gray-800 border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 h-[280px] group">
                  <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-12 mr-6 -mt-6 transition-all duration-300 transform bg-gray-900 dark:bg-gray-700 rounded-2xl -rotate-12 group-hover:rotate-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {feature.icon}
                    </svg>
                  </div>
                  <CardHeader>
                    <CardTitle className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 -mt-32">
        <div className="relative w-full max-w-4xl px-4 py-32 mx-auto sm:px-6 lg:px-8">
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
              className="inline-flex items-center px-4 py-2 mb-4 space-x-2 text-sm font-medium text-indigo-600 rounded-full bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full dark:bg-indigo-400 animate-pulse" />
                FAQ
              </span>
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white"
            >
              자주 묻는{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-400">
                질문
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-gray-600 sm:text-2xl dark:text-gray-300"
            >
              궁금하신 점을 확인해보세요
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 shadow-2xl bg-gray-50 dark:bg-gray-800 rounded-3xl"
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
              className="inline-flex items-center px-4 py-2 mb-4 space-x-2 text-sm font-medium text-indigo-600 rounded-full bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full dark:bg-indigo-400 animate-pulse" />
                사용자 후기
              </span>
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white"
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="transition-all border border-gray-200 shadow-xl dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <div className="absolute transition duration-1000 bg-gray-200 -inset-1 dark:bg-gray-700 rounded-2xl blur opacity-30 group-hover:opacity-100 group-hover:duration-200" />
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          width={56}
                          height={56}
                          className="relative rounded-2xl"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {testimonial.author}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="relative">
                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
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
      <section className="relative py-24 -mt-32">
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
              className="inline-flex items-center px-4 py-2 mb-4 space-x-2 text-sm font-medium text-indigo-600 rounded-full bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full dark:bg-indigo-400 animate-pulse" />
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-400">
                시작하세요
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-12 text-xl text-gray-600 sm:text-2xl dark:text-gray-300"
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
                className="h-16 px-12 text-lg transition-all duration-300 border-0 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/20"
              >
                <Link
                  href="/memo"
                  className="flex items-center justify-center gap-2"
                >
                  무료로 시작하기
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
