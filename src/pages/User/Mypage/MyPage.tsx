import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Monitor, BookOpen, Wrench, Settings } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";
import api from "../../../api/api";
import StudyStatus from "../Mypage/components/StudyStatus";
import StudyCalendar from "../Mypage/components/StudyCalendar";
import StudyReport from "../Mypage/components//StudyReport";
import AlertDropdown from "../Mypage/components/AlertDropdown";
import type { AlertItem } from "../Mypage/components/AlertDropdown";
import type {
  CourseStatus,
  StudySubject,
  TeacherRank,
} from "../../../types/MyPageInterface";
import MyPageSidebar from "../Mypage/components/MyPageSidebar";
import FeaturedCarousel from "../Mypage/components/FeaturedCarousel";

// ── 더미 데이터 ───────────────────────────────────────────────────────────
const COURSE_STATUS: CourseStatus = {
  active: 1,
  activeLabel: "0",
  completed: 2,
  waiting: 0,
  activeBook: 1,
  cart: 0,
  order: 0,
  coupon: 1,
  point: 0,
};

const SUBJECTS: StudySubject[] = [
  { name: "국어", percent: 65, minutes: 127 },
  { name: "수학", percent: 70, minutes: 56 },
  { name: "영어", percent: 90, minutes: 28 },
  { name: "탐구", percent: 70, minutes: 196 },
  { name: "한국사", percent: 35, minutes: 42 },
  { name: "제2외/한문", percent: 55, minutes: 74 },
];

const TEACHERS: TeacherRank[] = [
  { rank: 1, label: "[사탐] 임정환선생님", hours: "2시간" },
  { rank: 2, label: "[국어] 박상호선생님", hours: "? 시간" },
  { rank: 3, label: "[수학] 이수학선생님", hours: "? 시간" },
  { rank: 4, label: "[영어] 최영어선생님", hours: "? 시간" },
  { rank: 5, label: "[사탐] 김사회선생님", hours: "? 시간" },
];

const INIT_NOTIFICATIONS: AlertItem[] = [
  {
    id: "a1",
    message: "사용하지 않은 쿠폰이 있습니다. [교재 할인권]",
    read: false,
    important: false,
    date: "2026.05.22",
  },
  {
    id: "a2",
    message: "사회문화 A — 5월 모의고사 해설 라이브가 오늘 20:00 시작됩니다.",
    read: false,
    important: true,
    date: "2026.05.18",
  },
  {
    id: "a3",
    message: "13~14강 자료가 업데이트되었습니다. [일탈 이론 v2]",
    read: false,
    important: false,
    date: "2026.05.05",
  },
  {
    id: "a4",
    message: "수강 기간 만료 7일 전입니다. 연장을 확인해주세요.",
    read: false,
    important: true,
    date: "2026.05.04",
  },
  {
    id: "a5",
    message: "QnA #005번 질문에 답변이 등록되었습니다.",
    read: true,
    important: false,
    date: "2026.05.03",
  },
  {
    id: "a6",
    message: "수강 기간 연장 정책이 변경되었습니다.",
    read: true,
    important: false,
    date: "2026.04.28",
  },
];

const INIT_MESSAGES: AlertItem[] = [
  {
    id: "m1",
    from: "관리자",
    message: "5월 모의고사 해설 라이브 일정을 확인해주세요.",
    read: false,
    important: false,
    date: "2026.05.22",
  },
  {
    id: "m2",
    from: "관리자",
    message: "최근 구매하신 강좌의 구매내역 입니다.",
    read: false,
    important: false,
    date: "2026.05.21",
  },
  {
    id: "m3",
    from: "임정환 선생님",
    message: "질문 주신 사회문화 A 2강 내용 답변 드렸습니다.",
    read: false,
    important: true,
    date: "2026.05.20",
  },
  {
    id: "m4",
    from: "관리자",
    message: "수강 기간 연장 정책 변경 안내드립니다.",
    read: true,
    important: false,
    date: "2026.04.28",
  },
];

interface NoticeItem {
  postSn: number;
  postSj: string;
  regDt: string;
  dateStr: string;
  isNew: boolean;
}
// ──────────────────────────────────────────────────────────────────────────

const roleLabel: Record<string, string> = {
  ROLE_ADMIN: "관리자",
  ROLE_USER: "일반 회원",
  ROLE_PARENT: "학부모",
  ROLE_STUDENT: "학생",
};

const roleBadgeClass: Record<string, string> = {
  ROLE_ADMIN: "bg-red-100 text-red-700",
  ROLE_USER: "bg-blue-100 text-blue-700",
  ROLE_PARENT: "bg-green-100 text-green-700",
  ROLE_STUDENT: "bg-purple-100 text-purple-700",
};

