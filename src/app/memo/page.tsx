"use client";

import { useState, useEffect } from "react";
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
import { useMemoManager } from "./hooks/useMemoManager";

const STORAGE_KEY_BANNER_CLOSED = "clip-memo-banner-closed";

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // 메모 관리 훅 사용
  const {
    items,
    categories,
    activeTab,
    filteredItems,
    selectedItem,
    editDialogOpen,
    deleteDialogOpen,
    setActiveTab,
    setSearchQuery,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setSelectedItem,
    handleAddNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleAddCategory,
    handleDeleteCategory,
    handleEditCategory,
  } = useMemoManager();

  // 배너 상태 초기화 및 로딩 상태 관리
  useEffect(() => {
    try {
      const bannerClosed = localStorage.getItem(STORAGE_KEY_BANNER_CLOSED);
      setShowBanner(bannerClosed !== "true");
      setIsMounted(true);
    } catch (error) {
      console.error("Error loading banner state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 토스트 메시지와 함께 작업을 수행하는 래퍼 함수들
  const handleAddNewWithToast = (newItem: Omit<Item, "id">) => {
    try {
      handleAddNew(newItem);
      toast.success("메모가 추가되었습니다");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("메모 추가 중 오류가 발생했습니다");
      }
    }
  };

  const handleAddCategoryWithToast = (category: string) => {
    try {
      handleAddCategory(category);
      toast.success("카테고리가 추가되었습니다");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("카테고리 추가 중 오류가 발생했습니다");
      }
    }
  };

  const handleDeleteCategoryWithToast = (category: string) => {
    try {
      handleDeleteCategory(category);
      toast.success("카테고리가 삭제되었습니다");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("카테고리 삭제 중 오류가 발생했습니다");
      }
    }
  };

  const handleEditWithToast = (editedItem: Item) => {
    try {
      handleEdit(editedItem);
      toast.success("메모가 수정되었습니다");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("메모 수정 중 오류가 발생했습니다");
      }
    }
  };

  const confirmDeleteWithToast = () => {
    try {
      confirmDelete();
      toast.success("메모가 삭제되었습니다");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("메모 삭제 중 오류가 발생했습니다");
      }
    }
  };

  const handleEditCategoryWithToast = (
    oldCategory: string,
    newCategory: string
  ) => {
    try {
      handleEditCategory(oldCategory, newCategory);
      toast.success("카테고리가 수정되었습니다");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("카테고리 수정 중 오류가 발생했습니다");
      }
    }
  };

  const handleCopy = () => {
    toast.success("클립보드에 복사되었습니다.");
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY_BANNER_CLOSED, "true");
  };

  const handleOpenBanner = () => {
    setShowBanner(true);
    localStorage.setItem(STORAGE_KEY_BANNER_CLOSED, "false");
  };

  // 데이터 로딩 중일 때 로딩 상태 표시
  if (isLoading) {
    return <Loading />;
  }

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br ">
      <header
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/80 transition-all duration-300 ${
          !showBanner ? "py-2" : "shadow-sm"
        }`}
      >
        {showBanner ? (
          <div className="flex items-center justify-between px-4 py-3 text-white bg-black animate-fade-in">
            <div className="flex-1 text-center max-w-[1024px] mx-auto px-2">
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium tracking-wide flex-nowrap">
                <a
                  href="https://tally.so/r/wkzL91"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 font-medium text-black bg-white rounded-full transition-all hover:bg-gray-100 border border-white/50 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-message-circle sm:w-3.5 sm:h-3.5"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span className="font-semibold text-xs sm:text-sm">
                    피드백 하러가기
                  </span>
                </a>
                <span className="text-white text-xs sm:text-sm min-w-0 truncate">
                  5초면 충분해요!
                </span>
              </div>
            </div>
            <button
              onClick={handleCloseBanner}
              className="px-3 py-1 ml-3 text-xs font-medium text-white transition-all border rounded-full cursor-pointer border-white/30 hover:bg-white/10 hover:border-white focus:outline-none focus:ring-1 focus:ring-white/30"
              aria-label="배너 숨기기"
            >
              숨기기
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end px-4 max-w-[1024px] mx-auto w-full">
            <button
              onClick={handleOpenBanner}
              className="flex items-center px-4 py-1.5 text-xs font-medium text-white transition-all bg-black rounded-full shadow-md hover:shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transform hover:scale-105 gap-1.5 border border-white/10 animate-pulse hover:animate-none"
              style={{
                WebkitAppearance: "none",
                overflow: "hidden",
                WebkitBorderRadius: "9999px",
                borderRadius: "9999px",
              }}
              aria-label="배너 열기"
              title="피드백 배너 열기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-message-circle"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>피드백하기</span>
            </button>
          </div>
        )}
      </header>

      <section
        className={`flex flex-col flex-1 ${
          showBanner ? "mt-[10vh]" : "mt-[7vh]"
        } transition-all duration-300`}
      >
        <div className="max-w-[1024px] w-full mx-auto px-5">
          <header className={`pt-10 pb-6 bg-transparent`}>
            <h1 className="mb-2 text-3xl font-bold text-transparent text-foreground bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              클립 메모
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              필요한 내용을 클릭 한 번에 복사하고, 생산성을 높여보세요!
            </p>
          </header>

          <nav className="flex items-center gap-4 mb-6">
            <div className="flex-1 transform transition-all duration-300 hover:translate-y-[-2px]">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <AddMemoDialog
              categories={categories}
              onAdd={handleAddNewWithToast}
            >
              <button
                className="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-black rounded-full hover:scale-105 hover:shadow-lg"
                style={{
                  WebkitAppearance: "none",
                  overflow: "hidden",
                  WebkitBorderRadius: "9999px",
                  borderRadius: "9999px",
                }}
              >
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
            className="p-3 mb-4 transition-shadow duration-300 bg-white border border-gray-100 shadow-sm sm:p-6 sm:mb-6 rounded-xl hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:gap-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-900 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <p className="text-sm font-semibold text-gray-900 sm:text-base">
                  카테고리
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-auto">
                <AddCategoryDialog
                  onAdd={handleAddCategoryWithToast}
                  categories={categories}
                >
                  <button
                    className="px-2 sm:px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-300 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center gap-1"
                    style={{
                      WebkitAppearance: "none",
                      overflow: "hidden",
                      WebkitBorderRadius: "9999px",
                      borderRadius: "9999px",
                    }}
                    title="카테고리 추가"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current sm:w-3 sm:h-3"
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
                  onEdit={handleEditCategoryWithToast}
                >
                  <button
                    className="px-2 sm:px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-300 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center gap-1"
                    style={{
                      WebkitAppearance: "none",
                      overflow: "hidden",
                      WebkitBorderRadius: "9999px",
                      borderRadius: "9999px",
                    }}
                    title="카테고리 수정"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current sm:w-3 sm:h-3"
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
                  onDelete={handleDeleteCategoryWithToast}
                >
                  <button
                    className="px-2 sm:px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-300 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center gap-1 border border-border/40"
                    style={{
                      WebkitAppearance: "none",
                      overflow: "hidden",
                      WebkitBorderRadius: "9999px",
                      borderRadius: "9999px",
                    }}
                    title="카테고리 삭제"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current sm:w-3 sm:h-3"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 py-4 pb-[calc(4rem+env(safe-area-inset-bottom))]">
              {items.length === 0 ? (
                <div className="col-span-full">
                  <div className="flex flex-col items-center justify-center py-16 text-center transition-colors duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:border-gray-200">
                    <div className="p-6 mb-6 rounded-full bg-gray-50">
                      <svg
                        className="w-20 h-20 text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      첫 번째 메모를 작성해보세요
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      상단의 + 버튼을 클릭하여 새로운 메모를 추가할 수 있습니다
                    </p>
                    <AddMemoDialog
                      categories={categories}
                      onAdd={handleAddNewWithToast}
                    >
                      <button className="px-4 py-2 mt-6 text-white transition-colors duration-300 bg-black rounded-lg cursor-pointer hover:bg-gray-900">
                        새 메모 작성하기
                      </button>
                    </AddMemoDialog>
                  </div>
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                  >
                    <ListItem
                      item={item}
                      onCopy={handleCopy}
                      onEdit={() => {
                        setSelectedItem(item);
                        setEditDialogOpen(true);
                      }}
                      onDelete={() => handleDelete(item)}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="flex flex-col items-center justify-center py-16 text-center transition-colors duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:border-gray-200">
                    <div className="p-6 mb-6 rounded-full bg-gray-50">
                      <svg
                        className="w-20 h-20 text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      앗! 찾으시는 메모가 없네요
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      다른 키워드로 한 번 더 찾아볼까요? 🔍
                    </p>
                  </div>
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
          onEdit={handleEditWithToast}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteWithToast}
      />
    </main>
  );
}
