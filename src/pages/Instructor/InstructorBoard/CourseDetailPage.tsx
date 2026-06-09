import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import api from "../../../api/api";

interface Lecture {
  lectureSn: number;
  title: string;
  duration: number;
  typeCd: string;
  sortOrd: number;
  lockYn: "Y" | "N";
}

interface CourseDetail {
  courseSn: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string | null;
  category: string;
  studentCount: number;
  totalDuration: string;
  lectures: Lecture[];
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CourseDetailPage() {
  const { instrUuid, courseSn } = useParams<{ instrUuid: string; courseSn: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!instrUuid || !courseSn) return;
    let cancelled = false;
    api
      .get<CourseDetail>(`/api/instructors/${instrUuid}/courses/${courseSn}`)
      .then((res) => { if (!cancelled) setCourse(res.data); })
      .catch((e) => { if (!cancelled) console.error("강좌 상세 조회 실패", e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [instrUuid, courseSn]);

  if (loading) {
    return <p className="text-sm text-gray-400">불러오는 중...</p>;
  }

  if (!course) {
    return <p className="text-sm text-gray-400">강좌를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      {/* 강좌 헤더 */}
      <div className="flex gap-6 mb-8">
        <div className="w-48 h-28 shrink-0 bg-gray-100 rounded overflow-hidden">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              {course.category}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-500 font-medium mb-1">{course.category}</p>
          <h2 className="text-xl font-extrabold text-gray-900 leading-snug mb-2">
            {course.title}
          </h2>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <span>수강생 {course.studentCount.toLocaleString()}명</span>
            <span>·</span>
            <span>총 {course.totalDuration}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-gray-900">
              {course.price === 0 ? "무료" : `${course.price.toLocaleString()}원`}
            </span>
            <button
              onClick={() =>
                navigate(
                  `/payment?type=course&sn=${course.courseSn}&name=${encodeURIComponent(course.title)}&price=${course.price}`
                )
              }
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors"
            >
              수강신청
            </button>
          </div>
        </div>
      </div>

      {/* 강좌 소개 */}
      {course.description && (
        <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">강좌 소개</p>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {course.description}
          </p>
        </div>
      )}

      {/* 강의 목록 */}
      <div>
        <div className="flex items-baseline gap-2 mb-4">
          <h3 className="text-base font-extrabold text-gray-900">강의 목록</h3>
          <span className="text-sm text-gray-400">{course.lectures.length}강</span>
        </div>

        <div className="border-t border-gray-200">
          {course.lectures.map((lecture, idx) => (
            <div
              key={lecture.lectureSn}
              className="flex items-center gap-4 px-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span className="w-6 text-xs text-gray-400 text-center shrink-0">
                {idx + 1}
              </span>
              <span className="flex-1 text-sm text-gray-800 leading-snug">
                {lecture.title}
              </span>
              <span className="text-xs text-gray-400 shrink-0">
                {formatDuration(lecture.duration)}
              </span>
              {lecture.lockYn === "Y" ? (
                <Lock size={13} className="text-gray-300 shrink-0" />
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded shrink-0 font-medium">
                  미리보기
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 목록으로 */}
      <div className="mt-8">
        <button
          onClick={() => navigate(`/instructor/${instrUuid}/courses`)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          목록
        </button>
      </div>
    </div>
  );
}
