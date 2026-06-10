import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/api";
import LectureFilterSidebar from "./components/LectureFilterSidebar";

type SortType = "latest" | "popular" | "apply";

// 전체 강좌 검색·필터 목록 항목 (백엔드 API 응답 필드명 그대로)
interface CourseListDto {
  courseSn: number;
  courseNm: string;
  courseExplnCn: string;
  thmbImg: string | null;
  coursePrice: number;
  opnnYn: string;
  prodMthdCd: string | null;
  totLrnTimeCnt: string | null;
  regDt: string;
  instrUserNm: string;
  subjNm: string;
  subjClId: number;
  subjClNm: string;
  lectureCnt: number;
}

const SORTS: { key: SortType; label: string }[] = [
  { key: "latest", label: "최신순" },
  { key: "popular", label: "인기순" },
  { key: "apply", label: "수강신청순" },
];

const PAGE_SIZE = 8;

// NEW 뱃지: 등록일 기준 7일 이내
function isNewCourse(regDt: string): boolean {
  const diff = new Date().getTime() - new Date(regDt).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

export default function LectureListPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [lectures, setLectures] = useState<CourseListDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [grade, setGrade] = useState("go3");
  const [selected, setSelected] = useState<string[]>([]);
  const [subjClId, setSubjClId] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [teacher, setTeacher] = useState("");
  const [sort, setSort] = useState<SortType>("latest");
  const [page, setPage] = useState(1);
  const [bookAlert, setBookAlert] = useState<string | null>(null);

  // API 호출
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page,
          size: PAGE_SIZE,
        };
        if (subjClId) params.subjClId = subjClId;
        if (teacher) params.instrUserNm = teacher;

        const res = await api.get("/api/course", { params });
        setLectures(res.data.items);
        setTotalCount(res.data.totalCount);
      } catch (e) {
        console.error("강좌 목록 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page, subjClId, teacher]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleCategoryChange = (c: string, id: number | null) => {
    setCategory(c);
    setSubjClId(id);
    setTeacher("");
    setPage(1);
  };

  const handleReset = () => {
    setGrade("go3");
    setCategory("");
    setSubjClId(null);
    setTeacher("");
    setSort("latest");
    setSelected([]);
    setPage(1);
  };

  const handleRequireLogin = () => {
    alert("로그인이 필요한 서비스입니다.");
    navigate("/login");
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleBookClick = (lecture: CourseListDto) => {
    if (!isAuthenticated) {
      handleRequireLogin();
      return;
    }
    setBookAlert(String(lecture.courseSn));
    setTimeout(() => setBookAlert(null), 2000);
  };

  const handleBottomBarClick = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    } else {
      alert("구독권 보유 회원만 가능한 서비스입니다.");
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 ${selected.length > 0 ? "pb-20" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-5 items-start">
          {/* 사이드바 */}
          <LectureFilterSidebar
            grade={grade}
            category={category}
            teacher={teacher}
            onGradeChange={(g) => {
              setGrade(g);
              setPage(1);
            }}
            onCategoryChange={handleCategoryChange}
            onTeacherChange={(t) => {
              setTeacher(t);
              setPage(1);
            }}
            onReset={handleReset}
          />

          {/* 메인 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {/* 선택 중인 필터 태그 */}
            {(category || teacher) && (
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-700 mr-1">
                  선택 중인 강좌
                </span>
                <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                  {grade === "go3"
                    ? "고3·N수"
                    : grade === "go2"
                      ? "고2"
                      : "고1"}
                </span>
                {category && (
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                    {category}
                  </span>
                )}
                {teacher && (
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200 flex items-center gap-1">
                    {teacher}
                    <button
                      onClick={() => setTeacher("")}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* 정렬 + 강좌 수 */}
            <div className="flex items-center justify-between mb-3 px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">전체</span>
                <span className="text-xs font-bold text-gray-900">
                  {totalCount}개
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[11px] text-gray-400 mr-1">
                  * 정렬 기준에 따라 리스트가 재정렬됩니다.
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-700 bg-white cursor-pointer focus:outline-none"
                >
                  {SORTS.map(({ key, label }) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 로딩 */}
            {loading ? (
              <div className="bg-white border border-gray-200 rounded-lg py-20 text-center">
                <p className="text-sm text-gray-400">강좌를 불러오는 중...</p>
              </div>
            ) : lectures.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg py-20 text-center">
                <p className="text-sm text-gray-400">
                  해당하는 강좌가 없습니다.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100 bg-white border border-gray-200 rounded-lg overflow-hidden">
                {lectures.map((lecture) => (
                  <div
                    key={lecture.courseSn}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* 체크박스 */}
                    <input
                      type="checkbox"
                      checked={selected.includes(String(lecture.courseSn))}
                      onChange={() => toggleSelect(String(lecture.courseSn))}
                      className="w-4 h-4 accent-gray-800 flex-shrink-0 cursor-pointer"
                    />

                    {/* 선생님명 */}
                    <div className="w-14 flex-shrink-0 text-center">
                      <span className="text-sm font-bold text-gray-800">
                        {lecture.instrUserNm}
                      </span>
                    </div>

                    {/* 강좌 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {isNewCourse(lecture.regDt) && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-500 text-white rounded font-bold">
                            NEW
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 bg-orange-400 text-white rounded font-bold">
                          UP
                        </span>
                        {lecture.prodMthdCd && (
                          <span className="text-[10px] px-1.5 py-0.5 border border-gray-300 text-gray-500 rounded font-medium">
                            {lecture.prodMthdCd}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5 hover:text-blue-600 cursor-pointer transition-colors truncate">
                        {lecture.courseNm}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {lecture.courseExplnCn}
                      </p>
                      <button className="text-[11px] text-gray-400 hover:text-blue-500 mt-0.5 cursor-pointer transition-colors">
                        자세히보기 +
                      </button>
                    </div>

                    {/* OT / 교재신청 */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button className="text-xs px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                        OT
                      </button>
                      {bookAlert === String(lecture.courseSn) ? (
                        <span className="text-xs text-gray-400 whitespace-nowrap text-center">
                          교재가 없습니다.
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBookClick(lecture)}
                          className="text-xs px-3 py-1 border rounded-md transition-colors cursor-pointer whitespace-nowrap"
                          style={{ borderColor: "#D1D5DB", color: "#9CA3AF" }}
                        >
                          교재신청
                        </button>
                      )}
                    </div>

                    {/* 강좌 단계 */}
                    <div
                      className="text-center flex-shrink-0"
                      style={{ minWidth: "60px" }}
                    >
                      <p className="text-xs text-gray-400 leading-relaxed whitespace-nowrap">
                        {lecture.subjClNm}
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed whitespace-nowrap">
                        ({lecture.subjNm})
                      </p>
                    </div>

                    {/* 강좌신청 버튼 */}
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          handleRequireLogin();
                          return;
                        }
                      }}
                      className="flex-shrink-0 cursor-pointer"
                      style={{ background: "none", border: "none", padding: 0 }}
                      onMouseOver={(e) => {
                        const span = e.currentTarget.querySelector("span");
                        if (span) (span as HTMLElement).style.color = "#1E40AF";
                      }}
                      onMouseOut={(e) => {
                        const span = e.currentTarget.querySelector("span");
                        if (span) (span as HTMLElement).style.color = "#3B82F6";
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#3B82F6",
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                          transition: "color 0.15s",
                        }}
                      >
                        강좌신청 ›
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-sm"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center border rounded text-xs font-medium transition-colors cursor-pointer
                      ${page === p ? "bg-gray-900 text-white border-gray-900" : "text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-sm"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 선택 바 */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-16">
          <button
            onClick={handleBottomBarClick}
            className="w-full py-4 text-white text-lg font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-t-2xl shadow-lg"
            style={{ background: "#172554" }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#1e3a8a";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#172554";
            }}
          >
            지금 선택한&nbsp;
            <span className="text-yellow-300 font-extrabold">
              {selected.length}개
            </span>
            &nbsp;강좌 확인하기 ›
          </button>
        </div>
      )}
    </div>
  );
}
