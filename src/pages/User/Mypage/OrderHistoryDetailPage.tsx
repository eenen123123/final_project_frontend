import { useNavigate, useParams } from "react-router-dom";
import MyPageSidebar from "./components/MyPageSidebar";
import { useEffect, useState } from "react";
import api from "../../../api/api";

interface OrderItem {
  ordSn: string;
  ordItemSn: string;
  prodDivCd: string; // TEXTBOOK, COURSE
  prodSn: string;
  prodNm: string;
  prodPrice: number;
  itemQty: number;
  regDt: string;
  prodImg?: string; // 상품 썸네일 (추후 API에서 채워짐)
}

const prodDivLabel: Record<string, string> = {
  TEXTBOOK: "교재",
  COURSE: "강좌",
};

const prodDivBadge: Record<string, string> = {
  TEXTBOOK: "bg-amber-50 text-amber-600",
  COURSE: "bg-blue-50 text-blue-600",
};

export default function OrderHistoryDetailPage() {
  const ordSn = useParams().ordSn;
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("주문/배송 조회");
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getOrderItems = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/orders/detail`, {
          params: { id: ordSn },
        });
        setOrderItems(res.data);
        setIsError(false);
      } catch (error) {
        console.error("주문 상세 조회 실패:", error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };
    getOrderItems();
  }, [ordSn]);

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.prodPrice * item.itemQty,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 min-w-0">
            {/* 헤더 */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
                주문 내역으로
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                주문 상세 조회
              </h2>
              <p className="text-sm text-gray-500 mt-1.5">
                주문번호{" "}
                <span className="font-mono font-bold text-gray-700">
                  {ordSn}
                </span>{" "}
                의 상세 내역입니다.
              </p>
            </div>

            {/* 로딩 상태 */}
            {loading && (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl p-5 flex gap-5 animate-pulse"
                  >
                    <div className="shrink-0 w-24 h-24 rounded-lg bg-gray-100" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 w-2/3 bg-gray-100 rounded" />
                      <div className="h-3 w-1/4 bg-gray-100 rounded" />
                      <div className="h-3 w-1/3 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 에러 상태 */}
            {!loading && isError && (
              <div className="bg-white border border-red-100 rounded-xl py-16 text-center">
                <p className="text-sm font-bold text-red-500">
                  주문 상세 조회에 실패했습니다.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  잠시 후 다시 시도해주세요.
                </p>
              </div>
            )}

            {/* 정상 상태 */}
            {!loading && !isError && (
              <>
                {orderItems.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl py-20 text-center text-sm text-gray-400">
                    주문 상세 내역이 없습니다.
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {orderItems.map((item) => (
                        <div
                          key={item.ordItemSn}
                          className="group bg-white border border-gray-200 rounded-xl p-5 flex gap-5 hover:shadow-md hover:border-blue-200 transition-all"
                        >
                          {/* 상품 이미지 */}
                          <div className="shrink-0 w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-gray-300">
                            {item.prodImg ? (
                              <img
                                src={item.prodImg}
                                alt={item.prodNm}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.4}
                                stroke="currentColor"
                                className="w-8 h-8"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 6h.008v.008H18V6Zm-12 9V6a2.25 2.25 0 0 1 2.25-2.25h11.5A2.25 2.25 0 0 1 22 6v9a2.25 2.25 0 0 1-2.25 2.25H8.25A2.25 2.25 0 0 1 6 15Z"
                                />
                              </svg>
                            )}
                          </div>

                          {/* 상품 정보 */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <span
                              className={`self-start px-2 py-0.5 rounded-md text-[11px] font-bold mb-1.5 ${
                                prodDivBadge[item.prodDivCd] ??
                                "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {prodDivLabel[item.prodDivCd] ?? item.prodDivCd}
                            </span>
                            <h3 className="font-bold text-gray-900 truncate">
                              {item.prodNm}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                              수량 {item.itemQty}개 ·{" "}
                              {new Date(item.regDt).toLocaleDateString()} 주문
                            </p>
                          </div>

                          {/* 가격 */}
                          <div className="shrink-0 self-center text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {(item.prodPrice * item.itemQty).toLocaleString()}
                              <span className="text-xs font-normal text-gray-400 ml-0.5">
                                원
                              </span>
                            </p>
                            {item.itemQty > 1 && (
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {item.prodPrice.toLocaleString()}원 ×{" "}
                                {item.itemQty}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 결제 합계 */}
                    <div className="mt-4 bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700">
                        총 결제금액
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {totalAmount.toLocaleString()}
                        <span className="text-sm font-normal text-gray-400 ml-0.5">
                          원
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
