import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import api from "../../api/api";

interface InstructorListResponse {
  subjectClId: number;
  subjectClNm: string;
  instrUuid: string;
  userName: string;
  instrProfileImg: string | null;
}

export default function Instructors() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<
    { subjectClId: number; subjectClNm: string }[]
  >([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [instructors, setInstructors] = useState<InstructorListResponse[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [subjectError, setSubjectError] = useState(false);

  // 최초 마운트: 전체 강사 목록으로 과목 탭 구성
  useEffect(() => {
    api
      .get<InstructorListResponse[]>("/api/instructors")
      .then((res) => {
        const unique = Array.from(
          new Map(
            res.data.map((i) => [
              i.subjectClId,
              { subjectClId: i.subjectClId, subjectClNm: i.subjectClNm },
            ]),
          ).values(),
        );
        setSubjects(unique);
        if (unique.length > 0) setSelectedSubject(unique[0].subjectClId);
      })
      .catch(() => setSubjectError(true))
      .finally(() => setLoadingSubjects(false));
  }, []);

  // 과목 선택 시 해당 강사 목록 조회
  useEffect(() => {
    if (selectedSubject === null) return;
    const controller = new AbortController();

    const loadInstructors = async () => {
      setLoadingInstructors(true);
      try {
        const res = await api.get<InstructorListResponse[]>(
          "/api/instructors",
          {
            params: { subjClId: selectedSubject },
            signal: controller.signal,
          },
        );
        setInstructors(res.data);
      } catch (e) {
        if (!controller.signal.aborted) throw e;
      } finally {
        if (!controller.signal.aborted) setLoadingInstructors(false);
      }
    };
    loadInstructors();
    return () => controller.abort();
  }, [selectedSubject]);

  const selectedName = subjects.find(
    (s) => s.subjectClId === selectedSubject,
  )?.subjectClNm;

  if (loadingSubjects) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400 font-bold">불러오는 중...</p>
      </div>
    );
  }

  if (subjectError) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400 font-bold">
          강사 목록을 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        {/* 좌측 과목 네비게이션 */}
        <aside className="col-span-12 md:col-span-3 bg-white border border-gray-200 rounded-lg h-fit overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-black text-xs text-gray-900 text-center tracking-widest uppercase">
              HERMES 강사
            </h2>
          </div>
          <nav className="divide-y divide-gray-200">
            {subjects.map((subject) => {
              const isSelected = selectedSubject === subject.subjectClId;
              return (
                <div key={subject.subjectClId}>
                  <button
                    onClick={() => setSelectedSubject(subject.subjectClId)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold flex justify-between items-center transition-colors cursor-pointer ${
                      isSelected
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="tracking-tight">
                      {subject.subjectClNm}
                    </span>
                    {isSelected ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>

                  {isSelected && (
                    <div className="px-4 pb-3 pt-2 bg-white text-xs border-t border-gray-200">
                      {loadingInstructors ? (
                        <p className="text-gray-400 font-bold">
                          불러오는 중...
                        </p>
                      ) : (
                        <div className="flex flex-col gap-1.5 text-gray-600 font-bold">
                          {instructors.map((instr) => (
                            <span
                              key={instr.instrUuid}
                              onClick={() =>
                                navigate(`/instructor/${instr.instrUuid}`)
                              }
                              className="hover:text-blue-600 cursor-pointer transition-colors tracking-tight"
                            >
                              {instr.userName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* 우측 콘텐츠 영역 */}
        <section className="col-span-12 md:col-span-9 space-y-5">
          {/* 상단 과목 탭 바 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-none px-2 py-2 gap-0.5">
              {subjects.map((subject) => {
                const isSelected = selectedSubject === subject.subjectClId;
                return (
                  <button
                    key={subject.subjectClId}
                    onClick={() => setSelectedSubject(subject.subjectClId)}
                    className={`flex-1 min-w-[72px] text-center px-3.5 py-1.5 rounded-md text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {subject.subjectClNm}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 강사 라인업 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                {selectedName} 라인업
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 font-bold">
                대표 강사진을 확인하고 강좌를 수강하세요.
              </p>
            </div>

            {loadingInstructors ? (
              <p className="text-sm text-gray-400 font-bold">불러오는 중...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {instructors.map((instr) => (
                  <div
                    key={instr.instrUuid}
                    onClick={() => navigate(`/instructor/${instr.instrUuid}`)}
                    className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors group cursor-pointer"
                  >
                    <div className="p-4 flex items-center gap-3">
                      {instr.instrProfileImg ? (
                        <img
                          src={instr.instrProfileImg}
                          alt={instr.userName}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center font-black text-white text-xs shrink-0">
                          T
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate tracking-tight">
                          {instr.userName}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-bold tracking-tight">
                          {selectedName} 강사
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
