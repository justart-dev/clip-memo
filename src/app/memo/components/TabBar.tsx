"use client";

import React from "react";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  isSticky?: boolean;
}

const TabBar = ({
  categories,
  activeTab,
  onTabChange,
  onAddCategory,
  onDeleteCategory,
}: TabBarProps) => {
  const tabs = categories;

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
      <div className="flex gap-2 ml-auto">
        <AddCategoryDialog onAdd={onAddCategory} categories={categories}>
          <button
            className="px-3 py-2 text-sm font-medium rounded-full transition-colors duration-300 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"
            title="카테고리 추가"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path
                d="M12 4V20M4 12H20"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>카테고리 추가</span>
          </button>
        </AddCategoryDialog>
        <DeleteCategoryDialog
          categories={categories}
          onDelete={onDeleteCategory}
        >
          <button
            className="px-3 py-2 text-sm font-medium rounded-full transition-colors duration-300 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"
            title="카테고리 삭제"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path
                d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 11V16M14 11V16"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>카테고리 삭제</span>
          </button>
        </DeleteCategoryDialog>
      </div>
    </nav>
  );
};

export default TabBar;
