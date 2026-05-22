import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./NewHeader.css";

export default function NewHeader() {
  const { isAuthenticated, logout, getUserName, getRole } = useAuth();
  const currentRoles = getRole() || "";
  const isAdmin = currentRoles.includes("ROLE_ADMIN");
  const userName = getUserName();

  return (
    <header className="site-header">
      {/* 1. 좌측 영역: 브랜드 로고 및 메인 네비게이션 */}
      <div className="flex items-center gap-5">
        <Link to="/" className="brand-logo">
          <i className="fa-solid fa-layer-group text-violet-600 text-base"></i>
          <span>HERMES</span>
        </Link>

        <div className="divider-v hidden sm:block" />

        <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-slate-900 transition-colors py-1">
            홈
          </Link>

          {isAdmin && (
            <Link to="/admin" className="badge-admin">
              <i className="fa-solid fa-user-shield text-[10px]"></i>
              <span>관리자 페이지</span>
            </Link>
          )}
        </nav>
      </div>

      {/* 2. 중앙 영역 각종 네비게이터 */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-4">
          <Link to="/notice" className="nav-link">
            <i className="fa-regular fa-user text-xs"></i>
            <span>공지 사항</span>
          </Link>

          <div className="divider-v hidden md:block" />

          <Link to="/qna" className="nav-link">
            <i className="fa-regular fa-user text-xs"></i>
            <span>Q&A</span>
          </Link>

          <div className="divider-v hidden md:block" />

          <Link to="/mylecture" className="nav-link">
            <i className="fa-regular fa-user text-xs"></i>
            <span>나의 강의실</span>
          </Link>

          <div className="divider-v hidden md:block" />

          <Link to="" className="nav-link">
            <i className="fa-regular fa-user text-xs"></i>
            <span>온라인 강의</span>
          </Link>

          <div className="divider-v hidden md:block" />

          <Link to="" className="nav-link">
            <i className="fa-regular fa-user text-xs"></i>
            <span>온라인 강의</span>
          </Link>
        </div>
      </div>

      {/* 3. 우측 영역: 유저 인증 및 프로필 세팅 상태 */}
      <div className="flex items-center gap-4 text-sm">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/classroom/1" className="nav-link">
              <i className="fa-regular fa-user text-xs"></i>
              <span>Classroom</span>
            </Link>

            {/* 유저 환영 메시지 */}
            <span className="text-slate-600 font-medium hidden md:block">
              <strong className="text-slate-900 font-bold">{userName}</strong>님
              환영합니다!
            </span>

            <div className="divider-v hidden md:block" />

            {/* 마이페이지는 보조 텍스트 색상(slate-500)으로 우선순위를 낮게 표현 */}
            <Link to="/mypage" className="nav-link text-slate-500">
              <i className="fa-regular fa-user text-xs"></i>
              <span>마이페이지</span>
            </Link>

            <button onClick={logout} className="btn-ghost">
              <i className="fa-solid fa-arrow-right-from-bracket mr-1"></i>
              로그아웃
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary">
            <i className="fa-solid fa-key text-[11px]"></i>
            <span>로그인</span>
          </Link>
        )}
      </div>
    </header>
  );
}
