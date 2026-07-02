import { Bell, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { NotificationItem } from "../../../../hooks/useNotifications";

const TYPE_LABEL: Record<NotificationItem["type"], string> = {
  shipping: "배송",
  coupon: "쿠폰",
  point: "포인트",
  course: "수강",
  calendar: "일정",
};

interface AlertBellButtonProps {
  unreadCount: number;
  open: boolean;
  onToggle: () => void;
}

export function AlertBellButton({ unreadCount, open, onToggle }: AlertBellButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative transition-colors ${open ? "text-gray-900" : "hover:text-gray-900"}`}
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-400 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
          !
        </span>
      )}
    </button>
  );
}

interface AlertPanelProps {
  items: NotificationItem[];
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onClose: () => void;
}

export function AlertPanel({ items, onRead, onDismiss, onClose }: AlertPanelProps) {
  const navigate = useNavigate();
  const unreadCount = items.filter((i) => !i.read).length;
  const preview = items.slice(0, 5);

  return (
    <div className="absolute right-0 top-full mt-2 z-20 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">
          알림
          {unreadCount > 0 && (
            <span className="ml-1.5 text-xs text-blue-600 font-medium">{unreadCount}개 안읽음</span>
          )}
        </span>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 bg-white">
        {preview.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">새 알림이 없습니다.</p>
        ) : (
          preview.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!item.read ? "bg-blue-50/40" : ""}`}
            >
              <span
                onClick={() => !item.read && onRead(item.id)}
                className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 cursor-pointer ${!item.read ? "bg-blue-400" : "bg-transparent"}`}
              />
              <div
                onClick={() => !item.read && onRead(item.id)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <span className="text-[10px] text-blue-400 font-medium mr-1">[{TYPE_LABEL[item.type]}]</span>
                <p className={`text-xs leading-relaxed truncate ${!item.read ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                  {item.message}
                </p>
                {item.date && <p className="text-[10px] text-gray-300 mt-0.5">{item.date}</p>}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDismiss(item.id); }}
                className="flex-shrink-0 p-1 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-gray-100 text-center bg-white">
        <button
          onClick={() => { onClose(); navigate("/mypage/notifications"); }}
          className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
        >
          전체 알림 보기 ›
        </button>
      </div>
    </div>
  );
}
