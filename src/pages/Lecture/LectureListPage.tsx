import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import LectureFilterSidebar from "./components/LectureFilterSidebar";

type SortType = "latest" | "popular" | "apply";

interface Lecture {
  id: string;
  title: string;
  desc: string;
  teacher: string;
  subject: string;
  category: string;
  grade: string[];
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
    title: "[박광일] 2027 훈련도감 국어독해",
    desc: "국어 독해의 핵심을 한 번에 정리하는 강좌입니다.",
    teacher: "박광일",
    subject: "국어",
    category: "국어",
    grade: ["go3"],
    type: "개념완성",
    count: 28,
    period: 90,
    isNew: false,
    isBook: true,
    thumbBg: "#1E40AF",
    thumbLabel: "국어\n독해",
  },
  {
    id: "2",
    title: "[정승제] 2027 수학 개념때려잡기 (수I+수II)",
    desc: "수I, 수II의 핵심 개념을 완벽하게 정리합니다.",
    teacher: "정승제",
    subject: "수학",
    category: "수학",
    grade: ["go3"],
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
    desc: "한 줄 한 줄 꼼꼼하게 분석하는 영어 독해 강좌.",
    teacher: "주혜연",
    subject: "영어",
    category: "영어",
    grade: ["go3"],
    type: "개념완성",
    count: 25,
    period: 60,
    isNew: true,
    isBook: false,
    thumbBg: "#374151",
    thumbLabel: "영어\n독해",
  },
  {
    id: "4",
    title: "[임정환] 2027 사회문화 개념완성",
    desc: "사회문화의 개념을 체계적으로 정리합니다.",
    teacher: "임정환",
    subject: "사회탐구",
    category: "사탐",
    grade: ["go3"],
    type: "개념완성",
    count: 20,
    period: 60,
    isNew: false,
    isBook: true,
    thumbBg: "#1E3A8A",
    thumbLabel: "사회\n문화",
  },
  {
    id: "5",
    title: "[김준창] 2027 한국사 개념완성",
    desc: "수능 한국사 필수 개념을 빠르게 정복합니다.",
    teacher: "김준창",
    subject: "한국사",
    category: "한국사",
    grade: ["go3", "go2"],
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
    desc: "생명과학I 전체 개념을 GT 시스템으로 정리.",
    teacher: "이승후",
    subject: "과학탐구",
    category: "과탐",
    grade: ["go3"],
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
    desc: "미적분의 개념을 공식으로 완성합니다.",
    teacher: "강윤구",
    subject: "수학",
    category: "수학",
    grade: ["go3", "go2"],
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
    desc: "출제자의 관점에서 사회문화를 분석합니다.",
    teacher: "이지영",
    subject: "사회탐구",
    category: "사탐",
    grade: ["go3"],
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
    desc: "VEGA 시스템으로 지구과학I 전체를 완성.",
    teacher: "안성진",
    subject: "과학탐구",
    category: "과탐",
    grade: ["go3", "go2"],
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
    desc: "문장 포인트 독해법으로 영어를 완성합니다.",
    teacher: "김범구",
    subject: "영어",
    category: "영어",
    grade: ["go3"],
    type: "문제풀이",
    count: 30,
    period: 90,
    isNew: false,
    isBook: true,
    thumbBg: "#374151",
    thumbLabel: "문포\n독",
  },
  {
    id: "11",
    title: "[정승제] 2027 개념의 神 (고2)",
    desc: "고2 수학 개념을 완전히 정복합니다.",
    teacher: "정승제",
    subject: "수학",
    category: "수학",
    grade: ["go2"],
    type: "개념완성",
    count: 20,
    period: 60,
    isNew: false,
    isBook: true,
    thumbBg: "#065F46",
    thumbLabel: "개념\n의神",
  },
  {
    id: "12",
    title: "[김민정] 2027 단.일.비 국어",
    desc: "단어, 일관성, 비유로 국어를 완성합니다.",
    teacher: "김민정",
    subject: "국어",
    category: "국어",
    grade: ["go3", "go2"],
    type: "개념완성",
    count: 24,
    period: 90,
    isNew: false,
    isBook: true,
    thumbBg: "#1E40AF",
    thumbLabel: "단일\n비",
  },
];

const SORTS: { key: SortType; label: string }[] = [
  { key: "latest", label: "최신순" },
  { key: "popular", label: "인기순" },
  { key: "apply", label: "수강신청순" },
];

const PAGE_SIZE = 8;

