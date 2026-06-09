import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 0. 타입 및 목데이터
// ==========================================
type TabType = "home" | "attendance" | "score" | "assign";

interface ChildInfo {
  id: number;
  name: string;
  grade: string;
  classNm: string;
  instrNm: string;
  enrlStrtYmd: string;
  attendanceRate: number;
  assignRate: number;
  recentScore: number;
}

const MOCK_CHILDREN: ChildInfo[] = [
  {
    id: 1,
    name: "김민준",
    grade: "고2",
    classNm: "고등 수학 최상위반",
    instrNm: "정승제",
    enrlStrtYmd: "2026-03-02",
    attendanceRate: 92,
    assignRate: 85,
    recentScore: 88,
  },
  {
    id: 2,
    name: "김서연",
    grade: "중3",
    classNm: "중등 영어 기초반",
    instrNm: "주혜연",
    enrlStrtYmd: "2026-03-02",
    attendanceRate: 78,
    assignRate: 70,
    recentScore: 75,
  },
];

const TABS: { id: TabType; label: string }[] = [
  { id: "home", label: "홈 대시보드" },
  { id: "attendance", label: "출석 현황" },
  { id: "score", label: "성적 분석" },
  { id: "assign", label: "과제 제출 현황" },
];

const ATTEND_DATA = [
  { day: 1, status: "attend" },
  { day: 2, status: "attend" },
  { day: 5, status: "attend" },
  { day: 7, status: "late" },
  { day: 9, status: "attend" },
  { day: 12, status: "absent" },
  { day: 14, status: "attend" },
  { day: 16, status: "attend" },
  { day: 19, status: "attend" },
  { day: 21, status: "attend" },
  { day: 23, status: "late" },
  { day: 26, status: "attend" },
  { day: 28, status: "attend" },
];

