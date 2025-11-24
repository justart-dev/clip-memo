"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { useMemoManager } from "./hooks/useMemoManager";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY_BANNER_CLOSED = "clip-memo-banner-closed";

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const [showBanner, setShowBanner] = useState(true);
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
    handleDuplicate,
  } = useMemoManager();

  // 배너 상태 초기화
  useEffect(() => {
    try {
      const bannerClosed = localStorage.getItem(STORAGE_KEY_BANNER_CLOSED);
      setShowBanner(bannerClosed !== "true");
    } catch (error) {
      console.error("Error loading banner state:", error);
    } finally {
      setIsMounted(true);
    }
  }, []);

  // 토스트 메시지와 함께 작업을 수행하는 래퍼 함수들
  const handleAddNewWithToast = (newItem: Omit<Item, "id">) => {
    try {
      handleAddNew(newItem);
      toast.success(t.toast.memo_added);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t.toast.error);
      }
    }
  };

  const handleAddCategoryWithToast = (category: string) => {
    try {
      handleAddCategory(category);
      toast.success(t.toast.category_added);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t.toast.category_add_error);
      }
    }
  };

  const handleDeleteCategoryWithToast = (category: string) => {
    try {
      handleDeleteCategory(category);
      toast.success(t.toast.category_deleted);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t.toast.category_delete_error);
      }
    }
  };

  const handleEditWithToast = (editedItem: Item) => {
    try {
      handleEdit(editedItem);
      toast.success(t.toast.memo_edited);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t.toast.error);
      }
    }
  };

  const confirmDeleteWithToast = () => {
    try {
      confirmDelete();
      toast.success(t.toast.memo_deleted);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t.toast.error);
      }
    }
  };

  const handleEditCategoryWithToast = (
    oldCategory: string,
    newCategory: string
  ) => {
    try {
      handleEditCategory(oldCategory, newCategory);
      toast.success(t.toast.category_edited);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t.toast.category_edit_error);
      }
    }
  };

  const handleCopy = () => {
    // 즉시 토스트 표시 (중복 방지 제거)
    toast.success(t.toast.copied);
  };

  const handleDuplicateWithToast = (item: Item) => {
    try {
      handleDuplicate(item);
      toast.success(t.toast.memo_duplicated);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t.toast.error);
      }
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY_BANNER_CLOSED, "true");
  };

  const handleOpenBanner = () => {
    setShowBanner(true);
    localStorage.setItem(STORAGE_KEY_BANNER_CLOSED, "false");
  };

  const handleRefresh = async () => {
    try {
      // Service Worker 업데이트만 수행
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }

      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("Refresh failed:", error);
      window.location.reload();
    }
  };

  const handleBackupToClipboard = async () => {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        items: items,
        categories: categories,
      };

      await navigator.clipboard.writeText(JSON.stringify(backupData, null, 2));
      toast.success(t.backup.success);
    } catch (error) {
      console.error("Backup failed:", error);
      toast.error(t.backup.error);
    }
  };

  const handleRestoreFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const backupData = JSON.parse(clipboardText);

      // 백업 데이터 유효성 검증
      if (!backupData.items || !Array.isArray(backupData.items)) {
        throw new Error(t.backup.invalid_data);
      }

      // 복구 확인
      const confirmed = window.confirm(
        `${t.backup.restore_confirm_prefix}${backupData.items.length}${t.backup.restore_confirm_suffix}`
      );

      if (!confirmed) return;

      // localStorage에 복구
      localStorage.setItem("clip-memo-items", JSON.stringify(backupData.items));
      if (backupData.categories) {
        localStorage.setItem(
          "clip-memo-categories",
          JSON.stringify(backupData.categories)
        );
      }

      // 페이지 새로고침으로 데이터 반영
      window.location.reload();
    } catch (error) {
      console.error("Restore failed:", error);
      if (error instanceof SyntaxError) {
        toast.error(t.backup.no_data);
      } else {
        toast.error(t.backup.restore_error);
      }
    }
  };

  // 마운트되지 않은 경우 아무것도 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 flex flex-col relative">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* 상단 배너 및 헤더 영역 */}
      <header className="sticky top-0 z-50 w-full bg-[#F9FAFB] dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-800/50">
        {showBanner && (
          <div className="relative overflow-hidden bg-black text-white border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tracking-tight">Clip Memo v2.0</span>
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-white text-black rounded-full">NEW</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseBanner}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  aria-label="배너 닫기"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
            </div>
          </div>
        )}
        
        {/* 헤더 컨트롤 영역 (언어 선택 등) */}
        {!showBanner && (
          <div className="w-full bg-[#F9FAFB] dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-end">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                      <Globe className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage("ko")} className={language === "ko" ? "bg-gray-100 font-medium" : ""}>
                      한국어
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-gray-100 font-medium" : ""}>
                      English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={handleOpenBanner}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="배너 열기"
                  title="피드백 배너 열기"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <PullToRefresh onRefresh={handleRefresh}>
        <section
          className={`flex flex-col flex-1 ${
            showBanner ? "mt-[10vh]" : "mt-[7vh]"
          } transition-all duration-300`}
        >
          <div className="max-w-[1024px] w-full mx-auto px-5">
            <header className={`pt-10 pb-6 bg-transparent`}>
              <div className="flex items-center justify-between mb-2">
                <h1 className="inline-block text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-[family-name:var(--font-caveat)]">
                  {t.memo.title}
                </h1>
                <div className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  {isMounted ? `${items.length}${t.memo.count_suffix}` : t.common.loading}
                </div>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground max-w-md my-4">
                <span className="font-medium text-foreground hover:bg-gray-50 px-1 rounded transition-colors duration-200 cursor-default">
                  {t.landing.description_1}
                </span> {t.landing.description_2}
                <span className="font-medium text-foreground hover:bg-slate-50 px-1 rounded transition-colors duration-200 cursor-default">
                  {t.landing.description_3}
                </span>
                {t.landing.description_4}
              </p>
            </header>

            <nav className="flex items-center gap-4 mb-6">
              <div className="flex-1 transform transition-all duration-300 hover:translate-y-[-2px] relative z-50">
                <SearchBar onSearch={setSearchQuery} items={items} />
              </div>
              <AddMemoDialog
                categories={categories}
                onAdd={handleAddNewWithToast}
              >
                <button
                  className="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-gray-900 text-white rounded-full hover:scale-110 hover:shadow-xl hover:shadow-gray-900/20 active:scale-95"
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
                    className="w-6 h-6"
                  >
                    <path
                      d="M12 4V20M4 12H20"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </AddMemoDialog>
            </nav>

            <section
              aria-label="카테고리 관리"
              className="p-3 mb-4 transition-shadow duration-300 bg-white border border-gray-100 shadow-sm sm:p-6 sm:mb-6 rounded-xl hover:shadow-md relative"
              style={{ zIndex: 0 }}
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
                    {t.common.category}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 ml-auto">
                  <AddCategoryDialog
                    onAdd={handleAddCategoryWithToast}
                    categories={categories}
                  >
                    <button
                      className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 bg-transparent hover:bg-gray-100 text-gray-900 border border-gray-300 flex items-center justify-center gap-1.5"
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
                      <span>{t.common.add}</span>
                    </button>
                  </AddCategoryDialog>
                  <EditCategoryDialog
                    categories={categories}
                    onEdit={handleEditCategoryWithToast}
                  >
                    <button
                      className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 bg-transparent hover:bg-gray-100 text-gray-900 border border-gray-300 flex items-center justify-center gap-1.5"
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
                      <span>{t.common.edit}</span>
                    </button>
                  </EditCategoryDialog>
                  <DeleteCategoryDialog
                    categories={categories}
                    onDelete={handleDeleteCategoryWithToast}
                  >
                    <button
                      className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 bg-transparent hover:bg-gray-100 text-gray-900 border border-gray-300 flex items-center justify-center gap-1.5"
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
                      <span>{t.common.delete}</span>
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
                {!isMounted ? (
                  <div className="col-span-full">
                    <div className="flex flex-col items-center justify-center py-24">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <p className="mt-4 text-gray-500 animate-pulse">{t.common.loading}</p>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="col-span-full">
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="relative mb-8 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                      
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {t.memo.empty_state}
                      </h3>
                      {/* <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                        복사하고 싶은 텍스트를 저장하고<br />
                        필요할 때마다 클릭 한 번으로 사용하세요.
                      </p> */}
                      <AddMemoDialog
                        categories={categories}
                        onAdd={handleAddNewWithToast}
                      >
                        <button className="my-5 px-8 py-4 text-base font-medium text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 active:scale-95 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          {t.memo.add_button}
                        </button>
                      </AddMemoDialog>
                    </div>
                  </div>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="h-full"
                    >
                      <ListItem
                        item={item}
                        onCopy={handleCopy}
                        onEdit={() => {
                          setSelectedItem(item);
                          setEditDialogOpen(true);
                        }}
                        onDelete={() => handleDelete(item)}
                        onDuplicate={handleDuplicateWithToast}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="p-6 mb-6 rounded-full bg-gray-50">
                        <svg
                          className="w-16 h-16 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {t.search.no_results}
                      </p>
                      <p className="text-gray-500">
                        {t.search.try_different}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 백업/복구 기능 */}
              <div className="my-8 pt-6 border-t border-gray-100">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleBackupToClipboard}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    {t.backup.button}
                  </button>
                  <button
                    onClick={handleRestoreFromClipboard}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {t.backup.restore_button}
                  </button>
                </div>

                {/* Feedback email */}
                <div className="text-center mt-6">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Feedback{" "}
                    <span className="text-gray-300 dark:text-gray-600 mx-1">•</span>
                    <a 
                      href="mailto:hbd9425@gmail.com" 
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      hbd9425@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </PullToRefresh>

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
