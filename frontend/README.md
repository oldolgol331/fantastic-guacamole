# ⚛️ Fantastic Guacamole - Frontend

> React 19 + Vite 7 + TypeScript 기반의 모던 웹 애플리케이션

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff?logo=vite)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1.9-6e9f18?logo=vitest)](https://vitest.dev/)

---

## 📋 개요

프론트엔드는 **React 19**와 **Vite 7**를 사용하여 구축된 모던 웹 애플리케이션입니다.  
TailwindCSS 를 활용한 반응형 디자인과 Zustand, TanStack Query 를 통한 효율적인 상태 관리를 구현했습니다.

### ✨ 주요 기능

- 🔐 **인증 시스템**: JWT 기반 로그인/로그아웃
- 📝 **게시글 관리**: 실시간 CRUD operations
- 💬 **댓글 기능**: 인터랙티브 댓글 시스템
- 🎨 **모던 UI**: TailwindCSS 기반 커스텀 디자인
- 🧪 **테스트**: Vitest + Testing Library 87 개 테스트

---

## 🏗️ 아키텍처

```
src/
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── Button.tsx + test
│   ├── Input.tsx + test
│   ├── Textarea.tsx + test
│   ├── Toast.tsx + test
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── Modal.tsx
│   └── ErrorBoundary.tsx
├── pages/           # 페이지 컴포넌트
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── BoardList.tsx
│   ├── BoardDetail.tsx
│   ├── BoardWrite.tsx
│   ├── BoardEdit.tsx
│   └── MyPage.tsx
├── hooks/           # 커스텀 React Hooks
│   ├── useAuth.ts + test
│   ├── useForm.ts + test
│   └── useToast.ts
├── services/        # API 통신 계층
│   ├── api.ts + test
│   ├── userApi.ts
│   ├── boardApi.ts
│   └── replyApi.ts
├── stores/          # Zustand 상태 관리
│   ├── authStore.ts + test
│   └── uiStore.ts
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
└── test/            # 테스트 설정
    └── setup.ts
```

---

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 20.x 이상
- npm 또는 pnpm

### 설치 및 설정

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 확인
http://localhost:5173
```

### 환경 변수

개발 환경에서는 Vite 프록시 설정으로 별도 설정이 필요하지 않습니다.

프로덕션 빌드시 `.env` 파일을 생성하세요:

```env
VITE_API_URL=https://your-api-domain.com/api
```

### 실행 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린팅
npm run lint

# 테스트
npm run test

# 테스트 UI 모드
npm run test:ui

# 테스트 커버리지
npm run test:coverage
```

---

## 📚 주요 컴포넌트

### Button

```tsx
import { Button } from './components';

// 기본 사용법
<Button variant="primary" size="md">
  클릭
</Button>

// 로딩 상태
<Button loading>로딩중</Button>

// 전체 너비
<Button fullWidth>Full Width</Button>
```

**Props:**
| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `variant` | primary \| secondary \| danger \| ghost | primary | 스타일 변형 |
| `size` | sm \| md \| lg | md | 크기 |
| `fullWidth` | boolean | false | 전체 너비 |
| `loading` | boolean | false | 로딩 상태 |
| `disabled` | boolean | false | 비활성화 |

---

### Input

```tsx
import { Input } from './components';

<Input
  name="email"
  type="email"
  label="이메일"
  placeholder="이메일을 입력하세요"
  error="잘못된 형식입니다"
  helperText="8 자 이상 입력해주세요"
/>
```

---

### Textarea

```tsx
import { Textarea } from './components';

<Textarea
  name="content"
  label="내용"
  rows={5}
  placeholder="내용을 입력하세요"
  error="내용을 입력해주세요"
/>
```

---

### Toast

```tsx
// 전역 토스트 (자동 표시)
import { Toast } from './components';

// Toast 컴포넌트는 App.tsx 에 이미 포함되어 있습니다
```

---

## 🪝 커스텀 훅

### useAuth

인증 관련 상태를 관리하는 훅입니다.

```tsx
import { useAuth } from './hooks';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout,
    requireAuth,
  } = useAuth();

  const onLogin = async () => {
    await handleLogin('email@example.com', 'password');
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <button onClick={onLogin}>로그인</button>
      )}
    </div>
  );
}
```

---

### useForm

Zod 검증을 통합한 폼 관리 훅입니다.

```tsx
import { useForm } from './hooks';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('이메일 형식이 아닙니다'),
  password: z.string().min(8, '8 자 이상 입력해주세요'),
});

function LoginForm() {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setErrorRef,
  } = useForm({ email: '', password: '' }, schema, { autoScroll: true });

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit)(e)}>
      <Input
        name="email"
        value={values.email}
        onChange={handleChange}
        ref={setErrorRef('email')}
        error={errors.email}
      />
      <Input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        ref={setErrorRef('password')}
        error={errors.password}
      />
      <button type="submit">제출</button>
    </form>
  );
}
```

---

## 🗄️ 상태 관리

### Zustand (authStore)

전역 인증 상태를 관리합니다.

```tsx
import { useAuthStore } from './stores';

// 상태 읽기
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// 액션 사용
const login = useAuthStore((state) => state.login);
const logout = useAuthStore((state) => state.logout);

await login('email@example.com', 'password');
logout();
```

### TanStack Query

서버 상태 (API 데이터) 를 관리합니다.

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { boardApi } from './services';

// 데이터 조회
function BoardList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['boards', page],
    queryFn: () => boardApi.getBoards(page),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>에러 발생</div>;

  return (
    <div>
      {data.boards.map((board) => (
        <div key={board.id}>{board.title}</div>
      ))}
    </div>
  );
}

