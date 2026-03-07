import { Request, Response, Router } from "express";
import {
  createReplySchema,
  updateReplySchema,
  replyListQuerySchema,
} from "../dto/reply.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { replyLimiter } from "../middleware/rateLimit.middleware.js";
import { replyService } from "../service/reply.service.js";

export const replyRouter = Router();

replyRouter.get(
  "/boards/:boardId/replies",
  async (req: Request, res: Response) => {
    try {
      const boardId = parseInt(req.params.boardId as string, 10);
      if (isNaN(boardId)) {
        throw new (require("../middleware/error.middleware.js").HttpError)(400, "잘못된 게시글 ID 형식입니다.");
      }

      // Zod 쿼리 검증
      const { page, pageSize } = replyListQuerySchema.parse(req.query);

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
  replyLimiter,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const boardId = parseInt(req.params.boardId as string, 10);
      if (isNaN(boardId)) {
        throw new (require("../middleware/error.middleware.js").HttpError)(400, "잘못된 게시글 ID 형식입니다.");
      }

      // Zod 검증
      const createDto = createReplySchema.parse({
        ...req.body,
        boardId,
      });

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

      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        throw new (require("../middleware/error.middleware.js").HttpError)(400, "잘못된 댓글 ID 형식입니다.");
      }

      // Zod 검증
      const updateDto = updateReplySchema.parse(req.body);

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

      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        throw new (require("../middleware/error.middleware.js").HttpError)(400, "잘못된 댓글 ID 형식입니다.");
      }

      await replyService.deleteReply(id, userId);

      res.status(204).send();
    } catch (error) {
      throw error;
    }
  },
);
