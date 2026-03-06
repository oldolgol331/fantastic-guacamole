import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import './Header.css';

/**
 * 헤더 컴포넌트
 * - 로고 및 네비게이션
 * - 다크 모드 토글
 * - 인증 상태에 따른 메뉴 표시
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
    <header className="header">
      <div className="header-container">
        {/* 로고 */}
        <Link to="/" className="header-logo">
          <span className="logo-icon">🥑</span>
          <span className="logo-text">Fantastic Guacamole</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="header-nav desktop-nav">
          <Link to="/boards" className="nav-link">
            게시판
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/mypage" className="nav-link">
                내 정보
              </Link>
              <Link to="/boards/write" className="nav-link btn-primary-small">
                글쓰기
              </Link>
              <div className="user-menu">
                <span className="user-nickname">{user?.nickname}</span>
                <button onClick={handleLogout} className="logout-btn">
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                로그인
              </Link>
              <Link to="/signup" className="nav-link btn-primary-small">
                회원가입
              </Link>
            </>
          )}
        </nav>

        {/* 우측 액션 */}
        <div className="header-actions">
          {/* 다크 모드 토글 */}
          <button
            onClick={toggleDarkMode}
            className="theme-toggle"
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
            className="mobile-menu-btn"
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
        <nav className="header-nav mobile-nav">
          <Link to="/boards" className="nav-link" onClick={toggleMobileMenu}>
            게시판
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/mypage"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                내 정보
              </Link>
              <Link
                to="/boards/write"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                글쓰기
              </Link>
              <button onClick={handleLogout} className="nav-link logout-link">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>
                로그인
              </Link>
              <Link
                to="/signup"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};
