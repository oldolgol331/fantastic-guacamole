import { Request, Response, Router } from "express";
import { signUpSchema, loginSchema, updateUserSchema } from "../dto/user.dto.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userService } from "../service/user.service.js";

export const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    // Zod 검증
    const signUpDto = signUpSchema.parse(req.body);

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
    // Zod 검증
    const loginDto = loginSchema.parse(req.body);

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

    // Zod 검증
    const { nickname, newPassword, confirmNewPassword } = updateUserSchema.parse(req.body);

    const result = await userService.updateMyInfo(
      userId,
      nickname,
      newPassword,
      confirmNewPassword,
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
