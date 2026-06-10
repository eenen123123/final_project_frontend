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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function CourseBadges({ course }: { course: Course }) {
  return (
    <div className="flex flex-wrap gap-1 mb-1">
      {course.isNew && (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-800 text-white">
          NEW
        </span>
      )}
      {course.isBest && (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
          BEST
        </span>
      )}
      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
        인기
      </span>
      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 border border-purple-300">
        추천
      </span>
    </div>
  );
}

function CourseItem({ course }: { course: Course }) {
  const formattedPrice = course.coursePrice
    ? course.coursePrice.toLocaleString() + "원"
    : null;

  return (
    <li className="flex items-start gap-4 py-5 px-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* 왼쪽: 뱃지 + 제목 + 부제목 + 링크 */}
      <div className="flex-1 min-w-0">
        <CourseBadges course={course} />
        <Link to={`/courses/${course.courseSn}`}>
          <p className="text-sm font-bold text-gray-900 leading-snug mb-0.5">
            {course.courseName}
          </p>
        </Link>
        <p className="text-xs text-gray-500 mb-1 truncate">
          {course.subjectName} · {course.instructorName}
          {course.explain ? ` · ${course.explain}` : ""}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Link to={`/courses/${course.courseSn}`}>
            <span className="hover:text-gray-600 cursor-pointer">
              자세히보기 &gt;
            </span>
          </Link>
        </div>
      </div>

      {/* 가운데: OT / 맛보기 버튼 */}
      <div className="flex flex-col gap-1.5 flex-shrink-0 items-center">
        {/* <button className="text-xs border border-gray-400 text-gray-600 rounded px-4 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer w-20 text-center">
          OT
        </button>
        <button className="text-xs border border-gray-400 text-gray-600 rounded px-4 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer w-20 text-center">
          맛보기
        </button> */}
      </div>

      {/* 오른쪽: 가격 */}
      <div className="flex-shrink-0 text-right min-w-[90px]">
        {formattedPrice ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-end gap-1.5 text-xs text-gray-600">
              <span className="text-gray-400">강좌</span>
              <span className="font-semibold text-gray-900">
                {formattedPrice}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">가격 문의</span>
        )}
      </div>

      {/* 장바구니 버튼 */}
      <div className="flex-shrink-0 flex flex-col gap-1.5 items-center">
        <button
          className="w-10 h-10 flex items-center justify-center border-2 border-orange-400 text-orange-400 rounded hover:bg-orange-50 transition-colors cursor-pointer"
          title="장바구니 담기"
        >
          <CartIcon />
        </button>
      </div>
    </li>
  );
}

export default function CourseListPage() {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
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
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex gap-8 items-start">
      {/* 사이드바 */}
      <aside className="w-56 flex-shrink-0 sticky top-8">
        <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          강좌 검색
        </h2>
        <div className="flex flex-col gap-3">
          <select
            name="category"
            className="border border-gray-300 rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-400 w-full"
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
            className="border border-gray-300 rounded text-sm px-3 py-2 w-full focus:outline-none focus:border-blue-400"
            placeholder="검색어 입력"
            value={searchOption.keyword}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-gray-700 hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded transition-colors cursor-pointer w-full"
          >
            검색
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          강좌 목록
        </h1>
        <div className="border-t-2 border-gray-800">
          {loading ? (
            <p className="py-16 text-center text-sm text-gray-400">
              불러오는 중...
            </p>
          ) : courses.length > 0 ? (
            <ul>
              {courses.map((course) => (
                <CourseItem key={course.courseSn} course={course} />
              ))}
            </ul>
          ) : (
            <p className="py-16 text-center text-sm text-gray-400">
              강좌가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
