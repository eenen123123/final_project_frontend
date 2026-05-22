import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Badge from '../../components/Badge/Badge';
import MyPageSidebar from './components/MyPageSidebar';
import StudyStatus from './components/StudyStatus';
import StudyCalendar from './components/StudyCalendar';
import StudyReport from './components/StudyReport';
import type { CourseStatus, CalendarEvent, StudySubject, TeacherRank } from '../../types/MyPageInterface';

// ── 공지사항 더미 데이터 ──────────────────────────────────────────────────
const NOTICES = [
  { id: 'n1', title: '[공지] 5/14(목) 02시~03시 헤르메스 사이트 통합 회원 기능 점검...', date: '2026.05.11', isNew: true },
  { id: 'n2', title: '[사전공지] 헤르메스 PCPLAYER 업데이트 예정 안내(2026/0...', date: '2026.04.29', isNew: true },
  { id: 'n3', title: '[공지] 3/19(수) 02시~06시 헤르메스 사이트 점검 작업', date: '2026.03.18', isNew: false },
  { id: 'n4', title: '[공지] 3/11(수) 00시~06시 헤르메스 사이트 일부 메뉴 점검 작업', date: '2026.02.27', isNew: false },
];

// ── 더미 데이터 ───────────────────────────────────────────────────────────
const COURSE_STATUS: CourseStatus = {
  active: 1, activeLabel: '0',
  completed: 2, waiting: 0, activeBook: 1,
  cart: 0, order: 0, coupon: 1, point: 0,
};

const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: '2026-05-01', type: 'event',    title: '5월 수강생 이벤트 시작' },
  { date: '2026-05-05', type: 'academic', title: '어린이날 (휴일)' },
  { date: '2026-05-07', type: 'personal', title: '사회문화 A — 2강 복습' },
  { date: '2026-05-08', type: 'personal', title: '3~4강 시청 예정' },
  { date: '2026-05-14', type: 'academic', title: '5월 모의고사' },
  { date: '2026-05-14', type: 'personal', title: '모의고사 당일 오답 정리' },
  { date: '2026-05-18', type: 'event',    title: '5.1~5.31 수강후기 작성 시 치킨 증정 🍗' },
  { date: '2026-05-22', type: 'event',    title: '5.1~5.31 수강후기 작성 시 치킨 증정 🍗' },
  { date: '2026-05-22', type: 'event',    title: '헤르메스에서 놓친 혜택 자수하고 선물 받자!' },
  { date: '2026-05-22', type: 'academic', title: '일정 없음. 다른 날을 확인해 보세요.' },
  { date: '2026-05-25', type: 'personal', title: '1단원 마무리 + 5월 학평 복습' },
  { date: '2026-05-29', type: 'academic', title: '중간 모의 테스트' },
];

const SUBJECTS: StudySubject[] = [
  { name: '국어',       percent: 75, minutes: 127 },
  { name: '수학',       percent: 40, minutes: 56  },
  { name: '영어',       percent: 80, minutes: 28  },
  { name: '탐구',       percent: 70, minutes: 196 },
  { name: '한국사',     percent: 65, minutes: 42  },
  { name: '제2외/한문', percent: 5,  minutes: 14  },
];

