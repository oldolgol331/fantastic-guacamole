import { useMemo } from 'react';

export interface PasswordStrengthProps {
  password: string;
  confirmPassword?: string;
  showMatch?: boolean;
}

export interface CharacterCounterProps {
  value: string;
  maxLength?: number;
  minLength?: number;
  label?: string;
}

/**
 * 비밀번호 강도 표시기 컴포넌트
 * 
 * @param password - 검증할 비밀번호
 * @param confirmPassword - 비밀번호 확인 값 (선택)
 * @param showMatch - 일치 여부 표시 여부 (기본값: false)
 * @returns 비밀번호 강도 표시기
 */
export const PasswordStrength = ({ 
  password, 
  confirmPassword,
  showMatch = false 
}: PasswordStrengthProps) => {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const isMatch = showMatch && confirmPassword 
    ? password === confirmPassword 
    : undefined;

  return (
    <div className="w-full mt-2">
      <div className="flex gap-1 mb-1">
        <div
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            strength.level >= 1 ? getStrengthColor(1) : 'bg-[var(--color-border)]'
          }`}
        />
        <div
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            strength.level >= 2 ? getStrengthColor(2) : 'bg-[var(--color-border)]'
          }`}
        />
        <div
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            strength.level >= 3 ? getStrengthColor(3) : 'bg-[var(--color-border)]'
          }`}
        />
        <div
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            strength.level >= 4 ? getStrengthColor(4) : 'bg-[var(--color-border)]'
          }`}
        />
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className={`font-medium ${getStrengthTextColor(strength.level)}`}>
          {strength.label}
        </span>
        <span className="text-[var(--color-text-secondary)]">
          {password.length}자
        </span>
      </div>
      
      {/* 비밀번호 일치 여부 표시 */}
      {showMatch && confirmPassword !== undefined && (
        <div className={`mt-2 text-xs font-medium ${
          isMatch ? 'text-[#10b981]' : 'text-[#ef4444]'
        }`}>
          {confirmPassword.length === 0 ? (
            ''
          ) : isMatch ? (
            <span className="flex items-center gap-1">
              ✓ 비밀번호가 일치합니다.
            </span>
          ) : (
            <span className="flex items-center gap-1">
              ✕ 비밀번호가 일치하지 않습니다.
            </span>
          )}
        </div>
      )}
      
      {strength.tips.length > 0 && !isMatch && (
        <ul className="mt-2 text-xs text-[var(--color-text-secondary)] list-disc list-inside space-y-1">
          {strength.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * 문자수 카운터 컴포넌트
 * 
 * @param value - 현재 입력값
 * @param maxLength - 최대 글자수 (선택)
 * @param minLength - 최소 글자수 (선택)
 * @param label - 라벨 (선택)
 * @returns 문자수 카운터
 * 
 * @example
 * // 제목 입력 필드용
 * <CharacterCounter value={values.title} maxLength={100} label="제목" />
 * 
 * // 내용 입력 필드용
 * <CharacterCounter value={values.content} minLength={1} label="내용" />
 */
export const CharacterCounter = ({ 
  value, 
  maxLength, 
  minLength,
  label 
}: CharacterCounterProps) => {
  const currentLength = value.length;
  const isOverLimit = maxLength ? currentLength > maxLength : false;
  const isUnderLimit = minLength ? currentLength < minLength : false;

  // 진행률 계산 (maxLength 가 있을 때만)
  const progress = maxLength ? Math.min((currentLength / maxLength) * 100, 100) : 0;

  return (
    <div className="w-full mt-2">
      {maxLength && (
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                progress < 50 ? 'bg-[#10b981]' : 
                progress < 80 ? 'bg-[#f59e0b]' : 
                'bg-[#ef4444]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex justify-between items-center text-xs">
        {label && (
          <span className="text-[var(--color-text-secondary)]">
            {label}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className={`font-medium ${
            isOverLimit ? 'text-[#ef4444]' : 
            isUnderLimit ? 'text-[#f59e0b]' : 
            'text-[var(--color-text-secondary)]'
          }`}>
            {currentLength}자
          </span>
          {maxLength && (
            <span className="text-[var(--color-text-secondary)]">
              / {maxLength}자
            </span>
          )}
          {minLength && !maxLength && (
            <span className="text-[var(--color-text-secondary)]">
              (최소 {minLength}자)
            </span>
          )}
        </div>
      </div>
      {maxLength && isOverLimit && (
        <p className="mt-1 text-xs text-[#ef4444]">
          {maxLength - currentLength}자 초과
        </p>
      )}
      {minLength && isUnderLimit && !isOverLimit && (
        <p className="mt-1 text-xs text-[#f59e0b]">
          {minLength - currentLength}자 더 입력하세요
        </p>
      )}
    </div>
  );
};

/**
 * 비밀번호 강도 계산 함수
 */
function calculatePasswordStrength(password: string): {
  level: number;
  label: string;
  tips: string[];
} {
  if (!password) {
    return { level: 0, label: '', tips: [] };
  }

  let score = 0;
  const tips: string[] = [];

  // 길이 검사
  if (password.length >= 8) score += 1;
  else tips.push('8 자 이상 입력하세요');

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // 문자 종류 검사
  if (/[a-z]/.test(password)) score += 1;
  else if (password.length > 0) tips.push('소문자를 포함하세요');

  if (/[A-Z]/.test(password)) score += 1;
  else if (password.length > 0) tips.push('대문자를 포함하세요');

  if (/[0-9]/.test(password)) score += 1;
  else if (password.length > 0) tips.push('숫자를 포함하세요');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else if (password.length > 0) tips.push('특수문자를 포함하세요');

  // 레벨 결정 (0-4)
  let level: number;
  let label: string;

  if (score <= 1) {
    level = 1;
    label = '매우 약함';
  } else if (score <= 3) {
    level = 2;
    label = '약함';
  } else if (score <= 5) {
    level = 3;
    label = '보통';
  } else if (score <= 7) {
    level = 4;
    label = '강함';
  } else {
    level = 4;
    label = '매우 강함';
  }

  // 팁은 최대 3 개까지만 표시
  return { level, label, tips: tips.slice(0, 3) };
}

/**
 * 강도 레벨에 따른 색상 반환
 */
function getStrengthColor(level: number): string {
  const colors = [
    '',
    'bg-[#ef4444]',    // 매우 약함
    'bg-[#f59e0b]',    // 약함
    'bg-[#3b82f6]',    // 보통
    'bg-[#10b981]',    // 강함
  ];
  return colors[level] || colors[1];
}

/**
 * 강도 레벨에 따른 텍스트 색상 반환
 */
function getStrengthTextColor(level: number): string {
  const colors = [
    '',
    'text-[#ef4444]',  // 매우 약함
    'text-[#f59e0b]',  // 약함
    'text-[#3b82f6]',  // 보통
    'text-[#10b981]',  // 강함
  ];
  return colors[level] || colors[1];
}
