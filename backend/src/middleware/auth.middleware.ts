import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { prisma } from "../repository/prisma.client.js";
import { HttpError } from "./error.middleware.js";

interface JwtPayload {
  id: number;
  email: string;
  nickname: string;
  exp: number;
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new HttpError(401, "Authorization 헤더가 없습니다.");
    }
    if (!authHeader.startsWith("Bearer ")) {
      throw new HttpError(
        401,
        "토큰 형식이 올바르지 않습니다. (Bearer {token})",
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
      throw new HttpError(401, "토큰이 없습니다.");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new HttpError(500, "서버 설정 오류: JWT_SECRET 가 없습니다.");
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });
    if (!user) {
      throw new HttpError(401, "존재하지 않는 사용자입니다.");
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new HttpError(401, "유효하지 않은 토큰입니다.");
    }

    if (error instanceof TokenExpiredError) {
      throw new HttpError(401, "만료된 토큰입니다.");
    }

    throw error;
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next();
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });
    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};
