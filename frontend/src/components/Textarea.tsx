import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * 범용 텍스트エリア 컴포넌트
 * TailwindCSS 유틸리티 클래스 사용
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className={`flex flex-col gap-2 w-full ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[var(--color-text-primary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            px-4 py-3 text-base border border-[var(--color-border)] rounded-lg
            bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]
            transition-all duration-200 resize-y min-h-[120px]
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

Textarea.displayName = 'Textarea';
