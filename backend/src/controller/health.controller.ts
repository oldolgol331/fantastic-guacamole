import { Request, Response, Router } from "express";
import { checkPrismaConnection } from "../repository/prisma.client.js";

export const healthRouter = Router();

/**
 * Liveness Probe - 서버 생존 확인
 * - Load Balancer 가 서버가 살아있는지 확인
 * - DB 연결 안 함 (빠른 응답)
 */
healthRouter.get("/live", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

/**
 * Readiness Probe - 서비스 가능 여부 확인
 * - Kubernetes/Load Balancer 가 트래픽 전달 여부 결정
 * - DB 연결 상태 확인
 */
healthRouter.get("/ready", async (_req: Request, res: Response) => {
  try {
    const isConnected = await checkPrismaConnection();
    if (isConnected) {
      res.status(200).json({ 
        status: "ready",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({ 
        status: "not ready",
        error: "Database connection failed",
      });
    }
  } catch (error) {
    console.error("🔥 [Health Check] DB connection failed:", error);
    res.status(503).json({ 
      status: "not ready",
      error: "Database connection failed",
    });
  }
});

/**
 * Startup Probe - 서버 시작 완료 확인
 * - 느린 시작하는 컨테이너용
 * - 모든 의존성 (DB, 외부 서비스) 확인
 */
healthRouter.get("/startup", async (_req: Request, res: Response) => {
  try {
    // DB 연결 확인
    const isConnected = await checkPrismaConnection();
    
    if (isConnected) {
      res.status(200).json({ 
        status: "started",
        timestamp: new Date().toISOString(),
        checks: {
          database: "connected",
        },
      });
    } else {
      res.status(503).json({ 
        status: "starting",
        error: "Server is still starting up",
      });
    }
  } catch (error) {
    console.error("🔥 [Startup Check] Failed:", error);
    res.status(503).json({ 
      status: "starting",
      error: "Server is still starting up",
    });
  }
});
