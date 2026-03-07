import { describe, it, expect } from 'vitest';
import { useAuthStore } from './authStore';

/**
 * authStore Zustand 스토어 테스트
 * - 기본 상태 관리 검증
 */
describe('useAuthStore', () => {
  it('스토어가 정의되어 있어야 합니다', () => {
    expect(useAuthStore).toBeDefined();
  });

  it('초기에는 인증되지 않은 상태여야 합니다', () => {
    const state = useAuthStore.getState();
    
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('스토어에서 모든 상태와 액션을 가져올 수 있어야 합니다', () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeDefined();
    expect(state.isAuthenticated).toBeDefined();
    expect(state.isLoading).toBeDefined();
    expect(state.login).toBeDefined();
    expect(state.logout).toBeDefined();
    expect(state.checkAuth).toBeDefined();
    expect(state.updateUser).toBeDefined();
  });

  it('logout 액션을 호출할 수 있어야 합니다', () => {
    const state = useAuthStore.getState();
    
    expect(() => state.logout()).not.toThrow();
  });

  it('getState 를 통해 상태를 가져올 수 있어야 합니다', () => {
    const state = useAuthStore.getState();
    
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });
});
