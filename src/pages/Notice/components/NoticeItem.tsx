import type { Notice, NoticeCategory } from '../../../types/NoticeInterface';

interface NoticeItemProps {
  notice: Notice;
  onClick?: (notice: Notice) => void;
}

const CATEGORY_STYLE: Record<NoticeCategory, { text: string; dot: string }> = {
  공지:    { text: 'text-blue-600',  dot: 'bg-blue-500' },
  업데이트: { text: 'text-blue-600',  dot: 'bg-blue-500' },
  이벤트:  { text: 'text-gray-400',  dot: '' },
};

export default function NoticeItem({ notice, onClick }: NoticeItemProps) {
  const style = CATEGORY_STYLE[notice.category];

  return (
    <div
      onClick={() => onClick?.(notice)}
      className="flex items-start gap-5 px-2 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {/* 카테고리 */}
      <div className="flex items-center gap-1.5 w-20 flex-shrink-0 pt-0.5">
        {notice.isPinned && style.dot && (
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
        )}
        <span className={`text-xs font-medium ${style.text}`}>
          {notice.category}
        </span>
      </div>

      {/* 본문 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-1">{notice.title}</p>
        <p className="text-xs text-gray-400 truncate">{notice.preview}</p>
      </div>

      {/* 날짜 */}
      <span className="text-xs text-gray-400 flex-shrink-0 pt-0.5">{notice.date}</span>
    </div>
  );
}