export default function MyPage() {
  const navigate = useNavigate();
  const { getRole, getUserName } = useAuth();
  const userName = getUserName();
  const role = getRole();
  const primaryRole: string | null = Array.isArray(role)
    ? (role[0] ?? null)
    : ((role as unknown as string) ?? null);
  const displayRole = primaryRole
    ? (roleLabel[primaryRole] ?? primaryRole)
    : "-";
  const badgeClass = primaryRole
    ? (roleBadgeClass[primaryRole] ?? "bg-gray-100 text-gray-700")
    : "bg-gray-100 text-gray-700";

  const [activeSection, setActiveSection] = useState("마이룸");
  const [notifications, setNotifications] = useState<AlertItem[]>(INIT_NOTIFICATIONS);
  const [messages, setMessages] = useState<AlertItem[]>(INIT_MESSAGES);
  const [courseStatus, setCourseStatus] = useState<CourseStatus>(COURSE_STATUS);

  useEffect(() => {
    // 장바구니 수
    api.get<{ cartSn: number }[]>("/api/cart")
      .then((res) => setCourseStatus((prev) => ({ ...prev, cart: res.data.length })))
      .catch(() => {});
    // 수강중/수강완료 강좌 수 (만료일 기준 분류)
    api.get<{ enrlSn: number; accsEndDt: string }[]>("/api/mypage/courses")
      .then((res) => {
        const now = Date.now();
        const active = res.data.filter((c) => new Date(c.accsEndDt).getTime() >= now).length;
        const completed = res.data.filter((c) => new Date(c.accsEndDt).getTime() < now).length;
        setCourseStatus((prev) => ({ ...prev, active, completed }));
      })
      .catch(() => {});
    // 보유 쿠폰 수
    api.get<{ mcpntSn: number }[]>("/api/coupons/my/available")
      .then((res) => setCourseStatus((prev) => ({ ...prev, coupon: res.data.length })))
      .catch(() => {});
    // 주문/배송 수
    api.get<{ totalCount: number }>("/api/orders/my", { params: { page: 1 } })
      .then((res) => setCourseStatus((prev) => ({ ...prev, order: res.data.totalCount ?? 0 })))
      .catch(() => {});
  }, []);
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    api.get<{ postSn: number; postSj: string; regDt: string }[]>("/api/notice").then((res) => {
      const now = Date.now();
      setNotices(res.data.slice(0, 4).map((n) => {
        const date = n.regDt ? new Date(n.regDt) : null;
        return {
          ...n,
          dateStr: date
            ? `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`
            : "",
          isNew: date ? now - date.getTime() < 7 * 24 * 60 * 60 * 1000 : false,
        };
      }));
    }).catch((error) => alert(error.response?.data?.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 본문: 사이드바 + 메인 */}
        <div className="flex flex-col lg:flex-row gap-5 lg:items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 min-w-0">
            {/* 유저 정보 상단 바 */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 sm:px-8 py-5 sm:py-6 flex flex-wrap items-center gap-x-5 gap-y-3 mb-5 shadow-sm">
              <span
                className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-bold flex-shrink-0 ${badgeClass}`}
              >
                {displayRole}
              </span>
              <span className="text-gray-900 text-xl">
                <span className="font-bold">{userName ?? "-"}</span>님
              </span>
              <div className="flex items-center gap-4 ml-auto text-sm text-gray-500">
                <AlertDropdown
                  type="message"
                  items={messages}
                  onChange={setMessages}
                />
                <div className="w-px h-4 bg-gray-200" />
                <AlertDropdown
                  type="notification"
                  items={notifications}
                  onChange={setNotifications}
                />
                <div className="w-px h-4 bg-gray-200" />
                <button
                  onClick={() => {
                    const roleRaw = getRole();
                    const roles = Array.isArray(roleRaw)
                      ? roleRaw
                      : roleRaw
                        ? [roleRaw as unknown as string]
                        : [];
                    const ALLOWED = [
                      "ROLE_USER",
                      "ROLE_STUDENT",
                      "ROLE_PARENT",
                    ];
                    if (!roles.some((r) => ALLOWED.includes(r))) {
                      alert("일반 회원만 접근 가능합니다.");
                      return;
                    }
                    navigate("/mypage/verify");
                  }}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  개인 정보 수정
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <StudyStatus status={courseStatus} />
            <FeaturedCarousel />
            <StudyCalendar />
            <StudyReport subjects={SUBJECTS} teachers={TEACHERS} />

            {/* 내 학습기기 + 학습지원 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  내 학습기기
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-12 h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-xl flex-shrink-0">
                    +
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      등록된 기기가 없습니다.
                    </p>
                    <p className="text-xs text-gray-400">
                      (한 ID당 1개만 등록 가능)
                    </p>
                  </div>
                  <button className="ml-auto text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
                    학습기기 이용안내
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  학습지원
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { Icon: HelpCircle, label: "자주하는 질문(FAQ)", path: "/customer/faq" },
                    { Icon: Monitor, label: "학습기기 이용안내", path: null },
                    { Icon: BookOpen, label: "강좌&교재 이용가이드", path: null },
                    { Icon: Wrench, label: "원격 해결 서비스", path: null },
                  ].map(({ Icon, label, path }) => (
                    <button
                      key={label}
                      onClick={() => path && navigate(path)}
                      className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 공지사항 + 고객센터 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    공지사항
                  </h3>
                  <button
                    onClick={() => navigate("/customer/notice")}
                    className="text-gray-300 hover:text-gray-500 text-lg leading-none"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.postSn} className="flex items-center gap-2">
                      <p
                        onClick={() => navigate(`/customer/notice/${n.postSn}`)}
                        className="text-xs text-gray-600 flex-1 truncate hover:text-blue-500 cursor-pointer transition-colors"
                      >
                        {n.postSj}
                      </p>
                      {n.isNew && (
                        <span className="text-[10px] font-bold text-red-500 border border-red-300 px-1 rounded flex-shrink-0">
                          N
                        </span>
                      )}
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {n.dateStr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-5">
                  고객센터
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">전화</p>
                      <p className="text-2xl font-bold text-blue-500">
                        1599-6405
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      <p>평일 9시~18시(점심 12시~13시)</p>
                      <p>주말, 공휴일 상담불가</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-500">
                        1:1 게시판 상담
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      <p>평일 9시~24시</p>
                      <p>주말, 공휴일 상담불가</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
