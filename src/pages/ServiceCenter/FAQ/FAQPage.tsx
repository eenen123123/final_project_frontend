import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ServiceSidebar from '../components/ServiceSidebar';
import FAQCategoryTabs from './components/FAQCategoryTabs';
import { CATEGORY_CODE_MAP, SUB_CATEGORY_CODE_MAP, type MainCategory } from './constants/faqConstants';
import type { FaqItem } from '../../../types/board/FaqInterface';

type SearchType = '제목+내용' | '제목';

const PAGE_SIZE = 10;
const API_BASE = 'http://localhost:8081';

export default function FAQPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMain = (searchParams.get('category') ?? '강의/교재') as MainCategory;
  const activeSub  = searchParams.get('sub') ?? '전체';

  const [faqList,     setFaqList]     = useState<FaqItem[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [searchType,  setSearchType]  = useState<SearchType>('제목+내용');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page,        setPage]        = useState(1);

  useEffect(() => {
    const fetchFaqList = async () => {
      setLoading(true);
      try {
        const ctgCd    = CATEGORY_CODE_MAP[activeMain];
        const subCtgCd = activeSub !== '전체' ? SUB_CATEGORY_CODE_MAP[activeSub] : '';

        const params = new URLSearchParams();
        if (ctgCd)    params.append('faqCtgCd', ctgCd);
        if (subCtgCd) params.append('faqSubCtgCd', subCtgCd);

        const res  = await fetch(`${API_BASE}/api/faq?${params.toString()}`);
        const data = await res.json();
        setFaqList(data);
        setPage(1);
      } catch (err) {
        console.error('FAQ 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqList();
  }, [activeMain, activeSub]);

  const handleMainChange = (cat: MainCategory) => {
    setSearchParams({ category: cat });
    setSearchQuery('');
  };

  const handleSubChange = (sub: string) => {
    setSearchParams({ category: activeMain, sub });
    setSearchQuery('');
  };

  const handleSearch = () => {
    if (!searchInput.trim()) { alert('검색값을 입력하세요'); return; }
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const filtered = useMemo(() => {
    if (!searchQuery) return faqList;
    const q = searchQuery.toLowerCase();
    return faqList.filter((f) => f.postSj.toLowerCase().includes(q));
  }, [faqList, searchQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <ServiceSidebar />

          <div className="flex-1 min-w-0">
            {/* 브레드크럼 */}
            <div className="text-xs text-gray-400 mb-3">
              <Link to="/customer" className="hover:text-blue-500 transition-colors">고객센터</Link>
              <span className="mx-1">&gt;</span>
              <span className="text-gray-600">자주하는 질문(FAQ)</span>
            </div>

            {/* 타이틀 */}
            <div className="mb-6 flex flex-col gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                자주하는 질문(<span className="text-blue-600">FAQ</span>)
              </h1>
              <span className="text-xs text-gray-400">궁금한 내용을 빠르게 해결하세요!</span>
            </div>

            {/* 대분류 + 중분류 탭 */}
            <FAQCategoryTabs
              activeMain={activeMain}
              activeSub={activeSub}
              onMainChange={handleMainChange}
              onSubChange={handleSubChange}
            />

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
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                        불러오는 중...
                      </td>
                    </tr>
                  ) : paged.length > 0 ? paged.map((item) => (
                    <tr key={item.postSn} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 text-center">
                        {item.topFixYn === 'Y' ? (
                          <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            BEST
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">{item.postSn}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-gray-500">{item.faqCtgNm}</td>
                      <td className="py-3 px-3 text-center text-xs text-gray-500">{item.faqSubCtgNm}</td>
                      <td className="py-3 px-3">
                        <Link
                          to={`/customer/faq/${item.postSn}`}
                          className="text-sm text-gray-800 hover:text-blue-600 transition-colors"
                        >
                          {item.postSj}
                        </Link>
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

            {/* 하단 1:1 상담 박스 */}
            <div className="border border-gray-200 rounded-sm p-5 bg-white text-center">
              <p className="text-xs text-gray-600 mb-5">
                원하는 답변을 찾지 못하셨나요?{' '}
                <Link to="/customer/inquiry" className="text-blue-600 font-bold underline decoration-blue-600 underline-offset-2">
                  1:1 상담으로 도와드릴게요.
                </Link>
              </p>
              <div className="flex justify-center items-center gap-12 md:gap-24">
                <div className="flex items-center gap-3 text-left">
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
                <Link to="/customer/qna" className="flex items-center gap-3 text-left group">
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
