import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyPageSidebar from "../Mypage/components/MyPageSidebar";
import api from "../../../api/api";

type TabType = "active" | "end";
type SortType = "recent" | "order" | "expire";

// 내 강의실 목록의 강좌 항목 (진도율·D-day·즐겨찾기·상태 포함)
interface Lecture {
  id: string;
  courseSn: number;
  title: string;
  teacher: string;
  subject: string;
  category: string;
  progress: number;
  expireDate: string;
  dday: number | null;
  thumbBg: string;
  thumbLabel: string;
  thmbImg?: string;
  favorite: boolean;
  status: TabType;
}

const THUMB_COLORS = ["#1E3A8A", "#065F46", "#4B5563", "#7C3AED", "#B45309", "#1E40AF", "#9D174D"];


const TAB_LABELS: { key: TabType; label: string }[] = [
  { key: "active", label: "수강중인 강좌" },
  { key: "end", label: "수강종료 강좌" },
];

const CATEGORIES = ["전체", "국어", "수학", "영어", "사탐", "과탐", "한국사"];
const SORT_LABELS: { key: SortType; label: string }[] = [
  { key: "order", label: "신청일 최신순" },
  { key: "expire", label: "수강기간 임박순" },
  { key: "recent", label: "진도율 높은순" },
];

const GUIDE_ITEMS = [
  "강좌명을 클릭하면 강의를 수강하실 수 있습니다.",
  "수강연장은 수강기간 중 최대 2회, 수강종료 후 30일 이내에 1회 가능합니다.",
  "휴강은 최대 2회까지 가능하며, 수강 중(수강완료 1일 전까지)에만 신청이 가능합니다.",
  "일부 기간제상품(PASS 상품 등) 및 패키지, 무료강좌, 이벤트성의 특정 강좌 등은 휴강&연장이 제공되지 않습니다.",
  "당일 휴강후 휴강 해지 가능합니다.",
  "강의 수강 후기를 작성하신 뒤 채택 되신 회원에게는 포인트 500점을 드립니다.",
];

// 📌 버튼 모양을 네모나게(rounded-md) 수정
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

