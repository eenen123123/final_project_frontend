import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

interface QnaDetail {
  boardSn?: number;
  postSn?: number;
  boardSj?: string;
  postSj?: string;
  boardCn?: string;
  postCn?: string;
  wrtrUserId?: string;
  memberDto?: { userName: string };
  regDt: string | null;
  answYn: string;
  answCn?: string | null;
  answDt?: string | null;
}

export default function ClassroomQnaPage() {
  const { classId, postSn } = useParams();
  const navigate = useNavigate();
  const [qna, setQna] = useState<QnaDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    if (!classId || !postSn) return;
    api.get(`/api/classroom/${classId}/qna/${postSn}`)
      .then((r) => { setQna(r.data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }, [classId, postSn]);

  if (status === "loading") return (
    <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>
  );
  if (status === "error") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-200" />
      <p className="text-base font-bold text-slate-700">Q&A를 불러오지 못했습니다.</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">돌아가기</button>
    </div>
  );
  if (!qna) return null;

  const title = qna.boardSj ?? qna.postSj ?? "";
  const content = qna.boardCn ?? qna.postCn ?? "";
  const author = qna.memberDto?.userName ?? qna.wrtrUserId ?? "-";

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-10 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
          <i className="fa-solid fa-arrow-left" /> Q&A
        </button>
        <span className="text-slate-200">/</span>
        <span className="text-base font-bold text-slate-800 truncate">{title}</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-5">
        {/* 질문 */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 text-xs flex-shrink-0">
                <i className="fa-solid fa-question" />
              </span>
              <h1 className="text-base font-bold text-slate-800">{title}</h1>
            </div>
            {qna.answYn === "Y"
              ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 shrink-0">답변완료</span>
              : <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-100 bg-amber-50 text-amber-500 shrink-0">미답변</span>
            }
          </div>
          <div className="px-7 py-3 border-b border-slate-50 flex items-center gap-4 text-xs text-slate-400">
            <span>{author}</span>
            <span>{qna.regDt ? qna.regDt.slice(0, 10) : "-"}</span>
          </div>
          <div className="px-7 py-6 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{content}</div>
        </div>

        {/* 답변 */}
        {qna.answYn === "Y" && (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 text-xs flex-shrink-0">
                <i className="fa-solid fa-check" />
              </span>
              <h2 className="text-sm font-bold text-slate-800">강사 답변</h2>
              {qna.answDt && <span className="text-xs text-slate-400 ml-auto">{qna.answDt.slice(0, 10)}</span>}
            </div>
            <div className="px-7 py-6 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {qna.answCn ?? "답변 내용이 없습니다."}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
