import { z } from "zod";

// ============================================
// Zod 스키마 정의
// ============================================

/** 회원가입 검증 스키마 */
export const signUpSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(8, "비밀번호는 8 자 이상이어야 합니다."),
    confirmPassword: z.string(),
    nickname: z.string().min(2, "닉네임은 2 자 이상이어야 합니다.").max(20, "닉네임은 20 자 이하여야 합니다."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

/** 로그인 검증 스키마 */
export const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

/** 사용자 정보 수정 검증 스키마 */
export const updateUserSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 2 자 이상이어야 합니다.")
    .max(20, "닉네임은 20 자 이하여야 합니다.")
    .optional(),
  newPassword: z.string().min(8, "비밀번호는 8 자 이상이어야 합니다.").optional(),
  confirmNewPassword: z.string().optional(),
});

// ============================================
// 타입 정의 (Zod 스키마에서 추론)
// ============================================

export type SignUpRequestDto = z.infer<typeof signUpSchema>;
export type LoginRequestDto = z.infer<typeof loginSchema>;
export type UpdateUserRequestDto = z.infer<typeof updateUserSchema>;

/** 사용자 정보 응답 DTO */
export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  modifiedAt: string;
}

/** 로그인 응답 DTO */
export interface LoginResponseDto {
  accessToken: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}
