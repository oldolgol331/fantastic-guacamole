import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

/**
 * Input 컴포넌트 테스트
 * - 렌더링, 라벨, 에러, 헬퍼 텍스트 검증
 * - 사용자 상호작용 검증
 * - 접근성 (ARIA) 검증
 * - disabled 상태 검증
 */
describe('Input', () => {
  it('Input 이 정상적으로 렌더링되어야 합니다', () => {
    render(<Input name="test" />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('label 이 제공되면 렌더링되어야 합니다', () => {
    render(<Input name="test" label="테스트 라벨" />);

    const label = screen.getByText('테스트 라벨');
    expect(label).toBeInTheDocument();
  });

  it('label 은 input 과 연결되어야 합니다 (htmlFor)', () => {
    render(<Input name="email" label="이메일" />);

    const label = screen.getByText('이메일');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'email');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('error 가 제공되면 에러 메시지가 렌더링되어야 합니다', () => {
    render(<Input name="email" error="이메일을 입력해주세요" />);

    const errorMessage = screen.getByText('이메일을 입력해주세요');
    expect(errorMessage).toBeInTheDocument();
  });

  it('error 가 있으면 input 에 에러 스타일이 적용되어야 합니다', () => {
    render(<Input name="email" error="에러 발생" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-[#ef4444]');
  });

  it('helperText 가 제공되면 헬퍼 텍스트가 렌더링되어야 합니다', () => {
    render(<Input name="password" helperText="8 자 이상 입력해주세요" />);

    const helperText = screen.getByText('8 자 이상 입력해주세요');
    expect(helperText).toBeInTheDocument();
  });

  it('error 가 있으면 helperText 는 표시되지 않아야 합니다', () => {
    render(
      <Input
        name="password"
        error="비밀번호 에러"
        helperText="8 자 이상 입력해주세요"
      />
    );

    expect(screen.queryByText('8 자 이상 입력해주세요')).not.toBeInTheDocument();
    expect(screen.getByText('비밀번호 에러')).toBeInTheDocument();
  });

  it('placeholder 가 렌더링되어야 합니다', () => {
    render(<Input name="email" placeholder="이메일을 입력하세요" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', '이메일을 입력하세요');
  });

  it('disabled 상태가 적용되어야 합니다', async () => {
    const handleChange = vi.fn();
    render(<Input name="test" disabled onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();

    await userEvent.type(input, 'test');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('value 가 제공되면 입력 값이 설정되어야 합니다', () => {
    render(<Input name="email" value="test@example.com" readOnly />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test@example.com');
  });

  it('onChange 이벤트가 발생해야 합니다', async () => {
    const handleChange = vi.fn();
    render(<Input name="email" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test');
  });

  it('className 이 적용되어야 합니다', () => {
    render(<Input name="test" className="custom-class" />);

    // Input 의 wrapper div 에 클래스가 적용되는지 확인
    const container = screen.getByRole('textbox').closest('.flex');
    expect(container).toHaveClass('custom-class');
  });

  it('type 속성이 적용되어야 합니다', () => {
    const { container } = render(<Input name="password" type="password" />);
    
    const input = container.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('readOnly 속성이 적용되어야 합니다', () => {
    render(<Input name="test" value="읽기전용" readOnly />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('required 속성이 적용되어야 합니다', () => {
    render(<Input name="email" required />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
  });

  it('name 속성이 적용되어야 합니다', () => {
    render(<Input name="userEmail" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'userEmail');
  });

  it('id 를 명시적으로 설정할 수 있어야 합니다', () => {
    render(<Input name="email" id="custom-id" label="이메일" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');

    const label = screen.getByText('이메일');
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('자동 포커스 (autoFocus) 가 적용되어야 합니다', () => {
    render(<Input name="email" autoFocus />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });
});