export default function LectureListPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [grade, setGrade] = useState("go3");
  const [selected, setSelected] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [teacher, setTeacher] = useState("");
  const [sort, setSort] = useState<SortType>("latest");
  const [page, setPage] = useState(1);
  const [bookAlert, setBookAlert] = useState<string | null>(null);

  const handleCategoryChange = (c: string) => {
    setCategory(c);
    setTeacher("");
    setPage(1);
  };

  const handleReset = () => {
    setGrade("go3");
    setCategory("");
    setTeacher("");
    setSort("latest");
    setPage(1);
  };

  const handleRequireLogin = () => {
    alert("로그인이 필요한 서비스입니다.");
    navigate("/login");
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleBookClick = (lecture: Lecture) => {
    if (!isAuthenticated) {
      handleRequireLogin();
      return;
    }
    if (!lecture.isBook) {
      setBookAlert(lecture.id);
      setTimeout(() => setBookAlert(null), 2000);
    }
  };

  const handleBottomBarClick = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    } else {
      alert("구독권 보유 회원만 가능한 서비스입니다.");
    }
  };

  const filtered = DUMMY_LECTURES.filter((l) => l.grade.includes(grade))
    .filter((l) => !category || l.category === category)
    .filter((l) => !teacher || l.teacher === teacher);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div
      className={`min-h-screen bg-gray-50 ${selected.length > 0 ? "pb-20" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-5 items-start">
          {/* 사이드바 */}
          <LectureFilterSidebar
            grade={grade}
            category={category}
            teacher={teacher}
            onGradeChange={(g) => {
              setGrade(g);
              setPage(1);
            }}
            onCategoryChange={handleCategoryChange}
            onTeacherChange={(t) => {
              setTeacher(t);
              setPage(1);
            }}
            onReset={handleReset}
          />

          {/* 메인 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {/* 선택 중인 필터 태그 */}
            {(category || teacher) && (
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-700 mr-1">
                  선택 중인 강좌
                </span>
                <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                  {grade === "go3"
                    ? "고3·N수"
                    : grade === "go2"
                      ? "고2"
                      : "고1"}
                </span>
                {category && (
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                    {category}
                  </span>
                )}
                {teacher && (
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200 flex items-center gap-1">
                    {teacher}
                    <button
                      onClick={() => setTeacher("")}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* 정렬 + 강좌 수 */}
            <div className="flex items-center justify-between mb-3 px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">전체</span>
                <span className="text-xs font-bold text-gray-900">
                  {filtered.length}개
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[11px] text-gray-400 mr-1">
                  * 정렬 기준에 따라 리스트가 재정렬됩니다.
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-700 bg-white cursor-pointer focus:outline-none"
                >
                  {SORTS.map(({ key, label }) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 강좌 목록 */}
            {paginated.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg py-20 text-center">
                <p className="text-sm text-gray-400">
                  해당하는 강좌가 없습니다.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100 bg-white border border-gray-200 rounded-lg overflow-hidden">
                {paginated.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* 선택 체크박스 */}
                    <input
                      type="checkbox"
                      checked={selected.includes(lecture.id)}
                      onChange={() => toggleSelect(lecture.id)}
                      className="w-4 h-4 accent-gray-800 flex-shrink-0 cursor-pointer"
                    />

                    {/* 선생님명 */}
                    <div className="w-14 flex-shrink-0 text-center">
                      <span className="text-sm font-bold text-gray-800">
                        {lecture.teacher}
                      </span>
                    </div>

                    {/* 강좌 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {lecture.isNew && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-500 text-white rounded font-bold">
                            NEW
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 bg-orange-400 text-white rounded font-bold">
                          UP
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 border border-gray-300 text-gray-500 rounded font-medium">
                          {lecture.type}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5 hover:text-blue-600 cursor-pointer transition-colors truncate">
                        {lecture.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {lecture.desc}
                      </p>
                      <button className="text-[11px] text-gray-400 hover:text-blue-500 mt-0.5 cursor-pointer transition-colors">
                        자세히보기 +
                      </button>
                    </div>

                    {/* OT / 교재신청 */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button className="text-xs px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                        OT
                      </button>
                      {bookAlert === lecture.id ? (
                        <span className="text-xs text-gray-400 whitespace-nowrap text-center">
                          교재가 없습니다.
                        </span>
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

                    {/* 강좌 단계 */}
                    <div
                      className="text-center flex-shrink-0"
                      style={{ minWidth: "60px" }}
                    >
                      <p className="text-xs text-gray-400 leading-relaxed whitespace-nowrap">
                        수능
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed whitespace-nowrap">
                        ({lecture.type})
                      </p>
                    </div>

                    {/* 강좌신청 버튼 */}
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          handleRequireLogin();
                          return;
                        }
                      }}
                      className="flex-shrink-0 cursor-pointer"
                      style={{ background: "none", border: "none", padding: 0 }}
                      onMouseOver={(e) => {
                        const span = e.currentTarget.querySelector("span");
                        if (span) (span as HTMLElement).style.color = "#1E40AF";
                      }}
                      onMouseOut={(e) => {
                        const span = e.currentTarget.querySelector("span");
                        if (span) (span as HTMLElement).style.color = "#3B82F6";
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
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-sm"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center border rounded text-xs font-medium transition-colors cursor-pointer
                      ${page === p ? "bg-gray-900 text-white border-gray-900" : "text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-sm"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 선택 바 */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-94">
          <button
            onClick={handleBottomBarClick}
            className="w-full py-4.5 text-white text-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-t-2xl shadow-lg"
            style={{ background: "#172554" }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#1e3a8a";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#172554";
            }}
          >
            지금 선택한&nbsp;
            <span className="text-yellow-300 font-extrabold">
              {selected.length}개
            </span>
            &nbsp;강좌 확인하기 ›
          </button>
        </div>
      )}
    </div>
  );
}
