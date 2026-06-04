import { useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import Badge from "../../../components/Badge/Badge";

import StudyStatus from "../Mypage/components/StudyStatus";
import StudyCalendar from "../Mypage/components/StudyCalendar";
import StudyReport from "../Mypage/components//StudyReport";
import AlertDropdown from "../Mypage/components/AlertDropdown";
import type { AlertItem } from "../Mypage/components/AlertDropdown";
import type { CalendarEvent, CourseStatus, StudySubject, TeacherRank } from "../../../types/MyPageInterface";
import MyPageSidebar from "../Mypage/components/MyPageSidebar";

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

const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    date: "2026-05-01",
    startDate: "2026-05-01",
    endDate: "2026-05-01",
    type: "event",
    title: "5월 수강생 이벤트 시작",
  },
  {
    id: "2",
    date: "2026-05-05",
    startDate: "2026-05-05",
    endDate: "2026-05-05",
    type: "academic",
    title: "어린이날 (휴일)",
  },
  {
    id: "3",
    date: "2026-05-07",
    startDate: "2026-05-07",
    endDate: "2026-05-07",
    type: "personal",
    title: "사회문화 A — 2강 복습",
  },
  {
    id: "4",
    date: "2026-05-14",
    startDate: "2026-05-14",
    endDate: "2026-05-14",
    type: "academic",
    title: "5월 모의고사",
  },
  {
    id: "5",
    date: "2026-05-22",
    startDate: "2026-05-22",
    endDate: "2026-05-22",
    type: "event",
    title: "헤르메스에서 놓친 혜택 자수하고 선물 받자!",
  },
  {
    id: "6",
    date: "2026-05-25",
    startDate: "2026-05-25",
    endDate: "2026-05-25",
    type: "personal",
    title: "1단원 마무리 + 5월 학평 복습",
  },
];

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
  { id: "a5", message: "QnA #005번 질문에 답변이 등록되었습니다.", read: true, important: false, date: "2026.05.03" },
  { id: "a6", message: "수강 기간 연장 정책이 변경되었습니다.", read: true, important: false, date: "2026.04.28" },
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

const NOTICES = [
  { id: "n1", title: "[공지] 5/14(목) 02시~03시 사이트 통합 회원 기능 점검...", date: "2026.05.11", isNew: true },
  { id: "n2", title: "[사전공지] PCPLAYER 업데이트 예정 안내(2026/0...", date: "2026.04.29", isNew: true },
  { id: "n3", title: "[공지] 3/19(수) 02시~06시 사이트 점검 작업", date: "2026.03.18", isNew: false },
  { id: "n4", title: "[공지] 3/11(수) 00시~06시 사이트 일부 메뉴 점검 작업", date: "2026.02.27", isNew: false },
];
// ──────────────────────────────────────────────────────────────────────────

const roleLabel: Record<string, string> = {
  ROLE_ADMIN: "관리자",
  ROLE_USER: "일반 회원",
  ROLE_OFFLINE: "오프라인 회원",
};

const roleBadgeVariant: Record<string, "primary" | "secondary" | "danger"> = {
  ROLE_ADMIN: "danger",
  ROLE_USER: "primary",
  ROLE_OFFLINE: "secondary",
};

export default function MyPage() {
  const { getRole, getUserName } = useAuth();
  const userName = getUserName();
  const role = getRole();
  const primaryRole = role?.[0] ?? null; // 배열에서 첫 번째 role 가져오기
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";
  const displayRole = primaryRole ? (roleLabel[primaryRole] ?? primaryRole) : "-";
  const badgeVariant = primaryRole ? (roleBadgeVariant[primaryRole] ?? "secondary") : "secondary";

  const [activeSection, setActiveSection] = useState("마이룸");
  const [notifications, setNotifications] = useState<AlertItem[]>(INIT_NOTIFICATIONS);
  const [messages, setMessages] = useState<AlertItem[]>(INIT_MESSAGES);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 유저 정보 상단 바 */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center gap-5 mb-6 shadow-sm">
          <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md flex-shrink-0">
            {displayRole}
          </div>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <span className="text-gray-900 font-semibold">{userName ?? "-"}님</span>
            <Badge variant={badgeVariant} className="ml-1">
              {displayRole}
            </Badge>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            {/* 쪽지 */}
            <AlertDropdown type="message" items={messages} onChange={setMessages} />

            <div className="w-px h-4 bg-gray-200" />

            {/* 알림 */}
            <AlertDropdown type="notification" items={notifications} onChange={setNotifications} />

            <div className="w-px h-4 bg-gray-200" />

            <span className="text-gray-900 font-semibold">
              2027 수능 <span className="text-blue-600">D-181</span>
            </span>

            <div className="w-px h-4 bg-gray-200" />

            <a href="/mypage/verify" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              개인 정보 수정 ⚙
            </a>
          </div>
        </div>

        {/* 본문: 사이드바 + 메인 */}
        <div className="flex gap-5 items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            <StudyStatus status={COURSE_STATUS} />
            <StudyCalendar events={CALENDAR_EVENTS} />
            <StudyReport subjects={SUBJECTS} teachers={TEACHERS} />

            {/* 내 학습기기 + 학습지원 */}
            <div className="grid grid-cols-2 gap-5 mt-5">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">내 학습기기</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-xl flex-shrink-0">
                    +
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">등록된 기기가 없습니다.</p>
                    <p className="text-xs text-gray-400">(한 ID당 1개만 등록 가능)</p>
                  </div>
                  <button className="ml-auto text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
                    학습기기 이용안내
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">학습지원</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "💬", label: "자주하는 질문(FAQ)" },
                    { icon: "🖥", label: "학습기기 이용안내" },
                    { icon: "📖", label: "강좌&교재 이용가이드" },
                    { icon: "🔧", label: "원격 해결 서비스" },
                  ].map(({ icon, label }) => (
                    <button
                      key={label}
                      className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 공지사항 + 고객센터 */}
            <div className="grid grid-cols-2 gap-5 mt-5">
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">공지사항</h3>
                  <button className="text-gray-300 hover:text-gray-500 text-lg leading-none">+</button>
                </div>
                <div className="space-y-3">
                  {NOTICES.map((n) => (
                    <div key={n.id} className="flex items-center gap-2">
                      <p className="text-xs text-gray-600 flex-1 truncate hover:text-blue-500 cursor-pointer transition-colors">
                        {n.title}
                      </p>
                      {n.isNew && (
                        <span className="text-[10px] font-bold text-red-500 border border-red-300 px-1 rounded flex-shrink-0">
                          N
                        </span>
                      )}
                      <span className="text-xs text-gray-400 flex-shrink-0">{n.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-5">고객센터</h3>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">전화</p>
                      <p className="text-2xl font-bold text-blue-500">1599-6405</p>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      <p>평일 9시~18시(점심 12시~13시)</p>
                      <p>주말, 공휴일 상담불가</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-500">1:1 게시판 상담</p>
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
