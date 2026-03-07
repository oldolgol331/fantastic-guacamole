import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

/**
 * Textarea 컴포넌트 테스트
 * - 렌더링, 라벨, 에러, 헬퍼 텍스트 검증
 * - 사용자 상호작용 검증
 * - 접근성 (ARIA) 검증
 * - disabled 상태 검증
 * - rows 속성 검증
 */
describe('Textarea', () => {
  it('Textarea 가 정상적으로 렌더링되어야 합니다', () => {
    render(<Textarea name="test" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('label 이 제공되면 렌더링되어야 합니다', () => {
    render(<Textarea name="content" label="내용" />);

    const label = screen.getByText('내용');
    expect(label).toBeInTheDocument();
  });

  it('label 은 textarea 와 연결되어야 합니다 (htmlFor)', () => {
    render(<Textarea name="content" label="게시글 내용" />);

    const label = screen.getByText('게시글 내용');
    const textarea = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'content');
    expect(textarea).toHaveAttribute('id', 'content');
  });

  it('error 가 제공되면 에러 메시지가 렌더링되어야 합니다', () => {
    render(<Textarea name="content" error="내용을 입력해주세요" />);

    const errorMessage = screen.getByText('내용을 입력해주세요');
    expect(errorMessage).toBeInTheDocument();
  });

  it('error 가 있으면 textarea 에 에러 스타일이 적용되어야 합니다', () => {
    render(<Textarea name="content" error="에러 발생" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-[#ef4444]');
  });

  it('helperText 가 제공되면 헬퍼 텍스트가 렌더링되어야 합니다', () => {
    render(<Textarea name="content" helperText="최대 1000 자까지 작성 가능합니다" />);

    const helperText = screen.getByText('최대 1000 자까지 작성 가능합니다');
    expect(helperText).toBeInTheDocument();
  });

  it('error 가 있으면 helperText 는 표시되지 않아야 합니다', () => {
    render(
      <Textarea
        name="content"
        error="내용 에러"
        helperText="최대 1000 자까지 작성 가능합니다"
      />
    );

    expect(screen.queryByText('최대 1000 자까지 작성 가능합니다')).not.toBeInTheDocument();
    expect(screen.getByText('내용 에러')).toBeInTheDocument();
  });

  it('placeholder 가 렌더링되어야 합니다', () => {
    render(<Textarea name="content" placeholder="내용을 입력하세요" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', '내용을 입력하세요');
  });

  it('disabled 상태가 적용되어야 합니다', async () => {
    const handleChange = vi.fn();
    render(<Textarea name="content" disabled onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();

    await userEvent.type(textarea, 'test');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('value 가 제공되면 입력 값이 설정되어야 합니다', () => {
    render(<Textarea name="content" value="테스트 내용입니다" readOnly />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('테스트 내용입니다');
  });

  it('onChange 이벤트가 발생해야 합니다', async () => {
    const handleChange = vi.fn();
    render(<Textarea name="content" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, '테스트');

    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('테스트');
  });

  it('className 이 적용되어야 합니다', () => {
    render(<Textarea name="content" className="custom-class" />);

    const container = screen.getByRole('textbox').closest('.flex');
    expect(container).toHaveClass('custom-class');
  });

  it('rows 속성이 적용되어야 합니다', () => {
    render(<Textarea name="content" rows={5} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('readOnly 속성이 적용되어야 합니다', () => {
    render(<Textarea name="content" value="읽기전용" readOnly />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readonly');
  });

  it('required 속성이 적용되어야 합니다', () => {
    render(<Textarea name="content" required />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('required');
  });

  it('name 속성이 적용되어야 합니다', () => {
    render(<Textarea name="articleContent" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('name', 'articleContent');
  });

  it('id 를 명시적으로 설정할 수 있어야 합니다', () => {
    render(<Textarea name="content" id="custom-id" label="내용" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'custom-id');

    const label = screen.getByText('내용');
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('자동 포커스 (autoFocus) 가 적용되어야 합니다', () => {
    render(<Textarea name="content" autoFocus />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveFocus();
  });

  it('최소 높이가 설정되어야 합니다', () => {
    render(<Textarea name="content" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('min-h-[120px]');
  });

  it('maxLength 속성이 적용되어야 합니다', () => {
    render(<Textarea name="content" maxLength={500} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxlength', '500');
  });
});
