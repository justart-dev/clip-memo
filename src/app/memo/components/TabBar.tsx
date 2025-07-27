"use client";

import React from "react";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  categories: string[];
  className?: string;
}

const TabBar = ({
  categories,
  activeTab,
  onTabChange,
  className = "",
}: TabBarProps) => {
  const tabs = categories;

  return (
    <nav className={`flex flex-wrap gap-2 ${className}`} role="tablist">
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
          style={{ WebkitAppearance: 'none', backgroundColor: activeTab === tab ? undefined : 'transparent' }}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
