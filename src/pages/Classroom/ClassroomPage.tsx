import { useState } from "react";
import { motion } from "framer-motion"; 
import ClassroomLeftPanel from "./components/ClassroomLeftPanel"; 
import { HomeTab, NoticeTab, LectureTab, AssignTab, QnaTab, ScoreTab } from "./components/ClassroomTabs"; 

// 💡 외부(Tabs 파일)에서 사용할 수 있도록 타입을 export 합니다.
export type TabType = "home" | "notice" | "lecture" | "assign" | "qna" | "score";

const TABS: { id: TabType; label: string; badge?: number }[] = [
  { id: "home", label: "홈" },
  { id: "notice", label: "공지사항", badge: 1 },
  { id: "lecture", label: "온라인 강의" },
  { id: "assign", label: "과제 제출", badge: 2 },
  { id: "qna", label: "1:1 Q&A" },
  { id: "score", label: "성적 관리" },
];

const TEACHER_INFO = {
  name: "김민준",
  subject: "영어",
  className: "영어 A반",
  schedule: "월 · 수 · 금",
  time: "17:00 ~ 19:00",
  room: "302호",
};

export default function ClassroomPage() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased selection:bg-blue-100">
      
      {/* 상단 미니멀 헤더 */}
      <header className="bg-white border-b border-slate-200/60 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3.5">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold w-9 h-9 flex items-center justify-center rounded-xl text-xs tracking-tighter">
            H
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              HERMES
              <span className="text-[11px] font-medium text-slate-300">|</span>
              <span className="text-[13px] font-semibold text-slate-600">{TEACHER_INFO.className}</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">
              Classroom Dashboard
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all relative">
            <span className="text-sm">🔔</span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white"></span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all">
            <span className="text-sm">⚙️</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 선생님 프로필 패널 */}
        <ClassroomLeftPanel
          teacher={TEACHER_INFO}
          onTeacherPageClick={() => alert("선생님 페이지로 이동")}
        />

        {/* 오른쪽 스크롤 메인 영역 */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          <div className="max-w-[1000px] w-full flex flex-col gap-5">
            
            {/* 탭바 */}
            <nav className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl w-fit border border-slate-200/10 relative">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg relative whitespace-nowrap flex items-center gap-1.5 z-10 transition-colors duration-200
                      ${isActive ? "text-white" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-blue-600 rounded-lg -z-10 shadow-sm shadow-blue-500/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    <span>{tab.label}</span>
                    
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold leading-none transition-colors duration-200
                        ${isActive ? "bg-white/20 text-white" : "bg-red-50 text-red-500"}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 본문 컴포넌트 렌더링 영역 */}
            <div className="w-full">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {(() => {
                  switch (activeTab) {
                    // 💡 컴파일러가 완벽히 추론할 수 있도록 온전한 화살표 함수 형태로 내려줍니다.
                    case "home": return <HomeTab onTabChange={(tab) => setActiveTab(tab)} />;
                    case "notice": return <NoticeTab />;
                    case "lecture": return <LectureTab />;
                    case "assign": return <AssignTab />;
                    case "qna": return <QnaTab />;
                    case "score": return <ScoreTab />;
                  }
                })()}
              </motion.div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}