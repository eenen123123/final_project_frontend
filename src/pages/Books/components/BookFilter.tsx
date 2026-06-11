import { useEffect, useState } from "react";
import api from "../../../api/api";

interface SubjectClassification {
  subjClId: number;
  subjClNm: string;
}

interface Subject {
  subjId: number;
  subjNm: string;
}

interface Props {
  selectedSubjClId: number | null;
  selectedSubjId: number | null;
  onSubjClChange: (id: number | null) => void;
  onSubjChange: (id: number | null) => void;
}

const Pill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-xs px-3.5 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap
      ${
        active
          ? "bg-slate-800 text-white border-slate-800 font-medium"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
      }`}
  >
    {label}
  </button>
);

export default function BookFilter({
  selectedSubjClId,
  selectedSubjId,
  onSubjClChange,
  onSubjChange,
}: Props) {
  const [categories, setCategories] = useState<SubjectClassification[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    api
      .get("/api/course/list/subject-classification")
      .then((res) => setCategories(res.data))
      .catch((e) => console.error("과목 대분류 조회 실패", e));
  }, []);

  useEffect(() => {
    if (selectedSubjClId === null) return;
    api
      .get("/api/textbook/subjects", { params: { subjClId: selectedSubjClId } })
      .then((res) => setSubjects(res.data))
      .catch((e) => console.error("소분류 조회 실패", e));
  }, [selectedSubjClId]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full border-collapse text-left">
        <tbody>
          {/* 대분류 */}
          <tr className="border-b border-gray-100">
            <th className="w-24 sm:w-28 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 uppercase tracking-wider text-center select-none">
              과목
            </th>
            <td className="px-4 py-3.5">
              <div className="flex gap-1.5 flex-wrap">
                <Pill
                  label="전체"
                  active={selectedSubjClId === null}
                  onClick={() => onSubjClChange(null)}
                />
                {categories.map((c) => (
                  <Pill
                    key={c.subjClId}
                    label={c.subjClNm}
                    active={selectedSubjClId === c.subjClId}
                    onClick={() => onSubjClChange(c.subjClId)}
                  />
                ))}
              </div>
            </td>
          </tr>

          {/* 소분류 */}
          <tr>
            <th className="w-24 sm:w-28 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 uppercase tracking-wider text-center select-none">
              세부과목
            </th>
            <td className="px-4 py-3.5">
              {!selectedSubjClId ? (
                <span className="text-xs text-gray-400">
                  과목을 먼저 선택해주세요.
                </span>
              ) : subjects.length === 0 ? (
                <span className="text-xs text-gray-400">
                  등록된 세부과목이 없습니다.
                </span>
              ) : (
                <div className="flex gap-1.5 flex-wrap">
                  <Pill
                    label="전체"
                    active={selectedSubjId === null}
                    onClick={() => onSubjChange(null)}
                  />
                  {subjects.map((s) => (
                    <Pill
                      key={s.subjId}
                      label={s.subjNm}
                      active={selectedSubjId === s.subjId}
                      onClick={() => onSubjChange(s.subjId)}
                    />
                  ))}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
