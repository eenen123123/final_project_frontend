export type NoticeCategory = '공지' | '업데이트' | '이벤트';

export interface Notice {
  id: string;
  category: NoticeCategory;
  title: string;
  preview: string;
  date: string;
  isPinned?: boolean;   // 파란 점 표시
}
