"use client";

import { useState, useMemo, useEffect } from "react"; // useEffect 추가
import { Item } from "./types";
import SearchBar from "./components/SearchBar";
import TabBar from "./components/TabBar";
import ListItem from "./components/ListItem";
import { toast } from "sonner";
import { AddMemoDialog } from "./components/AddMemoDialog";
import { EditMemoDialog } from "./components/EditMemoDialog";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";

const STORAGE_KEYS = {
  ITEMS: "clip-memo-items",
  CATEGORIES: "clip-memo-categories",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // 초기 데이터 로드를 useEffect로 이동
  useEffect(() => {
    const initializeData = () => {
      const savedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

      const initialItems = savedItems
        ? JSON.parse(savedItems)
        : [
            {
              id: "1",
              title: "꼭 읽어주세요.",
              content:
                "기록된 메모는 해당 기기에 저장이 되므로 다수가 사용하는 기기에서는 주의해주세요.",
              category: "중요사항",
            },
            {
              id: "2",
              title: "배달완료",
              content: "안녕하세요, 문 앞에 두고 갑니다. 맛있게드세요.",
              category: "사업",
            },
            {
              id: "3",
              title: "이사 갈 주소",
              content: "서울특별시 강남구 도곡동 467-1 타워펠리스 꼭대기",
              category: "주소",
            },
            {
              id: "4",
              title: "본가 집주소",
              content: "대구 수성구 범물동 하늘채",
              category: "주소",
            },
            {
              id: "5",
              title: "고양이 동물병원",
              content: "010-1234-5678",
              category: "연락처",
            },
          ];

      const initialCategories = savedCategories
        ? JSON.parse(savedCategories)
        : ["사업", "주소", "연락처", "중요사항"];

      setItems(initialItems);
      setCategories(initialCategories);
      setIsLoading(false);
    };

    initializeData();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // items가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);

  // categories가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (activeTab !== "전체" && item.category !== activeTab) return false;

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            item.title.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query)
          );
        }

        return true;
      }),
    [items, activeTab, searchQuery]
  );

  const handleAddNew = (newItem: Omit<Item, "id">) => {
    const item: Item = {
      id: String(items.length + 1),
      ...newItem,
    };
    setItems([...items, item]);
    toast.success("메모가 추가되었습니다");
  };

  const handleAddCategory = (category: string) => {
    setCategories([...categories, category]);
    toast.success("카테고리가 추가되었습니다");
  };

  const handleEdit = (editedItem: Item) => {
    const updatedItems = items.map((i) =>
      i.id === editedItem.id ? editedItem : i
    );
    setItems(updatedItems);
    toast.success("메모가 수정되었습니다");
  };

  const handleDelete = (item: Item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedItem) return;

    const updatedItems = items.filter((i) => i.id !== selectedItem.id);
    setItems(updatedItems);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success("메모가 삭제되었습니다");
  };

  const handleCopy = () => {
    toast.success("클립보드에 복사되었습니다.");
  };

  // 데이터 로딩 중일 때 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white py-3 px-4 flex justify-between items-center z-50 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 max-w-[1024px] mx-auto w-full">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium">
              현재는 베타버전 입니다. 개인 기기에서만 사용하세요.
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white hover:text-blue-100 transition-colors cursor-pointer"
            aria-label="배너 닫기"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="max-w-[1024px] w-full mx-auto px-5">
          <div className={`pt-18 pb-4`}>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              클립 메모
            </h1>
            <p className="text-sm text-muted-foreground mb-5">
              필요한 내용을 빠르게 기록하고, 클립보드로 복사해 효율을 높이세요!
            </p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 transform transition-all duration-300 hover:translate-y-[-2px]">
                <SearchBar onSearch={setSearchQuery} />
              </div>
              <AddMemoDialog categories={categories} onAdd={handleAddNew} />
            </div>
          </div>

          <div className="bg-card pt-4 pb-2">
            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              categories={categories}
              onAddCategory={handleAddCategory}
            />
          </div>

          <div className="flex-1 overflow-auto">
            <div className="space-y-4 py-4 pb-[calc(4rem+env(safe-area-inset-bottom))]">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    onCopy={handleCopy}
                    onEdit={() => {
                      setSelectedItem(item);
                      setEditDialogOpen(true);
                    }}
                    onDelete={() => handleDelete(item)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <svg
                    className="w-16 h-16 text-muted-foreground/50 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                  <p className="text-muted-foreground">아직 메모가 없내요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <EditMemoDialog
          item={selectedItem}
          categories={categories}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onEdit={handleEdit}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
