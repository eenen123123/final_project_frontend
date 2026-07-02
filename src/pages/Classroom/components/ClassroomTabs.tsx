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

const PAGINATION_ELLIPSIS = "…";

function getPageItems(currentPage: number, totalPages: number, siblingCount = 1): (number | typeof PAGINATION_ELLIPSIS)[] {
  const totalVisible = siblingCount * 2 + 5; // first + last + current + 2 siblings + 2 ellipses
  if (totalPages <= totalVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const items: (number | typeof PAGINATION_ELLIPSIS)[] = [1];
  if (showLeftEllipsis) items.push(PAGINATION_ELLIPSIS);
  for (let i = Math.max(leftSibling, 2); i <= Math.min(rightSibling, totalPages - 1); i++) items.push(i);
  if (showRightEllipsis) items.push(PAGINATION_ELLIPSIS);
  items.push(totalPages);
  return items;
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
          className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
          <ChevronLeft size={14} />
        </button>
      )}
      {getPageItems(currentPage, totalPages).map((p, i) =>
        p === PAGINATION_ELLIPSIS
          ? <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-300 select-none shrink-0">{PAGINATION_ELLIPSIS}</span>
          : (
            <button key={p} onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors font-medium shrink-0
                ${p === currentPage ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
              {p}
            </button>
          )
      )}
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function ListFooter({ totalCount, currentPage, totalPages, onPageChange }: {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="px-7 py-4 border-t border-slate-200 flex items-center justify-between gap-3 md:grid md:grid-cols-3">
      <p className="text-sm text-slate-400 shrink-0 whitespace-nowrap">전체 <span className="font-semibold text-slate-600">{totalCount}</span>건</p>
      <div className="md:justify-self-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
      <div className="hidden md:block" />
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

export function HomeTab({ classSn, onTabChange }: { classSn: number | null; onTabChange: (tab: TabType) => void }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<MySummary | null>(null);
  const [unsubmitted, setUnsubmitted] = useState<UnsubmittedAssign[]>([]);
  const [notices, setNotices] = useState<RecentItem[]>([]);
  const [dataroom, setDataroom] = useState<RecentItem[]>([]);
  const [answeredQna, setAnsweredQna] = useState<RecentQna[]>([]);
  const [loadError, setLoadError] = useState(false);
  // eslint-disable-next-line react-hooks/purity -- D-day badge intentionally reflects wall-clock time at render
  const now = Date.now();

  useEffect(() => {
    if (!classSn) return;
    Promise.allSettled([
      api.get(`/api/classroom/${classSn}/my-summary`).then((r) => setSummary(r.data)),
      api.get(`/api/classroom/${classSn}/assignments`, { params: { page: 1, size: 50 } })
        .then((r) => {
          const items: UnsubmittedAssign[] = r.data.items ?? [];
          setUnsubmitted(items.filter((a) => !a.submitted));
        }),
      api.get(`/api/classroom/${classSn}/notices`, { params: { page: 1, size: 5 } })
        .then((r) => setNotices(r.data.items ?? [])),
      api.get(`/api/classroom/${classSn}/dataroom`, { params: { page: 1, size: 5 } })
        .then((r) => setDataroom(r.data.items ?? [])),
      api.get(`/api/classroom/${classSn}/qna`, { params: { page: 1, size: 20, myOnly: true } })
        .then((r) => {
          const items: RecentQna[] = r.data.items ?? [];
          setAnsweredQna(items.filter((q) => q.answYn === "Y").slice(0, 5));
        }),
    ]).then((results) => setLoadError(results.some((r) => r.status === "rejected")));
  }, [classSn]);

  const dDayBadge = (dueDt: string | null) => {
    if (!dueDt) return null;
    const diff = Math.ceil((new Date(dueDt).getTime() - now) / 86400000);
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

      {/* 강좌 진도율 + 미제출 과제 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">미제출 과제</h3>
            <button onClick={() => onTabChange("assign")} className="text-sm font-semibold text-blue-500 hover:underline shrink-0">
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
                      <span className={`text-xs font-black px-2 py-1 rounded-lg border shrink-0 ${badge.cls}`}>{badge.label}</span>
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
                    <RichContent html={n.boardSj ?? n.postSj ?? "-"} className="text-sm font-medium text-slate-800 prose prose-sm max-w-none flex-1 min-w-0" />
                    <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{n.regDt ? n.regDt.slice(0, 10) : ""}</span>
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
                    <RichContent html={d.boardSj ?? d.postSj ?? "-"} className="text-sm font-medium text-slate-800 prose prose-sm max-w-none flex-1 min-w-0" />
                    <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{d.regDt ? d.regDt.slice(0, 10) : ""}</span>
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
                    <RichContent html={q.boardSj ?? q.postSj ?? "-"} className="text-sm font-medium text-slate-800 prose prose-sm max-w-none flex-1 min-w-0" />
                    <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{q.answDt ? q.answDt.slice(0, 10) : ""}</span>
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
        <>
          <div className="hidden md:block overflow-x-auto">
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
          <ul className="md:hidden divide-y divide-slate-100">
            {items.map((n) => (
              <li key={n.boardSn ?? n.postSn}
                onClick={() => navigate(`/classroom/${classId}/notices/${n.boardSn ?? n.postSn}`)}
                className="px-5 py-4 flex flex-col gap-1.5 active:bg-slate-50 transition-colors cursor-pointer">
                <RichContent html={n.boardSj ?? n.postSj ?? ""} className="font-semibold text-slate-800 text-sm prose prose-sm max-w-none line-clamp-2" />
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span className="whitespace-nowrap">{n.memberDto?.userName ?? n.wrtrUserId ?? "-"}</span>
                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap">조회 {n.inqCnt ?? "-"}</span>
                    <span className="font-mono whitespace-nowrap">{n.regDt ? n.regDt.slice(0, 10) : "-"}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <ListFooter totalCount={totalCount} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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

type LectureResult =
  | { courseSn: number; status: "error" }
  | { courseSn: number; status: "success"; lectures: LectureSummary[] };

export function LectureTab({ courseSn }: { courseSn: number | null }) {
  const [result, setResult] = useState<LectureResult | null>(null);

  useEffect(() => {
    if (!courseSn) return;
    api.get(`/api/course/${courseSn}`)
      .then((r) => setResult({ courseSn, status: "success", lectures: r.data.lectures }))
      .catch(() => setResult({ courseSn, status: "error" }));
  }, [courseSn]);

  const status: "idle" | "loading" | "error" | "success" =
    !courseSn ? "idle" : result?.courseSn !== courseSn ? "loading" : result.status;
  const lectures = result?.status === "success" ? result.lectures : [];
  const state = { status };

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
        <>
          <div className="hidden md:block overflow-x-auto">
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
                        <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-400 text-sm shrink-0">
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
          <ul className="md:hidden divide-y divide-slate-100">
            {lectures.map((l, idx) => {
              const pct = l.secondsWatched != null && l.lectureDuration
                ? Math.min(100, Math.round((l.secondsWatched / l.lectureDuration) * 100))
                : null;
              return (
                <li key={l.lectureSn} className="px-5 py-4 flex flex-col gap-2.5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-400 text-sm shrink-0">
                      <i className="fa-solid fa-play" />
                    </span>
                    <span className="font-semibold text-slate-800 text-sm min-w-0 line-clamp-2">{idx + 1}. {l.lectureName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span className="font-mono whitespace-nowrap">
                      {l.lectureDuration
                        ? `${Math.floor(l.lectureDuration / 60)}:${String(l.lectureDuration % 60).padStart(2, "0")}`
                        : "-"}
                    </span>
                    {pct != null ? (
                      <div className="flex items-center gap-2 flex-1 max-w-32">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct === 100 ? "bg-emerald-400" : "bg-blue-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`font-semibold shrink-0 ${pct === 100 ? "text-emerald-500" : "text-blue-500"}`}>{pct}%</span>
                      </div>
                    ) : <span className="text-slate-300">진도 없음</span>}
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => window.open(`/viewer?courseId=${courseSn}&lectureId=${l.lectureSn}`, "_blank")}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    강의 보기
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </>
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

function SubmitBadge({ submitted, compact }: { submitted: boolean; compact?: boolean }) {
  const pad = compact ? "px-2 py-0.5" : "px-2.5 py-1";
  return submitted
    ? <span className={`text-xs font-semibold ${pad} rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600`}>제출완료</span>
    : <span className={`text-xs font-semibold ${pad} rounded-lg border border-rose-100 bg-rose-50 text-rose-500`}>미제출</span>;
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
        <>
          <div className="hidden md:block overflow-x-auto">
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
                      <SubmitBadge submitted={a.submitted} />
                    </td>
                    <td className="py-4 px-7 text-center text-sm font-semibold whitespace-nowrap">
                      {a.score != null
                        ? <span className="text-slate-700">{a.score}점</span>
                        : a.submitted
                          ? <span className="text-slate-400 font-normal">채점중</span>
                          : <span className="text-slate-300 font-normal">-</span>
                      }
                    </td>
                    <td className={`py-4 px-7 text-sm font-mono whitespace-nowrap ${isPast(a.dueDt) ? "text-slate-300" : "text-slate-400"}`}>
                      {a.dueDt ? a.dueDt.slice(0, 16).replace("T", " ") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="md:hidden divide-y divide-slate-100">
            {items.map((a) => (
              <li key={a.asgmtSn}
                onClick={() => navigate(`/classroom/${classId}/assignments/${a.asgmtSn}`)}
                className="px-5 py-4 flex flex-col gap-1.5 active:bg-slate-50 transition-colors cursor-pointer">
                <RichContent html={a.asgmtNm} className="font-semibold text-slate-800 text-sm prose prose-sm max-w-none line-clamp-2" />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className={`font-mono ${isPast(a.dueDt) ? "text-slate-300" : "text-slate-400"}`}>
                    {a.dueDt ? a.dueDt.slice(0, 16).replace("T", " ") + " 마감" : "마감일 없음"}
                  </span>
                  <div className="flex items-center gap-2">
                    {a.score != null
                      ? <span className="font-semibold text-slate-700">{a.score}점</span>
                      : a.submitted && <span className="text-slate-400">채점중</span>
                    }
                    <SubmitBadge submitted={a.submitted} compact />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <ListFooter totalCount={totalCount} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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

function AnswerBadge({ answered, compact }: { answered: boolean; compact?: boolean }) {
  const pad = compact ? "px-2 py-0.5" : "px-2.5 py-1";
  return answered
    ? <span className={`inline-flex items-center ${pad} rounded-lg text-xs font-semibold text-emerald-500 border border-emerald-100`}>답변완료</span>
    : <span className={`inline-flex items-center ${pad} rounded-lg text-xs font-semibold text-amber-500 bg-amber-50 border border-amber-200`}>미답변</span>;
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
        <div className="px-7 py-5 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-800">Q&A</h2>
            <p className="text-sm text-slate-400 mt-1">강사에게 질문을 남겨보세요.</p>
          </div>
          <button onClick={() => navigate(`/classroom/${classId}/qna/write`)} className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0 whitespace-nowrap">
            질문 작성
          </button>
        </div>
        {items.length === 0 ? (
          <EmptyState icon="comments" message="등록된 질문이 없습니다." />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
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
                        <AnswerBadge answered={q.answYn === "Y"} />
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
            <ul className="md:hidden divide-y divide-slate-100">
              {items.map((q) => (
                <li key={q.boardSn ?? q.postSn}
                  onClick={() => navigate(`/classroom/${classId}/qna/${q.boardSn ?? q.postSn}`)}
                  className="px-5 py-4 flex flex-col gap-1.5 active:bg-slate-50 transition-colors cursor-pointer">
                  <RichContent html={q.boardSj ?? q.postSj ?? ""} className="font-semibold text-slate-800 text-sm prose prose-sm max-w-none line-clamp-2" />
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-400">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="whitespace-nowrap">{q.memberDto?.userName ?? q.wrtrUserId ?? "-"}</span>
                      <span className="whitespace-nowrap">조회 {q.inqCnt ?? "-"}</span>
                      <span className="font-mono whitespace-nowrap">{q.regDt ? q.regDt.slice(0, 10) : "-"}</span>
                    </div>
                    <span className="shrink-0"><AnswerBadge answered={q.answYn === "Y"} compact /></span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        <ListFooter totalCount={totalCount} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
        <>
          <div className="hidden md:block overflow-x-auto">
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
          <ul className="md:hidden divide-y divide-slate-100">
            {items.map((d) => (
              <li key={d.boardSn ?? d.postSn}
                onClick={() => navigate(`/classroom/${classId}/dataroom/${d.boardSn ?? d.postSn}`)}
                className="px-5 py-4 flex flex-col gap-1.5 active:bg-slate-50 transition-colors cursor-pointer">
                <RichContent html={d.boardSj ?? d.postSj ?? ""} className="font-semibold text-slate-800 text-sm prose prose-sm max-w-none line-clamp-2" />
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span className="whitespace-nowrap">{d.memberDto?.userName ?? d.wrtrUserId ?? "-"}</span>
                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap">조회 {d.inqCnt ?? "-"}</span>
                    <span className="font-mono whitespace-nowrap">{d.regDt ? d.regDt.slice(0, 10) : "-"}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <ListFooter totalCount={totalCount} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

// ── 출석 현황 탭 ─────────────────────────────────────────────────

interface AttendanceIssueRecord {
  day: number;
  status: "ABSENT" | "LATE" | "EARLY_LEAVE";
  note: string | null;
}

interface AttendanceIssueResponse {
  year: number;
  month: number;
  lateCount: number;
  absentCount: number;
  earlyLeaveCount: number;
  records: AttendanceIssueRecord[];
}

interface AttendanceSummary {
  lateCount: number;
  absentCount: number;
  earlyLeaveCount: number;
}

const ATTENDANCE_STATUS: Record<string, { label: string; cls: string }> = {
  LATE: { label: "지각", cls: "text-amber-600 bg-amber-50 border-amber-200" },
  ABSENT: { label: "결석", cls: "text-red-500 bg-red-50 border-red-100" },
  EARLY_LEAVE: { label: "조퇴", cls: "text-orange-500 bg-orange-50 border-orange-100" },
};

export function AttendanceTab({ classSn }: { classSn: number | null }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [attendance, setAttendance] = useState<AttendanceIssueResponse | null>(null);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);

  const maxYear = now.getFullYear();
  const maxMonth = now.getMonth() + 1;
  const isAtMax = viewYear === maxYear && viewMonth === maxMonth;

  useEffect(() => {
    if (!classSn) return;
    let cancelled = false;
    api.get(`/api/classroom/${classSn}/my-attendance`, { params: { year: viewYear, month: viewMonth } })
      .then((r) => { if (!cancelled) setAttendance(r.data); })
      .catch(() => { if (!cancelled) setAttendance(null); });
    return () => { cancelled = true; };
  }, [classSn, viewYear, viewMonth]);

  useEffect(() => {
    if (!classSn) return;
    let cancelled = false;
    api.get(`/api/classroom/${classSn}/my-attendance/summary`)
      .then((r) => { if (!cancelled) setSummary(r.data); })
      .catch(() => { if (!cancelled) setSummary(null); });
    return () => { cancelled = true; };
  }, [classSn]);

  const handlePrevMonth = () => {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (isAtMax) return;
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  };

  const monthSummary = [
    { label: "지각", count: attendance?.lateCount ?? "-", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
    { label: "조퇴", count: attendance?.earlyLeaveCount ?? "-", color: "text-orange-500", bg: "bg-orange-50 border-orange-100" },
    { label: "결석", count: attendance?.absentCount ?? "-", color: "text-red-500", bg: "bg-red-50 border-red-100" },
  ];

  const records = attendance?.records ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-7 py-5 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-800">클래스 기간 근태 특이사항</h3>
          <p className="text-sm text-slate-400 mt-1">수강 시작일부터 현재까지 누적입니다.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 p-6">
          {[
            { label: "지각", count: summary?.lateCount ?? null, color: "text-amber-600" },
            { label: "조퇴", count: summary?.earlyLeaveCount ?? null, color: "text-orange-500" },
            { label: "결석", count: summary?.absentCount ?? null, color: "text-red-500" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <span className={`text-2xl font-black ${item.color}`}>{item.count ?? "-"}</span>
              <span className="text-xs font-bold text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={handlePrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
          <ChevronLeft size={16} />
        </button>
        <span className="text-base font-bold text-slate-700">{viewYear}년 {viewMonth}월</span>
        <button onClick={handleNextMonth} disabled={isAtMax}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {monthSummary.map(({ label, count, color, bg }) => (
          <div key={label} className={`border rounded-xl p-5 text-center ${bg}`}>
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <span className="text-sm font-bold text-slate-700 block mb-4">
          {viewYear}년 {viewMonth}월 근태 특이사항
        </span>
        {records.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">이번 달 특이사항이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {records.map((r) => {
              const info = ATTENDANCE_STATUS[r.status];
              return (
                <li key={r.day} className="py-3 flex items-start gap-3">
                  <span className="text-sm font-semibold text-slate-500 w-14 shrink-0">{r.day}일</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${info.cls}`}>
                    {info.label}
                  </span>
                  <span className="text-sm text-slate-600">{r.note ?? "-"}</span>
                </li>
              );
            })}
          </ul>
        )}
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

function ExamAttemptCell({ e, onAttempt, compact }: { e: ExamItem; onAttempt: () => void; compact?: boolean }) {
  const pad = compact ? "px-2 py-0.5" : "px-2.5 py-1";
  if (e.attempted) return <span className={`text-xs font-semibold ${pad} rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600`}>응시완료</span>;
  if (e.status === "ONGOING") return <button onClick={onAttempt} className="text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">응시하기</button>;
  if (e.status === "CLOSED") return <span className={`text-xs font-semibold ${pad} rounded-lg border border-rose-100 bg-rose-50 text-rose-400`}>미응시</span>;
  return <span className="text-sm text-slate-300">-</span>;
}

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
        <>
          <div className="hidden lg:block overflow-x-auto">
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
                        <ExamAttemptCell e={e} onAttempt={() => navigate(`/classroom/${classId}/exams/${e.examSn}`)} />
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
          <ul className="lg:hidden divide-y divide-slate-100">
            {items.map((e) => {
              const st = EXAM_STATUS[e.status] ?? EXAM_STATUS.CLOSED;
              return (
                <li key={e.examSn} className="px-5 py-4 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <RichContent html={e.examNm} className="font-semibold text-slate-800 text-sm prose prose-sm max-w-none flex-1 min-w-0 line-clamp-2" />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border shrink-0 ${st.cls}`}>{st.label}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {e.examStrtDt && e.examEndDt
                      ? `${e.examStrtDt.slice(0, 16).replace("T", " ")} ~ ${e.examEndDt.slice(0, 16).replace("T", " ")}`
                      : "기간 미정"}
                  </span>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-xs font-semibold text-slate-700">
                      {e.score != null ? `${e.score}점` : "-"}
                    </span>
                    <ExamAttemptCell e={e} onAttempt={() => navigate(`/classroom/${classId}/exams/${e.examSn}`)} compact />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <div className="px-7 py-4 border-t border-slate-200">
        <p className="text-sm text-slate-400">전체 <span className="font-semibold text-slate-600">{items.length}</span>건</p>
      </div>
    </div>
  );
}

