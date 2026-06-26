import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/AuthContext";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
  // { label: "수강중 강좌", href: "/mylecture" },
  { label: "My 캘린더", href: "/mycalendar" },
  // { label: "주문/배송 조회", href: "/mycart/orderhistory" },
  // { label: "강좌 수강 신청", href: "/courses" },
  {
    label: "나의 강의실",
    href: "#classroom",
    children: [
      { label: "수강중 강좌", href: "/mylecture" },
      { label: "수강 리포트", href: "/mypage/report" },
      // { label: "성적 관리", href: "/mypage/grades" },
    ],
  },
  {
    label: "주문·결제·혜택",
    href: "#payment",
    children: [
      { label: "장바구니", href: "/mycart" },
      { label: "주문/배송 조회", href: "/mycart/orderhistory" },
      // { label: "이용권 관리", href: "#voucher" },
      { label: "쿠폰/포인트", href: "/mypage/couponpoint" },
    ],
  },
  {
    label: "나의 정보",
    href: "#info",
    children: [
      { label: "나의 Q&A", href: "/mypage/qna" },
      { label: "개인 정보 수정", href: "/mypage/verify" },
    ],
  },
];

interface MyPageSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function MyPageSidebar({
  activeSection,
  onSectionChange,
}: MyPageSidebarProps) {
  const navigate = useNavigate();
  const { getRole } = useAuth();
  // 데스크탑(lg↑)은 기본 펼침, 모바일은 기본 접힘
  const [openMenus, setOpenMenus] = useState<string[]>(() =>
    typeof window !== "undefined" && window.innerWidth >= 1024
      ? NAV.filter((item) => item.children).map((item) => item.label)
      : [],
  );

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const handleClick = (item: NavItem) => {
    if (item.children) {
      toggleMenu(item.label);
    } else if (item.href.startsWith("/")) {
      navigate(item.href);
    } else {
      onSectionChange(item.label);
    }
  };

  const ALLOWED_ROLES = ["ROLE_USER", "ROLE_STUDENT", "ROLE_PARENT"];

  const handleChildClick = (href: string, label: string) => {
    if (href === "/mypage/verify") {
      const roleRaw = getRole();
      const roles = Array.isArray(roleRaw)
        ? roleRaw
        : roleRaw
          ? [roleRaw as unknown as string]
          : [];
      if (!roles.some((r) => ALLOWED_ROLES.includes(r))) {
        alert("일반 회원만 접근 가능합니다.");
        return;
      }
    }
    if (href.startsWith("/")) {
      navigate(href);
    } else {
      onSectionChange(label);
    }
  };

  return (
    <aside className="w-full lg:w-48 shrink-0">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div
          className="px-5 py-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => navigate("/mypage")}
        >
          <h2 className="text-base font-bold text-blue-00">마이페이지</h2>
        </div>
        <nav className="py-2">
          {NAV.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => handleClick(item)}
                className={`w-full flex items-center justify-between px-5 py-2.5 text-sm transition-colors rounded-md cursor-pointer ${
                  openMenus.includes(item.label) || activeSection === item.label
                    ? "text-blue-600 font-semibold bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{item.label}</span>
                {item.children ? (
                  <span className="text-gray-400 text-xs">
                    {openMenus.includes(item.label) ? "∧" : "∨"}
                  </span>
                ) : (
                  <span className="text-gray-300 text-xs">›</span>
                )}
              </button>

              {item.children && (
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openMenus.includes(item.label)
                      ? `${item.children.length * 36}px`
                      : "0px",
                  }}
                >
                  <div className="bg-gray-50 py-1">
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        onClick={() =>
                          handleChildClick(child.href, child.label)
                        }
                        className="w-full text-left block px-8 py-2 text-xs text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
