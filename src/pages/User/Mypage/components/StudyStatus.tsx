import { Link } from "react-router-dom";
import type { CourseStatus } from "../../../../types/MyPageInterface";

interface StudyStatusProps {
  status: CourseStatus;
}

export default function StudyStatus({ status }: StudyStatusProps) {
  const courseItems = [
    { label: "수강중(결손)", value: `${status.active}(${status.activeLabel})`, to: "/mylecture" },
    { label: "수강완료",     value: status.completed,  to: "/mylecture" },
    { label: "수강대기",     value: status.waiting,    to: "/mylecture" },
    { label: "수강중 교재",  value: status.activeBook, to: "/mycart/orderhistory" },
  ];

  const benefitItems = [
    { label: "장바구니",   value: status.cart,   to: "/mycart" },
    { label: "주문/배송",  value: status.order,  to: "/mycart/orderhistory" },
    { label: "쿠폰",       value: status.coupon, to: "/mypage/couponpoint" },
    { label: "북 포인트",  value: status.point,  to: "/mypage/couponpoint" },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 수강 현황 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">수강 현황</h3>
            <Link to="/courses" className="text-xs text-blue-500 hover:underline">빠른 수강 신청 ›</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {courseItems.map(({ label, value, to }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <Link to={to} className="text-xl font-bold text-blue-600 hover:underline">{value}</Link>
              </div>
            ))}
          </div>
        </div>

        {/* 주문·혜택 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">주문·혜택</h3>
            <Link to="/header/books" className="text-xs text-blue-500 hover:underline">강의 교재 구매 ›</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {benefitItems.map(({ label, value, to }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <Link to={to} className="text-xl font-bold text-blue-600 hover:underline">{value}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
