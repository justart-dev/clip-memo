# Clip Memo

Clip Memo는 웹 기반의 클립보드 관리 도구로, 필요한 내용을 클릭 한 번으로 쉽게 복사하고 관리할 수 있는 생산성 도구입니다. PWA(Progressive Web App)를 지원하여 데스크톱 및 모바일 기기에서 네이티브 앱과 같은 경험을 제공합니다.

## ✨ 주요 기능

- 클립보드 아이템 관리 (복사, 수정, 삭제, 즐겨찾기)
- 카테고리별 클립보드 아이템 분류
- 다크 모드 지원
- 오프라인 사용 가능 (PWA)
- 반응형 디자인
- 키보드 단축키 지원

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.0 이상
- pnpm (권장) 또는 npm

### 설치 및 실행

1. 저장소 클론

   ```bash
   git clone [repository-url]
   cd clip-memo
   ```

2. 의존성 설치

   ```bash
   pnpm install
   # 또는
   npm install
   ```

3. 개발 서버 실행

   ```bash
   pnpm dev
   # 또는
   npm run dev
   ```

   앱은 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

4. 프로덕션 빌드
   ```bash
   pnpm build
   pnpm start
   ```

## 📱 PWA 설정

이 프로젝트는 `next-pwa`를 사용하여 PWA 기능을 구현하고 있습니다.

### PWA 구성

`next.config.ts`에서 PWA 설정을 확인할 수 있습니다:

```typescript
const withPWA = withPWAInit({
  dest: "public", // PWA 파일이 생성될 디렉토리
  register: true, // 서비스 워커 자동 등록
  skipWaiting: true, // 새 버전 자동 활성화
  disable: process.env.NODE_ENV === "development", // 개발 모드에서는 비활성화
  buildExcludes: ["app-build-manifest.json"],
  fallbacks: {
    document: "/offline.html", // 오프라인 시 표시할 페이지
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30일 캐시
        },
      },
    },
    {
      urlPattern: /\/api\//,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24시간 캐시
        },
      },
    },
  ],
});
```

### PWA 설치 방법

1. 프로덕션 빌드 후 웹사이트에 접속
2. 브라우저 주소창에 표시되는 설치 아이콘 클릭 (Chrome, Edge 등)
3. '설치' 버튼 클릭

### 오프라인 지원

- 서비스 워커가 자동으로 등록되어 오프라인에서도 앱 사용이 가능합니다.
- 오프라인 상태에서는 `public/offline.html` 페이지가 표시됩니다.
- 이미지와 API 응답은 자동으로 캐시되어 오프라인에서도 일부 콘텐츠를 볼 수 있습니다.

## 🛠 기술 스택

- **프레임워크**: Next.js 15.2.1
- **언어**: TypeScript 5.8.2
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **UI 컴포넌트**: shadcn/ui
- **PWA**: next-pwa
- **패키지 관리자**: pnpm (권장)

## 📂 프로젝트 구조

```
src/
├── app/                    # 앱 라우트 (App Router)
│   ├── memo/              # 메모 관리 페이지
│   ├── page.tsx           # 랜딩 페이지
│   └── layout.tsx         # 공통 레이아웃
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/                # shadcn/ui 컴포넌트
│   └── ...
├── lib/                   # 유틸리티 함수 및 상수
└── styles/                # 전역 스타일
```

## 🌟 주요 컴포넌트 설명

### `app/page.tsx`

- 앱의 메인 랜딩 페이지
- 사용자에게 Clip Memo의 주요 기능과 이점을 소개
- PWA 설치 유도 배너 포함

### `app/memo/page.tsx`

- 메모 관리 메인 페이지
- 카테고리별 메모 필터링 기능
- 검색 및 정렬 기능

### `components/ui/`

- shadcn/ui 기반의 재사용 가능한 UI 컴포넌트
- 버튼, 카드, 입력 필드 등 공통 컴포넌트 보관

## 🎨 스타일 가이드

### Tailwind CSS

- `tailwind.config.js`에서 테마 커스텀 가능
- 기본 색상, 폰트, 간격 등 디자인 시스템 정의

### 애니메이션

- Framer Motion을 사용한 부드러운 전환 효과
- 버튼 호버, 페이지 전환, 모달 애니메이션 등

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)를 따릅니다.

---

<div align="center">
  <p>© 2025 Clip Memo. All rights reserved.</p>
</div>
