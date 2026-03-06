// ============================================
// User 관련 타입 정의
// 백엔드 DTO 에 대응하는 프론트엔드 인터페이스
// ============================================

/** 회원가입 요청 DTO */
export interface SignUpRequestDto {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

/** 로그인 요청 DTO */
export interface LoginRequestDto {
  email: string;
  password: string;
}

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

/** 게시글 생성 요청 DTO */
export interface CreateBoardRequestDto {
  title: string;
  content: string;
}

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

/** 댓글 생성 요청 DTO */
export interface CreateReplyRequestDto {
  content: string;
  boardId: number;
}

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
  boardId: number;
}

/** 댓글 목록 응답 DTO */
export interface ReplyListResponseDto {
  replies: ReplyDto[];
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
