import apiClient from './api';
import type {
  UpdateReplyRequestDto,
  ReplyListResponseDto,
} from '../types';

/**
 * 댓글 관련 API 서비스
 */
export const replyApi = {
  /**
   * 댓글 목록 조회
   */
  getReplies: async (boardId: number): Promise<ReplyListResponseDto> => {
    const response = await apiClient.get(`/boards/${boardId}/replies`);
    return response.data.data;
  },

  /**
   * 댓글 생성
   */
  createReply: async (
    boardId: number,
    data: { content: string }
  ): Promise<{ id: number }> => {
    const response = await apiClient.post(`/boards/${boardId}/replies`, data);
    return response.data.data;
  },

  /**
   * 댓글 수정
   */
  updateReply: async (
    id: number,
    data: UpdateReplyRequestDto
  ): Promise<void> => {
    await apiClient.patch(`/replies/${id}`, data);
  },

  /**
   * 댓글 삭제
   */
  deleteReply: async (id: number): Promise<void> => {
    await apiClient.delete(`/replies/${id}`);
  },
};
