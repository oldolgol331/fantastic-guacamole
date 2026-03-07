import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { loginSchema } from '../types';
import { Button, Input } from '../components';

/**
 * 로그인 페이지
 * TailwindCSS 유틸리티 클래스 사용
 */
export const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, isAuthenticated } = useAuth();

  // Zod 스키마를 사용한 useForm
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { email: '', password: '' },
    loginSchema
  );

  // 이미 로그인한 경우 홈으로 리다이렉트
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  /**
   * 로그인 제출 핸들러
   */
  const onSubmit = async () => {
    await handleLogin(values.email, values.password);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px]">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2rem] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-[2.75rem] font-bold text-[var(--color-text-primary)] text-center mb-2">
            로그인
          </h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] text-center mb-8">
            환영합니다!
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit);
            }}
            className="flex flex-col gap-5"
          >
            <Input
              label="이메일"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="email@example.com"
              autoComplete="email"
              disabled={isSubmitting}
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center text-[var(--color-text-secondary)] text-[15px]">
            <p>
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-[#667eea] font-semibold hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
