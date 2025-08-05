import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '../types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEYS = {
  ITEMS: 'clip-memo-items',
  CATEGORIES: 'clip-memo-categories',
  BANNER_CLOSED: 'clip-memo-banner-closed',
};

const MAX_MEMO_LENGTH = 10000; // 메모 길이 제한
const MAX_STORAGE_SIZE = 5000000; // 약 5MB 제한

export interface MemoManagerResult {
  // 상태
  items: Item[];
  categories: string[];
  activeTab: string;
  searchQuery: string;
  filteredItems: Item[];
  selectedItem: Item | null;
    
  // 다이얼로그 상태
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  
  // 액션
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedItem: (item: Item | null) => void;
  
  // 메모 관리 함수
  handleAddNew: (newItem: Omit<Item, 'id'>) => void;
  handleEdit: (editedItem: Item) => void;
  handleDelete: (item: Item) => void;
  handleDuplicate: (item: Item) => void;
  confirmDelete: () => void;
  
  // 카테고리 관리 함수
  handleAddCategory: (category: string) => void;
  handleDeleteCategory: (category: string) => void;
  handleEditCategory: (oldCategory: string, newCategory: string) => void;
}

export function useMemoManager(): MemoManagerResult {
  // 로컬 스토리지에서 데이터 로드
  const [items, setItems] = useLocalStorage<Item[]>(STORAGE_KEYS.ITEMS, []);
  const [categories, setCategories] = useLocalStorage<string[]>(
    STORAGE_KEYS.CATEGORIES, 
    ['전체', '기본']
  );
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // 필터링된 메모 목록
  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (activeTab !== '전체' && item.category !== activeTab) return false;

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

  // 메모 추가 함수
  const handleAddNew = (newItem: Omit<Item, 'id'>) => {
    try {
      // 메모 길이 검증
      if (newItem.content.length > MAX_MEMO_LENGTH) {
        throw new Error(`메모는 ${MAX_MEMO_LENGTH}자를 초과할 수 없습니다`);
      }

      const item: Item = {
        id: uuidv4(),
        ...newItem,
        category: newItem.category || '기본',
      };

      // 스토리지 용량 체크
      const currentStorage = JSON.stringify([...items, item]).length;
      if (currentStorage > MAX_STORAGE_SIZE) {
        throw new Error('저장 공간이 부족합니다. 일부 메모를 삭제해주세요.');
      }

      setItems([...items, item]);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('메모 추가 중 오류가 발생했습니다');
    }
  };

  // 메모 수정 함수
  const handleEdit = (editedItem: Item) => {
    try {
      // 메모 길이 검증
      if (editedItem.content.length > MAX_MEMO_LENGTH) {
        throw new Error(`메모는 ${MAX_MEMO_LENGTH}자를 초과할 수 없습니다`);
      }
      
      const updatedItems = items.map((i) =>
        i.id === editedItem.id ? editedItem : i
      );
      
      setItems(updatedItems);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('메모 수정 중 오류가 발생했습니다');
    }
  };

  // 메모 삭제 함수
  const handleDelete = (item: Item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  // 메모 복제 함수
  const handleDuplicate = (item: Item) => {
    try {
      // 복제된 메모는 새로운 ID와 제목에 "(복제)" 추가
      const duplicatedItem: Item = {
        ...item,
        id: uuidv4(),
        title: `${item.title} (복제)`,
      };

      // 스토리지 용량 체크
      const currentStorage = JSON.stringify([...items, duplicatedItem]).length;
      if (currentStorage > MAX_STORAGE_SIZE) {
        throw new Error('저장 공간이 부족합니다. 일부 메모를 삭제해주세요.');
      }

      setItems([...items, duplicatedItem]);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('메모 복제 중 오류가 발생했습니다');
    }
  };

  // 메모 삭제 확인 함수
  const confirmDelete = () => {
    if (!selectedItem) return;

    try {
      const updatedItems = items.filter((i) => i.id !== selectedItem.id);
      setItems(updatedItems);
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch {
      throw new Error('메모 삭제 중 오류가 발생했습니다');
    }
  };

  // 카테고리 추가 함수
  const handleAddCategory = (category: string) => {
    try {
      // 중복 카테고리 검사
      if (categories.includes(category)) {
        throw new Error('이미 존재하는 카테고리입니다');
      }
      
      setCategories([...categories, category]);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('카테고리 추가 중 오류가 발생했습니다');
    }
  };

  // 카테고리 삭제 함수
  const handleDeleteCategory = (category: string) => {
    try {
      // 기본 카테고리 삭제 방지
      if (category === '전체' || category === '기본') {
        throw new Error('기본 카테고리는 삭제할 수 없습니다');
      }
      
      // 카테고리에 속한 메모들의 카테고리를 '기본'으로 변경
      const updatedItems = items.map((item) =>
        item.category === category ? { ...item, category: '기본' } : item
      );

      // 카테고리 목록에서 삭제
      const updatedCategories = categories.filter((cat) => cat !== category);

      setItems(updatedItems);
      setCategories(updatedCategories);

      // 현재 삭제된 카테고리를 보고 있었다면 '기본' 탭으로 이동
      if (activeTab === category) {
        setActiveTab('기본');
      }
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('카테고리 삭제 중 오류가 발생했습니다');
    }
  };

  // 카테고리 수정 함수
  const handleEditCategory = (oldCategory: string, newCategory: string) => {
    try {
      // 기본 카테고리 수정 방지
      if (oldCategory === '전체' || oldCategory === '기본') {
        throw new Error('기본 카테고리는 수정할 수 없습니다');
      }
      
      // 중복 카테고리 검사
      if (categories.includes(newCategory)) {
        throw new Error('이미 존재하는 카테고리입니다');
      }
      
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
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('카테고리 수정 중 오류가 발생했습니다');
    }
  };

  return {
    // 상태
    items,
    categories,
    activeTab,
    searchQuery,
    filteredItems,
    selectedItem,
    
    // 다이얼로그 상태
    editDialogOpen,
    deleteDialogOpen,
    
    // 액션
    setActiveTab,
    setSearchQuery,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setSelectedItem,
    
    // 메모 관리 함수
    handleAddNew,
    handleEdit,
    handleDelete,
    handleDuplicate,
    confirmDelete,
    
    // 카테고리 관리 함수
    handleAddCategory,
    handleDeleteCategory,
    handleEditCategory,
  };
}
