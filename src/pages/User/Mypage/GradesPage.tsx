import { useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";

type GradeTab = "overview" | "mogi" | "naesin" | "spec";
type ScoreSubject = "total" | "korean" | "math" | "english" | "history" | "explore";
type ExamDate = "3.24" | "5.7" | "6.4" | "7.8" | "9.2" | "10.20" | "수능";

interface ExamScore {
  area: string;
  subject: string | null;
  rawScore: number | null;
  rawCommon?: number;
  rawSelect?: number;
  stdScore: number | null;
  percentile: number | null;
  grade: number | null;
}

const GRADE_TABS: { key: GradeTab; label: string }[] = [
  { key: "overview", label: "성적 종합 관리" },
  { key: "mogi", label: "모의고사(수능) 성적" },
  { key: "naesin", label: "학생부 교과(내신)" },
  { key: "spec", label: "비교과(스펙)" },
];

const SCORE_SUBJECTS: { key: ScoreSubject; label: string }[] = [
  { key: "total", label: "총점(국수탐)" },
  { key: "korean", label: "국어" },
  { key: "math", label: "수학" },
  { key: "english", label: "영어" },
  { key: "history", label: "한국사" },
  { key: "explore", label: "탐구" },
];

const MOGI_MONTHS = ["3월", "5월", "6월", "7월", "9월", "10월", "수능"];
const EXAM_DATES: ExamDate[] = ["3.24", "5.7", "6.4", "7.8", "9.2", "10.20", "수능"];

const DUMMY_SCORES: Record<ScoreSubject, (number | null)[]> = {
  total:   [null, null, 218, null, null, null, null],
  korean:  [null, null, 62,  null, null, null, null],
  math:    [null, null, 88,  null, null, null, null],
  english: [null, null, 1,   null, null, null, null],
  history: [null, null, 2,   null, null, null, null],
  explore: [null, null, 68,  null, null, null, null],
};

const SCORE_MAX: Record<ScoreSubject, number> = {
  total: 300, korean: 100, math: 100, english: 9, history: 9, explore: 100,
};

const SCORE_UNIT: Record<ScoreSubject, string> = {
  total: "점", korean: "점", math: "점", english: "등급", history: "등급", explore: "점",
};

const DUMMY_EXAM_SCORES: Record<ExamDate, ExamScore[]> = {
  "3.24": [],
  "5.7": [],
  "6.4": [
    { area: "국어",          subject: "화법과작문", rawScore: 80, rawCommon: 60, rawSelect: 20, stdScore: 117, percentile: 75, grade: 4 },
    { area: "수학",          subject: "확률과통계", rawScore: 80, rawCommon: 60, rawSelect: 20, stdScore: 123, percentile: 87, grade: 3 },
    { area: "영어",          subject: null,         rawScore: 75, stdScore: null, percentile: null, grade: 3 },
    { area: "한국사",        subject: null,         rawScore: 50, stdScore: null, percentile: null, grade: 1 },
    { area: "탐구",          subject: "생활과윤리", rawScore: 20, stdScore: 45,  percentile: 38,   grade: 6 },
    { area: "탐구",          subject: "경제",       rawScore: 30, stdScore: 57,  percentile: 74,   grade: 4 },
    { area: "제2외국어/한문",subject: "한문Ⅰ",      rawScore: 50, stdScore: null, percentile: null, grade: 1 },
  ],
  "7.8": [],
  "9.2": [],
  "10.20": [],
  "수능": [],
};

const SEMESTERS = ["1학년\n1학기", "1학년\n2학기", "2학년\n1학기", "2학년\n2학기", "3학년\n1학기", "3학년\n2학기"];
const DUMMY_NAESIN: (number | null)[] = [null, null, null, null, null, null];

const SPEC_CATEGORIES = [
  { label: "어학 능력", desc: "토익, 토플, HSK 등 어학 점수를 등록하세요" },
  { label: "수상 실적", desc: "교내외 수상 경력을 등록하세요" },
  { label: "독서 활동", desc: "독서 활동 사항을 등록하세요" },
  { label: "봉사 활동", desc: "봉사 활동 내역을 등록하세요" },
  { label: "자격증", desc: "보유 자격증을 등록하세요" },
];

function MogiBarChart({ scores, maxVal, unit }: { scores: (number | null)[]; maxVal: number; unit: string }) {
  const W = 540, H = 195;
  const pL = 40, pR = 15, pT = 30, pB = 25;
  const cW = W - pL - pR;
  const cH = H - pT - pB;
  const slotW = cW / MOGI_MONTHS.length;
  const barW = slotW * 0.42;

  const tickCount = maxVal <= 9 ? maxVal : 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxVal / tickCount) * i)
  );

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {ticks.map((val) => {
        const y = pT + cH - (val / maxVal) * cH;
        return (
          <g key={val}>
            <line x1={pL} y1={y} x2={W - pR} y2={y} stroke={val === 0 ? "#e5e7eb" : "#f3f4f6"} strokeWidth="1" />
            <text x={pL - 5} y={y} textAnchor="end" dominantBaseline="middle" fontSize="8" fill="#9ca3af">{val}</text>
          </g>
        );
      })}
      {MOGI_MONTHS.map((month, i) => {
        const cx = pL + i * slotW + slotW / 2;
        const score = scores[i];
        const hasScore = score !== null;
        const barH = hasScore ? (score! / maxVal) * cH : 0;
        const barY = pT + cH - barH;
        const isSuneung = month === "수능";
        return (
          <g key={month}>
            {hasScore && (
              <>
                <rect x={cx - barW / 2} y={barY} width={barW} height={barH} fill={isSuneung ? "#60a5fa" : "#93c5fd"} rx="3" />
                <text x={cx} y={barY - 5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#2563eb">
                  {score}{unit}
                </text>
              </>
            )}
            <text x={cx} y={H - 5} textAnchor="middle" fontSize="9"
              fill={isSuneung ? "#ef4444" : "#6b7280"} fontWeight={isSuneung ? "700" : "400"}>
              {month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function NaesinLineChart({ data }: { data: (number | null)[] }) {
  const W = 540, H = 210;
  const pL = 30, pR = 20, pT = 20, pB = 45;
  const cW = W - pL - pR;
  const cH = H - pT - pB;
  const n = data.length;
  const getX = (i: number) => pL + (i / (n - 1)) * cW;
  const getY = (grade: number) => pT + ((grade - 1) / 8) * cH;

  const pathPoints = data
    .map((g, i) => (g !== null ? { x: getX(i), y: getY(g) } : null))
    .filter((p): p is { x: number; y: number } => p !== null);
  const linePath =
    pathPoints.length >= 2
      ? pathPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
      : null;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {Array.from({ length: 9 }, (_, i) => {
        const grade = i + 1;
        const y = getY(grade);
        return (
          <g key={grade}>
            <line x1={pL} y1={y} x2={W - pR} y2={y} stroke={grade === 1 ? "#e5e7eb" : "#f3f4f6"} strokeWidth="1" />
            <text x={pL - 5} y={y} textAnchor="end" dominantBaseline="middle" fontSize="8" fill="#9ca3af">{grade}</text>
          </g>
        );
      })}
      {data.map((_, i) => (
        <line key={i} x1={getX(i)} y1={pT} x2={getX(i)} y2={pT + cH} stroke="#f9fafb" strokeWidth="1" />
      ))}
      {linePath && <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" />}
      {data.map((g, i) =>
        g !== null ? <circle key={i} cx={getX(i)} cy={getY(g)} r="4" fill="#3b82f6" /> : null
      )}
      {SEMESTERS.map((sem, i) => {
        const parts = sem.split("\n");
        return (
          <g key={i}>
            <text x={getX(i)} y={H - 25} textAnchor="middle" fontSize="8" fill="#6b7280">{parts[0]}</text>
            <text x={getX(i)} y={H - 12} textAnchor="middle" fontSize="8" fill="#6b7280">{parts[1]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function GradesPage() {
  const [activeSection, setActiveSection] = useState("성적 관리");
  const [activeTab, setActiveTab] = useState<GradeTab>("overview");
  const [scoreSubject, setScoreSubject] = useState<ScoreSubject>("total");
  const [selectedExamDate, setSelectedExamDate] = useState<ExamDate>("6.4");

  const scores = DUMMY_SCORES[scoreSubject];
  const maxVal = SCORE_MAX[scoreSubject];
  const unit = SCORE_UNIT[scoreSubject];
  const currentExamScores = DUMMY_EXAM_SCORES[selectedExamDate];

  const mogiSection = (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900">나의 모의고사(수능) 성적 현황</h4>
          <p className="text-xs text-gray-400 mt-0.5">모의고사(수능) 시험별 성적 변화를 비교하실 수 있습니다.</p>
        </div>
        <button className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer">
          모의고사 성적 등록
        </button>
      </div>
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {SCORE_SUBJECTS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setScoreSubject(key)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer font-medium
              ${scoreSubject === key
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <MogiBarChart scores={scores} maxVal={maxVal} unit={unit} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {MOGI_MONTHS.map((m) => (
                <th key={m} className={`py-2 px-2 text-center font-semibold border border-gray-100 ${m === "수능" ? "text-red-500" : "text-gray-500"}`}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {scores.map((score, i) => (
                <td key={i} className="py-2 px-2 text-center border border-gray-100">
                  {score !== null ? (
                    <span className="font-semibold text-blue-600">{score}{unit}</span>
                  ) : (
                    <button className="text-blue-400 hover:text-blue-600 transition-colors cursor-pointer">미등록</button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
        · [국어/수학/탐구]는 백분위 [영어/한국사]는 등급 기준이며, [탐구]는 2과목 응시 시 2과목 평균으로 산출됩니다.
      </p>
    </div>
  );

  const mogiDetailSection = (
    <div className="space-y-4">
      {/* 연도 + 시험일 선택 */}
      <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-6 flex-wrap">
        <span className="text-xs font-semibold px-3 py-1.5 border border-gray-300 text-gray-700 rounded bg-gray-50 flex-shrink-0">
          2027학년도 학력/모의평가
        </span>
        <div className="flex items-center flex-wrap gap-0">
          {EXAM_DATES.map((date, i) => (
            <div key={date} className="flex items-center">
              {i > 0 && <span className="text-gray-200 mx-3 text-xs">|</span>}
              <button
                onClick={() => setSelectedExamDate(date)}
                className={`text-sm transition-colors cursor-pointer pb-0.5
                  ${selectedExamDate === date
                    ? "text-blue-600 font-bold border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {date}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 안내 문구 (성적 있을 때만) */}
      {currentExamScores.length > 0 && (
        <div className="space-y-0.5 px-1">
          <p className="text-xs text-red-500">· 표준점수, 백분위, 등급은 6월 모평 등급컷 자체 확정 기준으로 제공되고 있습니다.</p>
          <p className="text-xs text-red-500">· 추후 성적 발표 후에는 성적표상의 표준점수, 백분위, 등급을 정확히 입력하여야 하니 유의하시기 바랍니다.</p>
        </div>
      )}

      {/* 성적 테이블 */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {currentExamScores.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-300 mb-4">등록된 성적이 없습니다.</p>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 border-r border-gray-100">응시영역</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 border-r border-gray-100">응시과목</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 border-r border-gray-100 leading-tight">
                  원점수<br /><span className="font-normal text-[10px] text-gray-400">(공통/선택)</span>
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 border-r border-gray-100">표준점수</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 border-r border-gray-100">백분위</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500">등급</th>
              </tr>
            </thead>
            <tbody>
              {currentExamScores.map((row, i) => {
                const prev = i > 0 ? currentExamScores[i - 1] : null;
                const isFirstInArea = !prev || prev.area !== row.area;
                const areaRowSpan = isFirstInArea
                  ? currentExamScores.slice(i).filter((r) => r.area === row.area).length
                  : 0;
                return (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30">
                    {isFirstInArea && (
                      <td
                        rowSpan={areaRowSpan}
                        className="py-3 px-4 text-center text-xs text-gray-600 border-r border-gray-100 align-middle bg-gray-50/20"
                      >
                        {row.area}
                      </td>
                    )}
                    <td className="py-3 px-4 text-center text-xs text-gray-600 border-r border-gray-100">
                      {row.subject ?? "-"}
                    </td>
                    <td className="py-3 px-4 text-center border-r border-gray-100">
                      <span className="text-xs font-semibold text-gray-800">{row.rawScore ?? "-"}</span>
                      {row.rawCommon !== undefined && (
                        <div className="text-[10px] text-gray-400 mt-0.5">( {row.rawCommon} / {row.rawSelect} )</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-gray-700 border-r border-gray-100">
                      {row.stdScore ?? "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-gray-700 border-r border-gray-100">
                      {row.percentile ?? "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-semibold text-gray-800">
                      {row.grade ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-50">
          <button className="text-xs px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors cursor-pointer">
            풀서비스 채점 성적 등록
          </button>
          <button className="text-xs px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors cursor-pointer">
            성적 입력/수정
          </button>
        </div>
      </div>

      {/* 안내 박스 + 성적 삭제 */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
        <div className="space-y-1.5 text-xs leading-relaxed mb-4">
          <p className="font-semibold text-gray-700">
            · 시험별 시행기관의 성적 발표 전까지는 원점수만 입력가능합니다.
          </p>
          <p className="text-gray-400 ml-3">(국어, 수학은 공통 문항과 선택과목 문항 점수 분리하여 입력)</p>
          <p className="text-gray-600">
            · 성적 발표 후에는 성적표 상의 표준점수/백분위/등급을 정확히 입력해야 합니다.
          </p>
          <p className="text-gray-600">
            · 시기별로 표준점수/백분위/등급의 기준이 아래와 같이 다릅니다.
          </p>
          <div className="ml-3 space-y-1 text-gray-500">
            <p>
              <span className="text-gray-700 font-medium underline underline-offset-1 cursor-pointer">1차(모의고사/수능 당일)</span>
              {" "}: 전년도 해당 년도에 이전 시험 확정 등급컷 기준
            </p>
            <p>
              <span className="text-gray-700 font-medium underline underline-offset-1 cursor-pointer">2차(모의고사/수능 일 이후)</span>
              {" "}: 자체 확정 등급컷 기준
            </p>
            <p>
              <span className="text-gray-700 font-medium underline underline-offset-1 cursor-pointer">3차(모의고사/수능 성적 발표 후)</span>
              {" "}: 해당 시험 성적 발표 기준 확정 등급컷 기준
            </p>
          </div>
          <p className="text-gray-600">
            · 입력된 모의고사(수능) 성적 삭제를 원하실 경우 아래버튼을 클릭하여 성적을 삭제할 수 있습니다.
          </p>
        </div>
        <div className="flex justify-end">
          <button className="text-xs px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            성적 삭제
          </button>
        </div>
      </div>
    </div>
  );

  const naesinSection = (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900">나의 내신(학생부) 성적 현황</h4>
          <p className="text-xs text-gray-400 mt-0.5">학기별 성적 변화 및 학년별 평균 등급을 확인할 수 있습니다.</p>
        </div>
        <button className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer">
          내신 성적 등록
        </button>
      </div>
      <div className="mb-4">
        <NaesinLineChart data={DUMMY_NAESIN} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-center font-semibold text-gray-500 border border-gray-100 w-24"></th>
              <th className="py-2 px-2 text-center font-semibold text-gray-500 border border-gray-100">1학년</th>
              <th className="py-2 px-2 text-center font-semibold text-gray-500 border border-gray-100">2학년</th>
              <th className="py-2 px-2 text-center font-semibold text-gray-500 border border-gray-100">3학년</th>
              <th className="py-2 px-2 text-center font-semibold text-gray-500 border border-gray-100 bg-blue-50/50">전 학년 평균</th>
            </tr>
          </thead>
          <tbody>
            {[{ label: "전 교과" }, { label: "주요 교과" }].map(({ label }) => (
              <tr key={label}>
                <td className="py-2 px-3 text-center text-gray-500 border border-gray-100 bg-gray-50/30">{label}</td>
                {[0, 1, 2].map((i) => (
                  <td key={i} className="py-2 px-2 text-center border border-gray-100">
                    <button className="text-blue-400 hover:text-blue-600 transition-colors cursor-pointer">미등록</button>
                  </td>
                ))}
                <td className="py-2 px-2 text-center border border-gray-100 bg-blue-50/30 text-gray-400">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
        · 이수단위를 반영한 평균 등급이며, 주요 교과는 [국어/수학/영어/사회/과학] 교과에 해당하는 과목입니다.
      </p>
    </div>
  );

  const specSection = (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="mb-5">
        <h4 className="text-sm font-bold text-gray-900">비교과(스펙) 관리</h4>
        <p className="text-xs text-gray-400 mt-0.5">교내외 활동 및 자격 사항을 등록하여 관리하세요.</p>
      </div>
      <div className="space-y-3">
        {SPEC_CATEGORIES.map(({ label, desc }) => (
          <div key={label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-gray-50 transition-colors">
            <div>
              <p className="text-sm font-semibold text-gray-700">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <button className="text-xs px-3 py-1.5 border border-blue-200 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer font-medium flex-shrink-0">
              등록
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">성적 관리</h3>
              <p className="text-sm text-gray-500 mt-1">모의고사 성적 및 학생부 성적을 기록하고 분석할 수 있습니다.</p>
            </div>

            {/* 학생 정보 + 목표 대학 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5 grid grid-cols-2 divide-x divide-gray-100">
              <div className="pr-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-bold">재수</span>
                  <span className="text-sm font-bold text-gray-800">회원님</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">기타 / 인문계열</p>
                <button className="text-[11px] px-2.5 py-1 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  정보 수정
                </button>
              </div>
              <div className="pl-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">합격 목표!</p>
                  <p className="text-sm font-semibold text-gray-400">목표 대학 미설정</p>
                  <button className="mt-1 text-[11px] px-2.5 py-1 border border-blue-200 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                    목표 대학 설정
                  </button>
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div className="flex border-b border-gray-200 mb-5">
              {GRADE_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer relative top-[1px] border-b-2
                    ${activeTab === key
                      ? "border-blue-600 text-blue-600 font-semibold"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="space-y-5">
                {mogiSection}
                {naesinSection}
              </div>
            )}
            {activeTab === "mogi" && mogiDetailSection}
            {activeTab === "naesin" && naesinSection}
            {activeTab === "spec" && specSection}
          </div>
        </div>
      </div>
    </div>
  );
}
