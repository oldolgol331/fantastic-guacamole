import {
  CreateReplyRequestDto,
  ReplyDto,
  ReplyListResponseDto,
  UpdateReplyRequestDto,
} from "../dto/reply.dto.js";
import { HttpError } from "../middleware/error.middleware.js";
import { prisma } from "../repository/prisma.client.js";

export class ReplyService {
  async getReplies(
    boardId: number,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ReplyListResponseDto> {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true },
    });
    if (!board) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }

    const totalCount = await prisma.reply.count({
      where: { boardId },
    });

    const replies = await prisma.reply.findMany({
      where: { boardId },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const replyDtos: ReplyDto[] = replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      author: {
        id: reply.author.id,
        nickname: reply.author.nickname,
      },
      createdAt: reply.createdAt.toISOString(),
      modifiedAt: reply.modifiedAt.toISOString(),
    }));

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      replies: replyDtos,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async createReply(
    dto: CreateReplyRequestDto,
    userId: number,
  ): Promise<{ id: number }> {
    const { content, boardId } = dto;

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true },
    });
    if (!board) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }

    if (!content || content.trim().length === 0) {
      throw new HttpError(400, "댓글 내용을 입력해주세요.");
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        authorId: userId,
        boardId,
      },
      select: {
        id: true,
      },
    });

    return { id: reply.id };
  }

  async updateReply(
    id: number,
    dto: UpdateReplyRequestDto,
    userId: number,
  ): Promise<void> {
    const reply = await prisma.reply.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });
    if (!reply) {
      throw new HttpError(404, "댓글을 찾을 수 없습니다.");
    }

    if (reply.authorId !== userId) {
      throw new HttpError(403, "수정 권한이 없습니다.");
    }

    if (dto.content && dto.content.trim().length === 0) {
      throw new HttpError(400, "댓글 내용을 입력해주세요.");
    }

    await prisma.reply.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async deleteReply(id: number, userId: number): Promise<void> {
    const reply = await prisma.reply.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });
    if (!reply) {
      throw new HttpError(404, "댓글을 찾을 수 없습니다.");
    }

    if (reply.authorId !== userId) {
      throw new HttpError(403, "삭제 권한이 없습니다.");
    }

    await prisma.reply.delete({
      where: { id },
    });
  }
}

export const replyService = new ReplyService();
