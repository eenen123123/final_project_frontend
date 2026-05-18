# Final Project - Frontend

React, TypeScript, Vite 기반의 프론트엔드 프로젝트입니다.

## 1. 프로젝트 실행 방법

```bash
# 의존성 설치
# bun이 설치되어 있지 않다면 npm install -g bun 명령어로 먼저 설치
bun install

# 개발 서버 실행
bun dev
```

## 2. 접근 주소

```text
http://localhost:9001
```

## 3. Backend API

백엔드 Spring REST API 서버가 함께 실행되어야 정상적으로 동작합니다.

- 기본 API 서버: `http://localhost:8081`
- 인증 API: `/api/auth/*`
- 파일 업로드 테스트 API: `/api/storage/*`

## 4. 프로젝트 구조

```text
.
├── index.html                  # Vite 진입 HTML
├── public/                     # 정적 리소스
│   ├── favicon.png
│   ├── favicon.svg
│   ├── icons.svg
│   └── *.png                   # 팀원 이미지 등 공개 이미지
├── src/
│   ├── api/                    # API 공통 설정
│   │   └── api.ts
│   ├── auth/                   # 인증 상태 및 보호 라우트
│   │   ├── AuthContext.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ProtectedRouteAdmin.tsx
│   │   └── test/
│   ├── components/             # 공통 UI 컴포넌트
│   │   ├── Badge/
│   │   ├── Header.tsx
│   │   └── TipTapEditor.tsx
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── Admin/
│   │   │   └── AdminPage.tsx
│   │   ├── User/
│   │   │   ├── Login.tsx
│   │   │   ├── MyPage.tsx
│   │   │   └── SignUp.tsx
│   │   ├── test/               # 테스트 페이지
│   │   │   ├── FileUploadTest.tsx
│   │   │   └── TestPage.tsx
│   │   └── Home.tsx
│   ├── theme/                  # 디자인 토큰
│   │   └── token.ts
│   ├── App.tsx                 # 공통 레이아웃 및 라우팅 연결
│   ├── AppRoute.tsx            # 라우팅 설정
│   ├── index.css               # 전역 스타일
│   └── main.tsx                # React 앱 진입점
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 5. 기술 스택

| 구분            | 사용 기술        |
| --------------- | ---------------- |
| Framework       | React 19         |
| Language        | TypeScript       |
| Build Tool      | Vite             |
| Package Manager | Bun              |
| Routing         | React Router DOM |
| API Client      | Axios            |
| Styling         | Tailwind CSS     |
| Editor          | TipTap           |
| Lint            | ESLint           |

## 6. Vite Proxy 설정

개발 서버는 `vite.config.ts`에서 프록시를 설정합니다.

| 요청 경로      | 대상 서버                    | 용도               |
| -------------- | ---------------------------- | ------------------ |
| `/api`         | `http://localhost:8081`      | 백엔드 API         |
| `/api/storage` | `https://paste.maerchen.dev` | 파일 업로드 테스트 |

```ts
server: {
  proxy: {
    "/api/storage": {
      target: "https://paste.maerchen.dev",
      changeOrigin: true,
    },
    "/api": {
      target: "http://localhost:8081",
      changeOrigin: true,
    },
  },
}
```

프록시를 사용하려면 API 요청 주소를 `/api/...`처럼 상대 경로로 작성합니다.

## 7. Auth 관련 가이드

### 7-1. AuthContext

`src/auth/AuthContext.tsx`는 로그인 상태를 전역으로 관리합니다.

- Access Token을 메모리에 저장
- 앱 진입 시 refresh API로 세션 복구 시도
- `login(accessToken)`으로 로그인 상태 저장
- `logout()`으로 토큰 제거 및 로그아웃 API 호출
- JWT payload에서 사용자 아이디, 이름, 권한 조회

사용 예시:

```tsx
import { useAuth } from "../auth/AuthContext";

const { isAuthenticated, getUserName, logout } = useAuth();
```

### 7-2. ProtectedRoute

`src/auth/ProtectedRoute.tsx`는 로그인한 사용자만 접근할 수 있는 라우트에 사용합니다.

```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/mypage" element={<MyPage />} />
</Route>
```

인증되지 않은 사용자는 `/login`으로 이동합니다.

### 7-3. ProtectedRouteAdmin

`src/auth/ProtectedRouteAdmin.tsx`는 관리자 권한이 필요한 라우트에 사용합니다.

```tsx
<Route element={<ProtectedRouteAdmin />}>
  <Route path="/admin" element={<AdminPage />} />
</Route>
```

`getRole()` 값이 `ROLE_ADMIN`이 아닌 사용자는 접근할 수 없습니다.

## 8. 주요 라우트

| 경로           | 페이지               | 설명                            |
| -------------- | -------------------- | ------------------------------- |
| `/`            | `Home.tsx`           | 메인 페이지                     |
| `/login`       | `Login.tsx`          | 로그인 페이지                   |
| `/signup`      | `SignUp.tsx`         | 회원가입 페이지                 |
| `/mypage`      | `MyPage.tsx`         | 마이페이지, 로그인 필요         |
| `/admin`       | `AdminPage.tsx`      | 관리자 페이지, 관리자 권한 필요 |
| `/test/editor` | `TestPage.tsx`       | 에디터 테스트 페이지            |
| `/test/upload` | `FileUploadTest.tsx` | 파일 업로드 테스트 페이지       |
