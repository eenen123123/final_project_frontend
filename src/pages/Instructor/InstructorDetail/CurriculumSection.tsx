const MOCK_CURRICULUM = {
  subheading: "누군가는 처음부터 다시, 누군가는 더 높이",
  heading: "1년, 여러분의 수학을 설계하고 끝까지 함께합니다.",
  columns: [
    {
      title: "안정 2등급 목표",
      variant: "primary" as const,
      rows: [
        {
          stage: "기초개념",
          courses: [
            {
              badge: "BEST",
              title: "수I·수II 기초완성",
              desc: "개념부터 탄탄하게 잡아주는 All-in-One 기본 강좌",
            },
          ],
        },
        {
          stage: "개념완성",
          courses: [
            {
              badge: "SIGNATURE",
              title: "개념완성 기본편",
              desc: "핵심 개념을 빠르고 정확하게 익히는 단계별 강좌",
            },
          ],
        },
        {
          stage: "유형훈련",
          courses: [
            {
              badge: null,
              title: "유형별 집중공략",
              desc: "수능 출제 유형 전체를 체계적으로 정리",
            },
          ],
        },
        {
          stage: "모의고사",
          courses: [
            {
              badge: null,
              title: "새싹 모의고사",
              desc: "실전 감각을 쌓는 단계별 모의고사 훈련",
            },
            {
              badge: null,
              title: "새싹 모의고사 워크북",
              desc: "모의고사 문제 적용 연습을 위한 워크북 강좌",
            },
          ],
        },
        {
          stage: "파이널",
          courses: [
            {
              badge: null,
              title: "파이널 기출 총정리",
              desc: "수능 직전 핵심 기출만 빠르게 총정리",
            },
          ],
        },
      ],
    },
    {
      title: "만점 / 1등급 목표",
      variant: "secondary" as const,
      rows: [
        {
          stage: "개념심화",
          courses: [
            {
              badge: "SIGNATURE",
              title: "개념완성 심화편",
              desc: "상위권 수험생 대상, 고난도·구문을 집중 공략",
            },
          ],
        },
        {
          stage: "킬러완성",
          courses: [
            {
              badge: null,
              title: "2주완성 단기특강 킬러·준킬러",
              desc: "단 14강으로 킬러 문항 패턴 집중 분석",
            },
            {
              badge: null,
              title: "킬러 완성 심화",
              desc: "최고난도 문항의 숨겨진 풀이 원리 완전 정복",
            },
          ],
        },
        {
          stage: "기출+N제",
          courses: [
            {
              badge: null,
              title: "수능 수학 기출 공식",
              desc: "등급을 올리는 기출 60% 이상과 자체제작 N제 수록",
            },
          ],
        },
        {
          stage: "파이널",
          courses: [
            {
              badge: null,
              title: "심화 파이널",
              desc: "최고난도 문항으로 실전 감각 완성",
            },
          ],
        },
      ],
    },
  ],
  supplements: [
    {
      type: "기출분석",
      items: ["기출 분석 자료집 (PDF)", "평가원 핵심 기출 모음"],
    },
    { type: "워크북", items: ["단원별 연습 문제지"] },
    { type: "특강", items: ["오답 클리닉 특강", "오답 클리닉 PRO"] },
  ],
};

function CourseBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    BEST: "bg-blue-600 text-white",
    SIGNATURE: "bg-purple-600 text-white",
    NEW: "bg-green-600 text-white",
  };
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5 ${styles[label] ?? "bg-gray-200 text-gray-600"}`}
    >
      {label}
    </span>
  );
}

export default function CurriculumSection() {
  const { columns, supplements, heading, subheading } = MOCK_CURRICULUM;

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 mb-1">{subheading}</p>
          <h2 className="text-xl font-extrabold text-gray-900">{heading}</h2>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-8">
          {columns.map((col) => {
            const isPrimary = col.variant === "primary";
            return (
              <div
                key={col.title}
                className="border border-gray-200 overflow-hidden"
              >
                <div
                  className={`px-4 py-3 text-center font-bold text-sm ${isPrimary ? "bg-blue-600 text-white" : "bg-indigo-100 text-indigo-800"}`}
                >
                  {col.title}
                </div>
                <div className="divide-y divide-gray-100">
                  {col.rows.map((row) =>
                    row.courses.map((course, ci) => (
                      <div
                        key={`${row.stage}-${ci}`}
                        className="flex items-stretch hover:bg-gray-50 cursor-pointer group transition-colors"
                      >
                        <div
                          className={`w-20 shrink-0 flex items-center justify-center border-r border-gray-100 px-2 py-3 ${isPrimary ? "bg-blue-50" : "bg-indigo-50"}`}
                        >
                          {ci === 0 && (
                            <span
                              className={`text-xs font-bold text-center leading-tight ${isPrimary ? "text-blue-700" : "text-indigo-700"}`}
                            >
                              {row.stage}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 px-4 py-3">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">
                            {course.badge && <CourseBadge label={course.badge} />}
                            {course.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                            {course.desc}
                          </p>
                        </div>
                      </div>
                    )),
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-0.5">
              보충 학습이 필요하다고 느낄 때 추천!
            </p>
            <p className="text-sm font-bold text-gray-800">
              수학 실력 Upgrade를 위한 추가 강좌
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {supplements.map((sup) => (
              <div key={sup.type} className="flex items-stretch">
                <div className="w-24 shrink-0 flex items-center justify-center bg-gray-50 border-r border-gray-100 px-3 py-4">
                  <span className="text-xs font-bold text-gray-600">
                    {sup.type}
                  </span>
                </div>
                <div className="flex-1 divide-y divide-gray-50">
                  {sup.items.map((item) => (
                    <div
                      key={item}
                      className="px-6 py-3 text-sm text-gray-700 text-center hover:bg-gray-50 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
