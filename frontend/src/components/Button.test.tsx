import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

/**
 * Button 컴포넌트 테스트
 * - 렌더링, 클릭 이벤트, disabled 상태 검증
 * - variant, size, loading 상태 검증
 * - 접근성 (ARIA) 검증
 */
describe('Button', () => {
  it('Button 이 정상적으로 렌더링되어야 합니다', () => {
    render(<Button>클릭</Button>);
    
    const button = screen.getByRole('button', { name: /클릭/i });
    expect(button).toBeInTheDocument();
  });

  it('빈 children 이면 빈 버튼이 렌더링되어야 합니다', () => {
    // @ts-expect-error children can be empty
    render(<Button>{''}</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('variant 가 primary 면 primary 스타일이 적용되어야 합니다', () => {
    render(<Button variant="primary">Primary</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('from-[#667eea]');
  });

  it('variant 가 secondary 면 secondary 스타일이 적용되어야 합니다', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--color-bg-secondary)]');
  });

  it('size 가 lg 면 큰 크기로 렌더링되어야 합니다', () => {
    render(<Button size="lg">Large</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('fullWidth 가 true 면 전체 너비로 렌더링되어야 합니다', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('disabled 가 true 면 클릭할 수 없어야 합니다', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('loading 이 true 면 로딩 스피너가 표시되어야 합니다', () => {
    render(<Button loading>로딩중</Button>);
    
    const spinner = screen.getByRole('button').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('loading 이 true 면 disabled 되어야 합니다', () => {
    render(<Button loading>로딩중</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('클릭 시 onClick 이 호출되어야 합니다', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
