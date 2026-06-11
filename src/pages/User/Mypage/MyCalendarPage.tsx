import { useState, useRef, useEffect } from "react";
import api from "../../../api/api";
import MyPageSidebar from "./components/MyPageSidebar";
import CalendarEventModal from "./components/CalendarEventModal";
import type {
  CalendarEvent,
  CalendarEventResponse,
  CalendarScheduleResponse,
} from "../../../types/MyPageInterface";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const API_BASE = "http://localhost:8081";

const TYPE_COLOR: Record<string, { dot: string; text: string; badge: string }> =
  {
    holiday: {
      dot: "bg-red-400",
      text: "text-red-500",
      badge: "bg-red-50 text-red-600 border-red-100",
    },
    event: {
      dot: "bg-orange-400",
      text: "text-orange-500",
      badge: "bg-orange-50 text-orange-600 border-orange-100",
    },
    academic: {
      dot: "bg-blue-400",
      text: "text-blue-500",
      badge: "bg-blue-50 text-blue-600 border-blue-100",
    },
    personal: {
      dot: "bg-teal-500",
      text: "text-teal-600",
      badge: "bg-teal-50 text-teal-700 border-teal-200",
    },
  };

// ─── 백엔드 응답 → CalendarEvent 변환 ─────────────────
function mapEventDto(dto: CalendarEventResponse): CalendarEvent {
  return {
    id: String(dto.eventSn),
    date: dto.startDt,
    startDate: dto.startDt,
    endDate: dto.endDt,
    type: dto.eventType,
    title: dto.eventTitle,
    content: dto.eventCont,
    source: "admin",
  };
}

function mapScheduleDto(dto: CalendarScheduleResponse): CalendarEvent {
  return {
    id: "S" + String(dto.scheduleSn),
    date: dto.startDt,
    startDate: dto.startDt,
    endDate: dto.endDt,
    type: dto.scheduleType,
    title: dto.scheduleTitle,
    content: dto.scheduleCont,
    source: "user",
  };
}

// ─── 유틸 ───────────────────────────────────────────────
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getEventsForDate(events: CalendarEvent[], dateStr: string) {
  const order: Record<string, number> = {
    holiday: 0,
    event: 1,
    academic: 2,
    personal: 3,
  };
  return events
    .filter((ev) => {
      const sel = new Date(dateStr);
      return sel >= new Date(ev.startDate) && sel <= new Date(ev.endDate);
    })
    .sort((a, b) => (order[a.type] ?? 9) - (order[b.type] ?? 9));
}

function formatDisplayDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()} ${DAYS[d.getDay()]}`;
}

// ─── 년/월 피커 ─────────────────────────────────────────
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

  return (
    <div
      ref={ref}
      className="absolute top-10 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64"
    >
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
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 12 }, (_, i) => i).map((m) => (
          <button
            key={m}
            onClick={() => {
              onSelect(pickerYear, m);
              onClose();
            }}
            className={`py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
              ${pickerYear === year && m === month ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"}`}
          >
            {m + 1}월
          </button>
        ))}
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
  const todayStr = toDateStr(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
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
    cells.push({
      day: d,
      dateStr: toDateStr(year, month, d),
      otherMonth: false,
    });
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
          const dayEvents = isOther
            ? []
            : getEventsForDate(events, cell.dateStr);

          return (
            <div
              key={cell.dateStr + (isOther ? "-o" : "")}
              onClick={() => !isOther && onDateClick(cell.dateStr)}
              className={`border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-0.5 transition-colors
                ${isOther ? "bg-gray-50/50 cursor-default" : isSun ? "bg-red-50/70 cursor-pointer hover:bg-red-50" : "cursor-pointer hover:bg-gray-50"}
                ${isSelected && !isOther ? "ring-1 ring-inset ring-gray-800" : ""}
              `}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs font-medium ${isOther ? "text-gray-300" : isSun ? "text-red-500" : isSat ? "text-blue-500" : "text-gray-700"}`}
                >
                  {cell.day}
                </span>
                {isToday && !isOther && (
                  <span className="text-[10px] font-bold text-gray-900">
                    Today
                  </span>
                )}
              </div>

              {dayEvents.slice(0, 3).map((ev) => {
                const c = TYPE_COLOR[ev.type];
                return (
                  <div
                    key={ev.id}
                    className={`text-[10px] font-medium truncate flex items-center gap-1 ${c.text}`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full flex-shrink-0 ${c.dot}`}
                    />
                    {ev.title.length > 8
                      ? ev.title.slice(0, 8) + "..."
                      : ev.title}
                  </div>
                );
              })}
              {dayEvents.length > 3 && (
                <span className="text-[10px] text-gray-400">
                  +{dayEvents.length - 3}개
                </span>
              )}
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
  onDelete,
}: {
  selectedDate: string | null;
  events: CalendarEvent[];
  onAddClick: () => void;
  onDelete: (id: string) => void;
}) {
  if (!selectedDate) return null;
  const dayEvents = getEventsForDate(events, selectedDate);

  const handleDeleteSchedule = async (id: string) => {
    if (!window.confirm("일정을 삭제하시겠습니까?")) return;
    try {
      const scheduleSn = id.replace("S", "");
      await api.delete(`/api/calendar/schedule/${scheduleSn}`);
      onDelete(id);
    } catch (err) {
      console.error("일정 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mt-5 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-bold text-gray-800">
          {formatDisplayDate(selectedDate)}
        </span>
        <button
          onClick={onAddClick}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
        >
          일정추가 +
        </button>
      </div>

      {dayEvents.length === 0 ? (
        <p className="text-sm text-gray-400 py-3 text-center">
          등록된 일정이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {dayEvents.map((ev) => {
            const c = TYPE_COLOR[ev.type];
            const dateLabel =
              ev.startDate === ev.endDate
                ? ev.startDate.slice(5).replace("-", ".")
                : `${ev.startDate.slice(5).replace("-", ".")}~${ev.endDate.slice(5).replace("-", ".")}`;
            return (
              <div
                key={ev.id}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium ${c.badge}`}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`}
                />
                <span className="flex-1 truncate">{ev.title}</span>
                <span className="text-[11px] text-gray-500 flex-shrink-0">
                  {dateLabel}
                </span>
                {ev.source === "user" && (
                  <button
                    onClick={() => handleDeleteSchedule(ev.id)}
                    className="text-gray-400 hover:text-red-500 font-bold text-xs transition-colors cursor-pointer flex-shrink-0"
                  >
                    ✕
                  </button>
                )}
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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── 년/월 변경 시 데이터 재조회 ──────────────────────
  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      try {
        const params = { year, month: month + 1 }; // 0-indexed → 1-indexed

        const [eventRes, scheduleRes] = await Promise.all([
          api.get<CalendarEventResponse[]>(`/api/calendar/event`, { params }),
          api.get<CalendarScheduleResponse[]>(`/api/calendar/schedule`, {
            params,
          }),
        ]);

        const adminEvents = eventRes.data.map(mapEventDto);
        const userSchedules = scheduleRes.data.map(mapScheduleDto);

        setEvents([...adminEvents, ...userSchedules]);
      } catch (err) {
        console.error("캘린더 데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [year, month]);

  const handlePrev = () => {
    setSelectedDate(null);
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };

  const handleNext = () => {
    setSelectedDate(null);
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                My 캘린더
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                학습 일정과 개인 일정을 한눈에 관리하세요.
              </p>
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
                          setSelectedDate(null);
                          setYear(y);
                          setMonth(m);
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

                  {loading && (
                    <span className="text-[11px] text-gray-400 ml-1">
                      로딩중...
                    </span>
                  )}
                </div>

                {/* 범례 */}
                <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    공휴일
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    혜택/이벤트
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    학사 일정
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
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

              <DayPanel
                selectedDate={selectedDate}
                events={events}
                onAddClick={() => setIsModalOpen(true)}
                onDelete={(id) =>
                  setEvents((prev) => prev.filter((e) => e.id !== id))
                }
              />
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
          onDelete={(id) =>
            setEvents((prev) => prev.filter((e) => e.id !== id))
          }
          defaultDate={selectedDate ?? undefined}
          events={events}
        />
      )}
    </div>
  );
}
