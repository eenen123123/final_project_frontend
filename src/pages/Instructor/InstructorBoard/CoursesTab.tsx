import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";

interface Course {
  courseSn: number;
  title: string;
  price: number;
  thumbnailUrl: string | null;
  category: string;
  rating: number | null;
  studentCount: number;
}

export default function CoursesTab() {
  const { instrUuid } = useParams<{ instrUuid: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(!!instrUuid);

  useEffect(() => {
    if (!instrUuid) return;
    let cancelled = false;
    api
      .get<Course[]>(`/api/instructors/${instrUuid}/courses`)
      .then((res) => { if (!cancelled) setCourses(res.data); })
      .catch((e) => { if (!cancelled) console.error("강좌 목록 조회 실패", e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [instrUuid]);

  if (loading) {
    return <p className="text-sm text-gray-400">강좌 목록을 불러오는 중...</p>;
  }

  if (courses.length === 0) {
    return <p className="text-sm text-gray-400">등록된 강좌가 없습니다.</p>;
  }

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-6">
        <h2 className="text-xl font-extrabold text-gray-900">강좌목록</h2>
        <span className="text-sm text-gray-400">{courses.length}개</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.courseSn}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-sm">{course.category}</span>
              )}
            </div>

            <div className="p-4">
              <p className="text-xs text-blue-500 font-medium mb-1">{course.category}</p>
              <h3 className="text-sm font-bold text-gray-800 leading-snug mb-3 line-clamp-2">
                {course.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                {course.rating !== null && <span>★ {course.rating}</span>}
                {course.rating !== null && <span>·</span>}
                <span>수강생 {course.studentCount.toLocaleString()}명</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-gray-900">
                  {course.price === 0 ? "무료" : `${course.price.toLocaleString()}원`}
                </span>
                <button className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  수강신청
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
