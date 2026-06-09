import { useState, useEffect } from "react";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { X, ChevronRight, BookOpen } from "lucide-react";

type ModalType = "careerBook" | null;

// ── 타입 정의 ──────────────────────────────────────────────────────────────

interface CareerDto {
  careerStrtYr: string;
  careerEndYr: string | null;
  careerCont: string;
}

interface BookDto {
  careerStrtYr: string;
  careerCont: string;
}

interface InstructorDetail {
  instrUuid: string;
  userName: string;
  instrIntro: string | null;
  instrProfileImg: string | null;
  subject: string;
  lectureCount: number;
  careers: CareerDto[];
  books: BookDto[];
}

function formatCareerYear(strtYr: string, endYr: string | null) {
  return endYr ? `${strtYr}~${endYr}` : `${strtYr}~현재`;
}

const NAV_LINKS = [
  {
    id: "lecture",
    label: "개설강좌",
    count: null,
    path: (uuid: string) => `/instructor/${uuid}/lectures`,
  },
  {
    id: "notice",
    label: "공지사항",
    count: null,
    path: (uuid: string) => `/instructor/${uuid}/notices`,
  },
  {
    id: "qna",
    label: "선생님 Q&A",
    count: null,
    path: (uuid: string) => `/instructor/${uuid}/qna`,
  },
  {
    id: "material",
    label: "학습자료실",
    count: null,
    path: (uuid: string) => `/instructor/${uuid}/materials`,
  },
];

interface FeaturedCourse {
  courseSn: number;
  courseNm: string;
  display_order: number;
}

interface Post {
  postSn: number;
  title: string;
  regDt: string;
  boardType: "notice" | "qna" | "material";
}

const CARD_COLORS = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-emerald-600",
];

// 커리큘럼 목업
const MOCK_CURRICULUM = {
  subheading: "누군가는 처음부터 다시, 누군가는 더 높이",
  heading: "1년, 여러분의 수학을 설계하고 끝까지 함께합니다.",
  columns: [
    {
      title: "안정 2등급 목표",
      variant: "primary" as const,
      rows: [
        {
          stage: "기초개념",
          courses: [
            {
              badge: "BEST",
              title: "수I·수II 기초완성",
              desc: "개념부터 탄탄하게 잡아주는 All-in-One 기본 강좌",
            },
          ],
        },
        {
          stage: "개념완성",
          courses: [
            {
              badge: "SIGNATURE",
              title: "개념완성 기본편",
              desc: "핵심 개념을 빠르고 정확하게 익히는 단계별 강좌",
            },
          ],
        },
        {
          stage: "유형훈련",
          courses: [
            {
              badge: null,
              title: "유형별 집중공략",
              desc: "수능 출제 유형 전체를 체계적으로 정리",
            },
          ],
        },
        {
          stage: "모의고사",
          courses: [
            {
              badge: null,
              title: "새싹 모의고사",
              desc: "실전 감각을 쌓는 단계별 모의고사 훈련",
            },
            {
              badge: null,
              title: "새싹 모의고사 워크북",
              desc: "모의고사 문제 적용 연습을 위한 워크북 강좌",
            },
          ],
        },
        {
          stage: "파이널",
          courses: [
            {
              badge: null,
              title: "파이널 기출 총정리",
              desc: "수능 직전 핵심 기출만 빠르게 총정리",
            },
          ],
        },
      ],
    },
    {
      title: "만점 / 1등급 목표",
      variant: "secondary" as const,
      rows: [
        {
          stage: "개념심화",
          courses: [
            {
              badge: "SIGNATURE",
              title: "개념완성 심화편",
              desc: "상위권 수험생 대상, 고난도·구문을 집중 공략",
            },
          ],
        },
        {
          stage: "킬러완성",
          courses: [
            {
              badge: null,
              title: "2주완성 단기특강 킬러·준킬러",
              desc: "단 14강으로 킬러 문항 패턴 집중 분석",
            },
            {
              badge: null,
              title: "킬러 완성 심화",
              desc: "최고난도 문항의 숨겨진 풀이 원리 완전 정복",
            },
          ],
        },
        {
          stage: "기출+N제",
          courses: [
            {
              badge: null,
              title: "수능 수학 기출 공식",
              desc: "등급을 올리는 기출 60% 이상과 자체제작 N제 수록",
            },
          ],
        },
        {
          stage: "파이널",
          courses: [
            {
              badge: null,
              title: "심화 파이널",
              desc: "최고난도 문항으로 실전 감각 완성",
            },
          ],
        },
      ],
    },
  ],
  supplements: [
    {
      type: "기출분석",
      items: ["기출 분석 자료집 (PDF)", "평가원 핵심 기출 모음"],
    },
    { type: "워크북", items: ["단원별 연습 문제지"] },
    { type: "특강", items: ["오답 클리닉 특강", "오답 클리닉 PRO"] },
  ],
};