const TEACHERS: TeacherRank[] = [
  { rank: 1, label: '[사탐] 임정환선생님', hours: '2시간' },
  { rank: 2, label: '[국어] 박상호선생님', hours: '? 시간' },
  { rank: 3, label: '[수학] 이수학선생님', hours: '? 시간' },
  { rank: 4, label: '[영어] 최영어선생님', hours: '? 시간' },
  { rank: 5, label: '[사탐] 김사회선생님', hours: '? 시간' },
];
// 알림 더미데이터
const NOTIFICATIONS = [
  { id: 'a1', message: '사용하지 않은 쿠폰이 있습니다. [교재 할인권]', read: false, important: false, date: '2026.05.22' },
  { id: 'a2', message: '사회문화 A — 5월 모의고사 해설 라이브가 오늘 20:00 시작됩니다.', read: false, important: true, date: '2026.05.18' },
  { id: 'a3', message: '13~14강 자료가 업데이트되었습니다. [일탈 이론 v2]', read: false, important: false, date: '2026.05.05' },
  { id: 'a4', message: '수강 기간 만료 7일 전입니다. 연장을 확인해주세요.', read: false, important: true, date: '2026.05.04' },
  { id: 'a5', message: 'QnA #005번 질문에 답변이 등록되었습니다.', read: true, important: false, date: '2026.05.03' },
  { id: 'a6', message: '수강 기간 연장 정책이 변경되었습니다.', read: true, important: false, date: '2026.04.28' },
];
// 메세지 더미데이터
const MESSAGES = [
  { id: 'm1', from: '관리자', message: '5월 모의고사 해설 라이브 일정을 확인해주세요.', read: false, date: '2026.05.22' },
  { id: 'm2', from: '임정환 선생님', message: '질문 주신 사회문화 A 2강 내용 답변 드렸습니다.', read: false, date: '2026.05.20' },
  { id: 'm3', from: '관리자', message: '수강 기간 연장 정책 변경 안내드립니다.', read: true, date: '2026.04.28' },
];

// ──────────────────────────────────────────────────────────────────────────

const roleLabel: Record<string, string> = {
  ROLE_ADMIN: '관리자',
  ROLE_USER:  '일반 회원',
};
const roleBadgeVariant: Record<string, 'primary' | 'secondary' | 'danger'> = {
  ROLE_ADMIN: 'danger',
  ROLE_USER:  'primary',
};


