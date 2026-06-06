import { useState } from "react";
// 1. 사용할 세련된 아이콘들 및 타입 임포트
import {
  GraduationCap,
  RefreshCw,
  BookOpen,
  Wallet,
  Ticket,
  FileText,
  type LucideIcon,
} from "lucide-react";
import MyPageSidebar from "./components/MyPageSidebar";

// 엄격한 타입 정의
type TabType =
  | "hm-point"
  | "payback"
  | "book-point"
  | "hm-money"
  | "hm-coupon"
  | "jocbo";

// iconLetter string 타입을 LucideIcon 타입으로 변경
interface AssetTab {
  id: TabType;
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
}

interface HistoryItem {
  id: number;
  date: string;
  description: string;
  earned: number;
  used: number;
  expiryDate: string;
  type: "earn" | "use";
}

const DUMMY_HISTORY: HistoryItem[] = []; // 내역이 없는 기본 상태 시뮬레이션

export default function CouponPointPage() {
  const [activeSection, setActiveSection] =
    useState<string>("쿠폰/포인트 관리");
  const [activeTab, setActiveTab] = useState<TabType>("hm-point");

  // 검색 필터 상태 관리
  const [startDate, setStartDate] = useState<string>("2026-05-30");
  const [endDate, setEndDate] = useState<string>("2026-06-06");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [sortType, setSortType] = useState<string>("");

  // 2. 각 탭에 매칭되는 Lucide 아이콘 할당
  const ASSET_TABS: AssetTab[] = [
    {
      id: "hm-point",
      title: "스터디포인트",
      value: "0",
      unit: "p",
      icon: GraduationCap,
    },
    {
      id: "payback",
      title: "PayBack 포인트",
      value: "0",
      unit: "p",
      icon: RefreshCw,
    },
    {
      id: "book-point",
      title: "북포인트",
      value: "0",
      unit: "p",
      icon: BookOpen,
    },
    {
      id: "hm-money",
      title: "이투스머니",
      value: "0",
      unit: "원",
      icon: Wallet,
    },
    {
      id: "hm-coupon",
      title: "이투스 할인권",
      value: "1",
      unit: "장",
      icon: Ticket,
    },
    {
      id: "jocbo",
      title: "족보 이용권",
      value: "0",
      unit: "장",
      icon: FileText,
    },
  ];

  const currentTabTitle =
    ASSET_TABS.find((t) => t.id === activeTab)?.title ?? "포인트";

  const handlePeriodChange = (days: number) => {
    setSelectedPeriod(days);
    const targetEndDate = new Date(2026, 5, 6);
    const targetStartDate = new Date(2026, 5, 6);
    targetStartDate.setDate(targetStartDate.getDate() - days);

    const format = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const r = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${r}`;
    };

    setStartDate(format(targetStartDate));
    setEndDate(format(targetEndDate));
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 min-w-0">
            {/* 타이틀 헤더 */}
            <div className="mb-6 flex flex-col gap-1.5">
              <h2 className="text-xl font-bold text-gray-950">
                쿠폰/포인트 관리
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                쿠폰 및 포인트는 헤르메스 일반강좌/서점상품 구매 시 할인수단으로
                사용할 수 있는 포인트, 할인권 및 충전해서 사용하는 HM머니의
                현황을 볼 수 있는 곳입니다.
              </p>
            </div>

            {/* 상단 통합 자산 박스 영역 */}
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
                      className={`p-5 flex items-center justify-center gap-4 text-left transition-all cursor-pointer relative select-none
                        ${isActive ? "bg-[#2E313D] text-white" : "bg-white text-gray-700 hover:bg-gray-50/80"}
                        ${hasRightBorder ? "border-r border-gray-200" : ""}
                        ${idx >= 4 ? "border-t border-gray-200" : ""}
                      `}
                    >
                      {/* 3. Lucide 아이콘 적용 영역 (선 두께 stroke-[2.2]로 고급스럽게 조정) */}
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
                <div className="border-t border-r border-gray-200 bg-white"></div>
                <div className="border-t border-gray-200 bg-white"></div>
              </div>

              {/* 사용가능 포인트 베이지 테마 랩퍼 */}
              <div className="bg-[#FAF8F5] p-6 border-t-0">
                <div className="flex justify-around items-center text-center py-4 border-b border-gray-200 mb-6">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-2">
                      사용 가능한 {currentTabTitle}
                    </p>
                    <p className="text-2xl font-black text-emerald-600 font-mono">
                      0
                      <span className="text-sm font-normal text-gray-500 ml-0.5">
                        p
                      </span>
                    </p>
                  </div>
                  <div className="w-px h-10 bg-gray-300/60"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">
                      다음달 소멸 예정 {currentTabTitle}
                    </p>
                    <button
                      type="button"
                      className="text-[10px] text-gray-400 underline block mx-auto mb-1 hover:text-gray-600"
                    >
                      소멸예정 포인트 자세히보기 +
                    </button>
                    <p className="text-2xl font-black text-gray-700 font-mono">
                      0
                      <span className="text-sm font-normal text-gray-500 ml-0.5">
                        p
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end text-[11px] text-gray-400/90 leading-relaxed font-medium">
                  <div className="space-y-0.5">
                    <p>
                      · 소멸 예정 {currentTabTitle}는 다음 달에 유효기간이
                      만료되는 포인트의 총합이며, 소멸은 일단위로 진행됩니다.
                    </p>
                    <p>
                      · {currentTabTitle}는 적립일로부터 1년간 이용이 유효하며,
                      1년 후 잔여 포인트는 자동 소멸됩니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-white border border-gray-300 text-[11px] text-gray-600 font-bold hover:bg-gray-50 transition-colors rounded-sm cursor-pointer whitespace-nowrap"
                  >
                    {currentTabTitle}란{" "}
                    <span className="text-gray-400 ml-0.5">?</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── 하단 내역 섹션 ── */}
            <div className="mb-4 text-base font-bold text-gray-800 pl-0.5">
              {currentTabTitle} 적립/사용내역
            </div>

            {/* 상단 내역 필터 박스 */}
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
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setSelectedPeriod(0);
                    }}
                    className="border border-gray-300 px-2 py-1.5 w-28 text-center text-xs text-gray-700 bg-white focus:outline-none"
                  />
                </div>
                <span className="text-gray-400 font-normal">~</span>
                <div className="relative flex items-center">
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
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 bg-[#757575] hover:bg-gray-800 text-white text-xs font-medium transition-colors cursor-pointer rounded-xs"
              >
                검색 &gt;
              </button>
            </form>

            {/* 정렬 셀렉트 박스 */}
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

            {/* 내역 리스트 테이블 */}
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
                  {DUMMY_HISTORY.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-14 text-center text-gray-500 font-medium bg-white"
                      >
                        내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    <tr></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
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

            {/* 유의사항 가이드 박스 */}
            <div className="border border-gray-200 bg-[#F9F9F9] p-5 space-y-3.5 text-[11px] text-gray-500 font-medium rounded-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-gray-500 font-bold flex-shrink-0 mt-0.5">
                  +
                </div>
                <p className="leading-tight">
                  <span className="font-bold text-gray-700">
                    {currentTabTitle} 적립 :
                  </span>{" "}
                  {currentTabTitle}는 컨텐츠 구매 및 이벤트 참여 참여시 적립
                  됩니다.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-gray-500 font-bold flex-shrink-0 mt-0.5">
                  -
                </div>
                <p className="leading-tight">
                  <span className="font-bold text-gray-700">
                    {currentTabTitle} 사용 :
                  </span>{" "}
                  {currentTabTitle}는 이투스 컨텐츠 이용 시 포인트 만큼 할인된
                  가격에 구매하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
