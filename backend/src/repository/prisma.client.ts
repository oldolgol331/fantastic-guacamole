import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma 클라이언트 설정
 * - 개발 환경: 쿼리 로깅 활성화
 * - 프로덕션: 최소 로깅, 커넥션 풀 최적화
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

/**
 * Prisma 연결 종료
 * - 서버 종료 시 호출
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

/**
 * Prisma 연결 상태 확인
 * - 헬스체크에서 사용
 */
export async function checkPrismaConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
