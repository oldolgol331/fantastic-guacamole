import { z } from "zod";

// ============================================
// Zod 스키마 정의
// ============================================

/** 댓글 생성 검증 스키마 */
export const createReplySchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요."),
  boardId: z.number().int().positive(),
});

/** 댓글 수정 검증 스키마 */
export const updateReplySchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요."),
});

/** 댓글 목록 조회 쿼리 검증 스키마 */
export const replyListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

// ============================================
// 타입 정의 (Zod 스키마에서 추론)
// ============================================

export type CreateReplyRequestDto = z.infer<typeof createReplySchema>;
export type UpdateReplyRequestDto = z.infer<typeof updateReplySchema>;

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
