# syntax=docker/dockerfile:1

# ---- build stage : bun 으로 Vite 빌드 → dist 생성 ----
FROM oven/bun:1 AS build
WORKDIR /app
# 의존성 레이어 캐시: lockfile 먼저 복사 후 설치
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# 배포 이미지에서는 타입체크(tsc -b) 건너뛰고 vite 번들만 수행
RUN bunx vite build

# ---- runtime stage : nginx 정적 서빙 ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
