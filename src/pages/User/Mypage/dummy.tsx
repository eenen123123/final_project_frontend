/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";
// ◀ 지정하신 경로의 실제 MyPageSidebar 컴포넌트 호출

export default function MyCalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"study" | "personal">("study");

  // 1. 사이드바 에러를 해결하기 위한 껍데기용 State 추가!
  // (만약 기존 Sidebar에서 "My 캘린더" 대신 다른 문자열이나 ENUM을 쓰신다면 그 값으로 초기화해주세요)
  const [activeSection, setActiveSection] = useState("My 캘린더");

  return (
    <div className="max-w-[1080px] mx-auto p-6 flex gap-6 items-start bg-gray-50/50 min-h-screen select-none">
      {/* 2. 에러가 나던 호출 부분을 아래와 같이 Props를 채워서 수정 */}
      <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* 오른쪽 메인 콘텐츠 영역 (캘린더 UI 껍데기 - 기존 코드 동일) */}
      <div className="flex-1 bg-white p-6 border border-gray-200 rounded-2xl shadow-xs text-xs font-sans">
        {/* 상단 컨트롤 / 범례 */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 text-sm font-bold">〈</button>
            <span className="text-lg font-bold tracking-wide text-gray-800">2026.6</span>
            <button className="text-gray-400 hover:text-gray-600 text-sm font-bold">〉</button>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>혜택/이벤트
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>학사 일정
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>나의 일정
            </span>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 text-center font-medium text-gray-400 border-b border-gray-200 pb-2 mb-1">
          <div className="text-red-500">SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* 달력 날짜 그리드 (2026년 6월 껍데기) */}
        <div className="grid grid-cols-7 border-t border-l border-gray-200">
          {/* 1주차 */}
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-gray-50/50 text-gray-300">
            <span>31</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-1 bg-white">
            <span className="text-gray-700 font-medium">1</span>
            <div className="text-[10px] text-red-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>6모, 100점 노...
            </div>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-1 bg-white">
            <span className="text-gray-700 font-medium">2</span>
            <div className="text-[10px] text-red-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>6모, 100점 노...
            </div>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-1 bg-white">
            <span className="text-red-500 font-medium">3</span>
            <div className="text-[10px] text-red-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>제9회 전국동시지방선거
            </div>
            <div className="text-[10px] text-red-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>6모, 100점 노...
            </div>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-1 bg-white">
            <span className="text-gray-700 font-medium">4</span>
            <div className="text-[10px] text-red-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>6모, 100점 노...
            </div>
            <div className="text-[10px] text-blue-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>[고3] 6월 모의...
            </div>
            <div className="text-[10px] text-blue-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>[고1/고2] 6월 ...
            </div>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-1 bg-white">
            <span className="text-gray-700 font-medium">5</span>
            <div className="text-[10px] text-red-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>6모, 100점 노...
            </div>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-1 bg-white">
            <span className="text-red-500 font-medium">6</span>
            <div className="text-[10px] text-red-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>현충일
            </div>
          </div>

          {/* 2주차 */}
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-red-500 font-medium">
            <span>7</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>8</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>9</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>10</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>11</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>12</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>13</span>
          </div>

          {/* 3주차 */}
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-red-500 font-medium">
            <span>14</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>15</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>16</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-1 bg-white text-gray-700">
            <span>17</span>
            <div className="text-[10px] text-blue-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>[고3] 7월 학력...
            </div>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>18</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>19</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>20</span>
          </div>

          {/* 4주차 (22일 선택 표시) */}
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-red-500 font-medium">
            <span>21</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700 ring-2 ring-black ring-inset z-10">
            <span className="font-bold">22</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>23</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col gap-1 bg-white text-gray-700">
            <span>24</span>
            <div className="text-[10px] text-blue-500 font-medium truncate flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>[고3] 7월 학력...
            </div>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>25</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>26</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>27</span>
          </div>

          {/* 5주차 */}
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-red-500 font-medium">
            <span>28</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>29</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-white text-gray-700">
            <span>30</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-gray-50/50 text-gray-300">
            <span>1</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-gray-50/50 text-gray-300">
            <span>2</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-gray-50/50 text-gray-300">
            <span>3</span>
          </div>
          <div className="border-r border-b border-gray-200 h-24 p-1.5 flex flex-col bg-gray-50/50 text-gray-300">
            <span>4</span>
          </div>
        </div>

        {/* 하단 정보 바 및 모달 오픈 버튼 */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-base font-bold text-gray-800 tracking-tight">22.MON</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg text-gray-400 hover:text-gray-700 hover:border-gray-500 hover:bg-gray-50 transition-all font-semibold text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* =========================================================================
          일정 관리 모달 팝업 UI 영역 (동일 파일 포함)
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-xs text-left">
            <div className="bg-gray-900 px-5 py-4 flex items-center justify-between text-white">
              <h3 className="text-sm font-bold">일정 관리</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-base">
                ✕
              </button>
            </div>
            <div className="p-5">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`flex-1 py-2.5 font-semibold text-center border-b-2 ${activeTab === "study" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-400"}`}
                  onClick={() => setActiveTab("study")}
                >
                  학습 일정
                </button>
                <button
                  className={`flex-1 py-2.5 font-semibold text-center border-b-2 ${activeTab === "personal" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-400"}`}
                  onClick={() => setActiveTab("personal")}
                >
                  개인 일정
                </button>
              </div>

              {activeTab === "study" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <select className="border border-gray-300 rounded-lg p-2 bg-white">
                      <option value="">영역 선택</option>
                      <option value="0001">국어</option>
                      <option value="0002">사회탐구</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg p-2 bg-white" disabled>
                      <option value="">선생님 선택</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg p-2 bg-white" disabled>
                      <option value="">강좌 선택</option>
                    </select>
                  </div>
                  <select className="w-full border border-gray-300 rounded-lg p-2 bg-white" disabled>
                    <option value="">강의 선택</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <span className="w-10 text-gray-500">일자</span>
                    <input
                      type="date"
                      defaultValue="2026-06-22"
                      className="border border-gray-300 rounded-lg p-1.5 flex-1"
                    />
                    <span>-</span>
                    <input
                      type="date"
                      defaultValue="2026-06-22"
                      className="border border-gray-300 rounded-lg p-1.5 flex-1"
                    />
                  </div>
                </div>
              )}

              {activeTab === "personal" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 py-1">
                    <span className="w-10 text-gray-500">구분</span>
                    {["공부", "기념", "행사", "기타"].map((label, idx) => (
                      <label key={idx} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="pType"
                          defaultChecked={idx === 0}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 text-gray-500">일자</span>
                    <input
                      type="date"
                      defaultValue="2026-06-22"
                      className="border border-gray-300 rounded-lg p-1.5 flex-1"
                    />
                    <span>-</span>
                    <input
                      type="date"
                      defaultValue="2026-06-22"
                      className="border border-gray-300 rounded-lg p-1.5 flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 text-gray-500">내용</span>
                    <input
                      type="text"
                      placeholder="최대 100자까지만 입력해 주세요."
                      maxLength={100}
                      className="border border-gray-300 rounded-lg p-2 flex-1"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-2 mt-4">
                <button className="px-4 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium">
                  추가 확인
                </button>
              </div>

              <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-semibold">
                      <th className="p-2 w-12 text-center">순번</th>
                      <th className="p-2 w-16">구분</th>
                      <th className="p-2 w-32">일자</th>
                      <th className="p-2">내용</th>
                      <th className="p-2 w-12 text-center">삭제</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr className="hover:bg-gray-50/50 text-gray-700">
                      <td className="p-2 text-center font-medium text-gray-400">1</td>
                      <td className="p-2 font-medium text-blue-600">사회탐구</td>
                      <td className="p-2 text-gray-500 truncate">2026-06-22 ~ 2026-06-23</td>
                      <td className="p-2 font-medium max-w-[150px] truncate">1강. 오리엔테이션 예시</td>
                      <td className="p-2 text-center">
                        <button className="text-red-500 hover:text-red-700 font-bold">✕</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-5 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  나의 일정 등록완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
