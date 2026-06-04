import { useState } from "react";
import type { CalendarEvent } from "../../../../types/MyPageInterface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (events: CalendarEvent[]) => void;
  onDelete: (id: string) => void;
  defaultDate?: string;
  events: CalendarEvent[];
}

const AREAS = ["국어", "수학", "영어", "사탐", "과탐", "한국사"];
const TEACHERS_BY_AREA: Record<string, string[]> = {
  국어: ["박광일", "김민정", "신영균"],
  수학: ["정승제", "강윤구", "이하영"],
  영어: ["주혜연", "김범구", "오채은"],
  사탐: ["이지영", "임정환", "김현수"],
  과탐: ["이승후", "안성진", "엄영대"],
  한국사: ["김준창", "한세희"],
};
const CATEGORY_COLOR: Record<string, string> = {
  academic: "text-blue-600",
  event: "text-red-500",
  personal: "text-amber-600",
};

interface FormState {
  activeTab: "academic" | "personal";
  area: string;
  teacher: string;
  startDate: string;
  endDate: string;
  content: string;
  personalCategory: "공부" | "기념" | "행사" | "기타";
}

function getInitialForm(defaultDate?: string): FormState {
  return {
    activeTab: "academic",
    area: "",
    teacher: "",
    startDate: defaultDate ?? "",
    endDate: defaultDate ?? "",
    content: "",
    personalCategory: "공부",
  };
}

export default function CalendarEventModal({ isOpen, onClose, onSave, onDelete, defaultDate, events }: Props) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(defaultDate));

  if (!isOpen) return null;

  const set = (partial: Partial<FormState>) => setForm((prev) => ({ ...prev, ...partial }));

  const handleAdd = () => {
    if (!form.startDate || !form.endDate) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: form.startDate,
      startDate: form.startDate,
      endDate: form.endDate,
      type: form.activeTab === "academic" ? "academic" : "personal",
      title:
        form.content ||
        (form.activeTab === "academic" ? `${form.area || "학습"} 일정` : `${form.personalCategory} 일정`),
      content: form.content,
    };
    onSave([...events, newEvent]);
    set({ content: "", area: "", teacher: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-xs text-left">
        {/* 헤더 */}
        <div className="bg-gray-900 px-5 py-4 flex items-center justify-between text-white">
          <h3 className="text-sm font-bold">일정 관리</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <div className="p-5">
          {/* 탭 */}
          <div className="flex border-b border-gray-200 mb-4">
            {(["academic", "personal"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => set({ activeTab: tab })}
                className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors cursor-pointer
                  ${form.activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {tab === "academic" ? "학습 일정" : "개인 일정"}
              </button>
            ))}
          </div>

          {/* 학습 일정 */}
          {form.activeTab === "academic" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={form.area}
                  onChange={(e) => set({ area: e.target.value, teacher: "" })}
                  className="border border-gray-300 rounded-lg p-2 bg-white text-xs cursor-pointer"
                >
                  <option value="">영역 선택</option>
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <select
                  value={form.teacher}
                  onChange={(e) => set({ teacher: e.target.value })}
                  disabled={!form.area}
                  className="border border-gray-300 rounded-lg p-2 bg-white text-xs disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">선생님 선택</option>
                  {form.area &&
                    TEACHERS_BY_AREA[form.area]?.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
                <select
                  disabled={!form.teacher}
                  className="border border-gray-300 rounded-lg p-2 bg-white text-xs disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">강좌 선택</option>
                </select>
              </div>
              <select
                disabled={!form.teacher}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-xs disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">강의 선택</option>
              </select>
              <div className="flex items-center gap-2">
                <span className="w-10 text-gray-500 flex-shrink-0">일자</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set({ startDate: e.target.value })}
                  className="border border-gray-300 rounded-lg p-1.5 flex-1 text-xs cursor-pointer"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set({ endDate: e.target.value })}
                  className="border border-gray-300 rounded-lg p-1.5 flex-1 text-xs cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 개인 일정 */}
          {form.activeTab === "personal" && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 py-1">
                <span className="w-10 text-gray-500 flex-shrink-0">구분</span>
                {(["공부", "기념", "행사", "기타"] as const).map((label) => (
                  <label key={label} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="pType"
                      checked={form.personalCategory === label}
                      onChange={() => set({ personalCategory: label })}
                      className="text-blue-500 focus:ring-blue-500 cursor-pointer"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-10 text-gray-500 flex-shrink-0">일자</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set({ startDate: e.target.value })}
                  className="border border-gray-300 rounded-lg p-1.5 flex-1 text-xs cursor-pointer"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set({ endDate: e.target.value })}
                  className="border border-gray-300 rounded-lg p-1.5 flex-1 text-xs cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-10 text-gray-500 flex-shrink-0">내용</span>
                <input
                  type="text"
                  value={form.content}
                  onChange={(e) => set({ content: e.target.value })}
                  placeholder="최대 100자까지만 입력해 주세요."
                  maxLength={100}
                  className="border border-gray-300 rounded-lg p-2 flex-1 text-xs cursor-text"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button
              onClick={handleAdd}
              className="px-5 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium text-xs transition-colors cursor-pointer"
            >
              추가 확인
            </button>
          </div>

          {/* 일정 목록 */}
          <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-semibold">
                  <th className="p-2 w-10 text-center">순번</th>
                  <th className="p-2 w-16">구분</th>
                  <th className="p-2 w-32">일자</th>
                  <th className="p-2">내용</th>
                  <th className="p-2 w-10 text-center">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {events.filter((e) => e.type !== "event").length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-400">
                      등록된 일정이 없습니다.
                    </td>
                  </tr>
                ) : (
                  events
                    .filter((e) => e.type !== "event")
                    .map((ev, i) => (
                      <tr key={ev.id} className="hover:bg-gray-50/50 text-gray-700">
                        <td className="p-2 text-center text-gray-400">{i + 1}</td>
                        <td className={`p-2 font-medium ${CATEGORY_COLOR[ev.type] ?? "text-gray-600"}`}>
                          {ev.type === "academic" ? "학습" : "개인"}
                        </td>
                        <td className="p-2 text-gray-500 truncate">
                          {ev.startDate} ~ {ev.endDate}
                        </td>
                        <td className="p-2 font-medium max-w-[150px] truncate">{ev.title}</td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => onDelete(ev.id)}
                            className="text-red-400 hover:text-red-600 font-bold transition-colors cursor-pointer"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-5 pt-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-xs cursor-pointer"
            >
              나의 일정 등록완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
