import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpError } from "../middleware/error.middleware";
import { prisma } from "../repository/prisma.client";
import {
  LoginRequestDto,
  LoginResponseDto,
  SignUpRequestDto,
  UserResponseDto,
} from "./../dto/user.dto.js";

export class UserService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: number;

  constructor() {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!secret) {
      throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
    }

    this.jwtSecret = secret;
    this.jwtExpiresIn = expiresIn ? parseInt(expiresIn, 10) : 86400000;
  }

  async signUp(dto: SignUpRequestDto): Promise<UserResponseDto> {
    const { email, password, confirmPassword, nickname } = dto;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existingUser) {
      throw new HttpError(400, "이미 사용 중인 이메일입니다.");
    }

    const existingNickname = await prisma.user.findFirst({
      where: { nickname },
      select: { id: true },
    });
    if (existingNickname) {
      throw new HttpError(400, "이미 사용 중인 닉네임입니다.");
    }

    if (password !== confirmPassword) {
      throw new HttpError(400, "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        modifiedAt: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt.toISOString(),
      modifiedAt: user.modifiedAt.toISOString(),
    };
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = dto;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        createdAt: true,
        modifiedAt: true,
      },
    });
    if (!user) {
      throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      this.jwtSecret,
      {
        expiresIn: Math.floor(this.jwtExpiresIn / 1000),
      },
    );

    return {
      accessToken: token,
      expiresIn: this.jwtExpiresIn,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt.toISOString(),
        modifiedAt: user.modifiedAt.toISOString(),
      },
    };
  }

  async getMyInfo(userId: number): Promise<UserResponseDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        modifiedAt: true,
      },
    });
    if (!user) {
      throw new HttpError(404, "사용자를 찾을 수 없습니다.");
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt.toISOString(),
      modifiedAt: user.modifiedAt.toISOString(),
    };
  }

  async updateMyInfo(
    userId: number,
    nickname?: string,
    newPassword?: string,
    confirmNewPassword?: string,
  ): Promise<UserResponseDto> {
    if (nickname) {
      const existingNickname = await prisma.user.findFirst({
        where: { nickname, NOT: { id: userId } },
        select: { id: true },
      });
      if (existingNickname) {
        throw new HttpError(400, "이미 사용 중인 닉네임입니다.");
      }
    }

    let hashedPassword: string | undefined;
    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        throw new HttpError(
          400,
          "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        );
      }
      if (newPassword.length < 8) {
        throw new HttpError(400, "비밀번호는 8자 이상이어야 합니다.");
      }

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nickname && { nickname }),
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        modifiedAt: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt.toISOString(),
      modifiedAt: user.modifiedAt.toISOString(),
    };
  }

  async deleteAccount(userId: number): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}

export const userService = new UserService();
