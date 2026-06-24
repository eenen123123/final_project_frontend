import { useState, useRef, useEffect } from "react";

interface DatePickerInputProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function DatePickerInput({ value, onChange }: DatePickerInputProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => value ? Number(value.slice(0, 4)) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? Number(value.slice(5, 7)) - 1 : new Date().getMonth());
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openCalendar = () => {
    if (value) {
      setViewYear(Number(value.slice(0, 4)));
      setViewMonth(Number(value.slice(5, 7)) - 1);
    }
    setOpen(true);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const selectDate = (day: number) => {
    const y = viewYear;
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    setOpen(false);
  };

  // 달력 날짜 생성
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // 6행 맞추기
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedDay = value?.slice(0, 7) === `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`
    ? Number(value.slice(8, 10))
    : null;

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center border border-gray-300 bg-white">
        <input
          type="text"
          readOnly
          value={value}
          className="px-2 py-1.5 w-24 text-center text-xs text-gray-700 bg-white focus:outline-none cursor-default"
        />
        <button
          type="button"
          onClick={openCalendar}
          className="px-2 py-1.5 border-l border-gray-300 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-table-cells-large text-xs" />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-300 shadow-lg w-56 select-none">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
            <button type="button" onClick={prevMonth} className="text-gray-500 hover:text-gray-800 text-sm cursor-pointer px-1">◀</button>
            <span className="text-xs font-bold text-gray-800">{viewYear}년 {viewMonth + 1}월</span>
            <button type="button" onClick={nextMonth} className="text-gray-500 hover:text-gray-800 text-sm cursor-pointer px-1">▶</button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {DAYS.map((d, i) => (
              <div key={d} className={`py-1.5 text-center text-[10px] font-bold ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"}`}>
                {d}
              </div>
            ))}
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-7 p-1">
            {cells.map((day, i) => {
              const colIdx = i % 7;
              const isSelected = day !== null && day === selectedDay;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={day === null}
                  onClick={() => day !== null && selectDate(day)}
                  className={`py-1.5 text-[11px] text-center transition-colors cursor-pointer rounded
                    ${day === null ? "invisible" : ""}
                    ${isSelected ? "bg-[#2E313D] text-white font-bold" : "hover:bg-gray-100"}
                    ${!isSelected && colIdx === 0 ? "text-red-400" : ""}
                    ${!isSelected && colIdx === 6 ? "text-blue-400" : ""}
                    ${!isSelected && colIdx !== 0 && colIdx !== 6 ? "text-gray-700" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
