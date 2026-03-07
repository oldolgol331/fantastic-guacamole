import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '../services';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useForm } from '../hooks/useForm';
import { Button, Input, Modal } from '../components';

/**
 * 내 정보 페이지 (마이페이지)
 * TailwindCSS 유틸리티 클래스 사용
 */
export const MyPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, handleLogout, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { values, handleChange, errors, setError, setErrors, reset, setValues } = useForm({
    nickname: user?.nickname || '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // 인증 확인
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  /**
   * 정보 수정 뮤테이션
   */
  const updateMutation = useMutation({
    mutationFn: async () => {
      const result = await userApi.updateMyInfo(
        values.nickname || undefined,
        values.newPassword || undefined,
        values.confirmNewPassword || undefined
      );
      updateUser(result);
      return result;
    },
    onSuccess: () => {
      showSuccess('정보가 수정되었습니다.');
      setIsEditMode(false);
      reset();
    },
    onError: (error: unknown) => {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        showError(axiosError.response?.data?.message || '정보 수정 중 오류가 발생했습니다.');
      } else {
        showError('정보 수정 중 오류가 발생했습니다.');
      }
    },
  });

  /**
   * 회원탈퇴 뮤테이션
   */
  const deleteMutation = useMutation({
    mutationFn: () => userApi.deleteAccount(),
    onSuccess: () => {
      handleLogout();
      showSuccess('회원탈퇴가 완료되었습니다.');
      navigate('/');
    },
    onError: () => {
      showError('회원탈퇴 중 오류가 발생했습니다.');
    },
  });

  /**
   * 수정 모드 시작
   */
  const handleEditStart = () => {
    setValues({
      nickname: user?.nickname || '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setIsEditMode(true);
  };

  /**
   * 수정 취소
   */
  const handleEditCancel = () => {
    setIsEditMode(false);
    reset();
    setErrors({});
  };

  /**
   * 폼 유효성 검사
   */
  const validate = (): boolean => {
    let isValid = true;
    setErrors({});

    if (!values.nickname.trim()) {
      setError('nickname', '닉네임을 입력해주세요');
      isValid = false;
    } else if (values.nickname.length < 2 || values.nickname.length > 20) {
      setError('nickname', '닉네임은 2~20 자 사이여야 합니다');
      isValid = false;
    }

    // 비밀번호 변경 시 검증
    if (values.newPassword || values.confirmNewPassword) {
      if (values.newPassword.length < 8) {
        setError('newPassword', '비밀번호는 8 자 이상이어야 합니다');
        isValid = false;
      }

      if (values.newPassword !== values.confirmNewPassword) {
        setError('confirmNewPassword', '비밀번호가 일치하지 않습니다');
        isValid = false;
      }
    }

    return isValid;
  };

  /**
   * 수정 제출
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    updateMutation.mutate();
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-[2.75rem] font-bold text-[var(--color-text-primary)] m-0">내 정보</h1>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8">
          {!isEditMode ? (
            /* 읽기 모드 */
            <>
              <div className="flex flex-col gap-5 mb-6">
                <div className="flex justify-between items-center py-4 border-b border-[var(--color-border)] last:border-b-0 last:pb-0">
                  <label className="text-[15px] text-[var(--color-text-secondary)] font-medium">이메일</label>
                  <span className="text-[15px] text-[var(--color-text-primary)] font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[var(--color-border)] last:border-b-0 last:pb-0">
                  <label className="text-[15px] text-[var(--color-text-secondary)] font-medium">닉네임</label>
                  <span className="text-[15px] text-[var(--color-text-primary)] font-medium">{user?.nickname}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[var(--color-border)] last:border-b-0 last:pb-0">
                  <label className="text-[15px] text-[var(--color-text-secondary)] font-medium">가입일</label>
                  <span className="text-[15px] text-[var(--color-text-primary)] font-medium">
                    {user?.createdAt ? formatDate(user.createdAt) : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[var(--color-border)] last:border-b-0 last:pb-0">
                  <label className="text-[15px] text-[var(--color-text-secondary)] font-medium">최근 수정일</label>
                  <span className="text-[15px] text-[var(--color-text-primary)] font-medium">
                    {user?.modifiedAt ? formatDate(user.modifiedAt) : '-'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-[var(--color-border)]">
                <Button variant="secondary" onClick={handleEditStart}>
                  정보 수정
                </Button>
                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                  회원탈퇴
                </Button>
              </div>
            </>
          ) : (
            /* 수정 모드 */
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="닉네임"
                name="nickname"
                value={values.nickname}
                onChange={handleChange}
                error={errors.nickname}
                disabled={updateMutation.isPending}
              />

              <Input
                label="새 비밀번호 (선택)"
                type="password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                placeholder="변경하지 않으려면 비워주세요"
                disabled={updateMutation.isPending}
              />

              <Input
                label="새 비밀번호 확인"
                type="password"
                name="confirmNewPassword"
                value={values.confirmNewPassword}
                onChange={handleChange}
                error={errors.confirmNewPassword}
                placeholder="새 비밀번호 확인"
                disabled={updateMutation.isPending}
              />

              <div className="flex gap-3 justify-end pt-4 border-t border-[var(--color-border)] mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleEditCancel}
                  disabled={updateMutation.isPending}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={updateMutation.isPending}
                >
                  저장하기
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← 돌아가기
          </Button>
        </div>
      </div>

      {/* 회원탈퇴 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="회원탈퇴"
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
              회원탈퇴
            </Button>
          </>
        }
      >
        <p>정말로 회원탈퇴하시겠습니까?</p>
        <p className="text-[#ef4444] text-sm mt-2">
          이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.
        </p>
      </Modal>
    </div>
  );
};
