"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Item } from "../types";

interface AutocompleteItem {
  text: string;
  type: "title" | "content";
  source: Item;
  priority: number;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  items?: Item[];
}

const SearchBar = ({ onSearch, items = [] }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<
    AutocompleteItem[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // 자동완성 항목 생성 함수
  const generateAutocompleteItems = (
    searchQuery: string
  ): AutocompleteItem[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const suggestions: AutocompleteItem[] = [];
    const seenTexts = new Set<string>();

    items.forEach((item) => {
      // 제목에서 정확 매칭 우선
      const titleLower = item.title.toLowerCase();
      if (titleLower.includes(query)) {
        const text = item.title;
        if (!seenTexts.has(text.toLowerCase())) {
          // 제목 매칭에 가장 높은 우선순위 부여
          const startsWithMatch = titleLower.startsWith(query);
          suggestions.push({
            text,
            type: "title",
            source: item,
            priority: startsWithMatch ? 100 : 90, // 제목 매칭에 매우 높은 우선순위 부여
          });
          seenTexts.add(text.toLowerCase());
        }
      }

      // 내용에서 의미 있는 단어들 찾기 (개선된 알고리즘)
      const contentWords = item.content
        .toLowerCase()
        .split(/[\s\n\r\t.,!?;:()[\]{}"'`]+/)
        .filter((word) => word.length >= 2); // 최소 2글자 이상으로 변경

      contentWords.forEach((word) => {
        if (word.includes(query) && !seenTexts.has(word)) {
          const startsWithMatch = word.startsWith(query);
          const exactMatch = word === query;

          suggestions.push({
            text: word,
            type: "content",
            source: item,
            priority: exactMatch ? 30 : startsWithMatch ? 20 : 10, // 내용 매칭 우선순위 조정
          });
          seenTexts.add(word);
        }
      });
    });

    // 우선순위에 따라 정렬 (높은 우선순위가 먼저 오도록)
    return suggestions
      .sort((a, b) => {
        // 1. 우선순위가 높은 순으로 정렬
        if (a.priority !== b.priority) return b.priority - a.priority;

        // 2. 같은 우선순위면 제목 매칭을 우선
        if (a.type === "title" && b.type !== "title") return -1;
        if (a.type !== "title" && b.type === "title") return 1;

        // 3. 길이가 짧은 순으로 정렬 (더 정확한 매칭 우선)
        return a.text.length - b.text.length;
      })
      .slice(0, 5); // 최대 5개 제안
  };

  const handleSearchSubmit = () => {
    setShowAutocomplete(false);
    setSelectedIndex(-1);
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete || autocompleteItems.length === 0) {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < autocompleteItems.length - 1 ? prev + 1 : -1
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > -1 ? prev - 1 : autocompleteItems.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < autocompleteItems.length) {
          selectAutocompleteItem(selectedIndex);
        } else {
          handleSearchSubmit();
        }
        break;
      case "Escape":
        setShowAutocomplete(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const selectAutocompleteItem = (index: number) => {
    const selectedItem = autocompleteItems[index];
    if (selectedItem) {
      setQuery(selectedItem.text);
      setShowAutocomplete(false);
      setSelectedIndex(-1);
      onSearch(selectedItem.text);
    }
  };

  const handleClear = () => {
    setQuery("");
    setShowAutocomplete(false);
    setSelectedIndex(-1);
    onSearch("");
  };

  // 디바운스를 위한 타이머 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    // 이전 타이머 클리어
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length >= 2) {
      // 300ms 디바운스로 성능 최적화
      debounceTimerRef.current = setTimeout(() => {
        const suggestions = generateAutocompleteItems(value);
        setAutocompleteItems(suggestions);
        if (suggestions.length > 0) {
          updateDropdownPosition();
          setShowAutocomplete(true);
        }
      }, 300);
    } else {
      setShowAutocomplete(false);
      setAutocompleteItems([]);
    }
  };

  // 컴포넌트 언마운트 시 타이머 클리어
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 드롭다운 위치 계산 함수
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    updateDropdownPosition();
    if (query.trim().length >= 2 && autocompleteItems.length > 0) {
      setShowAutocomplete(true);
    }
  };

  const handleBlur = () => {
    // 자동완성 항목 클릭 시 blur가 발생하므로 약간의 지연을 줌
    setTimeout(() => {
      if (!autocompleteRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        setShowAutocomplete(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  // 검색어 하이라이트 함수
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark
              key={index}
              className="bg-yellow-200 text-gray-900 rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // 외부 클릭 시 자동완성 숨기기 및 스크롤/리사이즈 시 위치 업데이트
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        autocompleteRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
        setSelectedIndex(-1);
      }
    };

    const handleScroll = () => {
      if (showAutocomplete) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (showAutocomplete) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [showAutocomplete]);

  return (
    <div
      className="relative w-full transition-all duration-300"
      style={{ isolation: "isolate", zIndex: 9999 }}
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
        ref={inputRef}
        type="text"
        placeholder="검색어를 입력해주세요"
        className="w-full py-3.5 pl-12 pr-4 text-md bg-transparent border border-gray-250 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
        style={{
          WebkitAppearance: "none",
          backgroundColor: "transparent !important",
          overflow: "hidden",
          WebkitBorderRadius: "9999px",
          borderRadius: "9999px",
          border: "1px solid #e5e7eb",
        }}
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={false}
        autoComplete="off"
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

      {/* 자동완성 드롭다운 - Portal로 렌더링 */}
      {showAutocomplete && autocompleteItems.length > 0 && typeof window !== 'undefined' &&
        createPortal(
          <div
            ref={autocompleteRef}
            className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto"
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 999999,
              isolation: "isolate",
            }}
          >
          {autocompleteItems.map((item, index) => (
            <button
              key={`${item.text}-${index}`}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                selectedIndex === index ? "bg-gray-100" : ""
              }`}
              onClick={() => selectAutocompleteItem(index)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.type === "title" ? "bg-blue-400" : "bg-green-400"
                  }`}
                />
                <span className="text-sm text-gray-900">
                  {highlightText(item.text, query)}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    item.type === "title"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.type === "title" ? "제목" : "내용"}
                </span>
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {item.source.category}
                </span>
              </div>
            </button>
          ))}

            {/* 키보드 힌트 */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>↑↓ 선택</span>
                <span>Enter 검색</span>
                <span>Esc 닫기</span>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
};

export default SearchBar;
