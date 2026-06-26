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
