import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../api/api";

// 💡 순환 참조를 막기 위해 타입을 독립적으로 정의 (구조가 같으면 알아서 호환됩니다)
type TabType = "home" | "notice" | "lecture" | "assign" | "qna" | "score";

interface HomeTabProps {
  onTabChange: (tab: TabType) => void;
}

// 1. 홈 탭 (원형 차트 + 얕은 하늘색 헤더 + overflow-hidden 반영)
export function HomeTab({ onTabChange }: HomeTabProps) {
  const weeklyStudyData = [
    { day: "월", time: 120, label: "2시간" },
    { day: "화", time: 90, label: "1.5시간" },
    { day: "수", time: 180, label: "3시간" },
    { day: "목", time: 60, label: "1시간" },
    { day: "금", time: 150, label: "2.5시간" },
    { day: "토", time: 40, label: "40분" },
    { day: "일", time: 0, label: "0분" },
  ];

  const maxTime = 180;

  return (
    <div className="flex flex-col gap-4">
      {/* 상단 알림 배너 */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-blue-100/70 transition-colors">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white text-base flex-shrink-0">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-blue-500 font-bold">
            오늘의 문제 · 영어
          </p>
          <p className="text-sm font-bold text-blue-900 mt-0.5 truncate">
            관계대명사 who와 which의 차이를 설명하시오
          </p>
        </div>
        <button className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 flex-shrink-0 transition-colors">
          풀기 →
        </button>
      </div>

      {/* 시각화 대시보드 영역 (2단 레이아웃) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 주간 학습 시간 세로 막대 그래프 */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="bg-sky-50/60 px-5 py-3.5 border-b border-slate-200/40">
            <h3 className="text-xs font-black text-slate-800 tracking-tight">
              이번 주 학습 시간
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              지난주 대비{" "}
              <span className="text-blue-600 font-bold">30분 더</span>{" "}
              공부했어요
            </p>
          </div>

          <div className="p-5 pt-7 flex items-end justify-between px-7 h-32">
            {weeklyStudyData.map((data, index) => {
              const heightPercent =
                data.time > 0 ? (data.time / maxTime) * 100 : 4;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 flex-1 group"
                >
                  <div className="absolute mb-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-y-2">
                    {data.label}
                  </div>
                  <div className="w-7 bg-slate-100 rounded-t-md w-full max-w-[28px] h-full flex items-end overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: index * 0.05,
                      }}
                      className={`w-full rounded-t-md transition-colors ${
                        data.time === maxTime
                          ? "bg-gradient-to-t from-blue-600 to-indigo-500"
                          : data.time === 0
                            ? "bg-slate-200"
                            : "bg-blue-500 group-hover:bg-blue-600"
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 원형(도넛) 진척도 카드 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="bg-sky-50/60 px-5 py-3.5 border-b border-slate-200/40">
            <h3 className="text-xs font-black text-slate-800 tracking-tight">
              학습 달성률
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">5월 목표치 기준</p>
          </div>

          <div className="grid grid-cols-3 gap-1 p-5 my-auto py-5">
            {[
              { label: "과제 제출", value: 85, color: "#2563EB" },
              { label: "인강 진도", value: 60, color: "#6366F1" },
              { label: "수업 출석", value: 92, color: "#10B981" },
            ].map((item, idx) => {
              const radius = 20;
              const circumference = 2 * Math.PI * radius;
              return (
                <div key={idx} className="flex flex-col items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-14 h-14">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        stroke="#F1F5F9"
                        strokeWidth="4.5"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="28"
                        cy="28"
                        r={radius}
                        stroke={item.color}
                        strokeWidth="4.5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{
                          strokeDashoffset:
                            circumference * (1 - item.value / 100),
                        }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: idx * 0.1,
                        }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-black text-slate-800 tracking-tighter">
                      {item.value}%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 text-center whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 공지사항 미니뷰 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-slate-800 tracking-tight">
            최근 공지사항
          </h3>
          <button
            onClick={() => onTabChange("notice")}
            className="text-[11px] font-bold text-blue-600 hover:underline"
          >
            전체보기
          </button>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold">
              필독
            </span>
            <h4 className="text-xs font-bold text-slate-700 truncate flex-1">
              5월 중간고사 일정 및 고사장 안내
            </h4>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
            2026.05.15 · 김민준 선생님
          </p>
        </div>
      </div>
    </div>
  );
}

export function NoticeTab() {
  return <div className="p-4 bg-white rounded-xl border">공지사항 내용</div>;
}
interface LectureSummary {
  lectureSn: number;
  lectureName: string;
  lectureDuration: number | null;
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; lectures: LectureSummary[] };

export function LectureTab({ courseSn }: { courseSn: number | null }) {
  const [state, setState] = useState<FetchState>({ status: "idle" });

  useEffect(() => {
    if (!courseSn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "idle" });
      return;
    }
    setState({ status: "loading" });
    api
      .get(`/api/course/${courseSn}`)
      .then((res) => {
        setState({ status: "success", lectures: res.data.lectures });
      })
      .catch(() => {
        setState({ status: "error" });
      });
  }, [courseSn]);

  if (state.status === "loading") {
    return (
      <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-400 text-center">
        불러오는 중...
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-red-400 text-center">
        강의 목록을 불러오지 못했습니다.
      </div>
    );
  }
  const lectures = state.status === "success" ? state.lectures : [];
  if (!courseSn || lectures.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-400 text-center">
        강의 목록이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <ul className="divide-y divide-slate-100">
        {lectures.map((l) => (
          <li
            key={l.lectureSn}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {l.lectureName}
              </p>
              {l.lectureDuration && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {Math.floor(l.lectureDuration / 60)}:
                  {String(l.lectureDuration % 60).padStart(2, "0")}
                </p>
              )}
            </div>
            <button
              onClick={() =>
                window.open(
                  `/viewer?courseId=${courseSn}&lectureId=${l.lectureSn}`,
                  "_blank",
                )
              }
              className="
              cursor-pointer
              ml-3 flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              강의 보기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function AssignTab() {
  return <div className="p-4 bg-white rounded-xl border">과제 제출 내용</div>;
}
export function QnaTab() {
  return <div className="p-4 bg-white rounded-xl border">1:1 Q&A 내용</div>;
}
export function ScoreTab() {
  return <div className="p-4 bg-white rounded-xl border">성적 관리 내용</div>;
}
