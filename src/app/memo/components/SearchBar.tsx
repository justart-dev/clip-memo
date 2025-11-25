"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Item } from "../types";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // URL에서 검색 가능한 키워드 추출 함수
  const extractUrlKeywords = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const keywords: string[] = [];
    const urls = text.match(urlRegex);

    if (urls) {
      urls.forEach((url) => {
        try {
          const urlObj = new URL(url);

          // 도메인 추가 (예: example.com)
          const domain = urlObj.hostname.replace(/^www\./, '');
          keywords.push(domain);

          // 도메인의 각 부분 추가 (예: example, com)
          domain.split('.').forEach(part => {
            if (part.length >= 2) keywords.push(part);
          });

          // 경로의 각 부분 추가 (예: /some-page -> some, page)
          const pathParts = urlObj.pathname
            .split(/[\/\-_]/)
            .filter(part => part.length >= 2);
          keywords.push(...pathParts);

          // 검색 파라미터 추가
          urlObj.searchParams.forEach((value, key) => {
            if (key.length >= 2) keywords.push(key);
            if (value.length >= 2) keywords.push(value);
          });
        } catch {
          // URL 파싱 실패 시 무시
        }
      });
    }

    return keywords;
  };

  // 자동완성 항목 생성 함수
  const generateAutocompleteItems = (searchQuery: string): AutocompleteItem[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    const queryLower = searchQuery.toLowerCase();
    const suggestions: AutocompleteItem[] = [];
    const seenTexts = new Set<string>();

    items.forEach((item) => {
      // 제목에서 정확 매칭 우선
      const titleLower = item.title.toLowerCase();
      if (titleLower.includes(queryLower)) {
        const text = item.title;
        if (!seenTexts.has(text.toLowerCase())) {
          const startsWithMatch = titleLower.startsWith(queryLower);
          suggestions.push({
            text,
            type: "title",
            source: item,
            priority: startsWithMatch ? 100 : 90,
          });
          seenTexts.add(text.toLowerCase());
        }
      }

      // 내용에서 의미 있는 단어들 찾기
      const contentWords = item.content
        .toLowerCase()
        .split(/[\s\n\r\t.,!?;:()[\]{}"'`]+/)
        .filter((word) => word.length >= 2);

      // URL에서 키워드 추출 추가
      const urlKeywords = extractUrlKeywords(item.content);
      const allContentWords = [...contentWords, ...urlKeywords.map(k => k.toLowerCase())];

      allContentWords.forEach((word) => {
        if (word.includes(queryLower) && !seenTexts.has(word)) {
          const startsWithMatch = word.startsWith(queryLower);
          const exactMatch = word === queryLower;

          suggestions.push({
            text: word,
            type: "content",
            source: item,
            priority: exactMatch ? 30 : startsWithMatch ? 20 : 10,
          });
          seenTexts.add(word);
        }
      });
    });

    return suggestions
      .sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority;
        if (a.type === "title" && b.type !== "title") return -1;
        if (a.type !== "title" && b.type === "title") return 1;
        return a.text.length - b.text.length;
      })
      .slice(0, 5);
  };

  const handleSearchSubmit = (searchQuery: string) => {
    setShowAutocomplete(false);
    setSelectedIndex(-1);
    onSearch(searchQuery);
    inputRef.current?.blur();
  };

  const selectAutocompleteItem = (index: number) => {
    const selectedItem = autocompleteItems[index];
    if (selectedItem) {
      setQuery(selectedItem.text);
      handleSearchSubmit(selectedItem.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete || autocompleteItems.length === 0) {
      if (e.key === "Enter") {
        handleSearchSubmit(query);
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
          handleSearchSubmit(query);
        }
        break;
      case "Escape":
        setShowAutocomplete(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        const suggestions = generateAutocompleteItems(value);
        setAutocompleteItems(suggestions);
        if (suggestions.length > 0) {
          setShowAutocomplete(true);
        } else {
          setShowAutocomplete(false);
        }
        // 실시간 검색도 함께 수행
        onSearch(value);
      }, 300);
    } else {
      setShowAutocomplete(false);
      setAutocompleteItems([]);
      onSearch(value);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setShowAutocomplete(false);
    setSelectedIndex(-1);
    setAutocompleteItems([]);
    inputRef.current?.focus();
  };

  // 외부 클릭 시 자동완성 닫기
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);


  // 검색어 하이라이팅 함수
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 rounded px-0.5">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      className="relative w-full transition-all duration-300"
      style={{ isolation: "isolate", zIndex: 9999 }}
    >
      <div
        className={`relative flex items-center w-full h-12 rounded-2xl transition-all duration-300 ${
          isFocused
            ? "bg-white dark:bg-gray-800 shadow-lg ring-2 ring-gray-900/10 dark:ring-gray-100/10 scale-[1.02]"
            : "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-700/50"
        }`}
      >
        <div className="flex items-center justify-center w-12 h-full text-gray-400">
          <Search className={`w-5 h-5 transition-colors ${isFocused ? "text-gray-900 dark:text-gray-100" : ""}`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length >= 2 && autocompleteItems.length > 0) {
              setShowAutocomplete(true);
            }
          }}
          onBlur={() => {
            // 클릭 이벤트 처리를 위해 약간의 지연
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.memo.search_placeholder}
          className="w-full h-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-base"
          autoComplete="off"
        />

        {query && (
          <button
            onClick={handleClear}
            className="flex items-center justify-center w-10 h-10 mr-1 text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        

      </div>

      {/* 자동완성 드롭다운 */}
      {showAutocomplete && autocompleteItems.length > 0 && (
        <div
          ref={autocompleteRef}
          className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="sticky top-0 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t.common.search} {t.common.title}/{t.common.content}
            </span>
            <span className="text-[10px] text-gray-400 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
              {autocompleteItems.length} {t.memo.count_suffix}
            </span>
          </div>
          
          <div className="py-1">
            {autocompleteItems.map((item, index) => (
              <div
                key={`${item.text}-${index}`}
                className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                  index === selectedIndex ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => selectAutocompleteItem(index)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[12ch] sm:max-w-none">
                        {highlightText(item.text, query)}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${
                        item.type === 'title' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {item.type === 'title' ? t.common.title : t.common.content}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.source.category}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-[10px] text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                    {t.search.autocomplete.enter}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-3 py-2 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 text-[10px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1 min-w-[16px] text-center">↑</kbd>
              <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1 min-w-[16px] text-center">↓</kbd>
              <span>{t.search.autocomplete.keyboard_hint}</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1">Enter</kbd>
              <span>{t.search.autocomplete.enter}</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1">Esc</kbd>
              <span>{t.search.autocomplete.esc}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
