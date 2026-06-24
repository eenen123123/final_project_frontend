export default function TaxDeductionPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Malgun Gothic', '맑은 고딕', sans-serif" }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4" style={{ background: "#2d2d35" }}>
        <h2 className="text-base font-bold text-white">도서 소득공제 안내</h2>
        <button type="button" onClick={() => window.close()}
          className="text-gray-400 hover:text-white text-xl leading-none cursor-pointer">✕</button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <p className="font-bold mb-4" style={{ fontSize: "14px", color: "#555" }}>도서 소득공제란?</p>

        <ul className="space-y-3" style={{ fontSize: "12px", color: "#444", lineHeight: "1.7" }}>
          <li>- 공제 대상자 : 총 급여 70,000,000원 이하 근로소득자 중 신용카드 등 사용액이 총 급여의 25%가 초과하는 근로자</li>
          <li>- 공제한도 : 최대 1,000,000원</li>
          <li>
            - 공제대상 상품 : 출판문화산업 진흥법 제2조 제3호에 따른 기록사항〔저자, 발행인, 발행일, 출판사,
            국제표준도서번호(ISBN, 전자책은 ECN 포함)〕이 표기된 간행물 : 종이책, 전자책, 외국발행 간행물,
            중고책(재판매 목적이 아닌 독서·학습 등의 목적으로 최종소비자에게 판매되었던 간행물로 판매자에 의해
            다시 판매되는 도서)가 포함되며, 도서 구입비에는 도서 구입에 수반되는 배송료도 포함
          </li>
          <li>- 개인 신용카드 결제 시, 카드 명의자 기준으로 도서비 소득공제가 자동으로 적용됩니다. (단, 법인카드는 제외)</li>
          <li>- 현금 결제 시, 현금 영수증을 '개인 소득공제용'으로 신청한 건에 한해 적용됩니다. (지출 증빙용 제외, 결제 후 사후 신청 불가)</li>
          <li>- 도서비 소득공제 대상 상품과 미대상 상품을 함께 주문하는 통합 결제의 경우 신용카드 결제만 가능하며, 배송비는 전체 주문에 대해 묶음으로 1회만 결제됩니다.</li>
          <li>- 통합 결제 시, 할부 혜택은 분할 승인되는 각 결제 건당 금액을 기준으로 적용되오니, 카드사별 할부 기준 금액을 확인해 주시기 바랍니다.</li>
          <li>- 도서비 소득공제 대상 금액은 일부 카드사의 신용카드 할인 혜택에서 제외될 수 있습니다.</li>
        </ul>
      </div>

      {/* 하단 닫기 */}
      <div className="flex justify-center py-4 border-t border-gray-200 shrink-0">
        <button type="button" onClick={() => window.close()}
          style={{ width: 90, padding: "7px 0", border: "1px solid #ccc", fontSize: "13px", color: "#555", cursor: "pointer", background: "#e8e8e8" }}
          className="hover:bg-gray-300 transition-colors">
          닫기 &gt;
        </button>
      </div>
    </div>
  );
}
