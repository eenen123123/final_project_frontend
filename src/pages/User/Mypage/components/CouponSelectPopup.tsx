import { useState } from "react";

export interface CouponItem {
  mcpntSn: number;
  couponNm: string;
  discType: "FIXED" | "RATE";
  discAmt: number | null;
  discRate: number | null;
  useLimitCd: string; // COURSE / TEXTBOOK / ALL
  expiryDt: string;
}

export interface CartItem {
  cartSn: number;
  prodDivCd: string;
  prodNm: string;
  prodPrice: number;
  itemQty: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (selections: Record<number, CouponItem>) => void;
  items: CartItem[];
  coupons: CouponItem[];
  initialSelections?: Record<number, CouponItem>;
}

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

export default function CouponSelectPopup({
  open,
  onClose,
  onConfirm,
  items,
  coupons,
  initialSelections,
}: Props) {
  const [selections, setSelections] = useState<Record<number, CouponItem>>(
    initialSelections ?? {},
  );

  if (!open) return null;

  const handleSelect = (cartSn: number, coupon: CouponItem) => {
    setSelections((prev) => ({ ...prev, [cartSn]: coupon }));
  };

  const handleRemove = (cartSn: number) => {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[cartSn];
      return next;
    });
  };

  // 실시간 총 할인 금액 계산
  const totalDiscount = items.reduce((sum, item) => {
    const applied = selections[item.cartSn];
    if (!applied) return sum;
    return sum + calcDisc(applied, item.prodPrice * item.itemQty);
  }, 0);

  return (
    // 배경을 너무 어둡지 않게 띄워 팝업 느낌을 강조
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px]">
      {/* 팝업 컨테이너: 컴팩트한 사이즈와 깊이감 있는 그림자(shadow-2xl) */}
      <div className="bg-white w-full max-w-[440px] mx-4 rounded-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* 헤더: 미니멀 테두리와 타이틀 */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">쿠폰 선택</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 divide-y divide-slate-100">
          {items.map((item, index) => {
            const baseAmt = item.prodPrice * item.itemQty;
            const applied = selections[item.cartSn];
            const pickable = applicableCoupons(coupons, item.prodDivCd);

            // 현재 아이템 제외, 다른 아이템들이 이미 선점한 쿠폰 번호들 추출 (중복 사용 방지)
            const usedByOthers = Object.entries(selections)
              .filter(([cartSn]) => Number(cartSn) !== item.cartSn)
              .map(([_, c]) => c.mcpntSn);

            return (
              <div
                key={item.cartSn}
                className={`space-y-3 ${index > 0 ? "pt-5" : ""}`}
              >
                {/* 상품 요약 정보 */}
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                      {item.prodNm}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.prodDivCd === "COURSE" ? "강좌" : "교재"} ·{" "}
                      {baseAmt.toLocaleString()}원
                    </p>
                  </div>
                </div>

                {/* 쿠폰 선택 라디오 카드형 리스트 */}
                <div className="space-y-1.5">
                  {/* 옵션 1: 적용 안 함 */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.cartSn)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      !applied
                        ? "border-slate-900 bg-slate-950 text-white font-semibold shadow-sm"
                        : "border-slate-100 bg-slate-50/50 hover:border-slate-200 text-slate-500"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        !applied ? "border-white" : "border-slate-300"
                      }`}
                    >
                      {!applied && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span>쿠폰 적용 안 함</span>
                  </button>

                  {/* 옵션 2~: 보유한 쿠폰 매핑 */}
                  {pickable.map((c) => {
                    const isSelected = applied?.mcpntSn === c.mcpntSn;
                    const isDisabled = usedByOthers.includes(c.mcpntSn);
                    const discount = calcDisc(c, baseAmt);

                    return (
                      <button
                        key={c.mcpntSn}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSelect(item.cartSn, c)}
                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/30 text-blue-900 font-medium ring-1 ring-blue-600"
                            : isDisabled
                              ? "border-slate-100 bg-slate-50/50 opacity-40 cursor-not-allowed text-slate-400"
                              : "border-slate-100 hover:border-slate-200 bg-white text-slate-700 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* 커스텀 라디오 버튼 */}
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-blue-600 bg-blue-600"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-xs font-semibold truncate ${isSelected ? "text-blue-950" : "text-slate-800"}`}
                            >
                              {c.couponNm}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {isDisabled
                                ? "다른 상품에 적용 중"
                                : `~${c.expiryDt}까지`}
                            </p>
                          </div>
                        </div>

                        {/* 할인 금액 우측 정렬 */}
                        <div className="text-right shrink-0">
                          <span
                            className={`text-xs font-bold ${isSelected ? "text-blue-600" : "text-slate-900"}`}
                          >
                            -{discount.toLocaleString()}원
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {pickable.length === 0 && (
                    <div className="text-center py-4 border border-dashed border-slate-100 rounded-xl">
                      <p className="text-xs text-slate-400">
                        적용 가능한 쿠폰이 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 푸터: 딱 떨어지는 미니멀 룩앤필 */}
        <div className="bg-slate-50/80 border-t border-slate-100 p-5 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-slate-500">
              총 할인 혜택
            </span>
            <span className="text-base font-bold text-slate-900">
              {totalDiscount > 0
                ? `-${totalDiscount.toLocaleString()}원`
                : "0원"}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => onConfirm(selections)}
              className="flex-1 py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
            >
              쿠폰 적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
