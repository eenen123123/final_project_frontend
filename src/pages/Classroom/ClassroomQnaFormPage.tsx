import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateHTML, generateJSON } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import type { JSONContent } from "@tiptap/core";
import api from "../../api/api";
import { uploadFile } from "../../api/fileApi";
import TipTapEditor from "../../components/TipTapEditor/TipTapEditor";

const EXTENSIONS = [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] }), Highlight];

interface PendingFile {
  id: string;
  file: File;
}

interface ExistingFile {
  fileServerId: number;
  orgnFileNm: string;
  fileSizeCnt: number;
}

export default function ClassroomQnaFormPage() {
  const { classId, postSn } = useParams();
  const navigate = useNavigate();
  const isEdit = !!postSn;

  const [title, setTitle] = useState("");
  const [editorJson, setEditorJson] = useState<JSONContent | undefined>(undefined);
  const [hasPendingUploads, setHasPendingUploads] = useState(false);
  const [initialContent, setInitialContent] = useState<JSONContent | undefined>(undefined);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit || !classId || !postSn) return;
    api.get(`/api/classroom/${classId}/qna/${postSn}`)
      .then((r) => {
        const sj = r.data.boardSj ?? r.data.postSj ?? "";
        const cn = r.data.boardCn ?? r.data.postCn ?? "";
        setTitle(sj);
        try {
          const json = generateJSON(cn, EXTENSIONS);
          setInitialContent(json);
          setEditorJson(json);
        } catch {
          setInitialContent(undefined);
        }
        setExistingFiles(r.data.attachedFiles ?? []);
        setLoading(false);
      })
      .catch(() => navigate(-1));
  }, [classId, postSn]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";
    setPendingFiles((prev) => [
      ...prev,
      ...files.map((f) => ({ id: crypto.randomUUID(), file: f })),
    ]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!editorJson) { alert("내용을 입력해주세요."); return; }
    if (hasPendingUploads) { alert("이미지 업로드가 완료될 때까지 기다려주세요."); return; }
    const html = generateHTML(editorJson, EXTENSIONS);
    if (!html || html === "<p></p>") { alert("내용을 입력해주세요."); return; }
    setSaving(true);
    try {
      const newFileServerIds = await Promise.all(
        pendingFiles.map((pf) => uploadFile(pf.file, "CLASSROOM_QNA", classId ?? "0"))
      );
      const fileServerIds = [...existingFiles.map((f) => f.fileServerId), ...newFileServerIds];
      const payload = { postSj: title, postCn: html, fileServerIds };
      if (isEdit) {
        await api.put(`/api/classroom/${classId}/qna/${postSn}`, payload);
        navigate(`/classroom/${classId}/qna/${postSn}`, { replace: true });
      } else {
        await api.post(`/api/classroom/${classId}/qna`, payload);
        navigate(`/classroom/${classId}?tab=qna`, { replace: true });
      }
    } catch {
      alert(isEdit ? "수정에 실패했습니다." : "질문 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto px-10 py-8">
        <button
          onClick={() => isEdit
            ? navigate(`/classroom/${classId}/qna/${postSn}`, { replace: true })
            : navigate(`/classroom/${classId}?tab=qna`, { replace: true })
          }
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium mb-6">
          <i className="fa-solid fa-arrow-left" /> {isEdit ? "Q&A 상세로" : "Q&A 목록으로"}
        </button>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">{isEdit ? "질문 수정" : "질문 작성"}</h2>
            <p className="text-sm text-slate-400 mt-1">강사에게 궁금한 점을 질문해 보세요.</p>
          </div>

          <div className="px-7 py-6 flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="질문 제목을 입력하세요"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">내용</label>
              <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <TipTapEditor
                  key={isEdit ? "edit" : "new"}
                  initialContent={initialContent}
                  placeholder="질문 내용을 입력하세요"
                  ctxType="CLASSROOM_QNA"
                  ctxId={postSn ?? classId ?? "0"}
                  onChange={(json, pending) => { setEditorJson(json); setHasPendingUploads(pending); }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">첨부파일</label>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="w-full flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 group">
                <i className="fa-solid fa-cloud-arrow-up text-xl text-slate-300 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">클릭하여 파일 첨부</span>
              </button>
              {existingFiles.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-2">
                  {existingFiles.map((ef) => (
                    <div key={ef.fileServerId} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
                      <i className="fa-solid fa-paperclip text-slate-300" />
                      <span className="flex-1 truncate">{ef.orgnFileNm}</span>
                      <span className="text-xs text-slate-400 shrink-0">{(ef.fileSizeCnt / 1024).toFixed(1)} KB</span>
                      <button onClick={() => setExistingFiles((p) => p.filter((x) => x.fileServerId !== ef.fileServerId))}
                        className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {pendingFiles.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-2">
                  {pendingFiles.map((pf) => (
                    <div key={pf.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50 text-sm text-slate-600">
                      <i className="fa-solid fa-file text-blue-300" />
                      <span className="flex-1 truncate">{pf.file.name}</span>
                      <span className="text-xs text-slate-400 shrink-0">{(pf.file.size / 1024).toFixed(1)} KB</span>
                      <button onClick={() => setPendingFiles((p) => p.filter((x) => x.id !== pf.id))}
                        className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-7 py-5 border-t border-slate-100 flex justify-end gap-2">
            <button
              onClick={() => isEdit
                ? navigate(`/classroom/${classId}/qna/${postSn}`, { replace: true })
                : navigate(`/classroom/${classId}?tab=qna`, { replace: true })
              }
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              취소
            </button>
            <button onClick={handleSubmit} disabled={saving || hasPendingUploads}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl transition-colors">
              {saving ? (isEdit ? "수정 중..." : "등록 중...") : (isEdit ? "수정 완료" : "질문 등록")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
