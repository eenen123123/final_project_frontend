import { useState, useEffect } from "react";
import api from "../../api/api";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, BookOpen } from "lucide-react";
import type {
  InstructorDetail,
  FeaturedCourse,
  Post,
} from "./InstructorDetail/types";
import { formatPostDate, isNewPost, formatCareerYear } from "./InstructorDetail/utils";

const NAV_LINKS = [
  {
    id: "courses",
    label: "강좌목록",
    path: (uuid: string) => `/instructor/${uuid}/courses`,
  },
  {
    id: "notice",
    label: "공지사항",
    path: (uuid: string) => `/instructor/${uuid}/notice`,
  },
  {
    id: "qna",
    label: "강사 Q&A",
    path: (uuid: string) => `/instructor/${uuid}/qna`,
  },
  {
    id: "dataroom",
    label: "학습자료실",
    path: (uuid: string) => `/instructor/${uuid}/dataroom`,
  },
];

const BOARD_TYPE_LABEL: Record<string, { label: string; className: string }> = {
  notice: { label: "공지", className: "text-amber-400" },
  qna: { label: "Q&A", className: "text-emerald-400" },
  dataroom: { label: "자료", className: "text-blue-400" },
};

const CARD_COLORS = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-emerald-600",
];

export default function InstructorDetailPage() {
  const { instrUuid } = useParams<{ instrUuid: string }>();
  const [instructor, setInstructor] = useState<InstructorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuredCourses, setFeaturedCourses] = useState<FeaturedCourse[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const uuid = instrUuid ?? "";

  useEffect(() => {
    if (!uuid) return;
    Promise.allSettled([
      api.get<InstructorDetail>(`/api/instructors/${uuid}`),
      api.get<FeaturedCourse[]>(`/api/instructors/${uuid}/featured-courses`),
      api.get<Post[]>(`/api/instructors/${uuid}/posts?size=5`),
    ])
      .then(([instrRes, featuredRes, postsRes]) => {
        if (instrRes.status === "fulfilled") setInstructor(instrRes.value.data);
        else console.error("강사 정보 조회 실패", instrRes.reason);
        if (featuredRes.status === "fulfilled")
          setFeaturedCourses(featuredRes.value.data);
        else console.error("추천 강좌 조회 실패", featuredRes.reason);
        if (postsRes.status === "fulfilled") setPosts(postsRes.value.data);
        else console.error("최신 소식 조회 실패", postsRes.reason);
      })
      .finally(() => setLoading(false));
  }, [uuid]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">강사 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">강사 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      {/* ── 히어로 ── */}
      <div className="w-full bg-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:min-h-screen">
          {/* ── 좌측 네비 ── */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col pt-8 lg:pt-12 px-6 pb-10 order-2 lg:order-1">
            <p className="text-sm text-gray-500 mb-1 tracking-wide">
              {instructor.subject}영역
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-5">
              {instructor.userName} 강사
            </h1>

            <nav className="flex-1 mt-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  to={link.path(uuid)}
                  className="w-full text-left py-3 border-b border-gray-300/60 text-base text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-between group"
                >
                  <span>
                    {link.label}
                    {link.id === "courses" && (
                      <span className="ml-1.5 text-gray-400">
                        ({instructor.lectureCount})
                      </span>
                    )}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* ── 중앙 사진 ── */}
          <div className="order-1 lg:order-2 lg:flex-1 relative overflow-hidden h-80 sm:h-96 lg:h-auto">
            {instructor.instrProfileImg ? (
              <img
                src={instructor.instrProfileImg}
                alt={instructor.userName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center select-none">
                <span className="text-[200px] font-extrabold text-gray-900/5 leading-none">
                  {instructor.userName[0]}
                </span>
              </div>
            )}

            {instructor.instrIntro && (
              <div className="absolute bottom-36 left-0 right-0 flex justify-center px-6">
                <p
                  className="text-white text-4xl font-extrabold leading-snug text-center"
                  style={{ background: "rgba(0,0,0,0.5)", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", padding: "0.25rem 0.75rem" }}
                >
                  {instructor.instrIntro}
                </p>
              </div>
            )}
          </div>

          {/* ── 우측: 시리즈 카드 + 최신소식 ── */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col pt-8 lg:pt-12 px-5 pb-10 gap-6 order-3">
            {featuredCourses.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {featuredCourses.map((course, idx) => (
                  <Link
                    key={course.courseSn}
                    to={`/instructor/${uuid}/courses/${course.courseSn}`}
                    className={`${CARD_COLORS[idx % CARD_COLORS.length]} p-4 text-left cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity aspect-square flex flex-col justify-end`}
                  >
                    <p className="text-sm font-extrabold text-white leading-tight">
                      {course.courseNm}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {/* 최신소식 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-base font-bold text-gray-800">최신 소식</h3>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li key={post.postSn}>
                    <Link
                      to={`/instructor/${uuid}/${post.boardType}/${post.postSn}`}
                      className="flex items-start gap-2 group"
                    >
                      <span className="text-gray-400 text-xs mt-0.5 shrink-0">
                        ·
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-snug line-clamp-2">
                          <span
                            className={`font-bold mr-1 ${BOARD_TYPE_LABEL[post.boardType]?.className}`}
                          >
                            [{BOARD_TYPE_LABEL[post.boardType]?.label}]
                          </span>
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatPostDate(post.regDt)}
                        </p>
                      </div>
                      {isNewPost(post.regDt) && (
                        <span className="text-[10px] font-bold text-blue-400 shrink-0 mt-0.5">
                          N
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── 약력 / 저서 ── */}
      {(instructor.careers.length > 0 || instructor.books.length > 0) && (
        <div className="w-full bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
            {instructor.careers.length > 0 && (
              <div className="flex-1">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">약력</h2>
                <div className="space-y-4">
                  {instructor.careers.map((c, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <ChevronRight size={14} className="text-blue-500 shrink-0 mt-1" />
                      <div>
                        <span className="text-xs text-gray-400 mr-2">{formatCareerYear(c.careerStrtYr, c.careerEndYr)}</span>
                        <span className="text-sm text-gray-800">{c.careerCont}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {instructor.books.length > 0 && (
              <div className="flex-1">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">저서</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {instructor.books.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50">
                      <BookOpen size={16} className="text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 leading-snug">{b.careerCont}</p>
                        <p className="text-xs text-gray-400 mt-1">{b.careerStrtYr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
