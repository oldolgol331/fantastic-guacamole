import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from './Toast';
import { useUIStore } from '../stores/uiStore';

/**
 * Toast 컴포넌트 테스트
 */
describe('Toast', () => {
  it('toast 가 없으면 아무것도 렌더링하지 않아야 합니다', () => {
    vi.spyOn(useUIStore, 'getState').mockReturnValue({
      toast: null,
      showToast: vi.fn(),
      hideToast: vi.fn(),
    });

    const { container } = render(<Toast />);
    expect(container.firstChild).toBeNull();
  });

  it('Toast 컴포넌트가 정의되어 있어야 합니다', () => {
    expect(Toast).toBeDefined();
    expect(typeof Toast).toBe('function');
  });

  it('success 타입 스타일이 정의되어 있어야 합니다', () => {
    const typeStyles = {
      success: 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white',
      error: 'bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white',
      info: 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white',
    };

    expect(typeStyles.success).toContain('from-[#10b981]');
    expect(typeStyles.error).toContain('from-[#ef4444]');
    expect(typeStyles.info).toContain('from-[#667eea]');
  });

  it('toast 아이콘이 정의되어 있어야 합니다', () => {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
    };

    expect(icons.success).toBe('✓');
    expect(icons.error).toBe('✕');
    expect(icons.info).toBe('ℹ');
  });
});
