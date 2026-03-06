import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { corsConfig } from "./config/cors.config.js";
import { boardRouter } from "./controller/board.controller.js";
import { userRouter } from "./controller/user.controller.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { disconnectPrisma } from "./repository/prisma.client.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors(corsConfig));

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/users", userRouter);
app.use("/api/boards", boardRouter);

app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  🚀 백엔드 서버 시작됨                             ║
╠════════════════════════════════════════════════════╣
║  📦 포트: ${PORT}                                     ║
║  🌐 환경: ${process.env.NODE_ENV || "development"}                              ║
║  🗄️  데이터베이스: SQLite (Prisma ORM)              ║
║  🔗 헬스체크: http://localhost:${PORT}/health         ║
║                                                    ║
║  [API 엔드포인트]                                  ║
║  👤 User:  http://localhost:${PORT}/api/users         ║
║  📋 Board: http://localhost:${PORT}/api/boards        ║
╚════════════════════════════════════════════════════╝
  `);
});

process.on("SIGINT", async () => {
  console.log("\n🛑 서버 종료를 시작합니다...");
  await disconnectPrisma();
  server.close(() => {
    console.log("✅ 서버가 완전히 종료되었습니다.");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 서버 종료를 시작합니다...");
  await disconnectPrisma();
  server.close(() => {
    console.log("✅ 서버가 완전히 종료되었습니다.");
    process.exit(0);
  });
});
