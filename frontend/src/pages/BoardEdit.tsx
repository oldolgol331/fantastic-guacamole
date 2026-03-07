import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { boardApi } from '../services';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useForm } from '../hooks/useForm';
import { Button, Input, Textarea, LoadingSpinner } from '../components';

/**
 * 게시글 수정 페이지
 * TailwindCSS 유틸리티 클래스 사용
 */
export const BoardEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requireAuth, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const boardId = id ? parseInt(id, 10) : null;

  const { values, handleChange, errors, setError, setErrors, setValues, isSubmitting, setErrorRef } =
    useForm({
      title: '',
      content: '',
    }, undefined, { autoScroll: true });

  // 인증 확인
  if (!requireAuth()) {
    return null;
  }

  /**
   * 게시글 조회
   */
  const {
    data: board,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => boardApi.getBoard(boardId!),
    enabled: boardId !== null && !isNaN(boardId),
  });

  /**
   * 게시글 수정 뮤테이션
   */
  const updateMutation = useMutation({
    mutationFn: (data: { title?: string; content?: string }) =>
      boardApi.updateBoard(boardId!, data),
    onSuccess: () => {
      showSuccess('게시글이 수정되었습니다.');
      navigate(`/boards/${boardId}`);
    },
    onError: () => {
      showError('게시글 수정 중 오류가 발생했습니다.');
    },
  });

  // 게시글 데이터로 폼 초기화
  useEffect(() => {
    if (board) {
      // 작성자가 아닌 경우 리다이렉트
      if (user?.id !== board.author.id) {
        showError('수정 권한이 없습니다.');
        navigate(`/boards/${boardId}`);
        return;
      }

      setValues({
        title: board.title,
        content: board.content,
      });
    }
  }, [board, user, boardId, showError, navigate, setValues]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <LoadingSpinner size="lg" fullScreen />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="text-center py-16 text-[var(--color-text-secondary)]">
        <p className="mb-4">게시글을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate(`/boards/${boardId}`)}>
          돌아가기
        </Button>
      </div>
    );
  }

  /**
   * 폼 유효성 검사
   */
  const validate = (): boolean => {
    let isValid = true;
    setErrors({});

    if (!values.title.trim()) {
      setError('title', '제목을 입력해주세요');
      isValid = false;
    } else if (values.title.length > 100) {
      setError('title', '제목은 100 자 이하로 입력해주세요');
      isValid = false;
    }

    if (!values.content.trim()) {
      setError('content', '내용을 입력해주세요');
      isValid = false;
    }

    return isValid;
  };

  /**
   * 제출 핸들러
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    updateMutation.mutate({
      title: values.title,
      content: values.content,
    });
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] m-0 mb-6">
          게시글 수정
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="제목"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="제목을 입력하세요"
            disabled={isSubmitting || updateMutation.isPending}
            maxLength={100}
            ref={setErrorRef('title')}
          />

          <Textarea
            label="내용"
            name="content"
            value={values.content}
            onChange={handleChange}
            error={errors.content}
            placeholder="내용을 입력하세요"
            disabled={isSubmitting || updateMutation.isPending}
            rows={10}
            ref={setErrorRef('content')}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)] mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/boards/${boardId}`)}
              disabled={isSubmitting || updateMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || updateMutation.isPending}
            >
              수정하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
