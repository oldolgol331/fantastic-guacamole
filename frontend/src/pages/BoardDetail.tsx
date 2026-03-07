import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardApi, replyApi } from '../services';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button, Textarea, LoadingSpinner, Modal } from '../components';
import type { ReplyDto } from '../types';

/**
 * 게시글 상세 페이지
 * TailwindCSS 유틸리티 클래스 사용
 */
export const BoardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const boardId = id ? parseInt(id, 10) : null;

  /**
   * 게시글 상세 조회
   */
  const {
    data: board,
    isLoading: isBoardLoading,
    error: _boardError,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => boardApi.getBoard(boardId!),
    enabled: boardId !== null && !isNaN(boardId),
  });

  /**
   * 댓글 목록 조회
   */
  const {
    data: repliesData,
    isLoading: isRepliesLoading,
    refetch: refetchReplies,
  } = useQuery({
    queryKey: ['replies', boardId],
    queryFn: () => replyApi.getReplies(boardId!),
    enabled: boardId !== null && !isNaN(boardId),
  });

  /**
   * 게시글 삭제 뮤테이션
   */
  const deleteMutation = useMutation({
    mutationFn: () => boardApi.deleteBoard(boardId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      showSuccess('게시글이 삭제되었습니다.');
      navigate('/boards');
    },
    onError: (_error: unknown) => {
      showError('게시글 삭제 중 오류가 발생했습니다.');
    },
  });

  /**
   * 댓글 작성 뮤테이션
   */
  const createReplyMutation = useMutation({
    mutationFn: (content: string) =>
      replyApi.createReply(boardId!, { content, boardId: boardId! }),
    onSuccess: () => {
      setNewReply('');
      refetchReplies();
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
      showSuccess('댓글이 작성되었습니다.');
    },
    onError: () => {
      showError('댓글 작성 중 오류가 발생했습니다.');
    },
  });

  /**
   * 댓글 수정 뮤테이션
   */
  const updateReplyMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      replyApi.updateReply(id, { content }),
    onSuccess: () => {
      setEditingReplyId(null);
      setEditingContent('');
      refetchReplies();
      showSuccess('댓글이 수정되었습니다.');
    },
    onError: () => {
      showError('댓글 수정 중 오류가 발생했습니다.');
    },
  });

  /**
   * 댓글 삭제 뮤테이션
   */
  const deleteReplyMutation = useMutation({
    mutationFn: (id: number) => replyApi.deleteReply(id),
    onSuccess: () => {
      refetchReplies();
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
      showSuccess('댓글이 삭제되었습니다.');
    },
    onError: () => {
      showError('댓글 삭제 중 오류가 발생했습니다.');
    },
  });

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isBoardLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <LoadingSpinner size="lg" fullScreen />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="text-center py-16 text-[var(--color-text-secondary)]">
        <p className="mb-4">게시글을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/boards')}>목록으로</Button>
      </div>
    );
  }

  const isAuthor = user?.id === board.author.id;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      {/* 게시글 내용 */}
      <article className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8 mb-8">
        <header className="mb-6">
          <h1 className="text-[2.75rem] font-bold text-[var(--color-text-primary)] m-0 mb-4 leading-tight">
            {board.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] flex-wrap">
            <span className="font-semibold text-[var(--color-text-primary)]">{board.author.nickname}</span>
            <span className="opacity-50">•</span>
            <span>{formatDate(board.createdAt)}</span>
            <span className="opacity-50">•</span>
            <span>조회 {board.views}</span>
          </div>
        </header>

        <div className="mb-6">
          <p className="text-base leading-[1.7] text-[var(--color-text-primary)] whitespace-pre-wrap break-words">
            {board.content}
          </p>
        </div>

        {/* 액션 버튼 */}
        {isAuthor && (
          <div className="flex gap-3 justify-end pt-6 border-t border-[var(--color-border)]">
            <Link to={`/boards/${board.id}/edit`}>
              <Button variant="secondary">수정</Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              삭제
            </Button>
          </div>
        )}

        <div className="mt-4">
          <Button variant="ghost" onClick={() => navigate('/boards')}>
            ← 목록으로
          </Button>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
          댓글 {repliesData?.replies.length || 0}개
        </h2>

        {/* 댓글 목록 */}
        {isRepliesLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : !repliesData || repliesData.replies.length === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)] py-8">아직 댓글이 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-4 mb-6">
            {repliesData.replies.map((reply: ReplyDto) => {
              const isReplyAuthor = user?.id === reply.author.id;
              const isEditing = editingReplyId === reply.id;

              return (
                <div key={reply.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-[var(--color-text-primary)] text-[15px]">
                      {reply.author.nickname}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="mt-3">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            updateReplyMutation.mutate({
                              id: reply.id,
                              content: editingContent,
                            })
                          }
                          loading={updateReplyMutation.isPending}
                        >
                          저장
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingReplyId(null);
                            setEditingContent('');
                          }}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[15px] leading-[1.6] text-[var(--color-text-primary)] whitespace-pre-wrap break-words m-0">
                      {reply.content}
                    </p>
                  )}

                  {isReplyAuthor && !isEditing && (
                    <div className="flex gap-3 mt-3">
                      <button
                        className="text-xs text-[var(--color-text-secondary)] bg-none border-none cursor-pointer p-0 transition-colors hover:text-[var(--color-text-primary)]"
                        onClick={() => {
                          setEditingReplyId(reply.id);
                          setEditingContent(reply.content);
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="text-xs text-[var(--color-text-secondary)] bg-none border-none cursor-pointer p-0 transition-colors hover:text-[var(--color-text-primary)]"
                        onClick={() => deleteReplyMutation.mutate(reply.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 댓글 작성 */}
        {isAuthenticated ? (
          <div className="mt-6">
            <Textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <Button
                variant="primary"
                onClick={() => createReplyMutation.mutate(newReply)}
                loading={createReplyMutation.isPending}
                disabled={!newReply.trim()}
              >
                댓글 작성
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-[var(--color-text-secondary)] py-8 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl">
            댓글을 작성하려면{' '}
            <Link to="/login" className="text-[#667eea] font-semibold">로그인</Link>이 필요합니다.
          </p>
        )}
      </section>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="게시글 삭제"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              취소
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate()}
              loading={deleteMutation.isPending}
            >
              삭제
            </Button>
          </>
        }
      >
        <p>정말로 이 게시글을 삭제하시겠습니까?</p>
        <p className="text-[#ef4444] text-sm mt-2">이 작업은 되돌릴 수 없습니다.</p>
      </Modal>
    </div>
  );
};
