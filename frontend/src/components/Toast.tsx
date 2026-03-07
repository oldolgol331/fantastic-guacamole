import { useUIStore } from '../stores/uiStore';

/**
 * 토스트 알림 컴포넌트
 * TailwindCSS 유틸리티 클래스 사용
 */
export const Toast = () => {
  const toast = useUIStore((state) => state.toast);
  const hideToast = useUIStore((state) => state.hideToast);

  if (!toast) return null;

  const typeStyles = {
    success: 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white',
    error: 'bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white',
    info: 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      className={`fixed bottom-8 right-8 flex items-center gap-3 px-5 py-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-[2000] animate-[slideInRight_0.3s_ease] cursor-pointer max-w-[400px] sm:left-4 sm:right-4 sm:bottom-4 sm:max-w-none ${typeStyles[toast.type]}`}
      onClick={hideToast}
    >
      <span className="text-xl font-bold">{icons[toast.type]}</span>
      <span className="font-medium text-[15px]">{toast.message}</span>
    </div>
  );
};
