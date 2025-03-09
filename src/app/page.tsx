"use client";

import { useState, useMemo, useEffect } from "react"; // useEffect 추가
import Swal from "sweetalert2";
import { Item } from "./types";
import SearchBar from "./components/SearchBar";
import TabBar from "./components/TabBar";
import ListItem from "./components/ListItem";

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

  const handleAddNew = () => {
    Swal.fire({
      title: "새로 추가하기",
      html: `
        <div class="space-y-4 py-4">
          <button id="add-memo" class="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span class="text-lg font-medium">메모 추가</span>
          </button>
          <button id="add-category" class="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30 cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="text-lg font-medium">카테고리 추가</span>
          </button>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCloseButton: true,
      background: "#ffffff",
      backdrop: "rgba(0,0,10,0.4)",
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
      didOpen: () => {
        const addMemoBtn = document.getElementById("add-memo");
        const addCategoryBtn = document.getElementById("add-category");

        addMemoBtn?.addEventListener("click", async () => {
          Swal.close();
          const { value: formValues } = await Swal.fire({
            title: "새 메모 작성",
            html: `
              <div class="space-y-4 p-2">
                <div class="relative group">
                  <input id="swal-title" class="w-full px-5 py-3.5 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
                    placeholder="제목을 입력하세요">
                </div>
                <div class="relative group">
                  <textarea id="swal-content" class="w-full px-5 py-3.5 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 min-h-[140px] resize-none" 
                    placeholder="내용을 입력하세요"></textarea>
                </div>
                <div class="relative group">
                  <select id="swal-category" class="w-full px-5 py-3.5 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
                    ${categories.map(
                      (category) =>
                        `<option value="${category}">${category}</option>`
                    )}
                  </select>
                </div>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: "추가하기",
            cancelButtonText: "취소",
            allowOutsideClick: true,
            allowEscapeKey: true,
            buttonsStyling: false,
            customClass: {
              popup:
                "rounded-3xl shadow-2xl transform transition-all duration-300",
              confirmButton:
                "bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl text-base font-medium text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 mx-2 cursor-pointer",
              cancelButton:
                "bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 rounded-xl text-base font-medium text-gray-600 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-200/20 mx-2 cursor-pointer",
              closeButton:
                "focus:outline-none hover:rotate-90 transition-transform duration-300 !text-gray-500 hover:!text-gray-700",
              title: "text-2xl font-bold text-gray-800 !pb-6",
              actions: "mt-4",
            },
            preConfirm: () => {
              const title = (
                document.getElementById("swal-title") as HTMLInputElement
              ).value;
              const content = (
                document.getElementById("swal-content") as HTMLTextAreaElement
              ).value;
              const category = (
                document.getElementById("swal-category") as HTMLSelectElement
              ).value;

              if (!title || !content) {
                Swal.showValidationMessage(`
                  <div class="flex items-center gap-2 text-red-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>제목과 내용을 모두 입력해주세요</span>
                  </div>
                `);
                return false;
              }
              return { title, content, category };
            },
          });

          if (formValues) {
            const newItem: Item = {
              id: String(items.length + 1),
              title: formValues.title,
              content: formValues.content,
              category: formValues.category,
            };
            setItems([...items, newItem]);

            Swal.fire({
              title: "메모가 추가되었습니다",
              icon: "success",
              position: "center",
              showConfirmButton: false,
              timer: 2000,
              toast: true,
              background: "#fff",
              iconColor: "#10b981",
            });
          }
        });

        addCategoryBtn?.addEventListener("click", () => {
          Swal.close();
          Swal.fire({
            title: "카테고리 추가",
            html: `
              <div class="space-y-4 p-2">
                <div class="relative group">
                  <input id="category-name" class="w-full px-5 py-3.5 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300" 
                    placeholder="새로운 카테고리 이름">
                </div>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: "추가",
            cancelButtonText: "취소",
            allowOutsideClick: true,
            allowEscapeKey: true,
            buttonsStyling: false,
            customClass: {
              popup: "rounded-3xl shadow-2xl",
              confirmButton:
                "bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 rounded-xl text-base font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20 mx-2 cursor-pointer",
              cancelButton:
                "bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 rounded-xl text-base font-medium text-gray-600 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-200/20 mx-2 cursor-pointer",
              closeButton:
                "focus:outline-none hover:rotate-90 transition-transform duration-300 !text-gray-500 hover:!text-gray-700",
              title: "text-2xl font-bold text-gray-800 !pb-6",
              actions: "mt-4",
            },
            preConfirm: () => {
              const categoryName = (
                document.getElementById("category-name") as HTMLInputElement
              ).value;
              if (!categoryName) {
                Swal.showValidationMessage("카테고리 이름을 입력해주세요");
                return false;
              }
              return categoryName;
            },
          }).then((result) => {
            if (result.isConfirmed) {
              setCategories([...categories, result.value]);
              Swal.fire({
                title: "카테고리가 추가되었습니다",
                icon: "success",
                position: "center",
                showConfirmButton: false,
                timer: 2000,
                toast: true,
                background: "#fff",
                iconColor: "#10b981",
              });
            }
          });
        });
      },
    });
  };

  const handleCopy = () => {
    Swal.fire({
      title: "클립보드에 복사되었습니다",
      icon: "success",
      position: "center",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      background: "#fff",
      iconColor: "#10b981",
    });
  };

  const handleEdit = async (item: Item) => {
    const { value: formValues } = await Swal.fire({
      title: "메모 수정",
      html: `
        <div class="space-y-4 p-2">
          <div class="relative group">
            <input id="swal-title" class="w-full px-5 py-3.5 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
              placeholder="제목" value="${item.title}">
          </div>
          <div class="relative group">
            <textarea id="swal-content" class="w-full px-5 py-3.5 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 min-h-[140px] resize-none" 
              placeholder="내용">${item.content}</textarea>
          </div>
          <div class="relative group">
            <select id="swal-category" class="w-full px-5 py-3.5 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
              ${categories.map(
                (category) =>
                  `<option value="${category}" ${
                    category === item.category ? "selected" : ""
                  }>${category}</option>`
              )}
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "수정하기",
      cancelButtonText: "취소",
      allowOutsideClick: true,
      background: "#ffffff",
      backdrop: "rgba(0,0,10,0.4)",
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
      preConfirm: () => {
        const title = (
          document.getElementById("swal-title") as HTMLInputElement
        ).value;
        const content = (
          document.getElementById("swal-content") as HTMLTextAreaElement
        ).value;
        const category = (
          document.getElementById("swal-category") as HTMLSelectElement
        ).value;
        if (!title || !content) {
          Swal.showValidationMessage(`
            <div class="flex items-center gap-2 text-red-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>제목과 내용을 모두 입력해주세요</span>
            </div>
          `);
          return false;
        }
        return { title, content, category };
      },
    });

    if (formValues) {
      const updatedItems = items.map((i) =>
        i.id === item.id
          ? {
              ...i,
              title: formValues.title,
              content: formValues.content,
              category: formValues.category,
            }
          : i
      );
      setItems(updatedItems);

      Swal.fire({
        icon: "success",
        title: "수정 완료",
        text: "메모가 수정되었습니다",
        position: "center",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        iconColor: "#3b82f6",
        background: "#ffffff",
      });
    }
  };

  const handleDelete = async (item: Item) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "메모 삭제",
      text: "정말로 이 메모를 삭제하시겠습니까?",
      position: "center",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      const updatedItems = items.filter((i) => i.id !== item.id);
      setItems(updatedItems);

      Swal.fire({
        title: "삭제 완료",
        icon: "success",
        position: "center",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#fff",
        iconColor: "#10b981",
      });
    }
  };

  const handleClearStorage = () => {
    Swal.fire({
      title: "데이터 초기화",
      text: "모든 메모와 카테고리가 초기화됩니다. 계속하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "초기화",
      cancelButtonText: "취소",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(STORAGE_KEYS.ITEMS);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);

        Swal.fire({
          title: "초기화 완료",
          text: "모든 데이터가 초기화되었습니다.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      }
    });
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
              현재는 베타버전 입니다. 다수가 사용하는 기기에서는 주의해주세요.
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
              스마트 메모
            </h1>
            <p className="text-sm text-muted-foreground mb-5">
              효율적인 정보 관리를 위한 공간
            </p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 transform transition-all duration-300 hover:translate-y-[-2px]">
                <SearchBar onSearch={setSearchQuery} />
              </div>
              <button
                onClick={handleAddNew}
                className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black/90 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
                aria-label="새 메모 추가"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
            </div>
          </div>

          <div className="bg-card pt-4 pb-2">
            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              categories={categories}
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
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <button
                    onClick={handleClearStorage}
                    className="group p-2 cursor-pointer transition-colors duration-200"
                    title="데이터 초기화"
                  >
                    <svg
                      className="w-16 h-16 text-muted-foreground/50 mb-4 group-hover:text-red-500 transition-colors duration-200"
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
                  </button>
                  <p className="text-muted-foreground">아직 메모가 없내요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
