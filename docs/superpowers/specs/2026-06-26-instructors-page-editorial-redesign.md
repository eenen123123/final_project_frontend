# 강사 목록 페이지 — 에디토리얼 리디자인 설계

날짜: 2026-06-26
대상 파일: `src/pages/Instructor/InstructorsPage.tsx` (전면 재작성)

## 배경 / 문제

현재 강사 목록 페이지는 **좌측 과목 사이드바**(과목 아코디언 + 강사 이름 나열)와 **상단 과목 탭 바**가
동일한 과목 필터 기능을 중복 제공한다. 모바일에서는 사이드바가 위로 쌓여 같은 정보가 여러 번 반복된다.
또한 카드 정보가 빈약하고(이름 + "OO 강사") 빈 공간이 많아 밋밋하다.

## 목표

- 사이드바를 제거하고 상단 탭 필터 하나로 과목 탐색을 일원화한다.
- "1타 강사 라인업" 정서를 살린 **에디토리얼 비주얼 리디자인**.
- 사진 없는 강사가 많은 제약을 전제로, **모노그램 아바타 + 과목 컬러**를 주역으로 삼는다.
- 모바일 반응형을 처음부터 고려한다.

## 제약 (데이터)

`GET /api/instructors` 가 반환하는 리스트 항목 필드는 4개뿐:
`userName`, `subjectClNm`, `subjectClId`, `instrUuid`, `instrProfileImg`(nullable).
대부분의 강사가 `instrProfileImg = null` → 사진 의존 디자인 금지.

## 컨셉

잡지/로스터처럼. 장식 대신 **타이포 + 과목 컬러**로 표현. 화려함은 한 곳(시그니처)에만 집중.

### 시그니처

**선택된 과목의 악센트 컬러가 페이지 전체를 물들인다.** 영문 이브로우 라벨, 탭 활성 언더라인,
섹션 구분선, 모노그램 아바타 타일이 모두 활성 과목의 색을 따라간다. 탭을 바꾸면 페이지 톤이 바뀐다.
그 외 요소는 전부 중립(흰/zinc)으로 조용히 둔다.

## 디자인 토큰

### 과목 악센트 컬러

| 과목 | hex | Tailwind 근사 |
|---|---|---|
| 국어 | `#4F46E5` | indigo-600 |
| 수학 | `#059669` | emerald-600 |
| 영어 | `#E11D48` | rose-600 |
| 사회탐구 | `#D97706` | amber-600 |
| 과학탐구 | `#0891B2` | cyan-600 |

- 과목명(`subjectClNm`) → 컬러 매핑은 페이지 내 상수 객체로 둔다.
- 매핑에 없는 과목명은 중립 fallback(`#3F3F46` zinc-700)을 사용한다.
- 영문 이브로우 라벨 매핑: 국어→`KOREAN`, 수학→`MATH`, 영어→`ENGLISH`, 사회탐구→`SOCIAL`, 과학탐구→`SCIENCE`. 미매핑 시 라벨 생략.

### 타이포

신규 폰트 2종 추가 (Google Fonts `<link>`, 이 페이지에 스코프):

- **Black Han Sans** — 큰 페이지 제목 + 섹션 헤더 전용. 카드 이름에는 쓰지 않음.
- **Space Mono** — 영문 이브로우/과목 라벨 전용.
- 카드 강사 이름: 기존 **Noto Sans KR `font-black`** + `tracking-tight`.
- 본문/메타: Noto Sans KR.

`src/index.css` `@theme` 에 토큰 추가:
- `--font-display: "Black Han Sans", sans-serif;`
- `--font-mono-editorial: "Space Mono", ui-monospace, monospace;`

`index.html` 에 Google Fonts `<link>` 추가 (Black Han Sans, Space Mono).

## 레이아웃

페이지 배경: `bg-white` (또는 매우 옅은 `bg-zinc-50`).
컨테이너: `max-w-6xl mx-auto px-4 md:px-6`.

1. **헤더 블록** (그라데이션 히어로 없음)
   - 이브로우: `HERMES · LINEUP` (Space Mono, 활성 과목 악센트색, 대문자, 넓은 자간, 작게)
   - 제목: `강사진` (Black Han Sans, 크게 — `text-4xl md:text-5xl`)
   - 서브카피: 한 줄 (Noto Sans KR, zinc-500)

2. **탭 필터 바** (sticky 아님, 단순)
   - pill 박스 ❌ → 텍스트 탭 + 활성 **하단 언더라인**(활성 과목 악센트색, 2px)
   - 비활성: zinc-400, hover 시 zinc-900
   - 모바일: 가로 스크롤 (`overflow-x-auto scrollbar-none`), 탭 간 충분한 패딩

3. **섹션 헤더**
   - 얇은 악센트 컬러 가로 구분선 + `{과목} 라인업` (Black Han Sans, `text-2xl`)
   - 서브 라인: `{N}명의 강사` 정도의 메타 (선택)

4. **강사 카드 그리드**
   - `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
   - 카드:
     - 상단: **모노그램 타일** — 과목 악센트 배경색 + 흰색 이니셜(이름 첫 글자), 정사각 큰 사이즈.
       `instrProfileImg` 있으면 사진으로 대체(`object-cover`).
     - 이름: Noto Sans KR `font-black`, `text-xl`, zinc-900
     - 그 아래 영문 과목 라벨: Space Mono, 악센트색, 작게
     - hover: 카드 살짝 떠오름(`-translate-y-0.5` + `shadow`), 이름에 악센트 언더라인
     - 카드 전체 클릭 → `navigate('/instructor/' + instrUuid)` (기존 라우트 유지)
     - 키보드 포커스 가능(`role`/`tabIndex` 또는 button/anchor), 포커스 링 표시

## 상태 처리

- **로딩**: 스켈레톤 카드 그리드(`animate-pulse`, 기존 CourseListPage 패턴 참고).
- **에러**: 중앙 메시지 "강사 목록을 불러오지 못했습니다." (기존 문구 유지).
- **빈 상태**: 선택 과목에 강사 없을 때 "해당 과목의 강사가 없습니다."

## 데이터 흐름 (단순화)

현재: 마운트 시 전체 조회 + 탭 변경마다 `?subjClId=` 재요청(2개 useEffect).

변경: **마운트 호출이 이미 전체 강사를 반환**하므로 한 번만 받아 보관하고,
과목 탭 전환은 **클라이언트 사이드 필터링**으로 처리한다.

- 단일 `useEffect`로 `GET /api/instructors` 1회 호출 → 전체 instructors 보관.
- 전체에서 `subjectClId` 기준 unique 과목 목록 도출 → 탭 구성, 첫 과목 기본 선택.
- 화면 표시 목록 = `instructors.filter(i => i.subjectClId === selectedSubject)`.
- 탭 전환 시 재요청/로딩 깜빡임 없음. 두 번째 useEffect, AbortController 제거.

## 반응형

- 탭: 모바일 가로 스크롤.
- 헤더 제목 크기 단계 축소(`text-4xl md:text-5xl`).
- 카드 그리드 1→2→3 열.
- 터치 타깃: 탭/카드 충분한 패딩.

## 품질 기준

- 모바일까지 반응형.
- 키보드 포커스 가시화.
- `prefers-reduced-motion` 존중(hover 트랜지션 최소).
- 영문 텍스트 12px 이상 (DESIGN.md 준수).

## 범위 밖 (하지 않음)

- 헤더/푸터 등 전역 레이아웃 변경.
- 앱 전역 폰트(Noto Sans KR) 교체.
- 강사 상세 페이지(`InstructorDetailPage`) 변경.
- 신규 API/백엔드 변경.
