import { useState } from "react";

type TabKey = "course" | "book" | "process";

const TABS: { key: TabKey; label: string }[] = [
  { key: "course", label: "강좌 환불" },
  { key: "book", label: "교재 및 도서 환불" },
  { key: "process", label: "환불절차 및 방법" },
];

export default function RefundPolicyPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("course");

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Malgun Gothic', '맑은 고딕', sans-serif" }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4" style={{ background: "#2d2d35" }}>
        <h2 className="text-base font-bold text-white">환불/취소 안내</h2>
        <button type="button" onClick={() => window.close()}
          className="text-gray-400 hover:text-white text-xl leading-none cursor-pointer">✕</button>
      </div>

      {/* 탭 */}
      <div className="flex border-b-2 border-gray-800" style={{ marginBottom: 0 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-sm font-semibold border-r border-gray-300 last:border-r-0 cursor-pointer transition-colors
              ${activeTab === tab.key
                ? "bg-white text-gray-900 border-b-2 border-b-white -mb-px"
                : "bg-gray-100 text-gray-500 hover:bg-gray-50"}`}
            style={i === 0 ? { borderLeft: "1px solid #d1d5db" } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* ===== 강좌 환불 ===== */}
        {activeTab === "course" && (
          <div className="space-y-5 text-sm">
            <div className="space-y-2">
              <p className="font-bold" style={{ color: "#8b6914" }}>* 헤르메스 환불 규정</p>
              <div className="space-y-2 text-gray-700 leading-relaxed" style={{ fontSize: "12px" }}>
                <p>
                  <strong>전액 환불</strong> : 수강시작일 전 환불 요청하는 경우 전액 환불 처리됩니다.
                  (수강시작일은 강좌 구매 후 최대 7일 이내에 설정 가능하며, 7일 이내에 수강시작을 하지 않을 경우
                  상품 구매일로부터 7일째 되는 날이 수강시작일이 적용됩니다.)
                </p>
                <p>
                  <strong>부분 환불</strong> : 수강시작일 이후부터 환불 요청일 기준으로 아래 정책에 따라 산출한 금액
                  <br />(강좌 구매 시 제공된 추가 혜택은 제외되며, 단일강좌의 수강기간과 정가에 따라 이용 금액이 산출됩니다.)
                </p>
                <div className="pl-2 space-y-0.5">
                  <p>① 수강기간 1개월(30일) 이내인 경우</p>
                  <p className="pl-3">- 수강시작일로부터 1/3 경과 전 : 부분 환불액 = 실 결제금액 - 수강료 1/3 이용 금액</p>
                  <p className="pl-3">- 수강시작일로부터 1/2 경과 전 : 부분 환불액 = 실 결제금액 - 수강료 1/2 이용 금액</p>
                  <p className="pl-3">- 수강시작일로부터 1/2 경과 후 : 환불액 없음</p>
                  <p className="mt-1">② 수강기간 1개월(30일) 초과하는 경우</p>
                  <p className="pl-3">- 환불 요청일 기준, ① 기준으로 월별 이용금액을 산출한 후 실 결제 금액에서 산출된 월 이용 금액을 차감한 금액</p>
                  <p className="pl-3">- 월별 수강료 산출 시 나머지 월이 1개월(30일) 미만의 경우 ① 기준에 따라 일할 계산하여 환불</p>
                </div>
              </div>
            </div>

            <div className="space-y-3" style={{ fontSize: "12px" }}>
              <div>
                <p className="font-bold text-gray-800">1. 일반강좌(단일강좌)</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 헤르메스 환불규정에 의거하여 환불금액이 산출됩니다.</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">2. 패키지 강좌</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 패키지 강좌는 구매 시 제공된 혜택(할인, 연장, 사은품 등)은 철회되고, 구성된 각 단일강좌의 환불규정에 의거하여 환불금액이 산출됩니다.</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">3. 이벤트 강좌 및 요금제 상품</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 해당 강좌 및 상품 상세 안내 페이지에 안내된 환불 규정이 적용됩니다.</p>
              </div>
            </div>

            <div className="border border-gray-300 p-4" style={{ background: "#f9f9f9", fontSize: "12px" }}>
              <p className="font-bold text-gray-700 mb-2">강좌 환불 시 유의사항</p>
              <ul className="space-y-1 text-gray-600">
                <li>A. 실 수강 이력이 없다 하더라도 수강 기간이 종료된 후에는 환불되지 않습니다.</li>
                <li>B. 강좌 구매 시 제공된 할인, 수강기간 연장 등의 혜택들은 환불 시 모두 철회된 후 각 단일 강좌 정가 기준으로 환불금액을 산출합니다.</li>
                <li>C. 다운로드 강의는 다운로드 시 해당 강의를 수강한 것으로 처리됩니다.</li>
                <li>D. 실제 수강한 강의수가 단기간 내 과도할 경우, 실제 수강한 수강 강의 수가 우선 적용되어 공제금액이 많아질 수 있습니다.</li>
                <li>E. 강좌를 취소하는 경우 함께 구매했던 교재는 왕복 배송비 부담 후 반드시 반납해야 합니다.</li>
                <li>F. 환불 요청 시 추가적인 혜택(할인, 수강 연장, 사은품, 포인트 등)은 반환 되어야 하나, 사용되었거나 상품 가치가 감소했을 경우 환불 금액에서 공제됩니다.</li>
                <li>G. 미성년자인 경우, 부모님 동의 하에(유선 통화 확인) 환불 내용 및 환불 수단 등을 확인 후 환불 규정 따라 처리됩니다.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ===== 교재 및 도서 환불 ===== */}
        {activeTab === "book" && (
          <div className="space-y-5 text-sm">
            <div className="space-y-2">
              <p className="font-bold" style={{ color: "#8b6914" }}>* 헤르메스 교재·도서 환불 규정</p>
              <div className="space-y-2 text-gray-700 leading-relaxed" style={{ fontSize: "12px" }}>
                <p><strong>전액 환불</strong> : 상품 수령 후 7일 이내, 미개봉·미사용 상태인 경우 전액 환불 처리됩니다.</p>
                <p><strong>부분 환불 불가</strong> : 교재·도서는 개봉 또는 사용한 경우 단순 변심에 의한 환불이 불가합니다.</p>
                <p><strong>불량·오배송</strong> : 상품 불량 또는 오배송의 경우 수령일로부터 30일 이내 고객센터로 연락하시면 처리해 드립니다.</p>
              </div>
            </div>

            <div className="space-y-3" style={{ fontSize: "12px" }}>
              <div>
                <p className="font-bold text-gray-800">1. 단순 변심 반품</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 수령 후 7일 이내, 미개봉 상태에서만 가능하며 왕복 배송비(6,000원)는 고객 부담입니다.</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">2. 상품 불량·파손</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 배송 중 파손 또는 인쇄 불량 등의 경우 수령일로부터 30일 이내 고객센터로 접수해 주시면 교환 또는 전액 환불해 드립니다. (배송비 헤르메스 부담)</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">3. 강좌와 함께 구매한 교재</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 강좌 취소 시 교재도 함께 반납해야 하며, 왕복 배송비는 고객 부담입니다. 이미 개봉한 교재의 경우 교재 정가를 공제 후 환불됩니다.</p>
              </div>
            </div>

            <div className="border border-gray-300 p-4" style={{ background: "#f9f9f9", fontSize: "12px" }}>
              <p className="font-bold text-gray-700 mb-2">교재 환불 시 유의사항</p>
              <ul className="space-y-1 text-gray-600">
                <li>A. 수령 후 7일이 경과한 경우 단순 변심에 의한 반품이 불가합니다.</li>
                <li>B. 교재에 필기·훼손이 있는 경우 반품이 불가합니다.</li>
                <li>C. 구성품(부록, 해설집 등)이 누락된 경우 반품이 불가합니다.</li>
                <li>D. 반품 시 상품과 함께 주문번호를 동봉하여 발송해 주세요.</li>
                <li>E. 환불은 반품 상품 확인 후 영업일 기준 3~5일 이내 처리됩니다.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ===== 환불절차 및 방법 ===== */}
        {activeTab === "process" && (
          <div className="space-y-5 text-sm">
            <div className="space-y-2">
              <p className="font-bold" style={{ color: "#8b6914" }}>* 환불 신청 방법</p>
              <div className="space-y-3 text-gray-700 leading-relaxed" style={{ fontSize: "12px" }}>
                <p><strong>온라인 신청</strong> : 마이페이지 → 주문/배송 조회 → 해당 주문 선택 → 환불/취소 신청</p>
                <p><strong>고객센터 신청</strong> : 전화 1599-6405 (평일 09:00~18:00, 주말·공휴일 휴무)</p>
              </div>
            </div>

            <div className="space-y-3" style={{ fontSize: "12px" }}>
              <div>
                <p className="font-bold text-gray-800">1. 환불 처리 기간</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 환불 신청 접수 후 영업일 기준 3~5일 이내 처리됩니다.</p>
                <p className="text-gray-600 pl-2">· 카드 결제의 경우 카드사 정책에 따라 최대 7일이 소요될 수 있습니다.</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">2. 환불 수단</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 신용카드 결제 → 카드 취소</p>
                <p className="text-gray-600 pl-2">· 계좌이체·무통장입금 → 환불 계좌로 송금</p>
                <p className="text-gray-600 pl-2">· 포인트 사용분 → 포인트 복원</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">3. 환불 불가 사유</p>
                <p className="text-gray-600 mt-0.5 pl-2">· 수강 기간이 종료된 강좌</p>
                <p className="text-gray-600 pl-2">· 수강시작일로부터 1/2 이상 경과한 강좌</p>
                <p className="text-gray-600 pl-2">· 개봉·사용된 교재 (단순 변심)</p>
                <p className="text-gray-600 pl-2">· 이벤트 상품 중 환불 불가로 명시된 상품</p>
              </div>
            </div>

            <div className="border border-gray-300 p-4" style={{ background: "#f9f9f9", fontSize: "12px" }}>
              <p className="font-bold text-gray-700 mb-2">유의사항</p>
              <ul className="space-y-1 text-gray-600">
                <li>A. 환불 신청 전 반드시 환불 규정을 확인해 주세요.</li>
                <li>B. 포인트·쿠폰 등 혜택 사용분은 환불 시 공제될 수 있습니다.</li>
                <li>C. 환불 계좌 정보가 정확하지 않은 경우 처리가 지연될 수 있습니다.</li>
                <li>D. 미성년자의 경우 법정대리인 동의 확인 후 처리됩니다.</li>
              </ul>
            </div>
          </div>
        )}
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
