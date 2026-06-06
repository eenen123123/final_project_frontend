import { Link } from 'react-router-dom';
import ServiceSidebar from '../components/ServiceSidebar';
import NoticeHeader from './components/NoticeHeader';
import api from '../../../api/api';
import type { NoticeItem } from '../../../types/board/NoticeInterface';
import { usePaginatedSearch, type PageResponse } from '../../../hooks/usePaginatedSearch';

const PAGE_SIZE = 15;

const TYPE_BADGE: Record<string, string> = {
  '01': 'bg-blue-50 text-blue-600',
  '02': 'bg-orange-50 text-orange-600',
  '03': 'bg-red-50 text-red-600',
};

export default function NoticePage() {
  const {
    items,
    totalCount,
    loading,
    page,
    totalPages,
    startPage,
    endPage,
    searchInput,
    setSearchInput,
    handleSearch,
    setPage,
  } = usePaginatedSearch<NoticeItem>(
    (page, size, keyword) =>
      api.get<PageResponse<NoticeItem>>('/api/notice/paged', {
        params: { page, size, ...(keyword && { keyword }) },
      }).then(r => r.data),
    { pageSize: PAGE_SIZE, blockSize: 5 }
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* 사이드바: 모바일에서 숨김 */}
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <NoticeHeader />

            {/* 데스크탑 테이블 */}
            <div className="hidden md:block mt-4 mb-4">
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '80px' }} />
                  <col />
                  <col style={{ width: '100px' }} />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">번호</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-left">제목</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">작성일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={3} className="py-12 text-center text-sm text-gray-400">불러오는 중...</td></tr>
                  ) : items.length > 0 ? items.map((item, idx) => (
                    <tr key={item.postSn} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 text-center text-xs text-gray-400">
                        {totalCount - ((page - 1) * PAGE_SIZE) - idx}
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          to={`/customer/notice/${item.postSn}`}
                          className="text-sm text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          {item.noticeTypeCd && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${TYPE_BADGE[item.noticeTypeCd] ?? 'bg-gray-50 text-gray-500'}`}>
                              {item.noticeTypeNm}
                            </span>
                          )}
                          {item.postSj}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-gray-400">
                        {item.regDt?.slice(0, 10).replace(/-/g, '.')}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="py-12 text-center text-sm text-gray-400">공지사항이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 리스트 */}
            <div className="md:hidden divide-y divide-gray-100 border-t-2 border-gray-800 mt-4 mb-4">
              {loading ? (
                <p className="py-12 text-center text-sm text-gray-400">불러오는 중...</p>
              ) : items.length > 0 ? items.map((item) => (
                <Link key={item.postSn} to={`/customer/notice/${item.postSn}`}
                  className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {item.noticeTypeCd && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${TYPE_BADGE[item.noticeTypeCd] ?? 'bg-gray-50 text-gray-500'}`}>
                          {item.noticeTypeNm}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">{item.regDt?.slice(0, 10).replace(/-/g, '.')}</span>
                    </div>
                    <p className="text-sm text-gray-800 truncate">{item.postSj}</p>
                  </div>
                  <span className="text-gray-300 text-sm flex-shrink-0 ml-2">&gt;</span>
                </Link>
              )) : (
                <p className="py-12 text-center text-sm text-gray-400">공지사항이 없습니다.</p>
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

            {/* 하단 검색 */}
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
