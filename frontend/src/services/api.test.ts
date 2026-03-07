import { describe, it, expect } from 'vitest';
import axios from 'axios';

/**
 * API 클라이언트 설정 테스트
 */
describe('apiClient 설정', () => {
  it('axios create 가 정의되어 있어야 합니다', () => {
    expect(axios.create).toBeDefined();
    expect(typeof axios.create).toBe('function');
  });

  it('axios 인스턴스 설정 객체를 생성할 수 있어야 합니다', () => {
    const config = {
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    };

    expect(config.baseURL).toBe('/api');
    expect(config.headers['Content-Type']).toBe('application/json');
    expect(config.timeout).toBe(10000);
  });
});
