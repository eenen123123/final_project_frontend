interface Props {
  grade: string;
  category: string;
  teacher: string;
  onGradeChange: (grade: string) => void;
  onCategoryChange: (category: string) => void;
  onTeacherChange: (teacher: string) => void;
  onReset: () => void;
}

const GRADES = [
  { key: "go3", label: "고3·N수" },
  { key: "go2", label: "고2" },
  { key: "go1", label: "고1" },
];

const CATEGORIES = ["전체", "국어", "수학", "영어", "사탐", "과탐", "한국사"];

const TEACHERS_BY_CATEGORY: Record<string, string[]> = {
  국어: ["박광일", "김민정", "신영균"],
  수학: ["정승제", "강윤구", "이하영"],
  영어: ["주혜연", "김범구", "오채은"],
  사탐: ["이지영", "임정환", "김현수"],
  과탐: ["이승후", "안성진", "엄영대"],
  한국사: ["김준창", "한세희"],
};

export default function LectureFilterSidebar({
  grade,
  category,
  teacher,
  onGradeChange,
  onCategoryChange,
  onTeacherChange,
  onReset,
}: Props) {
  const teachers =
    category !== "전체"
      ? ["전체", ...(TEACHERS_BY_CATEGORY[category] ?? [])]
      : [];

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-20">
        {/* 헤더 */}
        <div className="px-4 py-3 bg-blue-950 text-white flex items-center justify-between">
          <span className="text-sm font-bold tracking-wide">강좌 찾기</span>
          <button
            onClick={onReset}
            className="text-[11px] text-blue-200 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            초기화
          </button>
        </div>

        {/* 학년 선택 */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-700 mb-2.5">학년 선택</p>
          <div className="flex gap-1.5 flex-wrap">
            {GRADES.map((g) => (
              <button
                key={g.key}
                onClick={() => onGradeChange(g.key)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium
                  ${
                    grade === g.key
                      ? "bg-blue-950 text-white border-blue-950"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-950 hover:text-blue-950"
                  }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* 영역 선택 */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-700 mb-2.5">영역 선택</p>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => onCategoryChange(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium
                  ${
                    category === c
                      ? "bg-blue-950 text-white border-blue-950"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-950 hover:text-blue-950"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 선생님 선택 */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-700 mb-2.5">선생님 선택</p>
          {category === "전체" || !category ? (
            <p className="text-xs text-gray-400">영역을 먼저 선택해주세요.</p>
          ) : (
            <div className="flex gap-1.5 flex-wrap">
              {teachers.map((t) => (
                <button
                  key={t}
                  onClick={() => onTeacherChange(t)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium
                    ${
                      teacher === t
                        ? "bg-blue-950 text-white border-blue-950"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-950 hover:text-blue-950"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 단계 선택 */}
        {category && category !== "전체" && (
          <div className="px-4 py-3">
            <p className="text-xs font-bold text-gray-700 mb-2.5">단계 선택</p>
            <div className="flex gap-1.5 flex-wrap">
              {["개념완성", "문제풀이", "심화완성", "기출분석"].map((step) => (
                <button
                  key={step}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:border-blue-950 hover:text-blue-950 transition-all cursor-pointer font-medium"
                >
                  {step}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
