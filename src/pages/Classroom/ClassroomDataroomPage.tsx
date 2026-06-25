import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

interface DataroomDetail {
  boardSn?: number;
  postSn?: number;
  boardSj?: string;
  postSj?: string;
  boardCn?: string;
  postCn?: string;
  wrtrUserId?: string;
  memberDto?: { userName: string };
  regDt: string | null;
  atchFileId?: string | null;
}

export default function ClassroomDataroomPage() {
  const { classId, postSn } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<DataroomDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    if (!classId || !postSn) return;
    api.get(`/api/classroom/${classId}/dataroom/${postSn}`)
      .then((r) => { setItem(r.data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }, [classId, postSn]);

  if (status === "loading") return (
    <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>
  );
  if (status === "error") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-200" />
      <p className="text-base font-bold text-slate-700">자료를 불러오지 못했습니다.</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">돌아가기</button>
    </div>
  );
  if (!item) return null;

  const title = item.boardSj ?? item.postSj ?? "";
  const content = item.boardCn ?? item.postCn ?? "";
  const author = item.memberDto?.userName ?? item.wrtrUserId ?? "-";

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-10 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
          <i className="fa-solid fa-arrow-left" /> 자료실
        </button>
        <span className="text-slate-200">/</span>
        <span className="text-base font-bold text-slate-800 truncate">{title}</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-7 py-6 border-b border-slate-100">
            <h1 className="text-lg font-bold text-slate-800 leading-snug">{title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
              <span>{author}</span>
              <span>{item.regDt ? item.regDt.slice(0, 10) : "-"}</span>
            </div>
          </div>
          {content && (
            <div className="px-7 py-8 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border-b border-slate-100">
              {content}
            </div>
          )}
          <div className="px-7 py-5">
            {item.atchFileId ? (
              <a href={`/api/files/${item.atchFileId}/download`}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 text-sm font-semibold rounded-xl transition-colors">
                <i className="fa-solid fa-download" /> 첨부파일 다운로드
              </a>
            ) : (
              <p className="text-sm text-slate-400">첨부파일이 없습니다.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
