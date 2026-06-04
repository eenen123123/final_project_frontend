import { useState } from 'react';
import CourseSidebar from './components/CourseSidebar';
import TeacherCard from './components/TeacherCard';
import LectureList from './components/LectureList';
import NoticeList from './components/NoticeList';
import type { CourseDetail, SidebarTab } from '../../types/OnlineLectureInterface';

// ── 더미 데이터 (추후 API 교체) ─────────────────────────────────────────────
const MOCK_COURSE: CourseDetail = {
  id: '1',
  code: 'SOC-CULT-A',
  title: '사회문화 A',
  description:
    '2026 수능 대비 · 개념 완성 — 수능 사회문화 전 영역을 30강에 압축. 1단원 사회·문화 현상의 이해부터 5단원 현대 사회의 변동까지, 개념 정리 + 기출 분석 + 도표 풀이 전략을 한 번에.',
  teacher: {
    name: '임정환',
    subject: '사회문화 (설명)',
    role: '사회탐구 대표 강사',
    bio: '15년 경력. 수능 사회문화 만점자 다수 배출. 개념 정리와 실전 풀이 모두에 강점.',
  },
  totalLectures: 30,
  totalHours: 28,
  startDate: '2026.03.04',
  completedLectures: 2,
  lastStudied: '2026.05.07',
  progress: 54,
  tabCounts: {
    '강의 목록': 31,
    '공지사항': 6,
    QnA: 6,
    교안: 3,
    교재: 2,
  },
  lectures: [
    { id: 'ot', index: 0, subIndex: '0', title: '오리엔테이션', description: '강좌 소개와 학습 로드맵', duration: 14, progress: 100 },
    { id: 'l1', index: 1, subIndex: '1-1', title: '사회·문화 현상의 이해', description: '자연 현상과 사회·문화 현상의 차이', duration: 66, progress: 100 },
    { id: 'l2', index: 2, subIndex: '1-2', title: '사회·문화 현상을 이해하는 관점 (1)', duration: 79, progress: 56 },
    { id: 'l3', index: 3, subIndex: '1-3', title: '사회·문화 현상을 이해하는 관점 (2)', duration: 71, progress: 0 },
    { id: 'l4', index: 4, subIndex: '2-1', title: '사회·문화 현상의 탐구 방법', duration: 68, progress: 0 },
    { id: 'l5', index: 5, subIndex: '2-2', title: '양적 연구와 질적 연구', duration: 74, progress: 0 },
  ],
  notices: [
    { id: 'n1', category: '공지', title: '5월 모의고사 해설 라이브 안내 (5/18 20:00)', preview: '5월 학평 사회문화 전 문항 라이브 해설을 진행합니다. 라이브 중 채팅으로 질문하면 실시간 답변드립니다.', date: '2026.05.07', isPinned: true },
    { id: 'n2', category: '업데이트', title: '13~14강 (일탈 이론) 자료 v2 업로드', preview: '머튼의 적응 양식 표를 보강하여 PDF를 다시 올렸습니다. 마이페이지 > 자료실에서 확인해주세요.', date: '2026.05.05', isPinned: true },
    { id: 'n3', category: '공지', title: '수강 기간 연장 정책 변경 안내', preview: '기존 1회 30일 → 2회 각 30일로 연장 정책이 개선되었습니다.', date: '2026.04.28' },
    { id: 'n4', category: '이벤트', title: 'QnA 우수 답변 작성자 5월 시상', preview: '이번 달 QnA에서 가장 도움이 된 답변을 남긴 수강생 3명에게 교재를 증정합니다.', date: '2026.04.20' },
    { id: 'n5', category: '업데이트', title: '모바일 앱 1.4.0 업데이트', preview: '오프라인 다운로드 안정성을 개선하고, 1.5배속과 1.75배속을 추가했습니다.', date: '2026.04.12' },
    { id: 'n6', category: '공지', title: '2026 수능 대비 학습 로드맵 공개', preview: '1순환 개념 → 2순환 기출 → 3순환 실전, 단계별 추천 커리큘럼을 마이페이지에서 확인하세요.', date: '2026.04.01' },
  ],
};
// ──────────────────────────────────────────────────────────────────────────

export default function OnlineLecturePage() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('강의 목록');
  const course = MOCK_COURSE;

  const renderContent = () => {
    switch (activeTab) {
      case '강의 목록':
        return (
          <LectureList
            lectures={course.lectures}
            totalLectures={course.totalLectures}
            totalHours={course.totalHours}
          />
        );
      case '공지사항':
        return (
          <NoticeList
            notices={course.notices}
            total={course.tabCounts['공지사항']}
          />
        );
      case 'QnA':
        return <p className="text-sm text-gray-400 py-8 text-center">QnA 탭 — 추후 구현 예정</p>;
      case '교안':
        return <p className="text-sm text-gray-400 py-8 text-center">교안 탭 — 추후 구현 예정</p>;
      case '교재':
        return <p className="text-sm text-gray-400 py-8 text-center">교재 탭 — 추후 구현 예정</p>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 헤더 */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <p className="text-sm text-gray-400 mb-2">
          내 강의실 &nbsp;/&nbsp; {course.code}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{course.description}</p>
      </div>

      {/* 본문: 사이드바 + 메인 */}
      <div className="px-8 py-8 flex gap-8 items-start">
        {/* 좌측 사이드바 */}
        <CourseSidebar
          course={course}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 우측 메인 */}
        <div className="flex-1 min-w-0">
          <TeacherCard
            teacher={course.teacher}
            totalLectures={course.totalLectures}
            totalHours={course.totalHours}
            startDate={course.startDate}
          />
          <div className="mt-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
