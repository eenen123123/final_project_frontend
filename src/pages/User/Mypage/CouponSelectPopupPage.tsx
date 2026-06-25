import { useState, useEffect } from "react";
import type { CouponItem, CartItem } from "./components/CouponSelectPopup";

function calcDisc(coupon: CouponItem, baseAmt: number) {
  if (coupon.discType === "FIXED")
    return Math.min(coupon.discAmt ?? 0, baseAmt);
  return Math.floor((baseAmt * (coupon.discRate ?? 0)) / 100);
}

function applicableCoupons(coupons: CouponItem[], prodDivCd: string) {
  return coupons.filter(
    (c) =>
      c.useLimitCd === "ALL" ||
      (c.useLimitCd === "COURSE" && prodDivCd === "COURSE") ||
      (c.useLimitCd === "TEXTBOOK" && prodDivCd === "TEXTBOOK"),
  );
}

export default function CouponSelectPopupPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [selections, setSelections] = useState<Record<number, CouponItem>>({});

  useEffect(() => {
    const raw = localStorage.getItem("couponPopupData");
    if (!raw) return;
    const { items, coupons, initialSelections } = JSON.parse(raw);
    setItems(items ?? []);
    setCoupons(coupons ?? []);
    setSelections(initialSelections ?? {});
  }, []);

  const handleSelect = (cartSn: number, mcpntSn: string) => {
    if (!mcpntSn) {
      setSelections((prev) => { const next = { ...prev }; delete next[cartSn]; return next; });
      return;
    }
    const coupon = coupons.find((c) => c.mcpntSn === Number(mcpntSn));
    if (coupon) setSelections((prev) => ({ ...prev, [cartSn]: coupon }));
  };

  const handleConfirm = () => {
    localStorage.setItem("couponPopupResult", JSON.stringify(selections));
    window.opener?.postMessage("couponSelected", window.location.origin);
    window.close();
  };

  const totalDiscount = items.reduce((sum, item) => {
    const applied = selections[item.cartSn];
    if (!applied) return sum;
    return sum + calcDisc(applied, item.prodPrice * item.itemQty);
  }, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 - 검정 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <h2 className="text-base font-bold text-white">쿠폰 선택</h2>
        <button
          type="button"
          onClick={() => window.close()}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer text-lg"
        >
          ✕
        </button>
      </div>

      {/* 상품별 쿠폰 선택 */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {items.map((item) => {
          const baseAmt = item.prodPrice * item.itemQty;
          const applied = selections[item.cartSn];
          const pickable = applicableCoupons(coupons, item.prodDivCd);
          const usedByOthers = Object.entries(selections)
            .filter(([cartSn]) => Number(cartSn) !== item.cartSn)
            .map(([, c]) => c.mcpntSn);
          const discount = applied ? calcDisc(applied, baseAmt) : 0;

          return (
            <div key={item.cartSn} className="px-4 py-3">
              {/* 상품명 */}
              <div className="mb-2">
                <h4 className="text-sm font-bold text-slate-800 truncate">{item.prodNm}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.prodDivCd === "COURSE" ? "강좌" : "교재"} · {baseAmt.toLocaleString()}원
                </p>
              </div>

              {/* 셀렉트박스 */}
              <select
                value={applied?.mcpntSn ?? ""}
                onChange={(e) => handleSelect(item.cartSn, e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer bg-white"
              >
                <option value="">쿠폰 적용 안 함</option>
                {pickable.map((c) => {
                  const isUsed = usedByOthers.includes(c.mcpntSn);
                  const disc = calcDisc(c, baseAmt);
                  return (
                    <option key={c.mcpntSn} value={c.mcpntSn} disabled={isUsed}>
                      {c.couponNm} (-{disc.toLocaleString()}원){isUsed ? " — 다른 상품 적용 중" : ""}
                    </option>
                  );
                })}
              </select>

              {/* 할인 미리보기 */}
              {discount > 0 && (
                <p className="text-[11px] text-blue-600 font-semibold mt-1.5">
                  -{discount.toLocaleString()}원 할인 적용
                </p>
              )}
              {pickable.length === 0 && (
                <p className="text-[11px] text-slate-400 mt-1.5">적용 가능한 쿠폰이 없습니다.</p>
              )}
            </div>
          );
        })}
      </div>

      {/* 푸터 */}
      <div className="border-t border-slate-100 px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">총 할인 혜택</span>
          <span className="text-sm font-bold text-slate-900">
            {totalDiscount > 0 ? `-${totalDiscount.toLocaleString()}원` : "0원"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.close()}
            className="flex-1 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          >
            쿠폰 적용
          </button>
        </div>
      </div>
    </div>
  );
}
