import { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

export const errorMiddleware = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.statusCode,
        message: err.message,
      },
    });
  }

  console.error("🔥 [Unhandled Error]", err);

  return res.status(500).json({
    success: false,
    error: {
      code: 500,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message,
    },
  });
};
