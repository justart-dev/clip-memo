"use client";

import { useState } from "react";
import { Item } from "../types";
import { ViewMemoDialog } from "./ViewMemoDialog";
import { Eye, Edit2, Trash2, Copy } from "lucide-react";
import { linkify } from "../utils/linkify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ListItemProps {
  item: Item;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: (item: Item) => void;
}

const ListItem = ({ item, onCopy, onEdit, onDelete, onDuplicate }: ListItemProps) => {
  const [showViewDialog, setShowViewDialog] = useState(false);

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



  return (
    <>
      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden">
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
              {item.title}
            </h3>
            <div className="relative ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 transition-colors rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-100 outline-none"
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
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    전체보기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    편집
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(item)}>
                    <Copy className="w-4 h-4 mr-2" />
                    복제하기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1 leading-relaxed">
            {linkify(item.content)}
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {item.category}
            </span>
            <button
              onClick={handleCopy}
              className="group/btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Copy className="w-3 h-3" />
              <span>복사</span>
            </button>
          </div>
        </div>
      </div>

      <ViewMemoDialog
        item={item}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />
    </>
  );
};

export default ListItem;