// 데이터 수정
function UpdateBoard() {
  const mutation = useMutation({
    mutationFn: (data) => boardApi.updateBoard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });

  return (
    <button onClick={() => mutation.mutate({ title: '수정' })}>
      수정하기
    </button>
  );
}
```

---

## 🌐 API 통신

### Axios 설정

```typescript
// services/api.ts
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터: 자동 토큰 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API 사용 예시

```typescript
import { userApi, boardApi } from './services';

// 사용자 인증
await userApi.login({ email, password });
await userApi.signUp({ email, password, nickname });
await userApi.getMyInfo();

// 게시글
const boards = await boardApi.getBoards(1, 10);
const board = await boardApi.getBoard(1);
await boardApi.createBoard({ title, content });
await boardApi.updateBoard(1, { title: '수정' });
await boardApi.deleteBoard(1);
```

---

## 🧪 테스트

### 테스트 실행

```bash
# 전체 테스트
npm run test

# UI 모드 (실시간 감시)
npm run test:ui

# 커버리지 리포트
npm run test:coverage
```

### 테스트 현황

| 파일 | 테스트 수 | 설명 |
|------|----------|------|
| `useForm.test.ts` | 20 개 | 폼 값 변경, Zod 검증, 에러 처리 |
| `Button.test.tsx` | 10 개 | 렌더링, 클릭, variant 상태 |
| `Input.test.tsx` | 18 개 | 입력, 라벨, 에러 표시 |
| `Textarea.test.tsx` | 20 개 | 입력, 라벨, 에러 표시 |
| `Toast.test.tsx` | 4 개 | 토스트 표시, 타입별 스타일 |
| `useAuth.test.ts` | 8 개 | 인증 훅 동작 |
| `authStore.test.ts` | 5 개 | Zustand 스토어 상태 |
| `api.test.ts` | 2 개 | Axios 설정 |
| **Total** | **87 개** | - |

### 테스트 작성 가이드

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('클릭 시 onClick 이 호출되어야 합니다', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭</Button>);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook 테스트

```typescript
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';

describe('useForm', () => {
  it('입력 값이 변경되어야 합니다', async () => {
    const { result } = renderHook(() => useForm({ email: '' }));

    await act(async () => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe('test@example.com');
  });
});
```

---

## 🎨 스타일링

### TailwindCSS

TailwindCSS 4.x 를 사용하여 스타일링합니다.

```tsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">제목</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    버튼
  </button>
</div>
```

### CSS 변수 (테마)

```css
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-border: #e0e0e0;
}

.dark {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2d2d2d;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0a0;
  --color-border: #404040;
}
```

---

## 📦 프로덕션 빌드

```bash
# 빌드
npm run build

# dist 폴더 확인
ls dist/

# 서버에서 제공 (예: Nginx)
# dist/ 폴더를 웹 서버 루트로 설정
```

### Docker 배포 예시

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 🔧 설정 파일

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

---

## 🐛 디버깅

### React DevTools

크롬 확장프로그램 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) 를 설치하세요.

### 에러 바운더리

```tsx
import { ErrorBoundary } from './components';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 로깅

개발 환경에서는 콘솔 로그가 표시됩니다.  
프로덕션 환경에서는 에러 모니터링 도구 (Sentry 등) 연동을 권장합니다.

---

## 🤝 기여하기

1. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
2. 테스트 작성 (기존 테스트 깨지지 않도록)
3. 커밋 (`git commit -m 'feat: Add AmazingFeature'`)
4. 푸시 및 PR 생성

---

## 📄 라이선스

MIT License

---

<p align="center">Made with ⚛️ and ❤️ by Fantastic Guacamole Team</p>
