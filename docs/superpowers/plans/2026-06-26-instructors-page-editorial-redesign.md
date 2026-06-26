# 강사 목록 페이지 에디토리얼 리디자인 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 강사 목록 페이지를 에디토리얼 스타일로 전면 재작성 — 사이드바 제거, 과목 컬러 시스템, Black Han Sans + Space Mono 타이포, 클라이언트 사이드 필터링으로 단순화.

**Architecture:** `index.html`에 Google Fonts 추가 → `src/index.css`에 CSS 토큰 추가 → `InstructorsPage.tsx` 전면 재작성. API는 기존 `GET /api/instructors` 단 1회 호출 후 클라이언트에서 과목별 필터링.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Vite (dev port 9001), axios

## Global Constraints

- 영문 텍스트 폰트 크기 12px 이상 (DESIGN.md)
- 기존 라우트 `/instructor/:uuid` 유지
- `export default` 함수명 `Instructors` 유지 (라우터에서 참조)
- 전역 폰트(`--font-sans: Noto Sans KR`) 변경 금지
- 헤더/푸터/InstructorDetailPage 변경 금지

---

## 파일 맵

| 파일 | 작업 |
|---|---|
| `index.html` | Google Fonts `<link>` 추가 (Black Han Sans, Space Mono) |
| `src/index.css` | `--font-display`, `--font-mono-editorial` CSS 변수 추가 |
| `src/pages/Instructor/InstructorsPage.tsx` | 전면 재작성 |

---

### Task 1: 폰트 설정

**Files:**
- Modify: `index.html` (line 10 이후)
- Modify: `src/index.css` (`@theme` 블록)

**Interfaces:**
- Produces: `--font-display`, `--font-mono-editorial` CSS 변수 (Task 2에서 사용)

- [ ] **Step 1: `index.html`에 Google Fonts 링크 추가**

`index.html`의 기존 Noto Sans KR `<link>` 라인 바로 다음에 추가:

```html
    <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
```

결과 (11번째 라인 이후):

```html
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: `src/index.css` `@theme` 블록에 폰트 변수 추가**

기존 `@theme` 블록:

```css
@theme {
  --font-sans: "Noto Sans KR", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

변경 후:

```css
@theme {
  --font-sans: "Noto Sans KR", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-display: "Black Han Sans", sans-serif;
  --font-mono-editorial: "Space Mono", ui-monospace, monospace;
}
```

- [ ] **Step 3: 개발 서버 시작 후 폰트 로드 확인**

```bash
bun run dev
```

브라우저에서 `http://localhost:9001` 열고 DevTools → Network 탭에서
`Black+Han+Sans`, `Space+Mono` 폰트 파일이 로드되는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add index.html src/index.css
git commit -m "feat: Black Han Sans + Space Mono 폰트 추가"
```

---

### Task 2: InstructorsPage 전면 재작성

**Files:**
- Modify (전면 재작성): `src/pages/Instructor/InstructorsPage.tsx`

**Interfaces:**
- Consumes: `--font-display`, `--font-mono-editorial` (Task 1에서 정의)
- Consumes: `GET /api/instructors` → `InstructorListResponse[]`
- Consumes: `navigate('/instructor/:instrUuid')` (react-router-dom)
- Produces: `export default function Instructors()` (라우터에서 import)

- [ ] **Step 1: `InstructorsPage.tsx` 전면 재작성**

파일 전체를 아래로 교체:

```tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

interface InstructorListResponse {
  subjectClId: number;
  subjectClNm: string;
  instrUuid: string;
  userName: string;
  instrProfileImg: string | null;
}

const SUBJECT_ACCENT: Record<string, string> = {
  국어: "#4F46E5",
  수학: "#059669",
  영어: "#E11D48",
  사회탐구: "#D97706",
  과학탐구: "#0891B2",
};

const SUBJECT_LABEL: Record<string, string> = {
  국어: "KOREAN",
  수학: "MATH",
  영어: "ENGLISH",
  사회탐구: "SOCIAL",
  과학탐구: "SCIENCE",
};

const ACCENT_FALLBACK = "#3F3F46";

function getAccent(subjectName: string): string {
  return SUBJECT_ACCENT[subjectName] ?? ACCENT_FALLBACK;
}

function InstructorCard({
  instr,
  accent,
}: {
  instr: InstructorListResponse;
  accent: string;
}) {
  const navigate = useNavigate();
  const initial = instr.userName.charAt(0);

  return (
    <button
      onClick={() => navigate(`/instructor/${instr.instrUuid}`)}
      className="group text-left w-full bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
    >
      <div className="aspect-4/3 w-full overflow-hidden">
        {instr.instrProfileImg ? (
          <img
            src={instr.instrProfileImg}
            alt={instr.userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: accent }}
          >
            <span className="text-white font-black text-6xl select-none">
              {initial}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p
          className="font-black text-zinc-900 text-xl tracking-tight group-hover:underline"
          style={{ textDecorationColor: accent }}
        >
          {instr.userName}
        </p>
        {SUBJECT_LABEL[instr.subjectClNm] && (
          <p
            className="mt-1 text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-mono-editorial)",
              color: accent,
            }}
          >
            {SUBJECT_LABEL[instr.subjectClNm]}
          </p>
        )}
      </div>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-4/3 bg-zinc-100" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-2/3 bg-zinc-100 rounded" />
        <div className="h-3 w-1/3 bg-zinc-100 rounded" />
      </div>
    </div>
  );
}

