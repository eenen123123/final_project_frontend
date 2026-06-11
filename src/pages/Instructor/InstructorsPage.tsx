import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Instructors() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string>("01");

  const subjectTabs = [
    { id: "01", name: "국어" },
    { id: "02", name: "수학" },
    { id: "03", name: "영어" },
    { id: "04", name: "사회탐구" },
    { id: "05", name: "과학탐구" },
    { id: "10", name: "한국사" },
    { id: "06", name: "제2외국어" },
    { id: "07", name: "대학별고사" },
    { id: "08", name: "모의고사" },
  ];

  const dynamicTeachers: Record<
    string,
    { main: string[]; curri22?: string[]; high12?: string[] }
  > = {
    "01": {
      main: ["박상호", "김국어", "이문학"],
      curri22: ["박상호", "김국어"],
      high12: ["민국어", "송문학"],
    },
    "02": {
      main: ["이지은", "이도현", "정유진"],
      curri22: ["이지은", "정유진"],
      high12: ["주수학", "윤기하"],
    },
    "03": {
      main: ["최영어", "박독해", "이어법"],
      curri22: ["최영어", "박독해"],
      high12: ["아이린", "장현명"],
    },
    "04": {
      main: [
        "[생활과 윤리/윤리와 사상] 김윤리",
        "[사회문화] 임정환",
        "이형수",
        "[동아시아사/세계사] 권용기",
        "[한국지리/세계지리] 전성오",
        "[정치와 법] 최여름",
        "[경제] 민준호",
        "이형수",
      ],
      curri22: ["2022 개정 통합사회/일반선택 과목 라인업 자산 준비 중"],
    },
    "05": {
      main: [
        "[물리학] 방인혁",
        "홍진수",
        "[화학] 김준",
        "장성문",
        "[생명과학] 홍준용",
        "박선우",
        "[지구과학] 이훈식",
        "엄기은",
      ],
      curri22: ["[통합과학] 정성태"],
    },
    "10": {
      main: ["권용기", "안현준", "연미정"],
      curri22: ["권용기", "안현준"],
    },
    "06": {
      main: [
        "[아랍어] 지은경",
        "[스페인어] 신승",
        "[중국어] 리하이",
        "[베트남어] 이아영",
        "[일본어] 황선아",
      ],
    },
    "07": {
      main: [
        "[인문논술] 김용서",
        "[수리논술] 신재호",
        "유제승",
        "[약술형 논술] 신한종+고지우",
        "[경찰대/사관학교] 신한종",
        "이상인",
        "홍창우",
        "[구술면접] 유제승",
      ],
    },
    "08": {
      main: [
        "[국어] 이감 모의고사",
        "상상 모의고사",
        "[수학] 강대모의고사X",
        "히든카이스 수학 모의고사",
        "[전과목] 더 프리미엄 모의고사",
      ],
    },
  };

  const selectedName = subjectTabs.find((t) => t.id === selectedSubject)?.name;

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        {/* 좌측 과목 네비게이션 */}
        <aside className="col-span-12 md:col-span-3 bg-white border border-gray-200 rounded-lg h-fit overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-black text-xs text-gray-900 text-center tracking-widest uppercase">
              HERMES 강사
            </h2>
          </div>
          <nav className="divide-y divide-gray-200">
            {subjectTabs.map((tab) => {
              const isSelected = selectedSubject === tab.id;
              return (
                <div key={tab.id}>
                  <button
                    onClick={() => setSelectedSubject(tab.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold flex justify-between items-center transition-colors cursor-pointer ${
                      isSelected
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="tracking-tight">{tab.name}</span>
                    {isSelected ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>

                  {isSelected && (
                    <div className="px-4 pb-3 pt-2 bg-white text-xs space-y-2.5 border-t border-gray-200">
                      <div className="flex flex-col gap-1.5 text-gray-600 font-bold">
                        {dynamicTeachers[tab.id]?.main.map((t) => (
                          <span
                            key={t}
                            className="hover:text-blue-600 cursor-pointer transition-colors tracking-tight"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {dynamicTeachers[tab.id]?.curri22 && (
                        <div className="pt-2 border-t border-gray-200">
                          <span className="inline-block text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded font-black tracking-widest uppercase mb-1.5">
                            2022
                          </span>
                          <div className="flex flex-col gap-1.5 text-gray-500 font-bold">
                            {dynamicTeachers[tab.id].curri22?.map((t) => (
                              <span
                                key={t}
                                className="hover:text-blue-600 cursor-pointer transition-colors tracking-tight"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {dynamicTeachers[tab.id]?.high12 && (
                        <div className="pt-2 border-t border-gray-200">
                          <span className="inline-block text-[10px] text-blue-600 font-black tracking-widest mb-1.5">
                            고1·2
                          </span>
                          <div className="flex flex-col gap-1.5 text-gray-500 font-bold">
                            {dynamicTeachers[tab.id].high12?.map((t) => (
                              <span
                                key={t}
                                className="hover:text-blue-600 cursor-pointer transition-colors tracking-tight"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* 우측 콘텐츠 영역 */}
        <section className="col-span-12 md:col-span-9 space-y-5">
          {/* 상단 과목 탭 바 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-none px-2 py-2 gap-0.5">
              {subjectTabs.map((tab) => {
                const isSelected = selectedSubject === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSubject(tab.id)}
                    className={`flex-1 min-w-[72px] text-center px-3.5 py-1.5 rounded-md text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 강사 라인업 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                {selectedName} 라인업
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 font-bold">
                대표 강사진을 확인하고 강좌를 수강하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dynamicTeachers[selectedSubject]?.main.map((teacher, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    navigate(`/instructor/${encodeURIComponent(teacher)}`)
                  }
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-200 transition-colors group cursor-pointer"
                >
                  <div className="p-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center font-black text-white text-xs shrink-0">
                      T
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate tracking-tight">
                        {teacher}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-bold tracking-tight">
                        {selectedName} 대표교수
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 bg-white flex justify-around text-xs font-bold text-gray-500">
                    <span className="hover:text-blue-600 transition-colors cursor-pointer">
                      강좌 홈
                    </span>
                    <span className="text-gray-200">|</span>
                    <span className="hover:text-blue-600 transition-colors cursor-pointer">
                      맛보기 강좌
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
