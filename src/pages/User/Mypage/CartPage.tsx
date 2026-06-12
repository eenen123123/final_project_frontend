import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyPageSidebar from "./components/MyPageSidebar";
import CartGuideAccordion from "./components/CartGuideAccordion";
import api from "../../../api/api";

type Step = "cart" | "payment" | "complete";

interface CartItem {
  cartSn: number;
  prodDivCd: string;
  prodSn: number;
  prodNm: string;
  prodPrice: number;
  itemQty: number;
  regDt: string;
  checked: boolean;
}

function calcKeepInfo(regDt: string): { dDay: number; until: string } {
  const expiry = new Date(regDt);
  expiry.setDate(expiry.getDate() + 30);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const dDay = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  const until = expiry.toISOString().slice(0, 10);
  return { dDay, until };
}

const STEP_CONFIG: { key: Step; label: string; icon: React.ReactNode }[] = [
  {
    key: "cart",
    label: "장바구니",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    key: "payment",
    label: "결제정보 입력",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    key: "complete",
    label: "결제완료",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
];

const GUIDE_ITEMS = [
  "총 결제예상 금액 및 추가 할인 혜택 적립 포인트, 배송비 등은 실 결제단계에서 상품 특성 및 할인권 적용 등에 따라 차이가 발생할 수 있습니다.",
  "장바구니에 담긴 상품은 보관기한이 만료되기 전 관리자에 의해 품절처리될 수 있습니다.",
];

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function CartPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("장바구니");
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentStep] = useState<Step>("cart");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/cart");
        setItems(
          res.data.map((d: Omit<CartItem, "checked">) => ({
            ...d,
            checked: true,
          })),
        );
      } catch {
        // 401이면 api.ts 인터셉터가 /login으로 리다이렉트
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const toggleAll = (checked: boolean) =>
    setItems((prev) => prev.map((item) => ({ ...item, checked })));

  const toggleItem = (cartSn: number) =>
    setItems((prev) =>
      prev.map((item) =>
        item.cartSn === cartSn ? { ...item, checked: !item.checked } : item,
      ),
    );

  const deleteItem = async (cartSn: number) => {
    if (!window.confirm("상품을 삭제하시겠습니까?")) return;
    await api.delete(`/api/cart/${cartSn}`);
    setItems((prev) => prev.filter((item) => item.cartSn !== cartSn));
  };

  const deleteSelected = async () => {
    if (!items.some((i) => i.checked)) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    if (!window.confirm("선택된 상품을 삭제하시겠습니까?")) return;
    const targets = items.filter((i) => i.checked);
    await Promise.all(targets.map((i) => api.delete(`/api/cart/${i.cartSn}`)));
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  const deleteAll = async () => {
    if (items.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      return;
    }
    if (!window.confirm("전체 상품을 삭제하시겠습니까?")) return;
    await api.delete("/api/cart");
    setItems([]);
  };

  const allChecked = items.length > 0 && items.every((i) => i.checked);
  const checkedItems = items.filter((i) => i.checked);
  const totalPrice = checkedItems.reduce(
    (sum, i) => sum + i.prodPrice * i.itemQty,
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
            {/* 단계 헤더 */}
            <div
              className="flex border border-gray-300 mb-6"
              style={{ height: "56px" }}
            >
              {STEP_CONFIG.map(({ key, label, icon }, i) => {
                const isActive = currentStep === key;
                const isLast = i === STEP_CONFIG.length - 1;
                return (
                  <div
                    key={key}
                    className={`relative flex-1 flex items-center justify-center gap-2
                      ${i > 0 ? "border-l border-gray-300" : ""}
                      ${isActive ? "bg-gray-800" : "bg-white"}`}
                  >
                    <span className={isActive ? "text-white" : "text-gray-400"}>
                      {icon}
                    </span>
                    <span
                      className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-400"}`}
                    >
                      {label}
                    </span>
                    {!isLast && (
                      <span
                        className={`ml-1 text-sm font-bold ${isActive ? "text-gray-400" : "text-gray-300"}`}
                      >
                        &gt;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 p-16 text-center">
                <p className="text-gray-400 text-sm">
                  장바구니를 불러오는 중...
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white border border-gray-200 p-16 text-center">
                <p className="text-gray-400 text-sm mb-4">
                  장바구니에 담긴 상품이 없습니다.
                </p>
                <button
                  onClick={() => navigate("/header/books")}
                  className="px-6 py-2 bg-gray-700 text-white text-sm font-medium hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  강좌/교재 보러가기 &gt;
                </button>
              </div>
            ) : (
              <>
                {/* 상품 테이블 */}
                <div className="border-t-2 border-b border-gray-800 mb-3">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="py-3 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={(e) => toggleAll(e.target.checked)}
                            className="w-3.5 h-3.5 cursor-pointer accent-gray-800"
                          />
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-gray-700">
                          상품정보
                        </th>
                        <th className="py-3 px-4 w-24 text-center font-semibold text-gray-700">
                          판매가
                        </th>
                        <th className="py-3 px-4 w-14 text-center font-semibold text-gray-700 whitespace-nowrap">
                          수량
                        </th>
                        <th className="py-3 px-4 w-24 text-center font-semibold text-gray-700">
                          결제가
                        </th>
                        <th className="py-3 px-4 w-24 text-center font-semibold text-gray-700">
                          주문/삭제
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.cartSn}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <td className="py-4 px-3 text-center align-middle">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleItem(item.cartSn)}
                              className="w-3.5 h-3.5 cursor-pointer accent-gray-800"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-gray-900 leading-snug text-sm mb-1 flex items-center gap-1.5">
                              <span
                                className={`inline-block text-[10px] px-1 py-px border font-semibold shrink-0 ${
                                  item.prodDivCd === "COURSE"
                                    ? "border-blue-400 text-blue-500 bg-blue-50"
                                    : "border-green-400 text-green-600 bg-green-50"
                                }`}
                              >
                                {item.prodDivCd === "COURSE" ? "강좌" : "교재"}
                              </span>
                              {item.prodNm}
                            </p>
                            {item.regDt &&
                              (() => {
                                const { dDay, until } = calcKeepInfo(
                                  item.regDt,
                                );
                                return (
                                  <p className="text-xs text-orange-500">
                                    └ 보관기한: D-{dDay}{" "}
                                    <span className="text-gray-400">
                                      ({until}까지)
                                    </span>
                                  </p>
                                );
                              })()}
                          </td>
                          <td className="py-4 px-4 text-center align-middle text-sm text-gray-700">
                            {formatPrice(item.prodPrice)}원
                          </td>
                          <td className="py-4 px-4 text-center align-middle text-gray-700 text-sm">
                            {item.itemQty}
                          </td>
                          <td className="py-4 px-4 text-center align-middle">
                            <p className="font-bold text-orange-500 text-sm">
                              {formatPrice(item.prodPrice * item.itemQty)}원
                            </p>
                          </td>
                          <td className="py-4 px-4 text-center align-middle">
                            <div className="flex flex-col items-center gap-1">
                              <button className="w-16 py-1 bg-gray-600 text-white text-xs hover:bg-gray-800 transition-colors cursor-pointer">
                                주문 &gt;
                              </button>
                              <button
                                onClick={() => deleteItem(item.cartSn)}
                                className="w-16 py-1 bg-gray-400 text-white text-xs hover:bg-red-500 transition-colors cursor-pointer"
                              >
                                삭제 &gt;
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 하단 삭제 버튼 */}
                <div className="flex gap-1.5 mb-6">
                  <button
                    onClick={deleteSelected}
                    className="px-3 py-1.5 border border-gray-400 text-gray-600 text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    선택상품 삭제 &gt;
                  </button>
                  <button
                    onClick={deleteAll}
                    className="px-3 py-1.5 border border-gray-400 text-gray-600 text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    전체상품 삭제 &gt;
                  </button>
                </div>

              </>
            )}

            {/* 금액 요약 */}
            <div className="border border-gray-300 mb-2">
              <div className="grid grid-cols-3">
                <div className="py-6 text-center">
                  <p className="text-xs text-gray-500 mb-2">총 주문금액</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatPrice(totalPrice)}
                    <span className="text-sm font-normal text-gray-500 ml-0.5">원</span>
                  </p>
                </div>
                <div className="py-6 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-bold">
                    −
                  </div>
                  <p className="text-xs text-gray-500 mb-2">총 할인금액</p>
                  <p className="text-xl font-bold text-gray-800">
                    0
                    <span className="text-sm font-normal text-gray-500 ml-0.5">원</span>
                  </p>
                </div>
                <div className="py-6 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-bold">
                    =
                  </div>
                  <p className="text-xs text-gray-500 mb-2">총 결제예상금액</p>
                  <p className="text-xl font-bold text-orange-500">
                    {formatPrice(totalPrice)}
                    <span className="text-sm font-normal text-gray-400 ml-0.5">원</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 안내 문구 */}
            {GUIDE_ITEMS.map((item, i) => (
              <p key={i} className="text-[11px] text-gray-400 mb-0.5">
                · {item}
              </p>
            ))}

            {/* 액션 버튼 */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => navigate("/header/books")}
                className="px-10 py-3 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
              >
                강좌/교재 더보기 &gt;
              </button>
              <button
                onClick={() => {
                  const selected = items.filter((i) => i.checked);
                  if (selected.length === 0) {
                    alert("선택된 상품이 없습니다.");
                    return;
                  }
                  navigate("/checkout", { state: { items: selected } });
                }}
                className="px-10 py-3 bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
              >
                결제하기 &gt;
              </button>
            </div>
            <CartGuideAccordion />
          </div>
        </div>
      </div>
    </div>
  );
}
