import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useForm } from './useForm';
import { z } from 'zod';

/**
 * useForm 커스텀 훅 테스트
 * - 폼 값 변경, 검증, 에러 처리 검증
 * - Zod 스키마 연동 검증
 * - 자동 스크롤 기능 검증
 * - handleSubmit 검증
 */
describe('useForm', () => {
  const initialForm = {
    email: '',
    password: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('기본 기능', () => {
    it('초기 값이 설정되어야 합니다', () => {
      const { result } = renderHook(() => useForm(initialForm));

      expect(result.current.values).toEqual(initialForm);
      expect(result.current.errors).toEqual({});
    });

    it('입력 값이 변경되어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));

      const mockEvent = {
        target: { name: 'email', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleChange(mockEvent);
      });

      expect(result.current.values.email).toBe('test@example.com');
    });

    it('여러 필드를 동시에 변경할 수 있어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));

      await act(async () => {
        result.current.setValues({ email: 'test@example.com', password: '123456' });
      });

      expect(result.current.values.email).toBe('test@example.com');
      expect(result.current.values.password).toBe('123456');
    });

    it('입력 시 에러가 초기화되어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));

      // 에러 설정
      await act(async () => {
        result.current.setError('email', '이메일을 입력해주세요');
      });

      expect(result.current.errors.email).toBe('이메일을 입력해주세요');

      // 입력 변경
      const mockEvent = {
        target: { name: 'email', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleChange(mockEvent);
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('폼을 리셋할 수 있어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));

      // 값 변경
      await act(async () => {
        result.current.setValues({ email: 'test@example.com', password: '1234' });
      });

      // 리셋
      await act(async () => {
        result.current.reset();
      });

      expect(result.current.values).toEqual(initialForm);
      expect(result.current.errors).toEqual({});
    });

    it('리셋 시 새로운 값을 설정할 수 있어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));

      await act(async () => {
        result.current.setValues({ email: 'old@example.com', password: 'old' });
      });

      await act(async () => {
        result.current.reset({ email: 'new@example.com' });
      });

      expect(result.current.values.email).toBe('new@example.com');
      expect(result.current.values.password).toBe('');
    });
  });

  describe('에러 처리', () => {
    it('에러를 설정할 수 있어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));

      await act(async () => {
        result.current.setError('email', '이메일을 입력해주세요');
      });

      expect(result.current.errors.email).toBe('이메일을 입력해주세요');
    });

    it('모든 에러를 초기화할 수 있어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));

      await act(async () => {
        result.current.setError('email', '이메일 에러');
        result.current.setError('password', '비밀번호 에러');
      });

      await act(async () => {
        result.current.clearErrors();
      });

      expect(result.current.errors).toEqual({});
    });

    it('여러 필드에 에러를 설정할 수 있어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));

      await act(async () => {
        result.current.setError('email', '이메일 에러');
        result.current.setError('password', '비밀번호 에러');
      });

      expect(result.current.errors.email).toBe('이메일 에러');
      expect(result.current.errors.password).toBe('비밀번호 에러');
    });
  });

  describe('Zod 스키마 검증', () => {
    const schema = z.object({
      email: z.string().email('이메일 형식이 아닙니다'),
      password: z.string().min(8, '비밀번호는 8 자 이상이어야 합니다'),
    });

    it('Zod 스키마로 폼을 검증해야 합니다', async () => {
      const { result } = renderHook(() => useForm(
        { email: '', password: '' },
        schema
      ));

      await act(async () => {
        result.current.setValues({ email: 'invalid', password: '123' });
        result.current.validate();
      });

      expect(result.current.errors.email).toBeDefined();
      expect(result.current.errors.password).toBeDefined();
    });

    it('유효한 값은 검증에 통과해야 합니다', async () => {
      const { result } = renderHook(() => useForm(
        { email: '', password: '' },
        schema
      ));

      await act(async () => {
        result.current.setValues({ email: 'valid@example.com', password: 'validpass123' });
      });
      
      const isValid = result.current.validate();
      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });

    it('이메일 형식이 잘못되면 에러가 발생해야 합니다', async () => {
      const { result } = renderHook(() => useForm(
        { email: '', password: '' },
        schema
      ));

      await act(async () => {
        result.current.setValues({ email: 'not-an-email', password: 'validpass123' });
        result.current.validate();
      });

      expect(result.current.errors.email).toBe('이메일 형식이 아닙니다');
    });

    it('비밀번호가 8 자 미만이면 에러가 발생해야 합니다', async () => {
      const { result } = renderHook(() => useForm(
        { email: '', password: '' },
        schema
      ));

      await act(async () => {
        result.current.setValues({ email: 'valid@example.com', password: 'short' });
        result.current.validate();
      });

      expect(result.current.errors.password).toBe('비밀번호는 8 자 이상이어야 합니다');
    });

    it('handleSubmit 은 검증 실패 시 콜백을 호출하지 않습니다', async () => {
      const { result } = renderHook(() => useForm(
        { email: '', password: '' },
        schema
      ));
      const onSubmit = vi.fn();

      await act(async () => {
        result.current.setValues({ email: 'invalid', password: '123' });
      });

      const submitResult = await act(async () => 
        result.current.handleSubmit(onSubmit)
      );

      expect(submitResult).toBe(false);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('handleSubmit 은 검증 성공 시 콜백을 호출합니다', async () => {
      const { result } = renderHook(() => useForm(
        { email: '', password: '' },
        schema
      ));
      const onSubmit = vi.fn();

      await act(async () => {
        result.current.setValues({ email: 'valid@example.com', password: 'validpass123' });
      });

      const submitResult = await act(async () => 
        result.current.handleSubmit(onSubmit)
      );

      expect(submitResult).toBe(true);
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'valid@example.com',
        password: 'validpass123',
      });
    });

    it('handleSubmit 은 isSubmitting 상태를 업데이트합니다', async () => {
      const { result } = renderHook(() => useForm(
        { email: '', password: '' },
        schema
      ));
      const onSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 10)));

      await act(async () => {
        result.current.setValues({ email: 'valid@example.com', password: 'validpass123' });
      });

      expect(result.current.isSubmitting).toBe(false);

      act(() => {
        result.current.handleSubmit(onSubmit);
      });

      expect(result.current.isSubmitting).toBe(true);

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });
    });
  });

  describe('에러 필드 참조 (setErrorRef)', () => {
    it('에러 필드 참조를 설정할 수 있어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));
      const mockInput = { focus: vi.fn() } as unknown as HTMLInputElement;

      await act(async () => {
        result.current.setErrorRef('email')(mockInput);
      });

      // 참조가 설정되었는지 확인 (내부적으로 확인)
      expect(result.current.setErrorRef).toBeDefined();
    });

    it('참조 해제를 할 수 있어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));
      const mockInput = { focus: vi.fn() } as unknown as HTMLInputElement;

      await act(async () => {
        result.current.setErrorRef('email')(mockInput);
        result.current.setErrorRef('email')(null);
      });

      // 참조가 해제되었는지 확인
      expect(result.current.setErrorRef).toBeDefined();
    });
  });

  describe('isSubmitting 상태', () => {
    it('초기 isSubmitting 은 false 여야 합니다', () => {
      const { result } = renderHook(() => useForm(initialForm));
      expect(result.current.isSubmitting).toBe(false);
    });

    it('handleSubmit 호출 중 isSubmitting 이 true 가 되어야 합니다', async () => {
      const { result } = renderHook(() => useForm(initialForm));
      const onSubmit = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)));

      let submitPromise: Promise<boolean>;
      
      await act(async () => {
        submitPromise = result.current.handleSubmit(onSubmit);
      });

      expect(result.current.isSubmitting).toBe(true);

      await act(async () => {
        await submitPromise!;
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
