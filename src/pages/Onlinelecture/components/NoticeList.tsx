import type { CourseNotice, NoticeCategory } from '../../../types/OnlineLectureInterface';

interface NoticeListProps {
  notices: CourseNotice[];
  total: number;
}

const CATEGORY_STYLE: Record<NoticeCategory, string> = {
  공지: 'text-blue-600',
  업데이트: 'text-blue-600',
  이벤트: 'text-gray-400',
};

export default function NoticeList({ notices, total }: NoticeListProps) {
  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-900">공지사항</h3>
        <span className="text-sm text-gray-400">{total}건</span>
      </div>

      {/* 목록 */}
      <div className="divide-y divide-gray-100">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="flex items-start gap-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer px-1"
          >
            {/* 카테고리 */}
            <div className="flex items-center gap-1.5 w-20 flex-shrink-0 pt-0.5">
              {notice.isPinned && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              )}
              <span className={`text-xs font-medium ${CATEGORY_STYLE[notice.category]}`}>
                {notice.category}
              </span>
            </div>

            {/* 본문 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-0.5">{notice.title}</p>
              <p className="text-xs text-gray-400 truncate">{notice.preview}</p>
            </div>

            {/* 날짜 */}
            <span className="text-xs text-gray-400 flex-shrink-0 pt-0.5">{notice.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
