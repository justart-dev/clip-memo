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
import { AddCategoryDialog } from "./components/AddCategoryDialog";
import { DeleteCategoryDialog } from "./components/DeleteCategoryDialog";
import { EditCategoryDialog } from "./components/EditCategoryDialog";
import Loading from "@/components/Loading";

const STORAGE_KEYS = {
  ITEMS: "clip-memo-items",
  CATEGORIES: "clip-memo-categories",
  BANNER_CLOSED: "clip-memo-banner-closed",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>(["전체", "기본"]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드를 useEffect로 이동
  useEffect(() => {
    const initializeData = () => {
      try {
        const savedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
        const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        const bannerClosed = localStorage.getItem(STORAGE_KEYS.BANNER_CLOSED);

        const initialItems = savedItems ? JSON.parse(savedItems) : [];
        let initialCategories = savedCategories
          ? JSON.parse(savedCategories)
          : ["전체", "기본"];

        // "기본"과 "전체" 카테고리가 없으면 추가
        if (!initialCategories.includes("기본")) {
          initialCategories = [
            "기본",
            ...initialCategories.filter((cat: string) => cat !== "전체"),
          ];
        }
        if (!initialCategories.includes("전체")) {
          initialCategories = ["전체", ...initialCategories];
        }

        // 카테고리가 없는 메모들을 "기본" 카테고리로 설정
        const updatedItems = initialItems.map((item: Item) => ({
          ...item,
          category: item.category || "기본",
        }));

        setItems(updatedItems);
        setCategories(initialCategories);
        setShowBanner(bannerClosed !== "true");
        setIsMounted(true);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // items가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
      } catch (error) {
        console.error("Error saving items:", error);
        setError("메모를 저장하는 중 오류가 발생했습니다.");
      }
    }
  }, [items, isMounted]);

  // categories가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (isMounted) {
      try {
        let updatedCategories = categories;
        if (!categories.includes("기본")) {
          updatedCategories = [
            "기본",
            ...categories.filter((cat) => cat !== "전체"),
          ];
        }
        if (!categories.includes("전체")) {
          updatedCategories = ["전체", ...updatedCategories];
        }
        localStorage.setItem(
          STORAGE_KEYS.CATEGORIES,
          JSON.stringify(updatedCategories)
        );
      } catch (error) {
        console.error("Error saving categories:", error);
        setError("카테고리를 저장하는 중 오류가 발생했습니다.");
      }
    }
  }, [categories, isMounted]);

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
      category: newItem.category || "기본",
    };
    setItems([...items, item]);
    toast.success("메모가 추가되었습니다");
  };

  const handleAddCategory = (category: string) => {
    setCategories([...categories, category]);
    toast.success("카테고리가 추가되었습니다");
  };

  const handleDeleteCategory = (category: string) => {
    // 카테고리에 속한 메모들의 카테고리를 '기본'으로 변경
    const updatedItems = items.map((item) =>
      item.category === category ? { ...item, category: "기본" } : item
    );

    // 카테고리 목록에서 삭제
    const updatedCategories = categories.filter((cat) => cat !== category);

    setItems(updatedItems);
    setCategories(updatedCategories);

    // 현재 삭제된 카테고리를 보고 있었다면 '기본' 탭으로 이동
    if (activeTab === category) {
      setActiveTab("기본");
    }

    toast.success("카테고리가 삭제되었습니다");
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

  const handleCloseBanner = () => {
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEYS.BANNER_CLOSED, "true");
  };

  const handleEditCategory = (oldCategory: string, newCategory: string) => {
    // 카테고리 이름 변경
    const updatedCategories = categories.map((cat) =>
      cat === oldCategory ? newCategory : cat
    );

    // 해당 카테고리를 사용하는 메모들의 카테고리도 변경
    const updatedItems = items.map((item) =>
      item.category === oldCategory ? { ...item, category: newCategory } : item
    );

    setItems(updatedItems);
    setCategories(updatedCategories);

    // 현재 수정된 카테고리를 보고 있었다면 새 카테고리로 이동
    if (activeTab === oldCategory) {
      setActiveTab(newCategory);
    }

    toast.success("카테고리가 수정되었습니다");
  };

  // 에러 발생 시 표시할 컴포넌트
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터 로딩 중일 때 로딩 상태 표시
  if (isLoading) {
    return <Loading />;
  }

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50">
        {showBanner && (
          <div className="flex items-center justify-between px-4 py-3 text-white bg-blue-500 shadow-lg animate-fade-in">
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
                지금은 베타버전이에요! 안전한 사용을 위해 개인 기기에서 이용해
                주세요.
              </p>
            </div>
            <button
              onClick={handleCloseBanner}
              className="text-white transition-colors cursor-pointer hover:text-blue-100"
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
      </header>

      <section className="flex flex-col flex-1">
        <div className="max-w-[1024px] w-full mx-auto px-5">
          <header className={`pt-18 pb-4 bg-gray-50`}>
            <h1 className="mb-1 text-2xl font-bold text-foreground">
              클립 메모
            </h1>
            <p className="mb-5 text-sm text-muted-foreground">
              필요한 내용을 빠르게 기록하고, 클립보드로 복사해 효율을 높이세요!
            </p>
          </header>

          <nav className="flex items-center gap-4 mb-6">
            <div className="flex-1 transform transition-all duration-300 hover:translate-y-[-2px]">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <AddMemoDialog categories={categories} onAdd={handleAddNew}>
              <button className="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-black rounded-full hover:bg-black/90 hover:scale-110">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
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
            </AddMemoDialog>
          </nav>

          <section
            aria-label="카테고리 관리"
            className="p-4 mb-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <p className="text-sm font-medium text-foreground">카테고리</p>
              <div className="flex gap-2 ml-auto">
                <AddCategoryDialog
                  onAdd={handleAddCategory}
                  categories={categories}
                >
                  <button
                    className="px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-300 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center gap-1"
                    title="카테고리 추가"
                  >
                    <svg
                      width="12"
                      height="12"
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
                    <span>추가</span>
                  </button>
                </AddCategoryDialog>
                <EditCategoryDialog
                  categories={categories}
                  onEdit={handleEditCategory}
                >
                  <button
                    className="px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-300 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center gap-1"
                    title="카테고리 수정"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>수정</span>
                  </button>
                </EditCategoryDialog>
                <DeleteCategoryDialog
                  categories={categories}
                  onDelete={handleDeleteCategory}
                >
                  <button
                    className="px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-300 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center gap-1 border border-border/40"
                    title="카테고리 삭제"
                  >
                    <svg
                      width="12"
                      height="12"
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
                    <span>삭제</span>
                  </button>
                </DeleteCategoryDialog>
              </div>
            </div>

            <div className="pt-1">
              <TabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                categories={categories}
              />
            </div>
          </section>

          <section aria-label="메모 목록" className="flex-1 overflow-auto">
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
                    className="w-16 h-16 mb-4 text-muted-foreground/50"
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
                  <p className="text-muted-foreground">
                    첫 번째 메모를 작성해보세요
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

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
    </main>
  );
}
