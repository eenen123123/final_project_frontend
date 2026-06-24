#!/usr/bin/env bash
# 프론트(React) repo 의 빌드·기동 스크립트.
# 상위 ~/hermes/deploy.sh 가 이 파일을 호출.
set -euo pipefail
cd "$(dirname "$0")"

# 1) 최신 코드 반영
git pull --ff-only

# 2) 빌드 + 기동
DOCKER_BUILDKIT=1 docker compose up -d --build

# 3) dangling 이미지 정리
docker image prune -f

echo "[deploy] frontend 배포 완료 (web:80)"
