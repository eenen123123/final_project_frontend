import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const CATEGORY_OPTIONS = [
  { value: "courseName", label: "강좌 이름" },
  { value: "subject", label: "과목" },
  { value: "instructor", label: "선생님" },
];

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
  coursePrice?: number;
  explain: string;
  isBest: boolean;
  isNew: boolean;
}

function CartIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

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

function CourseBadges({ course }: { course: Course }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {course.isNew && (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-linear-to-r from-slate-700 to-slate-900 text-white tracking-wide shadow-sm">
          NEW
        </span>
      )}
      {course.isBest && (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-linear-to-r from-emerald-500 to-green-500 text-white tracking-wide shadow-sm">
          BEST
        </span>
      )}
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
        🔥 인기
      </span>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">
        ⭐ 추천
      </span>
    </div>
  );
}

function CourseItem({ course }: { course: Course }) {
  const formattedPrice = course.coursePrice
    ? course.coursePrice.toLocaleString() + "원"
    : null;

  return (
    <li className="group flex items-center gap-5 py-5 px-5 border-b border-gray-100 hover:bg-linear-to-r hover:from-blue-50/40 hover:to-transparent transition-all duration-200">
      {/* 과목 아이콘 */}
      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-500 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
        <BookIcon />
      </div>

      {/* 왼쪽: 뱃지 + 제목 + 메타 */}
      <div className="flex-1 min-w-0">
        <CourseBadges course={course} />
        <Link to={`/courses/${course.courseSn}`}>
          <p className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-blue-700 transition-colors">
            {course.courseName}
          </p>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 font-medium">
            {course.subjectName}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-500">{course.instructorName}</span>
          {course.explain && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-gray-400 truncate max-w-[200px]">
                {course.explain}
              </span>
            </>
          )}
        </div>
        <Link to={`/courses/${course.courseSn}`}>
          <span className="inline-flex items-center gap-0.5 text-[11px] text-blue-500 hover:text-blue-700 font-medium transition-colors">
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
      </div>

      {/* 오른쪽: 가격 + 장바구니 */}
      <div className="shrink-0 flex flex-col items-end gap-2">
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-orange-400 text-orange-500 text-xs font-semibold hover:bg-orange-400 hover:text-white transition-all duration-150 cursor-pointer shadow-sm"
          title="장바구니 담기"
        >
          <CartIcon />
          <span>담기</span>
        </button>
      </div>
    </li>
  );
}

function SkeletonItem() {
  return (
    <li className="flex items-center gap-5 py-5 px-5 border-b border-gray-100 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex gap-1.5">
          <div className="h-4 w-10 rounded-full bg-gray-100" />
          <div className="h-4 w-10 rounded-full bg-gray-100" />
        </div>
        <div className="h-4 w-2/3 rounded bg-gray-100" />
        <div className="h-3 w-1/3 rounded bg-gray-100" />
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2">
        <div className="h-4 w-20 rounded bg-gray-100" />
        <div className="h-7 w-16 rounded-lg bg-gray-100" />
      </div>
    </li>
  );
}

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses({
      category: searchParams.get("category") || "courseName",
      keyword: searchParams.get("keyword") || "",
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchOption((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => fetchCourses(searchOption);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 히어로 배너 */}
      <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
          <p className="text-blue-200 text-sm font-medium mb-1">온라인 강좌</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
            전체 강좌
          </h1>
          <p className="text-blue-100 text-sm">
            원하는 강좌를 검색하고 지금 바로 시작해보세요.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex gap-7 items-start">
        {/* 사이드바 */}
        <aside className="w-56 shrink-0 sticky top-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <SearchIcon />
              강좌 검색
            </h2>
            <div className="flex flex-col gap-2.5">
              <select
                name="category"
                className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 w-full bg-gray-50 text-gray-700 cursor-pointer"
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
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-all duration-150 cursor-pointer w-full flex items-center justify-center gap-2 shadow-sm"
              >
                <SearchIcon />
                검색
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-2">
                빠른 선택
              </p>
              <div className="flex flex-col gap-1">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setSearchOption((prev) => ({
                        ...prev,
                        category: opt.value,
                      }))
                    }
                    className={`text-xs px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      searchOption.category === opt.value
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800">강좌 목록</h2>
              {!loading && (
                <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                  {totalCount > 0 ? `${totalCount}개` : `${courses.length}개`}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <ul>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonItem key={i} />
                ))}
              </ul>
            ) : courses.length > 0 ? (
              <ul>
                {courses.map((course) => (
                  <CourseItem key={course.courseSn} course={course} />
                ))}
              </ul>
            ) : (
              <div className="py-24 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                  <BookIcon />
                </div>
                <p className="text-sm font-semibold text-gray-500">
                  강좌가 없습니다
                </p>
                <p className="text-xs text-gray-400">
                  다른 검색어로 시도해 보세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
