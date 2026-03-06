import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { boardApi } from '../services';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useForm } from '../hooks/useForm';
import { Button, Input, Textarea, LoadingSpinner } from '../components';
import './BoardForm.css';

/**
 * 게시글 수정 페이지
 */
export const BoardEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requireAuth, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const boardId = id ? parseInt(id, 10) : null;

  const { values, handleChange, errors, setError, setErrors, setValues } =
    useForm({
      title: '',
      content: '',
    });

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
      <div className="board-form-loading">
        <LoadingSpinner size="lg" fullScreen />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="board-form-error">
        <p>게시글을 찾을 수 없습니다.</p>
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
    <div className="board-form-page">
      <div className="board-form-container">
        <h1 className="board-form-title">게시글 수정</h1>

        <form onSubmit={handleSubmit} className="board-form">
          <Input
            label="제목"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="제목을 입력하세요"
            disabled={updateMutation.isPending}
            maxLength={100}
          />

          <Textarea
            label="내용"
            name="content"
            value={values.content}
            onChange={handleChange}
            error={errors.content}
            placeholder="내용을 입력하세요"
            disabled={updateMutation.isPending}
            rows={10}
          />

          <div className="board-form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/boards/${boardId}`)}
              disabled={updateMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={updateMutation.isPending}
            >
              수정하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
