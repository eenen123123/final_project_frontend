import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyPageSidebar from "./components/MyPageSidebar";
import api from "../../../api/api";
import { usePaginatedSearch, type PageResponse } from "../../../hooks/usePaginatedSearch";
import { useAuth } from "../../../auth/AuthContext";

type TabKey = "instructor" | "customer";

interface QnaItem {
  postSn: number;
  postSj: string;
  qnaCtgNm: string;
  answStatCd: string;
  secrYn: string;
  regDt: string;
}

export default function MyQnaPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("instructor");
  const { isAuthReady } = useAuth();
  const navigate = useNavigate();

  const {
    items,
    totalCount,
    loading,
    page,
    totalPages,
    startPage,
    endPage,
    setPage,
  } = usePaginatedSearch<QnaItem>(
    (page, size) =>
      api
        .get<PageResponse<QnaItem>>("/api/qna/paged", {
          params: { page, size, myOnly: true },
        })
        .then((r) => r.data),
    { pageSize: 10, blockSize: 5, enabled: activeTab === "customer" && isAuthReady },
  );

  const answeredCount = items.filter((i) => i.answStatCd !== "01").length;
  const waitingCount = items.filter((i) => i.answStatCd === "01").length;

  const TABS = [
    { key: "instructor" as TabKey, label: "선생님 Q&A" },
    { key: "customer" as TabKey, label: "고객센터 Q&A" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <MyPageSidebar activeSection="나의 Q&A" onSectionChange={() => {}} />

          <div className="flex-1 min-w-0">
            {/* 헤더 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 inline mr-3">나의 Q&A</h2>
              <span className="text-xs text-gray-400">
                선생님 Q&A, 고객센터 게시판에 문의하신 내용에 대한 답변 현황을 확인할 수 있습니다.
              </span>
            </div>

            {/* 탭 */}
            <div className="flex border-b-2 border-gray-800 mb-0">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-10 py-3 text-sm font-bold border-r border-gray-300 last:border-r-0 cursor-pointer transition-colors
                    ${activeTab === tab.key
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  {tab.label}
                  {tab.key === "customer" && (
                    <span className={`ml-1.5 ${activeTab === tab.key ? "text-gray-300" : "text-blue-500"}`}>
                      {totalCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 상태 카운트 (고객센터 탭만) */}
            {activeTab === "customer" && (
              <div className="grid grid-cols-3 divide-x divide-gray-200 border border-t-0 border-gray-200 bg-white mb-6">
                <div className="py-3 text-center text-xs text-gray-600">
                  읽지 않은 답변 : 총 <span className="font-bold text-blue-600">0</span>건
                </div>
                <div className="py-3 text-center text-xs text-gray-600">
                  답변완료 : 총 <span className="font-bold text-blue-600">{answeredCount}</span>건
                </div>
                <div className="py-3 text-center text-xs text-gray-600">
                  답변대기 : 총 <span className="font-bold text-blue-600">{waitingCount}</span>건
                </div>
              </div>
            )}

            {/* ===== 선생님 Q&A 탭 ===== */}
            {activeTab === "instructor" && (
              <div className="border border-t-0 border-gray-200 bg-white py-16 flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-gray-300 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-blue-600 mb-1">게시판에 문의 하신 내용이 없습니다.</p>
                  <p className="text-xs text-gray-400">강좌 수강 시 궁금한 점이 있다면 언제든지 문의하세요!</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/instructors")}
                  className="mt-2 px-8 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  학습 질문하기 &gt;
                </button>
              </div>
            )}

            {/* ===== 고객센터 Q&A 탭 ===== */}
            {activeTab === "customer" && (
              <>
                <table className="w-full border-t border-gray-200 bg-white text-sm mb-1">
                  <colgroup>
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "100px" }} />
                    <col />
                    <col style={{ width: "90px" }} />
                    <col style={{ width: "90px" }} />
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
                    {loading ? (
                      <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">불러오는 중...</td></tr>
                    ) : items.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">문의 내역이 없습니다.</td></tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.postSn} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3 text-center text-xs text-gray-400">{item.postSn}</td>
                          <td className="py-3 px-3 text-center text-xs text-gray-500">{item.qnaCtgNm}</td>
                          <td className="py-3 px-3">
                            <Link to={`/customer/qna/${item.postSn}`} className="text-sm text-gray-800 hover:text-blue-600 transition-colors">
                              {item.secrYn === "Y" && <span className="mr-1 text-gray-400">🔒</span>}
                              {item.postSj}
                            </Link>
                          </td>
                          <td className="py-3 px-3 text-center text-xs text-gray-400">{item.regDt?.slice(0, 10)}</td>
                          <td className="py-3 px-3 text-center">
                            {item.answStatCd === "01"
                              ? <span className="text-xs text-gray-500 font-semibold">답변대기</span>
                              : <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">답변완료</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 my-4">
                    <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">◀◀</button>
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${p === page ? "bg-blue-600 text-white font-bold" : "text-gray-500 hover:text-gray-900"}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">▶▶</button>
                  </div>
                )}

                <div className="flex justify-end mt-3">
                  <Link to="/customer/qna/write"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors">
                    질문 등록하기
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
