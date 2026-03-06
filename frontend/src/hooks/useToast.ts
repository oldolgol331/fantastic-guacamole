import { useCallback } from 'react';
import { useUIStore } from '../stores/uiStore';

/**
 * 토스트 알림 커스텀 훅
 * 
 * - 간편하게 토스트 메시지 표시
 * - 성공/에러/정보 타입 지원
 */
export const useToast = () => {
  const showToast = useUIStore((state) => state.showToast);
  const hideToast = useUIStore((state) => state.hideToast);

  /**
   * 성공 토스트 표시
   */
  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, 'success');
    },
    [showToast]
  );

  /**
   * 에러 토스트 표시
   */
  const showError = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  /**
   * 정보 토스트 표시
   */
  const showInfo = useCallback(
    (message: string) => {
      showToast(message, 'info');
    },
    [showToast]
  );

  return {
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
  };
};
