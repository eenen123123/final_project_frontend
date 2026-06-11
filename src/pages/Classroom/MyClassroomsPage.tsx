import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import type { ClassroomInfo } from "../../types/ClassroomInterface";

export default function MyClassroomsPage() {
  const [classrooms, setClassrooms] = useState<ClassroomInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/api/classroom/my")
      .then((res) => setClassrooms(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-slate-500">클래스룸 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-red-500">클래스룸 목록을 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold text-slate-800 mb-6">내 클래스룸</h1>

        {classrooms.length === 0 ? (
          <p className="text-slate-500">수강 중인 강좌가 없습니다.</p>
        ) : (
          <div className="grid gap-4">
            {classrooms.map((c) => (
              <Link
                key={c.classSn}
                to={`/classroom/${c.classSn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border border-slate-200 px-6 py-5 flex items-center justify-between hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="text-[13px] text-slate-400 mb-1">
                    {c.instrNm} 강사
                  </p>
                  <p className="font-semibold text-slate-800">{c.classNm}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{c.courseNm}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>수강 시작</p>
                  <p className="font-medium text-slate-600">{c.enrlStrtYmd}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
