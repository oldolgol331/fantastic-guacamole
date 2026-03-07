# 🚀 Fantastic Guacamole - Backend

> Node.js + Express + Prisma 기반의 RESTful API 서버

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2d3748?logo=prisma)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1.9-6e9f18?logo=vitest)](https://vitest.dev/)

---

## 📋 개요

백엔드 서버는 **Express 5.x**와 **Prisma ORM**을 사용하여 구축된 RESTful API 입니다.  
SQLite 데이터베이스를 사용하며, JWT 기반 인증과 Zod 를 통한 데이터 검증을 구현했습니다.

### ✨ 주요 기능

- 🔐 **JWT 인증**: Bearer 토큰 기반 인증 시스템
- 📝 **게시글 CRUD**: 페이지네이션, 검색, 필터링 지원
- 💬 **댓글 시스템**: 계층적 댓글 관리
- 🛡️ **보안**: Rate Limiting, CORS, 입력 검증
- 🧪 **테스트**: Vitest 기반 54 개 테스트 케이스

---

## 🏗️ 아키텍처

```
src/
├── controller/      # HTTP 요청 처리 (Router)
│   ├── user.controller.ts
│   ├── board.controller.ts
│   ├── reply.controller.ts
│   └── health.controller.ts
├── service/         # 비즈니스 로직 및 테스트
│   ├── user.service.ts + test
│   ├── board.service.ts + test
│   └── reply.service.ts + test
├── repository/      # Prisma 데이터베이스 접근
│   └── prisma.client.ts
├── dto/             # Zod 기반 데이터 검증 스키마
│   ├── user.dto.ts
│   ├── board.dto.ts
│   └── reply.dto.ts
├── middleware/      # 인증, 에러처리, Rate Limiting
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── rateLimit.middleware.ts
├── config/          # CORS 등 설정
│   └── cors.config.ts
├── types/           # TypeScript 타입 정의
│   └── express.d.ts
└── utils/           # 유틸리티 함수
    └── validation.ts
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

# 2. Prisma 스키마 생성
npm run prisma:generate

# 3. 데이터베이스 마이그레이션
npm run prisma:migrate

# 4. 환경 변수 설정 (.env 파일 생성)
cp .env.example .env
```

### 환경 변수 (.env)

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=86400000
```

### 실행 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm run start

# 테스트 실행
npm run test

# 테스트 커버리지
npm run test:coverage

# Prisma Studio (DB GUI)
npm run prisma:studio
```

---

## 📖 API 명세

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Authentication

#### 회원가입

```http
POST /api/users/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "nickname": "사용자"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "사용자",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "modifiedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 로그인

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400000,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "nickname": "사용자"
    }
  }
}
```

#### 내 정보 조회

```http
GET /api/users/me
Authorization: Bearer {accessToken}
```

#### 내 정보 수정

```http
PATCH /api/users/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nickname": "수정된닉네임",
  "newPassword": "NewPassword123!",
  "confirmNewPassword": "NewPassword123!"
}
```

#### 회원탈퇴

```http
DELETE /api/users/me
Authorization: Bearer {accessToken}
```

---

### Boards

#### 게시글 목록 조회

```http
GET /api/boards?page=1&pageSize=10&search=검색어&sortBy=createdAt&order=desc
```

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | 1 | 페이지 번호 |
| `pageSize` | number | 10 | 페이지당 항목 수 (최대 100) |
| `search` | string | - | 검색어 (제목, 내용, 작성자) |
| `sortBy` | string | createdAt | 정렬 기준 (`createdAt`, `views`, `replies`) |
| `order` | string | desc | 정렬 순서 (`asc`, `desc`) |

**Response:**
```json
{
  "success": true,
  "data": {
    "boards": [
      {
        "id": 1,
        "title": "게시글 제목",
        "authorNickname": "작성자",
        "views": 100,
        "replyCount": 5,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "totalCount": 100,
      "totalPages": 10
    }
  }
}
```

#### 게시글 상세 조회

```http
GET /api/boards/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "게시글 제목",
    "content": "게시글 내용",
    "views": 101,
    "author": {
      "id": 1,
      "nickname": "작성자"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "modifiedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 게시글 생성

```http
POST /api/boards
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "새 게시글",
  "content": "내용입니다."
}
```

#### 게시글 수정

```http
PATCH /api/boards/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

