import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

/**
 * 범용 버튼 컴포넌트
 * TailwindCSS 유틸리티 클래스 사용
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  // 베이스 스타일
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg border-none cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';

  // 사이즈 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // variant 스타일
  const variantStyles = {
    primary: 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white hover:from-[#5a6fd6] hover:to-[#6a4190] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(102,126,234,0.4)]',
    secondary: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-text-secondary)]',
    danger: 'bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white hover:from-[#dc2626] hover:to-[#b91c1c] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)]',
    ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]',
  };

  const fullWidthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
