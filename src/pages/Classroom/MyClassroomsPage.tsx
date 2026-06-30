import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

interface MyClassroomItem {
  classSn: number;
  classNm: string;
  courseNm: string;
  classStatCd: string;
  studentCount: number;
  instrNm?: string;
  enrlStrtYmd?: string;
  enrlEndYmd?: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  RECRUITING: "모집중", ACTIVE: "운영중", CLOSED: "종료", WAITING: "대기",
};
const STATUS_CLS: Record<string, string> = {
  RECRUITING: "text-blue-600 bg-blue-50 border-blue-100",
  ACTIVE: "text-emerald-600 bg-emerald-50 border-emerald-100",
  CLOSED: "text-zinc-400 bg-zinc-100 border-zinc-200",
  WAITING: "text-amber-600 bg-amber-50 border-amber-100",
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-zinc-100 rounded" />
          <div className="h-5 w-2/3 bg-zinc-100 rounded" />
          <div className="h-3 w-1/2 bg-zinc-100 rounded" />
        </div>
        <div className="h-6 w-14 bg-zinc-100 rounded-full" />
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-50 flex gap-6">
        <div className="h-3 w-20 bg-zinc-100 rounded" />
        <div className="h-3 w-20 bg-zinc-100 rounded" />
      </div>
    </div>
  );
}

function ClassroomCard({ c }: { c: MyClassroomItem }) {
  const statCd = c.classStatCd ?? "ACTIVE";
  return (
    <Link
      to={`/classroom/${c.classSn}`}
      className="group bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {c.instrNm && <p className="text-xs text-zinc-400 font-medium mb-1">{c.instrNm} 강사</p>}
          <p className="font-black text-zinc-900 text-lg tracking-tight group-hover:underline truncate">{c.classNm}</p>
          <p className="text-sm text-zinc-500 mt-0.5 truncate">{c.courseNm}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_CLS[statCd] ?? STATUS_CLS.ACTIVE}`}>
          {STATUS_LABEL[statCd] ?? "운영중"}
        </span>
      </div>
      {(c.enrlStrtYmd || c.studentCount > 0) && (
        <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center gap-6 text-xs text-zinc-400">
          {c.enrlStrtYmd && (
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-calendar" />
              {c.enrlStrtYmd} ~ {c.enrlEndYmd ?? "무기한"}
            </span>
          )}
          {c.studentCount > 0 && (
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-users" />
              {c.studentCount}명
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

export default function MyClassroomsPage() {
  const [classrooms, setClassrooms] = useState<MyClassroomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get("/api/classroom/my")
      .then((res) => setClassrooms(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <header className="mb-10">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-mono-editorial)" }}>
            HERMES · CLASSROOM
          </p>
          <h1 className="text-5xl md:text-6xl text-zinc-900" style={{ fontFamily: "var(--font-display)" }}>
            내 클래스룸
          </h1>
          <p className="mt-3 text-sm text-zinc-500">수강 중인 클래스룸 목록입니다.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <p className="text-sm text-zinc-400 text-center py-16">클래스룸 목록을 불러오지 못했습니다.</p>
        ) : classrooms.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-16">수강 중인 클래스룸이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classrooms.map((c) => <ClassroomCard key={c.classSn} c={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
