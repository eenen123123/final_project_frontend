import { useState } from "react";
import TipTapEditor from "../../components/TipTapEditor/TipTapEditor";
import {
  extractFileIds,
  stripBlobUrls,
  type FileTokenResponse,
} from "../../api/fileApi";
import type { JSONContent } from "@tiptap/core";
import api from "../../api/api";

// ────────────────────────────────────────────────
// 쓰기 모드 예제
// ────────────────────────────────────────────────
function WriteExample() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<JSONContent | null>(null);
  const [hasPendingUploads, setHasPendingUploads] = useState(false);
  const [savedContent, setSavedContent] = useState<JSONContent | null>(null);

  const isEmpty = !content || !content.content?.some((n) => n.content?.length);

  const handleChange = (json: JSONContent, pending: boolean) => {
    setContent(json);
    setHasPendingUploads(pending);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (isEmpty) return alert("내용을 입력해주세요.");
    if (hasPendingUploads)
      return alert("이미지 업로드가 완료될 때까지 기다려주세요.");

    const cleanContent = stripBlobUrls(content!);
    const fileIds = extractFileIds(cleanContent);

    // 실제 제출 시:
    await api.post("/api/posts/example", {
      postSj: title,
      postCn: cleanContent,
      fileIds,
    });
    console.log("제출할 데이터:", {
      postSj: title,
      postCn: cleanContent,
      fileIds,
    });
    setSavedContent(cleanContent);
    alert("저장되었습니다. (콘솔 확인)");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700">쓰기 모드</h2>

      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />

      <TipTapEditor
        onChange={handleChange}
        ctxType="POST"
        ctxId="0"
        maxImages={5}
        placeholder="내용을 입력하세요..."
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isEmpty || hasPendingUploads}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {hasPendingUploads ? "업로드 중..." : "저장하기"}
        </button>
      </div>

      {savedContent && (
        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1 text-xs font-medium text-slate-500">
            저장된 JSON (백엔드 전송값)
          </p>
          <pre className="overflow-x-auto text-xs text-slate-600">
            {JSON.stringify(savedContent, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────
// 읽기 모드 예제 (DB에서 불러온 JSON으로 렌더링)
// ────────────────────────────────────────────────
const SAMPLE_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2, textAlign: "left" },
      content: [{ type: "text", text: "읽기 모드 예제" }],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        { type: "text", text: "이 글은 DB에서 불러온 TipTap JSON을 " },
        { type: "text", marks: [{ type: "bold" }], text: "읽기 전용" },
        { type: "text", text: "으로 렌더링하는 예제입니다." },
      ],
    },
    {
      type: "paragraph",
      attrs: { textAlign: "left" },
      content: [
        {
          type: "text",
          text: "이미지 노드가 있으면 NodeView가 마운트 시점에 pre-signed URL을 자동으로 요청합니다.",
        },
      ],
    },
    // 실제 저장된 이미지 노드 예시:
    // { type: "image", attrs: { fileId: 123, src: null, alt: "예시 이미지", uploadStatus: "done" } }
  ],
};

function ReadExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700">읽기 모드</h2>
      <TipTapEditor initialContent={SAMPLE_CONTENT} editable={false} />
    </div>
  );
}

// ────────────────────────────────────────────────
// DB 조회 테스트 (게시글 162번)
// ────────────────────────────────────────────────
interface PostResponse {
  postSn: number;
  postSj: string;
  postCn: JSONContent;
}

function FetchPostExample() {
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postId, setPostId] = useState(162);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    setPost(null);
    try {
      const res = await api.get<PostResponse>(`/api/posts/example/${postId}`);
      setPost(res.data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "불러오기 실패";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700">
        게시글 불러오기 테스트 ({postId}번)
      </h2>
      <input
        type="number"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        value={postId}
        onChange={(e) => setPostId(Number(e.target.value))}
      />
      <button
        type="button"
        onClick={fetchPost}
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-40"
      >
        {loading ? "불러오는 중..." : `GET /api/posts/example/${postId}`}
      </button>

      <button
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
        type="button"
        onClick={async () => {
          const ids = [184, 185, 186];
          try {
            const tokens = await api.post<Record<number, FileTokenResponse>>(
              `/api/files/tokens`,
              { ids },
            );
            console.log("getFilesToken response:", tokens);
          } catch (e) {
            console.error("이미지 토큰 불러오기 실패:", e);
          }
        }}
      >
        이미지 한번에 불러오기 테스트 184, 185, 186
      </button>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {post && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">postSn: {post.postSn}</p>
          <h3 className="text-xl font-semibold text-slate-900">
            {post.postSj}
          </h3>
          <TipTapEditor initialContent={post.postCn} editable={false} />
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────
// TestPage
// ────────────────────────────────────────────────
export default function TestPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-10">
      <WriteExample />
      <hr className="border-slate-200" />
      <ReadExample />
      <hr className="border-slate-200" />
      <FetchPostExample />
    </div>
  );
}
