import { Request, Response, Router } from "express";
import {
  createBoardSchema,
  updateBoardSchema,
  boardListQuerySchema,
} from "../dto/board.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { boardService } from "../service/board.service.js";

export const boardRouter = Router();

boardRouter.get("/", async (req: Request, res: Response) => {
  try {
    // Zod 쿼리 검증
    const { page, pageSize, search } = boardListQuerySchema.parse(req.query);

    const result = await boardService.getBoards(page, pageSize, search);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

boardRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      throw new (require("../middleware/error.middleware.js").HttpError)(400, "잘못된 게시글 ID 형식입니다.");
    }

    const result = await boardService.getBoard(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

boardRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Zod 검증
    const createDto = createBoardSchema.parse(req.body);

    const result = await boardService.createBoard(createDto, userId);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

boardRouter.patch(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        throw new (require("../middleware/error.middleware.js").HttpError)(400, "잘못된 게시글 ID 형식입니다.");
      }

      // Zod 검증
      const updateDto = updateBoardSchema.parse(req.body);

      await boardService.updateBoard(id, updateDto, userId);

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      throw error;
    }
  },
);

boardRouter.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        throw new (require("../middleware/error.middleware.js").HttpError)(400, "잘못된 게시글 ID 형식입니다.");
      }

      await boardService.deleteBoard(id, userId);

      res.status(204).send();
    } catch (error) {
      throw error;
    }
  },
);
