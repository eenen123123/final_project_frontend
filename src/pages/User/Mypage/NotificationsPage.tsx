import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Package, Ticket, Star, BookOpen, Calendar, X, ChevronLeft } from "lucide-react";
import { useNotifications } from "../../../hooks/useNotifications";
import MyPageSidebar from "./components/MyPageSidebar";
import type { NotificationItem } from "../../../hooks/useNotifications";

const TYPE_CONFIG: Record<NotificationItem["type"], { label: string; Icon: React.ElementType; color: string; bg: string }> = {
  shipping: { label: "배송",   Icon: Package,  color: "text-yellow-600", bg: "bg-yellow-50" },
  coupon:   { label: "쿠폰",   Icon: Ticket,   color: "text-orange-600", bg: "bg-orange-50" },
  point:    { label: "포인트", Icon: Star,     color: "text-orange-600", bg: "bg-orange-50" },
  course:   { label: "수강",   Icon: BookOpen, color: "text-red-600",    bg: "bg-red-50"    },
  calendar: { label: "일정",   Icon: Calendar, color: "text-blue-600",   bg: "bg-blue-50"   },
};

export default function NotificationsPage() {
  const [activeSection, setActiveSection] = useState("마이룸");
  const { notifications, loading, markAsRead, dismiss } = useNotifications();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);
  const paged = notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0 space-y-4">
            {/* 헤더 카드 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Bell className="w-4.5 h-4.5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">전체 알림</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {loading ? "불러오는 중..." : unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림이 있습니다.` : "모든 알림을 확인했습니다."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/mypage")}
                className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                마이페이지
              </button>
            </div>

            {/* 알림 목록 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center gap-2 py-16 text-gray-300">
                  <Bell className="w-8 h-8 animate-pulse" />
                  <p className="text-sm">알림을 불러오는 중...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">새 알림이 없습니다.</p>
                    <p className="text-xs text-gray-300 mt-1">모든 알림을 확인했습니다.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {paged.map((n) => {
                    const { label, Icon, color, bg } = TYPE_CONFIG[n.type];
                    return (
                      <div
                        key={n.id}
                        className={`group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 ${!n.read ? "bg-blue-50/20" : "bg-white"}`}
                      >
                        {/* 읽음 dot */}
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${!n.read ? "bg-blue-400" : "bg-transparent"}`} />

                        {/* 타입 아이콘 */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>

                        {/* 메시지 */}
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => !n.read && markAsRead(n.id)}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[11px] font-bold ${color}`}>{label}</span>
                            {!n.read && (
                              <span className="text-[9px] font-bold bg-blue-100 text-blue-500 px-1 py-0.5 rounded">NEW</span>
                            )}
                          </div>
                          <p className={`text-sm truncate ${!n.read ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                            {n.message}
                          </p>
                          {n.date && <p className="text-[11px] text-gray-300 mt-0.5">{n.date}</p>}
                        </div>

                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => dismiss(n.id)}
                          className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    이전
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 text-xs rounded-lg transition-colors ${p === page ? "bg-blue-500 text-white font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
