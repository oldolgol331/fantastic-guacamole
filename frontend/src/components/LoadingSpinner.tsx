export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

/**
 * 로딩 스피너 컴포넌트
 * TailwindCSS 유틸리티 클래스 사용
 */
export const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div
      className={`border-[3px] border-[var(--color-border)] border-t-[#667eea] rounded-full animate-[spin_0.8s_linear_infinite] ${sizeClasses[size]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg-primary)] z-[1000]">
        {spinner}
      </div>
    );
  }

  return spinner;
};
