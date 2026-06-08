import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const CLASS_DAYS = [5, 7, 9, 12, 14, 16, 19, 21, 23, 26, 28, 30];

export default function ClassroomCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  // 💡 사용자가 모달 안에서 선택한 날짜를 관리하는 상태 (기본값은 오늘인 20일)
  const [selectedDay, setSelectedDay] = useState<number | null>(20);

  const firstDay = 4;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const prevDays = Array.from({ length: firstDay }, (_, i) => 30 - firstDay + 1 + i);

  // 선택된 날짜의 상태(완료, 오늘, 예정)를 판별하는 헬퍼 함수
  const getDayStatus = (day: number) => {
    if (day < 20) return { label: "완료", color: "text-emerald-500 bg-emerald-50 border-emerald-100" };
    if (day === 20) return { label: "오늘", color: "text-blue-600 bg-blue-100 border-blue-200 animate-pulse" };
    return { label: "예정", color: "text-slate-400 bg-slate-100 border-slate-200" };
  };

  return (
    <>
      {/* ==========================================
          1. 대시보드용 미니 달력 카드 (평소 화면)
         ========================================== */}
      <div 
        className="bg-white border border-blue-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer" 
        onClick={() => {
          setSelectedDay(20); // 모달 열릴 때 기본 선택을 오늘(20일)로 초기화
          setIsOpen(true);
        }}
      >
        <div className="text-center mb-3">
          <span className="text-[13px] font-black text-slate-700 tracking-tight">2026년 5월</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["일","월","화","수","목","금","토"].map((d) => (
            <div key={d} className="text-[10px] text-slate-400 text-center font-bold pb-1">{d}</div>
          ))}
          {prevDays.map((d) => (
            <div key={`p${d}`} className="h-6 flex items-center justify-center text-[10px] text-slate-200">{d}</div>
          ))}
          {days.map((d) => {
            const isToday = d === 20;
            const isClass = CLASS_DAYS.includes(d);
            return (
              <div 
                key={d} 
                className={`h-6 flex items-center justify-center text-[10px] rounded-lg font-bold transition-all
                  ${isToday ? "bg-blue-600 text-white shadow-sm" : ""}
                  ${!isToday && isClass ? "bg-blue-50 text-blue-500 hover:bg-blue-100" : "text-slate-600 hover:bg-slate-50"}
                `}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          2. 큰 달력 보기 + 날짜별 일정 연동 모달
         ========================================== */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">2026년 5월 학사 일정 전체보기</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 text-gray-600 font-medium">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

                {/* [좌측 세션: 3칸 차지] 큼직하게 키운 메인 큰 달력 */}
                <div className="md:col-span-3 border border-slate-100 rounded-2xl p-4 bg-white shadow-inner">
                  <div className="text-center mb-4">
                    <span className="text-sm font-black text-slate-800 tracking-tight">MAY 2026</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {["일", "월", "화", "수", "목", "금", "토"].map((d, idx) => (
                      <div key={d} className={`text-[11px] text-center font-bold pb-2 ${idx === 0 ? "text-red-500" : "text-slate-400"}`}>
                        {d}
                      </div>
                    ))}
                    {prevDays.map((d) => (
                      <div key={`mp${d}`} className="h-10 flex items-center justify-center text-xs text-slate-200">{d}</div>
                    ))}
                    {days.map((d, idx) => {
                      const isToday = d === 20;
                      const isClass = CLASS_DAYS.includes(d);
                      const isSelected = selectedDay === d;
                      const isSunday = (firstDay + idx) % 7 === 0;

                      return (
                        <button
                          key={`md${d}`}
                          onClick={() => setSelectedDay(d)}
                          className={`h-10 text-xs rounded-xl font-bold flex flex-col items-center justify-center relative transition-all border
                            ${isToday ? "bg-blue-600 text-white border-blue-600" : ""}
                            ${!isToday ? "hover:bg-slate-100 border-transparent text-slate-600" : ""}
                            ${!isToday && isClass ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" : ""}
                            ${isSunday && !isToday ? "text-red-500!" : ""}
                            ${isSelected ? "ring-2 ring-blue-400 ring-offset-2 z-10" : ""}
                          `}
                        >
                          <span className={isSunday && !isToday ? "text-red-500" : ""}>{d}</span>
                          {isClass && (
                            <span className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isToday ? "bg-white" : "bg-blue-500"}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* [우측 세션: 2칸 차지] 선택한 날짜의 실시간 일정 상세판 */}
                <div className="md:col-span-2 flex flex-col gap-3 justify-between">
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">Selected Date</h4>

                    {selectedDay ? (
                      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                          <span className="text-sm font-black text-slate-800">5월 {selectedDay}일</span>
                          {CLASS_DAYS.includes(selectedDay) || selectedDay === 20 ? (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getDayStatus(selectedDay).color}`}>
                              {getDayStatus(selectedDay).label}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/30">
                              수업 없음
                            </span>
                          )}
                        </div>

                        {CLASS_DAYS.includes(selectedDay) ? (
                          <div className="flex flex-col gap-2.5 mt-1">
                            <div className="flex items-start gap-2.5">
                              <div className="text-base mt-0.5">📝</div>
                              <div>
                                <p className="text-xs font-bold text-slate-700">정규 영어 A반 수업</p>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">시간: 17:00 ~ 19:00 (2시간)</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5 bg-white border border-slate-100 p-2.5 rounded-xl mt-1 shadow-xs">
                              <div className="text-xs mt-0.5">📍</div>
                              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                                본관 302호 강의실 현장 강의 및 실시간 라이브 스트리밍 동시 송출
                              </p>
                            </div>
                          </div>
                        ) : selectedDay === 20 ? (
                          <div className="py-4 text-center">
                            <p className="text-xs font-bold text-slate-600">오늘은 수업이 없는 날입니다.</p>
                            <p className="text-[11px] text-slate-400 mt-1">밀린 인강이나 과제를 체크해보세요!</p>
                          </div>
                        ) : (
                          <div className="py-6 text-center flex flex-col items-center justify-center gap-1.5">
                            <span className="text-xl">☕</span>
                            <p className="text-xs font-bold text-slate-400">지정된 정규 수업 일정이 없습니다.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
                        <span className="text-lg mb-1">👆</span>
                        <p className="text-xs font-bold">달력에서 일정이 있는 날짜를</p>
                        <p className="text-[11px]">클릭하시면 상세 일정을 볼 수 있습니다.</p>
                      </div>
                    )}
                  </div>

                  {/* 이번 달 요약 카운터 밑배너 */}
                  <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700">5월 출석 현황 요약</span>
                    <span className="text-xs font-black text-blue-600">총 {CLASS_DAYS.length}회 중 7회 이수</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>,
        document.getElementById("modal-root") ?? document.body,
      )}
    </>
  );
}