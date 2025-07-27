"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchSubmit = () => {
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isFocused ? "scale-[1.02]" : ""
      }`}
    >
      <button
        onClick={handleSearchSubmit}
        className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors hover:text-primary"
      >
        <svg
          className={`w-5 h-5 transition-colors duration-300 ${
            isFocused ? "text-primary" : "text-muted-foreground"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <input
        type="text"
        placeholder="검색어를 입력해주세요"
        className="w-full py-3.5 pl-12 pr-4 text-md bg-transparent border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
        style={{
          WebkitAppearance: "none",
          backgroundColor: "transparent !important",
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={false}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 flex items-center transition-colors right-4 text-muted-foreground hover:text-foreground "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
