import { Request, Response, Router } from "express";
import { LoginRequestDto, SignUpRequestDto } from "../dto/user.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userService } from "../service/user.service.js";

export const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const signUpDto: SignUpRequestDto = req.body;

    const result = await userService.signUp(signUpDto);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const loginDto: LoginRequestDto = req.body;

    const result = await userService.login(loginDto);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

userRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await userService.getMyInfo(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

userRouter.patch("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const { nickname, newPassword } = req.body;

    const result = await userService.updateMyInfo(
      userId,
      nickname,
      newPassword,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

userRouter.delete(
  "/me",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      await userService.deleteAccount(userId);

      res.status(204).send();
    } catch (error) {
      throw error;
    }
  },
);
