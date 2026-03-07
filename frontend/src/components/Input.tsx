import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * 범용 입력 필드 컴포넌트
 * TailwindCSS 유틸리티 클래스 사용
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={`flex flex-col gap-2 w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-primary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            px-4 py-3 text-base border border-[var(--color-border)] rounded-lg
            bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]
            transition-all duration-200
            placeholder:text-[var(--color-text-secondary)]
            focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/10
            hover:not-focus:border-[var(--color-text-secondary)]
            disabled:opacity-60 disabled:cursor-not-allowed
            ${error ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10' : ''}
          `}
          {...props}
        />
        {error && <span className="text-xs text-[#ef4444]">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
