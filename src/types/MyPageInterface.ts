export interface StudySubject {
  name: string;
  percent: number;
  minutes: number | null;
}

export interface TeacherRank {
  rank: number;
  label: string;
  hours: string;
  profileImage?: string;
}

export interface CalendarEvent {
  id: string;
  date: string;        // 'YYYY-MM-DD' (StudyCalendar 호환용)
  startDate: string;
  endDate: string;
  type: 'event' | 'academic' | 'personal' | 'holiday';
  title: string;
  content?: string;
  source?: 'admin' | 'user';  // 관리자 등록인지 사용자 등록인지 구분

}
export interface CourseStatus {
  active: number;
  completed: number;
  cart: number;
  order: number;
  coupon: number;
  point: number;
}

// 백엔드 응답 타입
export interface CalendarEventResponse {
  eventSn: number;
  eventType: 'holiday' | 'event' | 'academic';
  eventTitle: string;
  eventCont?: string;
  startDt: string;
  endDt: string;
  regUserId: string;
  regDt: string;
  mdfcnDt?: string;
  mdfcnUserId?: string;
}
export interface CalendarScheduleResponse {
  scheduleSn: number;
  userId: string;
  scheduleType: 'academic' | 'personal';
  scheduleTitle: string;
  scheduleCont?: string;
  startDt: string;
  endDt: string;
  regDt: string;
  mdfcnDt?: string;
}
