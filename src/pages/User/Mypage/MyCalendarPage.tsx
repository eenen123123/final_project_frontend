import { useState, useRef, useEffect } from "react";
import MyPageSidebar from "./components/MyPageSidebar";
import CalendarEventModal from "./components/CalendarEventModal";
import type { CalendarEvent } from "../../../types/MyPageInterface";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const TYPE_COLOR: Record<string, { dot: string; text: string; badge: string }> = {
  event: { dot: "bg-red-500", text: "text-red-500", badge: "bg-red-50 text-red-600 border-red-100" },
  academic: { dot: "bg-blue-400", text: "text-blue-500", badge: "bg-blue-50 text-blue-600 border-blue-100" },
  personal: { dot: "bg-amber-400", text: "text-amber-500", badge: "bg-amber-50 text-amber-600 border-amber-100" },
};

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    date: "2026-06-03",
    startDate: "2026-06-03",
    endDate: "2026-06-03",
    type: "event",
    title: "제9회 전국동시지방선거",
  },
  {
    id: "2",
    date: "2026-06-01",
    startDate: "2026-06-01",
    endDate: "2026-06-05",
    type: "event",
    title: "6모 100점 노리기 이벤트",
  },
  {
    id: "3",
    date: "2026-06-04",
    startDate: "2026-06-04",
    endDate: "2026-06-04",
    type: "academic",
    title: "[고3] 6월 모의고사",
  },
  {
    id: "4",
    date: "2026-06-04",
    startDate: "2026-06-04",
    endDate: "2026-06-04",
    type: "academic",
    title: "[고1/고2] 6월 모의고사",
  },
  { id: "5", date: "2026-06-06", startDate: "2026-06-06", endDate: "2026-06-06", type: "event", title: "현충일" },
  {
    id: "6",
    date: "2026-06-17",
    startDate: "2026-06-17",
    endDate: "2026-06-17",
    type: "academic",
    title: "[고3] 7월 학력평가 공지",
  },
  {
    id: "7",
    date: "2026-06-24",
    startDate: "2026-06-24",
    endDate: "2026-06-24",
    type: "academic",
    title: "[고3] 7월 학력평가",
  },
];

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getEventsForDate(events: CalendarEvent[], dateStr: string) {
  return events.filter((ev) => {
    const sel = new Date(dateStr);
    const start = new Date(ev.startDate);
    const end = new Date(ev.endDate);
    return sel >= start && sel <= end;
  });
}

function formatDisplayDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()} ${DAYS[d.getDay()]}`;
}

// ─── 년/월 선택 피커 ────────────────────────────────────
function YearMonthPicker({
  year,
  month,
  onSelect,
  onClose,
}: {
  year: number;
  month: number;
  onSelect: (y: number, m: number) => void;
  onClose: () => void;
}) {
  const [pickerYear, setPickerYear] = useState(year);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const yearOptions = Array.from({ length: 11 }, (_, i) => year - 5 + i);

  return (
    <div
      ref={ref}
      className="absolute top-10 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64"
    >
      {/* 년도 선택 */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setPickerYear((y) => y - 1)}
          className="text-gray-400 hover:text-gray-700 cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
        >
          ‹
        </button>
        <span className="text-sm font-bold text-gray-800">{pickerYear}년</span>
        <button
          onClick={() => setPickerYear((y) => y + 1)}
          className="text-gray-400 hover:text-gray-700 cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      {/* 월 선택 그리드 */}
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 12 }, (_, i) => i).map((m) => {
          const isSelected = pickerYear === year && m === month;
          return (
            <button
              key={m}
              onClick={() => {
                onSelect(pickerYear, m);
                onClose();
              }}
              className={`py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
                ${isSelected ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
            >
              {m + 1}월
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 캘린더 그리드 ──────────────────────────────────────
function CalendarGrid({
  year,
  month,
  events,
  selectedDate,
  onDateClick,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
  selectedDate: string | null;
  onDateClick: (d: string) => void;
}) {
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  type Cell = { day: number; dateStr: string; otherMonth: boolean };
  const cells: Cell[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    cells.push({ day: d, dateStr: toDateStr(py, pm, d), otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: toDateStr(year, month, d), otherMonth: false });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    cells.push({ day: d, dateStr: toDateStr(ny, nm, d), otherMonth: true });
  }

  return (
    <>
      <div className="grid grid-cols-7 text-center border-b border-gray-200 pb-2 mb-1">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`text-[11px] font-medium ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"}`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l border-gray-200">
        {cells.map((cell, idx) => {
          const isOther = cell.otherMonth;
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const isSun = idx % 7 === 0;
          const isSat = idx % 7 === 6;
          const dayEvents = isOther ? [] : getEventsForDate(events, cell.dateStr);

          return (
            <div
              key={cell.dateStr + (isOther ? "-o" : "")}
              onClick={() => !isOther && onDateClick(cell.dateStr)}
              className={`border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-0.5 transition-colors
                ${isOther ? "bg-gray-50/50 cursor-default" : isSun ? "bg-red-50/70 cursor-pointer hover:bg-red-50" : "cursor-pointer hover:bg-gray-50"}
                ${isSelected && !isOther ? "ring-1 ring-inset ring-gray-800" : ""}
              `}
            >
              {/* 날짜 숫자 + Today 텍스트 */}
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs font-medium
                  ${isOther ? "text-gray-300" : isSun ? "text-red-500" : isSat ? "text-blue-500" : "text-gray-700"}
                `}
                >
                  {cell.day}
                </span>
                {isToday && !isOther && <span className="text-[10px] font-bold text-gray-900">Today</span>}
              </div>

              {dayEvents.slice(0, 3).map((ev) => {
                const c = TYPE_COLOR[ev.type];
                return (
                  <div key={ev.id} className={`text-[10px] font-medium truncate flex items-center gap-1 ${c.text}`}>
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${c.dot}`} />
                    {ev.title.length > 8 ? ev.title.slice(0, 8) + "..." : ev.title}
                  </div>
                );
              })}
              {dayEvents.length > 3 && <span className="text-[10px] text-gray-400">+{dayEvents.length - 3}개</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── 날짜 패널 ──────────────────────────────────────────
function DayPanel({
  selectedDate,
  events,
  onAddClick,
}: {
  selectedDate: string | null;
  events: CalendarEvent[];
  onAddClick: () => void;
}) {
  if (!selectedDate) return null;

  const dayEvents = getEventsForDate(events, selectedDate);

  return (
    <div className="mt-5 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-bold text-gray-800">{formatDisplayDate(selectedDate)}</span>
        <button
          onClick={onAddClick}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
        >
          일정추가 +
        </button>
      </div>

      {dayEvents.length === 0 ? (
        <p className="text-sm text-gray-400 py-3 text-center">등록된 일정이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {dayEvents.map((ev) => {
            const c = TYPE_COLOR[ev.type];
            return (
              <div
                key={ev.id}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium ${c.badge}`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                <span className="flex-1 truncate">{ev.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── 메인 페이지 ────────────────────────────────────────
export default function MyCalendarPage() {
  const today = new Date();
  const [activeSection, setActiveSection] = useState("My 캘린더");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handlePrev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
    setSelectedDate(null);
  };

  const handleNext = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">My 캘린더</h3>
              <p className="text-sm text-gray-500 mt-1">학습 일정과 개인 일정을 한눈에 관리하세요.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-xs font-sans">
              {/* 상단 컨트롤 */}
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 font-bold transition-colors cursor-pointer rounded-lg hover:bg-gray-100"
                  >
                    〈
                  </button>

                  {/* 년/월 클릭 → 피커 */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPicker((p) => !p)}
                      className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50"
                    >
                      {year}.{String(month + 1).padStart(2, "0")}
                    </button>
                    {showPicker && (
                      <YearMonthPicker
                        year={year}
                        month={month}
                        onSelect={(y, m) => {
                          setYear(y);
                          setMonth(m);
                          setSelectedDate(null);
                        }}
                        onClose={() => setShowPicker(false)}
                      />
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 font-bold transition-colors cursor-pointer rounded-lg hover:bg-gray-100"
                  >
                    〉
                  </button>
                </div>

                {/* 범례 */}
                <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    혜택/이벤트
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    학사 일정
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    나의 일정
                  </span>
                </div>
              </div>

              <CalendarGrid
                year={year}
                month={month}
                events={events}
                selectedDate={selectedDate}
                onDateClick={setSelectedDate}
              />

              <DayPanel selectedDate={selectedDate} events={events} onAddClick={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CalendarEventModal
          key={selectedDate ?? "modal"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={setEvents}
          onDelete={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
          defaultDate={selectedDate ?? undefined}
          events={events}
        />
      )}
    </div>
  );
}
