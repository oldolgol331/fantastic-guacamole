declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "nickname">;
    }
  }
}
