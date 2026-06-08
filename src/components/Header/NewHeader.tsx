import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import SiteMap from "./components/SiteMap";
import "./NewHeader.css";

const D_DAY = 180;

export default function NewHeader() {
  const { isAuthenticated, logout, getUserName, getRole } = useAuth();
  const currentRoles = getRole() || "";
  const isAdmin = currentRoles.includes("ROLE_ADMIN");
  const isParent = currentRoles.includes("ROLE_PARENT");
  const userName = getUserName();

  const [siteMapOpen, setSiteMapOpen] = useState(false);

  return (
    <header className="site-header">
      {/* ── 1. 메인 바: 로고 + 우측 유틸 ── */}
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
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
          <span className="font-semibold">
            수능 <span className="text-blue-600 font-bold">D-{D_DAY}</span>
          </span>
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

      {/* ── 2. 하단 네비게이션 바 ── */}
      <div className="header-nav-bar">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center gap-1">
          {/* 사이트맵 버튼 */}
          <button
            onClick={() => setSiteMapOpen((v) => !v)}
            className={`sitemap-btn ${siteMapOpen ? "sitemap-btn-active" : ""}`}
          >
            <i
              className={`fa-solid ${siteMapOpen ? "fa-xmark" : "fa-bars"} text-sm`}
            />
          </button>

          {/* 사이트맵 드롭다운 */}
          <SiteMap isOpen={siteMapOpen} onClose={() => setSiteMapOpen(false)} />

          <div className="header-util-divider mx-2" />

          {/* 메인 네비 */}
          <nav className="flex items-center gap-0.5 flex-1">
            {[
              { to: "/header/instructors", label: "강사" },
              { to: "/mylecture", label: "전체 강좌" },
              { to: "/header/books", label: "강의교재" },
              { to: "/header/Ainavigator", label: "AI 입시정보" },
              { to: "/header/books", label: "HERMES 패스" }
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="nav-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
