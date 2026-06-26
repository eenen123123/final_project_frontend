import { useState, useEffect } from "react";
import api from "../../api/api";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type {
  InstructorDetail,
  FeaturedCourse,
  Post,
} from "./InstructorDetail/types";
import { formatPostDate, isNewPost } from "./InstructorDetail/utils";
import CareerBookModal from "./InstructorDetail/CareerBookModal";
import CurriculumSection from "./InstructorDetail/CurriculumSection";

type ModalType = "careerBook" | null;

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
    label: "선생님 Q&A",
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
  const [modal, setModal] = useState<ModalType>(null);
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

  const hasCareerOrBook =
    (instructor?.careers.length ?? 0) > 0 ||
    (instructor?.books.length ?? 0) > 0;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-700 flex items-center justify-center">
        <p className="text-gray-400 text-sm">강사 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="w-full min-h-screen bg-gray-700 flex items-center justify-center">
        <p className="text-gray-400 text-sm">강사 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      {modal === "careerBook" && (
        <CareerBookModal
          onClose={() => setModal(null)}
          careers={instructor.careers}
          books={instructor.books}
        />
      )}

      {/* ── 히어로: 어두운 배경 ── */}
      <div className="w-full bg-gray-700">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:min-h-screen">
          {/* ── 좌측 네비 ── */}
          <div className="w-full lg:w-52 shrink-0 flex flex-col pt-8 lg:pt-12 px-6 pb-10 order-2 lg:order-1">
            <p className="text-xs text-gray-400 mb-1 tracking-wide">
              {instructor.subject}영역
            </p>
            <h1 className="text-2xl font-extrabold text-white leading-tight mb-5">
              {instructor.userName} 선생님
            </h1>

            <div className="flex gap-2 mb-8">
              {hasCareerOrBook && (
                <button
                  onClick={() => setModal("careerBook")}
                  className="text-[11px] px-2.5 py-1 border border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors rounded cursor-pointer"
                >
                  약력/저서
                </button>
              )}
            </div>

            <nav className="flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  to={link.path(uuid)}
                  className="w-full text-left py-3 border-b border-gray-600/60 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>
                    {link.label}
                    {link.id === "courses" && (
                      <span className="ml-1.5 text-gray-500">
                        ({instructor.lectureCount})
                      </span>
                    )}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-gray-600 group-hover:text-gray-400 transition-colors"
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
              <div className="w-full h-full flex flex-col items-center justify-center select-none">
                <span className="text-[200px] font-extrabold text-white/5 leading-none">
                  {instructor.userName[0]}
                </span>
                <p className="text-gray-500 text-sm mt-4">
                  {instructor.instrIntro}
                </p>
              </div>
            )}

            {instructor.instrIntro && (
              <div className="absolute bottom-8 left-6 right-6">
                <p
                  className="text-white text-xl font-extrabold leading-snug drop-shadow-lg"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                >
                  {instructor.instrIntro}
                </p>
              </div>
            )}
          </div>

          {/* ── 우측: 시리즈 카드 + 최신소식 ── */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col pt-8 lg:pt-12 px-5 pb-10 gap-6 order-3">
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
                <h3 className="text-sm font-bold text-white">최신 소식</h3>
                <div className="flex-1 h-px bg-gray-600" />
              </div>
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li key={post.postSn}>
                    <Link
                      to={`/instructor/${uuid}/${post.boardType}/${post.postSn}`}
                      className="flex items-start gap-2 group"
                    >
                      <span className="text-gray-500 text-xs mt-0.5 shrink-0">
                        ·
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
                          <span
                            className={`font-bold mr-1 ${BOARD_TYPE_LABEL[post.boardType]?.className}`}
                          >
                            [{BOARD_TYPE_LABEL[post.boardType]?.label}]
                          </span>
                          {post.title}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
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

      {/* 커리큘럼 목 데이터 임시 비활성화 */}
      {/* <CurriculumSection /> */}
    </div>
  );
}
