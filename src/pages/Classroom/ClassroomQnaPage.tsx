import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import RichContent from "../../components/RichContent";
import { useAuth } from "../../auth/AuthContext";

interface QnaDetail {
  boardSn?: number; postSn?: number;
  boardSj?: string; postSj?: string;
  boardCn?: string; postCn?: string;
  wrtrUserId?: string;
  memberDto?: { userName: string };
  regDt: string | null;
  inqCnt?: number | null;
  answYn: string;
  answCn?: string | null;
  answDt?: string | null;
  answrUserNm?: string | null;
  answrUserId?: string | null;
}

export default function ClassroomQnaPage() {
  const { classId, postSn } = useParams();
  const navigate = useNavigate();
  const { getUserName } = useAuth();
  const myName = getUserName();

  const [qna, setQna] = useState<QnaDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    if (!classId || !postSn) return;
    const controller = new AbortController();
    api.get(`/api/classroom/${classId}/qna/${postSn}`, { signal: controller.signal })
      .then((r) => { setQna(r.data); setStatus("ready"); })
      .catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => controller.abort();
  }, [classId, postSn]);

  if (status === "loading") return <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>;
  if (status === "error") return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-200" />
      <p className="text-base font-bold text-slate-700">Q&A를 불러오지 못했습니다.</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">돌아가기</button>
    </div>
  );
  if (!qna) return null;

  const title = qna.boardSj ?? qna.postSj ?? "";
  const content = qna.boardCn ?? qna.postCn ?? "";
  const author = qna.memberDto?.userName ?? qna.wrtrUserId ?? "-";
  const sn = qna.postSn ?? qna.boardSn;
  const isMyPost = myName && qna.memberDto?.userName === myName;

  return (
    <div className="flex-1 overflow-y-scroll">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-5">
        <button onClick={() => navigate(`/classroom/${classId}?tab=qna`)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium w-fit">
          <i className="fa-solid fa-arrow-left" /> Q&A 목록으로
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold text-slate-800">{title}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-slate-400">
                <span className="whitespace-nowrap">{author}</span>
                {qna.inqCnt != null && <span className="whitespace-nowrap">조회 {qna.inqCnt}</span>}
                <span className="whitespace-nowrap">{qna.regDt ? qna.regDt.slice(0, 16).replace("T", " ") : "-"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:shrink-0">
              {qna.answYn === "Y"
                ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">답변완료</span>
                : <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-100 bg-amber-50 text-amber-500">미답변</span>
              }
              {isMyPost && sn && (
                <button
                  onClick={() => navigate(`/classroom/${classId}/qna/${sn}/edit`)}
                  className="text-sm font-semibold px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                  수정
                </button>
              )}
            </div>
          </div>

          <RichContent html={content} className="px-7 py-6 text-sm text-slate-700 leading-relaxed min-h-[120px] prose prose-sm max-w-none whitespace-pre-wrap" />
        </div>

        {qna.answYn === "Y" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-200 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 text-xs shrink-0">
                <i className="fa-solid fa-check" />
              </span>
              <h2 className="text-sm font-bold text-slate-800">강사 답변</h2>
              {(qna.answrUserNm ?? qna.answrUserId) && (
                <span className="text-sm text-slate-400">{qna.answrUserNm ?? qna.answrUserId}</span>
              )}
              {qna.answDt && <span className="text-sm text-slate-400 ml-auto">{qna.answDt.slice(0, 16).replace("T", " ")}</span>}
            </div>
            <RichContent
              html={qna.answCn ?? ""}
              className="px-7 py-6 text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
