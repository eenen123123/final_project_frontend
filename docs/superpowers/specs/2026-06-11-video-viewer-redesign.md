# HermesVideoViewer 리디자인 스펙

**날짜**: 2026-06-11  
**파일**: `src/components/viewer/HermesVideoViewer.tsx`  
**라우트**: `/viewer?courseId={id}&lectureId={id}`

---

## 목표

현재 강의 이름 텍스트 + 기본 HTML5 `<video>` 태그만 있는 뷰어를,  
Inflearn/패스트캠퍼스 스타일의 2-column 학습 플랫폼 UI로 개선한다.

---

## 레이아웃

**2-column**, 전체 높이 페이지:

- **좌측 (65%)**: 영상 영역
- **우측 (35%)**: 강의 목록 사이드바

---

## 좌측 — 영상 영역

1. **브레드크럼** (상단): `강의실 / {코스명} / {현재 강의명}`  
   코스명은 강의 목록 API 응답에서 가져옴. API에 코스명 필드 없으면 브레드크럼에서 생략하고 강의명만 표시.
2. **`<video>` 플레이어**: 전체 너비, 16:9 비율, `controls` 속성 유지, `rounded-lg`
3. **강의 정보 카드** (영상 아래):
   - 강의 제목 (bold)
   - 수강 상태 뱃지: `수강 중` (파란색) — 추후 완료 상태로 전환 가능하도록 설계
   - 강사명 / 코스명 (서브텍스트)

---

## 우측 — 강의 목록 사이드바

**데이터**: 코스 전체 강의 목록 (`GET /api/courses/{courseId}/lectures` — 존재 여부 확인 필요)  
응답 예상 필드: `lectureId`, `lectureNm`, `lectureDuration` (없을 경우 시간 미표시)  
**현재 강의**: `lectureId` 쿼리 파라미터로 구분

### 각 아이템 표시 규칙

| 상태 | 아이콘 | 스타일 |
|------|--------|--------|
| 완료 | 초록 원 + ✓ | 텍스트 line-through, 흐리게 |
| 수강 중 (현재) | 파란 원 + 흰 점 | 파란 배경 카드, 굵은 텍스트 |
| 미완료 | 빈 원 (테두리만) | 기본 텍스트 |

**완료 상태 API는 아직 없음** → 현재는 모든 강의를 "미완료"로 표시하고, 현재 강의만 "수강 중"으로 표시. API 연결 시 상태 판단 로직만 교체하면 되도록 `getLectureStatus(lectureId)` 함수로 분리.

### 하단 진도 바

- `전체 진도: N%` 텍스트 + 파란 progress bar
- 완료 상태 API 없을 동안은 `0%` 고정

### 강의 클릭 시 동작

- 같은 페이지에서 URL 쿼리 파라미터 변경 (`lectureId` 교체)
- `useNavigate` + `replace: false` 로 히스토리 유지

---

## 색상 / 스타일

기존 교실 페이지(`ClassroomPage`)와 통일:

- 배경: `bg-[#F8FAFC]`
- 카드: `bg-white border border-slate-200 rounded-xl`
- 액센트: `blue-600` / `blue-700`
- 텍스트: `slate-900` / `slate-500` / `slate-400`
- 완료 상태: `green-500`

---

## API

| 용도 | 엔드포인트 | 비고 |
|------|-----------|------|
| 코스 + 강의 목록 | `GET /api/course/{courseId}` | `{ course, lectures[] }` 반환 |
| 영상 재생 URL | `POST /api/files/{lectureVideoFileId}/token` | 기존 그대로 |
| 수강 완료 상태 | 미정 | **추후 구현** |

### 응답 필드 (확인 완료)

**`course`**: `courseSn`, `courseName`, `instructorName`  
**`lectures[]`**: `lectureSn`, `lectureName`, `lectureDuration`(초 단위), `lectureVideoFileId`

기존 `GET /api/lecture/info` 호출은 **삭제** — `GET /api/course/{courseId}` 하나로 대체.

---

## 구현 범위 (이번 작업)

- [x] 2-column 레이아웃 구조
- [x] 강의 정보 카드 (브레드크럼, 제목, 상태 뱃지)
- [x] 강의 목록 사이드바 (목록 API 호출, 클릭 시 강의 전환)
- [x] 완료 상태 플레이스홀더 (전부 미완료 고정, 함수 분리)
- [x] 전체 진도 바 (0% 고정)
- [ ] 완료 상태 API 연결 — **별도 작업**

---

## 반응형 / 모바일

### 브레이크포인트

| 환경 | 기준 | 레이아웃 |
| ---- | ---- | ------- |
| 데스크탑 | `≥1024px` | 2-column (65% 영상 + 35% 사이드바) |
| 태블릿 가로 | `768px–1023px` | 2-column 그대로 |
| 태블릿 세로 / 모바일 | `<768px` | 단일 컬럼 + 하단 드로어 |

### 모바일 레이아웃 (`< 768px`)

1. 영상 전체 너비
2. 영상 아래: 강의 제목 + 강사명 + 이전/다음 버튼
3. 우측 상단 `☰ 목록` 버튼 → 탭으로 강의 목록 드로어 열림
4. **드로어**: 화면 하단에서 슬라이드업, 강의 목록 표시, 외부 탭 or 드래그로 닫힘
5. Tailwind `md:grid md:grid-cols-[65fr_35fr]` 로 분기

### 데스크탑에서 뷰어 진입

- `LectureTab`(강의실 페이지) 에서 "강의 보기" 버튼 클릭 시 `window.open('/viewer?courseId=X&lectureId=Y', '_blank')` 으로 새 탭 오픈

---

## 변경 파일

- `src/components/viewer/HermesVideoViewer.tsx` — 전면 재작성
- `src/pages/Classroom/components/ClassroomTabs.tsx` — LectureTab에 "강의 보기" 버튼 추가
