import { useState, useEffect } from 'react';

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * 로컬 스토리지를 사용하는 커스텀 훅
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @returns [저장된 값, 값 설정 함수, 에러]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, string | null] {
  // 상태 초기화 - hydration mismatch 방지를 위해 초기값으로 시작
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const [error, setError] = useState<string | null>(null);

  // 마운트 후 로컬 스토리지에서 값 로드
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);  // 로컬 스토리지 동기화


  // 값 설정 함수 
  const setValue: SetValue<T> = (value) => {
    try {
      // 함수로 전달된 경우 처리
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 상태 업데이트
      setStoredValue(valueToStore);
      
      // 로컬 스토리지에 저장
      if (typeof window !== 'undefined') {
        const serializedValue = JSON.stringify(valueToStore);
        localStorage.setItem(key, serializedValue);
      }
      
      setError(null);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          setError('저장 공간이 부족합니다. 일부 데이터를 삭제해주세요.');
        } else {
          setError(`데이터 저장 중 오류가 발생했습니다: ${error.message}`);
        }
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return [storedValue, setValue, error];
}
