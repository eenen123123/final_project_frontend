import { useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import {
  HomeTab,
  NoticeTab,
  LectureTab,
  AssignTab,
  QnaTab,
  DataroomTab,
  ExamTab,
} from "./components/ClassroomTabs";
import type { ClassroomInfo } from "../../types/ClassroomInterface";

export type TabType =
  | "home"
  | "notice"
  | "lecture"
  | "assign"
  | "qna"
  | "dataroom"
  | "exam";

const TABS: { id: TabType; label: string; icon: string; badge?: number }[] = [
  { id: "home",     label: "홈",        icon: "fa-solid fa-house" },
  { id: "notice",   label: "공지사항",   icon: "fa-solid fa-bullhorn" },
  { id: "lecture",  label: "온라인 강의", icon: "fa-solid fa-play" },
  { id: "assign",   label: "과제 관리",  icon: "fa-solid fa-file-lines" },
  { id: "qna",      label: "Q&A",       icon: "fa-solid fa-comments" },
  { id: "dataroom", label: "자료실",     icon: "fa-solid fa-folder-open" },
  { id: "exam",     label: "시험 관리",  icon: "fa-solid fa-clipboard-question" },
];

export default function ClassroomPage() {
  const { classroom } = useOutletContext<{ classroom: ClassroomInfo | null }>();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const classSn = classroom?.classSn ?? null;

  return (
    <div className="flex flex-col flex-1">
      {/* 탭 내비게이션 */}
      <nav className="bg-white border-t border-slate-100 px-10 overflow-x-auto">
        <div className="flex items-end">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-3 text-sm whitespace-nowrap flex items-center gap-2 border-b-2 -mb-px transition-colors duration-150
                  ${isActive
                    ? "text-blue-600 border-blue-600 font-semibold"
                    : "text-slate-500 border-transparent hover:text-slate-700 font-medium"
                  }`}
              >
                <i className={`${tab.icon} text-xs`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 탭 본문 */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-10 py-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {(() => {
              switch (activeTab) {
                case "home":
                  return <HomeTab classSn={classSn} onTabChange={setActiveTab} />;
                case "notice":
                  return <NoticeTab classSn={classSn} />;
                case "lecture":
                  return <LectureTab courseSn={classroom?.courseSn ?? null} />;
                case "assign":
                  return <AssignTab classSn={classSn} />;
                case "qna":
                  return <QnaTab classSn={classSn} />;
                case "dataroom":
                  return <DataroomTab classSn={classSn} />;
                case "exam":
                  return <ExamTab classSn={classSn} />;
              }
            })()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
