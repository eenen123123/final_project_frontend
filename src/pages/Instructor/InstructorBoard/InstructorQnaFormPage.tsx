import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateHTML, generateJSON } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import type { JSONContent } from "@tiptap/core";
import api from "../../../api/api";
import TipTapEditor from "../../../components/TipTapEditor/TipTapEditor";

const EXTENSIONS = [
  StarterKit,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Highlight,
];

export default function InstructorQnaFormPage() {
  const { instrUuid, postSn } = useParams<{ instrUuid: string; postSn: string }>();
  const navigate = useNavigate();
  const isEdit = !!postSn;

  const [title, setTitle] = useState("");
  const [secrYn, setSecrYn] = useState<"Y" | "N">("N");
  const [editorJson, setEditorJson] = useState<JSONContent | undefined>(undefined);
  const [initialContent, setInitialContent] = useState<JSONContent | undefined>(undefined);
  const [hasPendingUploads, setHasPendingUploads] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const backPath = `/instructor/${instrUuid}/qna`;

  useEffect(() => {
    if (!isEdit || !instrUuid || !postSn) return;
    api
      .get(`/api/instructors/${instrUuid}/board/${postSn}`)
      .then((res) => {
        setTitle(res.data.title ?? "");
        setSecrYn(res.data.secrYn ?? "N");
        const html = res.data.content ?? "";
        try {
          const json = generateJSON(html, EXTENSIONS);
          setInitialContent(json);
          setEditorJson(json);
        } catch {
          setInitialContent(undefined);
        }
      })
      .catch(() => navigate(backPath))
      .finally(() => setLoading(false));
  }, [instrUuid, postSn]);

  const handleSubmit = async () => {
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!editorJson) { alert("내용을 입력해주세요."); return; }
    if (hasPendingUploads) { alert("이미지 업로드가 완료될 때까지 기다려주세요."); return; }

    const html = generateHTML(editorJson, EXTENSIONS);
    if (!html || html === "<p></p>") { alert("내용을 입력해주세요."); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/api/instructors/${instrUuid}/board/${postSn}`, { title, content: html, secrYn });
        navigate(`/instructor/${instrUuid}/qna/${postSn}`, { replace: true });
      } else {
        await api.post(`/api/instructors/${instrUuid}/board/qna`, { title, content: html, secrYn });
        navigate(backPath, { replace: true });
      }
    } catch {
      alert(isEdit ? "수정에 실패했습니다." : "등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">불러오는 중...</p>;

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-6">
        <h2 className="text-xl font-extrabold text-gray-900">
          {isEdit ? "Q&A 수정" : "Q&A 작성"}
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* 제목 */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* 비밀글 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="secrYn"
            checked={secrYn === "Y"}
            onChange={(e) => setSecrYn(e.target.checked ? "Y" : "N")}
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <label htmlFor="secrYn" className="text-xs text-gray-600 cursor-pointer flex items-center gap-1">
            🔒 비밀글로 등록
          </label>
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            내용 <span className="text-red-400">*</span>
          </label>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <TipTapEditor
              key={isEdit ? "edit" : "new"}
              initialContent={initialContent}
              placeholder="내용을 입력하세요"
              ctxType="POST"
              ctxId={postSn ?? "0"}
              onChange={(json, pending) => {
                setEditorJson(json);
                setHasPendingUploads(pending);
              }}
            />
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex items-center justify-end gap-2 mt-6 pt-5 border-t border-gray-200">
        <button
          onClick={() => navigate(isEdit ? `/instructor/${instrUuid}/qna/${postSn}` : backPath)}
          className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || hasPendingUploads}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          {saving ? (isEdit ? "수정 중..." : "등록 중...") : (isEdit ? "수정 완료" : "등록")}
        </button>
      </div>
    </div>
  );
}
