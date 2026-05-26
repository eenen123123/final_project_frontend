import { useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceSidebar from './components/ServiceSidebar';

type FAQCategory = 'BEST 10' | '강의/교재' | '결제' | '학습기기' | '동영상' | '도서';

const FAQ_CATEGORIES: { label: FAQCategory; icon: React.ReactNode }[] = [

{ 
    label: 'BEST 10', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.44.82-.44.992 0l2.181 5.562a1 1 0 0 0.758.55l6.012.5a.55.55 0 0 1 .306.96l-4.524 4.053a1 1 0 0 0-.323.996l1.327 5.869a.55.55 0 0 1-.82.596l-5.11-3.053a1 1 0 0 0-.936 0l-5.11 3.053a.55.55 0 0 1-.82-.596l1.327-5.869a1 1 0 0 0-.323-.996L3.02 11.071a.55.55 0 0 1 .306-.96l6.013-.5a1 1 0 0 0 .757-.55l2.181-5.562z" />
      </svg>
    )
  },
  { 
    label: '결제',     
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 7.5h19m-19 4h19m-19 5h14m1.5-11.5h-16A2.5 2.5 0 0 0 1.5 7.5v9A2.5 2.5 0 0 0 4.5 19h16a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 20.5 5Z" />
      </svg>
    ) 
  },
  { 
    label: '학습기기',  
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v15a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ) 
  },
  { 
    label: '동영상',   
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
      </svg>
    ) 
  },
  { 
    label: '도서',     
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ) 
  },
];

const FAQ_ITEMS: Record<FAQCategory, { id: number; question: string }[]> = {
  'BEST 10': [
    { id: 1,  question: '강좌 환불(취소) 기준은 어떻게 되나요?' },
    { id: 2,  question: '수강 리워드 적립은 어떻게 하나요?' },
    { id: 3,  question: '월간 구독권 강좌 신청 방법을 알려주세요.' },
    { id: 4,  question: '교재는 어떻게 신청 하나요?' },
    { id: 5,  question: '아이디/비밀번호를 분실했어요. (계정 찾기)' },
    { id: 6,  question: '교재 패키지는 어떻게 배송 받을 수 있나요?' },
    { id: 7,  question: '교재 배송 조회는 어디서 할 수 있나요?' },
    { id: 8,  question: '배송비 쿠폰은 어떻게 사용하나요?' },
    { id: 9,  question: '수강앱 기기 등록/해제 방법' },
    { id: 10, question: '플레이어 오류 발생 시 어떻게 하나요?' },
  ],
  '강의/교재': [
    { id: 1, question: '강좌 환불(취소) 기준은 어떻게 되나요?' },
    { id: 2, question: '월간 구독권 강좌 신청 방법을 알려주세요.' },
    { id: 3, question: '월간 구독권 해지 방법을 알려주세요.' },
    { id: 4, question: '교재는 어떻게 신청 하나요?' },
    { id: 5, question: '강좌 수강기간 연장은 어떻게 하나요?' },
    { id: 6, question: '교재 배송 조회는 어디서 할 수 있나요?' },
    { id: 7, question: '강좌 결제 방법은 어떤 게 있나요?' },
    { id: 8, question: '교재 패키지 배송 방법은?' },
    { id: 9, question: '수강 기간 연장 정책은 어떻게 되나요?' },
    { id: 10, question: '미리보기 강의가 있나요?' },
  ],
  '결제': [
    { id: 1, question: '결제 수단은 어떤 것들이 있나요?' },
    { id: 2, question: '카드 결제가 안 될 때는 어떻게 하나요?' },
    { id: 3, question: '현금영수증 발급은 어떻게 하나요?' },
    { id: 4, question: '무통장 입금은 언제까지 가능한가요?' },
    { id: 5, question: '월간 구독권 결제 수단을 변경하고 싶어요.' },
  ],
  '학습기기': [
    { id: 1, question: '수강앱 기기 등록/해제 방법' },
    { id: 2, question: '수강앱 데이터 캐시 삭제 방법' },
    { id: 3, question: '아이디당 1대 기기등록 오류 확인 사항' },
    { id: 4, question: '수강앱 지원 기종 안내' },
    { id: 5, question: '수강 시 버퍼링 발생 오류 확인 사항' },
  ],
  '동영상': [
    { id: 1, question: '[Win] 플레이어 설치방법' },
    { id: 2, question: '[Mac] 플레이어 설치방법' },
    { id: 3, question: '강의 수강 후 진도율이 반영되지 않는 경우' },
    { id: 4, question: '플레이어 캡처 차단 발생 오류' },
    { id: 5, question: '플레이어 캐시 삭제 방법' },
  ],
  '도서': [
    { id: 1, question: '도서 결제 방법을 알려주세요.' },
    { id: 2, question: '신청한 도서를 취소하고 싶어요.' },
    { id: 3, question: '도서 배송 현황은 어디서 확인할 수 있나요?' },
    { id: 4, question: '묶음배송이 가능한가요?' },
    { id: 5, question: '도서 내용 문의는 어디에 하나요?' },
  ],
};

