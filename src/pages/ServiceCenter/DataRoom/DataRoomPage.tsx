import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceSidebar from '../components/ServiceSidebar';
import api from '../../../api/api';
import type { DataRoomItem } from '../../../types/CustomerServiceInterface';
import type { PageResponse } from '../../../hooks/usePaginatedSearch';

const PAGE_SIZE = 15;
const BLOCK_SIZE = 5;

const CTG_OPTIONS = [
  { code: '', label: '전체' },
  { code: '01', label: '공지/안내자료' },
  { code: '02', label: '입시정보' },
  { code: '03', label: '학습자료' },
  { code: '04', label: '기타' },
];

export default function DataRoomPage() {
  const [items,       setItems]       = useState<DataRoomItem[]>([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [ctg,         setCtg]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [keyword,     setKeyword]     = useState('');
  const [page,        setPage]        = useState(1);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const endPage    = Math.min(totalPages, Math.ceil(page / BLOCK_SIZE) * BLOCK_SIZE);
  const startPage  = Math.max(1, endPage - BLOCK_SIZE + 1);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get<PageResponse<DataRoomItem>>('/api/dataroom/paged', {
          params: {
            page,
            size: PAGE_SIZE,
            ...(keyword && { keyword }),
            ...(ctg     && { dataCtg: ctg }),
          },
        });
        if (!cancelled) {
          setItems(res.data.items);
          setTotalCount(res.data.totalCount);
        }
      } catch (err) {
        console.error('자료실 조회 실패:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page, keyword, ctg]);

  const handleSearch = () => {
    if (!searchInput.trim()) { alert('검색값을 입력하세요'); return; }
    setKeyword(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="border-b-2 border-gray-800 pb-2 mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-gray-900">자료실</h2>
              {/* 카테고리 필터 */}
              <div className="flex gap-1.5 flex-wrap">
                {CTG_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => { setCtg(opt.code); setKeyword(''); setSearchInput(''); setPage(1); }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      ctg === opt.code
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 데스크탑 테이블 */}
            <div className="hidden md:block mb-4">
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '60px' }} />
                  <col style={{ width: '100px' }} />
                  <col />
                  <col style={{ width: '60px' }} />
                  <col style={{ width: '100px' }} />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">번호</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">분류</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-left">제목</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">파일</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">등록일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">불러오는 중...</td></tr>
                  ) : items.length > 0 ? items.map((item, idx) => (
                    <tr key={item.postSn} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 text-center text-xs text-gray-400">
                        {totalCount - ((page - 1) * PAGE_SIZE) - idx}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                          {item.dataCtgNm}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          to={`/customer/resource/${item.postSn}`}
                          className="text-sm text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {item.postSj}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.orgnFileNm ? (
                          <span className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-gray-400">
                        {item.regDt?.slice(0, 10).replace(/-/g, '.')}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">자료가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 리스트 */}
            <div className="md:hidden divide-y divide-gray-100 border-t-2 border-gray-800 mb-4">
              {loading ? (
                <p className="py-12 text-center text-sm text-gray-400">불러오는 중...</p>
              ) : items.length > 0 ? items.map((item) => (
                <Link key={item.postSn} to={`/customer/resource/${item.postSn}`}
                  className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 flex-shrink-0">
                        {item.dataCtgNm}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.regDt?.slice(0, 10).replace(/-/g, '.')}</span>
                    </div>
                    <p className="text-sm text-gray-800 truncate">{item.postSj}</p>
                  </div>
                  <span className="text-gray-300 text-sm flex-shrink-0 ml-2">&gt;</span>
                </Link>
              )) : (
                <p className="py-12 text-center text-sm text-gray-400">자료가 없습니다.</p>
              )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mb-6">
                <button onClick={() => setPage(1)} disabled={page === 1}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">◀◀</button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">◀</button>
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                      page === p ? 'bg-blue-600 text-white font-bold' : 'text-gray-500 hover:text-gray-900'
                    }`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">▶</button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">▶▶</button>
              </div>
            )}

            {/* 검색 */}
            <div className="flex flex-wrap items-center gap-2 justify-center mt-4">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="제목검색"
                className="border border-gray-300 rounded text-xs px-3 py-2 w-64 sm:w-72 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button onClick={handleSearch}
                className="bg-gray-700 hover:bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded transition-colors cursor-pointer">
                검색
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

