import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { boardApi } from '../services';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useForm } from '../hooks/useForm';
import { Button, Input, Textarea } from '../components';
import './BoardForm.css';

/**
 * 게시글 작성 페이지
 */
export const BoardWrite = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { showSuccess, showError } = useToast();
  const { values, handleChange, errors, setError, setErrors } = useForm({
    title: '',
    content: '',
  });

  // 인증 확인
  if (!requireAuth()) {
    return null;
  }

  /**
   * 게시글 작성 뮤테이션
   */
  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      boardApi.createBoard(data),
    onSuccess: (response) => {
      showSuccess('게시글이 작성되었습니다.');
      navigate(`/boards/${response.id}`);
    },
    onError: () => {
      showError('게시글 작성 중 오류가 발생했습니다.');
    },
  });

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

    createMutation.mutate({
      title: values.title,
      content: values.content,
    });
  };

  return (
    <div className="board-form-page">
      <div className="board-form-container">
        <h1 className="board-form-title">새 게시글 작성</h1>

        <form onSubmit={handleSubmit} className="board-form">
          <Input
            label="제목"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="제목을 입력하세요"
            disabled={createMutation.isPending}
            maxLength={100}
          />

          <Textarea
            label="내용"
            name="content"
            value={values.content}
            onChange={handleChange}
            error={errors.content}
            placeholder="내용을 입력하세요"
            disabled={createMutation.isPending}
            rows={10}
          />

          <div className="board-form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={createMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
            >
              작성하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