export default function MyLecturePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("수강중 강좌");
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState<SortType>("recent");
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [guideOpen, setGuideOpen] = useState(true);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  useEffect(() => {
    api.get<{ enrlSn: number; courseSn: number; courseNm: string; thmbImg: string | null; instrNm: string; accsEndDt: string; progressPct: number }[]>("/api/mypage/courses")
      .then((res) => {
        const now = Date.now();
        setLectures(res.data.map((e, i) => {
          const endDate = e.accsEndDt ? new Date(e.accsEndDt) : null;
          const daysLeft = endDate ? Math.ceil((endDate.getTime() - now) / (1000 * 60 * 60 * 24)) : null;
          const expireDate = endDate
            ? `${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, "0")}.${String(endDate.getDate()).padStart(2, "0")}`
            : "";
          return {
            id: String(e.enrlSn),
            courseSn: e.courseSn,
            title: e.courseNm ?? "",
            teacher: e.instrNm ? `${e.instrNm} 선생님` : "",
            subject: "",
            category: "전체",
            progress: e.progressPct ?? 0,
            expireDate,
            dday: daysLeft !== null && daysLeft <= 14 ? daysLeft : null,
            thumbBg: THUMB_COLORS[i % THUMB_COLORS.length],
            thumbLabel: (e.courseNm ?? "").slice(0, 4),
            thmbImg: e.thmbImg ?? undefined,
            favorite: false,
            status: (endDate && endDate.getTime() < now ? "end" : "active") as TabType,
          };
        }));
      })
      .catch((error) => alert(error.response?.data?.message));
  }, []);

  const tabCount = (tab: TabType) => lectures.filter((l) => l.status === tab).length;

  const filtered = lectures
    .filter((l) => l.status === activeTab)
    .filter((l) => category === "전체" || l.category === category)
    .filter((l) => !showFavOnly || l.favorite)
    .sort((a, b) => {
      if (sort === "expire") return (a.dday ?? 999) - (b.dday ?? 999);
      if (sort === "order") return Number(b.id) - Number(a.id);
      if (sort === "recent") return b.progress - a.progress;
      return 0;
    });

  const handleFavorite = (id: string) => {
    const lecture = lectures.find((l) => l.id === id);
    const isAdding = !lecture?.favorite;
    setLectures((prev) => prev.map((l) => (l.id === id ? { ...l, favorite: !l.favorite } : l)));
    setToast({ visible: true, message: isAdding ? "즐겨찾기에 등록되었습니다." : "즐겨찾기가 해제되었습니다." });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1800);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* 토스트 알림 */}
        <div
          className={`fixed top-6 left-1/2 z-50 transition-all duration-300 transform -translate-x-1/2
            ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-amber-400 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {toast.message}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={(section) => setActiveSection(section)} />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">수강중 강좌</h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "end"
                  ? "수강 기간이 만료된 강좌 목록입니다."
                  : "신청하신 강좌의 학습 현황을 관리하고 수강할 수 있습니다."}
              </p>
            </div>

            {/* 메인 탭 컴포넌트 */}
            <div className="flex border-b border-gray-200 mb-6 gap-2">
              {TAB_LABELS.map(({ key, label }) => {
                const isSelected = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      setCategory("전체");
                    }}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer relative top-[1px] border-b-2
                      ${
                        isSelected
                          ? "border-blue-600 text-blue-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                      }`}
                  >
                    {label}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full transition-colors
                        ${isSelected ? "bg-blue-50 text-blue-600 font-bold" : "bg-gray-100 text-gray-400"}`}
                    >
                      {tabCount(key)}
                    </span>
                  </button>
                );
              })}
            </div>

            <>
            {/* 표(Table) 형태의 필터 대시보드 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5 shadow-sm">
              <table className="w-full border-collapse text-left">
                <tbody>
                  <tr>
                    <th className="w-24 sm:w-28 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 uppercase tracking-wider text-center select-none">
                      과목영역
                    </th>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {CATEGORIES.map((c) => (
                          <FilterPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 리스트 컨트롤 바 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  총 <b className="text-gray-900 font-semibold">{filtered.length}</b>개의 강좌
                </span>
                <div className="w-[1px] h-3 bg-gray-200" />
                <button
                  onClick={() => setShowFavOnly(!showFavOnly)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer
                    ${
                      showFavOnly
                        ? "bg-amber-50 text-amber-700 border-amber-200 font-medium"
                        : "bg-white text-gray-500 border-gray-200 hover:text-gray-700"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-3.5 h-3.5 ${showFavOnly ? "text-amber-500" : "text-gray-400"}`}
                    viewBox="0 0 24 24"
                    fill={showFavOnly ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  즐겨찾기만 보기
                </button>
              </div>

              <div className="flex items-center gap-2">
                {SORT_LABELS.map(({ key, label }, i) => (
                  <div key={key} className="flex items-center">
                    {i > 0 && <span className="text-gray-200 text-xs mx-2">·</span>}
                    <button
                      onClick={() => setSort(key)}
                      className={`text-xs transition-all cursor-pointer font-medium
                        ${sort === key ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      {label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 강좌 목록 영역 */}
            {filtered.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-200 mx-auto mb-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <p className="text-sm text-gray-400 font-medium">조건에 맞는 강좌가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-5">
                {filtered.map((lecture) => {
                  const isExpiring = lecture.dday !== null && lecture.dday <= 14;
                  const accentColor = isExpiring ? "#EF4444" : "#3B82F6";

                  return (
                    <div
                      key={lecture.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all border hover:shadow-md hover:border-gray-200"
                      style={{ border: isExpiring ? "1px solid #FCA5A5" : "1px solid #F3F4F6" }}
                    >
                      <div className="flex items-center gap-5 p-5">
                        {/* 썸네일 */}
                        <div className="relative flex-shrink-0">
                          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                            {lecture.thmbImg ? (
                              <img src={lecture.thmbImg} alt={lecture.title} className="w-full h-full object-cover" />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ background: lecture.thumbBg }}
                              >
                                <span className="text-xs font-semibold text-white text-center leading-tight whitespace-pre-line px-2">
                                  {lecture.thumbLabel}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleFavorite(lecture.id)}
                            className="absolute top-1.5 left-1.5 cursor-pointer transition-transform hover:scale-110 p-1 bg-black/20 rounded-lg backdrop-blur-[2px]"
                            aria-label={lecture.favorite ? "즐겨찾기 해제" : "즐겨찾기 등록"}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill={lecture.favorite ? "#F59E0B" : "none"}
                              stroke={lecture.favorite ? "#F59E0B" : "white"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        </div>

                        {/* 강좌 세부정보 */}
                        <div className="flex-1 min-w-0">
                          {/* 📌 과목 우측으로 뱃지를 정렬한 상단 레이아웃 */}
                          <div className="flex items-center gap-0 mb-1">
                            <p className="text-xs font-bold text-blue-600">{lecture.subject}</p>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide"
                              style={{
                                background: isExpiring ? "#FEF2F2" : "#EBF5FF",
                                color: isExpiring ? "#991B1B" : "#1D4ED8",
                                border: `1px solid ${isExpiring ? "#FECACA" : "#BFDBFE"}`,
                              }}
                            >
                              {isExpiring ? `만료임박 D-${lecture.dday}` : "수강중"}
                            </span>
                          </div>

                          <p
                            className="text-sm font-bold text-gray-900 mb-1 truncate cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => {
                              api.get<{ course: { instrUuid: string } }>(`/api/course/${lecture.courseSn}`)
                                .then((res) => navigate(`/instructor/${res.data.course.instrUuid}/courses/${lecture.courseSn}`))
                                .catch((error) => alert(error.response?.data?.message));
                            }}
                          >
                            {lecture.title}
                          </p>
                          <p className="text-xs text-gray-400 mb-3 font-medium">{lecture.teacher}</p>

                          {/* 10%마다 실선 구분선이 추가된 학습진도율 프로그레스 바 */}
                          <div className="relative h-3.5 bg-gray-100 rounded-full overflow-hidden mb-2 border border-gray-200/30">
                            {/* 실제 게이지 바 */}
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${lecture.progress}%`, background: accentColor }}
                            />
                            {/* 10% 단위 실선 구분 눈금 (10% ~ 90%) */}
                            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((percent) => (
                              <div
                                key={percent}
                                className="absolute top-0 bottom-0 w-[1px] bg-white/40 pointer-events-none"
                                style={{ left: `${percent}%` }}
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">
                              학습률 진척도 ·{" "}
                              <b style={{ color: accentColor }} className="font-semibold">
                                {lecture.progress}% 완료
                              </b>
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: isExpiring ? "#EF4444" : "#9CA3AF", fontWeight: isExpiring ? 600 : 400 }}
                            >
                              ~{lecture.expireDate}
                            </span>
                          </div>
                        </div>

                        {/* 우측 액션 버튼 */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              api.get<{ lectures: { lectureSn: number }[] }>(`/api/course/${lecture.courseSn}`)
                                .then((res) => {
                                  const first = res.data.lectures?.[0];
                                  if (first) navigate(`/viewer?courseId=${lecture.courseSn}&lectureId=${first.lectureSn}`);
                                })
                                .catch((error) => alert(error.response?.data?.message));
                            }}
                            className="text-xs px-4 py-2.5 text-white rounded-xl font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap hover:opacity-90"
                            style={{ background: accentColor }}
                          >
                            강의 보기
                          </button>
                          <button
                            onClick={() => {
                              api.get<{ course: { instrUuid: string } }>(`/api/course/${lecture.courseSn}`)
                                .then((res) => navigate(`/instructor/${res.data.course.instrUuid}/courses/${lecture.courseSn}`))
                                .catch((error) => alert(error.response?.data?.message));
                            }}
                            className="text-xs px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            강좌정보
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 이용안내 아코디언 */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setGuideOpen((p) => !p)}
                className="w-full flex items-center gap-2 px-5 py-4 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/xl"
                  className="w-4 h-4 text-blue-500 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">나의 강의실 이용안내</span>
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
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
