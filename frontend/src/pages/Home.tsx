import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components';
import './Home.css';

/**
 * 홈 페이지
 * - 메인 랜딩 페이지
 * - 인증 상태에 따른 다른 콘텐츠 표시
 */
export const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="home">
      {/* 히어로 섹션 */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Fantastic Guacamole</span>
            <br />
            에 오신 것을 환영합니다
          </h1>
          <p className="hero-subtitle">
            간단하고 아름다운 게시판 플랫폼
          </p>
          <div className="hero-actions">
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
        <div className="hero-emoji">🥑</div>
      </section>

      {/* 기능 섹션 */}
      <section className="features">
        <h2 className="section-title">주요 기능</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>게시글 작성</h3>
            <p>간단한 에디터로 글을 작성하고 공유하세요</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>댓글 시스템</h3>
            <p>게시글에 댓글을 달아 소통하세요</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>검색 기능</h3>
            <p>원하는 게시글을 빠르게 찾아보세요</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌙</div>
            <h3>다크 모드</h3>
            <p>눈에 편안한 다크 모드를 지원해요</p>
          </div>
        </div>
      </section>
    </div>
  );
};
