import { useState, useEffect } from "react";
import api from "../../../api/api";

interface SubjectClassification {
  subjClId: number;
  subjClNm: string;
}

interface Instructor {
  userId: string;
  userName: string;
}

interface Props {
  grade: string;
  category: string;
  teacher: string;
  onGradeChange: (grade: string) => void;
  onCategoryChange: (category: string, subjClId: number | null) => void;
  onTeacherChange: (teacher: string) => void;
  onReset: () => void;
}

const GRADES = [
  { key: "go3", label: "고3·N수" },
  { key: "go2", label: "고2" },
  { key: "go1", label: "고1" },
];

export default function LectureFilterSidebar({
  grade,
  category,
  teacher,
  onGradeChange,
  onCategoryChange,
  onTeacherChange,
  onReset,
}: Props) {
  const [categories, setCategories] = useState<SubjectClassification[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedSubjClId, setSelectedSubjClId] = useState<number | null>(null);

  // 과목 분류 목록 API 호출
  useEffect(() => {
    api
      .get("/api/course/subject-classification")
      .then((res) => setCategories(res.data))
      .catch((e) => console.error("과목 분류 조회 실패", e));
  }, []);

  // 영역 선택 시 강사 목록 API 호출
  useEffect(() => {
    if (!selectedSubjClId) return; // null 이면 그냥 return
    api
      .get("/api/course/instructors", {
        params: { subjClId: selectedSubjClId },
      })
      .then((res) => setInstructors(res.data))
      .catch((e) => console.error("강사 목록 조회 실패", e));
  }, [selectedSubjClId]);

  const handleCategoryChange = (
    categoryNm: string,
    subjClId: number | null,
  ) => {
    setSelectedSubjClId(subjClId);
    if (!subjClId) setInstructors([]); // 전체 선택 시 강사 목록 초기화
    onCategoryChange(categoryNm, subjClId);
  };

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-20">
        {/* 헤더 */}
        <div className="px-4 py-3 bg-blue-950 text-white flex items-center justify-between">
          <span className="text-sm font-bold tracking-wide">강좌 찾기</span>
          <button
            onClick={() => {
              setSelectedSubjClId(null);
              setInstructors([]);
              onReset();
            }}
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
            <button
              onClick={() => handleCategoryChange("", null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium
                ${
                  !category
                    ? "bg-blue-950 text-white border-blue-950"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-950 hover:text-blue-950"
                }`}
            >
              전체
            </button>
            {categories.map((c) => (
              <button
                key={c.subjClId}
                onClick={() => handleCategoryChange(c.subjClNm, c.subjClId)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium
                  ${
                    category === c.subjClNm
                      ? "bg-blue-950 text-white border-blue-950"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-950 hover:text-blue-950"
                  }`}
              >
                {c.subjClNm}
              </button>
            ))}
          </div>
        </div>

        {/* 선생님 선택 */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-700 mb-2.5">선생님 선택</p>
          {!category ? (
            <p className="text-xs text-gray-400">영역을 먼저 선택해주세요.</p>
          ) : instructors.length === 0 ? (
            <p className="text-xs text-gray-400">등록된 강사가 없습니다.</p>
          ) : (
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => onTeacherChange("")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium
                  ${
                    !teacher
                      ? "bg-blue-950 text-white border-blue-950"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-950 hover:text-blue-950"
                  }`}
              >
                전체
              </button>
              {instructors.map((i) => (
                <button
                  key={i.userId}
                  onClick={() => onTeacherChange(i.userName)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium
                    ${
                      teacher === i.userName
                        ? "bg-blue-950 text-white border-blue-950"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-950 hover:text-blue-950"
                    }`}
                >
                  {i.userName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 단계 선택 */}
        {category && (
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
