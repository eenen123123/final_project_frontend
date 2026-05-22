import { useState } from 'react';
import type { CalendarEvent } from '../../../types/MyPageInterface';


interface StudyCalendarProps {
  events: CalendarEvent[];
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const TYPE_COLOR: Record<string, string> = {
  event:    'bg-orange-400',
  academic: 'bg-blue-400',
  personal: 'bg-yellow-400',
};

const TYPE_LABEL: Record<string, string> = {
  event:    '혜택/이벤트',
  academic: '학사 일정',
  personal: '나의 일정',
};

const TYPE_BADGE: Record<string, string> = {
  event:    'bg-orange-400 text-white',
  academic: 'bg-blue-500 text-white',
  personal: 'bg-yellow-400 text-gray-800',
};

export default function StudyCalendar({ events }: StudyCalendarProps) {
  const today = new Date(2026, 4, 22); // 2026-05-22 기준
  const [current, setCurrent] = useState({ year: 2026, month: 5 });
  const [selectedDate, setSelectedDate] = useState('2026-05-22');

  const firstDay = new Date(current.year, current.month - 1, 1).getDay();
  const daysInMonth = new Date(current.year, current.month, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getEventsForDate = (dateStr: string) =>
    events.filter((e) => e.date === dateStr);

  const hasDot = (day: number) => {
    const d = `${current.year}-${String(current.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some((e) => e.date === d);
  };

  const selectedEvents = getEventsForDate(selectedDate);

  const groupedEvents = (Object.keys(TYPE_LABEL) as Array<keyof typeof TYPE_LABEL>).map((type) => ({
    type,
    items: selectedEvents.filter((e) => e.type === type),
  }));

  const formatSelectedDate = () => {
    const d = new Date(selectedDate);
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()} ${days[d.getDay()]}`;
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">My 캘린더</h3>
        <a href="#" className="text-xs text-blue-500 hover:underline">전체일정 ›</a>
      </div>

      <div className="flex gap-6">
        {/* 달력 */}
        <div className="flex-1">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setCurrent((p) => p.month === 1 ? { year: p.year - 1, month: 12 } : { ...p, month: p.month - 1 })}
              className="text-gray-400 hover:text-gray-700 px-1"
            >
              ‹
            </button>
            <span className="text-base font-bold text-gray-900">
              {current.year}.{current.month}
            </span>
            <button
              onClick={() => setCurrent((p) => p.month === 12 ? { year: p.year + 1, month: 1 } : { ...p, month: p.month + 1 })}
              className="text-gray-400 hover:text-gray-700 px-1"
            >
              ›
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d, i) => (
              <div
                key={d}
                className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const dateStr = `${current.year}-${String(current.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              const isSelected = dateStr === selectedDate;
              const col = idx % 7;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col items-center py-1.5 rounded-lg transition-colors ${isSelected ? 'ring-1 ring-gray-300' : 'hover:bg-gray-50'}`}
                >
                  <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium ${
                    isToday ? 'bg-gray-900 text-white' :
                    col === 0 ? 'text-red-400' :
                    col === 6 ? 'text-blue-400' :
                    'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  {hasDot(day) && (
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 선택된 날짜 이벤트 */}
        <div className="w-72 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-900">{formatSelectedDate()}</span>
            <button className="text-xs text-gray-400 hover:text-blue-500">일정 추가 +</button>
          </div>

          <div className="space-y-4">
            {groupedEvents.map(({ type, items }) => (
              <div key={type}>
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 ${TYPE_BADGE[type]}`}>
                  {TYPE_LABEL[type]}
                </span>
                {items.length > 0 ? (
                  <div className="space-y-1.5 pl-1">
                    {items.map((e) => (
                      <div key={e.title} className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${TYPE_COLOR[type]}`} />
                        <p className="text-xs text-gray-600">{e.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 pl-1">일정 없음. 다른 날을 확인해 보세요.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
