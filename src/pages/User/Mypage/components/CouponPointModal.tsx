interface InfoModalProps {
  tabId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ExpiryModalProps {
  tabId: string;
  tabTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ModalSection {
  heading: string;
  bullets: React.ReactNode[];
}

interface ModalConfig {
  title: string;
  sections: ModalSection[];
}

const MODAL_CONFIGS: Record<string, ModalConfig> = {
  "hm-coupon": {
    title: "HM 할인권이란?",
    sections: [
      {
        heading: "HM 할인권은 무엇인가요?",
        bullets: [
          <>헤르메스에서 발행한 할인권으로, <span className="text-blue-600 font-semibold">헤르메스 컨텐츠 이용 시</span> 사용 가능한 쿠폰입니다.</>,
        ],
      },
      {
        heading: "HM 할인권은 어떻게 사용하나요?",
        bullets: [
          <>용도(일반강좌/교재)에 따라 상품 각각에 명시된 금액 또는 할인율만큼 상품 결제 시 사용하실 수 있습니다. <span className="text-blue-600 font-semibold">(단, 패키지강좌·이벤트강좌에는 사용이 불가합니다.)</span></>,
          <>할인권은 <span className="text-blue-600 font-semibold">유효기간 내</span> 사용이 가능하므로, 유효기간을 확인하시어 기간 내에 사용하시기 바랍니다.</>,
          <><span className="text-blue-600 font-semibold">주문 시, 상품 종류별 1장씩</span> 사용할 수 있습니다.</>,
          <>할인권을 사용하여 구매한 상품 취소 시, 사용한 할인권은 환원되지 않고 <span className="text-blue-600 font-semibold">소멸</span>됩니다.</>,
        ],
      },
    ],
  },
  "hm-point-buy": {
    title: "HM 포인트란?",
    sections: [
      {
        heading: "HM 포인트는 무엇인가요?",
        bullets: [
          <><span className="text-blue-600 font-semibold">강좌 및 교재 구매</span> 시 적립되어, 헤르메스 컨텐츠 이용 시 사용 가능한 마일리지형 포인트입니다.</>,
        ],
      },
      {
        heading: "HM 포인트는 어떻게 적립하나요?",
        bullets: [
          <><span className="text-blue-600 font-semibold">강좌 구매 시</span> 실 결제금액에 대해 <span className="text-blue-600 font-semibold">1%</span> 적립됩니다.</>,
          <><span className="text-blue-600 font-semibold">교재 구매 시</span> 실 결제금액에 대해 <span className="text-blue-600 font-semibold">1%</span> 적립됩니다.</>,
        ],
      },
      {
        heading: "확인사항",
        bullets: [
          <>HM 포인트는 구매 후 <span className="text-blue-600 font-semibold">30일 이후</span> 자동 적립됩니다.</>,
          <>HM 포인트는 현금으로 환불되지 않습니다.</>,
          <>적립일로부터 <span className="text-blue-600 font-semibold">1년간</span> 이용이 유효하며, 1년 후 사용하지 않은 포인트는 자동 소멸됩니다.</>,
        ],
      },
      {
        heading: "HM 포인트는 어떻게 사용하나요?",
        bullets: [
          <><span className="text-blue-600 font-semibold">강좌 및 교재 구매 시</span> 사용할 수 있습니다.</>,
          <>적립된 포인트는 <span className="text-blue-600 font-semibold">1,000p 이상</span>인 경우 자유롭게 사용 가능합니다.</>,
          <>포인트로 결제 후 취소 시 <span className="text-blue-600 font-semibold">미사용 처리로 포인트가 복원</span>됩니다.</>,
        ],
      },
    ],
  },
  "hm-point": {
    title: "스터디포인트란?",
    sections: [
      {
        heading: "스터디포인트는 무엇인가요?",
        bullets: [
          <><span className="text-blue-600 font-semibold">이벤트 참여 및 활동</span> 등으로 적립하여, 헤르메스 컨텐츠 이용 시 사용 가능한 포인트입니다.</>,
        ],
      },
      {
        heading: "스터디포인트는 어떻게 적립하나요?",
        bullets: [
          <>헤르메스 사이트에서 진행하는 <span className="text-blue-600 font-semibold">이벤트 페이지</span>에서 적립이 가능하며, 이벤트에 따라 <span className="text-blue-600 font-semibold">차등</span> 적립됩니다.</>,
          <>관리자가 특정 활동에 대해 <span className="text-blue-600 font-semibold">직접 지급</span>하는 경우도 있습니다.</>,
        ],
      },
      {
        heading: "확인사항",
        bullets: [
          <>스터디포인트는 현금으로 환불되지 않습니다.</>,
          <>적립일로부터 <span className="text-blue-600 font-semibold">1년간</span> 이용이 유효하며, 1년 후 사용하지 않은 포인트는 자동 소멸됩니다.</>,
          <>이벤트별 적립 조건 및 사용 제한이 다를 수 있습니다.</>,
        ],
      },
      {
        heading: "스터디포인트는 어떻게 사용하나요?",
        bullets: [
          <><span className="text-blue-600 font-semibold">강좌 구매 시</span> 사용할 수 있습니다.</>,
          <>적립된 포인트는 <span className="text-blue-600 font-semibold">1,000p 이상</span>인 경우 자유롭게 사용 가능합니다.</>,
          <>포인트로 결제 후 취소 시 <span className="text-blue-600 font-semibold">미사용 처리로 포인트가 복원</span>됩니다.</>,
        ],
      },
    ],
  },
  "hm-money": {
    title: "HM머니란?",
    sections: [
      {
        heading: "HM머니는 무엇인가요?",
        bullets: [
          <>헤르메스에서 <span className="text-blue-600 font-semibold">현금처럼 사용</span>하실 수 있는 유료 사이버 머니입니다.</>,
        ],
      },
      {
        heading: "HM머니는 어떻게 충전하나요?",
        bullets: [
          <>최소 <span className="text-blue-600 font-semibold">1,000원에서 최대 500,000원까지</span> 신용카드, 계좌이체, 무통장입금, 휴대폰결제를 통해 충전 가능합니다.</>,
          <>주문한 강좌나 교재 취소 시 <span className="text-blue-600 font-semibold">부분환불</span> 처리를 선택하면 현금 대신 HM머니로 적립할 수 있으며, 추후 현금 환불도 가능합니다.</>,
        ],
      },
      {
        heading: "확인사항",
        bullets: [
          <>HM머니의 이용 <span className="text-blue-600 font-semibold">유효기간은 없으며</span>, 사용하고 남은 잔액은 고객센터로 연락하여 환불 요청하실 수 있습니다.</>,
          <>HM머니로 결제한 주문 취소 시 <span className="text-blue-600 font-semibold">HM머니로의 재적립이 우선</span>이며, 원하시는 경우 현금(계좌)으로 환불 요청하실 수 있습니다.</>,
          <>미성년 회원(만 19세 미만)의 경우, 부모님 동의 확인 후 부모님 계좌로 환불처리가 가능합니다.</>,
        ],
      },
      {
        heading: "HM머니는 어떻게 사용하나요?",
        bullets: [
          <><span className="text-blue-600 font-semibold">강좌, 교재 구매 및 수강기간 연장 시</span> 사용할 수 있습니다.</>,
          <>단, 정기결제가 필요한 <span className="text-blue-600 font-semibold">이용권</span> 결제 시에는 사용할 수 없습니다.</>,
        ],
      },
    ],
  },
};

export default function CouponPointModal({ tabId, isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  const config = MODAL_CONFIGS[tabId];
  if (!config) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[560px] max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2E313D]">
          <strong className="text-sm font-bold text-white">{config.title}</strong>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-6 space-y-6">
          {config.sections.map((section, si) => (
            <div key={si}>
              <strong className="block text-sm font-bold text-gray-900 mb-3">
                {section.heading}
              </strong>
              <ul className="space-y-2">
                {section.bullets.map((bullet, bi) => (
                  <li key={bi} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div className="flex justify-center pb-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-400 text-xs text-gray-600 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            닫기 &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

const EXPIRY_DESCRIPTIONS: Record<string, string> = {
  "hm-coupon": "회원님이 보유하신 유효기간 만료가 다가오는 HM 할인권을 확인하세요.",
  "hm-point-buy": "회원님이 보유하신 유효기간 만료가 다가오는 HM 포인트를 확인하세요.",
  "hm-point": "회원님이 보유하신 유효기간 만료가 다가오는 스터디포인트를 확인하세요.",
};

function getNextMonthLabel() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `${next.getFullYear()}년 ${next.getMonth() + 1}월`;
}

export function ExpiryDetailModal({ tabId, tabTitle, isOpen, onClose }: ExpiryModalProps) {
  if (!isOpen) return null;

  const description = EXPIRY_DESCRIPTIONS[tabId];
  const nextMonth = getNextMonthLabel();
  const isCoupon = tabId === "hm-coupon";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[620px] max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#2E313D]">
          <strong className="text-sm font-bold text-white">
            소멸예정 {tabTitle} 유효기간 안내
          </strong>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="text-center py-4 mb-4 border border-gray-200 bg-gray-50">
            <strong className="text-sm font-bold text-gray-800">
              {nextMonth} <span className="text-[#2E313D]">소멸예정 {tabTitle}</span>
            </strong>
          </div>

          <p className="text-xs text-gray-600 mb-4">{description}</p>

          {isCoupon ? (
            <table className="w-full text-xs border-collapse border border-gray-300">
              <colgroup>
                <col style={{ width: "24%" }} />
                <col />
                <col style={{ width: "28%" }} />
              </colgroup>
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="py-2.5 px-3 text-center font-bold text-gray-700 border-r border-gray-300">날짜</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-700 border-r border-gray-300">할인권명</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-700">유효기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-500 font-medium">
                    소멸 예정인 {tabTitle}이 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs border-collapse border border-gray-300">
              <colgroup>
                <col style={{ width: "20%" }} />
                <col />
                <col style={{ width: "22%" }} />
                <col style={{ width: "22%" }} />
              </colgroup>
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="py-2.5 px-3 text-center font-bold text-gray-700 border-r border-gray-300">날짜</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-700 border-r border-gray-300">사용내역</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-700 border-r border-gray-300">적립포인트</th>
                  <th className="py-2.5 px-3 text-center font-bold text-gray-700">유효기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500 font-medium">
                    소멸 예정인 {tabTitle}이 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-center pb-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-400 text-xs text-gray-600 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            닫기 &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
