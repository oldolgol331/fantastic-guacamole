import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../services';
import { useToast } from '../hooks/useToast';
import { useForm } from '../hooks/useForm';
import { Button, Input } from '../components';

/**
 * 회원가입 페이지
 * TailwindCSS 유틸리티 클래스 사용
 */
export const Signup = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { values, handleChange, errors, setError, setErrors } = useForm({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 폼 유효성 검사
   */
  const validate = (): boolean => {
    let isValid = true;
    setErrors({});

    // 이메일 검증
    if (!values.email.trim()) {
      setError('email', '이메일을 입력해주세요');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      setError('email', '올바른 이메일 형식이 아닙니다');
      isValid = false;
    }

    // 닉네임 검증
    if (!values.nickname.trim()) {
      setError('nickname', '닉네임을 입력해주세요');
      isValid = false;
    } else if (values.nickname.length < 2 || values.nickname.length > 20) {
      setError('nickname', '닉네임은 2~20 자 사이여야 합니다');
      isValid = false;
    }

    // 비밀번호 검증
    if (!values.password) {
      setError('password', '비밀번호를 입력해주세요');
      isValid = false;
    } else if (values.password.length < 8) {
      setError('password', '비밀번호는 8 자 이상이어야 합니다');
      isValid = false;
    }

    // 비밀번호 확인 검증
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', '비밀번호가 일치하지 않습니다');
      isValid = false;
    }

    return isValid;
  };

  /**
   * 회원가입 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await userApi.signUp({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        nickname: values.nickname,
      });

      showSuccess('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/login');
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        showError(axiosError.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      } else {
        showError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px]">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2rem] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-[2.75rem] font-bold text-[var(--color-text-primary)] text-center mb-2">
            회원가입
          </h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] text-center mb-8">
            새로운 계정을 만들어보세요
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="이메일"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="email@example.com"
              autoComplete="email"
              disabled={isLoading}
            />

            <Input
              label="닉네임"
              type="text"
              name="nickname"
              value={values.nickname}
              onChange={handleChange}
              error={errors.nickname}
              placeholder="닉네임"
              autoComplete="nickname"
              disabled={isLoading}
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
            />

            <Input
              label="비밀번호 확인"
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center text-[var(--color-text-secondary)] text-[15px]">
            <p>
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-[#667eea] font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
