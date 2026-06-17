import { useSuneungGradeCutFilter } from "./useSuneungGradeCutFilter";

const EXAM_TYPE_LABELS: Record<string, string> = {
  CSAT: "수능",
  SEPT_MOCK: "9월 모평",
  JUNE_MOCK: "6월 모평",
};

const FilterChip = ({
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
    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
      active
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

const FilterRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <tr className="border-b border-gray-100 last:border-b-0">
    <th className="w-24 sm:w-28 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 uppercase tracking-wider text-center select-none">
      {label}
    </th>
    <td className="px-4 py-3.5">
      <div className="flex gap-1.5 flex-wrap">{children}</div>
    </td>
  </tr>
);

const formatNumber = (value: number | null) =>
  value === null ? "-" : value.toLocaleString();

const formatRatio = (value: number | null) =>
  value === null ? "-" : `${value.toFixed(2)}%`;

export default function SuneungGradeCutPage() {
  const {
    years,
    selectedYear,
    setSelectedYear,
    examTypes,
    selectedExamType,
    setSelectedExamType,
    classifications,
    selectedClassification,
    selectClassification,
    subjects,
    selectedSubject,
    setSelectedSubject,
    gradeCuts,
    loading,
  } = useSuneungGradeCutFilter();

  const sortedGradeCuts = [...gradeCuts].sort((a, b) => a.grade - b.grade);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-5">
        {/* 상단 타이틀 */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            역대 등급컷
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            연도와 과목을 선택하면 등급 구분 점수와 인원 분포를 확인하실 수
            있습니다. (상대평가 영역은 표준점수, 절대평가 영역은 원점수 기준)
          </p>
        </div>

        {/* 필터 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse text-left">
            <tbody>
              <FilterRow label="연도">
                {years.map((year) => (
                  <FilterChip
                    key={year}
                    label={`${year}`}
                    active={selectedYear === year}
                    onClick={() => setSelectedYear(year)}
                  />
                ))}
              </FilterRow>

              <FilterRow label="시험">
                {examTypes.map((examType) => (
                  <FilterChip
                    key={examType}
                    label={EXAM_TYPE_LABELS[examType] ?? examType}
                    active={selectedExamType === examType}
                    onClick={() => setSelectedExamType(examType)}
                  />
                ))}
              </FilterRow>

              <FilterRow label="과목">
                {classifications.map((classification) => (
                  <FilterChip
                    key={classification}
                    label={classification}
                    active={selectedClassification === classification}
                    onClick={() => selectClassification(classification)}
                  />
                ))}
              </FilterRow>

              <FilterRow label="세부과목">
                {subjects.map((subject) => (
                  <FilterChip
                    key={subject}
                    label={subject}
                    active={selectedSubject === subject}
                    onClick={() => setSelectedSubject(subject)}
                  />
                ))}
              </FilterRow>
            </tbody>
          </table>
        </div>

        {/* 등급컷 표 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xl text-gray-600">
              {selectedYear && (
                <>
                  <b className="text-gray-900 font-semibold mr-1">
                    {selectedYear}
                  </b>
                  학년도{" "}
                  {selectedExamType
                    ? (EXAM_TYPE_LABELS[selectedExamType] ?? selectedExamType)
                    : ""}{" "}
                  <span className="text-gray-900 font-semibold">
                    {selectedSubject}
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-sm [&_th]:border [&_th]:border-gray-200 [&_td]:border [&_td]:border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-4 py-3 text-center font-bold">등급</th>
                  <th className="px-4 py-3 text-right font-bold">
                    등급 구분 점수
                  </th>
                  <th className="px-4 py-3 text-right font-bold">인원(명)</th>
                  <th className="px-4 py-3 text-right font-bold">비율</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-gray-400"
                    >
                      불러오는 중...
                    </td>
                  </tr>
                ) : sortedGradeCuts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-gray-400"
                    >
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  sortedGradeCuts.map((row) => (
                    <tr
                      key={row.id}
                      className="odd:bg-white even:bg-gray-50/50 hover:bg-blue-50/40 text-sm"
                    >
                      <td className="px-4 py-3 text-center font-medium text-gray-900">
                        {row.grade}등급
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-900">
                        {formatNumber(row.cutScore)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                        {formatNumber(row.people)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                        {formatRatio(row.ratio)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