export default function Instructors() {
  const [allInstructors, setAllInstructors] = useState<InstructorListResponse[]>([]);
  const [subjects, setSubjects] = useState<
    { subjectClId: number; subjectClNm: string }[]
  >([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get<InstructorListResponse[]>("/api/instructors")
      .then((res) => {
        const data = res.data;
        setAllInstructors(data);
        const unique = Array.from(
          new Map(
            data.map((i) => [
              i.subjectClId,
              { subjectClId: i.subjectClId, subjectClNm: i.subjectClNm },
            ]),
          ).values(),
        );
        setSubjects(unique);
        if (unique.length > 0) setSelectedSubject(unique[0].subjectClId);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const selectedSubjectObj = subjects.find(
    (s) => s.subjectClId === selectedSubject,
  );
  const accent = selectedSubjectObj
    ? getAccent(selectedSubjectObj.subjectClNm)
    : ACCENT_FALLBACK;
  const visibleInstructors = allInstructors.filter(
    (i) => i.subjectClId === selectedSubject,
  );

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-sm text-zinc-500 font-bold">
          강사 목록을 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* 헤더 */}
        <header className="mb-10">
          <p
            className="text-xs tracking-widest uppercase mb-2 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-mono-editorial)",
              color: accent,
            }}
          >
            HERMES · LINEUP
          </p>
          <h1
            className="text-5xl md:text-6xl text-zinc-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            강사진
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            대표 강사진을 확인하고 강좌를 수강하세요.
          </p>
        </header>

        {/* 탭 필터 */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-zinc-200 mb-8 gap-1">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-16 bg-zinc-200 rounded animate-pulse mb-4 shrink-0"
                />
              ))
            : subjects.map((s) => {
                const isActive = s.subjectClId === selectedSubject;
                return (
                  <button
                    key={s.subjectClId}
                    onClick={() => setSelectedSubject(s.subjectClId)}
                    className={`relative pb-3 px-3 text-sm font-bold whitespace-nowrap transition-colors shrink-0 ${
                      isActive ? "" : "text-zinc-400 hover:text-zinc-900"
                    }`}
                    style={isActive ? { color: accent } : undefined}
                  >
                    {s.subjectClNm}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-colors duration-300"
                        style={{ backgroundColor: accent }}
                      />
                    )}
                  </button>
                );
              })}
        </div>

        {/* 섹션 헤더 */}
        {!loading && selectedSubjectObj && (
          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: accent, opacity: 0.25 }}
            />
            <h2
              className="text-2xl text-zinc-900 shrink-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {selectedSubjectObj.subjectClNm} 라인업
            </h2>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: accent, opacity: 0.25 }}
            />
          </div>
        )}

        {/* 카드 그리드 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : visibleInstructors.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-16">
            해당 과목의 강사가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleInstructors.map((instr) => (
              <InstructorCard
                key={instr.instrUuid}
                instr={instr}
                accent={accent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript 컴파일 확인**

```bash
bun run build 2>&1 | tail -20
```

기대 출력: 에러 없이 빌드 성공 (또는 기존에 있던 TS 에러만 존재).

- [ ] **Step 3: 브라우저에서 시각적 확인**

개발 서버가 실행 중이면 `http://localhost:9001/instructors` 열고 확인:

1. 헤더: `HERMES · LINEUP` (Space Mono), `강사진` (Black Han Sans 굵은 디스플레이)
2. 탭: 국어 탭 활성 시 인디고(`#4F46E5`) 언더라인
3. 탭 전환: 수학 선택 → 전체 악센트 에메랄드(`#059669`)로 변경
4. 카드: 사진 없는 강사 → 과목 악센트 배경에 흰 이니셜
5. 모바일(뷰포트 375px): 카드 1열, 탭 가로 스크롤

- [ ] **Step 4: 커밋**

```bash
git add src/pages/Instructor/InstructorsPage.tsx
git commit -m "feat: 강사 목록 페이지 에디토리얼 리디자인"
```
