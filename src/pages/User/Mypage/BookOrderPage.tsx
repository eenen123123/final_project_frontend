import { useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";

interface Book {
  id: string;
  title: string;
  desc: string[];
  relatedLecture: string;
  subject: string;
  category: string;
  teacher: string;
  alarmed: boolean;
}

const DUMMY_BOOKS: Book[] = [
  {
    id: "1",
    title: "New 2027 훈련도감 - E 수특정복 [현대시]",
    desc: [
      "EBS 연계 교재에 실린 모든 현대시 작품의 분석 수록",
      "수능, 모의평가, 학력평가로 출제된 기출 문제들을 모두 모아 친절한 해설과 함께 수록",
      "작품의 내용과 EBS 연계 교재의 출제 방향이 한눈에 보이도록 구성",
    ],
    relatedLecture: "New 2027 훈련도감 - E 수특정복 현대시",
    subject: "국어",
    category: "korean",
    teacher: "박광일",
    alarmed: false,
  },
  {
    id: "2",
    title: "New 2027 홀수 기출 평가원 최신 [문학]",
    desc: ["최신 6개년 평가원 문학 기출", "전 지문, 전 문항 수록"],
    relatedLecture: "New 2027 홀수로 문학 외 1개 강좌",
    subject: "국어",
    category: "korean",
    teacher: "박광일",
    alarmed: false,
  },
  {
    id: "3",
    title: "New 2027 독기본서 [독서]",
    desc: ["독서 전 영역 핵심 개념 정리", "실전 기출 문제로 개념 확인"],
    relatedLecture: "New 2027 독기본서 독서",
    subject: "국어",
    category: "korean",
    teacher: "김민정",
    alarmed: false,
  },
  {
    id: "4",
    title: "New 2027 개념때려잡기 수학I",
    desc: ["수학I 전 단원 핵심 개념 정리", "유형별 문제 풀이 전략 수록"],
    relatedLecture: "2027 개념때려잡기 수학I",
    subject: "수학",
    category: "math",
    teacher: "정승제",
    alarmed: false,
  },
  {
    id: "5",
    title: "New 2027 한줄 영어독해 기본편",
    desc: ["수능 영어 독해 핵심 유형 완벽 정리", "단계별 독해 훈련으로 실력 향상"],
    relatedLecture: "2027 한줄 영어독해 기본편",
    subject: "영어",
    category: "english",
    teacher: "주혜연",
    alarmed: false,
  },
  {
    id: "6",
    title: "New 2027 사회문화 개념완성",
    desc: ["사회문화 핵심 개념 체계적 정리", "최신 출제 경향 반영"],
    relatedLecture: "2027 사회문화 개념완성",
    subject: "사탐",
    category: "social",
    teacher: "임정환",
    alarmed: false,
  },
];

const TEACHERS_BY_CATEGORY: Record<string, string[]> = {
  korean: ["전체", "박광일", "김민정", "신영균", "방동진", "김민경"],
  math: ["전체", "정승제", "강윤구", "김동환", "양지용", "이하영"],
  english: ["전체", "주혜연", "김범구", "오채은", "김형률"],
  social: ["전체", "이지영", "임정환", "김현수", "양호승"],
  science: ["전체", "이승후", "안성진", "엄영대", "양서현"],
  history: ["전체", "김준창", "한세희"],
  univ: ["전체", "이다예", "김성수", "강윤구"],
};

const SUBJECTS = [
  { key: "korean", label: "국어" },
  { key: "math", label: "수학" },
  { key: "english", label: "영어" },
  { key: "social", label: "사탐" },
  { key: "science", label: "과탐" },
  { key: "history", label: "한국사" },
  { key: "univ", label: "대학별고사" },
];

const GUIDE_ITEMS = [
  "헤르메스 월간구독권생은 연결 강좌 신청 없이 모든 교재를 자유롭게 구매하실 수 있습니다.",
  "헤르메스 단강 구매생은 구매한 강좌의 연결 교재를 구매하실 수 있습니다.",
  "그 외에 단독 구매가 가능한 교재는 강좌 신청 없이도 자유롭게 구매하실 수 있습니다.",
  "교재는 중복 구매가 불가능하며, 중복 구매 희망 시 고객센터로 연락 부탁드립니다.",
  "입고 알림 신청 시 교재 입고 완료 후 등록하신 연락처로 알림이 발송됩니다.",
];

const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`text-xs px-3.5 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap
      ${
        active
          ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm shadow-blue-100"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
      }`}
  >
    {label}
  </button>
);

