import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ServiceSidebar from "./components/ServiceSidebar";
import api from "../../api/api";
import { useAuth } from "../../auth/AuthContext";
import { CATEGORY_CODE_MAP, type MainCategory } from "./FAQ/constants/faqConstants";

type FAQCategory = "BEST 10" | MainCategory;

interface FaqItem { postSn: number; postSj: string; topFixYn?: string; }
interface NoticeItem { postSn: number; postSj: string; regDt: string; }
interface QnaItem { postSn: number; postSj: string; answStatCd: string; regDt: string; }

const FAQ_CATEGORIES: { label: FAQCategory; icon: React.ReactNode }[] = [
  { label: "BEST 10", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> },
  { label: "강의/교재", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },
  { label: "결제", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg> },
  { label: "학습기기", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v15a2.25 2.25 0 002.25 2.25z" /></svg> },
  { label: "동영상", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg> },
  { label: "도서", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },
];

const GUIDE_ITEMS = [
  { title: "수강 준비하기", to: "/customer/guide/prepare", links: ["브라우저 설치", "회원가입 및 로그인", "강좌 신청/결제", "수강 시작"] },
  { title: "수강 알아보기", to: "/customer/guide/info",    links: ["강좌 종류", "수강 기간", "수강 방법", "환불/취소"] },
  { title: "수강 시작하기", to: "/customer/guide/start",   links: ["마이페이지 접속", "강의 시청", "학습 관리", "수강 완료"] },
  { title: "수강 활용하기", to: "/customer/guide/use",     links: ["수강 리포트", "쿠폰/포인트", "Q&A 이용", "캘린더 활용"] },
];

export default function ServiceCenterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("BEST 10");
  const [searchInput, setSearchInput] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [myQnas, setMyQnas] = useState<QnaItem[]>([]);
  const [faqLoading, setFaqLoading] = useState(false);

  // FAQ 조회
  const fetchFaqs = useCallback(async (category: FAQCategory) => {
    setFaqLoading(true);
    try {
      const params: Record<string, string | number> = { page: 1, size: 10 };
      if (category === "BEST 10") {
        params.topFixYn = "Y";
      } else {
        params.faqCtgCd = CATEGORY_CODE_MAP[category as MainCategory];
      }
      const res = await api.get<{ items: FaqItem[] }>("/api/faq/paged", { params });
      setFaqs(res.data.items ?? []);
    } catch { setFaqs([]); }
    finally { setFaqLoading(false); }
  }, []);

  // 공지사항 최신 3개
  useEffect(() => {
    api.get<{ items: NoticeItem[] }>("/api/notice/paged", { params: { page: 1, size: 3 } })
      .then((res) => setNotices(res.data.items ?? []))
      .catch(() => {});
  }, []);

  // 나의 최근 QnA (로그인 시)
  useEffect(() => {
    if (!isAuthenticated) return;
    api.get<{ items: QnaItem[] }>("/api/qna/paged", { params: { myOnly: true, page: 1, size: 1 } })
      .then((res) => setMyQnas(res.data.items ?? []))
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => { fetchFaqs(activeCategory); }, [activeCategory, fetchFaqs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/customer/faq?keyword=${encodeURIComponent(searchInput.trim())}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-0 items-start">
          <ServiceSidebar />

          <div className="flex-1 min-w-0 pl-5">
            {/* 상단 인사말 + 검색 + 바로가기 */}
            <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-0.5">안녕하세요.</p>
                <p className="text-xl font-extrabold text-gray-900 mb-4">
                  <span className="text-blue-600">헤르메스</span> 고객센터입니다.
                </p>
                <form onSubmit={handleSearch} className="flex items-center gap-2 border-b border-gray-300 pl-0.5 pb-1.5 max-w-[260px] focus-within:border-gray-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0Zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="검색어를 입력해 주세요."
                    className="flex-1 text-sm text-gray-800 bg-transparent placeholder-gray-400 focus:outline-none"
                  />
                  <button type="submit" className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </button>
                </form>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                {[
                  { label: "공지사항", to: "/customer/notice", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg> },
                  { label: "FAQ 확인", to: "/customer/faq", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg> },
                  { label: "질문 작성", to: "/customer/qna/write", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg> },
                ].map(({ label, to, icon }) => (
                  <Link key={label} to={to} className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all w-28 text-center">
                    {icon}
                    <span className="text-xs font-medium text-gray-600">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-8 border border-gray-200 rounded overflow-hidden">
              <div className="text-center py-6 bg-white border-b border-gray-200">
                <h2 className="text-2xl font-black text-gray-900">자주하는 질문 <em className="not-italic text-blue-600 font-black">FAQ</em></h2>
              </div>

              <div className="bg-[#e8e4da]">
                <ul className="flex border-b border-gray-300">
                  {FAQ_CATEGORIES.map(({ label, icon }) => (
                    <li key={label} className="flex-1">
                      <button
                        onClick={() => setActiveCategory(label)}
                        className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors ${activeCategory === label ? "text-blue-600 border-b-2 border-blue-600 -mb-px" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        <span className="text-base">{icon}</span>
                        <span>{label}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="p-4 grid grid-cols-5 gap-3 min-h-[120px]">
                  {faqLoading ? (
                    <div className="col-span-5 flex items-center justify-center text-xs text-gray-400">불러오는 중...</div>
                  ) : faqs.length === 0 ? (
                    <div className="col-span-5 flex items-center justify-center text-xs text-gray-400">등록된 FAQ가 없습니다.</div>
                  ) : faqs.map((item, idx) => (
                    <Link
                      key={item.postSn}
                      to={`/customer/faq/${item.postSn}`}
                      className="bg-white border border-gray-200 rounded p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
                    >
                      <p className="text-xs text-gray-400 font-mono mb-2">{String(idx + 1).padStart(2, "0")}</p>
                      <p className="text-xs text-gray-700 leading-relaxed group-hover:text-blue-600 transition-colors">{item.postSj}</p>
                    </Link>
                  ))}
                </div>

                <div className="text-right px-4 pb-3">
                  <Link to="/customer/faq" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">전체 FAQ 더보기 +</Link>
                </div>
              </div>
            </div>

            {/* 전화 상담 + 공지사항 */}
            <div className="flex border border-gray-200 rounded mb-8 overflow-hidden" style={{ minHeight: "280px" }}>
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
              </div>

              <div className="flex-1 flex flex-col divide-y divide-gray-200">
                <div className="flex-1 px-6 flex items-center">
                  <Link to="/customer/qna" className="flex items-center gap-3 group w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">게시판 상담 ›</p>
                      <p className="text-xs text-gray-500 mt-0.5">평일 <strong className="text-gray-700">09:00~24:00</strong> <span className="ml-1.5 text-gray-400">주말, 공휴일 상담불가</span></p>
                    </div>
                  </Link>
                </div>

                <div className="flex-1 px-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold text-gray-800">나의 최근 게시판 상담 현황</p>
                    {isAuthenticated && <Link to="/customer/qna/my" className="text-xs text-gray-400 hover:text-gray-600">전체보기 ›</Link>}
                  </div>
                  {!isAuthenticated ? (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">· 로그인 후 확인 가능합니다.</p>
                      <Link to="/login" className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors whitespace-nowrap">로그인 하기 ›</Link>
                    </div>
                  ) : myQnas.length === 0 ? (
                    <p className="text-xs text-gray-400">· 등록된 상담 내역이 없습니다.</p>
                  ) : (
                    <ul className="space-y-1">
                      {myQnas.map((q) => (
                        <li key={q.postSn} className="flex items-center justify-between gap-2">
                          <Link to={`/customer/qna/${q.postSn}`} className="text-xs text-gray-600 hover:text-blue-600 transition-colors truncate">
                            · {q.postSj.length > 30 ? q.postSj.slice(0, 30) + " ...." : q.postSj}
                          </Link>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${q.answStatCd === 'Y' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                            {q.answStatCd === 'Y' ? '답변완료' : '대기중'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex-1 px-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-800">공지 사항</p>
                    <Link to="/customer/notice" className="text-xs text-gray-400 hover:text-gray-600">›</Link>
                  </div>
                  <ul className="space-y-1.5">
                    {notices.length === 0 ? (
                      <li className="text-xs text-gray-400">공지사항이 없습니다.</li>
                    ) : notices.map((n) => (
                      <li key={n.postSn} className="flex items-center justify-between gap-3">
                        <Link to={`/customer/notice/${n.postSn}`} className="text-xs text-gray-600 hover:text-blue-600 transition-colors truncate">· {n.postSj}</Link>
                        <span className="text-xs text-gray-400 flex-shrink-0">{n.regDt?.slice(0, 10).replace(/-/g, ".")}</span>
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
                  <div key={guide.title} className={`p-4 ${idx < GUIDE_ITEMS.length - 1 ? "border-r border-gray-200" : ""}`}>
                    <Link to={guide.to} className="text-xs font-extrabold text-gray-900 mb-3 block hover:text-blue-600 transition-colors">{guide.title}</Link>
                    <ul className="space-y-1.5">
                      {guide.links.map((link) => (
                        <li key={link}>
                          <Link to={guide.to} className="text-xs text-gray-600 hover:text-blue-600 hover:underline transition-colors">· {link}</Link>
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
                <p className="text-sm text-gray-700">수강에 어려움이 있으신가요? <strong className="text-blue-600">원활한 강좌 수강을 도와드립니다.</strong></p>
              </div>
              <div className="grid grid-cols-3 border border-gray-200 rounded overflow-hidden">
                {[
                  { title: "필요한 프로그램 설치", desc: "강좌 수강할 때 필요한\n프로그램을 한 눈에 확인", icon: "⬇", to: "/customer/guide/start" },
                  { title: "동영상 권장 사양", desc: "동영상 시청 시 필요한\nPC/모바일 권장 사양 안내", icon: "💻", to: "/customer/guide/prepare" },
                  { title: "자주하는 질문 FAQ", desc: "궁금한 점은\nFAQ에서 빠르게 확인", icon: "📋", to: "/customer/faq" },
                ].map(({ title, desc, icon, to }, idx) => (
                  <Link key={title} to={to} className={`flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group ${idx < 2 ? "border-r border-gray-200" : ""}`}>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</p>
                      <p className="text-xs text-gray-400 whitespace-pre-line leading-relaxed">{desc}</p>
                    </div>
                    <span className="text-3xl opacity-50 flex-shrink-0 ml-3">{icon}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
