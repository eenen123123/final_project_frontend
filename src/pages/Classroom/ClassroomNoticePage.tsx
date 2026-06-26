import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

interface NoticeDetail {
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

export default function ClassroomNoticePage() {
  const { classId, postSn } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    if (!classId || !postSn) return;
    api.get(`/api/classroom/${classId}/notices/${postSn}`)
      .then((r) => { setNotice(r.data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }, [classId, postSn]);

  if (status === "loading") return (
    <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>
  );
  if (status === "error") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-200" />
      <p className="text-base font-bold text-slate-700">공지사항을 불러오지 못했습니다.</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">돌아가기</button>
    </div>
  );
  if (!notice) return null;

  const title = notice.boardSj ?? notice.postSj ?? "";
  const content = notice.boardCn ?? notice.postCn ?? "";
  const author = notice.memberDto?.userName ?? notice.wrtrUserId ?? "-";

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-10 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
          <i className="fa-solid fa-arrow-left" /> 공지사항
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
              <span>{notice.regDt ? notice.regDt.slice(0, 10) : "-"}</span>
            </div>
          </div>
          <div className="px-7 py-8 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={content.includes("<") ? { __html: content } : undefined}>
            {!content.includes("<") ? content : undefined}
          </div>
          {notice.atchFileId && (
            <div className="px-7 py-4 border-t border-slate-100">
              <a href={`/api/files/${notice.atchFileId}/download`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                <i className="fa-solid fa-paperclip" /> 첨부파일 다운로드
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
