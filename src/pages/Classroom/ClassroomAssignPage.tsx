import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import type { JSONContent } from "@tiptap/core";
import api from "../../api/api";
import { uploadFile } from "../../api/fileApi";
import TipTapEditor from "../../components/TipTapEditor/TipTapEditor";
import RichContent from "../../components/RichContent";

const EXTENSIONS = [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] }), Highlight];

interface UploadedFile {
  fileServerId: number;
  name: string;
  size: number;
}

interface AssignDetail {
  asgmtSn: number;
  asgmtNm: string;
  asgmtCn: string;
  dueDt: string | null;
  submitted: boolean;
  sbmtCn: string | null;
  score: number | null;
  feedbackCn: string | null;
  resubmitYn: string;
  attachedFiles?: { fileServerId: number; orgnFileNm: string; fileSizeCnt: number }[] | null;
}

export default function ClassroomAssignPage() {
  const { classId, asgmtSn } = useParams();
  const navigate = useNavigate();
  const [assign, setAssign] = useState<AssignDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [editorJson, setEditorJson] = useState<JSONContent | undefined>(undefined);
  const [hasPendingUploads, setHasPendingUploads] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    if (!classId || !asgmtSn) return;
    api.get(`/api/classroom/${classId}/assignments/${asgmtSn}`)
      .then((r) => { setAssign(r.data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  };

  useEffect(() => { load(); }, [classId, asgmtSn]);

  const isPast = assign?.dueDt ? new Date(assign.dueDt) < new Date() : false;
  const canSubmit = assign && (!assign.submitted || assign.resubmitYn === "Y") && !isPast;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";
    setUploadingFiles(true);
    try {
      const results = await Promise.all(
        files.map(async (f) => ({
          fileServerId: await uploadFile(f, "ASSIGN", asgmtSn ?? "0"),
          name: f.name,
          size: f.size,
        }))
      );
      setUploadedFiles((prev) => [...prev, ...results]);
    } catch {
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = async () => {
    if (!editorJson) { alert("내용을 입력해주세요."); return; }
    if (hasPendingUploads) { alert("이미지 업로드가 완료될 때까지 기다려주세요."); return; }
    const html = generateHTML(editorJson, EXTENSIONS);
    if (!html || html === "<p></p>") { alert("내용을 입력해주세요."); return; }
    setSubmitting(true);
    try {
      await api.post(`/api/classroom/${classId}/assignments/${asgmtSn}/submit`, {
        sbmtCn: html,
        fileServerIds: uploadedFiles.map((f) => f.fileServerId),
      });
      setEditing(false);
      setUploadedFiles([]);
      setEditorJson(undefined);
      load();
    } catch (err: any) {
      if (err?.response?.status === 409) alert("이미 제출하였으며 재제출이 불가능합니다.");
      else alert("제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>;
  if (status === "error") return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-200" />
      <p className="text-base font-bold text-slate-700">과제 정보를 불러오지 못했습니다.</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">돌아가기</button>
    </div>
  );
  if (!assign) return null;

  return (
    <div className="flex-1">
      <div className="max-w-5xl mx-auto px-10 py-8 flex flex-col gap-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium w-fit">
          <i className="fa-solid fa-arrow-left" /> 과제 목록으로
        </button>

        {/* 과제 내용 */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">{assign.asgmtNm}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400 shrink-0">
              <i className="fa-regular fa-clock" />
              <span>{assign.dueDt ? assign.dueDt.slice(0, 16).replace("T", " ") : "기한 없음"} 마감</span>
            </div>
          </div>
          <RichContent html={assign.asgmtCn} className="px-7 py-6 text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none" />
        </div>

        {/* 내 제출 */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">내 제출</h3>
            <div className="flex items-center gap-3">
              {assign.score != null && <span className="text-sm font-black text-blue-600">{assign.score}점</span>}
              {assign.submitted
                ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">제출완료</span>
                : <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-100 bg-rose-50 text-rose-500">미제출</span>
              }
            </div>
          </div>

          {/* 제출 완료 후 뷰 */}
          {assign.submitted && !editing && (
            <div className="px-7 py-5 flex flex-col gap-4">
              <RichContent html={assign.sbmtCn ?? ""} className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none" />

              {(assign.attachedFiles ?? []).length > 0 && (
                <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    <i className="fa-solid fa-paperclip mr-1" />첨부파일
                  </p>
                  {(assign.attachedFiles ?? []).map((f) => (
                    <div key={f.fileServerId} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-100 text-sm text-slate-600">
                      <i className="fa-solid fa-file text-slate-300" />
                      <span className="flex-1 truncate">{f.orgnFileNm}</span>
                      <span className="text-xs text-slate-400">{(f.fileSizeCnt / 1024).toFixed(1)} KB</span>
                      <a href={`/api/files/${f.fileServerId}/download`} className="text-blue-500 hover:text-blue-700 transition-colors">
                        <i className="fa-solid fa-download text-xs" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {assign.feedbackCn && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-blue-500 mb-2">강사 피드백</p>
                  <RichContent html={assign.feedbackCn} className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none" />
                </div>
              )}

              {canSubmit && (
                <div className="flex justify-end">
                  <button onClick={() => setEditing(true)} className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors">재제출</button>
                </div>
              )}
            </div>
          )}

          {/* 작성 폼 */}
          {(!assign.submitted || editing) && (
            <div className="px-7 py-5 flex flex-col gap-4">
              {isPast ? (
                <p className="text-sm text-slate-400 text-center py-4">마감된 과제입니다.</p>
              ) : (
                <>
                  <TipTapEditor
                    placeholder="제출 내용을 입력하세요..."
                    ctxType="ASSIGN"
                    ctxId={asgmtSn ?? "0"}
                    onChange={(json, pending) => { setEditorJson(json); setHasPendingUploads(pending); }}
                  />

                  {/* 첨부파일 */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-500">
                        <i className="fa-solid fa-paperclip mr-1 text-slate-400" />첨부파일
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFiles}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50">
                        <i className="fa-solid fa-plus" />
                        {uploadingFiles ? "업로드 중..." : "파일 추가"}
                      </button>
                      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        {uploadedFiles.map((f) => (
                          <div key={f.fileServerId} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-600">
                            <i className="fa-solid fa-file text-slate-300" />
                            <span className="flex-1 truncate">{f.name}</span>
                            <span className="text-xs text-slate-400">{(f.size / 1024).toFixed(1)} KB</span>
                            <button onClick={() => setUploadedFiles((p) => p.filter((x) => x.fileServerId !== f.fileServerId))}
                              className="text-slate-300 hover:text-red-400 transition-colors">
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    {editing && (
                      <button onClick={() => { setEditing(false); setUploadedFiles([]); setEditorJson(undefined); }}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">취소</button>
                    )}
                    <button onClick={handleSubmit} disabled={submitting || hasPendingUploads || uploadingFiles}
                      className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg transition-colors">
                      {submitting ? "제출 중..." : "제출하기"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
