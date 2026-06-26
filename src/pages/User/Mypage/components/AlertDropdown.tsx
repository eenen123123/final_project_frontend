import { useState, useEffect, useRef } from 'react';
import { Bell, Mail } from 'lucide-react';

export interface AlertItem {
  id: string;
  from?: string;       // 쪽지일 때만 사용
  message: string;
  read: boolean;
  important?: boolean; // 알림일 때만 사용
  date: string;
}

interface AlertDropdownProps {
  type: 'notification' | 'message';
  items: AlertItem[];
  onChange: (updated: AlertItem[]) => void;
}

const CONFIG = {
  notification: {
    icon: Bell,
    label: '알림',
    allReadText: '모두 읽음',
    footerText: '전체 알림 보기',
    footerHref: '#',
  },
  message: {
    icon: Mail,
    label: '쪽지',
    allReadText: '모두 읽음',
    footerText: '쪽지함 전체 보기',
    footerHref: '/messages',
  },
};

export default function AlertDropdown({ type, items, onChange }: AlertDropdownProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const config = CONFIG[type];
  const Icon = config.icon;

  const unreadCount = items.filter((i) => !i.read).length;
  const hasImportant = items.some((i) => !i.read && i.important);

  useEffect(() => {
    if (!show) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show]);

  const markAllRead = () =>
    onChange(items.map((i) => ({ ...i, read: true })));

  const markOneRead = (id: string) =>
    onChange(items.map((i) => i.id === id ? { ...i, read: true } : i));

  // 상단 바 뱃지 색상
  const badgeColor = hasImportant ? 'bg-red-400' : 'bg-blue-300';

  return (
    <div className="relative" ref={ref}>
      {/* 트리거 버튼 */}
      <button
        onClick={() => setShow((v) => !v)}
        className="relative hover:text-gray-900 transition-colors"
      >
        <Icon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 text-white text-[8px] font-bold rounded-full flex items-center justify-center ${badgeColor}`}>
            !
          </span>
        )}
      </button>

      {/* 드롭다운 */}
      {show && (
        <div className="absolute right-0 top-8 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">
              {config.label}
              {unreadCount > 0 && (
                <span className="ml-1.5 text-xs text-blue-600 font-medium">
                  {unreadCount}개 안읽음
                </span>
              )}
            </span>
            <button
              onClick={markAllRead}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {config.allReadText}
            </button>
          </div>

          {/* 목록 */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => markOneRead(item.id)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  !item.read ? 'bg-blue-50/50' : 'bg-white'
                }`}
              >
                {/* 읽음 점 */}
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  !item.read
                    ? item.important ? 'bg-red-400' : 'bg-blue-500'
                    : 'bg-transparent'
                }`} />

                <div className="flex-1 min-w-0">
                  {/* 쪽지일 때 발신자 표시 */}
                  {item.from && (
                    <p className="text-[10px] text-blue-400 font-medium mb-0.5">{item.from}</p>
                  )}
                  <p className={`text-xs leading-relaxed ${
                    !item.read ? 'text-gray-900 font-medium' : 'text-gray-400'
                  }`}>
                    {item.message}
                  </p>
                  <p className="text-[10px] text-gray-300 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 푸터 */}
          <div className="px-4 py-2.5 border-t border-gray-100 text-center">
            <a
              href={config.footerHref}
              className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
            >
              {config.footerText}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
