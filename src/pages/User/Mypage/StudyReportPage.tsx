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
}

interface Subject {
  name: string;
  percent: number;
  minutes: number;
}

const DUMMY_SUBJECTS: Subject[] = [
  { name: "국어", percent: 65, minutes: 127 },
  { name: "수학", percent: 70, minutes: 56 },
  { name: "영어", percent: 90, minutes: 28 },
  { name: "탐구", percent: 70, minutes: 196 },
  { name: "한국사", percent: 35, minutes: 42 },
  { name: "제2외/한문", percent: 55, minutes: 74 },
];

const THUMB_COLORS = ["#1E3A8A", "#065F46", "#4B5563", "#7C3AED", "#B45309", "#1E40AF", "#9D174D"];

function RadarChart({ subjects }: { subjects: Subject[] }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 70;
  const levels = [30, 60, 90];
  const angles = subjects.map((_, i) => Math.PI / 2 + (2 * Math.PI * i) / subjects.length);

  const point = (r: number, angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });

  const hexPath = (r: number) =>
    angles.map((a, i) => {
      const p = point(r, a);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ") + " Z";

  const dataPath =
    subjects.map((s, i) => {
      const r = (s.percent / 100) * maxR;
      const p = point(r, angles[i]);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {levels.map((l) => (
        <path key={l} d={hexPath((l / 90) * maxR)} fill="none" stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {angles.map((a, i) => {
        const p = point(maxR, a);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
      {subjects.map((s, i) => {
        const p = point(maxR + 12, angles[i]);
        return (
          <text key={s.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#6b7280">
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

  useEffect(() => {
    api
      .get<Course[]>("/api/mypage/courses")
      .then((res) => setCourses(res.data))
      .catch((error) => alert(error.response?.data?.message));
  }, []);

  const now = Date.now();
  const activeCourses = courses.filter((c) => new Date(c.accsEndDt).getTime() >= now);
  const endedCourses = courses.filter((c) => new Date(c.accsEndDt).getTime() < now);
  const avgProgress =
    courses.length > 0
      ? Math.round(courses.reduce((sum, c) => sum + c.progressPct, 0) / courses.length)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">수강 리포트</h3>
              <p className="text-sm text-gray-500 mt-1">내 강좌 학습 현황을 한눈에 확인할 수 있습니다.</p>
            </div>

            {/* 요약 카드 */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: "수강중 강좌", value: activeCourses.length, unit: "개", color: "#3B82F6" },
                { label: "수강완료 강좌", value: endedCourses.length, unit: "개", color: "#22C55E" },
                { label: "평균 진척도", value: avgProgress, unit: "%", color: "#8B5CF6" },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-gray-400 font-medium mb-2">{label}</p>
                  <p className="text-3xl font-bold" style={{ color }}>
                    {value}
                    <span className="text-lg font-semibold ml-0.5">{unit}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* 영역별 학습 현황 + 강좌별 진척도 */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              {/* 레이더 차트 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-900">영역별 학습 시간 밸런스</h4>
                  <span className="text-xs text-gray-400">조회 기준: 최근 30일</span>
                </div>
                <div className="flex items-start gap-4">
                  <RadarChart subjects={DUMMY_SUBJECTS} />
                  <div className="flex-1 pt-2">
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-gray-100">
                        {DUMMY_SUBJECTS.map((s) => (
                          <tr key={s.name}>
                            <td className="py-1.5 text-gray-600 font-medium">{s.name}</td>
                            <td className="py-1.5 text-gray-400 text-right pr-2">{s.percent}%</td>
                            <td className="py-1.5 text-gray-400 text-right">{s.minutes}분</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 강좌별 진척도 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-4">강좌별 학습 진척도</h4>
                {courses.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-300">수강중인 강좌가 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {courses.map((course, i) => {
                      const isEnded = new Date(course.accsEndDt).getTime() < now;
                      const barColor = isEnded ? "#9CA3AF" : course.progressPct === 100 ? "#22C55E" : "#3B82F6";
                      return (
                        <div key={course.enrlSn}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-white text-[8px] font-bold"
                                style={{ background: THUMB_COLORS[i % THUMB_COLORS.length] }}
                              >
                                {(course.courseNm ?? "").slice(0, 1)}
                              </div>
                              <p className="text-xs text-gray-700 font-medium truncate">{course.courseNm}</p>
                            </div>
                            <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: barColor }}>
                              {course.progressPct}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${course.progressPct}%`, background: barColor }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 주간 학습 시간 바 차트 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-sm font-bold text-gray-900">주간 학습 시간</h4>
                <span className="text-xs text-gray-400">조회 기준: 최근 7일</span>
              </div>
              <div className="flex items-end gap-3 h-28">
                {[
                  { day: "월", minutes: 45 },
                  { day: "화", minutes: 90 },
                  { day: "수", minutes: 30 },
                  { day: "목", minutes: 120 },
                  { day: "금", minutes: 60 },
                  { day: "토", minutes: 15 },
                  { day: "일", minutes: 75 },
                ].map(({ day, minutes }) => {
                  const maxMinutes = 120;
                  const heightPct = (minutes / maxMinutes) * 100;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-400">{minutes}분</span>
                      <div className="w-full flex items-end" style={{ height: "80px" }}>
                        <div
                          className="w-full rounded-t-md bg-blue-400 transition-all duration-500"
                          style={{ height: `${heightPct}%`, minHeight: "4px" }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
