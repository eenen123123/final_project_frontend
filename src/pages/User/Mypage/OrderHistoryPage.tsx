import { useEffect, useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";
import api from "../../../api/api";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

interface OrderItem {
  ordSn: number;
  ordId: string;
  ordNm: string;
  totAmt: number;
  ordStatCd: string;
  regDt: string;
  hasTextbook: boolean;
}

const stat = {
  EXPIRED: "기간만료",
  PAID: "결제완료",
  PENDING: "결제대기",
};

const statBadge: Record<string, string> = {
  PAID: "bg-blue-50 text-blue-600",
  PENDING: "bg-orange-50 text-orange-600",
  EXPIRED: "bg-gray-100 text-gray-500",
};

const GUIDE_LINES = [
  "배송상태는 입금대기→결제완료→발송준비→발송완료의 단계로 이루어지며, 발송준비로 변경시 주문취소/배송지 변경의 경우 고객센터를 통해서만 가능합니다.",
  "교재 및 도서는 평일 오후 2시에 출고되며(공휴일 제외), 출고 이후엔 주문 취소 및 배송지 변경이 불가합니다. (반송 후 환불 필요하며 왕복배송비 고객 부담)",
  "[배송조회]는 발송한 당일 저녁 9시 이후 부터 확인이 가능하며, 배송상황 추적시 택배회사와의 네트워크 연결 상황에 따라 1분 이상 소요될 수도 있습니다.",
  "무통장 입금의 경우, 입금 대기기간은 7일간 유효하며 7일이내 미결제 시, 주문은 자동 취소됩니다.",
  "이투스북 상품의 경우 [수령확인]을 하셔야 북포인트가 적립됩니다.",
  "해당 주문건의 증빙을 출력하길 원하시면 주문번호 클릭 후 주문 상세 화면에서 [전자 영수증]버튼을 클릭해 주세요.",
  "취소 내역이 있을 경우 자세한 사항은 주문 상세페이지에서 확인해주세요.",
];

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function OrderHistoryPage() {
  const [activeSection, setActiveSection] = useState("주문/배송 조회");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { page } = useParams<{ page: string }>();
  const [currentPage, setCurrentPage] = useState(page || "1");
  const { isAuthReady } = useAuth();

  const today = new Date();

  const [startDate, setStartDate] = useState(
    formatDateString(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)),
  );
  const [endDate, setEndDate] = useState(formatDateString(today));
  const [selectedPeriod, setSelectedPeriod] = useState<number>(90);
  const [guideOpen, setGuideOpen] = useState(true);

  const handlePeriodChange = (days: number) => {
    setSelectedPeriod(days);
    const targetEndDate = new Date();
    const targetStartDate = new Date();
    targetStartDate.setDate(targetStartDate.getDate() - days);

    setStartDate(formatDateString(targetStartDate));
    setEndDate(formatDateString(targetEndDate));
  };

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!startDate || !endDate) {
      alert("기간 설정을 해주세요.");
      return;
    }
    if (startDate > endDate) {
      alert("기간 설정이 잘못되었습니다.");
      return;
    }
    try {
      const res = await api.get("/api/orders/my", {
        params: {
          page: currentPage,
          from: startDate,
          to: endDate,
        },
      });
      setOrders(res.data.items);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error("주문 내역 조회 실패:", err);
      if (err instanceof Error) {
        alert("주문 내역 조회 중 오류가 발생했습니다: " + err.message);
      }
    }
  };
  useEffect(() => {
    if (isAuthReady) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSearchSubmit();
    }
    // 날짜 검색은 검색 버튼(form submit)에서만 실행하고,
    // 여기서는 인증 준비 완료/페이지 변경 시에만 자동 재조회한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthReady, currentPage]);

  // 브라우저의 자동 스크롤 복원을 끄고 직접 제어한다.
  // (목록이 비동기로 채워지기 전에 복원이 일어나면 위치가 어긋나기 때문)
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  // 상세에서 뒤로가기로 돌아왔을 때, 목록이 렌더된 뒤 저장해 둔 위치로 복원
  useEffect(() => {
    if (orders.length === 0) return;
    const saved = sessionStorage.getItem("orderHistoryScrollY");
    if (saved !== null) {
      window.scrollTo(0, Number(saved));
      sessionStorage.removeItem("orderHistoryScrollY");
    }
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          {/* 1. 사이드바 */}
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* 2. 메인 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                주문/배송 조회
              </h2>
              <p className="text-sm text-gray-500 mt-1.5">
                주문하신 상품의 결제 및 배송 현황을 확인하실 수 있습니다.
              </p>
            </div>

            {/* 주문 상태 카운터 보드 */}
            {/* <div className="border border-gray-200 bg-white grid grid-cols-6 divide-x divide-gray-200 mb-2">
              <div className="py-5 text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  입금대기
                </p>
                <p className="text-xl font-bold text-orange-500">0</p>
              </div>
              <div className="py-5 text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  결제완료
                </p>
                <p className="text-xl font-bold text-gray-700">0</p>
              </div>
              <div className="py-5 text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  발송준비
                </p>
                <p className="text-xl font-bold text-gray-700">0</p>
              </div>
              <div className="py-5 text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  발송완료
                </p>
                <p className="text-xl font-bold text-gray-700">0</p>
              </div>
              <div className="py-5 text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  수취완료
                </p>
                <p className="text-xl font-bold text-gray-700">0</p>
              </div>
              <div className="py-5 text-center bg-gray-50/40">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  누적할인 금액
                </p>
                <p className="text-xl font-bold text-gray-800">
                  0
                  <span className="text-xs font-normal text-gray-500 ml-0.5">
                    원
                  </span>
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mb-6 pl-1">
              * 최근 6개월 기준
            </p> */}

            {/* 기간검색 필터 */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white border border-gray-200 rounded-xl p-5 flex flex-wrap items-center gap-x-6 gap-y-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700">
                  기간검색
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "1주일", days: 7 },
                    { label: "1개월", days: 30 },
                    { label: "2개월", days: 60 },
                    { label: "3개월", days: 90 },
                  ].map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => handlePeriodChange(p.days)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                        selectedPeriod === p.days
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSelectedPeriod(0);
                  }}
                  className="border border-gray-200 px-3 py-1.5 text-xs text-gray-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white"
                />
                <span className="text-gray-300">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSelectedPeriod(0);
                  }}
                  className="border border-gray-200 px-3 py-1.5 text-xs text-gray-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white"
                />
              </div>

              <button
                type="submit"
                className="ml-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                검색
              </button>
            </form>

            {/* 주문 건수 */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                총 <span className="font-bold text-blue-600">{totalCount}</span>
                개의 주문
              </p>
            </div>

            {/* 주문 카드 리스트 */}
            {orders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl py-24 text-center text-sm text-gray-400 mb-6">
                대상 기간 동안의 주문/배송 내역이 없습니다.
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {orders.map((item) => (
                  <div
                    key={item.ordSn}
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="hidden sm:flex shrink-0 w-14 h-14 rounded-xl bg-blue-50 items-center justify-center text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.6}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              statBadge[item.ordStatCd] ??
                              "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.ordStatCd in stat
                              ? stat[item.ordStatCd as keyof typeof stat]
                              : "알 수 없음"}
                          </span>
                          <span
                            className="font-mono text-[11px] text-gray-400 truncate"
                            title={item.ordId}
                          >
                            {item.ordId}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 truncate">
                          {item.ordNm}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.regDt?.slice(0, 10)} 결제
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {item.totAmt.toLocaleString("ko-KR")}
                          <span className="text-xs font-normal text-gray-400 ml-0.5">
                            원
                          </span>
                        </p>
                        <div className="flex gap-2 mt-2">
                          {item.hasTextbook && (
                            <Link
                              to={`/mycart/orderhistory/${item.ordSn}/shipping`}
                              className="px-3 py-1.5 text-xs font-bold text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                              title="배송 조회"
                            >
                              <i className="fa-solid fa-truck" />
                            </Link>
                          )}
                          <button
                            type="button"
                            className="px-3.5 py-1.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Link
                              to={`/mycart/orderhistory/${item.ordSn}`}
                              onClick={() =>
                                sessionStorage.setItem(
                                  "orderHistoryScrollY",
                                  String(window.scrollY),
                                )
                              }
                            >
                              주문상세
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 하단 페이지네이션 */}
            <div className="flex justify-center items-center gap-3 text-xs font-bold mb-12">
              <button
                disabled={currentPage === "1"}
                onClick={() =>
                  setCurrentPage((prev) => String(Number(prev) - 1))
                }
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:hover:border-gray-200 transition-colors cursor-pointer"
              >
                이전
              </button>
              <span className="text-gray-600">
                {currentPage}
                <span className="text-gray-300">
                  {" "}
                  / {Math.max(1, Math.ceil(totalCount / 10))}
                </span>
              </span>
              <button
                disabled={currentPage === String(Math.ceil(totalCount / 10))}
                onClick={() =>
                  setCurrentPage((prev) => String(Number(prev) + 1))
                }
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:hover:border-gray-200 transition-colors cursor-pointer"
              >
                다음
              </button>
            </div>

            {/* 하단 안내 가이드 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setGuideOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  주문/배송 이용안내
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    guideOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {guideOpen && (
                <ul className="px-5 pb-5 pt-4 space-y-2 border-t border-gray-100">
                  {GUIDE_LINES.map((line, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] leading-relaxed text-gray-400 flex items-start gap-1.5"
                    >
                      <span className="shrink-0 text-blue-300 font-bold select-none">
                        ·
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
