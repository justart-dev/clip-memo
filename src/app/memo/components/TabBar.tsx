"use client";

import React from "react";
import { AddCategoryDialog } from "./AddCategoryDialog";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  isSticky?: boolean;
}

const TabBar = ({
  categories,
  activeTab,
  onTabChange,
  onAddCategory,
}: TabBarProps) => {
  const tabs = ["전체", ...categories];

  return (
    <nav
      className="flex flex-wrap gap-2 pb-2 border-b border-border"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls={`${tab}-panel`}
          className={`px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
            activeTab === tab
              ? "bg-primary text-primary-foreground shadow-sm scale-105"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
      <AddCategoryDialog onAdd={onAddCategory}>
        <button className="px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer bg-black text-white hover:bg-black/90 flex items-center gap-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V20M4 12H20"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </AddCategoryDialog>
    </nav>
  );
};

export default TabBar;
