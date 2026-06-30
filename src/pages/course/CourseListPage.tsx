import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import { RefreshCw, ShoppingCart } from "lucide-react";

interface Subject {
  subjId: number;
  subjClId: string;
  subjNm: string;
  subjExplnCn: string;
}
interface SubjectClassification {
  subjClId: number;
  subjClNm: string;
  subjects: Subject[];
}

const CATEGORY_OPTIONS = [
  { value: "courseName", label: "강좌 이름" },
  { value: "subject", label: "과목" },
  { value: "instructor", label: "선생님" },
];

// 한 페이지당 강좌 수 (백엔드 PaginationInfo 와 동일)
const PAGE_SIZE = 10;

interface SearchOption {
  category: string;
  keyword: string;
  page: number;
}

interface CourseListResponse {
  totalCount: number;
  items: Course[];
}

interface Course {
  courseSn: number;
  courseName: string;
  subjectId: number;
  subjectName: string;
  instructorName: string;
  instrUuid: string;
  coursePrice?: number;
  explain: string;
  isBest: boolean;
  isNew: boolean;
  thumbnailImg?: string;
}

// MARK: 검색 아이콘
function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// MARK: 개별 강좌 아이템
function CourseItem({ course }: { course: Course }) {
  const navigate = useNavigate();
  const formattedPrice = course.coursePrice
    ? course.coursePrice.toLocaleString() + "원"
    : null;

  const addToCart = async () => {
    try {
      const res = await api.post("/api/cart", {
        prodDivCd: "COURSE",
        prodSn: course.courseSn,
        itemQty: 1,
      });
      const go = window.confirm(
        `${res.data}\n마이페이지(장바구니)에서 확인하시겠습니까?`,
      );
      if (go) navigate("/mycart");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          alert("로그인이 필요합니다.");
          return;
        }
        if (status === 409) {
          const go = window.confirm(
            `${err.response?.data?.message}\n마이페이지(장바구니)에서 확인하시겠습니까?`,
          );
          if (go) navigate("/mycart");
        } else {
          alert(err.response?.data?.message ?? "오류가 발생했습니다.");
        }
      }
    }
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl shadow-sm flex items-start gap-3 sm:gap-5 py-4 px-4 sm:py-5 sm:px-5 hover:shadow-md transition-all duration-200">
      {/* 썸네일 */}
      <div className="shrink-0">
        {course.thumbnailImg ? (
          <img
            src={course.thumbnailImg}
            alt={course.courseName}
            className="w-16 h-24 sm:w-32 sm:h-44 object-cover rounded-xl shadow-sm"
          />
        ) : (
          <div className="w-16 h-24 sm:w-32 sm:h-44 bg-blue-400 rounded-xl shadow-sm p-2 sm:p-3 flex flex-col justify-between text-white border-l-4 border-black/20">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[8px] sm:text-[11px] bg-white/20 px-1 py-0.5 rounded font-bold tracking-widest uppercase block">
                HERMES
              </span>
              <h5 className="text-[9px] sm:text-[12px] font-bold leading-tight line-clamp-2 mt-1">
                {course.subjectName}
              </h5>
              <h5 className="text-[10px] sm:text-[13px] font-bold leading-tight line-clamp-2 mt-1">
                {course.courseName}
              </h5>
            </div>
            <span className="text-[8px] sm:text-[11px] font-medium text-right block opacity-80">
              {course.instructorName}
            </span>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
            {course.subjectName}
          </span>
          <span className="text-xs sm:text-sm text-gray-700 font-bold">
            {course.instructorName}
          </span>
        </div>
        <Link to={`/instructor/${course.instrUuid}/courses/${course.courseSn}`}>
          <h3 className="text-sm sm:text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
            {course.courseName}
          </h3>
        </Link>
        {course.explain && (
          <ul className="hidden sm:block space-y-0.5 pt-0.5">
            {course.explain
              .split("\n")
              .filter((l) => l.trim())
              .slice(0, 2)
              .map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1 text-sm text-gray-500 leading-relaxed"
                >
                  <span className="text-gray-400 shrink-0">·</span>
                  {line.trim()}
                </li>
              ))}
          </ul>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <Link to={`/instructor/${course.instrUuid}/courses/${course.courseSn}`}>
            <span className="inline-flex items-center gap-0.5 text-xs sm:text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors">
              자세히 보기
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
          {/* 모바일: 가격 + 장바구니 인라인 */}
          <div className="flex items-center gap-2 sm:hidden">
            {formattedPrice ? (
              <span className="text-sm font-bold text-gray-900">
                {formattedPrice}
              </span>
            ) : (
              <span className="text-xs text-gray-400">가격 문의</span>
            )}
            <button
              onClick={addToCart}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer"
              title="장바구니 담기"
            >
              <ShoppingCart size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 데스크톱: 가격 + 장바구니 */}
      <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
        {formattedPrice ? (
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-medium mb-0.5">
              강좌 수강료
            </p>
            <p className="text-base font-extrabold text-gray-900">
              {formattedPrice}
            </p>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-xs text-gray-400">가격 문의</p>
          </div>
        )}
        <button
          onClick={addToCart}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
          title="장바구니 담기"
        >
          <ShoppingCart size={15} />
        </button>
      </div>
    </div>
  );
}

