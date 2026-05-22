export interface StudySubject {
  name: string;
  percent: number;
  minutes: number;
}

export interface TeacherRank {
  rank: number;
  label: string;     // e.g. '[영역] A선생님'
  hours: string;     // e.g. '? 시간'
}

export interface CalendarEvent {
  date: string;      // 'YYYY-MM-DD'
  type: 'event' | 'academic' | 'personal';
  title: string;
}

export interface CourseStatus {
  active: number;
  activeLabel: string;
  completed: number;
  waiting: number;
  activeBook: number;
  cart: number;
  order: number;
  coupon: number;
  point: number;
}
