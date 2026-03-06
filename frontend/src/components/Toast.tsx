import { useUIStore } from '../stores/uiStore';
import './Toast.css';

/**
 * 토스트 알림 컴포넌트
 */
export const Toast = () => {
  const toast = useUIStore((state) => state.toast);
  const hideToast = useUIStore((state) => state.hideToast);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`} onClick={hideToast}>
      <span className="toast-icon">
        {toast.type === 'success' && '✓'}
        {toast.type === 'error' && '✕'}
        {toast.type === 'info' && 'ℹ'}
      </span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};
