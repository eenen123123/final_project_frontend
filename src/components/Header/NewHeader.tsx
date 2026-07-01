import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import SiteMap from "./components/SiteMap";
import "./NewHeader.css";

const D_DAY = 180;

export default function NewHeader() {
  const { isAuthenticated, logout, getUserName, getRole } = useAuth();
  const currentRoles = getRole() || "";
  const isAdmin = currentRoles.includes("ROLE_ADMIN");
  const isStudent = currentRoles.includes("ROLE_STUDENT");
  const isParent = currentRoles.includes("ROLE_PARENT");
  const userName = getUserName();

  const location = useLocation();
  // pathname이 바뀌면 siteMapOpen이 자동으로 false가 됨
  const [openedAtPath, setOpenedAtPath] = useState<string | null>(null);
  const siteMapOpen = openedAtPath === location.pathname;
  const toggleSiteMap = () =>
    setOpenedAtPath(siteMapOpen ? null : location.pathname);
  const closeSiteMap = () => setOpenedAtPath(null);

  // 모바일 사이드바 (pathname이 바뀌면 자동으로 닫힘)
  const [menuOpenedAtPath, setMenuOpenedAtPath] = useState<string | null>(null);
  const mobileMenuOpen = menuOpenedAtPath === location.pathname;
  const closeMobileMenu = () => setMenuOpenedAtPath(null);

  const navItems = [
    { to: "/instructors", label: "강사" },
    { to: "/courses", label: "전체 강좌" },
    { to: "/header/books", label: "강의교재" },
    { to: "/gradeCut", label: "등급컷 조회" },
    // { to: "/header/Ainavigator", label: "AI 입시정보" },
    // { to: "/header/books", label: "HERMES 패스" },
    // {
    //   to: "/viewer?courseId=81&lectureId=23",
    //   label: "테스트 뷰어",
    // },
    ...(isStudent ? [{ to: "/my-classrooms", label: "Classroom" }] : []),
  ];

  // 사이트맵 영역 외부 mousedown 시 닫기 (backdrop과 달리 클릭이 하위 요소에 그대로 전달됨)
  const siteMapAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!siteMapOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        siteMapAreaRef.current &&
        !siteMapAreaRef.current.contains(e.target as Node)
      ) {
        closeSiteMap();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [siteMapOpen]);

  return (
    <header className="site-header">
      {/* ── 1. 메인 바: 로고 + 우측 유틸 ── pc */}
      <div className="max-w-7xl mx-auto px-6 h-14 items-center justify-between hidden md:flex">
        {/* 로고 */}
        <Link to="/" className="brand-logo group">
          <div className="brand-logo-icon">
            <i className="fa-solid fa-bolt text-white text-sm" />
          </div>
          <span className="brand-logo-text">HERMES</span>
          <span className="brand-logo-dot">.</span>
        </Link>

        {/* 우측 유틸리티 */}
        <div className="header-util">
          {/* <span className="font-semibold">
            수능 <span className="text-blue-600 font-bold">D-{D_DAY}</span>
          </span> */}
          <div className="header-util-divider" />

          {isAuthenticated ? (
            <>
              <span className="text-gray-700">
                <strong className="font-bold">{userName}</strong>님
              </span>
              <Link to="/mypage" className="header-util-link">
                마이페이지
              </Link>
              <button onClick={logout} className="btn-ghost">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-util-link">
                로그인
              </Link>
              <Link to="/signup" className="btn-primary">
                회원가입
              </Link>
            </>
          )}

          <div className="header-util-divider" />
          <Link to="/customer" className="header-util-link">
            고객센터
          </Link>

          {/* 검색 컴포넌트 연결 예정 */}

          {isAdmin && (
            <>
              <div className="header-util-divider" />
              <Link to="/admin" className="badge-admin">
                <i className="fa-solid fa-user-shield text-[10px]" />
                관리자
              </Link>
            </>
          )}

          {isParent && (
            <>
              <div className="header-util-divider" />
              <Link to="/parentroom" className="badge-parent">
                <i className="fa-solid fa-child text-[10px]" />
                자녀 학습 현황
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 모바일 헤더 */}
      <div className="md:hidden flex justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpenedAtPath(location.pathname)}
            className="sitemap-btn"
            aria-label="메뉴 열기"
          >
            <i className="fa-solid fa-bars text-base" />
          </button>
          <Link to="/" className="brand-logo group">
            <div className="brand-logo-icon">
              <i className="fa-solid fa-bolt text-white text-sm" />
            </div>
          </Link>
        </div>
        <div className="text-sm flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700">
                <strong className="font-bold">{userName}</strong>님
              </span>
              <Link to="/mypage" className="header-util-link">
                마이페이지
              </Link>
              <button onClick={logout} className="btn-ghost">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-util-link">
                로그인
              </Link>
              <Link to="/signup" className="btn-primary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── 2. 하단 네비게이션 바 ── */}
      <div className="header-nav-bar hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center gap-1">
          {/* 사이트맵 버튼 + 드롭다운 (외부 클릭 감지 영역) */}

          <div className="header-util-divider mx-2" />

          {/* 메인 네비 */}
          <nav className="flex items-center gap-0.5 flex-1">
            {navItems.map(({ to, label }) => (
              <Link key={to} to={to} className="nav-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── 모바일 사이드바 드로어 ── */}
      <div className="md:hidden">
        {/* 배경 오버레이 */}
        <div
          className={`mobile-drawer-backdrop ${mobileMenuOpen ? "is-open" : ""}`}
          onClick={closeMobileMenu}
        />
        {/* 사이드바 본체 */}
        <aside className={`mobile-drawer ${mobileMenuOpen ? "is-open" : ""}`}>
          <div className="mobile-drawer-header">
            <span className="brand-logo-text">HERMES</span>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="sitemap-btn"
              aria-label="메뉴 닫기"
            >
              <i className="fa-solid fa-xmark text-base" />
            </button>
          </div>
          <nav className="mobile-drawer-nav">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMobileMenu}
                className="mobile-drawer-link"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </header>
  );
}
