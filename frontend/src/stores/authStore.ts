import { create } from 'zustand';
import { userApi } from '../services';
import type { AuthUser, UserResponseDto } from '../types';

/**
 * 인증 상태 인터페이스
 */
interface AuthState {
  // 상태
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 액션
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (data: Partial<UserResponseDto>) => void;
}

/**
 * 인증 Zustand 스토어
 * 
 * - localStorage 에 accessToken 저장
 * - 앱 시작 시 자동 인증 확인
 * - 로그인/로그아웃 시 상태 관리
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * 로그인 처리
   */
  login: async (email: string, password: string) => {
    try {
      const response = await userApi.login({ email, password });
      
      // 토큰 저장
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      // 상태 업데이트
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * 로그아웃 처리
   */
  logout: () => {
    // 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // 상태 초기화
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  /**
   * 인증 상태 확인 (앱 시작 시)
   */
  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      // 서버에서 사용자 정보 다시 조회 (토큰 유효성 확인)
      const userData = await userApi.getMyInfo();
      
      set({
        user: {
          id: userData.id,
          email: userData.email,
          nickname: userData.nickname,
        },
        isAuthenticated: true,
        isLoading: false,
      });

      // localStorage 도 최신 정보로 업데이트
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        email: userData.email,
        nickname: userData.nickname,
      }));
    } catch (error) {
      // 토큰 만료 또는 유효하지 않음
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },

  /**
   * 사용자 정보 업데이트
   */
  updateUser: (data: Partial<UserResponseDto>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      set({ user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },
}));
