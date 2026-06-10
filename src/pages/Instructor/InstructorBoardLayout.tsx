import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import api from "../../api/api";

interface InstructorSummary {
  userName: string;
  subject: string;
  lectureCount: number;
}

const TABS = [
  { id: "courses", label: "강좌목록", path: (uuid: string) => `/instructor/${uuid}/courses` },
  { id: "notice", label: "공지사항", path: (uuid: string) => `/instructor/${uuid}/notice` },
  { id: "qna", label: "선생님 Q&A", path: (uuid: string) => `/instructor/${uuid}/qna` },
  { id: "dataroom", label: "학습자료실", path: (uuid: string) => `/instructor/${uuid}/dataroom` },
];

export default function InstructorBoardLayout() {
  const { instrUuid } = useParams<{ instrUuid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [instructor, setInstructor] = useState<InstructorSummary | null>(null);

  const uuid = instrUuid ?? "";

  useEffect(() => {
    if (!uuid) return;
    api
      .get<InstructorSummary>(`/api/instructors/${uuid}`)
      .then((res) => setInstructor(res.data))
      .catch((e) => console.error("강사 정보 조회 실패", e));
  }, [uuid]);

  const activeTab =
    TABS.find((tab) => location.pathname.includes(`/${tab.id}`))?.id ?? "courses";

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto flex gap-8 py-10 px-4">
        {/* 사이드바 */}
        <aside className="w-52 shrink-0">
          {instructor && (
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-1">{instructor.subject}영역</p>
              <h2 className="text-lg font-extrabold text-gray-800">
                {instructor.userName} 선생님
              </h2>
            </div>
          )}
          <nav>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path(uuid))}
                className={`w-full text-left py-3 border-b border-gray-200 text-sm flex items-center justify-between group transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>
                  {tab.label}
                  {tab.id === "courses" && instructor && (
                    <span className="ml-1.5 text-gray-400">
                      ({instructor.lectureCount})
                    </span>
                  )}
                </span>
                <ChevronRight
                  size={13}
                  className={
                    activeTab === tab.id
                      ? "text-blue-400"
                      : "text-gray-300 group-hover:text-gray-500"
                  }
                />
              </button>
            ))}
          </nav>

          <button
            onClick={() => navigate(`/instructor/${uuid}`)}
            className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 강사 소개로 돌아가기
          </button>
        </aside>

        {/* 콘텐츠 영역 */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
