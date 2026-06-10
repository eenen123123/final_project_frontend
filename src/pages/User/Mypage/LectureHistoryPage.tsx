import { useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";

type TabType = "normal" | "free";
type SortType = "recent" | "order";

// 수강이력 목록의 강좌 항목 (진도율·만료일 포함)
interface Lecture {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  progress: number;
  totalCount: number;
  currentCount: number;
  expireDate: string;
  thumbBg: string;
  thumbLabel: string;
  type: TabType;
}

const DUMMY_LECTURES: Lecture[] = [
  {
    id: "1",
    title: "[박국어] 국어 독해 심화 완성",
    teacher: "박국어 선생님",
    subject: "국어",
    progress: 100,
    totalCount: 15,
    currentCount: 15,
    expireDate: "2026.05.01",
    thumbBg: "#B45309",
    thumbLabel: "국어\n독해",
    type: "normal",
  },
  {
    id: "2",
    title: "[최과학] 생명과학 I 완성",
    teacher: "최과학 선생님",
    subject: "과학탐구",
    progress: 78,
    totalCount: 18,
    currentCount: 14,
    expireDate: "2026.04.01",
    thumbBg: "#065F46",
    thumbLabel: "생명\n과학",
    type: "normal",
  },
  {
    id: "3",
    title: "[김영어] 수능영어 단기완성",
    teacher: "김영어 선생님",
    subject: "영어",
    progress: 55,
    totalCount: 10,
    currentCount: 6,
    expireDate: "2026.03.15",
    thumbBg: "#374151",
    thumbLabel: "영어\n단기",
    type: "normal",
  },
  {
    id: "4",
    title: "[이수학] OT 맛보기 강좌",
    teacher: "이수학 선생님",
    subject: "수학",
    progress: 100,
    totalCount: 3,
    currentCount: 3,
    expireDate: "2026.02.28",
    thumbBg: "#065F46",
    thumbLabel: "수학\nOT",
    type: "free",
  },
  {
    id: "5",
    title: "[임정환] 사회문화 무료특강",
    teacher: "임정환 선생님",
    subject: "사회탐구",
    progress: 100,
    totalCount: 5,
    currentCount: 5,
    expireDate: "2026.01.31",
    thumbBg: "#1E3A8A",
    thumbLabel: "사회\n무료",
    type: "free",
  },
];

const SORT_LABELS: { key: SortType; label: string }[] = [
  { key: "recent", label: "최근 수강일순" },
  { key: "order", label: "신청일순" },
];

const GUIDE_ITEMS = [
  "수강종료 강좌의 경우 수강종료일 다음날 새벽 1시 이후 목록에서 확인 가능합니다.",
  "수강 완료(100%) 강좌는 수강종료 후에도 강좌정보 확인이 가능합니다.",
  "수강 이력은 최근 1년간의 내역만 제공됩니다.",
];

export default function LectureHistoryPage() {
  const [activeSection, setActiveSection] = useState("수강 이력 관리");
  const [activeTab, setActiveTab] = useState<TabType>("normal");
  const [sort, setSort] = useState<SortType>("recent");
  const [guideOpen, setGuideOpen] = useState(true);

  const filtered = DUMMY_LECTURES.filter((l) => l.type === activeTab);
  const tabCount = (tab: TabType) => DUMMY_LECTURES.filter((l) => l.type === tab).length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            {/* 타이틀 */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">수강 이력 관리</h3>
              <p className="text-sm text-gray-500 mt-1">수강이 종료된 강좌 목록을 확인할 수 있습니다.</p>
            </div>

            {/* 탭 */}
            <div className="flex border-b border-gray-200 mb-6 gap-2">
              {[
                { key: "normal" as TabType, label: "일반강좌" },
                { key: "free" as TabType, label: "무료강좌" },
              ].map(({ key, label }) => {
                const isSelected = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer relative top-[1px] border-b-2
                      ${
                        isSelected
                          ? "border-blue-600 text-blue-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                      }`}
                  >
                    {label}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full transition-colors
                      ${isSelected ? "bg-blue-50 text-blue-600 font-bold" : "bg-gray-100 text-gray-400"}`}
                    >
                      {tabCount(key)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 강좌 수 + 정렬 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
              <span className="text-sm text-gray-600">
                총 <b className="text-gray-900 font-semibold">{filtered.length}</b>개의 강좌
              </span>
              <div className="flex items-center gap-2">
                {SORT_LABELS.map(({ key, label }, i) => (
                  <div key={key} className="flex items-center">
                    {i > 0 && <span className="text-gray-200 text-xs mx-2">·</span>}
                    <button
                      onClick={() => setSort(key)}
                      className={`text-xs transition-all cursor-pointer font-medium
                        ${sort === key ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      {label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 강좌 목록 */}
            {filtered.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-200 mx-auto mb-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <p className="text-sm text-gray-400 font-medium">수강종료 강좌가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-5">
                {filtered.map((lecture) => {
                  const isComplete = lecture.progress === 100;
                  const barColor = isComplete ? "#22C55E" : "#9CA3AF";

                  return (
                    <div
                      key={lecture.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all border hover:shadow-md hover:border-gray-200"
                      style={{ border: "1px solid #F3F4F6" }}
                    >
                      <div className="flex items-center gap-5 p-5">
                        {/* 썸네일 (opacity 낮춰서 종료 느낌) */}
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-24 h-24 rounded-xl flex items-center justify-center shadow-inner"
                            style={{ background: lecture.thumbBg, opacity: 0.7 }}
                          >
                            <span className="text-xs font-semibold text-white text-center leading-tight whitespace-pre-line px-2">
                              {lecture.thumbLabel}
                            </span>
                          </div>
                        </div>

                        {/* 강좌 세부정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-bold text-gray-500">{lecture.subject}</p>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide"
                              style={{
                                background: isComplete ? "#F0FDF4" : "#F9FAFB",
                                color: isComplete ? "#166534" : "#6B7280",
                                border: `1px solid ${isComplete ? "#BBF7D0" : "#E5E7EB"}`,
                              }}
                            >
                              {isComplete ? "수강완료" : "기간만료"}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-gray-700 mb-1 truncate cursor-pointer hover:text-blue-600 transition-colors">
                            {lecture.title}
                          </p>
                          <p className="text-xs text-gray-400 mb-3 font-medium">{lecture.teacher}</p>

                          {/* 진도 바 (10% 눈금 포함) */}
                          <div className="relative h-3.5 bg-gray-100 rounded-full overflow-hidden mb-2 border border-gray-200/30">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${lecture.progress}%`, background: barColor }}
                            />
                            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((percent) => (
                              <div
                                key={percent}
                                className="absolute top-0 bottom-0 w-[1px] bg-white/40 pointer-events-none"
                                style={{ left: `${percent}%` }}
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">
                              {lecture.currentCount}강 / <span className="text-gray-400">{lecture.totalCount}강</span> ·{" "}
                              <b style={{ color: barColor }} className="font-semibold">
                                {lecture.progress}% 완료
                              </b>
                            </span>
                            <span className="text-xs text-gray-400">수강종료 {lecture.expireDate}</span>
                          </div>
                        </div>

                        {/* 우측 버튼 */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button className="text-xs px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                            강좌정보
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 이용안내 */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setGuideOpen((p) => !p)}
                className="w-full flex items-center gap-2 px-5 py-4 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-blue-500 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">수강 이력 관리 이용안내</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 ${guideOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: guideOpen ? "200px" : "0px" }}
              >
                <ul className="px-5 pb-5 space-y-2 border-t border-gray-50 pt-4 bg-gray-50/30">
                  {GUIDE_ITEMS.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                      <span className="text-blue-400 flex-shrink-0 mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
