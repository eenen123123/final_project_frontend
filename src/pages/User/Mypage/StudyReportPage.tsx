import { useState, useEffect } from "react";
import MyPageSidebar from "./components/MyPageSidebar";
import api from "../../../api/api";

interface Course {
  enrlSn: number;
  courseSn: number;
  courseNm: string;
  instrNm: string;
  accsEndDt: string;
  progressPct: number;
  thmbImg: string | null;
  subjClNm: string | null;
}

interface Subject {
  name: string;
  percent: number;
  minutes: number;
}

interface Instructor {
  rank: number;
  instructorName: string;
  profileImage: string | null;
  subjectName: string;
  totalSeconds: number;
}

const NOW = Date.now();

const THUMB_COLORS = [
  "bg-blue-600/10 text-blue-600",
  "bg-emerald-600/10 text-emerald-600",
  "bg-indigo-600/10 text-indigo-600",
  "bg-violet-600/10 text-violet-600",
  "bg-amber-600/10 text-amber-600",
  "bg-rose-600/10 text-rose-600",
];

function RadarChart({ subjects }: { subjects: Subject[] }) {
  const size = 190;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 65;
  const levels = [30, 60, 90];
  const angles = subjects.map(
    (_, i) => Math.PI / 2 + (2 * Math.PI * i) / subjects.length,
  );

  const point = (r: number, angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });

  const hexPath = (r: number) =>
    angles
      .map((a, i) => {
        const p = point(r, a);
        return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  const dataPath =
    subjects
      .map((s, i) => {
        const r = (s.percent / 100) * maxR;
        const p = point(r, angles[i]);
        return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
    >
      {/* 배경 가이드 그리드 격자 라인 */}
      {levels.map((l) => (
        <path
          key={l}
          d={hexPath((l / 90) * maxR)}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="1.5"
        />
      ))}
      {angles.map((a, i) => {
        const p = point(maxR, a);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#f1f5f9"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        );
      })}
      {/* 레이더 활성 데이터 영역 */}
      <path
        d={dataPath}
        fill="rgba(59,130,246,0.12)"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {subjects.map((s, i) => {
        const p = point(maxR + 15, angles[i]);
        return (
          <text
            key={s.name}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] font-bold fill-slate-500"
          >
            {s.name}
          </text>
        );
      })}
    </svg>
  );
}

export default function StudyReportPage() {
  const [activeSection, setActiveSection] = useState("수강 리포트");
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    api
      .get<Course[]>("/api/mypage/courses")
      .then((res) => setCourses(res.data))
      .catch((error) => alert(error.response?.data?.message ?? "강좌 정보를 불러올 수 없습니다."));

    api
      .get<{ instructorName: string; profileImage: string | null; subjectName: string; totalSeconds: number }[]>("/api/mypage/instructor-ranking")
      .then((res) => {
        setInstructors(res.data.map((item, i) => ({ rank: i + 1, ...item })));
      })
      .catch(() => {});

    api
      .get<{ subjectName: string; totalSeconds: number }[]>(
        "/api/mypage/subject-progress",
      )
      .then((res) => {
        const data = res.data;
        if (data.length === 0) return;
        const maxSeconds = Math.max(...data.map((d) => d.totalSeconds), 1);
        setSubjects(
          data.map((d) => ({
            name: d.subjectName,
            percent: Math.round((d.totalSeconds / maxSeconds) * 100),
            minutes: Math.round(d.totalSeconds / 60),
          })),
        );
      })
      .catch(() => {});
  }, []);

  const activeCourses = courses.filter(
    (c) => new Date(c.accsEndDt).getTime() >= NOW,
  );
  const endedCourses = courses.filter(
    (c) => new Date(c.accsEndDt).getTime() < NOW,
  );
  const avgProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, c) => sum + c.progressPct, 0) / courses.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* 메인 리포트 영역 */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* 상단 타이틀 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                수강 리포트
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                내 강좌 학습 현황과 과목별 밸런스를 통합 분석한 대시보드입니다.
              </p>
            </div>

            {/* 1. 요약 메트릭 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  label: "수강중 강좌",
                  value: activeCourses.length,
                  unit: "개",
                  textColor: "text-blue-600",
                  bgBadge: "bg-blue-50",
                },
                {
                  label: "수강완료 강좌",
                  value: endedCourses.length,
                  unit: "개",
                  textColor: "text-emerald-600",
                  bgBadge: "bg-emerald-50",
                },
                {
                  label: "평균 진척도",
                  value: avgProgress,
                  unit: "%",
                  textColor: "text-violet-600",
                  bgBadge: "bg-violet-50",
                },
              ].map(({ label, value, unit, textColor, bgBadge }) => (
                <div
                  key={label}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400">
                      {label}
                    </p>
                    <p
                      className={`text-3xl font-extrabold tracking-tight ${textColor}`}
                    >
                      {value}
                      <span className="text-xs font-bold text-slate-400 ml-0.5">
                        {unit}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${bgBadge} flex items-center justify-center shrink-0`}
                  />
                </div>
              ))}
            </div>

            {/* 2. 영역별 균형도 + 강좌별 진척도 2분할 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 레이더 차트 블록 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-800">
                    영역별 학습 시간 밸런스
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-slate-400">
                    최근 30일 기준
                  </span>
                </div>

                {subjects.length === 0 ? (
                  <div className="py-16 text-center text-xs font-medium text-slate-300">
                    누적된 학습 데이터 기록이 없습니다.
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
                    <div className="shrink-0">
                      <RadarChart subjects={subjects} />
                    </div>
                    <div className="flex-1 w-full">
                      <table className="w-full text-xs">
                        <tbody className="divide-y divide-slate-100">
                          {subjects.map((s: Subject) => (
                            <tr
                              key={s.name}
                              className="hover:bg-slate-50/40 transition-colors"
                            >
                              <td className="py-2 text-slate-700 font-semibold">
                                {s.name}
                              </td>
                              <td className="py-2 text-slate-400 text-right pr-3 font-mono">
                                {isNaN(s.percent) ? "" : `${s.percent}%`}
                              </td>
                              <td className="py-2 text-slate-800 text-right font-bold font-mono">
                                {s.minutes}분
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* 강좌별 진척도 목록 블록 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
                <h4 className="text-sm font-bold text-slate-800 mb-5">
                  강좌별 학습 진척도
                </h4>

                {courses.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-xs font-medium text-slate-300">
                      현재 수강 중인 강좌 리스트가 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                    {courses.map((course, i) => {
                      const isEnded =
                        new Date(course.accsEndDt).getTime() < NOW;
                      const barColor = isEnded
                        ? "bg-slate-300 text-slate-400"
                        : course.progressPct === 100
                          ? "bg-emerald-500 text-emerald-600"
                          : "bg-blue-500 text-blue-600";
                      const textClass = isEnded
                        ? "text-slate-400"
                        : course.progressPct === 100
                          ? "text-emerald-600"
                          : "text-blue-600";

                      return (
                        <div key={course.enrlSn} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`px-1.5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-[10px] font-extrabold shadow-sm whitespace-nowrap ${THUMB_COLORS[i % THUMB_COLORS.length]}`}
                              >
                                {course.subjClNm ?? course.courseNm ?? ""}
                              </div>
                              <p className="text-xs text-slate-700 font-bold truncate group-hover:text-slate-900 transition-colors">
                                {course.courseNm}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-mono font-extrabold ml-2 flex-shrink-0 ${textClass}`}
                            >
                              {course.progressPct}%
                            </span>
                          </div>

                          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                              style={{ width: `${course.progressPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 3. 선생님 집중도 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold text-slate-800">선생님 집중도</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-slate-400">
                  전체 기간 기준
                </span>
              </div>

              {instructors.length === 0 ? (
                <div className="py-12 text-center text-xs font-medium text-slate-300">
                  누적된 학습 데이터 기록이 없습니다.
                </div>
              ) : (
                <div className="space-y-5">
                  {instructors.map((instr) => {
                    const maxSeconds = instructors[0].totalSeconds;
                    const barPct = Math.round((instr.totalSeconds / maxSeconds) * 100);
                    const hours = Math.floor(instr.totalSeconds / 3600);
                    const mins = Math.floor((instr.totalSeconds % 3600) / 60);
                    const timeStr = hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;

                    return (
                      <div key={instr.rank} className="flex items-center gap-4">
                        {/* 순위 */}
                        <span className={`text-sm font-extrabold w-4 shrink-0 ${instr.rank === 1 ? "text-amber-500" : "text-slate-300"}`}>
                          {instr.rank}
                        </span>

                        {/* 프로필 이미지 */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                          {instr.profileImage ? (
                            <img src={instr.profileImage} alt={instr.instructorName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-slate-400">
                              {instr.instructorName.slice(0, 1)}
                            </span>
                          )}
                        </div>

                        {/* 이름 + 과목 + 바 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-700">{instr.instructorName} 선생님</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded font-semibold">{instr.subjectName}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-500 shrink-0 ml-2">{timeStr}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${instr.rank === 1 ? "bg-blue-500" : "bg-slate-300"}`}
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
