import { useState, useCallback } from 'react';

/**
 * 폼 입력 상태 관리 커스텀 훅
 * 
 * @param initialState - 초기 폼 값
 * @returns 폼 상태 및 핸들러
 */
export const useForm = <T extends Record<string, string>>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

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
  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);

  return {
    values,
    errors,
    handleChange,
    setError,
    clearErrors,
    reset,
    setValues,
    setErrors,
  };
};
