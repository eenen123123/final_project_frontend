const members = [
  {
    name: "이지은",
    image: "/LeeJiEun.png",
    subject: "수학",
    tagline: "수학의 본질을 가르치는 실력 향상 전문 강사",
    quote: "수학은 이해의 힘, 그 힘으로 성적을 바꿉니다.",
    specialty: [
      "중/고등 수학 (내신, 수능)",
      "수학 개념 및 심화 학습",
      "수능 고득점 전략",
    ],
    education: [
      "서울대학교 수학교육과 졸업",
      "서울대학교 대학원 수학교육 석사",
    ],
    career: [
      "현) 프리미엄 학원 수학 대표 강사",
      "전) 대치동 OO학원 수학 강사",
      "강의 경력 7년",
      "다수 학생 수능 1등급 배출",
    ],
  },
  {
    name: "이도현",
    image: "/YeeDoHyeon.png",
    subject: "수학",
    tagline: "수학의 본질을 가르치는 문제 해결 전문가",
    quote: "이해하지 못한 문제는 아직 배우는 중인 문제입니다.",
    specialty: [
      "고등 수학 (수I, 수II, 확률과 통계, 미적분)",
      "내신 및 수능 대비",
      "문제 해결력 및 고난도 문항 전략",
    ],
    education: [
      "서울대학교 수학교육과 졸업",
      "서울대학교 대학원 수학교육 석사",
      "교원 자격증 (중등 수학교사 2급)",
    ],
    career: [
      "현) 프리미엄 학원 수학 대표 강사",
      "수능 수학 만점 다수 배출",
      "학생 내신 1등급 다수 배출",
    ],
  },
  {
    name: "정유진",
    image: "/JungYooJin.png",
    subject: "수학",
    tagline: "개념 이해부터 실전까지, 성적을 바꾸는 진짜 수업",
    quote:
      "수학은 암기가 아닌 이해의 과목입니다. 원리를 이해하면 어떤 문제도 스스로 해결할 수 있습니다.",
    specialty: [
      "중/고등 수학 (내신, 수능)",
      "수학 개념 및 문제 풀이",
      "수능 고득점 전략",
    ],
    education: [
      "서울대학교 수학교육과 졸업",
      "서울대학교 대학원 수학교육 석사",
    ],
    career: [
      "현) 대치에듀학원 수학 대표 강사",
      "강의 경력 8년",
      "다수 학생 수능 1등급 배출",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-blue-950 text-white py-16 px-4 text-center">
        <p className="text-amber-400 text-xl font-semibold tracking-widest mb-3">
          Hermes
        </p>
        <h1 className="text-4xl font-bold mb-3">개념부터 실전까지</h1>
        <p className="text-blue-200 text-lg">
          최고의 강사진이 여러분의 성적을 바꿉니다.
        </p>
      </section>

      {/* Instructors */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
          강사 소개
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((m) => (
            <div
              key={m.name}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col"
            >
              <div className="bg-gray-50">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full object-contain"
                />
              </div>

              <div className="bg-blue-950 px-5 py-4">
                <p className="text-amber-400 text-xs tracking-widest mb-1">
                  {m.subject} 강사
                </p>
                <p className="text-white font-bold text-xl">{m.name}</p>
                <p className="text-blue-300 text-xs mt-1">{m.tagline}</p>
              </div>

              <div className="px-5 py-4 space-y-4 flex-1 text-sm text-slate-700">
                <div>
                  <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">
                    전문 분야
                  </p>
                  <ul className="space-y-1">
                    {m.specialty.map((s) => (
                      <li key={s} className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5 shrink-0">
                          ·
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">
                    학력
                  </p>
                  <ul className="space-y-1">
                    {m.education.map((e) => (
                      <li key={e} className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5 shrink-0">
                          ·
                        </span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">
                    경력
                  </p>
                  <ul className="space-y-1">
                    {m.career.map((c) => (
                      <li key={c} className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5 shrink-0">
                          ·
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-5 py-4">
                <p className="text-xs text-slate-500 italic leading-relaxed">
                  "{m.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
