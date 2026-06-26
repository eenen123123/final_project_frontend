import { useState, useEffect } from "react";
import api from "../../../../api/api";
import type {
  CalendarEvent,
  CalendarEventResponse,
  CalendarScheduleResponse,
} from "../../../../types/MyPageInterface";
import CalendarEventModal from "./CalendarEventModal";
import { Link } from "react-router-dom";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const API_BASE = "http://localhost:8081";

const TYPE_DOT: Record<string, string> = {
  holiday: "bg-red-400",
  event: "bg-orange-400",
  academic: "bg-blue-400",
  personal: "bg-teal-500",
};

const DOT_TYPE_ORDER = ["holiday", "event", "academic", "personal"] as const;

const PANEL_SECTIONS = [
  {
    key: "event",
    label: "혜택/이벤트",
    badge: "bg-red-100 text-red-600",
    types: ["holiday", "event"],
  },
  {
    key: "academic",
    label: "학사 일정",
    badge: "bg-blue-100 text-blue-600",
    types: ["academic"],
  },
  {
    key: "personal",
    label: "나의 일정",
    badge: "bg-amber-100 text-amber-600",
    types: ["personal"],
  },
] as const;

const ITEM_DATE_COLOR: Record<string, string> = {
  holiday: "text-red-500",
  event: "text-gray-400",
  academic: "text-gray-400",
  personal: "text-gray-400",
};

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

function isInRange(dateStr: string, startDate: string, endDate: string) {
  const sel = new Date(dateStr);
  return sel >= new Date(startDate) && sel <= new Date(endDate);
}

export default function StudyCalendar() {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { year: current.year, month: current.month + 1 };
        const [eventRes, scheduleRes] = await Promise.all([
          api.get<CalendarEventResponse[]>(`/api/calendar/event`, { params }),
          api.get<CalendarScheduleResponse[]>(`/api/calendar/schedule`, {
            params,
          }),
        ]);
        setEvents([
          ...eventRes.data.map(mapEventDto),
          ...scheduleRes.data.map(mapScheduleDto),
        ]);
      } catch (err) {
        console.error("미니 캘린더 데이터 로딩 실패:", err);
      }
    };
    fetchData();
  }, [current.year, current.month]);

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const hasHoliday = (day: number) => {
    const d = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.some(
      (ev) => ev.type === "holiday" && isInRange(d, ev.startDate, ev.endDate),
    );
  };

  const getDotsForDay = (day: number): string[] => {
    const d = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const found = new Set<string>();
    events.forEach((ev) => {
      if (isInRange(d, ev.startDate, ev.endDate)) found.add(ev.type);
    });
    return DOT_TYPE_ORDER.filter((t) => found.has(t)).slice(0, 3);
  };

  const selectedEvents = events.filter((ev) =>
    isInRange(selectedDate, ev.startDate, ev.endDate),
  );
  const selDateObj = new Date(selectedDate);
  const selMonthDay = `${selDateObj.getMonth() + 1}.${selDateObj.getDate()}`;

  const formatSelectedDate = () => {
    const d = new Date(selectedDate);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()} ${DAYS[d.getDay()]}`;
  };

  const goPrev = () =>
    setCurrent((p) =>
      p.month === 0
        ? { year: p.year - 1, month: 11 }
        : { ...p, month: p.month - 1 },
    );
  const goNext = () =>
    setCurrent((p) =>
      p.month === 11
        ? { year: p.year + 1, month: 0 }
        : { ...p, month: p.month + 1 },
    );

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">My 캘린더</h3>

      <div className="flex flex-col lg:flex-row gap-0">
        {/* 달력 */}
        <div className="flex-1 lg:pr-6">
          <div className="relative flex items-center justify-center gap-4 mb-4">
            <button
              onClick={goPrev}
              className="text-gray-400 hover:text-gray-700 px-1 cursor-pointer"
            >
              ‹
            </button>
            <span className="text-base font-bold text-gray-900">
              {current.year}.{current.month + 1}
            </span>
            <button
              onClick={goNext}
              className="text-gray-400 hover:text-gray-700 px-1 cursor-pointer"
            >
              ›
            </button>
            <Link
              to="/mycalendar"
              className="absolute right-0 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              전체일정 ›
            </Link>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d, i) => (
              <div
                key={d}
                className={`text-center text-xs font-medium py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"}`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const dateStr = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const col = idx % 7;
              const dots = getDotsForDay(day);
              const holiday = hasHoliday(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col items-center py-1.5 rounded-lg transition-colors cursor-pointer ${isSelected ? "ring-1 ring-gray-300" : "hover:bg-gray-50"}`}
                >
                  <span
                    className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium ${
                      isToday
                        ? "bg-gray-900 text-white"
                        : holiday || col === 0
                          ? "text-red-400"
                          : col === 6
                            ? "text-blue-400"
                            : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                  {dots.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dots.map((type) => (
                        <span
                          key={type}
                          className={`w-1 h-1 rounded-full ${TYPE_DOT[type]}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 my-4 lg:my-0" />

        {/* 오른쪽 패널 */}
        <div className="w-full lg:w-[420px] pt-2 lg:pt-0 lg:pl-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-900">
              {formatSelectedDate()}
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
            >
              일정 추가 +
            </button>
          </div>

          <div className="space-y-4">
            {PANEL_SECTIONS.map((section) => {
              const sectionEvents = selectedEvents.filter((e) =>
                (section.types as readonly string[]).includes(e.type),
              );
              return (
                <div key={section.key}>
                  <span
                    className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-2 ${section.badge}`}
                  >
                    {section.label}
                  </span>
                  {sectionEvents.length > 0 ? (
                    <div className="space-y-1.5">
                      {sectionEvents.map((ev) => (
                        <div key={ev.id} className="flex items-start gap-3">
                          <span
                            className={`text-xs flex-shrink-0 w-7 ${ITEM_DATE_COLOR[ev.type] ?? "text-gray-400"}`}
                          >
                            {selMonthDay}
                          </span>
                          <p className="text-xs text-gray-600">{ev.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-300 flex-shrink-0 w-7">
                        {selMonthDay}
                      </span>
                      <p className="text-xs text-gray-400">
                        일정 없음. 다른 날을 확인해 보세요.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CalendarEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDate={selectedDate}
        events={events}
        onSave={(updatedEvents) => setEvents(updatedEvents)}
        onDelete={(id) =>
          setEvents((prev) => prev.filter((ev) => ev.id !== id))
        }
      />
    </div>
  );
}
