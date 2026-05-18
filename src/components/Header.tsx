import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { isAuthenticated, logout, getUserName, getRole } = useAuth();
  const isAdmin = getRole() === "ROLE_ADMIN";
  const userName = getUserName();

  return (
    <>
      <header className=" position-sticky top-0 z-10 bg-slate-200 border-b height-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className=" text-lg font-bold ">
            홈
          </Link>
          {isAdmin && <Link to="/admin">관리자 페이지</Link>}
          {isAuthenticated ? (
            <>
              <span>{userName}님 환영합니다!</span>
              <Link to="/mypage">마이페이지</Link>
              <button onClick={logout} className=" cursor-pointer">
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login">로그인</Link>
          )}
        </div>
      </header>
    </>
  );
}
