"use client";

import React from "react";

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-24 right-6 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110 hover:shadow-xl z-20"
      style={{
        WebkitAppearance: "none",
        overflow: "hidden",
        WebkitBorderRadius: "9999px",
        borderRadius: "9999px",
      }}
      aria-label="새 메모 추가"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4V20M4 12H20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default FloatingButton;
