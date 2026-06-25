import { useEffect, useState } from "react";
import { Outlet, useParams, Link } from "react-router-dom";
import { Users, Calendar } from "lucide-react";
import api from "../api/api";
import type { ClassroomInfo } from "../types/ClassroomInterface";

const STATUS_LABEL: Record<string, string> = {
  RECRUITING: "모집중",
  ACTIVE: "운영중",
  CLOSED: "종료",
  WAITING: "대기",
};

const STATUS_STYLE: Record<string, string> = {
  RECRUITING: "border-blue-100 bg-blue-50 text-blue-600",
  ACTIVE: "border-emerald-100 bg-emerald-50 text-emerald-600",
  CLOSED: "border-slate-100 bg-slate-100 text-slate-400",
  WAITING: "border-amber-100 bg-amber-50 text-amber-600",
};

export default function ClassroomLayout() {
  const { classId } = useParams();
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null);

  useEffect(() => {
    if (!classId) return;
    api
      .get(`/api/classroom/${classId}`)
      .then((res) => setClassroom(res.data))
      .catch((err) => console.error("클래스룸 정보 조회 실패", err));
  }, [classId]);

  const avatarLetter = classroom?.instrNm?.charAt(0) ?? "?";
  const statCd = classroom?.classStatCd ?? "ACTIVE";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 flex-shrink-0">
        <div className="px-10 h-16 flex items-center justify-between gap-4">
          {/* 좌측: 브레드크럼 + 클래스명 + 상태 */}
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/my-classrooms"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium shrink-0"
            >
              <i className="fa-solid fa-arrow-left" />
              클래스 목록
            </Link>
            <span className="text-slate-200 text-base">/</span>
            <span className="text-base font-bold text-slate-800 truncate max-w-[240px]">
              {classroom?.classNm ?? "로딩 중..."}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLE[statCd] ?? STATUS_STYLE.ACTIVE}`}
            >
              {STATUS_LABEL[statCd] ?? "운영중"}
            </span>
          </div>

          {/* 우측: 수강생 수 + 운영기간 + 강사 */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <Users size={14} />
              <span>수강생</span>
              <span className="font-medium text-slate-600">
                {classroom?.memberCount ?? "-"}명
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400">
              <Calendar size={14} />
              <span>운영기간</span>
              <span className="font-medium text-slate-600">
                {classroom?.enrlStrtYmd ?? "-"} ~ {classroom?.enrlEndYmd ?? "무기한"}
              </span>
            </div>
            <div className="w-px h-5 bg-slate-100 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold select-none">
                {avatarLetter}
              </div>
              <span className="font-medium text-slate-600 text-sm hidden sm:block">
                {classroom?.instrNm ?? "-"} 강사
              </span>
            </div>
          </div>
        </div>
      </header>

      <Outlet context={{ classroom }} />
    </div>
  );
}
