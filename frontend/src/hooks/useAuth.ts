import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

/**
 * 인증 관련 커스텀 훅
 * 
 * - 로그인 상태 확인
 * - 보호된 라우트 접근 제어
 * - 로그인/로그아웃 핸들링
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, login, logout, checkAuth, updateUser } =
    useAuthStore();
  const showToast = useUIStore((state) => state.showToast);

  /**
   * 로그인 처리
   */
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login(email, password);
        showToast('로그인되었습니다.', 'success');
        navigate('/');
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToast(error.message, 'error');
        } else {
          showToast('로그인 중 오류가 발생했습니다.', 'error');
        }
        throw error;
      }
    },
    [login, navigate, showToast]
  );

  /**
   * 로그아웃 처리
   */
  const handleLogout = useCallback(() => {
    logout();
    showToast('로그아웃되었습니다.', 'info');
    navigate('/login');
  }, [logout, navigate, showToast]);

  /**
   * 인증_required 페이지 접근 제어
   */
  const requireAuth = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
      return false;
    }
    return !isLoading && isAuthenticated;
  }, [isLoading, isAuthenticated, navigate]);

  return {
    // 상태
    user,
    isAuthenticated,
    isLoading,

    // 액션
    handleLogin,
    handleLogout,
    checkAuth,
    requireAuth,
    updateUser,
  };
};

/**
 * 보호된 라우트를 위한 훅
 * 인증이 필요한 페이지에서 사용
 */
export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
};
