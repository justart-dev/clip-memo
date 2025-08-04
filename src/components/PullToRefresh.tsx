"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  threshold?: number;
  resistance?: number;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 70,
  resistance = 0.5 
}: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  // 스크롤이 맨 위에 있는지 확인 + 모바일 환경인지 확인
  const checkScrollPosition = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                      ('ontouchstart' in window) || 
                      (navigator.maxTouchPoints > 0);
      setCanPull(scrollTop <= 0 && isMobile);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // 초기 확인

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canPull) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canPull || refreshing) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      e.preventDefault(); // 기본 스크롤 방지
      const distance = Math.min(diff * resistance, threshold * 1.5);
      setPullDistance(distance);
      setPulling(distance > threshold);
    }
  };

  const handleTouchEnd = async () => {
    if (!canPull || refreshing) return;

    if (pullDistance > threshold) {
      setRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setRefreshing(false);
      }
    }

    setPulling(false);
    setPullDistance(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canPull) return;
    
    startY.current = e.clientY;
    currentY.current = startY.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!canPull || refreshing) return;

      currentY.current = e.clientY;
      const diff = currentY.current - startY.current;

      if (diff > 0) {
        e.preventDefault();
        const distance = Math.min(diff * resistance, threshold * 1.5);
        setPullDistance(distance);
        setPulling(distance > threshold);
      }
    };

    const handleMouseUp = async () => {
      if (!canPull || refreshing) return;

      if (pullDistance > threshold) {
        setRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setRefreshing(false);
        }
      }

      setPulling(false);
      setPullDistance(0);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* Pull Indicator */}
      <div 
        className="absolute left-0 right-0 top-0 flex items-center justify-center transition-all duration-300 ease-out z-50"
        style={{
          transform: `translateY(${pullDistance - 50}px)`,
          opacity: pullDistance > 15 ? Math.min(pullDistance / 60, 1) : 0
        }}
      >
        <div className="flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-full shadow-sm border border-gray-100">
          <div className="w-4 h-4 flex items-center justify-center">
            {refreshing ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            ) : pulling ? (
              <div className="w-3 h-0.5 rounded-full bg-gray-900"></div>
            ) : (
              <div className="w-0.5 h-3 rounded-full bg-gray-900"></div>
            )}
          </div>
          {pullDistance > 40 && (
            <span className="text-xs font-medium text-gray-700 animate-fade-in">
              {refreshing ? '새로고침 중' : pulling ? '놓으면 새로고침' : '아래로 당기세요'}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="h-full overflow-auto"
        style={{
          transform: `translateY(${refreshing ? 50 : pullDistance * 0.8}px)`,
          transition: refreshing || (!pulling && pullDistance === 0) ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>
    </div>
  );
}