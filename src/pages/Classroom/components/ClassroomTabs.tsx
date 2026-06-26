import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/api";

type TabType = "home" | "notice" | "lecture" | "assign" | "qna" | "dataroom" | "exam";

// ── 공통 컴포넌트 ────────────────────────────────────────────────

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="p-20 flex flex-col items-center justify-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 text-3xl">
        <i className={`fa-solid fa-${icon}`} />
      </div>
      <p className="text-base font-medium text-slate-400">{message}</p>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-1">
      {currentPage > 1 && (
        <button onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft size={14} />
        </button>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors font-medium
            ${p === currentPage ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
          {p}
        </button>
      ))}
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ── 홈 탭 ────────────────────────────────────────────────────────

interface MySummary {
  progressRate: number;
  assignSubmitRate: number;
  upcomingExamCount: number;
  avgScore: number | null;
}

interface UpcomingAssignment {
  asgmtSn: number;
  asgmtNm: string;
  dueDt: string;
  submitted: boolean;
}

export function HomeTab({ classSn, onTabChange }: { classSn: number | null; onTabChange: (tab: TabType) => void }) {
  const [summary, setSummary] = useState<MySummary | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingAssignment[]>([]);

  useEffect(() => {
    if (!classSn) return;
    api.get(`/api/classroom/${classSn}/my-summary`).then((r) => setSummary(r.data)).catch(() => {});
    api.get(`/api/classroom/${classSn}/assignments/upcoming`).then((r) => setUpcoming(r.data)).catch(() => {});
  }, [classSn]);

  const dDayLabel = (dueDt: string) => {
    const diff = Math.ceil((new Date(dueDt).getTime() - Date.now()) / 86400000);
    if (diff <= 0) return { label: "D-DAY", cls: "text-red-500 bg-red-50 border-red-100" };
    if (diff === 1) return { label: "D-1",   cls: "text-amber-500 bg-amber-50 border-amber-100" };
    return            { label: "D-2",   cls: "text-blue-500 bg-blue-50 border-blue-100" };
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 요약 카드 4종 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "내 진도율",    value: summary ? `${summary.progressRate}%`    : "-", sub: "강의 완료 기준" },
          { label: "과제 제출률",  value: summary ? `${summary.assignSubmitRate}%` : "-", sub: "제출 / 전체" },
          { label: "평균 점수",    value: summary?.avgScore != null ? `${summary.avgScore}점` : "-", sub: "채점 완료 기준" },
          { label: "예정/진행 시험", value: summary ? `${summary.upcomingExamCount}` : "0", sub: `진행중 0 · 예정 ${summary?.upcomingExamCount ?? 0}` },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-slate-100 rounded-xl px-6 py-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{card.label}</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{card.value}</p>
            <p className="text-xs text-slate-300 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* 강좌 진도율 + 마감 임박 과제 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">내 강의 진도율</h3>
            <p className="text-sm text-slate-400 mt-1">강의별 개인 완료 현황</p>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-slate-800">
                {summary ? `${summary.progressRate}%` : "-"}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${summary?.progressRate ?? 0}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">마감 임박 과제</h3>
              <p className="text-sm text-slate-400 mt-1">오늘 ~ 2일 이내 마감</p>
            </div>
            <button onClick={() => onTabChange("assign")}
              className="text-sm font-semibold text-blue-500 hover:underline flex-shrink-0">
              전체 과제
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <i className="fa-solid fa-circle-check text-3xl text-emerald-200" />
              <p className="text-sm font-medium text-slate-400">임박한 마감이 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {upcoming.map((a) => {
                const { label, cls } = dDayLabel(a.dueDt);
                return (
                  <li key={a.asgmtSn} className="px-6 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <span className={`text-xs font-black px-2 py-1 rounded-lg border flex-shrink-0 ${cls}`}>{label}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{a.asgmtNm}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.dueDt} 마감</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 하단 3열 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">예정/진행 시험</h3>
            <button onClick={() => onTabChange("exam")} className="text-sm font-semibold text-blue-500 hover:underline">전체</button>
          </div>
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
            <i className="fa-solid fa-clipboard-question text-3xl text-slate-200" />
            <p className="text-sm font-medium text-slate-400">예정된 시험이 없습니다.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">미제출 과제</h3>
            <button onClick={() => onTabChange("assign")} className="text-sm font-semibold text-blue-500 hover:underline">제출하기</button>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <i className="fa-solid fa-inbox text-3xl text-slate-200" />
              <p className="text-sm font-medium text-slate-400">미제출 과제가 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {upcoming.map((a) => (
                <li key={a.asgmtSn} className="px-6 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{a.asgmtNm}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.dueDt} 마감</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">최근 공지사항</h3>
            <button onClick={() => onTabChange("notice")} className="text-sm font-semibold text-blue-500 hover:underline">전체보기</button>
          </div>
          <div className="p-6">
            <p className="text-xs font-medium text-slate-400 text-center py-4">등록된 공지사항이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 공지사항 탭 ──────────────────────────────────────────────────

interface NoticeItem {
  boardSn?: number;
  postSn?: number;
  boardSj?: string;
  postSj?: string;
  wrtrUserId?: string;
  memberDto?: { userName: string };
  regDt: string | null;
}

export function NoticeTab({ classSn }: { classSn: number | null }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<NoticeItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!classSn) return;
    api.get(`/api/classroom/${classSn}/notices`, { params: { page: currentPage, size: PAGE_SIZE } })
      .then((r) => { setItems(r.data.items ?? []); setTotalCount(r.data.totalCount ?? 0); setTotalPages(r.data.totalPages ?? 0); })
      .catch(() => {});
  }, [classSn, currentPage]);

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">공지사항</h2>
        <p className="text-sm text-slate-400 mt-1">수강생에게 전달할 공지사항입니다.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="bullhorn" message="등록된 공지사항이 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                <th className="py-4 px-7 font-medium">제목</th>
                <th className="py-4 px-7 w-32 font-medium whitespace-nowrap">작성자</th>
                <th className="py-4 px-7 w-40 font-medium whitespace-nowrap">작성일</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.map((n, idx) => (
                <tr key={n.boardSn ?? n.postSn} onClick={() => navigate(`/classroom/${classId}/notices/${n.boardSn ?? n.postSn}`)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">
                    {totalCount - (currentPage - 1) * PAGE_SIZE - idx}
                  </td>
                  <td className="py-4 px-7">
                    <span className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors">{n.boardSj ?? n.postSj}</span>
                  </td>
                  <td className="py-4 px-7 text-sm text-slate-500 whitespace-nowrap">
                    {n.memberDto?.userName ?? n.wrtrUserId ?? "-"}
                  </td>
                  <td className="py-4 px-7 text-sm text-slate-400 font-mono whitespace-nowrap">
                    {n.regDt ? n.regDt.slice(0, 10) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-400">전체 <span className="font-semibold text-slate-600">{totalCount}</span>건</p>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

// ── 온라인 강의 탭 ───────────────────────────────────────────────

interface LectureSummary {
  lectureSn: number;
  lectureName: string;
  lectureDuration: number | null;
}

type LectureFetch =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; lectures: LectureSummary[] };

export function LectureTab({ courseSn }: { courseSn: number | null }) {
  const [state, setState] = useState<LectureFetch>({ status: "idle" });

  useEffect(() => {
    if (!courseSn) { setState({ status: "idle" }); return; }
    setState({ status: "loading" });
    api.get(`/api/course/${courseSn}`)
      .then((r) => setState({ status: "success", lectures: r.data.lectures }))
      .catch(() => setState({ status: "error" }));
  }, [courseSn]);

  const lectures = state.status === "success" ? state.lectures : [];

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">강의 목록</h2>
        <p className="text-sm text-slate-400 mt-1">강의를 클릭해서 학습을 시작하세요.</p>
      </div>
      {state.status === "loading" && <div className="px-7 py-20 text-center text-sm text-slate-400">불러오는 중...</div>}
      {state.status === "error"   && <div className="px-7 py-20 text-center text-sm text-red-400">강의 목록을 불러오지 못했습니다.</div>}
      {(state.status === "idle" || (state.status === "success" && lectures.length === 0)) && (
        <EmptyState icon="play-circle" message="등록된 강의가 없습니다." />
      )}
      {state.status === "success" && lectures.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">순서</th>
                <th className="py-4 px-7 font-medium">강의명</th>
                <th className="py-4 px-7 w-28 text-center font-medium whitespace-nowrap">재생 시간</th>
                <th className="py-4 px-7 w-28 text-center font-medium whitespace-nowrap">내 진도</th>
                <th className="py-4 px-7 w-28 text-center font-medium whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {lectures.map((l, idx) => (
                <tr key={l.lectureSn} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">{idx + 1}</td>
                  <td className="py-4 px-7">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-400 text-sm flex-shrink-0">
                        <i className="fa-solid fa-play" />
                      </span>
                      <span className="font-semibold text-slate-800 text-sm">{l.lectureName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-7 text-center text-sm text-slate-400 font-mono whitespace-nowrap">
                    {l.lectureDuration
                      ? `${Math.floor(l.lectureDuration / 60)}:${String(l.lectureDuration % 60).padStart(2, "0")}`
                      : "-"}
                  </td>
                  <td className="py-4 px-7 text-center">
                    <span className="text-sm text-slate-300">-</span>
                  </td>
                  <td className="py-4 px-7 text-right">
                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => window.open(`/viewer?courseId=${courseSn}&lectureId=${l.lectureSn}`, "_blank")}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                      강의 보기
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-7 py-4 border-t border-slate-100">
        <p className="text-sm text-slate-400">전체 <span className="font-semibold text-slate-600">{lectures.length}</span>개 강의</p>
      </div>
    </div>
  );
}

// ── 과제 탭 ──────────────────────────────────────────────────────

interface AssignItem {
  asgmtSn: number;
  asgmtNm: string;
  dueDt: string | null;
  submitted: boolean;
  score: number | null;
}

export function AssignTab({ classSn }: { classSn: number | null }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<AssignItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!classSn) return;
    api.get(`/api/classroom/${classSn}/assignments`, { params: { page: currentPage, size: PAGE_SIZE } })
      .then((r) => { setItems(r.data.items ?? []); setTotalCount(r.data.totalCount ?? 0); setTotalPages(r.data.totalPages ?? 0); })
      .catch(() => {});
  }, [classSn, currentPage]);

  const isPast = (dueDt: string | null) => dueDt ? new Date(dueDt) < new Date() : false;

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">과제 목록</h2>
        <p className="text-sm text-slate-400 mt-1">제출해야 할 과제 목록입니다.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="file-lines" message="등록된 과제가 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                <th className="py-4 px-7 font-medium">제목</th>
                <th className="py-4 px-7 w-32 text-center font-medium whitespace-nowrap">제출 상태</th>
                <th className="py-4 px-7 w-24 text-center font-medium whitespace-nowrap">점수</th>
                <th className="py-4 px-7 w-44 font-medium whitespace-nowrap">마감일</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.map((a, idx) => (
                <tr key={a.asgmtSn} onClick={() => navigate(`/classroom/${classId}/assignments/${a.asgmtSn}`)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">
                    {totalCount - (currentPage - 1) * PAGE_SIZE - idx}
                  </td>
                  <td className="py-4 px-7">
                    <span className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors">{a.asgmtNm}</span>
                  </td>
                  <td className="py-4 px-7 text-center whitespace-nowrap">
                    {a.submitted
                      ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">제출완료</span>
                      : <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-100 bg-rose-50 text-rose-500">미제출</span>
                    }
                  </td>
                  <td className="py-4 px-7 text-center text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {a.score != null ? `${a.score}점` : "-"}
                  </td>
                  <td className={`py-4 px-7 text-sm font-mono whitespace-nowrap ${isPast(a.dueDt) ? "text-slate-300" : "text-slate-400"}`}>
                    {a.dueDt ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-400">전체 <span className="font-semibold text-slate-600">{totalCount}</span>건</p>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

// ── Q&A 탭 ───────────────────────────────────────────────────────

interface QnaItem {
  boardSn?: number;
  postSn?: number;
  boardSj?: string;
  postSj?: string;
  wrtrUserId?: string;
  memberDto?: { userName: string };
  regDt: string | null;
  answYn: string;
}

export function QnaTab({ classSn }: { classSn: number | null }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<QnaItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ boardSj: "", boardCn: "" });
  const [submitting, setSubmitting] = useState(false);
  const PAGE_SIZE = 10;

  const load = () => {
    if (!classSn) return;
    api.get(`/api/classroom/${classSn}/qna`, { params: { page: currentPage, size: PAGE_SIZE, myOnly: false } })
      .then((r) => { setItems(r.data.items ?? []); setTotalCount(r.data.totalCount ?? 0); setTotalPages(r.data.totalPages ?? 0); })
      .catch(() => {});
  };

  useEffect(() => { load(); }, [classSn, currentPage]);

  const handlePost = async () => {
    if (!form.boardSj.trim() || !form.boardCn.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/api/classroom/${classSn}/qna`, form);
      setShowModal(false);
      setForm({ boardSj: "", boardCn: "" });
      load();
    } catch {
      alert("질문 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 질문 작성 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">질문 작성</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>
            <div className="px-7 py-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">제목</label>
                <input
                  type="text"
                  value={form.boardSj}
                  onChange={(e) => setForm((f) => ({ ...f, boardSj: e.target.value }))}
                  placeholder="질문 제목을 입력하세요"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">내용</label>
                <textarea
                  value={form.boardCn}
                  onChange={(e) => setForm((f) => ({ ...f, boardCn: e.target.value }))}
                  placeholder="질문 내용을 입력하세요"
                  rows={6}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
            </div>
            <div className="px-7 py-4 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">취소</button>
              <button onClick={handlePost} disabled={submitting || !form.boardSj.trim() || !form.boardCn.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg transition-colors">
                {submitting ? "등록 중..." : "질문 등록"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Q&A</h2>
            <p className="text-sm text-slate-400 mt-1">강사에게 질문을 남겨보세요.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            질문 작성
          </button>
        </div>
        {items.length === 0 ? (
          <EmptyState icon="comments" message="등록된 질문이 없습니다." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm text-slate-400">
                  <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                  <th className="py-4 px-7 font-medium">제목</th>
                  <th className="py-4 px-7 w-28 font-medium whitespace-nowrap">작성자</th>
                  <th className="py-4 px-7 w-32 text-center font-medium whitespace-nowrap">답변</th>
                  <th className="py-4 px-7 w-40 font-medium whitespace-nowrap">작성일</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {items.map((q, idx) => (
                  <tr key={q.boardSn ?? q.postSn} onClick={() => navigate(`/classroom/${classId}/qna/${q.boardSn ?? q.postSn}`)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">
                      {totalCount - (currentPage - 1) * PAGE_SIZE - idx}
                    </td>
                    <td className="py-4 px-7">
                      <span className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors">{q.boardSj ?? q.postSj}</span>
                    </td>
                    <td className="py-4 px-7 text-sm text-slate-500 whitespace-nowrap">
                      {q.memberDto?.userName ?? q.wrtrUserId ?? "-"}
                    </td>
                    <td className="py-4 px-7 text-center whitespace-nowrap">
                      {q.answYn === "Y"
                        ? <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold text-emerald-500 border border-emerald-100">답변완료</span>
                        : <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold text-amber-500 border border-amber-100">미답변</span>
                      }
                    </td>
                    <td className="py-4 px-7 text-sm text-slate-400 font-mono whitespace-nowrap">
                      {q.regDt ? q.regDt.slice(0, 10) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-400">전체 <span className="font-semibold text-slate-600">{totalCount}</span>건</p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </>
  );
}

// ── 자료실 탭 ────────────────────────────────────────────────────

interface DataroomItem {
  boardSn?: number;
  postSn?: number;
  boardSj?: string;
  postSj?: string;
  wrtrUserId?: string;
  memberDto?: { userName: string };
  regDt: string | null;
  atchFileId?: string | null;
}

export function DataroomTab({ classSn }: { classSn: number | null }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<DataroomItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!classSn) return;
    api.get(`/api/classroom/${classSn}/dataroom`, { params: { page: currentPage, size: PAGE_SIZE } })
      .then((r) => { setItems(r.data.items ?? []); setTotalCount(r.data.totalCount ?? 0); setTotalPages(r.data.totalPages ?? 0); })
      .catch(() => {});
  }, [classSn, currentPage]);

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">자료실</h2>
        <p className="text-sm text-slate-400 mt-1">강사가 제공한 학습 자료입니다.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="folder-open" message="등록된 자료가 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                <th className="py-4 px-7 font-medium">제목</th>
                <th className="py-4 px-7 w-20 text-center font-medium whitespace-nowrap">파일</th>
                <th className="py-4 px-7 w-32 font-medium whitespace-nowrap">작성자</th>
                <th className="py-4 px-7 w-40 font-medium whitespace-nowrap">등록일</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.map((d, idx) => (
                <tr key={d.boardSn ?? d.postSn} onClick={() => navigate(`/classroom/${classId}/dataroom/${d.boardSn ?? d.postSn}`)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">
                    {totalCount - (currentPage - 1) * PAGE_SIZE - idx}
                  </td>
                  <td className="py-4 px-7">
                    <span className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors">{d.boardSj ?? d.postSj}</span>
                  </td>
                  <td className="py-4 px-7 text-center">
                    {d.atchFileId && (
                      <a
                        href={`/api/files/${d.atchFileId}/download`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg whitespace-nowrap hover:bg-blue-100 transition-colors"
                      >
                        <i className="fa-solid fa-download text-xs" /> 다운로드
                      </a>
                    )}
                  </td>
                  <td className="py-4 px-7 text-sm text-slate-500 whitespace-nowrap">
                    {d.memberDto?.userName ?? d.wrtrUserId ?? "-"}
                  </td>
                  <td className="py-4 px-7 text-sm text-slate-400 font-mono whitespace-nowrap">
                    {d.regDt ? d.regDt.slice(0, 10) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-400">전체 <span className="font-semibold text-slate-600">{totalCount}</span>건</p>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

// ── 시험 탭 ──────────────────────────────────────────────────────

interface ExamItem {
  examSn: number;
  examNm: string;
  examStrtDt: string | null;
  examEndDt: string | null;
  status: "UPCOMING" | "ONGOING" | "CLOSED";
  attempted: boolean;
  score: number | null;
}

const EXAM_STATUS = {
  UPCOMING: { label: "예정",   cls: "border-blue-100 bg-blue-50 text-blue-600" },
  ONGOING:  { label: "진행중", cls: "border-emerald-100 bg-emerald-50 text-emerald-600" },
  CLOSED:   { label: "종료",   cls: "border-slate-100 bg-slate-100 text-slate-400" },
};

export function ExamTab({ classSn }: { classSn: number | null }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<ExamItem[]>([]);

  useEffect(() => {
    if (!classSn) return;
    api.get(`/api/classroom/${classSn}/exams`)
      .then((r) => setItems(r.data ?? []))
      .catch(() => {});
  }, [classSn]);

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">시험 목록</h2>
        <p className="text-sm text-slate-400 mt-1">이 클래스룸에 등록된 시험 목록입니다.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="clipboard-question" message="등록된 시험이 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                <th className="py-4 px-7 font-medium">시험명</th>
                <th className="py-4 px-7 w-24 text-center font-medium whitespace-nowrap">상태</th>
                <th className="py-4 px-7 w-44 font-medium whitespace-nowrap">시험 기간</th>
                <th className="py-4 px-7 w-28 text-center font-medium whitespace-nowrap">응시 여부</th>
                <th className="py-4 px-7 w-24 text-center font-medium whitespace-nowrap">점수</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.map((e, idx) => {
                const st = EXAM_STATUS[e.status] ?? EXAM_STATUS.CLOSED;
                return (
                  <tr key={e.examSn} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">{items.length - idx}</td>
                    <td className="py-4 px-7">
                      <span className="font-semibold text-slate-800 text-sm">{e.examNm}</span>
                    </td>
                    <td className="py-4 px-7 text-center whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="py-4 px-7 text-sm font-mono text-slate-400 whitespace-nowrap">
                      {e.examStrtDt && e.examEndDt ? `${e.examStrtDt} ~ ${e.examEndDt}` : "-"}
                    </td>
                    <td className="py-4 px-7 text-center whitespace-nowrap">
                      {e.attempted
                        ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">응시완료</span>
                        : e.status === "ONGOING"
                          ? <button onClick={() => navigate(`/classroom/${classId}/exams/${e.examSn}`)} className="text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">응시하기</button>
                          : <span className="text-sm text-slate-300">-</span>
                      }
                    </td>
                    <td className="py-4 px-7 text-center text-sm font-semibold text-slate-700 whitespace-nowrap">
                      {e.score != null ? `${e.score}점` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-7 py-4 border-t border-slate-100">
        <p className="text-sm text-slate-400">전체 <span className="font-semibold text-slate-600">{items.length}</span>건</p>
      </div>
    </div>
  );
}
