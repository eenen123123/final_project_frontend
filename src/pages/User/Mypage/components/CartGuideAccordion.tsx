import { useState } from "react";

const GUIDE_SECTIONS = [
  {
    title: "보관기한 안내",
    items: [
      "장바구니에 담긴 상품은 담은 날로부터 30일 동안 보관된 후 자동 삭제됩니다.",
      "단, 일부 선착순 물품 및 혜택 사은품은 보관기간이 다르며, 주문가능일 이후 미주문한 사은품은 복구 불가합니다.",
    ],
  },
  {
    title: "배송비 안내",
    items: [
      "교재 배송비는 3,000원이 부과됩니다.",
      "회원변심에 인한 교재 반송 시, 환불금액에서 왕복 배송비가 제외됩니다.",
      "교재 및 도서는 평일 오후 2시에 발송됩니다. (공휴일 제외)",
    ],
  },
  {
    title: "강좌 취소 안내",
    items: [
      "강좌 취소 시, 해당 교재도 함께 취소되며 강좌 수강종료 시 교재 구매 불가합니다.",
      "강좌에 해당되는 교재는 강좌구매 시 1회만 구매 가능하며, 동일교재는 다시 구매하실 수 없습니다.",
    ],
  },
  {
    title: "도서 소득공제 안내",
    items: [
      "상품 정보에 '소득공제' 태그가 표시된 교재만 도서 소득공제가 가능합니다.",
      "개인 신용카드 결제 시, 카드 명의자 기준으로 도서비 소득공제가 자동으로 적용됩니다. (단, 법인카드는 제외)",
      "현금 결제 시, 현금 영수증을 '개인 소득공제용'으로 신청한 건에 한해 적용됩니다.",
    ],
  },
  {
    title: "통합 결제 안내",
    items: [
      "강좌 또는 소득공제 대상 교재와 소득공제 미대상 교재를 함께 주문하실 경우 신용카드 결제만 가능합니다.",
      "여러 개의 상품을 함께 주문하셔도 배송비는 전체 주문에 대해 묶음으로 1회만 결제됩니다.",
      "결제수단별 최소 결제금액이 상이하오니, 확인 후 결제 바랍니다.",
    ],
  },
];

export default function CartGuideAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="border border-gray-200 divide-y divide-gray-200 mt-6">
      {GUIDE_SECTIONS.map((section, i) => (
        <div key={section.title}>
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left"
          >
            {section.title}
            <span className="text-gray-400 text-xs">{openIndex === i ? "▲" : "▼"}</span>
          </button>
          {openIndex === i && (
            <ul className="px-5 py-3 bg-gray-50 space-y-1.5 border-t border-gray-100">
              {section.items.map((item, j) => (
                <li key={j} className="text-xs text-gray-500 leading-relaxed">
                  · {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
