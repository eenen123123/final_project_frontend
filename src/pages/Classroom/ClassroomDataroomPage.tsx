import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { downloadFile } from "../../api/api";
import RichContent from "../../components/RichContent";

interface AttachedFile {
  fileServerId: number;
  orgnFileNm: string;
  fileSizeCnt: number;
}

interface DataroomDetail {
  boardSn?: number; postSn?: number;
  boardSj?: string; postSj?: string;
  boardCn?: string; postCn?: string;
  wrtrUserId?: string;
  memberDto?: { userName: string };
  regDt: string | null;
  inqCnt?: number | null;
  atchFileId?: number | null;
  attachedFiles?: AttachedFile[] | null;
}

export default function ClassroomDataroomPage() {
  const { classId, postSn } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<DataroomDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    if (!classId || !postSn) return;
    const controller = new AbortController();
    api.get(`/api/classroom/${classId}/dataroom/${postSn}`, { signal: controller.signal })
      .then((r) => { setItem(r.data); setStatus("ready"); })
      .catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => controller.abort();
  }, [classId, postSn]);

  if (status === "loading") return <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>;
  if (status === "error") return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-200" />
      <p className="text-base font-bold text-slate-700">자료를 불러오지 못했습니다.</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">돌아가기</button>
    </div>
  );
  if (!item) return null;

  const title = item.boardSj ?? item.postSj ?? "";
  const content = item.boardCn ?? item.postCn ?? "";
  const author = item.memberDto?.userName ?? item.wrtrUserId ?? "-";
  const files = item.attachedFiles ?? [];

  return (
    <div className="flex-1">
      <div className="max-w-5xl mx-auto px-10 py-8">
        <button onClick={() => navigate(`/classroom/${classId}?tab=dataroom`)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium mb-6">
          <i className="fa-solid fa-arrow-left" /> 자료실 목록으로
        </button>
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-7 py-6 border-b border-slate-100">
            <h1 className="text-base font-bold text-slate-800 leading-snug">{title}</h1>
            <div className="flex items-center gap-3 mt-3 text-sm text-slate-400">
              <span>{author}</span>
              <span className="w-px h-3 bg-slate-200" />
              <span>{item.regDt ? item.regDt.slice(0, 16).replace("T", " ") : "-"}</span>
              {item.inqCnt != null && (
                <>
                  <span className="w-px h-3 bg-slate-200" />
                  <span>조회 {item.inqCnt}</span>
                </>
              )}
            </div>
          </div>

          {content && (
            <RichContent
              html={content}
              className="px-7 py-8 text-sm text-slate-700 leading-relaxed min-h-[140px] prose prose-sm max-w-none border-b border-slate-100"
            />
          )}

          <div className="px-7 py-5">
            {files.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  <i className="fa-solid fa-paperclip mr-1.5 text-slate-400" />
                  첨부파일 <span className="font-normal text-slate-400">({files.length}개)</span>
                </p>
                {files.map((f) => (
                  <div key={f.fileServerId} className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <i className="fa-solid fa-file text-slate-300" />
                    <span className="flex-1 truncate">{f.orgnFileNm}</span>
                    <span className="text-slate-400 text-xs whitespace-nowrap">{(f.fileSizeCnt / 1024).toFixed(1)} KB</span>
                    <button onClick={() => downloadFile(f.fileServerId, f.orgnFileNm)}
                      className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 font-semibold whitespace-nowrap">
                      <i className="fa-solid fa-download text-xs" /> 다운로드
                    </button>
                  </div>
                ))}
              </div>
            ) : item.atchFileId ? (
              <button onClick={() => downloadFile(item.atchFileId!, "첨부파일")}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 text-sm font-semibold rounded-xl transition-colors">
                <i className="fa-solid fa-download" /> 첨부파일 다운로드
              </button>
            ) : (
              <p className="text-sm text-slate-300 italic">첨부파일이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