const GUIDE_ITEMS = [
  {
    title: '수강 준비하기',
    links: ['회원가입 탈퇴', '다이렉트 수강신청', '강좌 수강신청', '교재 PASS 신청', '교재 구매', '주문/결제 방법', '주문/배송 조회'],
  },
  {
    title: '수강 알아보기',
    links: ['수강 주요기능 (모바일)', '수강연장 및 정지', '취소/환불 안내', '강의목록', '강의자료', '강의노트'],
  },
  {
    title: '수강 시작하기',
    links: ['무료 플레이어', '21:9 WIDE', '강좌 관련 기능', '재생 컨트롤러'],
  },
  {
    title: '수강 활용하기',
    links: ['인덱스', '북마크', '10분 강의컷', '수강 학습지원 메뉴', '집중 학습모드'],
  },
];

const NOTICES = [
  { title: '[공지] 5/14(목) 02시~03시 사이트 통합 회원 기능 점검 안내', date: '2026.05.11' },
  { title: '[사전공지] PCPLAYER 업데이트 예정 안내 (2026/05/06)', date: '2026.04.29' },
  { title: '[공지] 3/19(수) 02시~06시 사이트 점검 작업', date: '2026.03.18' },
];

export default function ServiceCenterPage() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('BEST 10');
  const [search, setSearch] = useState('');

  const faqs = FAQ_ITEMS[activeCategory];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-0 items-start">

          {/* 사이드바 */}
          <ServiceSidebar />

          {/* 메인 콘텐츠 */}
          <div className="flex-1 min-w-0 pl-5">

            {/* 상단 인사말 + 검색 + 바로가기 */}
            <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">

           {/* 좌측: 인사말 + 검색 */}
  <div className="flex-1">
    <p className="text-sm text-gray-500 mb-0.5">안녕하세요.</p>
    <p className="text-xl font-extrabold text-gray-900 mb-4">
      <span className="text-blue-600">헤르메스</span> 고객센터입니다.
    </p>
    
    <div className="flex items-center gap-2 border-0 border-b border-gray-300 pl-0.5 pb-1.5 max-w-[260px] transition-colors focus-within:border-gray-900">
      
        <div className="relative group cursor-help flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>

        {/* 호버 시 뜨는 툴팁 내용 */}
            <div className="absolute left-0 top-full mt-2 w-[210px] p-2.5 bg-white border border-gray-200 rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 pointer-events-none">
            <div className="absolute -top-[5px] left-1.5 w-2 h-2 rotate-45 bg-white border-t border-l border-gray-200"></div>
            <p className="text-[11px] text-gray-600 font-medium leading-normal text-left whitespace-pre-line">
                단어로 검색 시 보다 정확한 FAQ를{"\n"}확인할 수 있습니다.
            </p>
            </div>
        </div>

        {/* 기존 인풋창 */}
        <input
            type="text"
            placeholder="검색어를 입력해 주세요."
            className="flex-1 text-sm text-gray-800 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0"
        />
        
        {/* 기존 우측 돋보기 버튼 */}
        <button className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </button>
        </div>
    </div>

              {/* 우측: 바로가기 버튼 3개 */}
              <div className="flex gap-3 flex-shrink-0">
                {[
                  { label: '공지사항', to: '/customer/notice', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                    </svg>
                  )},
                  { label: 'FAQ 확인', to: '/customer/faq', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  )},
                  { label: '질문 작성', to: '/customer/qna', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  )},
                ].map(({ label, to, icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all w-28 text-center"
                  >
                    {icon}
                    <span className="text-xs font-medium text-gray-600">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-8 border border-gray-200 rounded overflow-hidden">
              {/* 타이틀 — 흰 배경 */}
              <div className="text-center py-6 bg-white border-b border-gray-200">
                <h2 className="text-2xl font-black text-gray-900">
                  자주하는 질문 <em className="not-italic text-blue-600 font-black">FAQ</em>
                </h2>
              </div>

              {/* 카테고리 탭 — 베이지 배경 */}
              <div className="bg-[#e8e4da]">
                <ul className="flex border-b border-gray-300">
                  {FAQ_CATEGORIES.map(({ label, icon }) => (
                    <li key={label} className="flex-1">
                      <button
                        onClick={() => setActiveCategory(label)}
                        className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors ${
                          activeCategory === label
                            ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <span className="text-base">{icon}</span>
                        <span>{label}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* FAQ 카드 그리드 — 베이지 배경 + 흰 카드 */}
                <div className="p-4 grid grid-cols-5 gap-3">
                  {faqs.map(({ id, question }) => (
                    <a
                      key={id}
                      href="#"
                      className="bg-white border border-gray-200 rounded p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
                    >
                      <p className="text-xs text-gray-400 font-mono mb-2">
                        {String(id).padStart(2, '0')}
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed group-hover:text-blue-600 transition-colors">
                        {question}
                      </p>
                    </a>
                  ))}
                </div>

                <div className="text-right px-4 pb-3">
                  <a href="/customer/faq" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    전체 FAQ 더보기 +
                  </a>
                </div>
              </div>
            </div>

            {/* 전화 상담 + 게시판 상담 */}
            <div className="flex border border-gray-200 rounded mb-8 overflow-hidden" style={{ minHeight: '280px' }}>

              {/* 좌측 - 전화 상담 */}
              <div className="flex-1 border-r border-gray-200 flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tight">1599-6405</p>
                <div className="text-xs text-gray-600 leading-5 text-left">
                  <p><span className="font-bold">전화</span> 평일 09시~18시</p>
                  <p><span className="font-bold">상담</span> 점심시간 : 12시~13시</p>
                  <p className="text-gray-400">(주말, 공휴일 상담불가)</p>
                </div>
                <p className="text-xs text-gray-400 leading-5 text-center">
                  원하는 서비스를 빠르게 이용하도록<br />각 서비스의 번호를 알려드립니다.
                </p>
                <button className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-600 hover:border-gray-500 transition-colors">
                  <span>서비스별 전화번호 보기</span>
                  <span className="text-gray-400">›</span>
                </button>
              </div>

              {/* 우측 - 3등분 */}
              <div className="flex-1 flex flex-col divide-y divide-gray-200">

                {/* 게시판 상담 */}
                <div className="flex-1 px-6 flex items-center">
                  <Link to="/customer/qna" className="flex items-center gap-3 group w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">게시판 상담 ›</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        평일 <strong className="text-gray-700">09:00~24:00</strong>
                        <span className="ml-1.5 text-gray-400">주말, 공휴일 상담불가</span>
                      </p>
                    </div>
                  </Link>
                </div>

                {/* 나의 최근 상담 현황 */}
                <div className="flex-1 px-6 flex flex-col justify-center">
                  <p className="text-xs font-bold text-gray-800 mb-1.5">나의 최근 게시판 상담 현황</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">· 로그인 후 확인 가능합니다.</p>
                    <Link to="/login" className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors whitespace-nowrap">
                      로그인 하기 ›
                    </Link>
                  </div>
                </div>

                {/* 공지사항 */}
                <div className="flex-1 px-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-800">공지 사항</p>
                    <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">›</span>
                  </div>
                  <ul className="space-y-1.5">
                    {NOTICES.map((n) => (
                      <li key={n.title} className="flex items-center justify-between gap-3">
                        <a href="#" className="text-xs text-gray-600 hover:text-blue-600 transition-colors truncate">
                          · {n.title}
                        </a>
                        <span className="text-xs text-gray-400 flex-shrink-0">{n.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

            {/* 학습 이용 가이드 */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-base font-extrabold text-gray-900">학습 이용 가이드</h3>
                <p className="text-xs text-gray-400">쉽고 친절한 이용 방법을 확인해보세요.</p>
              </div>
              <div className="grid grid-cols-4 border border-gray-200 rounded overflow-hidden">
                {GUIDE_ITEMS.map((guide, idx) => (
                  <div
                    key={guide.title}
                    className={`p-4 ${idx < GUIDE_ITEMS.length - 1 ? 'border-r border-gray-200' : ''}`}
                  >
                    <p className="text-xs font-extrabold text-gray-900 mb-3">{guide.title}</p>
                    <ul className="space-y-1.5">
                      {guide.links.map((link) => (
                        <li key={link}>
                          <a href="#" className="text-xs text-gray-600 hover:text-blue-600 hover:underline transition-colors">
                            · {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 수강에 어려움이 있으신가요 */}
            <div>
              <div className="text-center py-2 mb-4">
                <p className="text-sm text-gray-700">
                  수강에 어려움이 있으신가요?{' '}
                  <strong className="text-blue-600">원활한 강좌 수강을 도와드립니다.</strong>
                </p>
              </div>
              <div className="grid grid-cols-3 border border-gray-200 rounded overflow-hidden">
                {[
                  { title: '필요한 프로그램 설치', desc: '강좌 수강할 때 필요한\n프로그램을 한 눈에 확인', icon: '⬇' },
                  { title: '동영상 권장 사양', desc: '동영상 시청 시 필요한\nPC/모바일 권장 사양 안내', icon: '💻' },
                  { title: '동영상/인터넷 자가 진단', desc: '동영상 및 인터넷\n속도를 측정', icon: '📊' },
                ].map(({ title, desc, icon }, idx) => (
                  <a
                    key={title}
                    href="#"
                    className={`flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group ${idx < 2 ? 'border-r border-gray-200' : ''}`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {title}
                      </p>
                      <p className="text-xs text-gray-400 whitespace-pre-line leading-relaxed">{desc}</p>
                    </div>
                    <span className="text-3xl opacity-50 flex-shrink-0 ml-3">{icon}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
