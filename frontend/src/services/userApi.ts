import apiClient from './api';
import type {
  SignUpRequestDto,
  LoginRequestDto,
  UserResponseDto,
  LoginResponseDto,
} from '../types';

/**
 * 사용자 인증 관련 API 서비스
 */
export const userApi = {
  /**
   * 회원가입
   */
  signUp: async (data: SignUpRequestDto): Promise<UserResponseDto> => {
    const response = await apiClient.post('/users/signup', data);
    return response.data.data;
  },

  /**
   * 로그인
   */
  login: async (data: LoginRequestDto): Promise<LoginResponseDto> => {
    const response = await apiClient.post('/users/login', data);
    return response.data.data;
  },

  /**
   * 내 정보 조회
   */
  getMyInfo: async (): Promise<UserResponseDto> => {
    const response = await apiClient.get('/users/me');
    return response.data.data;
  },

  /**
   * 내 정보 수정
   */
  updateMyInfo: async (
    nickname?: string,
    newPassword?: string,
    confirmNewPassword?: string
  ): Promise<UserResponseDto> => {
    const response = await apiClient.patch('/users/me', {
      nickname,
      newPassword,
      confirmNewPassword,
    });
    return response.data.data;
  },

  /**
   * 회원탈퇴
   */
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/users/me');
  },
};
