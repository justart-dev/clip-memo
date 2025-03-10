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
      "클립 메모는 빠르고 간편한 메모 작성과 클립보드 복사 기능을 제공하는 웹 앱입니다. PWA로 설치하여 데스크톱이나 모바일에서 네이티브 앱처럼 사용할 수 있습니다.",
  },
  {
    question: "저장된 메모는 어디에 보관되나요?",
    answer:
      "메모는 현재 사용 중인 기기의 로컬 스토리지에 안전하게 저장됩니다. 따라서 인터넷 연결 없이도 사용할 수 있으며, 브라우저 데이터를 삭제하지 않는 한 메모가 유지됩니다.",
  },
  {
    question: "다른 기기와 동기화가 가능한가요?",
    answer:
      "현재 버전에서는 기기 간 동기화를 지원하지 않습니다. 추후 업데이트를 통해 클라우드 동기화 기능을 추가할 예정입니다.",
  },
  {
    question: "PWA가 무엇인가요?",
    answer:
      "PWA(Progressive Web App)는 웹사이트를 모바일이나 데스크톱에 앱처럼 설치할 수 있게 해주는 최신 웹 기술입니다. 웹의 편리함과 앱의 장점을 모두 제공하여, 브라우저를 열지 않고도 바로 실행할 수 있습니다.",
  },
  {
    question: "PWA로 설치하면 어떤 장점이 있나요?",
    answer:
      "PWA로 설치하면 앱 아이콘이 홈 화면이나 시작 메뉴에 추가되어 빠르게 실행할 수 있고, 오프라인에서도 사용할 수 있습니다. 또한 브라우저를 열지 않고도 네이티브 앱과 동일한 사용자 경험을 제공받으며, 자동 업데이트와 푸시 알림 등의 기능도 사용할 수 있습니다.",
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
        <AccordionContent className="text-gray-600 dark:text-gray-300">
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
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
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(79,70,229,0.05)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(79,70,229,0.1)_100%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] bg-[length:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="inline-block mb-6 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-300"
            >
              ✨ 새로운 메모의 시작
            </motion.div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
              메모를{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                더 쉽게
              </span>
              <br />
              <span className="text-4xl sm:text-6xl md:text-7xl text-gray-600 dark:text-gray-300">
                더 빠르게
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              복잡한 기능은 잊어보세요. 클립 메모와 함께라면
              <br />단 한 번의 클릭으로 메모를 저장하고 공유할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-lg h-16 px-12"
              >
                <Link href="/memo">
                  무료로 시작하기
                  <svg
                    className="w-5 h-5 ml-2 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen flex items-center relative bg-indigo-50 dark:bg-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(79,70,229,0.05)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(79,70,229,0.1)_100%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-24"
          >
            <span className="inline-block text-indigo-600 dark:text-indigo-400 text-lg font-medium mb-4">
              특별한 기능
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              더 쉽게, 더 빠르게
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              클립 메모만의 특별한 기능을 경험해보세요
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="relative bg-white dark:bg-gray-800 border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 h-[280px]">
                <div className="absolute top-0 right-0 -mt-6 mr-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center transform -rotate-12">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                    빠른 기록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    생각나는 순간 바로 메모하세요. 카테고리별로 자동 정리되어
                    찾기도 쉽습니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="relative bg-white dark:bg-gray-800 border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 h-[280px]">
                <div className="absolute top-0 right-0 -mt-6 mr-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center transform -rotate-12">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                    원클릭 복사
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    드래그할 필요 없이 클릭 한 번으로 클립보드에 복사됩니다.
                    필요할 때 바로 붙여넣기하세요.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="relative bg-white dark:bg-gray-800 border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 h-[280px]">
                <div className="absolute top-0 right-0 -mt-6 mr-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center transform -rotate-12">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                    앱처럼 사용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    PWA로 설치하면 네이티브 앱처럼 사용할 수 있습니다.
                    오프라인에서도 완벽하게 동작합니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="min-h-screen flex items-center relative bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(79,70,229,0.05)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(79,70,229,0.1)_100%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-24"
          >
            <span className="inline-block text-indigo-600 dark:text-indigo-400 text-lg font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              자주 묻는 질문
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
              궁금하신 점을 확인해보세요
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
          >
            {faqs.map((faq, index) => (
              <FAQAccordion key={index} item={faq} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="min-h-screen flex items-center relative bg-indigo-50 dark:bg-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(79,70,229,0.05)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(79,70,229,0.1)_100%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-24"
          >
            <span className="inline-block text-indigo-600 dark:text-indigo-400 text-lg font-medium mb-4">
              사용자 후기
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              클립 메모와 함께하는 분들
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
              실제 사용자들의 생생한 후기를 만나보세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 border-none shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={56}
                        height={56}
                        className="rounded-2xl"
                      />
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
                      <svg
                        className="absolute -top-4 -left-4 w-8 h-8 text-indigo-200 dark:text-indigo-800"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {testimonial.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center relative bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(79,70,229,0.05)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(79,70,229,0.1)_100%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block text-indigo-600 dark:text-indigo-400 text-lg font-medium mb-4">
              시작하기
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12">
              더 이상 복잡한 메모 앱은 그만!
              <br />
              클립 메모와 함께 심플하고 효율적인 메모 생활을 시작하세요.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-lg h-16 px-12"
            >
              <Link href="/memo">
                무료로 시작하기
                <svg
                  className="w-5 h-5 ml-2 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