export default function MyPage() {
  const { getRole, getUserName } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  // 알람 관련
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () =>
  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const notificationRef = useRef<HTMLDivElement>(null);

  // 알림 드롭다운 외부 클릭시 닫힘
  useEffect(()=>{
    const handleClickOutside = (e: MouseEvent) =>{
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)){
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  //메세지 관련
  const messageRef = useRef<HTMLDivElement>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState(MESSAGES);

  const unreadMessageCount = messages.filter((m) => !m.read).length;

  // 메세지 드롭다운 외부 클릭시 닫힘
  useEffect(() => {
  if (!showMessages) return;
  const handleClickOutside = (e: MouseEvent) => {
    if (messageRef.current && !messageRef.current.contains(e.target as Node)) {
      setShowMessages(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showMessages]);


  const userName    = getUserName();
  const role        = getRole();
  const displayRole = role ? (roleLabel[role] ?? role) : '-';
  const badgeVariant = role ? (roleBadgeVariant[role] ?? 'secondary') : 'secondary';
  const initial     = userName ? userName.charAt(0).toUpperCase() : '?';
  
  const [activeSection, setActiveSection] = useState('My Page');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 유저 정보 상단 바 */}
<div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center gap-5 mb-6 shadow-sm">
  {/* 역할 뱃지 */}
  <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md flex-shrink-0">
    {displayRole}
  </div>

  {/* 유저 정보 */}
  <div className="flex items-center gap-3 flex-1">
    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm flex-shrink-0">
      {initial}
    </div>
    <span className="text-gray-900 font-semibold">{userName ?? '-'}님</span>
    <Badge variant={badgeVariant} className="ml-1">{displayRole}</Badge>
  </div>

  {/* 우측 액션들 */}
  <div className="flex items-center gap-5 text-sm text-gray-500">
  
  {/* 쪽지 */}
<div className="relative" ref={messageRef}>
  <button
    onClick={() => setShowMessages((v) => !v)}
    className="relative hover:text-gray-900 transition-colors"
  >
    <span className="text-lg">✉️</span>
    {unreadMessageCount > 0 && (
      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-300 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
        !
      </span>
    )}
  </button>

  {showMessages && (
    <div className="absolute right-0 top-8 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">
          쪽지
          {unreadMessageCount > 0 && (
            <span className="ml-1.5 text-xs text-blue-600 font-medium">
              {unreadMessageCount}개 안읽음
            </span>
          )}
        </span>
        <button
          onClick={() => setMessages((prev) => prev.map((m) => ({ ...m, read: true })))}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          모두 읽음
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() =>
              setMessages((prev) =>
                prev.map((item) => item.id === m.id ? { ...item, read: true } : item)
              )
            }
            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
              !m.read ? 'bg-blue-50/50' : 'bg-white'
            }`}
          >
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              !m.read ? 'bg-blue-500' : 'bg-transparent'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-blue-400 font-medium mb-0.5">{m.from}</p>
              <p className={`text-xs leading-relaxed ${
                !m.read ? 'text-gray-900 font-medium' : 'text-gray-400'
              }`}>
                {m.message}
              </p>
              <p className="text-[10px] text-gray-300 mt-1">{m.date}</p>
            </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-2.5 border-t border-gray-100 text-center">
          <a href="/messages" className="text-xs text-gray-400 hover:text-blue-500 transition-colors">
            쪽지함 전체 보기
          </a>
        </div>
      </div>
    )}
  </div>

<div className="w-px h-4 bg-gray-200" />

{/* 알림 */}
<div className="relative" ref={notificationRef}>
  <button
    onClick={() => setShowNotifications((v) => !v)}
    className="relative hover:text-gray-900 transition-colors"
  >
    <span className="text-lg">🔔</span>
    {unreadCount > 0 && (
      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-300 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
        !
      </span>
    )}
  </button>

  {/* 드롭다운 */}
  {showNotifications && (
    <div className="absolute right-0 top-8 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">
          알림
          {unreadCount > 0 && (
            <span className="ml-1.5 text-xs text-blue-600 font-medium">
              {unreadCount}개 안읽음
            </span>
          )}
        </span>
        <button
          onClick={markAllRead}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          모두 읽음
        </button>
      </div>

      {/* 알림 목록 */}
      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() =>
              setNotifications((prev) =>
                prev.map((item) => item.id === n.id ? { ...item, read: true } : item)
              )
            }
            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
              !n.read ? 'bg-blue-50/50' : 'bg-white'
            }`}
          >
            {/* 읽음 여부 점 */}
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              !n.read ? 'bg-blue-500' : 'bg-transparent'
            }`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-relaxed ${
                !n.read ? 'text-gray-900 font-medium' : 'text-gray-400'
              }`}>
                {n.message}
              </p>
              <p className="text-[10px] text-gray-300 mt-1">{n.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="px-4 py-2.5 border-t border-gray-100 text-center">
        <button className="text-xs text-gray-400 hover:text-blue-500 transition-colors">
          전체 알림 보기
        </button>
      </div>
    </div>
  )}
</div>

    <div className="w-px h-4 bg-gray-200" />

    <span className="text-gray-900 font-semibold">2027 수능 <span className="text-blue-600">D-181</span></span>

    <div className="w-px h-4 bg-gray-200" />

    <a href="#profile" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
      개인 정보 수정 ⚙
    </a>
  </div>
</div>

        {/* 본문: 사이드바 + 메인 */}
        <div className="flex gap-5 items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 min-w-0">
            <StudyStatus status={COURSE_STATUS} />
            <StudyCalendar events={CALENDAR_EVENTS} />
            <StudyReport subjects={SUBJECTS} teachers={TEACHERS} />

            {/* 내 학습기기 + 학습지원 */}
            <div className="grid grid-cols-2 gap-5 mt-5">
              {/* 내 학습기기 */}
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

              {/* 학습지원 */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">학습지원</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '💬', label: '자주하는 질문(FAQ)' },
                    { icon: '🖥', label: '학습기기 이용안내' },
                    { icon: '📖', label: '강좌&교재 이용가이드' },
                    { icon: '🔧', label: '원격 해결 서비스' },
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
              {/* 공지사항 */}
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

              {/* 고객센터 */}
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
