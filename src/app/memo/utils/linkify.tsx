import React from 'react';

// URL 패턴을 감지하는 정규식
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// 텍스트에서 링크를 감지하고 클릭 가능한 링크로 변환
export function linkify(text: string): React.ReactNode[] {
  const parts = text.split(URL_REGEX);
  
  return parts.map((part, index) => {
    if (URL_REGEX.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// 텍스트가 링크인지 확인하는 함수
export function isUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}