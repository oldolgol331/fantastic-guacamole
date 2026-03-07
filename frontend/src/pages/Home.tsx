import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components';

/**
 * 홈 페이지
 * - 메인 랜딩 페이지
 * - 인증 상태에 따른 다른 콘텐츠 표시
 * TailwindCSS 유틸리티 클래스 사용
 */
export const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      {/* 히어로 섹션 */}
      <section className="max-w-[1200px] mx-auto flex flex-col items-center text-center py-16 gap-8">
        <div className="max-w-[800px]">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[var(--color-text-primary)] mb-4 leading-tight">
            <span className="text-gradient">Fantastic Guacamole</span>
            <br />
            에 오신 것을 환영합니다
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] mb-8">
            간단하고 아름다운 게시판 플랫폼
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {!isAuthenticated ? (
              <>
                <Link to="/signup">
                  <Button size="lg" variant="primary">
                    무료로 시작하기
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost">
                    로그인
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/boards">
                <Button size="lg" variant="primary">
                  게시판 바로가기
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="text-[clamp(4rem,10vw,8rem)] animate-[float_3s_ease-in-out_infinite]">🥑</div>
      </section>

      {/* 기능 섹션 */}
      <section className="max-w-[1200px] mx-auto mt-16 pt-16 border-t border-[var(--color-border)]">
        <h2 className="text-2xl font-bold text-center text-[var(--color-text-primary)] mb-12">
          주요 기능
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:border-[#667eea]">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl text-[var(--color-text-primary)] mb-2">게시글 작성</h3>
            <p className="text-[var(--color-text-secondary)] text-[15px]">간단한 에디터로 글을 작성하고 공유하세요</p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:border-[#667eea]">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl text-[var(--color-text-primary)] mb-2">댓글 시스템</h3>
            <p className="text-[var(--color-text-secondary)] text-[15px]">게시글에 댓글을 달아 소통하세요</p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:border-[#667eea]">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl text-[var(--color-text-primary)] mb-2">검색 기능</h3>
            <p className="text-[var(--color-text-secondary)] text-[15px]">원하는 게시글을 빠르게 찾아보세요</p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:border-[#667eea]">
            <div className="text-3xl mb-4">🌙</div>
            <h3 className="text-xl text-[var(--color-text-primary)] mb-2">다크 모드</h3>
            <p className="text-[var(--color-text-secondary)] text-[15px]">눈에 편안한 다크 모드를 지원해요</p>
          </div>
        </div>
      </section>
    </div>
  );
};
