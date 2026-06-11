# HermesVideoViewer 리디자인 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기본 HTML5 video 뷰어를 2-column 학습 플랫폼 UI (영상 + 강의 목록 사이드바, 모바일 드로어) 로 개선한다.

**Architecture:** `GET /api/course/{courseId}` 한 번으로 코스 정보 + 강의 목록을 받아오고, `POST /api/files/{fileId}/token` 으로 영상 URL을 가져온다. 데스크탑은 Tailwind `md:grid` 2-column, 모바일은 하단 드로어로 강의 목록을 표시한다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, React Router v6, axios (api 인스턴스)

---

## 파일 구조

| 파일 | 작업 |
| ---- | ---- |
| `src/components/viewer/HermesVideoViewer.tsx` | 전면 재작성 |
| `src/pages/Classroom/components/ClassroomTabs.tsx` | `LectureTab`에 courseSn prop 추가 + 강의 목록 표시 |
| `src/pages/Classroom/ClassroomPage.tsx` | `LectureTab`에 `courseSn` 전달 |

---

## Task 1: HermesVideoViewer — 타입 + 데이터 페칭

**Files:**
- Modify: `src/components/viewer/HermesVideoViewer.tsx`

- [ ] **Step 1: 기존 파일 내용을 아래로 교체**

```tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../auth/AuthContext";

interface CourseInfo {
  courseSn: number;
  courseName: string;
  instructorName: string;
}

interface LectureItem {
  lectureSn: number;
  lectureName: string;
  lectureDuration: number | null;
  lectureVideoFileId: number;
}

type LectureStatus = "completed" | "current" | "pending";

function getLectureStatus(lectureSn: number, currentLectureSn: number): LectureStatus {
  if (lectureSn === currentLectureSn) return "current";
  return "pending"; // 완료 API 연결 전 전부 pending
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function HermesVideoViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthReady } = useAuth();

  const courseId = searchParams.get("courseId");
  const lectureId = searchParams.get("lectureId");
  const currentLectureSn = lectureId ? Number(lectureId) : null;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 코스 + 강의 목록 fetch
  useEffect(() => {
    if (!isAuthReady || !courseId) return;
    api.get(`/api/course/${courseId}`)
      .then((res) => {
        setCourse(res.data.course);
        setLectures(res.data.lectures);
      })
      .catch(() => alert("강의 정보를 불러오는 중 오류가 발생했습니다."));
  }, [courseId, isAuthReady]);

  // 현재 강의 영상 URL fetch
  useEffect(() => {
    if (!isAuthReady || !currentLectureSn || lectures.length === 0) return;
    setVideoUrl("");
    const current = lectures.find((l) => l.lectureSn === currentLectureSn);
    if (!current?.lectureVideoFileId) return;
    api.post(`/api/files/${current.lectureVideoFileId}/token`)
      .then((res) => setVideoUrl(res.data.viewUrl))
      .catch((error) => {
        if (error instanceof Error && error.message === "Request failed with status code 403") {
          alert("강의 영상을 볼 수 있는 권한이 없습니다.");
        } else {
          alert("강의 영상을 불러오는 중 오류가 발생했습니다.");
        }
      });
  }, [currentLectureSn, lectures, isAuthReady]);

  const currentLecture = lectures.find((l) => l.lectureSn === currentLectureSn) ?? null;
  const currentIndex = lectures.findIndex((l) => l.lectureSn === currentLectureSn);
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture = currentIndex >= 0 && currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

  const goToLecture = (lectureSn: number) => {
    setDrawerOpen(false);
    navigate(`/viewer?courseId=${courseId}&lectureId=${lectureSn}`);
  };

  return <div>로딩 중...</div>; // Task 2에서 교체
}
```

- [ ] **Step 2: 빌드 확인**

```bash
cd /Users/san02/devm/ddit_final_real/front_final && npm run build 2>&1 | tail -20
```

타입 에러 없으면 정상.

- [ ] **Step 3: 커밋**

```bash
git add src/components/viewer/HermesVideoViewer.tsx
git commit -m "refactor: 뷰어 타입/데이터 페칭 교체 (GET /api/course/{id})"
```

