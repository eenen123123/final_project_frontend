import { useState } from 'react';

type GradeTab = '고3/N수' | '고2' | '고1';

const SUBJECTS = ['국어', '수학', '영어', '사회', '과학', '한국사', '제2외국어'];
const MONTHS   = ['12월','1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월'];

const LEGEND = [
  { label: '기본개념',       color: 'bg-rose-200' },
  { label: '개념완성',       color: 'bg-orange-200' },
  { label: '실력완성',       color: 'bg-yellow-300' },
  { label: '문제풀이',       color: 'bg-green-200' },
  { label: '파이널/모의고사', color: 'bg-purple-200' },
  { label: 'EBS',           color: 'bg-blue-300' },
  { label: '기출분석/특강',  color: 'bg-sky-200' },
  { label: '내신',           color: 'bg-teal-200' },
];

const TEACHERS_BY_SUBJECT: Record<string, {
  name: string; desc: string; curriculum: string;
  bars: { grade: GradeTab; label: string; color: string; col: number; span: number; row: number }[];
}[]> = {
  국어: [
    {
      name: '박상호', desc: '국어 (문학)', curriculum: '개념부터 실전까지 체계적인 국어 커리큘럼',
      bars: [
        { grade: '고3/N수', label: '봄봄: 문학 기초', color: 'bg-rose-200',   col: 1, span: 3, row: 0 },
        { grade: '고3/N수', label: '여름: 기출 분석', color: 'bg-yellow-300', col: 4, span: 4, row: 0 },
        { grade: '고3/N수', label: 'FINAL 완성',     color: 'bg-purple-200', col: 9, span: 3, row: 0 },
        { grade: '고3/N수', label: '독서 강화',       color: 'bg-sky-200',   col: 2, span: 6, row: 1 },
        { grade: '고2',     label: '개념 기초',       color: 'bg-rose-200',   col: 0, span: 4, row: 0 },
        { grade: '고2',     label: '심화 완성',       color: 'bg-orange-200', col: 4, span: 5, row: 0 },
        { grade: '고1',     label: '입문 개념',       color: 'bg-teal-200',   col: 0, span: 6, row: 0 },
      ],
    },
    {
      name: '임정환', desc: '사회문화 (설명)', curriculum: '사회문화 전 영역 압축 커리큘럼',
      bars: [
        { grade: '고3/N수', label: '사문 A: 개념완성', color: 'bg-rose-200',   col: 0, span: 3, row: 0 },
        { grade: '고3/N수', label: '사문 B: 기출분석', color: 'bg-yellow-300', col: 3, span: 4, row: 0 },
        { grade: '고3/N수', label: 'FINAL',           color: 'bg-purple-200', col: 8, span: 4, row: 0 },
      ],
    },
    {
      name: '김국어', desc: '국어 (독서)', curriculum: '비문학 독해 완성 커리큘럼',
      bars: [
        { grade: '고3/N수', label: '독해 기초',  color: 'bg-rose-200',   col: 1, span: 2, row: 0 },
        { grade: '고3/N수', label: '유형별 독해', color: 'bg-orange-200', col: 3, span: 4, row: 0 },
        { grade: '고3/N수', label: '실전 모의',  color: 'bg-green-200',  col: 7, span: 3, row: 0 },
      ],
    },
  ],
  수학: [
    {
      name: '이지은', desc: '수학 (수1·수2)', curriculum: '수능 수학 개념+기출 완성',
      bars: [
        { grade: '고3/N수', label: '수1 개념완성', color: 'bg-rose-200',   col: 0, span: 3, row: 0 },
        { grade: '고3/N수', label: '수2 개념완성', color: 'bg-orange-200', col: 3, span: 3, row: 0 },
        { grade: '고3/N수', label: '기출 완성',   color: 'bg-yellow-300', col: 6, span: 3, row: 0 },
        { grade: '고3/N수', label: 'FINAL',       color: 'bg-purple-200', col: 9, span: 3, row: 0 },
      ],
    },

    {
      name: '이도현', desc: '수학 (미적분)', curriculum: '미적분 심화 완성',
      bars: [
        { grade: '고3/N수', label: '미적분 개념',  color: 'bg-rose-200',  col: 1, span: 4, row: 0 },
        { grade: '고3/N수', label: '실전 문제풀이', color: 'bg-green-200', col: 5, span: 5, row: 0 },
      ],
    },

    {
      name: '정유진', desc: '수학 (내신)', curriculum: '개념 이해부터 실전',
      bars: [
        { grade: '고3/N수', label: '봄봄: 문학 기초', color: 'bg-rose-200',   col: 1, span: 3, row: 0 },
        { grade: '고3/N수', label: '여름: 기출 분석', color: 'bg-yellow-300', col: 4, span: 4, row: 0 },
        { grade: '고3/N수', label: 'FINAL 완성',     color: 'bg-purple-200', col: 9, span: 3, row: 0 },
        { grade: '고3/N수', label: '내신 강화',       color: 'bg-sky-200',   col: 2, span: 6, row: 1 },
        { grade: '고2',     label: '개념 기초',       color: 'bg-rose-200',   col: 0, span: 4, row: 0 },
        { grade: '고2',     label: '심화 완성',       color: 'bg-orange-200', col: 4, span: 5, row: 0 },
        { grade: '고1',     label: '입문 개념',       color: 'bg-teal-200',   col: 0, span: 6, row: 0 },
      ],
    },
  ],

  영어: [
    {
      name: '최영어', desc: '영어 (독해)', curriculum: '영어 독해 유형별 전략 커리큘럼',
      bars: [
        { grade: '고3/N수', label: '유형별 전략', color: 'bg-rose-200',   col: 0, span: 4, row: 0 },
        { grade: '고3/N수', label: '수능 기출',  color: 'bg-yellow-300', col: 4, span: 4, row: 0 },
        { grade: '고3/N수', label: 'EBS 연계',   color: 'bg-blue-300',   col: 8, span: 3, row: 0 },
      ],
    },
  ],
  사회: [
    {
      name: '임정환', desc: '사회문화 (설명)', curriculum: '사회탐구 전 영역 커리큘럼',
      bars: [
        { grade: '고3/N수', label: '사문 개념완성', color: 'bg-rose-200',   col: 0, span: 3, row: 0 },
        { grade: '고3/N수', label: '기출 분석',    color: 'bg-yellow-300', col: 3, span: 5, row: 0 },
        { grade: '고3/N수', label: 'FINAL',        color: 'bg-purple-200', col: 8, span: 4, row: 0 },
      ],
    },
  ],
  과학: [
    {
      name: '김물리', desc: '물리학I', curriculum: '물리학 개념+실전 커리큘럼',
      bars: [
        { grade: '고3/N수', label: '물리 개념', color: 'bg-rose-200',   col: 0, span: 4, row: 0 },
        { grade: '고3/N수', label: '기출 완성', color: 'bg-yellow-300', col: 4, span: 4, row: 0 },
        { grade: '고3/N수', label: 'FINAL',    color: 'bg-purple-200', col: 8, span: 4, row: 0 },
      ],
    },
  ],
  한국사: [
    {
      name: '권한국', desc: '한국사', curriculum: '한국사 개념+기출 완성 커리큘럼',
      bars: [
        { grade: '고3/N수', label: '개념완성', color: 'bg-rose-200',   col: 0, span: 5, row: 0 },
        { grade: '고3/N수', label: '기출 분석', color: 'bg-yellow-300', col: 5, span: 4, row: 0 },
        { grade: '고3/N수', label: 'FINAL',   color: 'bg-purple-200', col: 9, span: 3, row: 0 },
      ],
    },
  ],
  제2외국어: [
    {
      name: '지은경', desc: '아랍어', curriculum: '아랍어 개념 완성',
      bars: [
        { grade: '고3/N수', label: '아랍어 개념', color: 'bg-rose-200',   col: 0, span: 6, row: 0 },
        { grade: '고3/N수', label: '실전 완성',  color: 'bg-yellow-300', col: 6, span: 5, row: 0 },
      ],
    },
  ],
};

