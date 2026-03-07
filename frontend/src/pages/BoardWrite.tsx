import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { boardApi } from '../services';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useForm } from '../hooks/useForm';
import { createBoardSchema } from '../types';
import { Button, Input, Textarea, CharacterCounter } from '../components';

/**
 * 게시글 작성 페이지
 * TailwindCSS 유틸리티 클래스 사용
 */
export const BoardWrite = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { showSuccess, showError } = useToast();

  // Zod 스키마를 사용한 useForm (autoScroll: 에러 시 자동 스크롤)
  const { values, errors, handleChange, handleSubmit, isSubmitting, setErrorRef } = useForm(
    { title: '', content: '' },
    createBoardSchema,
    { autoScroll: true }
  );

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
   * 제출 핸들러
   */
  const onSubmit = async () => {
    createMutation.mutate({
      title: values.title,
      content: values.content,
    });
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] m-0 mb-6">
          새 게시글 작성
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}
          className="flex flex-col gap-5"
        >
          <Input
            label="제목"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="제목을 입력하세요"
            disabled={isSubmitting || createMutation.isPending}
            maxLength={100}
            ref={setErrorRef('title')}
          />
          <CharacterCounter value={values.title} maxLength={100} label="제목" />

          <Textarea
            label="내용"
            name="content"
            value={values.content}
            onChange={handleChange}
            error={errors.content}
            placeholder="내용을 입력하세요"
            disabled={isSubmitting || createMutation.isPending}
            rows={10}
            ref={setErrorRef('content')}
          />
          <CharacterCounter value={values.content} minLength={1} label="내용" />

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)] mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={isSubmitting || createMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || createMutation.isPending}
            >
              작성하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
