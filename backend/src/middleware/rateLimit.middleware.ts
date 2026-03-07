import rateLimit from 'express-rate-limit';

/**
 * API Rate Limiter
 * - IP 당 분당 100 요청 제한
 * - DDoS/브루트포스 공격 방지
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 분
  max: 100, // IP 당 최대 100 요청
  message: {
    success: false,
    error: {
      code: 429,
      message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 인증 엔드포인트용 Rate Limiter (더 엄격)
 * - 로그인/회원가입 브루트포스 방지
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 분
  max: 5, // IP 당 최대 5 요청
  message: {
    success: false,
    error: {
      code: 429,
      message: '너무 많은 시도가 발생했습니다. 15 분 후 다시 시도해주세요.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 게시글 작성용 Rate Limiter (스팸 방지)
 */
export const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 분
  max: 10, // IP 당 최대 10 요청
  message: {
    success: false,
    error: {
      code: 429,
      message: '너무 빠르게 게시글을 작성하고 있습니다. 잠시 후 다시 시도해주세요.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 댓글 작성용 Rate Limiter (스팸 방지)
 */
export const replyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 분
  max: 20, // IP 당 최대 20 요청
  message: {
    success: false,
    error: {
      code: 429,
      message: '너무 빠르게 댓글을 작성하고 있습니다. 잠시 후 다시 시도해주세요.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
