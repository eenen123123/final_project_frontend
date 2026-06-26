import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

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
}

export default function ClassroomAssignPage() {
  const { classId, asgmtSn } = useParams();
  const navigate = useNavigate();

  const [assign, setAssign] = useState<AssignDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [sbmtCn, setSbmtCn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!classId || !asgmtSn) return;
    api.get(`/api/classroom/${classId}/assignments/${asgmtSn}`)
      .then((r) => {
        setAssign(r.data);
        setSbmtCn(r.data.sbmtCn ?? "");
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [classId, asgmtSn]);

  const isPast = assign?.dueDt ? new Date(assign.dueDt) < new Date() : false;
  const canSubmit = assign && (!assign.submitted || assign.resubmitYn === "Y") && !isPast;

  const handleSubmit = async () => {
    if (!sbmtCn.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/api/classroom/${classId}/assignments/${asgmtSn}/submit`, { sbmtCn });
      const r = await api.get(`/api/classroom/${classId}/assignments/${asgmtSn}`);
      setAssign(r.data);
      setEditing(false);
    } catch (err: any) {
      if (err?.response?.status === 409) alert("이미 제출하였으며 재제출이 불가능합니다.");
      else alert("제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return (
    <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>
  );
  if (status === "error") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-200" />
      <p className="text-base font-bold text-slate-700">과제 정보를 불러오지 못했습니다.</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">돌아가기</button>
    </div>
  );
  if (!assign) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-10 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
          <i className="fa-solid fa-arrow-left" /> 과제 목록
        </button>
        <span className="text-slate-200">/</span>
        <span className="text-base font-bold text-slate-800 truncate">{assign.asgmtNm}</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-5">
        {/* 과제 정보 */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">{assign.asgmtNm}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <i className="fa-regular fa-clock" />
              <span>{assign.dueDt ?? "기한 없음"} 마감</span>
            </div>
          </div>
          <div className="px-7 py-6 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{assign.asgmtCn}</div>
        </div>

        {/* 제출 상태 */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">내 제출</h3>
            <div className="flex items-center gap-3">
              {assign.score != null && (
                <span className="text-sm font-black text-blue-600">{assign.score}점</span>
              )}
              {assign.submitted
                ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">제출완료</span>
                : <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-100 bg-rose-50 text-rose-500">미제출</span>
              }
            </div>
          </div>

          {/* 기존 제출 내용 */}
          {assign.submitted && !editing && (
            <div className="px-7 py-5 flex flex-col gap-4">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{assign.sbmtCn}</p>
              {assign.feedbackCn && (
                <div className="mt-2 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-blue-500 mb-1">강사 피드백</p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{assign.feedbackCn}</p>
                </div>
              )}
              {canSubmit && (
                <div className="flex justify-end">
                  <button onClick={() => setEditing(true)} className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors">
                    재제출
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 작성/재제출 폼 */}
          {(!assign.submitted || editing) && (
            <div className="px-7 py-5 flex flex-col gap-4">
              {isPast ? (
                <p className="text-sm text-slate-400 text-center py-4">마감된 과제입니다.</p>
              ) : (
                <>
                  <textarea
                    value={sbmtCn}
                    onChange={(e) => setSbmtCn(e.target.value)}
                    placeholder="제출 내용을 입력하세요"
                    rows={8}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    {editing && (
                      <button onClick={() => { setEditing(false); setSbmtCn(assign.sbmtCn ?? ""); }} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">취소</button>
                    )}
                    <button onClick={handleSubmit} disabled={submitting || !sbmtCn.trim()}
                      className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg transition-colors">
                      {submitting ? "제출 중..." : "제출하기"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
