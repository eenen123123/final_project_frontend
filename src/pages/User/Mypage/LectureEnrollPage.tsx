import { useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";

type TabType = "suneung" | "naesin" | "univ";
type SortType = "latest" | "popular" | "apply";

// 수강신청 목록의 강좌 항목 (유형·기간·교재 포함)
interface Lecture {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  category: string;
  type: string;
  count: number;
  period: number;
  isNew: boolean;
  isBook: boolean;
  thumbBg: string;
  thumbLabel: string;
}

const DUMMY_LECTURES: Lecture[] = [
  {
    id: "1",
    title: "[임정환] 2027 사회문화 개념완성",
    teacher: "임정환",
    subject: "사회탐구",
    category: "사탐",
    type: "개념완성",
    count: 20,
    period: 60,
    isNew: false,
    isBook: true,
    thumbBg: "#1E3A8A",
    thumbLabel: "사회\n문화",
  },
  {
    id: "2",
    title: "[정승제] 2027 수학 개념때려잡기 (수I+수II)",
    teacher: "정승제",
    subject: "수학",
    category: "수학",
    type: "문제풀이",
    count: 32,
    period: 90,
    isNew: false,
    isBook: true,
    thumbBg: "#065F46",
    thumbLabel: "수학\n완성",
  },
  {
    id: "3",
    title: "[주혜연] 2027 한줄 영어독해 기본편",
    teacher: "주혜연",
    subject: "영어",
    category: "영어",
    type: "개념완성",
    count: 25,
    period: 60,
    isNew: true,
    isBook: false,
    thumbBg: "#4B5563",
    thumbLabel: "영어\n독해",
  },
  {
    id: "4",
    title: "[박광일] 2027 훈련도감 국어독해",
    teacher: "박광일",
    subject: "국어",
    category: "국어",
    type: "개념완성",
    count: 28,
    period: 90,
    isNew: false,
    isBook: true,
    thumbBg: "#1E40AF",
    thumbLabel: "국어\n독해",
  },
  {
    id: "5",
    title: "[김준창] 2027 한국사 개념완성",
    teacher: "김준창",
    subject: "한국사",
    category: "한국사",
    type: "개념완성",
    count: 15,
    period: 60,
    isNew: false,
    isBook: false,
    thumbBg: "#7C3AED",
    thumbLabel: "한국사\n완성",
  },
  {
    id: "6",
    title: "[이승후] 2027 생명과학I GT개념",
    teacher: "이승후",
    subject: "과학탐구",
    category: "과탐",
    type: "문제풀이",
    count: 22,
    period: 90,
    isNew: true,
    isBook: true,
    thumbBg: "#B45309",
    thumbLabel: "생명\n과학",
  },
  {
    id: "7",
    title: "[강윤구] 2027 수학 개념의 공식 (미적분)",
    teacher: "강윤구",
    subject: "수학",
    category: "수학",
    type: "개념완성",
    count: 18,
    period: 60,
    isNew: false,
    isBook: true,
    thumbBg: "#0F766E",
    thumbLabel: "미적\n분",
  },
  {
    id: "8",
    title: "[이지영] 2027 사회문화 출제자의 눈",
    teacher: "이지영",
    subject: "사회탐구",
    category: "사탐",
    type: "문제풀이",
    count: 24,
    period: 90,
    isNew: false,
    isBook: false,
    thumbBg: "#9D174D",
    thumbLabel: "출제자\n의 눈",
  },
  {
    id: "9",
    title: "[안성진] 2027 지구과학I VEGA 개념",
    teacher: "안성진",
    subject: "과학탐구",
    category: "과탐",
    type: "개념완성",
    count: 20,
    period: 60,
    isNew: true,
    isBook: true,
    thumbBg: "#1D4ED8",
    thumbLabel: "지구\n과학",
  },
  {
    id: "10",
    title: "[김범구] 2027 문포독 영어독해",
    teacher: "김범구",
    subject: "영어",
    category: "영어",
    type: "문제풀이",
    count: 30,
    period: 90,
    isNew: false,
    isBook: true,
    thumbBg: "#374151",
    thumbLabel: "문포\n독",
  },
];

const TEACHERS_BY_CATEGORY: Record<string, string[]> = {
  국어: ["박광일", "김민정", "신영균"],
  수학: ["정승제", "강윤구", "이하영"],
  영어: ["주혜연", "김범구", "오채은"],
  사탐: ["이지영", "임정환", "김현수"],
  과탐: ["이승후", "안성진", "엄영대"],
  한국사: ["김준창", "한세희"],
};

const CATEGORIES = ["전체", "국어", "수학", "영어", "사탐", "과탐", "한국사"];
const TABS: { key: TabType; label: string }[] = [
  { key: "suneung", label: "수능" },
  { key: "naesin", label: "내신" },
  { key: "univ", label: "대학별고사" },
];
const SORTS: { key: SortType; label: string }[] = [
  { key: "latest", label: "최신순" },
  { key: "popular", label: "인기순" },
  { key: "apply", label: "수강신청순" },
];

const PAGE_SIZE = 6;

const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`text-xs px-3.5 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap
      ${
        active
          ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm shadow-blue-100"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
      }`}
  >
    {label}
  </button>
);

