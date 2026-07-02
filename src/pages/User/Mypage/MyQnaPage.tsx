import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyPageSidebar from "./components/MyPageSidebar";
import api from "../../../api/api";
import { usePaginatedSearch, type PageResponse } from "../../../hooks/usePaginatedSearch";
import { useAuth } from "../../../auth/AuthContext";

type TabKey = "instructor" | "customer";

interface CustomerQnaItem {
  postSn: number;
  postSj: string;
  qnaCtgNm: string;
  answStatCd: string;
  secrYn: string;
  regDt: string;
}

interface InstructorQnaItem {
  postSn: number;
  postSj: string;
  instrUuid: string;
  instrUserNm: string;
  answYn: string;
  secrYn: string;
  regDt: string;
}

export default function MyQnaPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("instructor");
  const { isAuthReady } = useAuth();


  // 고객센터 Q&A
  const {
    items: customerItems,
    totalCount: customerTotal,
    loading: customerLoading,
    page: customerPage,
    totalPages: customerTotalPages,
    startPage: customerStartPage,
    endPage: customerEndPage,
    setPage: setCustomerPage,
  } = usePaginatedSearch<CustomerQnaItem>(
    (page, size) =>
      api.get<PageResponse<CustomerQnaItem>>("/api/qna/paged", {
        params: { page, size, myOnly: true },
      }).then((r) => r.data),
    { pageSize: 10, blockSize: 5, enabled: activeTab === "customer" && isAuthReady },
  );

  // 선생님 Q&A
  const {
    items: instrItems,
    totalCount: instrTotal,
    loading: instrLoading,
    page: instrPage,
    totalPages: instrTotalPages,
    startPage: instrStartPage,
    endPage: instrEndPage,
    setPage: setInstrPage,
  } = usePaginatedSearch<InstructorQnaItem>(
    (page, size) =>
      api.get<PageResponse<InstructorQnaItem>>("/api/mypage/instructor-qna", {
        params: { page, size },
      }).then((r) => r.data),
    { pageSize: 10, blockSize: 5, enabled: activeTab === "instructor" && isAuthReady },
  );

  const [qnaSummary, setQnaSummary] = useState<{ total: number; answered: number; waiting: number } | null>(null);

  useEffect(() => {
    if (activeTab === "customer" && isAuthReady) {
      api.get<{ total: number; answered: number; waiting: number }>("/api/qna/my/summary")
        .then((r) => setQnaSummary(r.data))
        .catch(() => {});
    }
  }, [activeTab, isAuthReady]);

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
                      {customerTotal}
                    </span>
                  )}
                  {tab.key === "instructor" && (
                    <span className={`ml-1.5 ${activeTab === tab.key ? "text-gray-300" : "text-blue-500"}`}>
                      {instrTotal}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 상태 카운트 (고객센터 탭만) */}
            {activeTab === "customer" && (
              <div className="grid grid-cols-3 divide-x divide-gray-200 border border-t-0 border-gray-200 bg-white mb-6">
                <div className="py-3 text-center text-xs text-gray-600">
                  전체 : 총 <span className="font-bold text-blue-600">{qnaSummary?.total ?? customerTotal}</span>건
                </div>
                <div className="py-3 text-center text-xs text-gray-600">
                  답변완료 : 총 <span className="font-bold text-blue-600">{qnaSummary?.answered ?? 0}</span>건
                </div>
                <div className="py-3 text-center text-xs text-gray-600">
                  답변대기 : 총 <span className="font-bold text-blue-600">{qnaSummary?.waiting ?? 0}</span>건
                </div>
              </div>
            )}

            {/* ===== 선생님 Q&A 탭 ===== */}
            {activeTab === "instructor" && (
              <>
                <table className="w-full border-t border-gray-200 bg-white text-sm mb-1">
                  <colgroup>
                    <col style={{ width: "60px" }} />
                    <col />
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "90px" }} />
                    <col style={{ width: "90px" }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">번호</th>
                      <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-left">제목</th>
                      <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">강사</th>
                      <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">작성일</th>
                      <th className="py-2.5 px-3 text-xs font-semibold text-gray-600 text-center">처리현황</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {instrLoading ? (
                      <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">불러오는 중...</td></tr>
                    ) : instrItems.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">문의 내역이 없습니다.</td></tr>
                    ) : (
                      instrItems.map((item) => (
                        <tr key={item.postSn} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3 text-center text-xs text-gray-400">{item.postSn}</td>
                          <td className="py-3 px-3">
                            {item.instrUuid ? (
                              <Link to={`/instructor/${item.instrUuid}/qna/${item.postSn}`} className="text-sm text-gray-800 hover:text-blue-600 transition-colors">
                                {item.secrYn === "Y" && <span className="mr-1 text-gray-400">🔒</span>}
                                {item.postSj}
                              </Link>
                            ) : (
                              <span className="text-sm text-gray-800">
                                {item.secrYn === "Y" && <span className="mr-1 text-gray-400">🔒</span>}
                                {item.postSj}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center text-xs text-gray-500">{item.instrUserNm}</td>
                          <td className="py-3 px-3 text-center text-xs text-gray-400">{item.regDt?.slice(0, 10)}</td>
                          <td className="py-3 px-3 text-center">
                            {item.answYn === "Y"
                              ? <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">답변완료</span>
                              : <span className="text-xs text-gray-500 font-semibold">답변대기</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {instrTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 my-4">
                    <button onClick={() => setInstrPage(1)} disabled={instrPage === 1} className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">◀◀</button>
                    {Array.from({ length: instrEndPage - instrStartPage + 1 }, (_, i) => instrStartPage + i).map((p) => (
                      <button key={p} onClick={() => setInstrPage(p)}
                        className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${p === instrPage ? "bg-blue-600 text-white font-bold" : "text-gray-500 hover:text-gray-900"}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setInstrPage(instrTotalPages)} disabled={instrPage === instrTotalPages} className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">▶▶</button>
                  </div>
                )}

              </>
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
                    {customerLoading ? (
                      <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">불러오는 중...</td></tr>
                    ) : customerItems.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">문의 내역이 없습니다.</td></tr>
                    ) : (
                      customerItems.map((item) => (
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
                {customerTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 my-4">
                    <button onClick={() => setCustomerPage(1)} disabled={customerPage === 1} className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">◀◀</button>
                    {Array.from({ length: customerEndPage - customerStartPage + 1 }, (_, i) => customerStartPage + i).map((p) => (
                      <button key={p} onClick={() => setCustomerPage(p)}
                        className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${p === customerPage ? "bg-blue-600 text-white font-bold" : "text-gray-500 hover:text-gray-900"}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setCustomerPage(customerTotalPages)} disabled={customerPage === customerTotalPages} className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer">▶▶</button>
                  </div>
                )}

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
