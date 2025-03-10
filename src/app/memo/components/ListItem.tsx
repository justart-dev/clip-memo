"use client";

import { useState, useEffect, useRef } from "react";
import { Item } from "../types";

interface ListItemProps {
  item: Item;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ListItem = ({ item, onCopy, onEdit, onDelete }: ListItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 클립보드에 내용 복사
    navigator.clipboard
      .writeText(item.content)
      .then(() => {
        onCopy();
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err);
      });
  };

  // 메뉴 토글 함수
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditClick = () => {
    setShowMenu(false);
    onEdit();
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    onDelete();
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-all duration-300 animate-fade-in hover:translate-y-[-2px]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-card-foreground">
          {item.title}
        </h3>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              ></path>
            </svg>
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-border"
            >
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleEditClick}
                >
                  편집
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleDeleteClick}
                >
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 no-select">
        {item.content}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
          {item.category}
        </span>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs hover:bg-primary/90 transition-colors flex items-center gap-1 shadow-sm"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            ></path>
          </svg>
          복사
        </button>
      </div>
    </div>
  );
};

export default ListItem;
