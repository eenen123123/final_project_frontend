import { useState } from "react";
import {
  GraduationCap,
  Star,
  Wallet,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import CouponPointModal, { ExpiryDetailModal } from "./CouponPointModal";

type TabType = "hm-coupon" | "hm-point-buy" | "hm-point" | "hm-money";

interface AssetTab {
  id: TabType;
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
}

const ASSET_TABS: AssetTab[] = [
  { id: "hm-coupon", title: "HM 할인권", value: "0", unit: "장", icon: Ticket },
  { id: "hm-point-buy", title: "HM 포인트", value: "0", unit: "p", icon: Star },
  {
    id: "hm-point",
    title: "스터디포인트",
    value: "0",
    unit: "p",
    icon: GraduationCap,
  },
  { id: "hm-money", title: "HM머니", value: "0", unit: "원", icon: Wallet },
];

const SUMMARY_NOTICES: Record<TabType, React.ReactNode[]> = {
  "hm-coupon": [
    "HM 할인권은 유효기간 내 사용이 가능하므로 유효기간을 반드시 확인하시기 바랍니다.",
    "HM 할인권을 사용하여 구매한 상품을 취소 시 사용한 HM 할인권은 환원되지 않고 소멸됩니다.",
  ],
  "hm-point-buy": [
    "소멸 예정 HM 포인트는 다음 달에 유효기간이 만료되는 포인트의 총합이며, 소멸은 일단위로 진행됩니다.",
    "HM 포인트는 적립일로부터 1년간 이용이 유효하며, 1년 후 잔여 포인트는 자동 소멸됩니다.",
  ],
  "hm-point": [
    "소멸 예정 스터디포인트는 다음 달에 유효기간이 만료되는 포인트의 총합이며, 소멸은 일단위로 진행됩니다.",
    <>
      적립된 스터디포인트는{" "}
      <span className="font-semibold text-gray-600">1,000p</span> 이상인 경우
      자유롭게 사용 가능합니다.
    </>,
    "스터디포인트는 적립일로부터 1년간 이용이 유효하며, 1년 후 잔여 포인트는 자동 소멸됩니다.",
  ],
  "hm-money": [
    "HM머니는 유효기간이 없으며, 사용하고 남은 잔액은 고객센터를 통해 환불 요청하실 수 있습니다.",
    "HM머니로 결제 후 취소 시 HM머니로 재적립되며, 원하시는 경우 현금 환불도 가능합니다.",
  ],
};

const NOTICE_CONFIGS: Record<
  string,
  {
    plus: { label: string; desc: string };
    minus: { label: string; desc: string };
  }
> = {
  "hm-coupon": {
    plus: {
      label: "HM 할인권 발급",
      desc: "HM 할인권은 이벤트 참여 또는 관리자 발급을 통해 받을 수 있습니다.",
    },
    minus: {
      label: "HM 할인권 사용",
      desc: "HM 할인권은 헤르메스 컨텐츠 이용 시 명시된 금액만큼 할인받을 수 있습니다.",
    },
  },
  "hm-point-buy": {
    plus: {
      label: "HM 포인트 적립",
      desc: "HM 포인트는 강좌 및 교재 구매 시 실 결제금액에 대해 자동으로 적립됩니다.",
    },
    minus: {
      label: "HM 포인트 사용",
      desc: "HM 포인트는 헤르메스 컨텐츠 이용 시 포인트만큼 할인된 가격에 구매하실 수 있습니다.",
    },
  },
  "hm-point": {
    plus: {
      label: "스터디포인트 적립",
      desc: "스터디포인트는 이벤트 참여 및 관리자 지급을 통해 적립됩니다.",
    },
    minus: {
      label: "스터디포인트 사용",
      desc: "스터디포인트는 헤르메스 컨텐츠 이용 시 포인트만큼 할인된 가격에 구매하실 수 있습니다.",
    },
  },
  "hm-money": {
    plus: {
      label: "HM머니 충전",
      desc: "신용카드, 계좌이체, 무통장입금, 휴대폰결제를 통해 충전할 수 있습니다.",
    },
    minus: {
      label: "HM머니 사용",
      desc: "HM머니는 헤르메스 강좌 및 교재 구매 시 현금처럼 사용하실 수 있습니다.",
    },
  },
};

export default function CouponPointContent() {
  const [activeTab, setActiveTab] = useState<TabType>("hm-coupon");
  const [showModal, setShowModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [startDate, setStartDate] = useState("2026-05-30");
  const [endDate, setEndDate] = useState("2026-06-06");
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [sortType, setSortType] = useState("");
  const [moneySubTab, setMoneySubTab] = useState<"history" | "charge">("history");
  const [chargeAmount, setChargeAmount] = useState("1000");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [emailAgreed, setEmailAgreed] = useState(false);

  const currentTab = ASSET_TABS.find((t) => t.id === activeTab);
  const tabTitle = currentTab?.title ?? "포인트";
  const tabUnit = currentTab?.unit ?? "p";

  const iranSuffix = (word: string) => {
    const code = word.charCodeAt(word.length - 1) - 0xac00;
    return code >= 0 && code % 28 > 0 ? "이란" : "란";
  };

  const handlePeriodChange = (days: number) => {
    setSelectedPeriod(days);
    const end = new Date(2026, 5, 6);
    const start = new Date(2026, 5, 6);
    start.setDate(start.getDate() - days);
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setStartDate(fmt(start));
    setEndDate(fmt(end));
  };

  const handleSearchSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      {/* 상단 통합 자산 박스 */}
      <div className="border border-gray-300 bg-white shadow-xs mb-8">
        <div className="grid grid-cols-4 border-b border-gray-200">
          {ASSET_TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const hasRightBorder = (idx + 1) % 4 !== 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-7 px-5 flex items-center justify-center gap-4 transition-all cursor-pointer select-none
                  ${isActive ? "bg-[#2E313D] text-white" : "bg-white text-gray-700 hover:bg-gray-50/80"}
                  ${hasRightBorder ? "border-r border-gray-200" : ""}
                `}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                  ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  <tab.icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="leading-tight text-center">
                  <p
                    className={`text-xs font-bold ${isActive ? "text-gray-300" : "text-gray-700"} mb-1`}
                  >
                    {tab.title}
                  </p>
                  <p
                    className={`text-sm ${isActive ? "text-white" : "text-gray-950"} font-bold`}
                  >
                    {tab.value}
                    <span className="text-xs font-normal ml-0.5">
                      {tab.unit}
                    </span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 잔액 요약 */}
        <div className="bg-[#FAF8F5] p-6">
          <div className={`flex items-center text-center py-4 border-b border-gray-200 mb-6 ${activeTab === "hm-money" ? "justify-center" : "justify-around"}`}>
            <div>
              <p className={`font-bold text-gray-500 mb-2 ${activeTab === "hm-money" ? "text-sm" : "text-xs"}`}>
                사용 가능한 {tabTitle}
              </p>
              <p className={`font-black text-emerald-600 font-mono ${activeTab === "hm-money" ? "text-3xl" : "text-2xl"}`}>
                0
                <span className="text-sm font-normal text-gray-500 ml-0.5">
                  {tabUnit}
                </span>
              </p>
            </div>
            {activeTab !== "hm-money" && <div className="w-px h-10 bg-gray-300/60" />}
            {activeTab !== "hm-money" && (
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">
                  다음달 소멸 예정 {tabTitle}
                </p>
                <button
                  type="button"
                  onClick={() => setShowExpiryModal(true)}
                  className="text-[10px] text-gray-400 underline block mx-auto mb-1 hover:text-gray-600"
                >
                  소멸예정 {tabTitle} 자세히보기 +
                </button>
                <p className="text-2xl font-black text-gray-700 font-mono">
                  0
                  <span className="text-sm font-normal text-gray-500 ml-0.5">
                    {tabUnit}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end text-[11px] text-gray-400/90 leading-relaxed font-medium">
            <div className="space-y-0.5">
              {SUMMARY_NOTICES[activeTab]?.map((line, i) => (
                <p key={i}>· {line}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 bg-white border border-gray-300 text-[11px] text-gray-600 font-bold hover:bg-gray-50 transition-colors rounded-sm cursor-pointer whitespace-nowrap"
            >
              {tabTitle}
              {iranSuffix(tabTitle)}{" "}
              <span className="text-gray-400 ml-0.5">?</span>
            </button>
          </div>
        </div>
      </div>

      {/* HM머니 서브탭 */}
      {activeTab === "hm-money" && (
        <div className="grid grid-cols-2 border border-gray-300 mb-6">
          {(["history", "charge"] as const).map((sub, i) => (
            <button
              key={sub}
              type="button"
              onClick={() => setMoneySubTab(sub)}
              className={`py-3 text-sm font-bold text-center transition-colors cursor-pointer
                ${i === 0 ? "border-r border-gray-300" : ""}
                ${moneySubTab === sub ? "bg-gray-100 text-gray-900" : "bg-white text-gray-400 hover:bg-gray-50"}`}
            >
              {sub === "history" ? "HM머니 적립/사용내역" : "HM머니 충전"}
            </button>
          ))}
        </div>
      )}

      {/* 내역 섹션 */}
      {(activeTab !== "hm-money" || moneySubTab === "history") && (
        <>
          <div className="mb-4 text-base font-bold text-gray-800 pl-0.5">
            {tabTitle} 적립/사용내역
          </div>

          <form
        onSubmit={handleSearchSubmit}
        className="border border-gray-300 bg-[#FAFAFA] p-4 flex items-center gap-6 text-xs text-gray-700 mb-3"
      >
        <div className="flex items-center gap-4">
          <span className="text-gray-500 font-bold tracking-tight">
            기간검색
          </span>
          <div className="flex rounded-xs border border-gray-300 bg-white overflow-hidden">
            {[
              { label: "1주일", days: 7 },
              { label: "1개월", days: 30 },
              { label: "3개월", days: 90 },
              { label: "6개월", days: 180 },
            ].map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => handlePeriodChange(p.days)}
                className={`px-3 py-1.5 text-[11px] font-medium border-r last:border-r-0 border-gray-200 transition-colors cursor-pointer ${
                  selectedPeriod === p.days
                    ? "bg-gray-700 text-white font-bold"
                    : "text-gray-600 hover:bg-gray-50 bg-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setSelectedPeriod(0);
            }}
            className="border border-gray-300 px-2 py-1.5 w-28 text-center text-xs text-gray-700 bg-white focus:outline-none"
          />
          <span className="text-gray-400 font-normal">~</span>
          <input
            type="text"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setSelectedPeriod(0);
            }}
            className="border border-gray-300 px-2 py-1.5 w-28 text-center text-xs text-gray-700 bg-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-1.5 bg-[#757575] hover:bg-gray-800 text-white text-xs font-medium transition-colors cursor-pointer rounded-xs"
        >
          검색 &gt;
        </button>
      </form>

      <div className="flex justify-end mb-2.5">
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 font-medium focus:outline-none min-w-[100px]"
        >
          <option value="">전체내역</option>
          <option value="Y">적립내역</option>
          <option value="N">사용내역</option>
        </select>
      </div>

      <div className="border-t border-b border-gray-300 mb-5">
        <table className="w-full text-xs border-collapse">
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200 bg-white">
              <th className="py-3 px-2 text-center font-bold text-gray-700">
                날짜
              </th>
              <th className="py-3 px-4 text-center font-bold text-gray-700">
                사용내역
              </th>
              <th className="py-3 px-2 text-center font-bold text-gray-700">
                적립포인트
              </th>
              <th className="py-3 px-2 text-center font-bold text-gray-700">
                사용/소멸 포인트
              </th>
              <th className="py-3 px-2 text-center font-bold text-gray-700">
                유효기간
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={5}
                className="py-14 text-center text-gray-500 font-medium bg-white"
              >
                내역이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 text-xs text-gray-400 font-medium mb-8">
        <span className="text-gray-900 font-bold underline cursor-pointer">
          1
        </span>
        <span className="text-gray-300 font-normal">|</span>
        <span className="text-gray-500 hover:text-gray-900 cursor-pointer font-mono font-bold">
          »
        </span>
        <span className="hover:text-gray-900 cursor-pointer">1</span>
      </div>
        </>
      )}

      {/* 충전 섹션 */}
      {activeTab === "hm-money" && moneySubTab === "charge" && (
        <div className="mb-8">
          <table className="w-full text-xs border-collapse border border-gray-300">
            <tbody>
              {/* 충전금액 */}
              <tr className="border-b border-gray-300">
                <td className="w-24 py-5 px-4 bg-gray-50 font-bold text-gray-700 text-center align-top border-r border-gray-300">
                  충전금액
                </td>
                <td className="py-5 px-5">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={chargeAmount}
                      onChange={(e) => { setChargeAmount(e.target.value); setSelectedPreset(null); }}
                      className="border border-gray-300 px-2 py-1.5 w-28 text-right text-xs text-gray-700 bg-white focus:outline-none focus:border-gray-500"
                    />
                    <span className="text-gray-600">원</span>
                    <label className="flex items-center gap-1 text-gray-500 ml-1">
                      <input type="radio" checked readOnly className="accent-gray-600" />
                      직접입력
                    </label>
                    <span className="text-gray-400">(최소입력단위 1,000원)</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1000, 3000, 5000, 10000, 50000, 100000, 150000, 200000, 250000, 500000].map((amt) => (
                      <label key={amt} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          checked={selectedPreset === amt}
                          onChange={() => { setSelectedPreset(amt); setChargeAmount(String(amt)); }}
                          className="accent-gray-600"
                        />
                        <span className="text-gray-700">{amt.toLocaleString()}원</span>
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="border border-t-0 border-gray-300 px-5 py-4 text-xs text-gray-700">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAgreed}
                onChange={(e) => setEmailAgreed(e.target.checked)}
                className="mt-0.5 accent-gray-600"
              />
              <span>
                <span className="font-bold">(선택) 본 결제 건에 대한 상품 이용 약관을 이메일로 받겠습니다.</span>
                <br />
                <span className="text-gray-400">(회원정보상의 이메일로 전송됩니다.)</span>
              </span>
            </label>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => { setChargeAmount("1000"); setSelectedPreset(null); setEmailAgreed(false); }}
              className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              새로고침 &gt;
            </button>
            <button
              type="button"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              결제하기 &gt;
            </button>
          </div>
        </div>
      )}

      <CouponPointModal
        tabId={activeTab}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <ExpiryDetailModal
        tabId={activeTab}
        tabTitle={tabTitle}
        isOpen={showExpiryModal}
        onClose={() => setShowExpiryModal(false)}
      />

      {/* 유의사항 */}
      {NOTICE_CONFIGS[activeTab] && (
        <div className="border border-gray-200 bg-[#F9F9F9] p-5 space-y-3.5 text-[11px] text-gray-500 font-medium rounded-xs">
          {[
            { sign: "+", item: NOTICE_CONFIGS[activeTab].plus },
            { sign: "-", item: NOTICE_CONFIGS[activeTab].minus },
          ].map(({ sign, item }) => (
            <div key={sign} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-gray-500 font-bold flex-shrink-0 mt-0.5">
                {sign}
              </div>
              <p className="leading-tight">
                <span className="font-bold text-gray-700">{item.label} : </span>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
