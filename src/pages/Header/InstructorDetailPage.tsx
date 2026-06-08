import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BookOpen, Star, ChevronRight } from "lucide-react";
import api from "../../api/api";

type TabType = "lecture" | "career" | "book" | "review";

const TABS: { id: TabType; label: string }[] = [
  { id: "lecture", label: "강좌" },
  { id: "career", label: "약력" },
  { id: "book", label: "교재" },
  { id: "review", label: "수강후기" },
];

interface Career {
  careerSn: number;
  careerTypeCd: string;
  careerStrtYr: string;
  careerEndYr: string | null;
  careerCont: string;
  sortOrd: number;
}

const CAREER_TYPE_LABEL: Record<string, string> = {
  "01": "약력",
  "02": "저서",
  "03": "수상",
  "04": "방송",
};

interface InstructorDetail {
  instrUuid: string;
  userName: string;
  instrIntro: string;
  instrProfileImg: string | null;
  careers: Career[];
}

interface Lecture {
  id: number;
  title: string;
  category: string;
  price: number;
  students: number;
  thumbnail: string | null;
}

interface Book {
  id: number;
  title: string;
  price: number;
  thumbnail: string | null;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
}

// ── 더미 데이터 (API 연동 전 참고용) ──────────────────────────────────────
// const MOCK_LECTURES: Lecture[] = [
//   { id: 1, title: "2025 수능 수학 완성", category: "수능대비", price: 120000, students: 3241, thumbnail: null },
//   { id: 2, title: "수학I·II 개념완성", category: "개념", price: 95000, students: 5812, thumbnail: null },
//   { id: 3, title: "확률과 통계 집중공략", category: "단원별", price: 78000, students: 2104, thumbnail: null },
//   { id: 4, title: "미적분 심화 마스터", category: "심화", price: 88000, students: 1893, thumbnail: null },
// ];
// const MOCK_BOOKS: Book[] = [
//   { id: 1, title: "홍길동의 수학의 정석", price: 22000, thumbnail: null },
//   { id: 2, title: "수능 수학 파이널 모의고사", price: 18000, thumbnail: null },
//   { id: 3, title: "개념 완성 수학I", price: 16000, thumbnail: null },
// ];
// const MOCK_REVIEWS: Review[] = [
//   { id: 1, author: "수***생", rating: 5, date: "2025.05.12", content: "개념 설명이 정말 명쾌해요. 수학 포기자였는데 이 강의 듣고 자신감이 생겼습니다." },
//   { id: 2, author: "고***3", rating: 5, date: "2025.04.28", content: "문제 풀이 과정을 단계별로 설명해주셔서 따라가기 쉬웠어요. 강추합니다!" },
//   { id: 3, author: "n***수", rating: 4, date: "2025.04.15", content: "내용은 좋은데 강의 속도가 조금 빠른 편이에요. 그래도 복습하면서 들으니 많이 도움됐습니다." },
// ];
// ──────────────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-gray-400 py-8 text-center">{message}</p>;
}

export default function InstructorDetailPage() {
  const { instrUuid } = useParams<{ instrUuid: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("lecture");

  const [instructor, setInstructor] = useState<InstructorDetail | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!instrUuid) return;
    api.get(`/api/instructors/${instrUuid}`)
      .then((profileRes) => {
        setInstructor(profileRes.data);
        // TODO: 백엔드 구현 후 주석 해제
        // api.get(`/api/instructors/${instrUuid}/lectures`).then(r => setLectures(r.data));
        // api.get(`/api/instructors/${instrUuid}/books`).then(r => setBooks(r.data));
        // api.get(`/api/instructors/${instrUuid}/reviews`).then(r => setReviews(r.data));
      })
      .catch((err) => {
        setError(err?.response?.status ? `${err.response.status} ${err.response.statusText}` : err.message);
      })
      .finally(() => setLoading(false));
  }, [instrUuid]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-sm text-gray-400">불러오는 중...</div>;
  }
  if (error || !instructor) {
    return <div className="flex items-center justify-center min-h-screen text-sm text-red-400">강사 정보를 불러오지 못했습니다. ({error})</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 font-sans">

      {/* ── 프로필 배너 ── */}
      <div className="w-full bg-gray-800 overflow-hidden">
        <div className="max-w-6xl mx-auto flex items-end">

          {/* 프로필 사진 */}
          <div className="w-56 h-72 shrink-0 bg-gray-700 flex items-center justify-center overflow-hidden">
            {instructor.instrProfileImg ? (
              <img
                src={instructor.instrProfileImg}
                alt={instructor.userName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span className="text-8xl font-bold text-white/10 select-none">
                {instructor.userName[0]}
              </span>
            )}
          </div>

          {/* 강사 정보 */}
          <div className="px-10 py-8 flex-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              {instructor.userName} 선생님
            </h1>
            {instructor.instrIntro && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                {instructor.instrIntro}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ── 본문: 사이드바 + 콘텐츠 ── */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6 items-start">

        {/* 좌측 사이드바 네비 */}
        <aside className="w-44 shrink-0 sticky top-4">
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <p className="text-sm font-bold text-white truncate">{instructor.userName} 선생님</p>
            </div>
            <nav className="divide-y divide-gray-100">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 font-semibold bg-blue-50 border-l-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 우측 콘텐츠 */}
        <div className="flex-1 min-w-0">

        {/* 강좌 */}
        {activeTab === "lecture" && (
          lectures.length === 0 ? <EmptyState message="등록된 강좌가 없습니다." /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lectures.map((lec) => (
                <div
                  key={lec.id}
                  className="bg-white border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="h-36 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    {lec.thumbnail ? (
                      <img src={lec.thumbnail} alt={lec.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={32} className="text-blue-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2 inline-block">
                      {lec.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors mb-3">
                      {lec.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">수강생 {lec.students.toLocaleString()}명</span>
                      <span className="text-sm font-bold text-gray-900">{lec.price.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* 약력 */}
        {activeTab === "career" && (
          instructor.careers.length === 0 ? <EmptyState message="등록된 약력이 없습니다." /> : (
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">강사 약력</h2>
              <ul className="space-y-3">
                {instructor.careers.map((career) => (
                  <li key={career.careerSn} className="flex items-start gap-3 text-sm text-gray-700">
                    <ChevronRight size={15} className="text-blue-500 shrink-0 mt-0.5" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                        {CAREER_TYPE_LABEL[career.careerTypeCd] ?? career.careerTypeCd}
                      </span>
                      <span>
                        {career.careerStrtYr}{career.careerEndYr ? `–${career.careerEndYr}` : ""} {career.careerCont}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        {/* 교재 */}
        {activeTab === "book" && (
          books.length === 0 ? <EmptyState message="등록된 교재가 없습니다." /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="h-44 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
                    {book.thumbnail ? (
                      <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={28} className="text-orange-300" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug mb-1">
                      {book.title}
                    </p>
                    <p className="text-sm font-bold text-gray-900">{book.price.toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* 수강후기 */}
        {activeTab === "review" && (
          reviews.length === 0 ? <EmptyState message="등록된 수강후기가 없습니다." /> : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-xs font-semibold text-gray-700">{review.author}</span>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                </div>
              ))}
            </div>
          )
        )}

        </div>{/* 우측 콘텐츠 끝 */}
      </div>{/* flex 컨테이너 끝 */}
    </div>
  );
}