export default function CurriculumTab() {
  const [activeSubject, setActiveSubject] = useState('국어');
  const [activeTeacher, setActiveTeacher] = useState(TEACHERS_BY_SUBJECT['국어'][0].name);
  const [activeGrade, setActiveGrade]     = useState<GradeTab>('고3/N수');

  const teachers = TEACHERS_BY_SUBJECT[activeSubject] ?? [];
  const teacher  = teachers.find((t) => t.name === activeTeacher) ?? teachers[0];

  const filteredBars = teacher?.bars.filter((b) => b.grade === activeGrade) ?? [];
  const maxRow = filteredBars.reduce((m, b) => Math.max(m, b.row), 0);
  const rowNums = Array.from({ length: maxRow + 1 }, (_, i) => i);

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
    setActiveTeacher(TEACHERS_BY_SUBJECT[subject]?.[0]?.name ?? '');
  };

  return (
    <div>
      {/* 과목 탭 */}
      <div className="flex items-center justify-between border-b border-gray-200 mb-3">
        <div className="flex">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => handleSubjectChange(s)}
              className={`px-3 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                activeSubject === s
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="text-[11px] text-gray-400 hover:text-blue-500 transition-colors pb-1">
          전체 커리큘럼 한 번에 보기 &gt;
        </button>
      </div>

      {/* 강사 목록 */}
      <div className="flex items-center gap-4 mb-3">
        {teachers.map((t) => (
          <button
            key={t.name}
            onClick={() => setActiveTeacher(t.name)}
            className={`text-xs font-semibold transition-colors pb-0.5 ${
              activeTeacher === t.name
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* 강사 카드 — 콤팩트 */}
      {teacher && (
        <div className="flex items-center border border-gray-900 rounded-lg overflow-hidden mb-3">
          <div className="flex items-center gap-3 px-4 py-2.5 border-r border-gray-900 bg-gray-50 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-400 text-[10px]">
              사진
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">
                {activeSubject} {teacher.name} 선생님
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{teacher.desc}</p>
            </div>
            <button className="text-[10px] border border-gray-400 rounded-full px-2 py-0.5 text-gray-500 hover:border-gray-700 transition-colors ml-2 flex items-center gap-1 whitespace-nowrap">
              영상커리큘럼 ▶
            </button>
          </div>
          <div className="flex-1 px-5 py-2.5">
            <p className="text-sm font-extrabold text-gray-900">{teacher.curriculum}</p>
          </div>
        </div>
      )}

      {/* 학년 탭 + 범례 — 한 줄에 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex border border-gray-900 rounded overflow-hidden">
          {(['고3/N수', '고2', '고1'] as GradeTab[]).map((g) => (
            <button
              key={g}
              onClick={() => setActiveGrade(g)}
              className={`px-4 py-1 text-xs font-semibold transition-colors border-r border-gray-900 last:border-r-0 ${
                activeGrade === g ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {LEGEND.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${color}`} />
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 간트 차트 */}
      <div className="border border-gray-900 rounded-lg overflow-hidden text-xs">
        {/* 월 헤더 */}
        <div className="grid bg-gray-100 border-b border-gray-900" style={{ gridTemplateColumns: '64px repeat(12, 1fr)' }}>
          <div className="border-r border-gray-900 px-2 py-1.5 text-[10px] text-gray-400 font-medium" />
          {MONTHS.map((m) => (
            <div key={m} className="px-1 py-1.5 text-center text-[10px] font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">
              {m}
            </div>
          ))}
        </div>

        {/* 데이터 행 */}
        <div className="divide-y divide-gray-200">
          {filteredBars.length > 0 ? rowNums.map((rowIdx) => {
            const rowBars = filteredBars.filter((b) => b.row === rowIdx);

            // 빈칸 + bar 세그먼트를 col 순서대로 명시적으로 구성
            const segments: { type: 'empty' | 'bar'; span: number; bar?: typeof rowBars[0] }[] = [];
            let cursor = 0;
            const sorted = [...rowBars].sort((a, b) => a.col - b.col);
            for (const bar of sorted) {
              if (bar.col > cursor) segments.push({ type: 'empty', span: bar.col - cursor });
              segments.push({ type: 'bar', span: bar.span, bar });
              cursor = bar.col + bar.span;
            }
            if (cursor < 12) segments.push({ type: 'empty', span: 12 - cursor });

            return (
              <div
                key={rowIdx}
                className="grid items-center"
                style={{ gridTemplateColumns: '64px repeat(12, 1fr)', minHeight: '32px' }}
              >
                {/* 강사명 (첫 행만) */}
                <div className="px-2 py-1 text-[10px] font-bold text-gray-700 border-r border-gray-900 self-stretch flex items-center bg-gray-50">
                  {rowIdx === 0 ? teacher?.name : ''}
                </div>
                {/* 세그먼트 렌더링 */}
                {segments.map((seg, si) =>
                  seg.type === 'bar' && seg.bar ? (
                    <div
                      key={si}
                      className={`${seg.bar.color} border border-gray-400/40 rounded px-1.5 py-1 text-[10px] font-medium text-gray-800 truncate mx-0.5 my-0.5`}
                      style={{ gridColumn: `span ${seg.span}` }}
                    >
                      {seg.bar.label}
                    </div>
                  ) : (
                    <div
                      key={si}
                      className="h-full border-r border-gray-100 last:border-r-0"
                      style={{ gridColumn: `span ${seg.span}` }}
                    />
                  )
                )}
              </div>
            );
          }) : (
            <div className="py-6 text-center text-xs text-gray-400">
              해당 학년의 커리큘럼이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
