import { Metadata } from "next";

export const metadata: Metadata = {
  title: "클립 메모",
  description:
    "메모를 작성하고 카테고리별로 관리하세요. 원하는 내용을 클립보드에 빠르게 복사할 수 있습니다.",
  openGraph: {
    title: "클립 메모",
    description:
      "메모를 작성하고 카테고리별로 관리하세요. 원하는 내용을 클립보드에 빠르게 복사할 수 있습니다.",
  },
};

export default function MemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
