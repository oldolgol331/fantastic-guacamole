# 🥑 Fantastic Guacamole

> **풀스택 웹 애플리케이션 프로젝트** - React + Node.js 기반의 커뮤니티 플랫폼

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1.9-6e9f18?logo=vitest)](https://vitest.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2d3748?logo=prisma)](https://www.prisma.io/)

---

## 📋 프로젝트 개요

Fantastic Guacamole 은 **React + Node.js + TypeScript** 풀스택 기술 스택으로 구축된 커뮤니티 플랫폼입니다.  
사용자 인증, 게시글 작성/조회/수정/삭제, 댓글 관리 등의 기본 기능을 포함하며, **테스트 주도 개발 (TDD)** 환경에서 개발되었습니다.

### ✨ 주요 기능

- 🔐 **사용자 인증**: 회원가입, 로그인, JWT 기반 인증
- 📝 **게시글 관리**: CRUD operations, 페이지네이션, 검색/필터링
- 💬 **댓글 시스템**: 실시간 댓글 작성/수정/삭제
- 🎨 **모던 UI**: TailwindCSS 기반 반응형 디자인
- 🧪 **테스트 환경**: Vitest 기반 141 개 테스트 케이스

---

## 🏗️ 아키텍처

```
fantastic-guacamole/
├── backend/          # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── dto/
│   │   └── middleware/
│   └── prisma/
├── frontend/         # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── stores/
│   └── public/
└── README.md
```

---

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 20.x 이상
- npm 또는 pnpm

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/fantastic-guacamole.git
cd fantastic-guacamole

# 2. 백엔드 설치 및 실행
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev

# 3. 프론트엔드 설치 및 실행 (새 터미널)
cd frontend
npm install
npm run dev
```

### 접속 URL

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

---

## 📚 기술 스택

### Backend

| 카테고리 | 기술 |
|----------|------|
| **Runtime** | Node.js 20.x |
| **Framework** | Express 5.x |
| **Language** | TypeScript 5.9 |
| **ORM** | Prisma 6.x (SQLite) |
| **Validation** | Zod |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Testing** | Vitest |

### Frontend

| 카테고리 | 기술 |
|----------|------|
| **Framework** | React 19 |
| **Build Tool** | Vite 7.x |
| **Language** | TypeScript 5.9 |
| **Styling** | TailwindCSS 4.x |
| **State Management** | Zustand (Client), TanStack Query (Server) |
| **Routing** | React Router 7.x |
| **HTTP Client** | Axios |
| **Validation** | Zod |
| **Testing** | Vitest + Testing Library |

---

## 🧪 테스트

### 전체 테스트 실행

```bash
# 백엔드 테스트
cd backend
npm run test

# 프론트엔드 테스트
cd frontend
npm run test

# 커버리지 리포트
npm run test:coverage
```

### 테스트 현황

| 영역 | 테스트 수 | 파일 수 |
|------|----------|---------|
| **Backend** | 54 개 | 3 개 |
| **Frontend** | 87 개 | 8 개 |
| **Total** | **141 개** | **11 개** |

---

## 📖 API 문서

### 주요 엔드포인트

#### Authentication
```http
POST   /api/users/signup      # 회원가입
POST   /api/users/login       # 로그인
GET    /api/users/me          # 내 정보 조회
PATCH  /api/users/me          # 내 정보 수정
DELETE /api/users/me          # 회원탈퇴
```

#### Boards
```http
GET    /api/boards            # 게시글 목록
GET    /api/boards/:id        # 게시글 상세
POST   /api/boards            # 게시글 생성 (인증 필요)
PATCH  /api/boards/:id        # 게시글 수정 (인증 필요)
DELETE /api/boards/:id        # 게시글 삭제 (인증 필요)
```

#### Replies
```http
GET    /api/replies/:boardId  # 댓글 목록
POST   /api/replies           # 댓글 생성 (인증 필요)
PATCH  /api/replies/:id       # 댓글 수정 (인증 필요)
DELETE /api/replies/:id       # 댓글 삭제 (인증 필요)
```

자세한 API 명세는 [backend/README.md](./backend/README.md) 를 참조하세요.

---

## 🔧 환경 변수 설정

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=86400000
```

### Frontend

Vite 프록시 설정으로 개발 환경에서는 별도 설정이 필요하지 않습니다.  
프로덕션 빌드시 `VITE_API_URL` 환경 변수를 설정하세요.

---

## 📁 프로젝트 구조 상세

### Backend

```
backend/
├── src/
│   ├── controller/      # HTTP 요청 처리 및 응답
│   ├── service/         # 비즈니스 로직 및 테스트
│   ├── repository/      # Prisma 데이터베이스 접근
│   ├── dto/             # Zod 기반 데이터 검증 스키마
│   ├── middleware/      # 인증, 에러처리, Rate Limiting
│   ├── config/          # CORS 등 설정
│   ├── types/           # TypeScript 타입 정의
│   └── utils/           # 유틸리티 함수
├── prisma/
│   └── schema.prisma    # 데이터베이스 스키마
└── vitest.config.ts     # 테스트 설정
```

### Frontend

```
frontend/
├── src/
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   ├── hooks/           # 커스텀 React Hooks
│   ├── services/        # API 통신 계층
│   ├── stores/          # Zustand 상태 관리
│   ├── types/           # TypeScript 타입 정의
│   ├── utils/           # 유틸리티 함수
│   └── test/            # 테스트 설정
├── public/              # 정적 자산
└── vitest.config.ts     # 테스트 설정
```

---

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 컨벤션

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `docs`: 문서 수정
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 설정, 패키지 매니저 등 설정 관련 수정

---

## 📄 라이선스

MIT License - [LICENSE](LICENSE) 파일을 참조하세요.

---

## 👥 작성자

- **Your Name** - [@your-username](https://github.com/your-username)

---

## 📞 연락처

- Project Link: [https://github.com/your-username/fantastic-guacamole](https://github.com/your-username/fantastic-guacamole)

---

<p align="center">Made with 🥑 and ❤️</p>
