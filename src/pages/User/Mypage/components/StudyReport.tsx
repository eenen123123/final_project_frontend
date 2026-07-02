import type { StudySubject, TeacherRank } from "../../../../types/MyPageInterface";

interface StudyReportProps {
  subjects: StudySubject[];
  teachers: TeacherRank[];
}

// SVG 레이더 차트 (6각형)
function RadarChart({ subjects }: { subjects: StudySubject[] }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 70;
  const levels = [30, 60, 90];

  // 6개 축 각도
  const angles = subjects.map((_, i) => Math.PI / 2 + (2 * Math.PI * i) / subjects.length);

  const point = (r: number, angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });

  // 배경 육각형
  const hexPath = (r: number) =>
    angles
      .map((a, i) => {
        const p = point(r, a);
        return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  // 데이터 폴리곤
  const dataPath =
    subjects
      .map((s, i) => {
        const r = (s.percent / 100) * maxR;
        const p = point(r, angles[i]);
        return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 배경 육각형 레벨 */}
      {levels.map((l) => (
        <path key={l} d={hexPath((l / 90) * maxR)} fill="none" stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {/* 축 라인 */}
      {angles.map((a, i) => {
        const p = point(maxR, a);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth="1" />;
      })}
      {/* 데이터 영역 */}
      <path d={dataPath} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
      {/* 축 레이블 */}
      {subjects.map((s, i) => {
        const p = point(maxR + 12, angles[i]);
        return (
          <text key={s.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#6b7280">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
}

export default function StudyReport({ subjects, teachers }: StudyReportProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">수강 리포트</h3>
        <span className="text-xs text-gray-400">조회 기준: 전일 ~ 30일 이전</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 영역별 학습 시간 밸런스 */}
        <div>
          <p className="text-sm font-medium text-gray-500 text-center mb-4">영역별 학습 시간 밸런스</p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <RadarChart subjects={subjects} />
            <div className="w-full sm:flex-1 sm:pt-2">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-gray-100">
                  {subjects.map((s) => (
                    <tr key={s.name}>
                      <td className="py-1.5 text-gray-600 font-medium">{s.name}</td>
                      <td className="py-1.5 text-gray-400 text-right pr-2">{s.percent}%</td>
                      <td className="py-1.5 text-gray-400 text-right">{s.minutes === null ? "?분" : `${s.minutes}분`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 선생님 집중도 */}
        <div>
          <p className="text-sm font-medium text-gray-500 text-center mb-4">선생님 집중도</p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* 1위 강사 이미지 */}
            <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
              {teachers[0]?.profileImage ? (
                <img src={teachers[0].profileImage} alt={teachers[0].label} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-300">-</span>
              )}
            </div>
            {/* 랭킹 리스트 */}
            <div className="w-full sm:flex-1 space-y-2">
              {teachers.map((t) => (
                <div key={t.rank} className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-400 w-4 shrink-0">{t.rank}</span>
                  <span className="text-sm text-gray-700 flex-1 min-w-0 truncate">{t.label}</span>
                  <span className="text-sm text-blue-400 shrink-0">{t.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
