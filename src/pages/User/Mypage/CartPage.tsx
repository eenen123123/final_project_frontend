import { useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";

interface CartItem {
  id: number;
  type: "lecture" | "book";
  title: string;
  subInfo: string;
  originalPrice?: number;
  salePrice: number;
  discountRate?: number;
  quantity: number;
  checked: boolean;
  keepDays?: number;
  keepUntil?: string;
}

const DUMMY_ITEMS: CartItem[] = [
  {
    id: 1,
    type: "lecture",
    title: "박광일T 수능 국어 완성반 (2027 수능대비)",
    subInfo: "영역: 국어 · 박광일",
    originalPrice: 150000,
    salePrice: 127500,
    discountRate: 15,
    quantity: 1,
    checked: true,
    keepDays: 30,
    keepUntil: "2026-08-06",
  },
  {
    id: 2,
    type: "book",
    title: "박광일T 수능 국어 완성반 교재 (2027)",
    subInfo: "교재 · 국어영역",
    salePrice: 18000,
    quantity: 1,
    checked: true,
    keepDays: 30,
    keepUntil: "2026-08-06",
  },
  {
    id: 3,
    type: "lecture",
    title: "정승제T 수능 수학 개념완성 (2027 수능대비)",
    subInfo: "영역: 수학 · 정승제",
    originalPrice: 140000,
    salePrice: 112000,
    discountRate: 20,
    quantity: 1,
    checked: false,
    keepDays: 30,
    keepUntil: "2026-08-06",
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
  const [activeSection, setActiveSection] = useState("장바구니");
  const [items, setItems] = useState<CartItem[]>(DUMMY_ITEMS);

  const toggleAll = (checked: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, checked })));
  };

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const deleteItem = (id: number) => {
    if (!window.confirm("상품을 삭제하시겠습니까?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteSelected = () => {
    const selectedCount = items.filter((i) => i.checked).length;
    if (selectedCount === 0) { alert("선택된 상품이 없습니다."); return; }
    if (!window.confirm("선택된 상품을 삭제하시겠습니까?")) return;
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  const deleteAll = () => {
    if (items.length === 0) { alert("장바구니에 상품이 없습니다."); return; }
    if (!window.confirm("전체 상품을 삭제하시겠습니까?")) return;
    setItems([]);
  };

  const allChecked = items.length > 0 && items.every((i) => i.checked);
  const checkedItems = items.filter((i) => i.checked);
  const totalOriginal = checkedItems.reduce((sum, i) => sum + (i.originalPrice ?? i.salePrice), 0);
  const totalSale = checkedItems.reduce((sum, i) => sum + i.salePrice, 0);
  const totalDiscount = totalOriginal - totalSale;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">

            {/* 단계 헤더 */}
            <div className="flex items-center justify-between bg-gray-800 px-6 py-4 mb-6">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white text-lg font-bold tracking-tight">장바구니</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>결제정보 입력</span>
                </div>
                <span className="text-gray-600">›</span>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>결제완료</span>
                </div>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="bg-white border border-gray-200 p-16 text-center">
                <p className="text-gray-400 text-sm mb-4">장바구니에 담긴 상품이 없습니다.</p>
                <button className="px-6 py-2 bg-gray-700 text-white text-sm font-medium hover:bg-gray-900 transition-colors cursor-pointer">
                  강좌/교재 보러가기 &gt;
                </button>
              </div>
            ) : (
              <>
                {/* 테이블 */}
                <div className="border border-gray-300 mb-3">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 bg-gray-50">
                        <th className="py-3 px-3 w-10 text-center border-r border-gray-200">
                          <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={(e) => toggleAll(e.target.checked)}
                            className="w-3.5 h-3.5 cursor-pointer accent-gray-800"
                          />
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-gray-700 border-r border-gray-200">상품정보</th>
                        <th className="py-3 px-4 w-24 text-center font-semibold text-gray-700 border-r border-gray-200">판매가</th>
                        <th className="py-3 px-4 w-14 text-center font-semibold text-gray-700 border-r border-gray-200">수량</th>
                        <th className="py-3 px-4 w-24 text-center font-semibold text-gray-700 border-r border-gray-200">결제가</th>
                        <th className="py-3 px-4 w-24 text-center font-semibold text-gray-700">주문/삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 last:border-b-0">
                          <td className="py-4 px-3 text-center border-r border-gray-200 align-middle">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleItem(item.id)}
                              className="w-3.5 h-3.5 cursor-pointer accent-gray-800"
                            />
                          </td>
                          <td className="py-4 px-4 border-r border-gray-200">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <span className={`inline-block text-[11px] px-1.5 py-0.5 border font-semibold mb-1.5 ${
                                  item.type === "lecture"
                                    ? "border-blue-400 text-blue-500 bg-blue-50"
                                    : "border-green-400 text-green-600 bg-green-50"
                                }`}>
                                  {item.type === "lecture" ? "강좌" : "교재"}
                                </span>
                                <p className="font-semibold text-gray-900 leading-snug mb-1 text-sm">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-400 mb-1">{item.subInfo}</p>
                                {item.keepDays && (
                                  <p className="text-xs text-gray-400">
                                    └ 보관기한: D-{item.keepDays}{" "}
                                    <span className="text-gray-300">({item.keepUntil}까지)</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center border-r border-gray-200 align-middle">
                            {item.originalPrice && (
                              <p className="text-xs text-gray-400 line-through mb-0.5">
                                {formatPrice(item.originalPrice)}원
                              </p>
                            )}
                            <p className="text-sm text-gray-700">{formatPrice(item.salePrice)}원</p>
                          </td>
                          <td className="py-4 px-4 text-center border-r border-gray-200 align-middle text-gray-700 text-sm">
                            {item.quantity}
                          </td>
                          <td className="py-4 px-4 text-center border-r border-gray-200 align-middle">
                            <p className="font-bold text-orange-500 text-sm">
                              {formatPrice(item.salePrice)}원
                            </p>
                          </td>
                          <td className="py-4 px-4 text-center align-middle">
                            <div className="flex flex-col items-center gap-1">
                              <button className="w-16 py-1 bg-gray-600 text-white text-xs hover:bg-gray-800 transition-colors cursor-pointer">
                                주문 &gt;
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
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

                {/* 금액 요약 */}
                <div className="border border-gray-300 mb-2">
                  <div className="grid grid-cols-3">
                    <div className="py-6 text-center">
                      <p className="text-xs text-gray-500 mb-2">총 주문금액</p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatPrice(totalOriginal)}
                        <span className="text-sm font-normal text-gray-500 ml-0.5">원</span>
                      </p>
                    </div>
                    <div className="py-6 text-center relative border-x border-gray-200">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-gray-300 flex items-center justify-center text-gray-500 text-sm font-bold">
                        −
                      </div>
                      <p className="text-xs text-gray-500 mb-2">총 할인금액</p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatPrice(totalDiscount)}
                        <span className="text-sm font-normal text-gray-500 ml-0.5">원</span>
                      </p>
                    </div>
                    <div className="py-6 text-center relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-gray-300 flex items-center justify-center text-gray-500 text-sm font-bold">
                        =
                      </div>
                      <p className="text-xs text-gray-500 mb-2">총 결제예상금액</p>
                      <p className="text-xl font-bold text-orange-500">
                        {formatPrice(totalSale)}
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
                  <button className="px-10 py-3 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer">
                    강좌/교재 더보기 &gt;
                  </button>
                  <button className="px-10 py-3 bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors cursor-pointer">
                    결제하기 &gt;
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
