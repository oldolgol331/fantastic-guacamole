import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardApi, replyApi } from '../services';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button, Textarea, LoadingSpinner, Modal } from '../components';
import type { ReplyDto } from '../types';
import './BoardDetail.css';

/**
 * 게시글 상세 페이지
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
      <div className="board-detail-loading">
        <LoadingSpinner size="lg" fullScreen />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="board-detail-error">
        <p>게시글을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/boards')}>목록으로</Button>
      </div>
    );
  }

  const isAuthor = user?.id === board.author.id;

  return (
    <div className="board-detail-page">
      {/* 게시글 내용 */}
      <article className="board-article">
        <header className="board-header">
          <h1 className="board-detail-title">{board.title}</h1>
          <div className="board-info">
            <span className="board-author-name">{board.author.nickname}</span>
            <span className="board-info-divider">•</span>
            <span className="board-date">{formatDate(board.createdAt)}</span>
            <span className="board-info-divider">•</span>
            <span className="board-views">조회 {board.views}</span>
          </div>
        </header>

        <div className="board-content">
          <p className="board-content-text">{board.content}</p>
        </div>

        {/* 액션 버튼 */}
        {isAuthor && (
          <div className="board-actions">
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

        <div className="board-list-button">
          <Button variant="ghost" onClick={() => navigate('/boards')}>
            ← 목록으로
          </Button>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <section className="replies-section">
        <h2 className="replies-title">
          댓글 {repliesData?.replies.length || 0}개
        </h2>

        {/* 댓글 목록 */}
        {isRepliesLoading ? (
          <div className="replies-loading">
            <LoadingSpinner />
          </div>
        ) : !repliesData || repliesData.replies.length === 0 ? (
          <p className="replies-empty">아직 댓글이 없습니다.</p>
        ) : (
          <div className="replies-list">
            {repliesData.replies.map((reply: ReplyDto) => {
              const isReplyAuthor = user?.id === reply.author.id;
              const isEditing = editingReplyId === reply.id;

              return (
                <div key={reply.id} className="reply-card">
                  <div className="reply-header">
                    <span className="reply-author">{reply.author.nickname}</span>
                    <span className="reply-date">{formatDate(reply.createdAt)}</span>
                  </div>

                  {isEditing ? (
                    <div className="reply-edit-form">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                      />
                      <div className="reply-edit-actions">
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
                    <p className="reply-content">{reply.content}</p>
                  )}

                  {isReplyAuthor && !isEditing && (
                    <div className="reply-actions">
                      <button
                        className="reply-action-btn"
                        onClick={() => {
                          setEditingReplyId(reply.id);
                          setEditingContent(reply.content);
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="reply-action-btn"
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
          <div className="reply-write">
            <Textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
            />
            <div className="reply-write-actions">
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
          <p className="reply-login-notice">
            댓글을 작성하려면{' '}
            <Link to="/login">로그인</Link>이 필요합니다.
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
        <p className="modal-warning">이 작업은 되돌릴 수 없습니다.</p>
      </Modal>
    </div>
  );
};
