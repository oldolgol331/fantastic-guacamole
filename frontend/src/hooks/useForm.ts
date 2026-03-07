import { useState, useCallback, useEffect, useRef } from 'react';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

/**
 * Zod 검증을 통합한 폼 입력 상태 관리 커스텀 훅
 *
 * @param initialState - 초기 폼 값
 * @param schema - Zod 검증 스키마 (선택)
 * @param options - 옵션 (autoScroll: 에러 시 자동 스크롤)
 * @returns 폼 상태 및 핸들러
 *
 * @example
 * ```ts
 * // 기본 사용법
 * const { values, errors, handleChange } = useForm({ email: '', password: '' });
 *
 * // Zod 검증과 함께 사용
 * const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
 * const { values, errors, handleChange, validate } = useForm({ email: '', password: '' }, schema);
 *
 * // 자동 스크롤 옵션
 * const { values, errors, handleChange } = useForm({ email: '', password: '' }, schema, { autoScroll: true });
 * ```
 */
export const useForm = <T extends Record<string, unknown>>(
  initialState: T,
  schema?: ZodSchema<T>,
  options: { autoScroll?: boolean } = { autoScroll: false }
) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const errorRefs = useRef<Map<keyof T, HTMLInputElement | HTMLTextAreaElement | null>>(new Map());

  // 자동 스크롤 효과
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    if (options.autoScroll && Object.keys(errors).length > 0) {
      // 첫 번째 에러 필드로 스크롤
      const firstErrorField = Object.keys(errors)[0] as keyof T;
      const element = errorRefs.current.get(firstErrorField);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors, options.autoScroll, isFirstRender]);

  /**
   * 입력 값 변경 핸들러
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      // 에러 초기화
      if (errors[name as keyof T]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  /**
   * 에러 설정
   */
  const setError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  /**
   * 모든 에러 초기화
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * 폼 리셋
   */
  const reset = useCallback((newValues?: Partial<T>) => {
    setValues(newValues ? { ...initialState, ...newValues } : initialState);
    setErrors({});
    setIsSubmitting(false);
  }, [initialState]);

  /**
   * 에러 필드 참조 설정
   */
  const setErrorRef = useCallback((field: keyof T) => (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (el) {
      errorRefs.current.set(field, el);
    } else {
      errorRefs.current.delete(field);
    }
  }, []);

  /**
   * Zod 스키마로 폼 검증
   */
  const validate = useCallback((): boolean => {
    if (!schema) return true;

    try {
      schema.parse(values);
      clearErrors();
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof T;
          if (field && !newErrors[field]) {
            newErrors[field] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  }, [schema, values, clearErrors]);

  /**
   * 폼 제출 핸들러 (검증 포함)
   */
  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void>): Promise<boolean> => {
      if (!validate()) {
        return false;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        return true;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, values]
  );

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setError,
    clearErrors,
    reset,
    validate,
    handleSubmit,
    setValues,
    setErrors,
    setErrorRef,
  };
};
