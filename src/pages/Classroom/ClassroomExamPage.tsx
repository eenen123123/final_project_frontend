import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

type QuestionType = "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "ESSAY";

interface Question {
  qstnSn: number;
  qstnNo: number;
  qstnCn: string;
  qstnType: QuestionType;
  score: number;
  choices: string[] | null;
}

interface ExamDetail {
  examSn: number;
  examNm: string;
  examEndDt: string;
  questions: Question[];
}

function useCountdown(endDt: string | null) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!endDt) return;
    const tick = () => {
      const diff = Math.max(0, new Date(endDt).getTime() - Date.now());
      setRemaining(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDt]);

  if (remaining === null) return null;
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { h, m, s, expired: remaining === 0 };
}

export default function ClassroomExamPage() {
  const { classId, examSn } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<"loading" | "error" | "forbidden" | "already" | "ready" | "submitting" | "done">("loading");
  const submittedRef = useRef(false);

  const countdown = useCountdown(exam?.examEndDt ?? null);

  useEffect(() => {
    if (!classId || !examSn) return;
    api.get(`/api/classroom/${classId}/exams/${examSn}`)
      .then((r) => { setExam(r.data); setStatus("ready"); })
      .catch((err) => {
        const code = err?.response?.status;
        if (code === 403) setStatus("forbidden");
        else if (code === 409) setStatus("already");
        else setStatus("error");
      });
  }, [classId, examSn]);

  // 시간 만료 시 자동 제출
  useEffect(() => {
    if (countdown?.expired && status === "ready" && !submittedRef.current) {
      handleSubmit(true);
    }
  }, [countdown?.expired]);

  const setAnswer = (qstnSn: number, val: string) =>
    setAnswers((prev) => ({ ...prev, [qstnSn]: val }));

  const handleSubmit = async (auto = false) => {
    if (submittedRef.current) return;
    if (!auto) {
      const unanswered = exam?.questions.filter((q) => !answers[q.qstnSn]).length ?? 0;
      if (unanswered > 0 && !confirm(`${unanswered}문항을 풀지 않았습니다. 그래도 제출하시겠습니까?`)) return;
    }
    submittedRef.current = true;
    setStatus("submitting");
    const payload = { answers: exam!.questions.map((q) => ({ qstnSn: q.qstnSn, answCn: answers[q.qstnSn] ?? "" })) };
    try {
      await api.post(`/api/classroom/${classId}/exams/${examSn}/submit`, payload);
      setStatus("done");
    } catch {
      submittedRef.current = false;
      setStatus("ready");
      alert("제출에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // ── 상태별 화면 ──────────────────────────────────────────────

  if (status === "loading") return (
    <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">불러오는 중...</div>
  );

  if (status === "forbidden") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-lock text-4xl text-slate-200" />
      <p className="text-base font-bold text-slate-700">시험에 접근할 수 없습니다.</p>
      <p className="text-sm text-slate-400">시험 시간이 아니거나 수강 권한이 없습니다.</p>
      <button onClick={() => navigate(-1)} className="mt-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
        돌아가기
      </button>
    </div>
  );

  if (status === "already") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-circle-check text-4xl text-emerald-300" />
      <p className="text-base font-bold text-slate-700">이미 제출한 시험입니다.</p>
      <button onClick={() => navigate(-1)} className="mt-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
        돌아가기
      </button>
    </div>
  );

  if (status === "error") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-200" />
      <p className="text-base font-bold text-slate-700">시험 정보를 불러오지 못했습니다.</p>
      <button onClick={() => navigate(-1)} className="mt-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
        돌아가기
      </button>
    </div>
  );

  if (status === "done") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-circle-check text-5xl text-emerald-400" />
      <p className="text-xl font-black text-slate-800">제출 완료!</p>
      <p className="text-sm text-slate-400">답안이 성공적으로 제출되었습니다.</p>
      <button onClick={() => navigate(-1)} className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
        시험 목록으로
      </button>
    </div>
  );

  if (!exam) return null;

  const answeredCount = exam.questions.filter((q) => answers[q.qstnSn]).length;
  const timerCls = countdown && (countdown.h === 0 && countdown.m < 10) ? "text-red-500" : "text-slate-800";

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* 고정 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-10 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <i className="fa-solid fa-clipboard-question text-blue-500" />
          <span className="font-bold text-slate-800 text-base truncate">{exam.examNm}</span>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          {countdown && !countdown.expired && (
            <div className={`flex items-center gap-2 text-sm font-black tabular-nums ${timerCls}`}>
              <i className="fa-regular fa-clock" />
              {String(countdown.h).padStart(2, "0")}:{String(countdown.m).padStart(2, "0")}:{String(countdown.s).padStart(2, "0")}
            </div>
          )}
          <span className="text-sm text-slate-400">
            <span className="font-semibold text-slate-700">{answeredCount}</span> / {exam.questions.length} 답변
          </span>
          <button
            onClick={() => handleSubmit(false)}
            disabled={status === "submitting"}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {status === "submitting" ? "제출 중..." : "답안 제출"}
          </button>
        </div>
      </header>

      {/* 문제 목록 */}
      <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
        {exam.questions.map((q) => (
          <div key={q.qstnSn} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-black flex items-center justify-center flex-shrink-0">
                  {q.qstnNo}
                </span>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.qstnCn}</p>
              </div>
              <span className="text-xs font-bold text-blue-500 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg shrink-0">
                {q.score}점
              </span>
            </div>
            <div className="px-8 py-5">
              {q.qstnType === "MULTIPLE_CHOICE" && q.choices && (
                <div className="flex flex-col gap-2.5">
                  {q.choices.map((choice, i) => {
                    const val = String(i + 1);
                    const selected = answers[q.qstnSn] === val;
                    return (
                      <label key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                        ${selected ? "border-blue-300 bg-blue-50" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}>
                        <input type="radio" name={`q-${q.qstnSn}`} value={val}
                          checked={selected}
                          onChange={() => setAnswer(q.qstnSn, val)}
                          className="accent-blue-600 w-4 h-4 shrink-0" />
                        <span className={`text-sm font-medium ${selected ? "text-blue-700" : "text-slate-700"}`}>{choice}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              {q.qstnType === "SHORT_ANSWER" && (
                <input
                  type="text"
                  value={answers[q.qstnSn] ?? ""}
                  onChange={(e) => setAnswer(q.qstnSn, e.target.value)}
                  placeholder="답을 입력하세요"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              )}
              {q.qstnType === "ESSAY" && (
                <textarea
                  value={answers[q.qstnSn] ?? ""}
                  onChange={(e) => setAnswer(q.qstnSn, e.target.value)}
                  placeholder="서술형 답안을 입력하세요"
                  rows={6}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              )}
            </div>
          </div>
        ))}

        {/* 하단 제출 버튼 */}
        <div className="flex justify-end pt-2 pb-10">
          <button
            onClick={() => handleSubmit(false)}
            disabled={status === "submitting"}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-colors"
          >
            {status === "submitting" ? "제출 중..." : "최종 답안 제출"}
          </button>
        </div>
      </main>
    </div>
  );
}
