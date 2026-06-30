import { motion } from "framer-motion";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
  HomeTab, NoticeTab, LectureTab, AssignTab, QnaTab, DataroomTab, ExamTab, AttendTab,
} from "./components/ClassroomTabs";
import type { ClassroomInfo } from "../../types/ClassroomInterface";
import type { TabType } from "../../layouts/ClassroomLayout";

export default function ClassroomPage() {
  const { classroom, activeTab } =
    useOutletContext<{ classroom: ClassroomInfo | null; activeTab: TabType }>();
  const navigate = useNavigate();
  const { classId } = useParams();

  const classSn = classroom?.classSn ?? null;
  const onTabChange = (tab: TabType) =>
    navigate(`/classroom/${classId}?tab=${tab}`, { replace: true });

  return (
    <main className="flex-1 overflow-y-scroll">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {(() => {
            switch (activeTab) {
              case "home":     return <HomeTab classSn={classSn} onTabChange={onTabChange} />;
              case "notice":   return <NoticeTab classSn={classSn} />;
              case "lecture":  return <LectureTab courseSn={classroom?.courseSn ?? null} />;
              case "assign":   return <AssignTab classSn={classSn} />;
              case "qna":      return <QnaTab classSn={classSn} />;
              case "dataroom": return <DataroomTab classSn={classSn} />;
              case "exam":     return <ExamTab classSn={classSn} />;
              case "attend":   return <AttendTab classSn={classSn} startYmd={classroom?.enrlStrtYmd ?? null} endYmd={classroom?.enrlEndYmd ?? null} />;
            }
          })()}
        </motion.div>
      </div>
    </main>
  );
}
