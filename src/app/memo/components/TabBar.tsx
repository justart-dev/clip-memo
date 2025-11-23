"use client";

import React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  return (
    <nav className={cn("flex flex-wrap gap-2", className)} role="tablist">
      {categories.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            activeTab === tab
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
          style={{
            WebkitAppearance: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="active-tab-pill"
              className="absolute inset-0 bg-primary rounded-full"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              style={{ zIndex: -1 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
