const NOTICES = [
  "모든 강좌 수강기간에는 교재 배송기간 최대 7일이 포함되어 있습니다.",
  "강좌·교재를 함께 구매 후 강좌 취소는 교재가 반송되어야 취소 가능합니다.",
  "결제수단별 최소 결제금액이 상이하오니, 확인 후 결제 바랍니다.",
  "여러 개의 상품을 함께 주문하셔도 배송비는 전체 주문에 대해 묶음으로 1회만 결제됩니다.",
  "미성년자 결제 시 법정대리인이 동의하지 않으면 취소될 수 있습니다.",
  "결제 완료 후 구매 확정까지는 배송 조회 및 환불 요청이 가능합니다.",
  "교재는 수령 후 7일 이내 반품 신청이 가능하며, 단순 변심은 배송비 부담입니다.",
  "이벤트·할인 적용 상품은 환불 시 실 결제금액 기준으로 처리됩니다.",
];

export default function CheckoutNotice() {
  return (
    <div className="border border-gray-300 bg-gray-50 mb-8">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-200">
        <span className="text-sm font-bold text-gray-800">안내사항</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.open("/info/refund", "refundPolicy", "width=680,height=620,scrollbars=yes,resizable=no")}
            className="text-xs px-3 py-1.5 border border-gray-400 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            환불/취소 안내 &gt;
          </button>
          <a
            href="/customer/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 border border-gray-400 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            결제 관련 FAQ &gt;
          </a>
          <button
            type="button"
            onClick={() => window.open("/info/tax-deduction", "taxDeduction", "width=560,height=600,scrollbars=yes,resizable=no")}
            className="text-xs px-3 py-1.5 border border-gray-400 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            도서 소득공제 안내 &gt;
          </button>
        </div>
      </div>
      <div className="px-5 py-4 text-xs text-gray-500 leading-relaxed space-y-1.5">
        {NOTICES.map((txt, i) => (
          <p key={i}>{i + 1}. {txt}</p>
        ))}
        <div className="flex justify-end pt-2">
          <span className="text-gray-400">
            고객센터{" "}
            <span className="font-semibold text-gray-600">1599-6405</span>
          </span>
        </div>
      </div>
    </div>
  );
}
