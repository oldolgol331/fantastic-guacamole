import { Request, Response, Router } from "express";
import {
  CreateBoardRequestDto,
  UpdateBoardRequestDto,
} from "../dto/board.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { HttpError } from "../middleware/error.middleware.js";
import { boardService } from "../service/board.service.js";

export const boardRouter = Router();

boardRouter.get("/", async (req: Request, res: Response) => {
  try {
    const pageQuery = req.query.page as string | undefined;
    const pageSizeQuery = req.query.pageSize as string | undefined;
    const searchQuery = req.query.search as string | undefined;

    const page = parseInt(pageQuery || "1", 10) || 1;
    const pageSize = parseInt(pageSizeQuery || "10", 10) || 10;
    const search = searchQuery;

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
    const idParam = req.params.id as string;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      throw new HttpError(400, "잘못된 게시글 ID 형식입니다.");
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
    const createDto: CreateBoardRequestDto = req.body;

    if (!createDto.title || createDto.title.trim().length === 0) {
      throw new HttpError(400, "제목을 입력해주세요.");
    }

    if (!createDto.content || createDto.content.trim().length === 0) {
      throw new HttpError(400, "내용을 입력해주세요.");
    }

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
      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        throw new HttpError(400, "잘못된 게시글 ID 형식입니다.");
      }

      const updateDto: UpdateBoardRequestDto = req.body;

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
      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        throw new HttpError(400, "잘못된 게시글 ID 형식입니다.");
      }

      await boardService.deleteBoard(id, userId);

      res.status(204).send();
    } catch (error) {
      throw error;
    }
  },
);
