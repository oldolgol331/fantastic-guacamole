import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import './Textarea.css';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * 범용 텍스트エリア 컴포넌트
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className={`textarea-group ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="textarea-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`textarea-field ${error ? 'textarea-error' : ''}`}
          {...props}
        />
        {error && <span className="textarea-error-message">{error}</span>}
        {helperText && !error && (
          <span className="textarea-helper-text">{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
