import apiClient from './api';
import type {
  CreateBoardRequestDto,
  UpdateBoardRequestDto,
  BoardListResponseDto,
  BoardDetailResponseDto,
} from '../types';

/**
 * 게시글 관련 API 서비스
 */
export const boardApi = {
  /**
   * 게시글 목록 조회
   */
  getBoards: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    sortBy?: 'createdAt' | 'views' | 'replies',
    order?: 'asc' | 'desc'
  ): Promise<BoardListResponseDto> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);

    const response = await apiClient.get(`/boards?${params.toString()}`);
    return response.data.data;
  },

  /**
   * 게시글 상세 조회
   */
  getBoard: async (id: number): Promise<BoardDetailResponseDto> => {
    const response = await apiClient.get(`/boards/${id}`);
    return response.data.data;
  },

  /**
   * 게시글 생성
   */
  createBoard: async (
    data: CreateBoardRequestDto
  ): Promise<{ id: number }> => {
    const response = await apiClient.post('/boards', data);
    return response.data.data;
  },

  /**
   * 게시글 수정
   */
  updateBoard: async (
    id: number,
    data: UpdateBoardRequestDto
  ): Promise<void> => {
    await apiClient.patch(`/boards/${id}`, data);
  },

  /**
   * 게시글 삭제
   */
  deleteBoard: async (id: number): Promise<void> => {
    await apiClient.delete(`/boards/${id}`);
  },
};