// MARK: 전체 강좌 페이지
export default function CourseListPage() {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchOption, setSearchOption] = useState<SearchOption>({
    category: searchParams.get("category") || "courseName",
    keyword: searchParams.get("keyword") || "",
    page: 1,
  });
  const [subjects, setSubjects] = useState<SubjectClassification[]>([]);

  const fetchCourses = async (option: SearchOption) => {
    setLoading(true);
    try {
      const res = await axios.get<CourseListResponse>("/api/course/list", {
        params: {
          category: option.category,
          keyword: option.keyword,
          page: option.page,
        },
      });
      setCourses(res.data.items);
      setTotalCount(res.data.totalCount);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchOption({ category: "courseName", keyword: "", page: 1 });
    fetchCourses({ category: "courseName", keyword: "", page: 1 });
  };

  const getSubjectList = async () => {
    try {
      const res = await axios.get<SubjectClassification[]>(
        "/api/course/subjects",
      );
      setSubjects(res.data);
    } catch (e) {
      console.error("과목 분류 조회 실패", e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses({
      category: searchParams.get("category") || "courseName",
      keyword: searchParams.get("keyword") || "",
      page: 1,
    });
    getSubjectList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchOption((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const next = { ...searchOption, page: 1 };
    setSearchOption(next);
    fetchCourses(next);
  };

  const handlePageChange = (page: number) => {
    const next = { ...searchOption, page };
    setSearchOption(next);
    fetchCourses(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    // MARK: 전체 페이지 컨테이너
    <div className="w-full min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* 상단 히어로 배너 */}
        {/* <div className="bg-linear-to-r from-blue-400 via-blue-500 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
          <p className="text-blue-200 text-sm font-medium mb-1">온라인 강좌</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
            전체 강좌
          </h1>
          <p className="text-blue-100 text-sm">
            원하는 강좌를 검색하고 지금 바로 시작해보세요.
          </p>
        </div>
      </div> */}

        {/* 헤더 */}
        <header className="mb-5">
          <p
            className="text-xs tracking-widest uppercase mb-2 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-mono-editorial)",
            }}
          >
            HERMES · COURSES
          </p>
          <h1
            className="text-5xl md:text-6xl text-zinc-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            전체 강좌
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            원하는 강좌를 검색하고 지금 바로 시작해보세요.
          </p>
        </header>

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-7 ">
          {/* MARK: 검색 */}
          <aside className="w-full shrink-0 ">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <SearchIcon />
                강좌 검색
              </h2>
              <div className="flex flex-col gap-2.5 lg:flex-row">
                <select
                  name="category"
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 w-full lg:w-40 bg-gray-50 text-gray-700 cursor-pointer"
                  value={searchOption.category}
                  onChange={handleInputChange}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="keyword"
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400"
                  placeholder="검색어를 입력하세요"
                  value={searchOption.keyword}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-all duration-150 cursor-pointer w-full lg:w-40 flex items-center justify-center gap-2 shadow-sm"
                >
                  <SearchIcon />
                  검색
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold px-4 py-2.5 rounded-lg transition-all duration-150 cursor-pointer w-full lg:w-40 flex items-center justify-center gap-2 shadow-sm"
                >
                  초기화
                </button>
              </div>

              {/* MARK: 과목 분류 */}
              {/* 일단 임시 비활성화 */}
              <div className="mt-5 pt-4 border-t border-gray-100 hidden">
                <div className="flex flex-col gap-4">
                  {subjects.map((classification) => (
                    <div key={classification.subjClId}>
                      <p className="text-[12px] uppercase tracking-wider text-gray-400 font-bold mb-2">
                        {classification.subjClNm}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {classification.subjects.map((subj) => {
                          const isActive =
                            searchOption.category === "subject" &&
                            searchOption.keyword === subj.subjNm;
                          return (
                            <button
                              key={subj.subjId}
                              onClick={() => {
                                setSearchOption((prev) => ({
                                  ...prev,
                                  category: "subject",
                                  keyword: subj.subjNm,
                                  page: 1,
                                }));
                                fetchCourses({
                                  category: "subject",
                                  keyword: subj.subjNm,
                                  page: 1,
                                });
                              }}
                              className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer ${
                                isActive
                                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                            >
                              {subj.subjNm}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MARK: 메인 콘텐츠 */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between px-1 py-3">
              <span className="text-sm text-gray-600">
                총 <b className="text-gray-900 font-semibold">{totalCount}</b>
                개의 강좌
              </span>
              <button onClick={handleReset} className="cursor-pointer">
                <RefreshCw
                  size={15}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                />
              </button>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm">
                <p className="text-sm text-gray-400">강좌를 불러오는 중...</p>
              </div>
            ) : courses.length > 0 ? (
              <div className="flex flex-col gap-4">
                {courses.map((course) => (
                  <CourseItem key={course.courseSn} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-200 mx-auto mb-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <p className="text-sm text-gray-400 font-medium">
                  해당하는 강좌가 없습니다.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-5">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, searchOption.page - 1))
                  }
                  disabled={searchOption.page === 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-sm"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 flex items-center justify-center border rounded text-xs font-medium transition-colors cursor-pointer
                    ${searchOption.page === p ? "bg-gray-900 text-white border-gray-900" : "text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(totalPages, searchOption.page + 1),
                    )
                  }
                  disabled={searchOption.page === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-sm"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
