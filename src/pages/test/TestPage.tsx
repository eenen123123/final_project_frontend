import { useState } from "react";
import axios from "axios";
import TipTapEditor from "../../components/TipTapEditor";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmpty = !content || content === "<p></p>";

  const handleSubmit = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (isEmpty) return alert("내용을 입력해주세요.");

    try {
      setLoading(true);
      await axios.post("/api/posts", { title, content });
      alert("저장되었습니다.");
      setTitle("");
      setContent("");
    } catch (e) {
      console.error(e);
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">새 글 작성</h1>

      <div className="space-y-4">
        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full px-4 py-3 rounded-xl text-lg font-medium text-slate-900
            border border-slate-200 bg-white
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-slate-300
            transition
          "
        />

        {/* 에디터 */}
        <TipTapEditor value={content} onChange={setContent} />

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setContent("");
            }}
            className="
              px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600
              border border-slate-200 hover:bg-slate-50
              transition
            "
          >
            초기화
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !title.trim() || isEmpty}
            className="
              px-5 py-2.5 rounded-lg text-sm font-medium text-white
              bg-slate-900 hover:bg-slate-700
              disabled:opacity-40 disabled:cursor-not-allowed
              transition
            "
          >
            {loading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