export default function LectureEnrollPage() {
  const [activeSection, setActiveSection] = useState("강좌 수강신청");
  const [activeTab, setActiveTab] = useState<TabType>("suneung");
  const [category, setCategory] = useState("전체");
  const [teacher, setTeacher] = useState("전체");
  const [sort, setSort] = useState<SortType>("latest");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [bookAlert, setBookAlert] = useState<string | null>(null);

  const teachers = category !== "전체" ? ["전체", ...(TEACHERS_BY_CATEGORY[category] ?? [])] : ["전체"];

  const filtered = DUMMY_LECTURES.filter((l) => category === "전체" || l.category === category).filter(
    (l) => teacher === "전체" || l.teacher === teacher,
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategoryChange = (c: string) => {
    setCategory(c);
    setTeacher("전체");
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleBookClick = (lecture: Lecture) => {
    if (!lecture.isBook) {
      setBookAlert(lecture.id);
      setTimeout(() => setBookAlert(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            {/* 타이틀 */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">강좌 수강신청</h3>
              <p className="text-sm text-gray-500 mt-1">원하는 강좌를 선택하고 수강신청 할 수 있습니다.</p>
            </div>

            {/* 탭 */}
            <div className="flex border-b border-gray-200 mb-6 gap-2">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    setCategory("전체");
                    setTeacher("전체");
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer relative top-[1px] border-b-2
                    ${
                      activeTab === key
                        ? "border-blue-600 text-blue-600 font-semibold"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 필터 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5 shadow-sm">
              <table className="w-full border-collapse text-left">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <th className="w-24 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 text-center select-none">
                      영역
                    </th>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {CATEGORIES.map((c) => (
                          <FilterPill
                            key={c}
                            label={c}
                            active={category === c}
                            onClick={() => handleCategoryChange(c)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="w-24 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 text-center select-none">
                      선생님
                    </th>
                    <td className="px-4 py-3.5">
                      {category === "전체" ? (
                        <span className="text-sm text-gray-300">영역을 선택해주세요.</span>
                      ) : (
                        <div className="flex gap-1.5 flex-wrap">
                          {teachers.map((t) => (
                            <FilterPill
                              key={t}
                              label={t}
                              active={teacher === t}
                              onClick={() => {
                                setTeacher(t);
                                setPage(1);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 강좌 수 + 정렬 */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-sm text-gray-600">
                강좌 수 <b className="text-gray-900 font-semibold">{filtered.length}</b>
                {selected.length > 0 && (
                  <span className="ml-2 text-blue-500 text-xs">· {selected.length}개 선택됨</span>
                )}
              </span>
              <div className="flex items-center gap-3">
                {SORTS.map(({ key, label }, i) => (
                  <span key={key} className="flex items-center gap-3">
                    {i > 0 && <span className="text-gray-200 text-xs">|</span>}
                    <button
                      onClick={() => setSort(key)}
                      className="text-xs transition-colors cursor-pointer font-medium"
                      style={{ color: sort === key ? "#3B82F6" : "#9CA3AF", fontWeight: sort === key ? 500 : 400 }}
                    >
                      {label}
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 강좌 목록 */}
            {paginated.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm mb-4">
                <p className="text-sm text-gray-400 font-medium">강좌가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-4">
                {paginated.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-4 p-5">
                      <input
                        type="checkbox"
                        checked={selected.includes(lecture.id)}
                        onChange={() => toggleSelect(lecture.id)}
                        className="flex-shrink-0 cursor-pointer w-4 h-4"
                      />
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                        style={{ background: lecture.thumbBg }}
                      >
                        <span className="text-xs font-semibold text-white text-center leading-tight whitespace-pre-line">
                          {lecture.thumbLabel}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="text-xs px-2 py-0.5 rounded font-medium"
                            style={{ background: "#EBF5FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}
                          >
                            {lecture.subject}
                          </span>
                          {lecture.isNew && (
                            <span
                              className="text-xs px-2 py-0.5 rounded font-medium"
                              style={{ background: "#FEF9C3", color: "#854F0B", border: "1px solid #FDE68A" }}
                            >
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-900 mb-0.5 truncate">{lecture.title}</p>
                        <p className="text-xs text-gray-400 font-medium">
                          {lecture.teacher} 선생님 · {lecture.count}강 · 수강기간 {lecture.period}일
                        </p>
                      </div>

                      {/* OT / 교재신청 */}
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button className="text-xs px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                          OT
                        </button>
                        {bookAlert === lecture.id ? (
                          <span className="text-xs text-gray-400 whitespace-nowrap text-center">교재가 없습니다.</span>
                        ) : (
                          <button
                            onClick={() => handleBookClick(lecture)}
                            className="text-xs px-3 py-1 border rounded-md transition-colors cursor-pointer whitespace-nowrap"
                            style={{
                              borderColor: lecture.isBook ? "#3B82F6" : "#D1D5DB",
                              color: lecture.isBook ? "#3B82F6" : "#9CA3AF",
                            }}
                          >
                            교재신청
                          </button>
                        )}
                      </div>

                      {/* 설명 */}
                      <div className="text-center flex-shrink-0" style={{ minWidth: "60px" }}>
                        <p className="text-xs text-gray-400 leading-relaxed whitespace-nowrap">수능</p>
                        <p className="text-xs text-gray-400 leading-relaxed whitespace-nowrap">({lecture.type})</p>
                      </div>

                      {/* 강좌신청 버튼 */}
                      <button
                        className="flex-shrink-0 cursor-pointer"
                        style={{ background: "none", border: "none", padding: 0 }}
                        onMouseOver={(e) => {
                          const span = e.currentTarget.querySelector("span");
                          if (span) span.style.color = "#1E40AF";
                        }}
                        onMouseOut={(e) => {
                          const span = e.currentTarget.querySelector("span");
                          if (span) span.style.color = "#3B82F6";
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#3B82F6",
                            textDecoration: "underline",
                            textUnderlineOffset: "3px",
                            transition: "color 0.15s",
                          }}
                        >
                          강좌신청 ›
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mb-5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer transition-colors text-sm"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 flex items-center justify-center border rounded text-xs font-medium transition-colors cursor-pointer"
                    style={{
                      background: page === p ? "#3B82F6" : "transparent",
                      color: page === p ? "white" : "#6B7280",
                      borderColor: page === p ? "#3B82F6" : "#E5E7EB",
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer transition-colors text-sm"
                >
                  ›
                </button>
              </div>
            )}

            {/* 일괄신청 버튼 */}
            <div className="text-center">
              <button
                disabled={selected.length === 0}
                className="px-10 py-3 text-sm font-semibold text-white rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#3B82F6" }}
                onMouseOver={(e) => {
                  if (selected.length > 0) e.currentTarget.style.background = "#2563EB";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#3B82F6";
                }}
              >
                선택한 강좌 한 번에 신청하기 ({selected.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
