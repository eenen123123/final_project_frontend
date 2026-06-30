import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  parentApi,
  type ChildInfo,
  type AttendanceResponse,
  type AssignItem,
  type ExamItem,
} from "../api/parentApi";

// ==========================================
// 0. 타입
// ==========================================
type TabType = "home" | "attendance" | "score" | "assign";

const TABS: { id: TabType; label: string }[] = [
  { id: "home", label: "홈 대시보드" },
  { id: "attendance", label: "출석 현황" },
  { id: "score", label: "성적 분석" },
  { id: "assign", label: "과제 제출 현황" },
];

// ==========================================
// 1. 출석 달력
// ==========================================
function AttendanceCalendar({
  attendance,
}: {
  attendance: AttendanceResponse | null;
}) {
  const now = new Date();
  const year = attendance?.year ?? now.getFullYear();
  const month = attendance?.month ?? now.getMonth() + 1;
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => new Date(year, month - 1, 0).getDate() - firstDayOfWeek + 1 + i,
  );

  const getStatus = (day: number) =>
    attendance?.records.find((r) => r.day === day)?.status;

  const statusStyle: Record<string, string> = {
    ATTEND: "bg-emerald-500 text-white",
    LATE: "bg-amber-400 text-white",
    ABSENT: "bg-red-400 text-white",
  };

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-slate-700">
          {year}년 {month}월 출석 현황
        </span>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />출석
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />지각
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />결석
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div
            key={d}
            className={`text-xs font-bold pb-2 ${i === 0 ? "text-red-400" : "text-slate-400"}`}
          >
            {d}
          </div>
        ))}
        {prevDays.map((d) => (
          <div
            key={`p${d}`}
            className="h-9 flex items-center justify-center text-xs text-slate-200"
          >
            {d}
          </div>
        ))}
        {days.map((d) => {
          const status = getStatus(d);
          const isToday = isCurrentMonth && d === today.getDate();
          return (
            <div
              key={d}
              className={`h-9 flex items-center justify-center text-xs rounded-lg font-semibold
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
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* 자녀 선택 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block mb-3">
          자녀 선택
        </span>
        <div className="flex flex-col gap-2">
          {children.map((c) => (
            <button
              key={c.studentId}
              onClick={() => onSelect(c.studentId)}
              className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all border
                ${selectedId === c.studentId ? "border-emerald-300 bg-emerald-50" : "border-slate-100 hover:bg-slate-50"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${selectedId === c.studentId ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {c.studentName.length > 1 ? c.studentName[1] : c.studentName[0]}
              </div>
              <div>
                <p className={`text-sm font-bold ${selectedId === c.studentId ? "text-emerald-700" : "text-slate-700"}`}>
                  {c.studentName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{c.classroomName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 자녀 정보 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block">
          자녀 수강 정보
        </span>
        {[
          { label: "담당 강사", value: `${child.instructorName} 선생님` },
          { label: "수강반", value: child.classroomName },
          { label: "재학 학교", value: child.enrlSchlNm ?? "-" },
          { label: "수강 시작일", value: child.enrollStartDate },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-700 font-semibold text-right max-w-[150px] truncate">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. 홈 대시보드 탭
// ==========================================
function HomeTab({
  child,
  assigns,
}: {
  child: ChildInfo;
  assigns: AssignItem[];
}) {
  const gaugeItems = [
    { label: "출석률", value: child.attendanceRate ?? 0, unit: "%", color: "#10B981" },
    { label: "과제 제출률", value: child.assignmentRate ?? 0, unit: "%", color: "#3B82F6" },
    { label: "평균 성적", value: child.recentExamAvgScore ?? 0, unit: "점", color: "#8B5CF6" },
  ];

  const recentAssigns = assigns.slice(0, 5);

  return (
    <div className="space-y-5">
      {/* 출석률 주의 배너 */}
      {child.attendanceRate != null && child.attendanceRate < 80 && (
        <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-700">출석률 주의</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {child.studentName} 학생의 이번 달 출석률이 {child.attendanceRate}%입니다. 확인이 필요합니다.
            </p>
          </div>
        </div>
      )}

      {/* 학습 현황 게이지 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/40">
          <h3 className="text-sm font-bold text-slate-800">학습 현황 요약</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 p-6">
          {gaugeItems.map((item, idx) => {
            const radius = 24;
            const circumference = 2 * Math.PI * radius;
            return (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className="relative flex items-center justify-center w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r={radius} stroke="#F1F5F9" strokeWidth="4" fill="transparent" />
                    <motion.circle
                      cx="32" cy="32" r={radius}
                      stroke={item.color} strokeWidth="4" fill="transparent"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference * (1 - item.value / 100) }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-700">
                    {Number.isInteger(item.value) ? item.value : item.value.toFixed(1)}{item.unit}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-400 text-center leading-tight">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 최근 과제 현황 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4">최근 과제 현황</h3>
        {recentAssigns.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">과제가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {recentAssigns.map((a) => (
              <div
                key={a.asgmtSn}
                className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border
                    ${a.submitted ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                    {a.submitted ? "제출완료" : "미제출"}
                  </span>
                  <span className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: a.asgmtNm }} />
                </div>
                <span className="text-xs text-slate-400">{a.dueDt ? a.dueDt.slice(0, 10) : "-"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. 출석 현황 탭
// ==========================================
function AttendanceTab({
  child,
  attendance,
  viewYear,
  viewMonth,
  onPrev,
  onNext,
}: {
  child: ChildInfo;
  attendance: AttendanceResponse | null;
  viewYear: number;
  viewMonth: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const now = new Date();
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth() + 1;

  const summary = [
    { label: "출석", count: attendance?.attendCount ?? "-", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
    { label: "지각", count: attendance?.lateCount ?? "-", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
    { label: "결석", count: attendance?.absentCount ?? "-", color: "text-red-500", bg: "bg-red-50 border-red-100" },
    { label: "출석률", count: `${child.attendanceRate ?? 0}%`, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-base font-bold text-slate-700">{viewYear}년 {viewMonth}월</span>
        <button
          onClick={onNext}
          disabled={isCurrentMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {summary.map(({ label, count, color, bg }) => (
          <div key={label} className={`bg-white border rounded-xl p-5 text-center ${bg}`}>
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
          </div>
        ))}
      </div>
      <AttendanceCalendar attendance={attendance} />
    </div>
  );
}

// ==========================================
// 5. 성적 분석 탭
// ==========================================
function ScoreTab({ exams }: { exams: ExamItem[] }) {
  const attempted = exams.filter((e) => e.attempted && e.score != null);

  if (exams.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
        <p className="text-sm text-slate-400">등록된 시험이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800">시험 성적 목록</h3>
        <span className="text-xs text-slate-400">응시 {attempted.length}/{exams.length}</span>
      </div>
      <div className="divide-y divide-slate-100">
        {exams.map((e) => (
          <div key={e.examSn} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border
                ${e.status === "ONGOING" ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : e.status === "UPCOMING" ? "bg-blue-50 text-blue-600 border-blue-100"
                  : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                {e.status === "ONGOING" ? "진행중" : e.status === "UPCOMING" ? "예정" : "종료"}
              </span>
              <span className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: e.examNm }} />
            </div>
            <div className="flex items-center gap-5">
              {e.score != null ? (
                <span className="text-sm font-bold text-blue-600">{e.score}점</span>
              ) : (
                <span className="text-sm text-slate-300">미응시</span>
              )}
              <span className="text-xs text-slate-400">{e.examEndDt ? e.examEndDt.slice(0, 10) : "-"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 6. 과제 제출 탭
// ==========================================
function AssignTab({ assigns }: { assigns: AssignItem[] }) {
  const submitted = assigns.filter((a) => a.submitted).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800">과제 제출 목록</h3>
        <span className="text-xs text-slate-400">제출 {submitted}/{assigns.length}</span>
      </div>
      {assigns.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-10">과제가 없습니다.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {assigns.map((a) => (
            <div key={a.asgmtSn} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border
                  ${a.submitted ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                  {a.submitted ? "제출완료" : "미제출"}
                </span>
                <span className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: a.asgmtNm }} />
              </div>
              <div className="flex items-center gap-5">
                {a.score != null && (
                  <span className="text-sm font-bold text-blue-600">{a.score}점</span>
                )}
                <span className="text-xs text-slate-400">{a.dueDt ? a.dueDt.slice(0, 10) : "-"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. 메인 페이지
// ==========================================
export default function ParentPage() {
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const [attendance, setAttendance] = useState<AttendanceResponse | null>(null);
  const [assigns, setAssigns] = useState<AssignItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);

  const [loading, setLoading] = useState(true);

  const child = children.find((c) => c.studentId === selectedId) ?? null;

  // 자녀 목록 로드
  useEffect(() => {
    parentApi
      .getChildren()
      .then((data) => {
        setChildren(data);
        if (data.length > 0) setSelectedId(data[0].studentId);
      })
      .finally(() => setLoading(false));
  }, []);

  // 출석 데이터 로드 (월 변경 시 재조회)
  useEffect(() => {
    const target = children.find((c) => c.studentId === selectedId);
    if (!target) return;
    let cancelled = false;
    parentApi.getAttendance(target.studentId, viewYear, viewMonth)
      .then((att) => { if (!cancelled) setAttendance(att); })
      .catch(() => { if (!cancelled) setAttendance(null); });
    return () => { cancelled = true; };
  }, [selectedId, children, viewYear, viewMonth]);

  // 과제/시험 데이터 로드 (자녀 변경 시)
  useEffect(() => {
    const target = children.find((c) => c.studentId === selectedId);
    if (!target) return;
    let cancelled = false;
    Promise.all([
      parentApi.getAssignments(target.studentId, target.classSn),
      parentApi.getExams(target.studentId, target.classSn),
    ]).then(([asgn, exm]) => {
      if (cancelled) return;
      setAssigns(asgn);
      setExams(exm);
    }).catch(() => {
      if (cancelled) return;
      setAssigns([]);
      setExams([]);
    });
    return () => { cancelled = true; };
  }, [selectedId, children]);

  const handlePrevMonth = () => {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    const n = new Date();
    if (viewYear === n.getFullYear() && viewMonth === n.getMonth() + 1) return;
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  };

  const handleSelectChild = (id: string) => {
    setSelectedId(id);
    setActiveTab("home");
    const n = new Date();
    setViewYear(n.getFullYear());
    setViewMonth(n.getMonth() + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-sm text-slate-400">불러오는 중...</p>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-sm text-slate-400">등록된 자녀 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans antialiased">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-start">
          {/* 사이드바 */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            {child && (
              <ParentSidebar
                child={child}
                children={children}
                selectedId={selectedId!}
                onSelect={handleSelectChild}
              />
            )}
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col gap-6">
            {/* 탭 */}
            <nav className="flex items-center gap-6 border-b border-slate-200 pb-0.5 overflow-x-auto">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2.5 text-sm font-bold relative whitespace-nowrap transition-colors shrink-0
                      ${isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="parentTabUnderline"
                        className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-emerald-500 rounded-full"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 탭 콘텐츠 */}
            {child ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedId}-${activeTab}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === "home" && <HomeTab child={child} assigns={assigns} />}
                  {activeTab === "attendance" && (
                    <AttendanceTab
                      child={child}
                      attendance={attendance}
                      viewYear={viewYear}
                      viewMonth={viewMonth}
                      onPrev={handlePrevMonth}
                      onNext={handleNextMonth}
                    />
                  )}
                  {activeTab === "score" && <ScoreTab exams={exams} />}
                  {activeTab === "assign" && <AssignTab assigns={assigns} />}
                </motion.div>
              </AnimatePresence>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
