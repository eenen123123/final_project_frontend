import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/api";
import RichContent from "../../../components/RichContent";
import type { TabType } from "../../../layouts/ClassroomLayout";

// ── 공통 컴포넌트 ────────────────────────────────────────────────

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="p-20 flex flex-col items-center justify-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-200 text-3xl">
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
  examAvgScore: number | null;
}


interface RecentItem {
  boardSn?: number;
  postSn?: number;
  boardSj?: string;
  postSj?: string;
  regDt: string | null;
}

interface RecentQna extends RecentItem {
  answYn: string;
  answDt?: string | null;
}

interface UnsubmittedAssign {
  asgmtSn: number;
  asgmtNm: string;
  dueDt: string | null;
  submitted: boolean;
}

interface MyAttendanceRecord {
  date: string;
  status: "ATTEND" | "ABSENT" | "LATE" | "EARLY_LEAVE" | null;
}

const ATTEND_STATUS = {
  ATTEND:      { label: "출석", cls: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  LATE:        { label: "지각", cls: "text-amber-600 bg-amber-50 border-amber-200" },
  ABSENT:      { label: "결석", cls: "text-red-500 bg-red-50 border-red-100" },
  EARLY_LEAVE: { label: "조퇴", cls: "text-orange-500 bg-orange-50 border-orange-100" },
} as const;

export function HomeTab({ classSn, onTabChange }: { classSn: number | null; onTabChange: (tab: TabType) => void }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<MySummary | null>(null);
  const [unsubmitted, setUnsubmitted] = useState<UnsubmittedAssign[]>([]);
  const [notices, setNotices] = useState<RecentItem[]>([]);
  const [dataroom, setDataroom] = useState<RecentItem[]>([]);
  const [answeredQna, setAnsweredQna] = useState<RecentQna[]>([]);
  const [attendance, setAttendance] = useState<MyAttendanceRecord[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!classSn) return;
    setLoadError(false);
    const onError = () => setLoadError(true);
    api.get(`/api/classroom/${classSn}/my-summary`).then((r) => setSummary(r.data)).catch(onError);
    api.get(`/api/classroom/${classSn}/assignments`, { params: { page: 1, size: 50 } })
      .then((r) => {
        const items: UnsubmittedAssign[] = r.data.items ?? [];
        setUnsubmitted(items.filter((a) => !a.submitted));
      }).catch(onError);
    api.get(`/api/classroom/${classSn}/notices`, { params: { page: 1, size: 5 } })
      .then((r) => setNotices(r.data.items ?? [])).catch(onError);
    api.get(`/api/classroom/${classSn}/dataroom`, { params: { page: 1, size: 5 } })
      .then((r) => setDataroom(r.data.items ?? [])).catch(onError);
    api.get(`/api/classroom/${classSn}/qna`, { params: { page: 1, size: 20, myOnly: true } })
      .then((r) => {
        const items: RecentQna[] = r.data.items ?? [];
        setAnsweredQna(items.filter((q) => q.answYn === "Y").slice(0, 5));
      }).catch(onError);
    api.get(`/api/classroom/${classSn}/my-attendance`)
      .then((r) => setAttendance(r.data ?? []))
      .catch(onError);
  }, [classSn]);

  const dDayBadge = (dueDt: string | null) => {
    if (!dueDt) return null;
    const diff = Math.ceil((new Date(dueDt).getTime() - Date.now()) / 86400000);
    if (diff < 0) return null;
    if (diff === 0) return { label: "D-DAY", cls: "text-red-500 bg-red-50 border-red-100" };
    if (diff === 1) return { label: "D-1", cls: "text-amber-500 bg-amber-50 border-amber-100" };
    if (diff === 2) return { label: "D-2", cls: "text-blue-500 bg-blue-50 border-blue-100" };
    return null;
  };

  return (
    <div className="flex flex-col gap-5">
      {loadError && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
          <i className="fa-solid fa-triangle-exclamation text-amber-400 shrink-0" />
          일부 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )}
      {/* 요약 카드 3종 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "과제 제출률", value: summary ? `${summary.assignSubmitRate}%` : "-", sub: "제출 / 전체" },
          { label: "평균 점수", value: summary?.examAvgScore != null ? `${summary.examAvgScore}점` : "-", sub: "채점 완료 기준" },
          { label: "예정/진행 시험", value: summary ? `${summary.upcomingExamCount}` : "-", sub: "예정 + 진행 중 합계" },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-xl px-6 py-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{card.label}</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{card.value}</p>
            <p className="text-xs text-slate-300 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* 강좌 진도율 + 출석 현황 + 미제출 과제 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">내 강의 진도율</h3>
            <p className="text-sm text-slate-400 mt-1">강의별 개인 완료 현황</p>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <span className="text-4xl font-black text-slate-800">
              {summary ? `${summary.progressRate}%` : "-"}
            </span>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${summary?.progressRate ?? 0}%` }} />
            </div>
            <p className="text-xs text-slate-400">전체 강의 누적 재생 시간 대비 내가 시청한 시간의 비율입니다.</p>
          </div>
        </div>

        {/* 출석 현황 요약 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">내 출석 현황</h3>
              <p className="text-sm text-slate-400 mt-1">강사가 입력한 출석 기록 요약입니다.</p>
            </div>
            <button onClick={() => onTabChange("attend")} className="text-sm font-semibold text-blue-500 hover:underline shrink-0">
              전체보기
            </button>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {(["ATTEND", "LATE", "ABSENT", "EARLY_LEAVE"] as const).map((s) => {
                const count = attendance.filter((a) => a.status === s).length;
                const info = ATTEND_STATUS[s];
                return (
                  <div key={s} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${info.cls}`}>{info.label}</span>
                    <span className="text-sm font-bold text-slate-700">{count}회</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded border text-slate-400 bg-white border-slate-200">미확인</span>
              <span className="text-sm font-bold text-slate-700">{attendance.filter((a) => a.status === null).length}회</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">미제출 과제</h3>
            <button onClick={() => onTabChange("assign")} className="text-sm font-semibold text-blue-500 hover:underline flex-shrink-0">
              전체 과제
            </button>
          </div>
          {unsubmitted.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <i className="fa-solid fa-circle-check text-3xl text-emerald-200" />
              <p className="text-sm font-medium text-slate-400">미제출 과제가 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {unsubmitted.map((a) => {
                const badge = dDayBadge(a.dueDt);
                return (
                  <li key={a.asgmtSn}
                    onClick={() => navigate(`/classroom/${classId}/assignments/${a.asgmtSn}`)}
                    className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    {badge && (
                      <span className={`text-xs font-black px-2 py-1 rounded-lg border flex-shrink-0 ${badge.cls}`}>{badge.label}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <RichContent html={a.asgmtNm} className="text-sm font-semibold text-slate-800 prose prose-sm max-w-none" />
                      <p className="text-xs text-slate-400 mt-0.5">{a.dueDt ? a.dueDt.slice(0, 10) + " 마감" : "마감일 없음"}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 하단 3열: 최근 공지사항 · 최근 자료실 · 답변된 Q&A */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 최근 공지사항 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">최근 공지사항</h3>
            <button onClick={() => onTabChange("notice")} className="text-sm font-semibold text-blue-500 hover:underline">전체보기</button>
          </div>
          {notices.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <i className="fa-solid fa-bullhorn text-3xl text-slate-200" />
              <p className="text-sm font-medium text-slate-400">공지사항이 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {notices.map((n) => {
                const sn = n.postSn ?? n.boardSn;
                return (
                  <li key={sn}
                    onClick={() => sn && navigate(`/classroom/${classId}/notices/${sn}`)}
                    className="px-6 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <RichContent html={n.boardSj ?? n.postSj ?? "-"} className="text-sm font-medium text-slate-800 prose prose-sm max-w-none" />
                    <span className="text-xs text-slate-400 shrink-0">{n.regDt ? n.regDt.slice(0, 10) : ""}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 최근 자료실 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">최근 자료실</h3>
            <button onClick={() => onTabChange("dataroom")} className="text-sm font-semibold text-blue-500 hover:underline">전체보기</button>
          </div>
          {dataroom.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <i className="fa-solid fa-folder-open text-3xl text-slate-200" />
              <p className="text-sm font-medium text-slate-400">등록된 자료가 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {dataroom.map((d) => {
                const sn = d.postSn ?? d.boardSn;
                return (
                  <li key={sn}
                    onClick={() => sn && navigate(`/classroom/${classId}/dataroom/${sn}`)}
                    className="px-6 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <RichContent html={d.boardSj ?? d.postSj ?? "-"} className="text-sm font-medium text-slate-800 prose prose-sm max-w-none" />
                    <span className="text-xs text-slate-400 shrink-0">{d.regDt ? d.regDt.slice(0, 10) : ""}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 답변된 내 Q&A */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">답변된 내 질문</h3>
            <button onClick={() => onTabChange("qna")} className="text-sm font-semibold text-blue-500 hover:underline">전체보기</button>
          </div>
          {answeredQna.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <i className="fa-solid fa-comments text-3xl text-slate-200" />
              <p className="text-sm font-medium text-slate-400">답변된 질문이 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {answeredQna.map((q) => {
                const sn = q.postSn ?? q.boardSn;
                return (
                  <li key={sn}
                    onClick={() => sn && navigate(`/classroom/${classId}/qna/${sn}`)}
                    className="px-6 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <RichContent html={q.boardSj ?? q.postSj ?? "-"} className="text-sm font-medium text-slate-800 prose prose-sm max-w-none" />
                    <span className="text-xs text-slate-400 shrink-0">{q.answDt ? q.answDt.slice(0, 10) : ""}</span>
                  </li>
                );
              })}
            </ul>
          )}
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
  inqCnt?: number | null;
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
      .catch(() => { });
  }, [classSn, currentPage]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-800">공지사항</h2>
        <p className="text-sm text-slate-400 mt-1">수강생에게 전달할 공지사항입니다.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="bullhorn" message="등록된 공지사항이 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                <th className="py-4 px-7 font-medium">제목</th>
                <th className="py-4 px-7 w-32 font-medium whitespace-nowrap">작성자</th>
                <th className="py-4 px-7 w-20 text-center font-medium whitespace-nowrap">조회</th>
                <th className="py-4 px-7 w-40 font-medium whitespace-nowrap">작성일</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.map((n, idx) => (
                <tr key={n.boardSn ?? n.postSn} onClick={() => navigate(`/classroom/${classId}/notices/${n.boardSn ?? n.postSn}`)} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">
                    {totalCount - (currentPage - 1) * PAGE_SIZE - idx}
                  </td>
                  <td className="py-4 px-7">
                    <RichContent html={n.boardSj ?? n.postSj ?? ""} className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors prose prose-sm max-w-none" />
                  </td>
                  <td className="py-4 px-7 text-sm text-slate-500 whitespace-nowrap">
                    {n.memberDto?.userName ?? n.wrtrUserId ?? "-"}
                  </td>
                  <td className="py-4 px-7 text-sm text-slate-400 text-center whitespace-nowrap">
                    {n.inqCnt ?? "-"}
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
      <div className="px-7 py-4 border-t border-slate-200 flex items-center justify-between">
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
  secondsWatched?: number | null;
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
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-800">강의 목록</h2>
        <p className="text-sm text-slate-400 mt-1">강의를 클릭해서 학습을 시작하세요.</p>
      </div>
      {state.status === "loading" && <div className="px-7 py-20 text-center text-sm text-slate-400">불러오는 중...</div>}
      {state.status === "error" && <div className="px-7 py-20 text-center text-sm text-red-400">강의 목록을 불러오지 못했습니다.</div>}
      {(state.status === "idle" || (state.status === "success" && lectures.length === 0)) && (
        <EmptyState icon="play-circle" message="등록된 강의가 없습니다." />
      )}
      {state.status === "success" && lectures.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">순서</th>
                <th className="py-4 px-7 font-medium">강의명</th>
                <th className="py-4 px-7 w-28 text-center font-medium whitespace-nowrap">재생 시간</th>
                <th className="py-4 px-7 w-28 text-center font-medium whitespace-nowrap">내 진도</th>
                <th className="py-4 px-7 w-28 text-center font-medium whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {lectures.map((l, idx) => (
                <tr key={l.lectureSn} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">{idx + 1}</td>
                  <td className="py-4 px-7">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-400 text-sm flex-shrink-0">
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
                    {l.secondsWatched != null && l.lectureDuration
                      ? (() => {
                          const pct = Math.min(100, Math.round((l.secondsWatched / l.lectureDuration) * 100));
                          return (
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-xs font-semibold ${pct === 100 ? "text-emerald-500" : "text-blue-500"}`}>{pct}%</span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${pct === 100 ? "bg-emerald-400" : "bg-blue-400"}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })()
                      : <span className="text-sm text-slate-300">-</span>
                    }
                  </td>
                  <td className="py-4 px-7 text-right">
                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => window.open(`/viewer?courseId=${courseSn}&lectureId=${l.lectureSn}`, "_blank")}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                      강의 보기
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-7 py-4 border-t border-slate-200">
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
      .catch(() => { });
  }, [classSn, currentPage]);

  const isPast = (dueDt: string | null) => dueDt ? new Date(dueDt) < new Date() : false;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-800">과제 목록</h2>
        <p className="text-sm text-slate-400 mt-1">제출해야 할 과제 목록입니다.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="file-lines" message="등록된 과제가 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                <th className="py-4 px-7 font-medium">제목</th>
                <th className="py-4 px-7 w-32 text-center font-medium whitespace-nowrap">제출 상태</th>
                <th className="py-4 px-7 w-24 text-center font-medium whitespace-nowrap">점수</th>
                <th className="py-4 px-7 w-44 font-medium whitespace-nowrap">마감일</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.map((a, idx) => (
                <tr key={a.asgmtSn} onClick={() => navigate(`/classroom/${classId}/assignments/${a.asgmtSn}`)} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">
                    {totalCount - (currentPage - 1) * PAGE_SIZE - idx}
                  </td>
                  <td className="py-4 px-7">
                    <RichContent html={a.asgmtNm} className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors prose prose-sm max-w-none" />
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
                    {a.dueDt ? a.dueDt.slice(0, 16).replace("T", " ") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-7 py-4 border-t border-slate-200 flex items-center justify-between">
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
  inqCnt?: number | null;
  answYn: string;
}

export function QnaTab({ classSn }: { classSn: number | null }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<QnaItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!classSn) return;
    api.get(`/api/classroom/${classSn}/qna`, { params: { page: currentPage, size: PAGE_SIZE, myOnly: false } })
      .then((r) => { setItems(r.data.items ?? []); setTotalCount(r.data.totalCount ?? 0); setTotalPages(r.data.totalPages ?? 0); })
      .catch(() => { });
  }, [classSn, currentPage]);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-7 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Q&A</h2>
            <p className="text-sm text-slate-400 mt-1">강사에게 질문을 남겨보세요.</p>
          </div>
          <button onClick={() => navigate(`/classroom/${classId}/qna/write`)} className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            질문 작성
          </button>
        </div>
        {items.length === 0 ? (
          <EmptyState icon="comments" message="등록된 질문이 없습니다." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-400">
                  <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                  <th className="py-4 px-7 font-medium">제목</th>
                  <th className="py-4 px-7 w-28 font-medium whitespace-nowrap">작성자</th>
                  <th className="py-4 px-7 w-24 text-center font-medium whitespace-nowrap">답변</th>
                  <th className="py-4 px-7 w-16 text-center font-medium whitespace-nowrap">조회</th>
                  <th className="py-4 px-7 w-32 font-medium whitespace-nowrap">작성일</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {items.map((q, idx) => (
                  <tr key={q.boardSn ?? q.postSn} onClick={() => navigate(`/classroom/${classId}/qna/${q.boardSn ?? q.postSn}`)} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">
                      {totalCount - (currentPage - 1) * PAGE_SIZE - idx}
                    </td>
                    <td className="py-4 px-7">
                      <RichContent html={q.boardSj ?? q.postSj ?? ""} className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors prose prose-sm max-w-none" />
                    </td>
                    <td className="py-4 px-7 text-sm text-slate-500 whitespace-nowrap">
                      {q.memberDto?.userName ?? q.wrtrUserId ?? "-"}
                    </td>
                    <td className="py-4 px-7 text-center whitespace-nowrap">
                      {q.answYn === "Y"
                        ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-500 border border-emerald-100">답변완료</span>
                        : <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-500 bg-amber-50 border border-amber-200">미답변</span>
                      }
                    </td>
                    <td className="py-4 px-7 text-sm text-slate-400 text-center whitespace-nowrap">
                      {q.inqCnt ?? "-"}
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
        <div className="px-7 py-4 border-t border-slate-200 flex items-center justify-between">
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
  inqCnt?: number | null;
  atchFileId?: number | null;
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
      .catch(() => { });
  }, [classSn, currentPage]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-800">자료실</h2>
        <p className="text-sm text-slate-400 mt-1">강사가 제공한 학습 자료입니다.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="folder-open" message="등록된 자료가 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="py-4 px-7 w-14 font-medium whitespace-nowrap">번호</th>
                <th className="py-4 px-7 font-medium">제목</th>
                <th className="py-4 px-7 w-32 font-medium whitespace-nowrap">작성자</th>
                <th className="py-4 px-7 w-16 text-center font-medium whitespace-nowrap">조회</th>
                <th className="py-4 px-7 w-32 font-medium whitespace-nowrap">등록일</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.map((d, idx) => (
                <tr key={d.boardSn ?? d.postSn} onClick={() => navigate(`/classroom/${classId}/dataroom/${d.boardSn ?? d.postSn}`)} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">
                    {totalCount - (currentPage - 1) * PAGE_SIZE - idx}
                  </td>
                  <td className="py-4 px-7">
                    <RichContent html={d.boardSj ?? d.postSj ?? ""} className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors prose prose-sm max-w-none" />
                  </td>
                  <td className="py-4 px-7 text-sm text-slate-500 whitespace-nowrap">
                    {d.memberDto?.userName ?? d.wrtrUserId ?? "-"}
                  </td>
                  <td className="py-4 px-7 text-sm text-slate-400 text-center whitespace-nowrap">
                    {d.inqCnt ?? "-"}
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
      <div className="px-7 py-4 border-t border-slate-200 flex items-center justify-between">
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
  UPCOMING: { label: "예정", cls: "border-blue-100 bg-blue-50 text-blue-600" },
  ONGOING: { label: "진행중", cls: "border-emerald-100 bg-emerald-50 text-emerald-600" },
  CLOSED: { label: "종료", cls: "border-slate-200 bg-slate-100 text-slate-400" },
};

export function ExamTab({ classSn }: { classSn: number | null }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<ExamItem[]>([]);

  useEffect(() => {
    if (!classSn) return;
    api.get(`/api/classroom/${classSn}/exams`)
      .then((r) => setItems(r.data ?? []))
      .catch(() => { });
  }, [classSn]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-800">시험 목록</h2>
        <p className="text-sm text-slate-400 mt-1">이 클래스룸에 등록된 시험 목록입니다.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="clipboard-question" message="등록된 시험이 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
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
                  <tr key={e.examSn} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-7 text-sm text-slate-300 font-mono whitespace-nowrap">{items.length - idx}</td>
                    <td className="py-4 px-7">
                      <RichContent html={e.examNm} className="font-semibold text-slate-800 text-sm prose prose-sm max-w-none" />
                    </td>
                    <td className="py-4 px-7 text-center whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="py-4 px-7 text-sm font-mono text-slate-400 whitespace-nowrap">
                      {e.examStrtDt && e.examEndDt
                        ? `${e.examStrtDt.slice(0, 16).replace("T", " ")} ~ ${e.examEndDt.slice(0, 16).replace("T", " ")}`
                        : "-"}
                    </td>
                    <td className="py-4 px-7 text-center whitespace-nowrap">
                      {e.attempted
                        ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">응시완료</span>
                        : e.status === "ONGOING"
                          ? <button onClick={() => navigate(`/classroom/${classId}/exams/${e.examSn}`)} className="text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">응시하기</button>
                          : e.status === "CLOSED"
                            ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-100 bg-rose-50 text-rose-400">미응시</span>
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
      <div className="px-7 py-4 border-t border-slate-200">
        <p className="text-sm text-slate-400">전체 <span className="font-semibold text-slate-600">{items.length}</span>건</p>
      </div>
    </div>
  );
}

// ── 출석 탭 ──────────────────────────────────────────────────────

const DAY_COLORS: Record<string, string> = {
  ATTEND:      "bg-emerald-500 text-white",
  LATE:        "bg-amber-400 text-white",
  ABSENT:      "bg-red-400 text-white",
  EARLY_LEAVE: "bg-orange-400 text-white",
};

export function AttendTab({ classSn, startYmd, endYmd }: {
  classSn: number | null;
  startYmd: string | null;
  endYmd: string | null;
}) {
  const now = new Date();
  const [records, setRecords] = useState<MyAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    if (!classSn) return;
    setLoading(true);
    api.get(`/api/classroom/${classSn}/my-attendance`)
      .then((r) => setRecords(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classSn]);

  // 운영기간 범위 계산
  const startDate = startYmd ? new Date(startYmd) : null;
  const endDate = endYmd ? new Date(endYmd) : now;
  const limitEnd = endDate > now ? now : endDate;
  const minYear = startDate?.getFullYear() ?? viewYear;
  const minMonth = startDate ? startDate.getMonth() + 1 : viewMonth;
  const maxYear = limitEnd.getFullYear();
  const maxMonth = limitEnd.getMonth() + 1;

  const isAtMin = viewYear === minYear && viewMonth === minMonth;
  const isAtMax = viewYear === maxYear && viewMonth === maxMonth;

  const handlePrevMonth = () => {
    if (isAtMin) return;
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (isAtMax) return;
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  };
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth() + 1;

  // 이번 달 레코드 맵 { "15": "ATTEND", ... }
  const monthPrefix = `${viewYear}-${String(viewMonth).padStart(2, "0")}`;
  const monthMap = new Map<number, MyAttendanceRecord["status"]>(
    records
      .filter((r) => r.date?.startsWith(monthPrefix))
      .map((r) => [parseInt(r.date.slice(8, 10)), r.status]),
  );

  const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth - 1, 0).getDate();

  // 전체 누계
  const total = {
    ATTEND:      records.filter((r) => r.status === "ATTEND").length,
    LATE:        records.filter((r) => r.status === "LATE").length,
    ABSENT:      records.filter((r) => r.status === "ABSENT").length,
    EARLY_LEAVE: records.filter((r) => r.status === "EARLY_LEAVE").length,
    unknown:     records.filter((r) => r.status === null).length,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-800">출석 현황</h2>
        <p className="text-sm text-slate-400 mt-1">강사가 입력한 날짜별 출석 기록입니다.</p>
      </div>

      {/* 전체 누계 */}
      <div className="px-7 py-4 border-b border-slate-200 flex items-center gap-6 flex-wrap">
        {(["ATTEND", "LATE", "ABSENT", "EARLY_LEAVE"] as const).map((s) => {
          const info = ATTEND_STATUS[s];
          return (
            <div key={s} className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${info.cls}`}>{info.label}</span>
              <span className="text-sm font-bold text-slate-700">{total[s]}회</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border text-slate-400 bg-slate-50 border-slate-200">미확인</span>
          <span className="text-sm font-bold text-slate-700">{total.unknown}회</span>
        </div>
      </div>

      {loading ? (
        <div className="px-7 py-20 text-center text-sm text-slate-400">불러오는 중...</div>
      ) : (
        <div className="px-7 py-6">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={handlePrevMonth} disabled={isAtMin}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-slate-800">{viewYear}년 {viewMonth}월</span>
            <button onClick={handleNextMonth} disabled={isAtMax}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 범례 */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {(["ATTEND", "LATE", "ABSENT", "EARLY_LEAVE"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`w-2.5 h-2.5 rounded-full ${DAY_COLORS[s].split(" ")[0]}`} />
                {ATTEND_STATUS[s].label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />미확인
            </span>
          </div>

          {/* 캘린더 그리드 */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <div key={d} className={`text-xs font-bold pb-2 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-slate-400"}`}>
                {d}
              </div>
            ))}
            {/* 이전 달 채우기 */}
            {Array.from({ length: firstDow }, (_, i) => (
              <div key={`prev-${i}`} className="h-10 flex items-center justify-center text-xs text-slate-200">
                {prevMonthDays - firstDow + 1 + i}
              </div>
            ))}
            {/* 이번 달 날짜 */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const status = monthMap.has(day) ? monthMap.get(day) : undefined;
              const isToday = isCurrentMonth && day === now.getDate();
              const colorCls = status ? DAY_COLORS[status] : status === null ? "bg-slate-200 text-slate-500" : "";
              return (
                <div key={day}
                  className={`h-10 flex flex-col items-center justify-center text-xs rounded-lg font-semibold transition-colors
                    ${colorCls || (isToday ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50")}`}>
                  {day}
                  {status === null && (
                    <span className="text-[9px] font-normal leading-none mt-0.5 opacity-70">미확인</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-7 py-4 border-t border-slate-200">
        <p className="text-sm text-slate-400">전체 출석 입력 <span className="font-semibold text-slate-600">{records.length}</span>일</p>
      </div>
    </div>
  );
}
