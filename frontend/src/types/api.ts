import { z } from 'zod';

// ============================================
// Zod 스키마 정의
// ============================================

/** 회원가입 검증 스키마 */
export const signUpSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z.string().min(8, '비밀번호는 8 자 이상이어야 합니다.'),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .min(2, '닉네임은 2 자 이상이어야 합니다.')
      .max(20, '닉네임은 20 자 이하여야 합니다.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

/** 로그인 검증 스키마 */
export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

/** 게시글 생성 검증 스키마 */
export const createBoardSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 100 자 이하여야 합니다.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
});

/** 댓글 생성 검증 스키마 */
export const createReplySchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요.'),
});

// ============================================
// 타입 정의 (Zod 스키마에서 추론)
// ============================================

export type SignUpRequestDto = z.infer<typeof signUpSchema>;
export type LoginRequestDto = z.infer<typeof loginSchema>;
export type CreateBoardRequestDto = z.infer<typeof createBoardSchema>;

// ============================================
// User 관련 타입 정의
// 백엔드 DTO 에 대응하는 프론트엔드 인터페이스
// ============================================

/** 사용자 정보 응답 DTO */
export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  modifiedAt: string;
}

/** 로그인 응답 DTO */
export interface LoginResponseDto {
  accessToken: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

/** 인증된 사용자 정보 (내부용) */
export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  createdAt?: string;
  modifiedAt?: string;
}

// ============================================
// Board 관련 타입 정의
// ============================================

/** 게시글 수정 요청 DTO */
export interface UpdateBoardRequestDto {
  title?: string;
  content?: string;
}

/** 게시글 요약 정보 (목록용) */
export interface BoardSummaryDto {
  id: number;
  title: string;
  authorNickname: string;
  views: number;
  createdAt: string;
  replyCount: number;
}

/** 페이징 정보 */
export interface PaginationDto {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** 게시글 목록 응답 DTO */
export interface BoardListResponseDto {
  boards: BoardSummaryDto[];
  pagination: PaginationDto;
}

/** 게시글 상세 정보 (상세용) */
export interface BoardDetailDto {
  id: number;
  title: string;
  content: string;
  views: number;
  author: {
    id: number;
    nickname: string;
  };
  createdAt: string;
  modifiedAt: string;
}

/** 게시글 상세 응답 DTO */
export interface BoardDetailResponseDto extends BoardDetailDto {}

// ============================================
// Reply 관련 타입 정의
// ============================================

/** 댓글 수정 요청 DTO */
export interface UpdateReplyRequestDto {
  content: string;
}

/** 댓글 정보 */
export interface ReplyDto {
  id: number;
  content: string;
  author: {
    id: number;
    nickname: string;
  };
  createdAt: string;
  modifiedAt: string;
  boardId?: number;
}

/** 댓글 목록 응답 DTO */
export interface ReplyListResponseDto {
  replies: ReplyDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// ============================================
// API 공통 응답 타입
// ============================================

/** 성공 응답 래퍼 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

/** 에러 응답 */
export interface ErrorResponse {
  success: false;
  message: string;
}

/** API 응답 (공통) */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
