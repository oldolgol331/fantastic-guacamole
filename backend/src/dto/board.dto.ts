export interface CreateBoardRequestDto {
  title: string;
  content: string;
}

export interface UpdateBoardRequestDto {
  title?: string;
  content?: string;
}

export interface BoardListResponseDto {
  boards: BoardSummaryDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface BoardSummaryDto {
  id: number;
  title: string;
  authorNickname: string;
  views: number;
  createdAt: string;
  replyCount: number;
}

export interface BoardDetailResponseDto {
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
