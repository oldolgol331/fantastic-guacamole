import {
  BoardDetailResponseDto,
  BoardListResponseDto,
  BoardSummaryDto,
  CreateBoardRequestDto,
  UpdateBoardRequestDto,
} from "../dto/board.dto.js";
import { HttpError } from "../middleware/error.middleware.js";
import { prisma } from "../repository/prisma.client.js";

export interface BoardSearchOptions {
  page: number;
  pageSize: number;
  search?: string;
  authorId?: number;
  sortBy?: 'createdAt' | 'views' | 'replies';
  order?: 'asc' | 'desc';
}

export class BoardService {
  async getBoards(options: BoardSearchOptions): Promise<BoardListResponseDto> {
    const { 
      page, 
      pageSize, 
      search, 
      authorId,
      sortBy = 'createdAt', 
      order = 'desc' 
    } = options;

    const whereCondition: any = {};

    // 검색어
    if (search) {
      whereCondition.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { author: { nickname: { contains: search } } },
      ];
    }

    // 작성자 필터
    if (authorId) {
      whereCondition.authorId = authorId;
    }

    // 정렬
    const orderBy = { [sortBy]: order };

    const [totalCount, boards] = await Promise.all([
      prisma.board.count({ where: whereCondition }),
      prisma.board.findMany({
        where: whereCondition,
        include: {
          author: {
            select: {
              nickname: true,
            },
          },
          replies: {
            select: {
              id: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const boardSummaries: BoardSummaryDto[] = boards.map((board) => ({
      id: board.id,
      title: board.title,
      authorNickname: board.author.nickname,
      views: board.views,
      createdAt: board.createdAt.toISOString(),
      replyCount: board.replies.length,
    }));

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      boards: boardSummaries,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async getBoard(id: number): Promise<BoardDetailResponseDto> {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    if (!board) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }

    await prisma.board.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return {
      id: board.id,
      title: board.title,
      content: board.content,
      views: board.views + 1,
      author: {
        id: board.author.id,
        nickname: board.author.nickname,
      },
      createdAt: board.createdAt.toISOString(),
      modifiedAt: board.modifiedAt.toISOString(),
    };
  }

  async createBoard(
    dto: CreateBoardRequestDto,
    userId: number,
  ): Promise<{ id: number }> {
    const { title, content } = dto;

    const board = await prisma.board.create({
      data: {
        title,
        content,
        authorId: userId,
      },
      select: {
        id: true,
      },
    });

    return { id: board.id };
  }

  async updateBoard(
    id: number,
    dto: UpdateBoardRequestDto,
    userId: number,
  ): Promise<void> {
    const board = await prisma.board.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });
    if (!board) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }

    if (board.authorId !== userId) {
      throw new HttpError(403, "수정 권한이 없습니다.");
    }

    await prisma.board.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async deleteBoard(id: number, userId: number): Promise<void> {
    const board = await prisma.board.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });
    if (!board) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }

    if (board.authorId !== userId) {
      throw new HttpError(403, "삭제 권한이 없습니다.");
    }

    // 트랜잭션을 사용하여 댓글 먼저 삭제 후 게시글 삭제
    // (외래 키 제약조건 문제 해결)
    await prisma.$transaction([
      prisma.reply.deleteMany({
        where: { boardId: id },
      }),
      prisma.board.delete({
        where: { id },
      }),
    ]);
  }
}

export const boardService = new BoardService();
