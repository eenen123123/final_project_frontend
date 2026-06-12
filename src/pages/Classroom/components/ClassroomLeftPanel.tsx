import ClassroomCalendar from "./ClassroomCalendar";
import type { ClassroomInfo } from "../../../types/ClassroomInterface";
import { Link } from "react-router-dom";

interface ClassroomLeftPanelProps {
  instructor: ClassroomInfo | null;
}

export default function ClassroomLeftPanel({
  instructor,
}: ClassroomLeftPanelProps) {
  const avatarLetter = instructor?.instrNm?.charAt(0) ?? "?";

  return (
    <aside className="w-96 bg-white border-r border-slate-200 p-5 flex flex-col gap-6 shrink-0">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-[2rem] bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-blue-100 mb-3 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
          {avatarLetter}
        </div>
        <h3 className="font-bold text-slate-800 text-base">
          {instructor?.instrNm ?? "로딩 중..."} 강사
        </h3>
        <span className="text-blue-500 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-md mt-1">
          {instructor?.classNm ?? "-"}
        </span>

        <Link
          className="text-center w-full mt-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-[12px] font-bold rounded-xl transition-all border border-slate-100 hover:border-blue-100"
          to={`/instructor/${instructor?.instrUuid}`}
        >
          강사 페이지
        </Link>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="space-y-3">
        <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest pl-1">
          Information
        </h4>
        <div className="bg-slate-50/50 rounded-2xl p-3 space-y-2 border border-slate-100">
          <div className="flex justify-between text-[12px] font-bold">
            <span className="text-slate-400">📚 강좌</span>
            <span className="text-slate-700">
              {instructor?.courseNm ?? "-"}
            </span>
          </div>
          <div className="flex justify-between text-[12px] font-bold">
            <span className="text-slate-400">👥 수강 인원</span>
            <span className="text-slate-700">
              {instructor?.memberCount ?? "-"}명
            </span>
          </div>
          <div className="flex justify-between text-[12px] font-bold">
            <span className="text-slate-400">📅 수강 시작</span>
            <span className="text-slate-700">
              {instructor?.enrlStrtYmd ?? "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

      <div>
        <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-3">
          Calendar
        </h4>
        <ClassroomCalendar />
      </div>
    </aside>
  );
}
