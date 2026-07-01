import { useEffect, useState } from "react";
import { Outlet, useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import type { ClassroomInfo } from "../types/ClassroomInterface";
import { useAuth } from "../auth/AuthContext";

export type TabType = "home" | "notice" | "lecture" | "assign" | "qna" | "dataroom" | "exam";

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: "home", label: "홈", icon: "fa-solid fa-house" },
  { id: "notice", label: "공지사항", icon: "fa-solid fa-bullhorn" },
  { id: "lecture", label: "강의", icon: "fa-solid fa-play" },
  { id: "assign", label: "과제", icon: "fa-solid fa-file-lines" },
  { id: "exam", label: "시험", icon: "fa-solid fa-clipboard-question" },
  { id: "qna", label: "Q&A", icon: "fa-solid fa-comments" },
  { id: "dataroom", label: "자료실", icon: "fa-solid fa-folder-open" },
];

const STATUS_LABEL: Record<string, string> = {
  RECRUITING: "모집중", ACTIVE: "운영중", CLOSED: "종료", WAITING: "대기",
};
const STATUS_STYLE: Record<string, string> = {
  RECRUITING: "border-blue-100 bg-blue-50 text-blue-600",
  ACTIVE: "border-emerald-100 bg-emerald-50 text-emerald-600",
  CLOSED: "border-slate-100 bg-slate-100 text-slate-400",
  WAITING: "border-amber-100 bg-amber-50 text-amber-600",
};

function getTabFromPath(pathname: string): TabType | null {
  if (pathname.includes("/notices/")) return "notice";
  if (pathname.includes("/qna/")) return "qna";
  if (pathname.includes("/dataroom/")) return "dataroom";
  if (pathname.includes("/assignments/")) return "assign";
  if (pathname.includes("/exams/")) return "exam";
  return null;
}

export default function ClassroomLayout() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserName } = useAuth();
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null);
  const [accessError, setAccessError] = useState<403 | 404 | "error" | null>(null);
  const myName = getUserName();

  useEffect(() => {
    if (!classId) return;
    setAccessError(null);
    api.get(`/api/classroom/${classId}`)
      .then((res) => setClassroom(res.data))
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 403 || status === 404) setAccessError(status);
        else setAccessError("error");
      });
  }, [classId]);

  const isIndex = location.pathname === `/classroom/${classId}` || location.pathname === `/classroom/${classId}/`;
  const pathTab = getTabFromPath(location.pathname);
  const queryTab = new URLSearchParams(location.search).get("tab") as TabType | null;
  const activeTab: TabType = pathTab ?? queryTab ?? "home";

  const handleTabClick = (tabId: TabType) => {
    if (!isIndex) {
      navigate(`/classroom/${classId}?tab=${tabId}`);
    } else {
      navigate(`/classroom/${classId}?tab=${tabId}`, { replace: true });
    }
  };

  const statCd = classroom?.classStatCd ?? "ACTIVE";

  if (accessError) return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-4 font-sans">
      <i className={`fa-solid ${accessError === 403 ? "fa-lock" : "fa-triangle-exclamation"} text-5xl text-slate-200`} />
      <p className="text-lg font-bold text-slate-700">
        {accessError === 403 ? "접근 권한이 없습니다." : accessError === 404 ? "존재하지 않는 클래스입니다." : "클래스 정보를 불러오지 못했습니다."}
      </p>
      <p className="text-sm text-slate-400">
        {accessError === 403 ? "수강 중인 클래스에만 접근할 수 있습니다." : "URL을 다시 확인해 주세요."}
      </p>
      <button onClick={() => navigate("/my-classrooms")}
        className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
        내 클래스 목록으로
      </button>
    </div>
  );

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans antialiased overflow-hidden">
      {/* 메인 헤더 */}
      <header className="bg-slate-50 border-b border-slate-200 sticky top-0 z-50 shrink-0">
        <div className="px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/my-classrooms"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium shrink-0">
              <i className="fa-solid fa-arrow-left" /> 클래스 목록
            </Link>
            <span className="text-slate-200 text-base">/</span>
            <span className="text-base font-bold text-slate-800 truncate max-w-[200px]">
              {classroom?.classNm ?? "로딩 중..."}
            </span>
            {classroom?.instrNm && (
              <>
                <span className="text-slate-200 shrink-0">|</span>
                <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 shrink-0">
                  <i className="fa-solid fa-chalkboard-user text-xs" />
                  <span>{classroom.instrNm}</span>
                </div>
              </>
            )}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLE[statCd] ?? STATUS_STYLE.ACTIVE}`}>
              {STATUS_LABEL[statCd] ?? "운영중"}
            </span>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <i className="fa-solid fa-users text-slate-400 text-xs" />
              <span className="text-slate-400">수강생</span>
              <span className="font-semibold text-slate-400">{classroom?.memberCount ?? "-"}명</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <i className="fa-regular fa-calendar text-slate-400 text-xs" />
              <span className="text-slate-400">운영기간</span>
              <span className="font-semibold text-slate-400">
                {classroom?.enrlStrtYmd ?? "-"} ~ {classroom?.enrlEndYmd ?? "무기한"}
              </span>
            </div>
            <div className="w-px h-5 bg-slate-100 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold select-none">
                {myName?.charAt(0) ?? "?"}
              </div>
              <span className="font-medium text-slate-700 text-sm hidden sm:block">
                {myName ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {/* 탭 내비게이션 */}
        <nav className="bg-slate-50 border-t border-slate-200 px-10">
          <div className="flex items-end">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => handleTabClick(tab.id)}
                  className={`px-5 py-3 text-sm whitespace-nowrap flex items-center gap-2 border-b-2 transition-colors duration-150
                    ${isActive
                      ? "text-blue-600 border-blue-600 font-semibold"
                      : "text-slate-500 border-transparent hover:text-slate-700 font-medium"
                    }`}>
                  <i className={`${tab.icon} text-xs`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <Outlet context={{ classroom, activeTab }} />
    </div>
  );
}