---

## Task 2: HermesVideoViewer — 데스크탑 레이아웃 (2-column)

**Files:**
- Modify: `src/components/viewer/HermesVideoViewer.tsx`

- [ ] **Step 1: `LectureList` 내부 컴포넌트 + 전체 JSX 교체**

`return <div>로딩 중...</div>;` 부분을 포함해 `return` 전체를 아래로 교체.  
`goToLecture` 함수 바로 아래에 `LectureList` 내부 컴포넌트를 먼저 추가:

```tsx
  const LectureList = () => (
    <ul className="flex flex-col gap-1">
      {lectures.map((l) => {
        const status = getLectureStatus(l.lectureSn, currentLectureSn ?? -1);
        return (
          <li key={l.lectureSn}>
            <button
              onClick={() => goToLecture(l.lectureSn)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                ${status === "current" ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50"}`}
            >
              {status === "completed" ? (
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white text-[9px] font-bold">✓</span>
              ) : status === "current" ? (
                <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </span>
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-xs truncate ${
                  status === "current" ? "text-blue-700 font-semibold" :
                  status === "completed" ? "text-slate-400 line-through" :
                  "text-slate-600"
                }`}>
                  {l.lectureName}
                </p>
                {l.lectureDuration && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{formatDuration(l.lectureDuration)}</p>
                )}
              </div>
            </button>
          </li>
        );
      })}
      <li className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex justify-between mb-1">
          <span className="text-[11px] text-slate-500">전체 진도</span>
          <span className="text-[11px] text-blue-600 font-semibold">0%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full">
          <div className="h-full w-0 bg-blue-600 rounded-full" />
        </div>
      </li>
    </ul>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 브레드크럼 */}
      <div className="px-4 md:px-6 py-3 border-b border-slate-200 bg-white text-xs text-slate-400 flex items-center gap-1">
        <span>강의실</span>
        {course && (
          <>
            <span>/</span>
            <span>{course.courseName}</span>
          </>
        )}
        {currentLecture && (
          <>
            <span>/</span>
            <span className="text-blue-600 font-medium">{currentLecture.lectureName}</span>
          </>
        )}
      </div>

      {/* 모바일 목록 버튼 */}
      <div className="md:hidden flex justify-end px-4 pt-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-200"
        >
          ☰ 목록
        </button>
      </div>

      {/* 본문 2-column */}
      <div className="md:grid md:grid-cols-[65fr_35fr] md:h-[calc(100vh-48px)]">
        {/* 좌측: 영상 + 강의 정보 */}
        <div className="p-4 md:p-6 md:overflow-y-auto">
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {videoUrl ? (
              <video controls className="w-full h-full" key={videoUrl}>
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                영상을 불러오는 중...
              </div>
            )}
          </div>

          {currentLecture && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                  {currentLecture.lectureName}
                </h1>
                <span className="flex-shrink-0 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  수강 중
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                {course?.instructorName} · {course?.courseName}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => prevLecture && goToLecture(prevLecture.lectureSn)}
                  disabled={!prevLecture}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg disabled:opacity-40 hover:bg-slate-200 transition-colors"
                >
                  ← 이전 강의
                </button>
                <button
                  onClick={() => nextLecture && goToLecture(nextLecture.lectureSn)}
                  disabled={!nextLecture}
                  className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg disabled:opacity-40 hover:bg-blue-700 transition-colors"
                >
                  다음 강의 →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 우측: 사이드바 (데스크탑) */}
        <div className="hidden md:flex flex-col p-5 border-l border-slate-200 bg-white overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">강의 목록</h2>
          <LectureList />
        </div>
      </div>

      {/* 모바일 드로어 오버레이 */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* 모바일 드로어 */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl transition-transform duration-300 md:hidden max-h-[70vh] flex flex-col
          ${drawerOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide px-4 pb-2 flex-shrink-0">
          강의 목록
        </h2>
        <div className="overflow-y-auto px-4 pb-6">
          <LectureList />
        </div>
      </div>
    </div>
  );
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: 커밋**

```bash
git add src/components/viewer/HermesVideoViewer.tsx
git commit -m "feat: 뷰어 2-column 레이아웃 + 모바일 드로어 구현"
```

---

## Task 3: LectureTab — 강의 목록 + 강의 보기 버튼

**Files:**
- Modify: `src/pages/Classroom/ClassroomPage.tsx`
- Modify: `src/pages/Classroom/components/ClassroomTabs.tsx`

LectureTab이 강의 목록을 받아 "강의 보기" 버튼을 표시한다.  
`ClassroomInfo`에 `courseSn` 필드가 있으므로 ClassroomPage에서 prop으로 내려준다.

- [ ] **Step 1: ClassroomPage.tsx — LectureTab에 courseSn 전달**

`ClassroomPage.tsx`에서 `LectureTab` 렌더링 부분을 찾아 아래로 교체:

```tsx
case "lecture":
  return <LectureTab courseSn={classroom?.courseSn ?? null} />;
```

- [ ] **Step 2: ClassroomTabs.tsx — LectureTab 교체**

`ClassroomTabs.tsx`의 `LectureTab` 함수 전체를 아래로 교체.  
파일 상단에 `import { useEffect, useState } from "react";` 와 `import api from "../../../api/api";` 가 없으면 추가.

```tsx
interface LectureSummary {
  lectureSn: number;
  lectureName: string;
  lectureDuration: number | null;
}

export function LectureTab({ courseSn }: { courseSn: number | null }) {
  const [lectures, setLectures] = useState<LectureSummary[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);

  useEffect(() => {
    if (!courseSn) return;
    api.get(`/api/course/${courseSn}`)
      .then((res) => {
        setCourseId(res.data.course.courseSn);
        setLectures(res.data.lectures);
      })
      .catch(() => {/* 목록 로드 실패는 조용히 처리 */});
  }, [courseSn]);

  if (!courseSn || lectures.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-400 text-center">
        강의 목록이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <ul className="divide-y divide-slate-100">
        {lectures.map((l) => (
          <li key={l.lectureSn} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{l.lectureName}</p>
              {l.lectureDuration && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {Math.floor(l.lectureDuration / 60)}:{String(l.lectureDuration % 60).padStart(2, "0")}
                </p>
              )}
            </div>
            <button
              onClick={() => window.open(`/viewer?courseId=${courseId}&lectureId=${l.lectureSn}`, "_blank")}
              className="ml-3 flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              강의 보기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: 커밋**

```bash
git add src/pages/Classroom/components/ClassroomTabs.tsx src/pages/Classroom/ClassroomPage.tsx
git commit -m "feat: LectureTab 강의 목록 + 강의 보기 버튼 추가"
```

---

## Task 4: 수동 검증

- [ ] **Step 1: 개발 서버 실행**

```bash
npm run dev
```

- [ ] **Step 2: 데스크탑 검증 체크리스트**

브라우저에서 `/viewer?courseId={실제id}&lectureId={실제id}` 접속:

- [ ] 브레드크럼에 코스명 + 강의명 표시
- [ ] 영상 로드 및 재생
- [ ] 우측 사이드바에 강의 목록 표시
- [ ] 현재 강의 파란 하이라이트
- [ ] 다른 강의 클릭 시 영상 전환 (URL lectureId 변경)
- [ ] 이전/다음 버튼 동작 (첫/마지막 강의에서 disabled)

- [ ] **Step 3: 모바일 검증 체크리스트**

브라우저 DevTools → 모바일 뷰(375px 이하):

- [ ] 우측 사이드바 숨겨짐
- [ ] `☰ 목록` 버튼 표시
- [ ] 버튼 클릭 시 하단 드로어 슬라이드업
- [ ] 드로어 외부 탭 시 닫힘
- [ ] 드로어에서 강의 클릭 시 전환 + 드로어 닫힘

- [ ] **Step 4: 교실 페이지 검증**

강의실 → 온라인 강의 탭:

- [ ] 강의 목록 표시
- [ ] "강의 보기" 클릭 시 새 탭으로 뷰어 오픈