#### 게시글 삭제

```http
DELETE /api/boards/:id
Authorization: Bearer {accessToken}
```

---

### Replies

#### 댓글 목록 조회

```http
GET /api/replies/:boardId?page=1&pageSize=10
```

#### 댓글 생성

```http
POST /api/replies
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "boardId": 1,
  "content": "댓글 내용"
}
```

#### 댓글 수정

```http
PATCH /api/replies/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "수정된 댓글"
}
```

#### 댓글 삭제

```http
DELETE /api/replies/:id
Authorization: Bearer {accessToken}
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
| `user.service.test.ts` | 16 개 | 회원가입, 로그인, 정보수정, 에러케이스 |
| `board.service.test.ts` | 21 개 | 게시글 CRUD, 권한, 페이지네이션 |
| `reply.service.test.ts` | 17 개 | 댓글 CRUD, 권한, 페이지네이션 |
| **Total** | **54 개** | - |

### 테스트 작성 가이드

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { UserService } from './user.service.js';
import { prisma } from '../repository/prisma.client.js';

describe('UserService', () => {
  const userService = new UserService();

  beforeAll(async () => {
    // 테스트 전 데이터 정리
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // 테스트 후 정리
    await prisma.$disconnect();
  });

  it('테스트 케이스 설명', async () => {
    const result = await userService.someMethod();
    expect(result).toBeDefined();
  });
});
```

---

## 📦 Prisma 데이터베이스

### 스키마

```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
  nickname String
  boards   Board[]
  replies  Reply[]
}

model Board {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  views     Int      @default(0)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  replies   Reply[]
}

model Reply {
  id       Int      @id @default(autoincrement())
  content  String
  authorId Int
  author   User     @relation(fields: [authorId], references: [id])
  boardId  Int
  board    Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
}
```

### 주요 Prisma 명령어

```bash
# 스키마 변경 후 마이그레이션
npm run prisma:migrate

# Prisma Client 재생성
npm run prisma:generate

# 데이터베이스 초기화
npm run prisma:reset

# GUI 로 데이터베이스 조회
npm run prisma:studio
```

---

## 🔒 보안

### Rate Limiting

- `/api`: 전체 API 제한
- `/api/users`: 인증 관련 더 엄격한 제한

### JWT 인증

- `Authorization: Bearer {token}` 헤더 필수
- 만료 시 401 에러 및 자동 로그아웃 처리

### 입력 검증

- Zod 스키마를 통한 서버サイド 검증
- SQL Injection 방지 (Prisma ORM)

---

## 🛠️ 기술적 결정

| 결정 | 이유 |
|------|------|
| **Express 5.x** | 경량, 유연한 미들웨어 아키텍처 |
| **Prisma** | 타입 안전성, 자동 완성, 마이그레이션 도구 |
| **SQLite** | 개발 환경 간편함, 파일 기반 DB |
| **Zod** | 런타임 타입 검증, 스키마 기반 검증 |
| **Vitest** | 빠른 실행 속도, Jest 호환 API |

---

## 📝 디버깅

### 로그 확인

개발 환경에서는 Prisma 쿼리 로그가 출력됩니다:

```typescript
// src/repository/prisma.client.ts
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});
```

### 일반적인 에러

**1. JWT_SECRET 환경 변수 없음**
```
Error: JWT_SECRET 환경 변수가 설정되지 않았습니다.
→ .env 파일에 JWT_SECRET 추가
```

**2. 데이터베이스 잠김**
```
Error: database is locked
→ prisma:reset 또는 dev.db 파일 삭제 후 재생성
```

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

<p align="center">Made with ❤️ by Fantastic Guacamole Team</p>
