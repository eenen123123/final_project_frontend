/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 0. 타입 및 목데이터
// ==========================================
export type TabType =
  | "home"
  | "notice"
  | "lecture"
  | "assign"
  | "qna"
  | "score";

interface ClassroomInfo {
  instrNm: string;
  classNm: string;
  courseNm: string;
  memberCount: number;
  enrlStrtYmd: string;
}

const MOCK_CLASSROOM: ClassroomInfo = {
  instrNm: "김민준",
  classNm: "고등 영어 최고위 마스터반",
  courseNm: "2026 수능 만점 전략 특강",
  memberCount: 28,
  enrlStrtYmd: "2026-03-02",
};

const TABS: { id: TabType; label: string; badge?: number }[] = [
  { id: "home", label: "홈 대시보드" },
  { id: "notice", label: "공지사항", badge: 1 },
  { id: "lecture", label: "온라인 강의" },
  { id: "assign", label: "과제 제출", badge: 2 },
  { id: "qna", label: "1:1 질의응답" },
  { id: "score", label: "성적 분석" },
];

const CLASS_DAYS = [5, 7, 9, 12, 14, 16, 19, 21, 23, 26, 28, 30];

// ==========================================
// 1. 구조화된 통합 상단 헤더 (Header)
// ==========================================
function ClassroomHeader({ instructor }: { instructor: ClassroomInfo }) {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 좌측 브랜드 및 현재 클래스 정보 */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-black tracking-wider text-slate-900 uppercase font-mono">
              E-CLASSROOM
            </span>
          </div>
          <div className="h-4 w-px bg-slate-200 shrink-0" />
          <h1 className="text-sm font-bold text-slate-800 truncate tracking-tight">
            {instructor.classNm}{" "}
            <span className="font-normal text-slate-400 text-xs ml-15">
              | {instructor.courseNm}
            </span>
          </h1>
        </div>

        {/* 우측 학생 간이 프로필 */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-700">홍길동 학생</p>
            <p className="text-[10px] text-emerald-600 font-semibold">
              강의실 접속 중
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            GD
          </div>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 2. 완벽 정렬 스케줄러 (달력 컴포넌트)
// ==========================================
function ClassroomCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(20);

  const firstDay = 4;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const prevDays = Array.from(
    { length: firstDay },
    (_, i) => 30 - firstDay + 1 + i,
  );

  return (
    <>
      <div
        onClick={() => {
          setSelectedDay(20);
          setIsOpen(true);
        }}
        className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-xl p-4 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700">2026년 5월</span>
          <span className="text-[11px] text-slate-400 group-hover:text-blue-600 font-medium transition-colors">
            일정 보기 ➔
          </span>
        </div>

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
              className="h-5.5 flex items-center justify-center text-[10px] text-slate-200"
            >
              {d}
            </div>
          ))}
          {days.map((d) => {
            const isToday = d === 20;
            const isClass = CLASS_DAYS.includes(d);
            return (
              <div
                key={d}
                className={`h-5.5 flex flex-col items-center justify-center text-[11px] rounded-md font-semibold relative transition-colors
                  ${isToday ? "bg-blue-600 text-white font-bold shadow-xs" : "text-slate-600"}
                  ${!isToday && isClass ? "bg-blue-50 text-blue-600 font-bold" : ""}
                `}
              >
                <span>{d}</span>
                {!isToday && isClass && (
                  <span className="w-1 h-1 rounded-full bg-blue-400 absolute bottom-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden border border-slate-200"
            >
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    5월 수업 캘린더
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-5 bg-white">
                <div className="md:col-span-3 border border-slate-200 rounded-xl p-3.5 bg-slate-50/30">
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["일", "월", "화", "수", "목", "금", "토"].map(
                      (d, idx) => (
                        <div
                          key={d}
                          className={`text-[10px] font-bold pb-2 ${idx === 0 ? "text-red-500/70" : "text-slate-400"}`}
                        >
                          {d}
                        </div>
                      ),
                    )}
                    {prevDays.map((d) => (
                      <div
                        key={`mp${d}`}
                        className="h-8.5 flex items-center justify-center text-[11px] text-slate-200"
                      >
                        {d}
                      </div>
                    ))}
                    {days.map((d, idx) => {
                      const isToday = d === 20;
                      const isClass = CLASS_DAYS.includes(d);
                      const isSelected = selectedDay === d;
                      const isSunday = (firstDay + idx) % 7 === 0;

                      return (
                        <button
                          key={`md${d}`}
                          onClick={() => setSelectedDay(d)}
                          className={`h-8.5 text-[11px] rounded-lg font-semibold flex flex-col items-center justify-center relative transition-all border
                            ${isToday ? "bg-blue-600 text-white border-blue-600" : "border-transparent text-slate-600 hover:bg-slate-100"}
                            ${!isToday && isClass ? "bg-blue-50 text-blue-600 font-bold" : ""}
                            ${isSunday && !isToday ? "!text-red-500/70" : ""} 
                            ${isSelected ? "ring-2 ring-blue-500/20 border-blue-500 z-10" : ""}
                          `}
                        >
                          <span>{d}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col justify-between gap-4">
                  <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                      5월 {selectedDay}일 상세일정
                    </p>
                    {CLASS_DAYS.includes(selectedDay!) ? (
                      <div className="text-[11px] text-slate-600 space-y-1">
                        <p className="font-bold text-blue-600">
                          정규 온라인 라이브 수업
                        </p>
                        <p className="text-slate-400">
                          수업 시간: 19:00 ~ 21:00
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 py-2">
                        지정된 정규 라이브 수업이 없습니다.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ==========================================
// 3. 정돈된 좌측 패널 (사이드바)
// ==========================================
function ClassroomLeftPanel({ instructor }: { instructor: ClassroomInfo }) {
  return (
    <div className="space-y-5 w-full">
      {/* 강사 및 클래스 매칭 정보 */}
      <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-2xs">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-2">
          담당 강사
        </span>
        <h3 className="font-bold text-slate-800 text-sm">
          {instructor.instrNm} 선생님
        </h3>
        <p className="text-xs text-slate-500 mt-1">{instructor.classNm}</p>
      </div>

      {/* 학습 정보 상세 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
          나의 강의실 정보
        </span>
        <div className="space-y-2 text-[11px] text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">강좌명</span>
            <span className="text-slate-700 font-semibold max-w-[120px] truncate text-right">
              {instructor.courseNm}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">수강 정원</span>
            <span className="text-slate-700 font-semibold">
              {instructor.memberCount}명
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">반 개강일</span>
            <span className="text-slate-500">{instructor.enrlStrtYmd}</span>
          </div>
        </div>
      </div>

      {/* 캘린더 위젯 */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
        <ClassroomCalendar />
      </div>
    </div>
  );
}

// ==========================================
// 4. 우측 메인 대시보드 콘텐츠
// ==========================================
function HomeTab({ onTabChange }: { onTabChange: (tab: TabType) => void }) {
  const weeklyStudyData = [
    { day: "월", time: 120, label: "2시간" },
    { day: "화", time: 90, label: "1.5시간" },
    { day: "수", time: 180, label: "3시간" },
    { day: "목", time: 60, label: "1시간" },
    { day: "금", time: 150, label: "2.5시간" },
    { day: "토", time: 40, label: "40분" },
    { day: "일", time: 0, label: "0분" },
  ];
  const maxTime = 180;

  return (
    <div className="space-y-5">
      {/* 고도화된 추천 미션 배너 */}
      <div className="border border-blue-100 bg-blue-50/40 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-blue-50/70">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
            TODAY MISSION
          </span>
          <p className="text-xs font-bold text-slate-800 leading-tight">
            수능 고난도 빈칸추론 핵심 문항 해설집 분석 및 영단어 복습
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shrink-0 w-full sm:w-auto">
          미션 가기 ➔
        </button>
      </div>

      {/* 균형 잡힌 계측 지표 그리드 (카드의 연장선 정렬 보정) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 학습 분석 차트 */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-2xs">
          <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800">
              주간 학습 시간 분석
            </h3>
            <span className="text-[10px] text-slate-400">실시간 연동</span>
          </div>

          <div className="p-5 pt-8 flex items-end justify-between px-6 h-36">
            {weeklyStudyData.map((data, index) => {
              const heightPercent =
                data.time > 0 ? (data.time / maxTime) * 100 : 4;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 flex-1 group relative"
                >
                  <div className="absolute -top-6 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {data.label}
                  </div>
                  <div className="w-full max-w-[20px] bg-slate-50 rounded-t-sm h-20 flex items-end overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: index * 0.02,
                      }}
                      className={`w-full rounded-t-sm transition-colors ${
                        data.time === maxTime
                          ? "bg-blue-600"
                          : "bg-blue-400 group-hover:bg-blue-500"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 transition-colors group-hover:text-slate-700">
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 달성도 원형 게이지 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-2xs">
          <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/40">
            <h3 className="text-xs font-bold text-slate-800">
              목표 영역별 달성 현황
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-1 p-4 my-auto">
            {[
              { label: "과제제출", value: 85, color: "#2563EB" },
              { label: "인강진도", value: 60, color: "#3B82F6" },
              { label: "출석 지수", value: 92, color: "#10B981" },
            ].map((item, idx) => {
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
                  <span className="text-[10px] font-bold text-slate-400 text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 정렬 맞춤 공지사항 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h3 className="text-xs font-bold text-slate-800">
            최근 업데이트 공지
          </h3>
          <button
            onClick={() => onTabChange("notice")}
            className="text-[11px] font-medium text-slate-400 hover:text-blue-600 transition-colors"
          >
            더보기 ➔
          </button>
        </div>
        <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-slate-200 transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase">
              필독
            </span>
            <h4 className="text-xs text-slate-700 font-semibold truncate">
              5월 오프라인 모의평가 시간표 및 유의사항 안내
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 ml-4">2026.05.15</span>
        </div>
      </div>
    </div>
  );
}

function NoticeTab() {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
      📌 공지사항 모듈이 성공적으로 로드되었습니다.
    </div>
  );
}
function LectureTab() {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
      📺 고화질 온라인 VOD 원격 강의실입니다.
    </div>
  );
}
function AssignTab() {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
      📤 과제 제출 및 평가 피드백 현황 대시보드입니다.
    </div>
  );
}
function QnaTab() {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
      💬 담당 선생님 및 전문 튜터 전용 1:1 질의응답 오피스입니다.
    </div>
  );
}
function ScoreTab() {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
      📊 학업 모의평가 성적 지표 분석 리포트입니다.
    </div>
  );
}

// ==========================================
// 5. 완벽한 화면 밸런스를 구현한 최종 레이아웃
// ==========================================
export default function ClassroomPage() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans antialiased flex flex-col">
      {/* 1. 상단 글로벌 헤더 장착 (정렬의 기준점 확보) */}
      <ClassroomHeader instructor={MOCK_CLASSROOM} />

      {/* 2. 메인 콘텐츠 컨테이너 (전체 화면 시 상하좌우 정렬 무너짐 원천 차단) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 반응형 12컬럼 그리드 시스템 도입하여 왼쪽 패널과 오른쪽 본문을 타이트하게 고정 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* ◀ 좌측 사이드바: 12칸 중 3칸 배정 (md 이상부터 본문과 가깝게 고정) */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <ClassroomLeftPanel instructor={MOCK_CLASSROOM} />
          </aside>

          {/* ▶ 우측 메인 콘텐츠 대시보드: 12칸 중 9칸 배정 */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col gap-5">
            {/* 상단 헤더 라인 및 그리드 폭과 칼같이 일치시킨 탭 바 */}
            <nav className="flex items-center gap-5 border-b border-slate-200 pb-0.5 w-full overflow-x-auto scrollbar-none">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 text-xs font-bold relative whitespace-nowrap flex items-center gap-1.5 transition-colors duration-150 shrink-0
                      ${isActive ? "text-blue-600 font-bold" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <span>{tab.label}</span>

                    {tab.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold leading-none
                        ${isActive ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-slate-100 text-slate-400"}`}
                      >
                        {tab.badge}
                      </span>
                    )}

                    {/* 슬림 매칭 언더라인 바 */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-blue-600 rounded-full"
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

            {/* 동적 본문 서브 모듈 뷰포트 */}
            <div className="w-full">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {(() => {
                  switch (activeTab) {
                    case "home":
                      return (
                        <HomeTab onTabChange={(tab) => setActiveTab(tab)} />
                      );
                    case "notice":
                      return <NoticeTab />;
                    case "lecture":
                      return <LectureTab />;
                    case "assign":
                      return <AssignTab />;
                    case "qna":
                      return <QnaTab />;
                    case "score":
                      return <ScoreTab />;
                  }
                })()}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