export default function BookOrderPage() {
  const [activeSection, setActiveSection] = useState("교재신청");
  const [category, setCategory] = useState("korean");
  const [teacher, setTeacher] = useState("전체");
  const [books, setBooks] = useState<Book[]>(DUMMY_BOOKS);
  const [toast, setToast] = useState<{ message: string; type: "add" | "remove" } | null>(null);
  const [guideOpen, setGuideOpen] = useState(true);

  const filtered = books.filter((b) => b.category === category && (teacher === "전체" || b.teacher === teacher));

  const handleAlarm = (id: string) => {
    const book = books.find((b) => b.id === id);
    const isAlarmed = book?.alarmed;

    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, alarmed: !b.alarmed } : b)));

    // 객체 형태로 상태 업데이트
    setToast({
      message: isAlarmed ? "알림이 해제되었습니다." : "입고 알림 신청이 완료되었습니다!",
      type: isAlarmed ? "remove" : "add",
    });

    setTimeout(() => setToast(null), 2500);
  };

  const handleCategoryChange = (key: string) => {
    setCategory(key);
    setTeacher("전체");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            {/* 토스트 */}
            <div
              className={`fixed top-6 left-1/2 z-50 transition-all duration-300 transform -translate-x-1/2
    ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            >
              {toast && (
                <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 flex-shrink-0 ${toast.type === "remove" ? "text-rose-400" : "text-blue-400"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    {/* 📌 알림 해제(remove)일 때만 대각선 빗금 추가 */}
                    {toast.type === "remove" && <line x1="2" y1="2" x2="22" y2="22" />}
                  </svg>
                  {toast.message}
                </div>
              )}
            </div>

            {/* 타이틀 */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">교재 신청</h3>
              <p className="text-sm text-gray-500 mt-1">원하는 교재를 선택하고 입고 알림 소식을 먼저 받아보세요.</p>
            </div>

            {/* 필터 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5 shadow-sm">
              <table className="w-full border-collapse text-left">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <th className="w-24 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 text-center select-none">
                      구분
                    </th>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {SUBJECTS.map(({ key, label }) => (
                          <FilterPill
                            key={key}
                            label={label}
                            active={category === key}
                            onClick={() => handleCategoryChange(key)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="w-24 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 text-center select-none">
                      선생님
                    </th>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {(TEACHERS_BY_CATEGORY[category] ?? ["전체"]).map((t) => (
                          <FilterPill key={t} label={t} active={teacher === t} onClick={() => setTeacher(t)} />
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 교재 수 */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-sm text-gray-600">
                총 <b className="text-gray-900 font-semibold">{filtered.length}</b>권
              </span>
            </div>

            {/* 교재 목록 */}
            {filtered.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm mb-5">
                <p className="text-sm text-gray-400 font-medium">조건에 맞는 교재가 없습니다.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-5">
                {filtered.map((book, i) => (
                  <div
                    key={book.id}
                    className="flex gap-5 p-6"
                    style={{ borderTop: i > 0 ? "0.5px solid #E5E7EB" : "none" }}
                  >
                    <div className="w-28 h-36 flex-shrink-0 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400 text-center px-2">교재 표지</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 mb-2">{book.title}</p>
                      <div className="mb-4 space-y-1">
                        {book.desc.map((d, j) => (
                          <p key={j} className="text-sm text-gray-500">
                            · {d}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">[연결강좌]</p>
                          <p className="text-sm text-gray-600">{book.relatedLecture}</p>
                        </div>
                        <button
                          onClick={() => handleAlarm(book.id)}
                          className="flex items-center gap-2 text-sm px-4 py-2 border rounded-md transition-colors cursor-pointer whitespace-nowrap"
                          style={{
                            borderColor: book.alarmed ? "#3B82F6" : "#D1D5DB",
                            color: book.alarmed ? "white" : "#3B82F6",
                            background: book.alarmed ? "#3B82F6" : "transparent",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {book.alarmed ? (
                              <>
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                <line x1="2" y1="2" x2="22" y2="22" />
                              </>
                            ) : (
                              <>
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                              </>
                            )}
                          </svg>
                          {book.alarmed ? "알림 신청 완료" : "교재 입고 알림 신청"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 이용안내 */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setGuideOpen((p) => !p)}
                className="w-full flex items-center gap-2 px-5 py-4 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-blue-500 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">교재신청 이용안내</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 ${guideOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: guideOpen ? "300px" : "0px" }}
              >
                <ul className="px-5 pb-5 space-y-2 border-t border-gray-50 pt-4 bg-gray-50/30">
                  {GUIDE_ITEMS.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                      <span className="text-blue-400 flex-shrink-0 mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
