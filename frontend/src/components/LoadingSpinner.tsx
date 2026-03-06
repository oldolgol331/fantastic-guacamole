import './LoadingSpinner.css';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

/**
 * 로딩 스피너 컴포넌트
 */
export const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
}: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className={`spinner spinner-${size}`} />
      </div>
    );
  }

  return <div className={`spinner spinner-${size}`} />;
};
