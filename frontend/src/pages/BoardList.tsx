import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { boardApi } from '../services';
import { Input, Button, LoadingSpinner } from '../components';
import type { BoardSummaryDto } from '../types';

/**
 * 게시글 목록 페이지
 * TailwindCSS 유틸리티 클래스 사용
 */
export const BoardList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'views' | 'replies'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const pageSize = 10;

  /**
   * TanStack Query 를 사용한 게시글 목록 조회
   */
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['boards', page, searchTerm, sortBy, order],
    queryFn: () => boardApi.getBoards(page, pageSize, searchTerm || undefined, sortBy, order),
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
      <div className="text-center py-16 text-[var(--color-text-secondary)]">
        <p className="mb-4">게시글을 불러오는 중 오류가 발생했습니다.</p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[2.75rem] font-bold text-[var(--color-text-primary)] m-0">게시판</h1>
        <Link to="/boards/write">
          <Button variant="primary">글쓰기</Button>
        </Link>
      </div>

      {/* 고급 검색 필터 */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어를 입력하세요..."
          className="flex-1 min-w-[200px]"
        />
        <Button type="submit" variant="secondary">
          검색
        </Button>
        
        {/* 정렬 옵션 */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'views' | 'replies')}
          className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
        >
          <option value="createdAt">최신순</option>
          <option value="views">조회순</option>
          <option value="replies">댓글순</option>
        </select>
        
        <button
          type="button"
          onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
          className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-all"
        >
          {order === 'desc' ? '↓' : '↑'}
        </button>
      </form>

      {/* 게시글 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {data?.boards.length === 0 ? (
              <div className="text-center py-16 text-[var(--color-text-secondary)]">
                <p className="mb-6">게시글이 없습니다.</p>
                <Link to="/boards/write">
                  <Button variant="primary">첫 번째 글쓰기</Button>
                </Link>
              </div>
            ) : (
              data?.boards.map((board: BoardSummaryDto) => (
                <Link
                  key={board.id}
                  to={`/boards/${board.id}`}
                  className="flex justify-between items-center px-5 py-5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl no-underline transition-all duration-200 hover:border-[#667eea] hover:translate-x-1"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)] m-0 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {board.title}
                    </h3>
                    <div className="flex gap-4 text-sm text-[var(--color-text-secondary)]">
                      <span className="font-medium">{board.authorNickname}</span>
                      <span>{formatDate(board.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-shrink-0 ml-4">
                    <span className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                      💬 {board.replyCount}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                      👁️ {board.views}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </Button>
              <span className="text-[15px] text-[var(--color-text-primary)] font-medium min-w-[80px] text-center">
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
