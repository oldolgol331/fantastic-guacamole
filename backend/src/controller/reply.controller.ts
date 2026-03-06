import { Request, Response, Router } from "express";
import {
  CreateReplyRequestDto,
  UpdateReplyRequestDto,
} from "../dto/reply.dto.js";
import { authMiddleware } from "../middleware/auth.middleware";
import { HttpError } from "../middleware/error.middleware.js";
import { replyService } from "../service/reply.service.js";

export const replyRouter = Router();

replyRouter.get(
  "/boards/:boardId/replies",
  async (req: Request, res: Response) => {
    try {
      const boardIdParam = req.params.boardId as string;
      const boardId = parseInt(boardIdParam, 10);
      if (isNaN(boardId)) {
        throw new HttpError(400, "잘못된 게시글 ID 형식입니다.");
      }

      const pageQuery = req.query.page as string | undefined;
      const pageSizeQuery = req.query.pageSize as string | undefined;

      const page = parseInt(pageQuery || "1", 10) || 1;
      const pageSize = parseInt(pageSizeQuery || "10", 10) || 10;

      const result = await replyService.getReplies(boardId, page, pageSize);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      throw error;
    }
  },
);

replyRouter.post(
  "/boards/:boardId/replies",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const boardIdParam = req.params.boardId as string;
      const boardId = parseInt(boardIdParam, 10);
      if (isNaN(boardId)) {
        throw new HttpError(400, "잘못된 게시글 ID 형식입니다.");
      }

      const createDto: CreateReplyRequestDto = req.body;

      const result = await replyService.createReply(createDto, userId);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      throw error;
    }
  },
);

replyRouter.patch(
  "/replies/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        throw new HttpError(400, "잘못된 댓글 ID 형식입니다.");
      }

      const updateDto: UpdateReplyRequestDto = req.body;

      await replyService.updateReply(id, updateDto, userId);

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      throw error;
    }
  },
);

replyRouter.delete(
  "/replies/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        throw new HttpError(400, "잘못된 댓글 ID 형식입니다.");
      }

      await replyService.deleteReply(id, userId);

      res.status(204).send();
    } catch (error) {
      throw error;
    }
  },
);
