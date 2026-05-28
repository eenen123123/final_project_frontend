import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ServiceSidebar from '../components/ServiceSidebar';
import { useAuth } from '../../../auth/AuthContext';
import api from '../../../api/api';
import type { QnaItem } from '../../../types/board/QnaInterface';
import QnaHeader from './components/QnaHeader';

{/*
  * 변경사항 *
1. 사이드바 hidden md:block 모바일 숨김
2. 레이아웃 flex-col md:flex-row 반응형
3. 안내 박스 flex-col sm:flex-row 반응형
4. 버튼 cursor-pointer 추가
5. 검색창 w-64 sm:w-72 반응형
*/}

type SearchType = '제목+내용' | '제목';

const PAGE_SIZE = 10;

export default function QnAPage() {
  const { isAuthenticated, getUserId } = useAuth();

  const [qnaList,     setQnaList]     = useState<QnaItem[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [searchType,  setSearchType]  = useState<SearchType>('제목+내용');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page,        setPage]        = useState(1);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchQnaList = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/qna');
        const userId = getUserId();
        setQnaList(res.data.filter((q: QnaItem) => q.wrtrUserId === userId));
      } catch (err) {
        console.error('QnA 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQnaList();
  }, [isAuthenticated]);

  const handleSearch = () => {
    if (!searchInput.trim()) { alert('검색값을 입력하세요'); return; }
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const filtered = useMemo(() => {
    if (!searchQuery) return qnaList;
    const q = searchQuery.toLowerCase();
    return qnaList.filter((item) => item.postSj.toLowerCase().includes(q));
  }, [qnaList, searchQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* 사이드바: 모바일에서 숨김 */}
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
          {/* 헤더 */}
          <QnaHeader/>
          
            {/* 안내 박스 */}
            <div className="border border-gray-200 rounded-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 border border-gray-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">평일</p>
                  <p className="text-xs font-bold text-gray-800">09:00~24:00</p>
                  <p className="text-[11px] text-gray-400">주말, 공휴일 답변불가</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center text-xs text-gray-600">
                <p>
                  1. 먼저, 고객센터 공지사항을 확인해보세요.{' '}
                  <Link to="/customer/notice" className="text-blue-600 font-bold hover:underline">공지사항 &gt;</Link>
                </p>
                <p>
                  2. 자주하는 질문 FAQ 검색으로 궁금증을 쉽고 빠르게 해결하세요.{' '}
                  <Link to="/customer/faq" className="text-blue-600 font-bold hover:underline">자주하는 질문 FAQ &gt;</Link>
                </p>
                <p>3. 더 궁금한 내용이 있으면 게시판 글 작성을 이용하세요.</p>
              </div>
            </div>

            {/* 목록 상단 */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">
                <span className="mr-1">≡</span>
                총 <strong className="text-blue-600">{filtered.length}</strong>개의 질문글
              </p>
              {isAuthenticated && (
                <Link
                  to="/customer/qna/write"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  질문 등록하기
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                </Link>
              )}
            </div>

            {/* 데스크탑 테이블 */}
            <div className="hidden md:block">
              <table className="w-full border-t-2 border-gray-800 text-sm mb-4">
                <colgroup>
                  <col style={{ width: '60px' }} />
                  <col style={{ width: '100px' }} />
                  <col />
                  <col style={{ width: '90px' }} />
                  <col style={{ width: '90px' }} />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">번호</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">분류</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-left">제목</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">작성일</th>
                    <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">처리현황</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!isAuthenticated ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                        로그인 후 이용하실 수 있습니다.{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">로그인</Link>
                      </td>
                    </tr>
                  ) : loading ? (
                    <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">불러오는 중...</td></tr>
                  ) : paged.length > 0 ? paged.map((item) => (
                    <tr key={item.postSn} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 text-center text-xs text-gray-400">{item.postSn}</td>
                      <td className="py-3 px-3 text-center text-xs text-gray-500">{item.qnaCtgNm}</td>
                      <td className="py-3 px-3">
                        <Link to={`/customer/qna/${item.postSn}`}
                          className="text-sm text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                          {item.secrYn === 'Y' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          )}
                          {item.postSj}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-gray-400">{item.regDt?.slice(0, 10)}</td>
                      <td className="py-3 px-3 text-center">
                        {item.answStatCd === '01' ? (
                          <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">답변대기</span>
                        ) : (
                          <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">답변완료</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">검색 결과가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 리스트 */}
            <div className="md:hidden divide-y divide-gray-100 border-t-2 border-gray-800 mb-4">
              {!isAuthenticated ? (
                <p className="py-12 text-center text-sm text-gray-400">
                  로그인 후 이용하실 수 있습니다.{' '}
                  <Link to="/login" className="text-blue-600 font-bold hover:underline">로그인</Link>
                </p>
              ) : loading ? (
                <p className="py-12 text-center text-sm text-gray-400">불러오는 중...</p>
              ) : paged.length > 0 ? paged.map((item) => (
                <Link key={item.postSn} to={`/customer/qna/${item.postSn}`}
                  className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-gray-400">{item.qnaCtgNm}</span>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">{item.regDt?.slice(0, 10)}</span>
                      {item.secrYn === 'Y' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 truncate">{item.postSj}</p>
                    <div className="mt-1">
                      {item.answStatCd === '01' ? (
                        <span className="text-[10px] bg-amber-50 text-amber-600 font-semibold px-1.5 py-0.5 rounded-full">답변대기</span>
                      ) : (
                        <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded-full">답변완료</span>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm flex-shrink-0 ml-2">&gt;</span>
                </Link>
              )) : (
                <p className="py-12 text-center text-sm text-gray-400">검색 결과가 없습니다.</p>
              )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mb-6">
                <button onClick={() => setPage(1)} disabled={page === 1}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">◀◀</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                      page === p ? 'bg-blue-600 text-white font-bold' : 'text-gray-500 hover:text-gray-900'
                    }`}>{p}</button>
                ))}
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">▶▶</button>
              </div>
            )}

            {/* 하단 검색 */}
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <select value={searchType} onChange={(e) => setSearchType(e.target.value as SearchType)}
                className="border border-gray-300 rounded text-xs px-2 py-2 focus:outline-none text-gray-600 cursor-pointer">
                <option>제목+내용</option>
                <option>제목</option>
              </select>
              <input type="text" value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="찾고 싶은 단어를 입력해주세요."
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
