import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";

function CartIcon() {
  return (
    <svg
      width="15"
      height="15"
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

interface Course {
  courseSn: number;
  title: string;
  price: number;
  thumbnailUrl: string | null;
  category: string | null;
  rating: number | null;
  studentCount: number;
}

const PAGE_SIZE = 9;
const BLOCK_SIZE = 5;

const SEARCH_OPTIONS = [
  { value: "title", label: "강좌 이름" },
  { value: "category", label: "과목" },
];

export default function CoursesTab() {
  const { instrUuid } = useParams<{ instrUuid: string }>();
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(!!instrUuid);
  const [page, setPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("title");

  useEffect(() => {
    if (!instrUuid) return;
    let cancelled = false;
    api
      .get<Course[]>(`/api/instructors/${instrUuid}/courses`)
      .then((res) => {
        if (!cancelled) setAllCourses(res.data);
      })
      .catch((e) => {
        if (!cancelled) console.error("강좌 목록 조회 실패", e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [instrUuid]);

  const filtered = allCourses.filter((course) => {
    if (!appliedKeyword) return true;
    const target =
      appliedCategory === "title" ? course.title : (course.category ?? "");
    return target.toLowerCase().includes(appliedKeyword.toLowerCase());
  });

  const totalCount = filtered.length;
  const courses = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = () => {
    setAppliedKeyword(keyword);
    setAppliedCategory(searchCategory);
    setPage(1);
  };

  const handleReset = () => {
    setKeyword("");
    setAppliedKeyword("");
    setSearchCategory("title");
    setAppliedCategory("title");
    setPage(1);
  };

  const addToCart = async (e: React.MouseEvent, courseSn: number) => {
    e.stopPropagation();
    try {
      const res = await api.post("/api/cart", {
        prodDivCd: "COURSE",
        prodSn: courseSn,
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

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentBlock = Math.ceil(page / BLOCK_SIZE);
  const startPage = (currentBlock - 1) * BLOCK_SIZE + 1;
  const endPage = Math.min(totalPages, currentBlock * BLOCK_SIZE);

  if (loading) {
    return <p className="text-sm text-gray-400">강좌 목록을 불러오는 중...</p>;
  }

  if (!loading && allCourses.length === 0) {
    return <p className="text-sm text-gray-400">등록된 강좌가 없습니다.</p>;
  }

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-xl font-extrabold text-gray-900">강좌목록</h2>
        <span className="text-sm text-gray-400">{totalCount}개</span>
      </div>

      {/* 검색 */}
      <div className="flex flex-col gap-2 sm:flex-row mb-6">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 cursor-pointer sm:w-36"
        >
          {SEARCH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="검색어를 입력하세요"
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          검색
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          초기화
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-sm text-gray-400">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.courseSn}
              onClick={() =>
                navigate(`/instructor/${instrUuid}/courses/${course.courseSn}`)
              }
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative w-full aspect-video bg-gray-100 overflow-hidden flex items-center justify-center">
                {course.thumbnailUrl ? (
                  <>
                    <img
                      src={course.thumbnailUrl}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
                    />
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="relative h-full w-auto object-contain"
                    />
                  </>
                ) : (
                  <span className="text-gray-300 text-sm">{course.category}</span>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-blue-500 font-medium mb-1 min-h-[1rem]">
                  {course.category ?? ""}
                </p>
                <h3 className="text-sm font-bold text-gray-800 leading-snug mb-3 line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-gray-900">
                    {course.price === 0
                      ? "무료"
                      : `${course.price.toLocaleString()}원`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-blue-600 bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 hover:border-blue-700 transition-all duration-150 cursor-pointer shadow-sm">
                      수강신청
                    </button>
                    <button
                      onClick={(e) => addToCart(e, course.courseSn)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-orange-400 text-orange-500 text-xs font-semibold hover:bg-orange-400 hover:text-white transition-all duration-150 cursor-pointer shadow-sm"
                      title="장바구니 담기"
                    >
                      <CartIcon />
                      {/* <span>담기</span> */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default cursor-pointer text-sm transition-colors"
            title="첫 페이지"
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default cursor-pointer text-sm transition-colors"
            title="이전 페이지"
          >
            ‹
          </button>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i,
          ).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${page === p
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default cursor-pointer text-sm transition-colors"
            title="다음 페이지"
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default cursor-pointer text-sm transition-colors"
            title="마지막 페이지"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}
