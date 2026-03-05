export interface SignUpRequestDto {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  modifiedAt: string;
}
