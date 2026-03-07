import { z } from "zod";

// ============================================
// Zod 스키마 정의
// ============================================

/** 게시글 생성 검증 스키마 */
export const createBoardSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").max(100, "제목은 100 자 이하여야 합니다."),
  content: z.string().min(1, "내용을 입력해주세요."),
});

/** 게시글 수정 검증 스키마 */
export const updateBoardSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").max(100, "제목은 100 자 이하여야 합니다.").optional(),
  content: z.string().min(1, "내용을 입력해주세요.").optional(),
});

/** 게시글 목록 조회 쿼리 검증 스키마 */
export const boardListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  authorId: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(['createdAt', 'views', 'replies']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ============================================
// 타입 정의 (Zod 스키마에서 추론)
// ============================================

export type CreateBoardRequestDto = z.infer<typeof createBoardSchema>;
export type UpdateBoardRequestDto = z.infer<typeof updateBoardSchema>;

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
