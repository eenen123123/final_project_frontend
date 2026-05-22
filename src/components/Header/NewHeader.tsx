import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function NewHeader() {
  const { isAuthenticated, logout, getUserName, getRole } = useAuth();
  const currentRoles = getRole() || "";
  const isAdmin = currentRoles.includes("ROLE_ADMIN");
  const userName = getUserName();

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm shadow-gray-50/40">
      {/* 1. 좌측 영역: 브랜드 로고 및 메인 네비게이션 */}
      <div className="flex items-center gap-5">
        <Link
          to="/"
          className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 hover:text-violet-600 transition-colors"
        >
          <i className="fa-solid fa-layer-group text-violet-600 text-base"></i>
          <span>HERMES</span>
        </Link>

        {/* 부드러운 구분선 */}
        <div className="h-4 w-px bg-gray-200 hidden sm:block" />

        <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-slate-900 transition-colors py-1">
            홈
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-100 transition-all border border-violet-100"
            >
              <i className="fa-solid fa-user-shield text-[10px]"></i>
              <span>관리자 페이지</span>
            </Link>
          )}
        </nav>
      </div>
      {/* 2. 중앙 영역 각종 네비게이터 */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-4">
          <Link
            to="/notice"
            className="text-slate-700 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1.5"
          >
            <i className="fa-regular fa-user text-xs"></i>
            <span>공지 사항</span>
          </Link>

          <div className="h-4 w-px bg-gray-200 hidden md:block" />

          <Link
            to="/qna"
            className="text-slate-700 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1.5"
          >
            <i className="fa-regular fa-user text-xs"></i>
            <span>Q&A</span>
          </Link>

          <div className="h-4 w-px bg-gray-200 hidden md:block" />

          <Link
            to="/mylecture"
            className="text-slate-700 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1.5"
          >
            <i className="fa-regular fa-user text-xs"></i>
            <span>나의 강의실</span>
          </Link>

          <div className="h-4 w-px bg-gray-200 hidden md:block" />

          <Link
            to=""
            className="text-slate-700 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1.5"
          >
            <i className="fa-regular fa-user text-xs"></i>
            <span>온라인 강의</span>
          </Link>

          <div className="h-4 w-px bg-gray-200 hidden md:block" />

          <Link
            to=""
            className="text-slate-700 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1.5"
          >
            <i className="fa-regular fa-user text-xs"></i>
            <span>온라인 강의</span>
          </Link>
        </div>
      </div>

      {/* 3. 우측 영역: 유저 인증 및 프로필 세팅 상태 */}
      <div className="flex items-center gap-4 text-sm">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
             <Link
            to="/classroom/1"
            className="text-slate-700 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1.5"
          >
            <i className="fa-regular fa-user text-xs"></i>
            <span>Classroom</span>
          </Link>

            {/* 유저 환영 메시지 */}
            <span className="text-slate-600 font-medium hidden md:block">
              <strong className="text-slate-900 font-bold">{userName}</strong>님
              환영합니다!
            </span>

            <div className="h-4 w-px bg-gray-200 hidden md:block" />

            <Link
              to="/mypage"
              className="text-slate-500 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1.5"
            >
              <i className="fa-regular fa-user text-xs"></i>
              <span>마이페이지</span>
            </Link>

            {/* 로그아웃 버튼 */}
            <button
              onClick={logout}
              className="cursor-pointer px-3.5 py-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 transition-all shadow-xs"
            >
              <i className="fa-solid fa-arrow-right-from-bracket mr-1"></i>
              로그아웃
            </button>
          </div>
        ) : (
          /* 로그인 하지 않은 상태일 때 */
          <Link
            to="/login"
            className="cursor-pointer px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-violet-200 transition-all flex items-center gap-1.5"
          >
            <i className="fa-solid fa-key text-[11px]"></i>
            <span>로그인</span>
          </Link>
        )}
      </div>
    </header>
  );
}
