import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function ClassroomQnaFormPage() {
  const { classId, postSn } = useParams();
  const navigate = useNavigate();
  const isEdit = !!postSn;

  const [form, setForm] = useState({ boardSj: "", boardCn: "" });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || !classId || !postSn) return;
    api.get(`/api/classroom/${classId}/qna/${postSn}`)
      .then((r) => {
        setForm({
          boardSj: r.data.boardSj ?? r.data.postSj ?? "",
          boardCn: r.data.boardCn ?? r.data.postCn ?? "",
        });
        setLoading(false);
      })
      .catch(() => navigate(-1));
  }, [classId, postSn]);

  const handleSubmit = async () => {
    if (!form.boardSj.trim() || !form.boardCn.trim()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/api/classroom/${classId}/qna/${postSn}`, form);
        navigate(`/classroom/${classId}/qna/${postSn}`, { replace: true });
      } else {
        await api.post(`/api/classroom/${classId}/qna`, form);
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
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium mb-6">
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
                value={form.boardSj}
                onChange={(e) => setForm((f) => ({ ...f, boardSj: e.target.value }))}
                placeholder="질문 제목을 입력하세요"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">내용</label>
              <textarea
                value={form.boardCn}
                onChange={(e) => setForm((f) => ({ ...f, boardCn: e.target.value }))}
                placeholder="질문 내용을 입력하세요"
                rows={12}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>
          </div>

          <div className="px-7 py-5 border-t border-slate-100 flex justify-end gap-2">
            <button onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              취소
            </button>
            <button onClick={handleSubmit} disabled={saving || !form.boardSj.trim() || !form.boardCn.trim()}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl transition-colors">
              {saving ? (isEdit ? "수정 중..." : "등록 중...") : (isEdit ? "수정 완료" : "질문 등록")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