// ==========================================
// 1. 출석 달력
// ==========================================
function AttendanceCalendar({ compact = false }: { compact?: boolean }) {
  const firstDay = 4;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const prevDays = Array.from(
    { length: firstDay },
    (_, i) => 30 - firstDay + 1 + i,
  );

  const getStatus = (day: number) =>
    ATTEND_DATA.find((d) => d.day === day)?.status;

  const statusStyle: Record<string, string> = {
    attend: "bg-emerald-500 text-white",
    late: "bg-amber-400 text-white",
    absent: "bg-red-400 text-white",
  };

  return (
    <div
      className={
        compact ? "" : "bg-white border border-slate-200 rounded-xl p-4"
      }
    >
      {!compact && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700">
            2026년 6월 출석 현황
          </span>
          <div className="flex items-center gap-3 text-[10px] font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              출석
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              지각
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              결석
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div
            key={d}
            className={`text-[10px] font-bold pb-1 ${i === 0 ? "text-red-400" : "text-slate-400"}`}
          >
            {d}
          </div>
        ))}
        {prevDays.map((d) => (
          <div
            key={`p${d}`}
            className="h-6 flex items-center justify-center text-[10px] text-slate-200"
          >
            {d}
          </div>
        ))}
        {days.map((d) => {
          const status = getStatus(d);
          const isToday = d === 8;
          return (
            <div
              key={d}
              className={`h-6 flex items-center justify-center text-[10px] rounded-md font-semibold
              ${isToday && !status ? "bg-blue-600 text-white" : ""}
              ${status ? statusStyle[status] : !isToday ? "text-slate-500" : ""}
            `}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 2. 사이드바
// ==========================================
function ParentSidebar({
  child,
  children,
  selectedId,
  onSelect,
}: {
  child: ChildInfo;
  children: ChildInfo[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="space-y-4">
      {/* 자녀 선택 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-2">
          자녀 선택
        </span>
        <div className="flex flex-col gap-2">
          {children.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`flex items-center gap-3 p-2.5 rounded-lg text-left transition-all border
                ${selectedId === c.id ? "border-emerald-300 bg-emerald-50" : "border-slate-100 hover:bg-slate-50"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${selectedId === c.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {c.name[1]}
              </div>
              <div>
                <p
                  className={`text-xs font-bold ${selectedId === c.id ? "text-emerald-700" : "text-slate-700"}`}
                >
                  {c.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {c.grade} · {c.classNm}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 자녀 정보 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
          자녀 수강 정보
        </span>
        {[
          { label: "담당 강사", value: `${child.instrNm} 선생님` },
          { label: "수강반", value: child.classNm },
          { label: "학년", value: child.grade },
          { label: "수강 시작일", value: child.enrlStrtYmd },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-[11px]">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-700 font-semibold text-right max-w-[130px] truncate">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* 미니 달력 */}
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <AttendanceCalendar compact />
      </div>
    </div>
  );
}

// ==========================================
// 3. 홈 대시보드 탭
// ==========================================
function HomeTab({ child }: { child: ChildInfo }) {
  const gaugeItems = [
    { label: "출석률", value: child.attendanceRate, color: "#10B981" },
    { label: "과제 제출률", value: child.assignRate, color: "#3B82F6" },
    { label: "최근 성적", value: child.recentScore, color: "#8B5CF6" },
  ];

  const recentAssigns = [
    { title: "5월 3주차 수학 과제", due: "2026.05.21", status: "제출완료" },
    { title: "영단어 암기 테스트", due: "2026.05.23", status: "제출완료" },
    { title: "6월 1주차 수학 과제", due: "2026.06.07", status: "미제출" },
  ];

  const weeklyAttend = [
    { week: "3/2주", rate: 100 },
    { week: "3/3주", rate: 80 },
    { week: "3/4주", rate: 100 },
    { week: "4/1주", rate: 60 },
    { week: "4/2주", rate: 100 },
    { week: "4/3주", rate: 80 },
    { week: "5/1주", rate: 100 },
  ];

  return (
    <div className="space-y-5">
      {/* 알림 배너 */}
      {child.attendanceRate < 80 && (
        <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700">출석률 주의</p>
            <p className="text-[11px] text-amber-600 mt-0.5">
              {child.name} 학생의 이번 달 출석률이 {child.attendanceRate}
              %입니다. 확인이 필요합니다.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 주간 출석률 차트 */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800">
              주간 출석률 추이
            </h3>
            <span className="text-[10px] text-slate-400">최근 7주</span>
          </div>
          <div className="p-5 flex items-end justify-between h-36 px-6">
            {weeklyAttend.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 flex-1 group relative"
              >
                <div className="absolute -top-5 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {data.rate}%
                </div>
                <div className="w-full max-w-[20px] bg-slate-50 rounded-t-sm h-20 flex items-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${data.rate}%` }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: index * 0.05,
                    }}
                    className={`w-full rounded-t-sm ${data.rate === 100 ? "bg-emerald-500" : data.rate >= 80 ? "bg-emerald-400" : "bg-amber-400"}`}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-400">
                  {data.week}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 게이지 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/40">
            <h3 className="text-xs font-bold text-slate-800">학습 현황 요약</h3>
          </div>
          <div className="grid grid-cols-3 gap-1 p-4 my-auto">
            {gaugeItems.map((item, idx) => {
              const radius = 16;
              const circumference = 2 * Math.PI * radius;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="relative flex items-center justify-center w-11 h-11">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="22"
                        cy="22"
                        r={radius}
                        stroke="#F1F5F9"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="22"
                        cy="22"
                        r={radius}
                        stroke={item.color}
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{
                          strokeDashoffset:
                            circumference * (1 - item.value / 100),
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-slate-700">
                      {item.value}%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 text-center leading-tight">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 과제 현황 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800">최근 과제 현황</h3>
        </div>
        <div className="space-y-2">
          {recentAssigns.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border
                  ${a.status === "제출완료" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}
                >
                  {a.status}
                </span>
                <span className="text-xs text-slate-700">{a.title}</span>
              </div>
              <span className="text-[10px] text-slate-400">{a.due}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. 출석 현황 탭
// ==========================================
function AttendanceTab({ child }: { child: ChildInfo }) {
  const summary = [
    {
      label: "출석",
      count: 18,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "지각",
      count: 2,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
    },
    {
      label: "결석",
      count: 1,
      color: "text-red-500",
      bg: "bg-red-50 border-red-100",
    },
    {
      label: "출석률",
      count: `${child.attendanceRate}%`,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {summary.map(({ label, count, color, bg }) => (
          <div
            key={label}
            className={`bg-white border rounded-xl p-4 text-center ${bg}`}
          >
            <p className="text-[11px] text-slate-400 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{count}</p>
          </div>
        ))}
      </div>
      <AttendanceCalendar />
    </div>
  );
}

// ==========================================
// 5. 성적 분석 탭
// ==========================================
function ScoreTab() {
  const scores = [
    { subject: "수학", scores: [72, 78, 80, 85, 88], avg: 84 },
    { subject: "영어", scores: [65, 70, 75, 72, 80], avg: 78 },
    { subject: "국어", scores: [80, 82, 78, 85, 90], avg: 88 },
  ];

  return (
    <div className="space-y-4">
      {scores.map((s) => (
        <div
          key={s.subject}
          className="bg-white border border-slate-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800">{s.subject}</h3>
            <span className="text-[11px] font-bold text-blue-600">
              평균 {s.avg}점
            </span>
          </div>
          <div className="flex items-end gap-2 h-16">
            {s.scores.map((score, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-slate-400">{score}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(score / 100) * 48}px` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="w-full bg-blue-400 rounded-t-sm"
                />
                <span className="text-[9px] text-slate-400">{i + 1}회</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 6. 과제 제출 탭
// ==========================================
function AssignTab() {
  const assigns = [
    {
      title: "5월 1주차 수학 과제",
      due: "2026.05.07",
      status: "제출완료",
      score: 95,
    },
    {
      title: "5월 2주차 수학 과제",
      due: "2026.05.14",
      status: "제출완료",
      score: 88,
    },
    {
      title: "5월 3주차 수학 과제",
      due: "2026.05.21",
      status: "제출완료",
      score: 90,
    },
    {
      title: "영단어 암기 테스트",
      due: "2026.05.23",
      status: "제출완료",
      score: 85,
    },
    {
      title: "6월 1주차 수학 과제",
      due: "2026.06.07",
      status: "미제출",
      score: null,
    },
    {
      title: "6월 2주차 수학 과제",
      due: "2026.06.14",
      status: "미제출",
      score: null,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/40 flex justify-between">
        <h3 className="text-xs font-bold text-slate-800">과제 제출 목록</h3>
        <span className="text-[10px] text-slate-400">
          제출 {assigns.filter((a) => a.status === "제출완료").length}/
          {assigns.length}
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {assigns.map((a, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border
                ${a.status === "제출완료" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}
              >
                {a.status}
              </span>
              <span className="text-xs text-slate-700">{a.title}</span>
            </div>
            <div className="flex items-center gap-4">
              {a.score && (
                <span className="text-xs font-bold text-blue-600">
                  {a.score}점
                </span>
              )}
              <span className="text-[10px] text-slate-400">{a.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. 메인 페이지
// ==========================================
export default function ParentPage() {
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN[0].id);
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const child = MOCK_CHILDREN.find((c) => c.id === selectedChildId)!;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans antialiased">
      {/* 상단 헤더 */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-sm font-black tracking-wider text-slate-900 uppercase font-mono">
              HERMES 학부모
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
              학
            </div>
            <p className="text-xs font-bold text-slate-700">학부모님</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* 사이드바 */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <ParentSidebar
              child={child}
              children={MOCK_CHILDREN}
              selectedId={selectedChildId}
              onSelect={(id) => {
                setSelectedChildId(id);
                setActiveTab("home");
              }}
            />
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col gap-5">
            {/* 탭 */}
            <nav className="flex items-center gap-5 border-b border-slate-200 pb-0.5 overflow-x-auto">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 text-xs font-bold relative whitespace-nowrap transition-colors shrink-0
                      ${isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="parentTabUnderline"
                        className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-emerald-500 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 탭 콘텐츠 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedChildId}-${activeTab}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "home" && <HomeTab child={child} />}
                {activeTab === "attendance" && <AttendanceTab child={child} />}
                {activeTab === "score" && <ScoreTab />}
                {activeTab === "assign" && <AssignTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
