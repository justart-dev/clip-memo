"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="space-y-6 text-center">
        <div className="text-6xl animate-bounce">🤔</div>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-primary">앗! 404</h1>
          <h2 className="text-xl font-medium text-foreground">
            찾으시는 페이지가 숨어버렸어요
          </h2>
          <p className="text-sm text-muted-foreground">
            혹시 주소를 잘못 입력하신 건 아닐까요?
            <br />
            아니면 제가 실수로 페이지를 다른 곳에 두었을 수도 있어요
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            홈으로 돌아갈래요
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
            이전 페이지로 갈게요
          </button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p className="animate-pulse">
            📎 조금 전에 복사한 그 텍스트, 클립메모가 기억하고 있을게요
          </p>
        </div>
      </div>
    </div>
  );
}
