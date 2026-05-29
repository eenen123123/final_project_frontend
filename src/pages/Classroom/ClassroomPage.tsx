import { useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import ClassroomLeftPanel from "./components/ClassroomLeftPanel";
import { HomeTab, NoticeTab, LectureTab, AssignTab, QnaTab, ScoreTab } from "./components/ClassroomTabs";
import type { ClassroomInfo } from "../../types/ClassroomInterface";

export type TabType = "home" | "notice" | "lecture" | "assign" | "qna" | "score";

const TABS: { id: TabType; label: string; badge?: number }[] = [
  { id: "home", label: "홈" },
  { id: "notice", label: "공지사항", badge: 1 },
  { id: "lecture", label: "온라인 강의" },
  { id: "assign", label: "과제 제출", badge: 2 },
  { id: "qna", label: "1:1 Q&A" },
  { id: "score", label: "성적 관리" },
];

export default function ClassroomPage() {
  const { classroom } = useOutletContext<{ classroom: ClassroomInfo | null }>();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  return (
    <div className="flex flex-1 overflow-hidden">
      <ClassroomLeftPanel
        instructor={classroom}
        onInstructorPageClick={() => alert("강사 페이지로 이동")}
      />

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

          {/* 탭 본문 */}
          <div className="w-full">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {(() => {
                switch (activeTab) {
                  case "home":    return <HomeTab onTabChange={(tab) => setActiveTab(tab)} />;
                  case "notice":  return <NoticeTab />;
                  case "lecture": return <LectureTab />;
                  case "assign":  return <AssignTab />;
                  case "qna":     return <QnaTab />;
                  case "score":   return <ScoreTab />;
                }
              })()}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
