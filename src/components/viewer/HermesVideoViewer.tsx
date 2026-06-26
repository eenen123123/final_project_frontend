import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
  secondsWatched: number | null;
}

type LectureStatus = "completed" | "current" | "pending";

function getLectureStatus(
  lecture: LectureItem,
  currentLectureSn: number,
): LectureStatus {
  if (lecture.lectureSn === currentLectureSn) return "current";
  if (
    lecture.secondsWatched &&
    lecture.lectureDuration &&
    lecture.lectureDuration - lecture.secondsWatched < 30
  )
    return "completed";
  return "pending";
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface LectureListProps {
  lectures: LectureItem[];
  currentLectureSn: number | null;
  goToLecture: (lectureSn: number) => void;
}

function LectureList({
  lectures,
  currentLectureSn,
  goToLecture,
}: LectureListProps) {
  return (
    <ul className="flex flex-col gap-1">
      {lectures.map((l) => {
        const status = getLectureStatus(l, currentLectureSn ?? -1);
        return (
          <li key={l.lectureSn}>
            <button
              onClick={() => goToLecture(l.lectureSn)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                ${status === "current" ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50"}`}
            >
              {status === "completed" ? (
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0 text-white text-[9px] font-bold">
                  ✓
                </span>
              ) : status === "current" ? (
                <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </span>
              ) : (
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs truncate ${
                    status === "current"
                      ? "text-blue-700 font-semibold"
                      : status === "completed"
                        ? "text-slate-400 line-through"
                        : "text-slate-600"
                  }`}
                >
                  {l.lectureName}
                </p>
                {l.lectureDuration && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatDuration(l.lectureDuration)}
                  </p>
                )}
                {l.lectureDuration &&
                  l.secondsWatched &&
                  l.secondsWatched > 0 && (
                    <div className="h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${status === "completed" ? "bg-green-500" : "bg-blue-500"}`}
                        style={{
                          width: `${Math.min(100, Math.round((l.secondsWatched / l.lectureDuration) * 100))}%`,
                        }}
                      />
                    </div>
                  )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
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
  const [videoFetch, setVideoFetch] = useState<{
    url: string;
    lectureSn: number | null;
  }>({ url: "", lectureSn: null });
  const videoUrl =
    videoFetch.lectureSn === currentLectureSn ? videoFetch.url : "";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const lastRecordedRef = useRef(0);
  const completeRef = useRef(false);
  const prevLectureSnRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [resumePopup, setResumePopup] = useState<{ seconds: number } | null>(
    null,
  );
  const [playbackRate, setPlaybackRate] = useState(1);

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  // 코스 + 강의 목록 fetch
  useEffect(() => {
    if (!isAuthReady || !courseId) return;
    api
      .get(`/api/course/${courseId}`)
      .then((res) => {
        setCourse(res.data.course);
        setLectures(res.data.lectures);
      })
      .catch(() => alert("강의 정보를 불러오는 중 오류가 발생했습니다."));
  }, [courseId, isAuthReady]);

  const currentLectureVideoFileId =
    lectures.find((l) => l.lectureSn === currentLectureSn)
      ?.lectureVideoFileId ?? null;

  // 현재 강의 영상 URL fetch
  useEffect(() => {
    if (!isAuthReady || !currentLectureSn || !currentLectureVideoFileId) return;
    api
      .post(`/api/files/${currentLectureVideoFileId}/token`)
      .then((res) =>
        setVideoFetch({ url: res.data.viewUrl, lectureSn: currentLectureSn }),
      )
      .catch((error) => {
        if (error.response?.status === 403) {
          alert("강의 영상을 볼 수 있는 권한이 없습니다.");
        } else {
          alert("강의 영상을 불러오는 중 오류가 발생했습니다.");
        }
      });
  }, [currentLectureSn, currentLectureVideoFileId, isAuthReady]);

  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drawerOpen]);

  const currentLecture =
    lectures.find((l) => l.lectureSn === currentLectureSn) ?? null;
  const currentIndex = lectures.findIndex(
    (l) => l.lectureSn === currentLectureSn,
  );
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex >= 0 && currentIndex < lectures.length - 1
      ? lectures[currentIndex + 1]
      : null;

  const goToLecture = (lectureSn: number) => {
    setDrawerOpen(false);
    navigate(`/viewer?courseId=${courseId}&lectureId=${lectureSn}`);
  };

  const handleLectureProgress = (currentTime: number) => {
    if (!currentLecture || completeRef.current) return;

    // 강의 종료 30초 전 시청 완료 API 호출
    if (
      currentLecture.lectureDuration &&
      currentLecture.lectureDuration - currentTime < 30 &&
      currentTime > 30
    ) {
      completeRef.current = true;
      setLectures((prev) =>
        prev.map((l) =>
          l.lectureSn === currentLecture.lectureSn
            ? { ...l, secondsWatched: currentLecture.lectureDuration }
            : l,
        ),
      );
      api.post(`/api/lecture/progress`, {
        lectureId: `${currentLecture.lectureSn}`,
        courseId: `${courseId}`,
        progress: currentLecture.lectureDuration,
      });
      return;
    }

    // 30초마다 1회만 기록
    if (currentTime - lastRecordedRef.current >= 30) {
      lastRecordedRef.current = currentTime;
      const watched = Math.floor(currentTime);
      setLectures((prev) =>
        prev.map((l) =>
          l.lectureSn === currentLecture.lectureSn
            ? { ...l, secondsWatched: watched }
            : l,
        ),
      );
      api.post(`/api/lecture/progress`, {
        lectureId: `${currentLecture.lectureSn}`,
        courseId: `${courseId}`,
        progress: currentTime,
      });
    }
  };

  useEffect(() => {
    const prevSn = prevLectureSnRef.current;
    prevLectureSnRef.current = currentLectureSn;

    if (prevSn !== null) {
      const wasComplete = completeRef.current;
      setLectures((prev) => {
        const prevLecture = prev.find((l) => l.lectureSn === prevSn);
        if (!prevLecture) return prev;
        const newWatched = wasComplete
          ? (prevLecture.lectureDuration ?? lastRecordedRef.current)
          : lastRecordedRef.current;
        if (newWatched <= 0) return prev;
        return prev.map((l) =>
          l.lectureSn === prevSn ? { ...l, secondsWatched: newWatched } : l,
        );
      });
    }

    completeRef.current = false;
    lastRecordedRef.current = 0;
    setResumePopup(null);
  }, [currentLectureSn]);

  const handleVideoLoaded = () => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
    const lecture = lectures.find((l) => l.lectureSn === currentLectureSn);
    if (
      lecture?.secondsWatched &&
      lecture.secondsWatched > 0 &&
      (!lecture.lectureDuration ||
        lecture.secondsWatched < lecture.lectureDuration)
    ) {
      setResumePopup({ seconds: lecture.secondsWatched });
    }
  };

  const totalDuration = lectures.reduce(
    (s, l) => s + (l.lectureDuration ?? 0),
    0,
  );
  const totalWatched = lectures.reduce(
    (s, l) => s + (l.secondsWatched ?? 0),
    0,
  );
  const overallProgress =
    totalDuration > 0
      ? Math.min(100, Math.round((totalWatched / totalDuration) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 브레드크럼 */}
      <div className="px-4 md:px-6 py-3 border-b border-slate-200 bg-white text-xs text-slate-400 flex items-center gap-1">
        <Link
          to="/"
          className="hidden md:inline text-blue-500 hover:text-blue-600 transition-colors bg-white "
        >
          Home
        </Link>
        <span className="hidden md:inline">/</span>

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
            <span className="text-blue-600 font-medium">
              {currentLecture.lectureName}
            </span>
          </>
        )}
      </div>

      {/* 모바일 목록 버튼 */}
      <div className="md:hidden flex justify-between px-4 pt-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-200 mr-2"
        >
          ← 홈
        </Link>

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
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {videoUrl ? (
              <video
                ref={videoRef}
                controls
                className="w-full h-full"
                key={videoUrl}
                onLoadedMetadata={handleVideoLoaded}
                onTimeUpdate={(e) =>
                  handleLectureProgress(e.currentTarget.currentTime)
                }
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                영상을 불러오는 중...
              </div>
            )}
            {videoUrl && (
              <div className="absolute top-3 right-3 z-10 flex gap-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRate(rate)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors
                      ${
                        playbackRate === rate
                          ? "bg-blue-600 text-white"
                          : "bg-black/50 text-white/80 hover:bg-black/70"
                      }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
            {resumePopup && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <div className="bg-white rounded-2xl p-8 text-center shadow-2xl w-80">
                  <p className="text-base font-bold text-slate-800 mb-2">
                    이어서 시청할까요?
                  </p>
                  <p className="text-sm text-slate-500 mb-6">
                    <span className="text-blue-600 font-semibold">
                      {formatDuration(resumePopup.seconds)}
                    </span>{" "}
                    부터 이어보기
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setResumePopup(null)}
                      className="flex-1 py-3 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      처음부터
                    </button>
                    <button
                      onClick={() => {
                        if (videoRef.current)
                          videoRef.current.currentTime = resumePopup.seconds;
                        setResumePopup(null);
                      }}
                      className="flex-1 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      이어보기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {currentLecture && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                  {currentLecture.lectureName}
                </h1>
                <span className="shrink-0 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  수강 중
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                {course?.instructorName} · {course?.courseName}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    prevLecture && goToLecture(prevLecture.lectureSn)
                  }
                  disabled={!prevLecture}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg disabled:opacity-40 hover:bg-slate-200 transition-colors"
                >
                  ← 이전 강의
                </button>
                <button
                  onClick={() =>
                    nextLecture && goToLecture(nextLecture.lectureSn)
                  }
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
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            강의 목록
          </h2>
          <LectureList
            lectures={lectures}
            currentLectureSn={currentLectureSn}
            goToLecture={goToLecture}
          />
          {/* 진도 */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-slate-500">전체 진도</span>
              <span className="text-[11px] text-blue-600 font-semibold">
                {overallProgress}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
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
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl transition-transform duration-300 md:hidden max-h-[70vh] flex flex-col
          ${drawerOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide px-4 pb-2 shrink-0">
          강의 목록
        </h2>
        <div className="overflow-y-auto px-4 pb-6">
          <LectureList
            lectures={lectures}
            currentLectureSn={currentLectureSn}
            goToLecture={goToLecture}
          />
          {/* 진도 */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-slate-500">전체 진도</span>
              <span className="text-[11px] text-blue-600 font-semibold">
                {overallProgress}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
