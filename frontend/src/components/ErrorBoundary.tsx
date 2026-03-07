import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 바운더리 컴포넌트
 * - 자식 컴포넌트에서 발생한 에러를 캐치
 * - 전체 앱이 멈추는 것 방지
 * - 에러 UI 표시
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔥 [ErrorBoundary]', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoBack = () => {
    this.setState({ hasError: false, error: null });
    window.history.back();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">😵</div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                오류가 발생했습니다
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                예상치 못한 문제가 발생했습니다.
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-left">
                <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  에러 메시지:
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleGoBack}
                className="px-6 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg font-medium hover:bg-[var(--color-bg-tertiary)] transition-all"
              >
                뒤로가기
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
