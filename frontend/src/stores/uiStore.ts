import { create } from 'zustand';

/**
 * UI 상태 인터페이스
 */
interface UIState {
  // 상태
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  toast: {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;

  // 액션
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  toggleMobileMenu: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

/**
 * UI 상태 Zustand 스토어
 * 
 * - 다크 모드 상태 관리
 * - 모바일 메뉴 상태
 * - 토스트 알림 상태
 */
export const useUIStore = create<UIState>((set, get) => ({
  // 초기 상태
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  isMobileMenuOpen: false,
  toast: null,

  /**
   * 다크 모드 토글
   */
  toggleDarkMode: () => {
    const newDarkMode = !get().isDarkMode;
    set({ isDarkMode: newDarkMode });
    localStorage.setItem('darkMode', String(newDarkMode));
    document.documentElement.classList.toggle('dark', newDarkMode);
  },

  /**
   * 다크 모드 설정
   */
  setDarkMode: (isDark: boolean) => {
    set({ isDarkMode: isDark });
    localStorage.setItem('darkMode', String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  /**
   * 모바일 메뉴 토글
   */
  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  /**
   * 토스트 표시
   */
  showToast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    set({ toast: { id, message, type } });

    // 3 초 후 자동 숨김
    setTimeout(() => {
      const currentToast = get().toast;
      if (currentToast?.id === id) {
        set({ toast: null });
      }
    }, 3000);
  },

  /**
   * 토스트 숨김
   */
  hideToast: () => {
    set({ toast: null });
  },
}));

// 다크 모드 초기화 (클라이언트 사이드)
if (typeof window !== 'undefined') {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
}
