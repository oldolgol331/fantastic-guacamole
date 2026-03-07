import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

/**
 * API 에러 응답 타입
 */
interface ApiErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
  };
}

/**
 * API 클라이언트 인스턴스
 * Vite 프록시 설정을 통해 /api 요청은 자동으로 http://localhost:3000/api 로 전달됨
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 초 타임아웃
});

/**
 * 요청 인터셉터: accessToken 자동 첨부
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터: 에러 핸들링 및 토큰 만료 처리
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // 401: 인증 오류 - 토큰 만료
    if (error.response?.status === 401) {
      // 토큰 만료 시 localStorage 정리 및 로그인 페이지로 이동
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 에러 메시지를 명확하게 전달
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      '요청 중 오류가 발생했습니다.';

    const customError = new Error(errorMessage);
    (customError as any).status = error.response?.status;
    (customError as any).code = error.response?.data?.error?.code;

    return Promise.reject(customError);
  }
);

export default apiClient;
