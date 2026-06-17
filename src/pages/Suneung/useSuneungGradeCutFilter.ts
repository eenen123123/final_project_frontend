import { useEffect, useState } from "react";
import api from "../../api/api";
import type { SuneungGradeCut } from "./SuneungGradeCut";

// 대분류명 -> 세부과목 목록 (예: { "사회탐구": ["생활과 윤리", ...], "수학": ["수학"] })
type SubjectsByClassification = Record<string, string[]>;

// 상위 선택이 바뀌면 진행 중이던 요청을 abort 하므로, 취소 에러는 무시한다.
function isCanceled(e: unknown): boolean {
  return (e as { code?: string })?.code === "ERR_CANCELED";
}

/**
 * 수능 등급컷 필터 cascade(연도 → 시험 → 대분류/세부과목 → 등급컷)를 한곳에서 관리.
 * 각 단계는 AbortController로 race condition을 막고, 상위 선택이 바뀌면 하위 선택을 초기화한다.
 */
export function useSuneungGradeCutFilter() {
  const [years, setYears] = useState<number[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  const [subjectsByClassification, setSubjectsByClassification] =
    useState<SubjectsByClassification>({});
  const [gradeCuts, setGradeCuts] = useState<SuneungGradeCut[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);
  const [selectedClassification, setSelectedClassification] = useState<
    string | null
  >(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // 1. 연도 목록 (최초 1회) — 최신 연도 기본 선택
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const { data } = await api.get<number[]>("/api/suneung/years", {
          signal: ctrl.signal,
        });
        setYears(data);
        setSelectedYear(data[0] ?? null);
      } catch (e) {
        if (!isCanceled(e)) throw e;
      }
    })();
    return () => ctrl.abort();
  }, []);

  // 2. 연도 → 시험 종류
  useEffect(() => {
    if (selectedYear === null) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        const { data } = await api.get<string[]>("/api/suneung/exam-types", {
          params: { year: selectedYear },
          signal: ctrl.signal,
        });
        setExamTypes(data);
        setSelectedExamType(data[0] ?? null);
      } catch (e) {
        if (!isCanceled(e)) throw e;
      }
    })();
    return () => ctrl.abort();
  }, [selectedYear]);

  // 3. (연도, 시험) → 대분류별 세부과목 묶음 — 첫 대분류/세부과목 기본 선택
  useEffect(() => {
    if (selectedYear === null || selectedExamType === null) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        const { data } = await api.get<SubjectsByClassification>(
          "/api/suneung/subjects",
          {
            params: { year: selectedYear, examType: selectedExamType },
            signal: ctrl.signal,
          },
        );
        setSubjectsByClassification(data);
        const firstClassification = Object.keys(data)[0] ?? null;
        setSelectedClassification(firstClassification);
        setSelectedSubject(
          firstClassification ? (data[firstClassification][0] ?? null) : null,
        );
      } catch (e) {
        if (!isCanceled(e)) throw e;
      }
    })();
    return () => ctrl.abort();
  }, [selectedYear, selectedExamType]);

  // 4. (연도, 시험, 세부과목) → 등급컷
  useEffect(() => {
    if (
      selectedYear === null ||
      selectedExamType === null ||
      selectedSubject === null
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGradeCuts([]);
      return;
    }
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get<SuneungGradeCut[]>(
          "/api/suneung/grade-cuts",
          {
            params: {
              year: selectedYear,
              subject: selectedSubject,
              examType: selectedExamType,
            },
            signal: ctrl.signal,
          },
        );
        setGradeCuts(data);
        setLoading(false);
      } catch (e) {
        if (!isCanceled(e)) {
          setLoading(false);
          throw e;
        }
      }
    })();
    return () => ctrl.abort();
  }, [selectedYear, selectedExamType, selectedSubject]);

  // 대분류 변경 시 해당 대분류의 첫 세부과목으로 초기화
  const selectClassification = (classification: string) => {
    setSelectedClassification(classification);
    setSelectedSubject(subjectsByClassification[classification]?.[0] ?? null);
  };

  const classifications = Object.keys(subjectsByClassification);
  const subjects = selectedClassification
    ? (subjectsByClassification[selectedClassification] ?? [])
    : [];

  return {
    years,
    selectedYear,
    setSelectedYear,
    examTypes,
    selectedExamType,
    setSelectedExamType,
    classifications,
    selectedClassification,
    selectClassification,
    subjects,
    selectedSubject,
    setSelectedSubject,
    gradeCuts,
    loading,
  };
}
