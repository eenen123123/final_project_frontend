export type SidebarTab = '강의 목록' | '공지사항' | 'QnA' | '교안' | '교재';

export type NoticeCategory = '공지' | '업데이트' | '이벤트';

// 수강 중인 강의의 개별 회차 (온라인 강의실 뷰, 진도율 포함)
export interface Lecture {
  id: string;
  index: number;        // 강 번호 (0 = OT)
  subIndex: string;     // e.g. '1-1'
  title: string;
  description?: string;
  duration: number;     // 분
  progress: number;     // 0 ~ 100
}

export interface CourseNotice {
  id: string;
  category: NoticeCategory;
  title: string;
  preview: string;
  date: string;
  isPinned?: boolean;
}

export interface Teacher {
  name: string;
  subject: string;      // e.g. '사회문화 (설명)'
  role: string;         // e.g. '사회탐구 대표 강사'
  bio: string;
  photoUrl?: string;
}

// 수강생 뷰 강좌 상세 (진도율·수강 시작일·회차 목록 포함)
export interface CourseDetail {
  id: string;
  code: string;
  title: string;
  description: string;
  teacher: Teacher;
  totalLectures: number;
  totalHours: number;
  startDate: string;
  completedLectures: number;
  lastStudied: string;
  progress: number;
  tabCounts: Record<SidebarTab, number>;
  lectures: Lecture[];
  notices: CourseNotice[];
}
