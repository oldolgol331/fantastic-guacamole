import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth, useProtectedRoute } from './useAuth';

/**
 * useAuth 커스텀 훅 테스트
 * - 훅 기본 반환값 검증
 */
describe('useAuth', () => {
  it('useAuth 훅이 정의되어 있어야 합니다', () => {
    expect(useAuth).toBeDefined();
    expect(typeof useAuth).toBe('function');
  });

  it('useAuth 훅이 반환하는 값이 있어야 합니다', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toBeDefined();
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.handleLogin).toBeDefined();
    expect(result.current.handleLogout).toBeDefined();
    expect(result.current.requireAuth).toBeDefined();
  });

  it('초기에는 인증되지 않은 상태여야 합니다', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('handleLogin 함수가 정의되어 있어야 합니다', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.handleLogin).toBeDefined();
    expect(typeof result.current.handleLogin).toBe('function');
  });

  it('handleLogout 함수가 정의되어 있어야 합니다', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.handleLogout).toBeDefined();
    expect(typeof result.current.handleLogout).toBe('function');
  });

  it('requireAuth 함수가 정의되어 있어야 합니다', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.requireAuth).toBeDefined();
    expect(typeof result.current.requireAuth).toBe('function');
  });
});

describe('useProtectedRoute', () => {
  it('useProtectedRoute 훅이 정의되어 있어야 합니다', () => {
    expect(useProtectedRoute).toBeDefined();
    expect(typeof useProtectedRoute).toBe('function');
  });

  it('useProtectedRoute 훅이 반환하는 값이 있어야 합니다', () => {
    const { result } = renderHook(() => useProtectedRoute());

    expect(result.current).toBeDefined();
    expect(result.current.isAuthenticated).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
  });
});
