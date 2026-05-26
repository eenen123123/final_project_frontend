import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ServiceSidebar from '../components/ServiceSidebar';

type MainCategory = '강의/교재' | '결제' | '학습기기' | '동영상' | '도서';
type SearchType = '제목+내용' | '제목';

interface FAQItem {
  id: number;
  isBest: boolean;
  mainCategory: MainCategory;
  subCategory: string;
  question: string;
}

// Icon = React.ReactNode 타입으로 변경
const MAIN_CATEGORIES: { label: MainCategory; icon: React.ReactNode }[] = [
  { 
    label: '강의/교재', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
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

const SUB_CATEGORIES: Record<MainCategory, string[]> = {
  '강의/교재': ['전체', '수강신청', '수강기간', '교재', '환불/취소'],
  '결제':     ['전체', '결제수단', '영수증', '쿠폰/포인트'],
  '학습기기':  ['전체', '기기등록', '앱설치', '오류'],
  '동영상':   ['전체', '플레이어 기능', '플레이어 설치', '플레이어 재생'],
  '도서':     ['전체', '주문', '배송', '반품/교환'],
};

const FAQ_ITEMS: FAQItem[] = [
  { id: 1,  isBest: true,  mainCategory: '강의/교재', subCategory: '수강신청',  question: '강좌 환불(취소) 기준은 어떻게 되나요?' },
  { id: 2,  isBest: true,  mainCategory: '강의/교재', subCategory: '수강신청',  question: '월간 구독권 강좌 신청 방법을 알려주세요.' },
  { id: 3,  isBest: true,  mainCategory: '강의/교재', subCategory: '교재',      question: '교재는 어떻게 신청 하나요?' },
  { id: 4,  isBest: true,  mainCategory: '결제',      subCategory: '결제수단',  question: '결제 수단은 어떤 것들이 있나요?' },
  { id: 5,  isBest: true,  mainCategory: '결제',      subCategory: '쿠폰/포인트',question: '쿠폰은 어떻게 사용하나요?' },
  { id: 6,  isBest: false, mainCategory: '강의/교재', subCategory: '수강기간',  question: '강좌 수강기간 연장은 어떻게 하나요?' },
  { id: 7,  isBest: false, mainCategory: '강의/교재', subCategory: '교재',      question: '교재 배송 조회는 어디서 할 수 있나요?' },
  { id: 8,  isBest: false, mainCategory: '결제',      subCategory: '영수증',    question: '현금영수증 발급은 어떻게 하나요?' },
  { id: 9,  isBest: false, mainCategory: '결제',      subCategory: '결제수단',  question: '무통장 입금은 언제까지 가능한가요?' },
  { id: 10, isBest: true,  mainCategory: '학습기기',  subCategory: '기기등록',  question: '수강앱 기기 등록/해제 방법' },
  { id: 11, isBest: false, mainCategory: '학습기기',  subCategory: '앱설치',    question: '수강앱 데이터 캐시 삭제 방법' },
  { id: 12, isBest: false, mainCategory: '학습기기',  subCategory: '오류',      question: '아이디당 1대 기기등록 오류 확인 사항' },
  { id: 13, isBest: true,  mainCategory: '동영상',   subCategory: '플레이어 설치', question: '[Win] 플레이어 설치방법' },
  { id: 14, isBest: true,  mainCategory: '동영상',   subCategory: '플레이어 설치', question: '[Mac] 플레이어 설치방법' },
  { id: 15, isBest: true,  mainCategory: '동영상',   subCategory: '플레이어 재생', question: '강의 수강 후 진도율이 반영되지 않는 경우' },
  { id: 16, isBest: true,  mainCategory: '동영상',   subCategory: '플레이어 재생', question: '플레이어 캡처 차단 발생 오류' },
  { id: 17, isBest: false, mainCategory: '동영상',   subCategory: '플레이어 기능', question: '플레이어 캐시 삭제 방법' },
  { id: 18, isBest: false, mainCategory: '동영상',   subCategory: '플레이어 재생', question: '강의 재생 시 플레이어가 닫히는 경우' },
  { id: 19, isBest: true,  mainCategory: '도서',      subCategory: '주문',       question: '도서 결제 방법을 알려주세요.' },
  { id: 20, isBest: false, mainCategory: '도서',      subCategory: '반품/교환',  question: '신청한 도서를 취소하고 싶어요.' },
  { id: 21, isBest: false, mainCategory: '도서',      subCategory: '배송',       question: '도서 배송 현황은 어디서 확인할 수 있나요?' },
];

const PAGE_SIZE = 10;

export default function FAQPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMain = (searchParams.get('category') ?? '강의/교재') as MainCategory;
  const activeSub  = searchParams.get('sub') ?? '전체';

  const [searchType,   setSearchType]   = useState<SearchType>('제목+내용');
  const [searchInput,  setSearchInput] = useState('');
  const [searchQuery,  setSearchQuery] = useState('');
  const [page,         setPage]        = useState(1);

  const handleMainChange = (cat: MainCategory) => {
    setSearchParams({ category: cat });
    setPage(1);
  };

  const handleSubChange = (sub: string) => {
    setSearchParams({ category: activeMain, sub });
    setPage(1);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) { alert('검색값을 입력하세요'); return; }
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = FAQ_ITEMS.filter((f) => f.mainCategory === activeMain);
    if (activeSub !== '전체') result = result.filter((f) => f.subCategory === activeSub);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((f) => f.question.toLowerCase().includes(q));
    }
    return result;
    // {serachParams 임시값, 수정 필요}
  }, [activeMain, activeSub, searchQuery, searchParams]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <ServiceSidebar />

          <div className="flex-1 min-w-0">
            {/* 브레드크럼 */}
            <div className="text-xs text-gray-400 mb-3">
              <Link to="/service" className="hover:text-blue-500 transition-colors">고객센터</Link>
              <span className="mx-1">&gt;</span>
              <span className="text-gray-600">자주하는 질문(FAQ)</span>
            </div>

            {/* 타이틀  */}
            <div className="mb-6 flex flex-col gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                자주하는 질문(<span className="text-blue-600">FAQ</span>)
              </h1>
              <span className="text-xs text-gray-400 loyalty-subtitle">
                궁금한 내용을 빠르게 해결하세요!
              </span>
            </div>

           {/* 대분류 탭 - 격자 UI 내부 아이콘 렌더링 */}
            <div className="grid grid-cols-5 mb-5 select-none">
              {MAIN_CATEGORIES.map(({ label, icon }) => {
                const isActive = activeMain === label;
                return (
                  <button
                    key={label}
                    onClick={() => handleMainChange(label)}
                    className={`flex flex-col items-center justify-center py-4 border -ml-px -mt-px text-xs transition-all ${
                      isActive
                        ? 'border-blue-600 z-10 text-blue-600 font-bold bg-white shadow-[0_0_0_1px_rgba(37,99,235,1)]'
                        : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {/* 이모지 전용 텍스트 크기(text-lg)를 제거하고 색상이 자연스럽게 상속되도록 변경 */}
                    <span className="mb-1.5 text-current opacity-85">{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* 중분류 탭 - 텍스트 스타일 디자인 */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 pl-1 select-none">
              {SUB_CATEGORIES[activeMain].map((sub) => {
                const isActive = activeSub === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => handleSubChange(sub)}
                    className={`text-xs transition-colors py-1 ${
                      isActive
                        ? 'text-blue-600 font-bold' 
                        : 'text-gray-400 font-medium hover:text-gray-700'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>

            {/* FAQ 테이블 */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                총 <strong className="text-blue-600">{filtered.length}</strong>개의 자주하는 질문(FAQ)
              </p>
              <table className="w-full border-t-2 border-gray-800 text-sm">
                <colgroup>
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '130px' }} />
                  <col />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">번호</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">대분류</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">중분류</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-left">질문</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.length > 0 ? paged.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 text-center">
                        {item.isBest ? (
                          <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            BEST
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">{item.id}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-gray-500">{item.mainCategory}</td>
                      <td className="py-3 px-3 text-center text-xs text-gray-500">{item.subCategory}</td>
                      <td className="py-3 px-3">
                        <a href="#" className="text-sm text-gray-800 hover:text-blue-600 transition-colors">
                          {item.question}
                        </a>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mb-6">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  ◀◀
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      page === p
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  ▶▶
                </button>
              </div>
            )}

            {/* 하단 검색 */}
            <div className="flex items-center gap-2 mb-8 justify-center">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as SearchType)}
                className="border border-gray-300 rounded text-xs px-2 py-2 focus:outline-none text-gray-600"
              >
                <option>제목+내용</option>
                <option>제목</option>
              </select>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="찾고 싶은 단어를 입력해주세요."
                className="border border-gray-300 rounded text-xs px-3 py-2 w-72 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button
                onClick={handleSearch}
                className="bg-gray-700 hover:bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
              >
                검색
              </button>
            </div>

           {/* 하단 1:1 상담 Box 영역 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white text-center">
              {/* 상단 안내 문구 */}
              <p className="text-xs text-gray-600 mb-5">
                원하는 답변을 찾지 못하셨나요?{' '}
                <Link to="/service/inquiry" className="text-blue-600 font-bold underline decoration-blue-600 underline-offset-2">
                  1:1 상담으로 도와드릴게요.
                </Link>
              </p>
              
              {/* 상담 콘텐츠 정렬 */}
              <div className="flex justify-center items-center gap-12 md:gap-24">
                
                {/* 전화 상담 */}
                <div className="flex items-center gap-3 text-left">
                  {/* 원형 번호 마크 */}
                  <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex flex-col items-center justify-center flex-shrink-0 text-[10px] font-bold text-gray-500 leading-tight">
                    <span>1599</span>
                    <span>6405</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 mb-0.5">전화 상담</p>
                    <p className="text-[11px] text-gray-500 leading-normal">
                      평일 <span className="font-bold text-gray-800">09시~18시</span>
                      <span className="text-gray-400 ml-1">/ 점심시간 12시~13시</span>
                    </p>
                    <p className="text-[11px] text-gray-400">(주말, 공휴일 상담불가)</p>
                  </div>
                </div>

                {/* 게시판 상담 */}
                <Link to="/customer/qna" className="flex items-center gap-3 text-left group">
                  {/* 원형 아이콘 마크 */}
                  <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 group-hover:text-cyan-600 transition-colors mb-0.5">
                      게시판 상담 <span className="text-[10px] font-normal text-gray-400 ml-0.5">&gt;</span>
                    </p>
                    <p className="text-[11px] text-gray-500 leading-normal">
                      평일 <span className="font-bold text-gray-800">09시~24시</span>
                    </p>
                    <p className="text-[11px] text-gray-400">(주말, 공휴일 상담불가)</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}