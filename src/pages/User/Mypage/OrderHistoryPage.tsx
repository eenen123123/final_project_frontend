import { useEffect, useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";
import api from "../../../api/api";
import type { PageResponse } from "../../../hooks/usePaginatedSearch";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

interface OrderItem {
  ordSn: number;
  ordId: string;
  ordNm: string;
  totAmt: number;
  ordStatCd: string;
  regDt: string;
}

const stat = {
  EXPIRED: "기간만료",
  PAID: "결제완료",
  PENDING: "결제대기",
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
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              주문/배송 조회
            </h2>

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
              className="border border-gray-200 bg-white p-3.5 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700 mb-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-bold">기간검색</span>
                <div className="flex bg-gray-100 p-0.5 border border-gray-200">
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
                      className={`px-3 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                        selectedPeriod === p.days
                          ? "bg-gray-800 text-white"
                          : "text-gray-500 hover:text-gray-800 bg-white border border-gray-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSelectedPeriod(0);
                  }}
                  className="border border-gray-300 px-2 py-1 text-xs text-gray-600 rounded-2xs focus:outline-none focus:border-gray-500 bg-white"
                />
                <span className="text-gray-400 font-normal">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSelectedPeriod(0);
                  }}
                  className="border border-gray-300 px-2 py-1 text-xs text-gray-600 rounded-2xs focus:outline-none focus:border-gray-500 bg-white"
                />
              </div>

              <button
                type="submit"
                className="ml-auto px-4 py-1.5 bg-gray-600 hover:bg-gray-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                검색 &gt;
              </button>
            </form>

            {/* ── 3. 주문 리스트 테이블 (상/하단 테두리 선 보정 및 뱃지 인라인 배치) ── */}
            <div className="border-t border-b border-gray-300 mb-6">
              <table className="w-full text-sm border-collapse table-fixed">
                <colgroup>
                  <col style={{ width: "130px" }} />
                  <col style={{ width: "auto" }} />
                  <col style={{ width: "110px" }} />
                  <col style={{ width: "110px" }} />
                  <col style={{ width: "80px" }} />
                  <col style={{ width: "110px" }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="py-3 px-2 text-center font-semibold text-gray-600">
                      주문번호
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600">
                      주문내역
                    </th>
                    <th className="py-3 px-2 text-center font-semibold text-gray-600">
                      결제가
                    </th>
                    <th className="py-3 px-2 text-center font-semibold text-gray-600">
                      결제일
                    </th>
                    <th className="py-3 px-2 text-center font-semibold text-gray-600">
                      결제 상태
                    </th>
                    <th className="py-3 px-2 text-center font-semibold text-gray-600">
                      배송상태/조회
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-24 text-center text-gray-400 text-xs font-medium bg-white"
                      >
                        대상 기간 동안의 주문/배송 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    orders.map((item) => (
                      <tr
                        key={item.ordSn}
                        className="border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50/30 transition-colors"
                      >
                        <td
                          className="py-4 px-2 text-center align-middle font-mono text-xs font-bold text-gray-700 underline cursor-pointer truncate"
                          title={item.ordId}
                        >
                          {item.ordId}
                        </td>

                        <td className="py-4 px-4 text-left">{item.ordNm}</td>

                        <td className="py-4 px-2 text-center align-middle font-bold text-gray-800 text-xs">
                          {item.totAmt.toLocaleString("ko-KR")}원
                        </td>
                        <td className="py-4 px-2 text-center align-middle font-mono text-xs text-gray-400 whitespace-nowrap">
                          {item.regDt?.slice(0, 10)}
                        </td>
                        <td className="py-4 px-2 text-center align-middle">
                          <span className="text-xs font-bold text-gray-700">
                            {item.ordStatCd in stat
                              ? stat[item.ordStatCd as keyof typeof stat]
                              : "알 수 없음"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 하단 페이지네이션 */}
            <div className="flex justify-center items-center gap-4 text-xs font-bold text-gray-400 mb-12">
              <button
                disabled={currentPage === "1"}
                onClick={() =>
                  setCurrentPage((prev) => String(Number(prev) - 1))
                }
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 transition-colors cursor-pointer"
              >
                이전
              </button>
              <span>
                {currentPage} / {Math.ceil(totalCount / 10)}
              </span>
              <button
                disabled={currentPage === String(Math.ceil(totalCount / 10))}
                onClick={() =>
                  setCurrentPage((prev) => String(Number(prev) + 1))
                }
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-300 transition-colors cursor-pointer"
              >
                다음
              </button>
            </div>

            {/* 하단 안내 가이드 */}
            <div className="border border-gray-200 bg-gray-50/60 p-5 rounded-xs">
              <strong className="block text-xs font-bold text-gray-800 mb-3">
                주문/배송 안내
              </strong>
              <ul className="space-y-1.5">
                {GUIDE_LINES.map((line, idx) => (
                  <li
                    key={idx}
                    className="text-[11px] leading-relaxed text-gray-400 flex items-start gap-1"
                  >
                    <span className="shrink-0 font-bold select-none">·</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
