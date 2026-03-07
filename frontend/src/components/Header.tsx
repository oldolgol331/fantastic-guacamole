import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

/**
 * 헤더 컴포넌트
 * - 로고 및 네비게이션
 * - 다크 모드 토글
 * - 인증 상태에 따른 메뉴 표시
 * TailwindCSS 유틸리티 클래스 사용
 */
export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode, isMobileMenuOpen, toggleMobileMenu } =
    useUIStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-[100] bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 text-decoration-none text-[var(--color-text-primary)] font-bold text-lg">
          <span className="text-2xl">🥑</span>
          <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Fantastic Guacamole
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/boards" className="px-4 py-2 text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all">
            게시판
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/mypage" className="px-4 py-2 text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all">
                내 정보
              </Link>
              <Link to="/boards/write" className="px-4 py-2 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all">
                글쓰기
              </Link>
              <div className="flex items-center gap-3 ml-2">
                <span className="text-[var(--color-text-primary)] font-medium">{user?.nickname}</span>
                <button onClick={handleLogout} className="px-3 py-1.5 text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-all">
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all">
                로그인
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:opacity-90 transition-all">
                회원가입
              </Link>
            </>
          )}
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2">
          {/* 다크 모드 토글 */}
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
            aria-label="다크 모드 토글"
          >
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            )}
          </button>

          {/* 모바일 메뉴 토글 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 bg-transparent border-none text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-all"
            aria-label="메뉴 토글"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 네비게이션 */}
      {isMobileMenuOpen && (
        <nav className="flex flex-col px-6 py-4 border-t border-[var(--color-border)] md:hidden">
          <Link to="/boards" className="px-4 py-2 text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all" onClick={toggleMobileMenu}>
            게시판
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/mypage" className="px-4 py-2 text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all" onClick={toggleMobileMenu}>
                내 정보
              </Link>
              <Link to="/boards/write" className="px-4 py-2 text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all" onClick={toggleMobileMenu}>
                글쓰기
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 text-left text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all w-full">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all" onClick={toggleMobileMenu}>
                로그인
              </Link>
              <Link to="/signup" className="px-4 py-2 text-[var(--color-text-secondary)] rounded-lg font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all" onClick={toggleMobileMenu}>
                회원가입
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};
