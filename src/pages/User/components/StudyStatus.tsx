import type { CourseStatus } from "../../../types/MyPageInterface";


interface StudyStatusProps {
  status: CourseStatus;
}

export default function StudyStatus({ status }: StudyStatusProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-5">
      <div className="grid grid-cols-2 gap-6">
        {/* 수강 현황 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">수강 현황</h3>
            <a href="/mylecture" className="text-xs text-blue-500 hover:underline">
              빠른 수강 신청 ›
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: `수강중(결손)`, value: `${status.active}(${status.activeLabel})` },
              { label: '수강완료',     value: status.completed },
              { label: '수강대기',     value: status.waiting },
              { label: '수강중 교재',  value: status.activeBook },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-xl font-bold text-blue-600">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 주문·혜택 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">주문·혜택</h3>
            <a href="#order" className="text-xs text-blue-500 hover:underline">
              강의 교재 구매 ›
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '장바구니',  value: status.cart },
              { label: '주문/배송', value: status.order },
              { label: '쿠폰',     value: status.coupon },
              { label: '북 포인트', value: status.point },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-xl font-bold text-blue-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