function formatPostDate(regDt: string) {
  const d = new Date(regDt);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

function isNewPost(regDt: string) {
  return Date.now() - new Date(regDt).getTime() < 7 * 24 * 60 * 60 * 1000;
}

// ──────────────────────────────────────────────────────────────────────────────

// ── 커리큘럼 섹션 ──────────────────────────────────────────────────────────────

function CourseBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    BEST: "bg-blue-600 text-white",
    SIGNATURE: "bg-purple-600 text-white",
    NEW: "bg-green-600 text-white",
  };
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5 ${styles[label] ?? "bg-gray-200 text-gray-600"}`}
    >
      {label}
    </span>
  );
}

function CurriculumSection() {
  const { columns, supplements, heading, subheading } = MOCK_CURRICULUM;

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 헤딩 */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 mb-1">{subheading}</p>
          <h2 className="text-xl font-extrabold text-gray-900">{heading}</h2>
        </div>

        {/* 두 컬럼 테이블 */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          {columns.map((col) => {
            const isPrimary = col.variant === "primary";
            return (
              <div
                key={col.title}
                className="border border-gray-200 overflow-hidden"
              >
                {/* 컬럼 헤더 */}
                <div
                  className={`px-4 py-3 text-center font-bold text-sm ${isPrimary ? "bg-blue-600 text-white" : "bg-indigo-100 text-indigo-800"}`}
                >
                  {col.title}
                </div>

                {/* 행 목록 */}
                <div className="divide-y divide-gray-100">
                  {col.rows.map((row) =>
                    row.courses.map((course, ci) => (
                      <div
                        key={`${row.stage}-${ci}`}
                        className="flex items-stretch hover:bg-gray-50 cursor-pointer group transition-colors"
                      >
                        {/* 단계 라벨 — 첫 번째 강좌에만 표시, rowspan 효과 */}
                        <div
                          className={`w-20 shrink-0 flex items-center justify-center border-r border-gray-100 px-2 py-3 ${isPrimary ? "bg-blue-50" : "bg-indigo-50"}`}
                        >
                          {ci === 0 && (
                            <span
                              className={`text-xs font-bold text-center leading-tight ${isPrimary ? "text-blue-700" : "text-indigo-700"}`}
                            >
                              {row.stage}
                            </span>
                          )}
                        </div>

                        {/* 강좌 정보 */}
                        <div className="flex-1 px-4 py-3">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">
                            {course.badge && (
                              <CourseBadge label={course.badge} />
                            )}
                            {course.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                            {course.desc}
                          </p>
                        </div>
                      </div>
                    )),
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 보충 학습 */}
        <div className="border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-0.5">
              보충 학습이 필요하다고 느낄 때 추천!
            </p>
            <p className="text-sm font-bold text-gray-800">
              수학 실력 Upgrade를 위한 추가 강좌
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {supplements.map((sup) => (
              <div key={sup.type} className="flex items-stretch">
                <div className="w-24 shrink-0 flex items-center justify-center bg-gray-50 border-r border-gray-100 px-3 py-4">
                  <span className="text-xs font-bold text-gray-600">
                    {sup.type}
                  </span>
                </div>
                <div className="flex-1 divide-y divide-gray-50">
                  {sup.items.map((item) => (
                    <div
                      key={item}
                      className="px-6 py-3 text-sm text-gray-700 text-center hover:bg-gray-50 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function CareerBookModal({
  onClose,
  careers,
  books,
}: {
  onClose: () => void;
  careers: CareerDto[];
  books: BookDto[];
}) {
  const hasCareer = careers.length > 0;
  const hasBooks = books.length > 0;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 shadow-2xl w-[480px] max-h-[70vh] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">약력 / 저서</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="overflow-y-auto px-5 py-4 space-y-6">
        {hasCareer && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              약력
            </h3>
            <div className="space-y-2.5">
              {careers.map((c, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <ChevronRight
                    size={14}
                    className="text-blue-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="text-gray-400 text-xs mr-2">
                      {formatCareerYear(c.careerStrtYr, c.careerEndYr)}
                    </span>
                    <span className="text-gray-800">{c.careerCont}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {hasBooks && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              저서
            </h3>
            <div className="space-y-2.5">
              {books.map((b, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <BookOpen
                    size={14}
                    className="text-orange-400 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {b.careerCont}
                    </p>
                    <p className="text-xs text-gray-400">{b.careerStrtYr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstructorDetailPage() {
  const { instrUuid } = useParams<{ instrUuid: string }>();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalType>(null);
  const [instructor, setInstructor] = useState<InstructorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuredCourses, setFeaturedCourses] = useState<FeaturedCourse[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const uuid = instrUuid ?? "";

  useEffect(() => {
    if (!uuid) return;
    Promise.all([
      api.get<InstructorDetail>(`/api/instructors/${uuid}`),
      api.get<FeaturedCourse[]>(`/api/instructors/${uuid}/featured-courses`),
      api.get<Post[]>(`/api/instructors/${uuid}/posts?size=5`),
    ])
      .then(([instrRes, featuredRes, postsRes]) => {
        setInstructor(instrRes.data);
        setFeaturedCourses(featuredRes.data);
        setPosts(postsRes.data);
      })
      .catch((e) => console.error("강사 정보 조회 실패", e))
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
        <div className="max-w-6xl mx-auto flex min-h-screen">
          {/* ── 좌측 네비 ── */}
          <div className="w-52 shrink-0 flex flex-col pt-12 px-6 pb-10">
            {/* 강사명 */}
            <p className="text-xs text-gray-400 mb-1 tracking-wide">
              {instructor.subject}영역
            </p>
            <h1 className="text-2xl font-extrabold text-white leading-tight mb-5">
              {instructor.userName} 선생님
            </h1>

            {/* 버튼 */}
            <div className="flex gap-2 mb-8">
              {/* <button className="text-[11px] px-2.5 py-1 border border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors rounded">
                인사 영상
              </button> */}
              {hasCareerOrBook && (
                <button
                  onClick={() => setModal("careerBook")}
                  className="text-[11px] px-2.5 py-1 border border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors rounded"
                >
                  약력/저서
                </button>
              )}
            </div>

            {/* 게시판 링크 */}
            <nav className="flex-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.path(uuid))}
                  className="w-full text-left py-3 border-b border-gray-600/60 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>
                    {link.label}
                    {link.id === "lecture" ? (
                      <span className="ml-1.5 text-gray-500">
                        ({instructor.lectureCount})
                      </span>
                    ) : (
                      link.count !== null && (
                        <span className="ml-1.5 text-gray-500">
                          ({link.count})
                        </span>
                      )
                    )}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-gray-600 group-hover:text-gray-400 transition-colors"
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* ── 중앙 사진 ── */}
          <div className="flex-1 relative overflow-hidden">
            {instructor.instrProfileImg ? (
              <img
                src={instructor.instrProfileImg}
                alt={instructor.userName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              /* 사진 없을 때 플레이스홀더 */
              <div className="w-full h-full flex flex-col items-center justify-center select-none">
                <span className="text-[200px] font-extrabold text-white/5 leading-none">
                  {instructor.userName[0]}
                </span>
                <p className="text-gray-500 text-sm mt-4">
                  {instructor.instrIntro}
                </p>
              </div>
            )}

            {/* 캐치프레이즈 오버레이 */}
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
          <div className="w-72 shrink-0 flex flex-col pt-12 px-5 pb-10 gap-6">
            {/* 2×2 대표 강좌 카드 */}
            {featuredCourses.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {featuredCourses.map((course, idx) => (
                  <button
                    key={course.courseSn}
                    onClick={() => navigate(`/course/${course.courseSn}`)}
                    className={`${CARD_COLORS[idx % CARD_COLORS.length]} p-4 text-left cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity aspect-square flex flex-col justify-end`}
                  >
                    <p className="text-sm font-extrabold text-white leading-tight">
                      {course.courseNm}
                    </p>
                  </button>
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
                  <li
                    key={post.postSn}
                    className="flex items-start gap-2 cursor-pointer group"
                  >
                    <span className="text-gray-500 text-xs mt-0.5 shrink-0">
                      ·
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* bg-gray-700 end */}

      <CurriculumSection />
    </div>
  );
}
