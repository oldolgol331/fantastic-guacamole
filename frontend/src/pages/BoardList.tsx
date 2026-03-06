import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { boardApi } from '../services';
import { Input, Button, LoadingSpinner } from '../components';
import type { BoardSummaryDto } from '../types';
import './BoardList.css';

/**
 * 게시글 목록 페이지
 */
export const BoardList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  /**
   * TanStack Query 를 사용한 게시글 목록 조회
   */
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['boards', page, searchTerm],
    queryFn: () => boardApi.getBoards(page, pageSize, searchTerm || undefined),
  });

  /**
   * 검색 제출 핸들러
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(search);
    setPage(1);
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  if (error) {
    return (
      <div className="board-list-error">
        <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className="board-list-page">
      <div className="board-list-header">
        <h1 className="board-list-title">게시판</h1>
        <Link to="/boards/write">
          <Button variant="primary">글쓰기</Button>
        </Link>
      </div>

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="board-search-form">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어를 입력하세요..."
          className="board-search-input"
        />
        <Button type="submit" variant="secondary">
          검색
        </Button>
      </form>

      {/* 게시글 목록 */}
      {isLoading ? (
        <div className="board-list-loading">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="board-list">
            {data?.boards.length === 0 ? (
              <div className="board-empty">
                <p>게시글이 없습니다.</p>
                <Link to="/boards/write">
                  <Button variant="primary">첫 번째 글쓰기</Button>
                </Link>
              </div>
            ) : (
              data?.boards.map((board: BoardSummaryDto) => (
                <Link
                  key={board.id}
                  to={`/boards/${board.id}`}
                  className="board-card"
                >
                  <div className="board-card-content">
                    <h3 className="board-title">{board.title}</h3>
                    <div className="board-meta">
                      <span className="board-author">{board.authorNickname}</span>
                      <span className="board-date">{formatDate(board.createdAt)}</span>
                    </div>
                  </div>
                  <div className="board-card-stats">
                    <span className="board-stat">
                      💬 {board.replyCount}
                    </span>
                    <span className="board-stat">
                      👁️ {board.views}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {data && data.pagination.totalPages > 1 && (
            <div className="board-pagination">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </Button>
              <span className="pagination-info">
                {page} / {data.pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
