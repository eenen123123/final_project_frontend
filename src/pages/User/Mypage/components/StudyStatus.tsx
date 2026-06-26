import { Link } from "react-router-dom";
import { PlayCircle, CheckCircle2, ShoppingCart, Package, Ticket, Star } from "lucide-react";
import type { CourseStatus } from "../../../../types/MyPageInterface";

interface StudyStatusProps {
  status: CourseStatus;
}

export default function StudyStatus({ status }: StudyStatusProps) {
  const items = [
    { label: "수강중",    value: status.active,                         to: "/mylecture",                           Icon: PlayCircle   },
    { label: "수강완료",  value: status.completed,                      to: "/mylecture",                           Icon: CheckCircle2 },
    { label: "장바구니",  value: status.cart,                           to: "/mycart",                              Icon: ShoppingCart },
    { label: "주문/배송", value: status.order,                          to: "/mycart/orderhistory",                 Icon: Package      },
    { label: "쿠폰",      value: status.coupon,                         to: "/mypage/couponpoint",                  Icon: Ticket       },
    { label: "HM 포인트", value: `${status.point.toLocaleString()}p`,   to: "/mypage/couponpoint?tab=hm-point-buy", Icon: Star         },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-5">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {items.map(({ label, value, to, Icon }) => (
          <div key={label} className="bg-gray-50 rounded-lg px-3 py-4 text-center flex flex-col items-center gap-1.5">
            <Icon className="w-5 h-5 text-gray-400" />
            <p className="text-xs text-gray-400">{label}</p>
            <Link to={to} className="text-lg font-bold text-blue-600 hover:underline">{value}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
