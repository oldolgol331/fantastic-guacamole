export interface CreateReplyRequestDto {
  content: string;
  boardId: number;
}

export interface UpdateReplyRequestDto {
  content?: string;
}

export interface ReplyListResponseDto {
  replies: ReplyDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface ReplyDto {
  id: number;
  content: string;
  author: {
    id: number;
    nickname: string;
  };
  createdAt: string;
  modifiedAt: string;
}
