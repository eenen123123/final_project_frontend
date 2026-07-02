import { useState } from "react";
import MyPageSidebar from "./components/MyPageSidebar";
import CouponPointContent from "./components/CouponPointContent";

export default function CouponPointPage() {
  const [activeSection, setActiveSection] = useState<string>("쿠폰/포인트 관리");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex flex-col gap-1.5">
              <h2 className="text-xl font-bold text-gray-950">쿠폰/포인트 관리</h2>
              <p className="text-[11px] text-gray-400 font-medium">
                쿠폰 및 포인트는 헤르메스 일반강좌/서점상품 구매 시 할인수단으로
                사용할 수 있는 포인트, 할인권 및 충전해서 사용하는 HM머니의
                현황을 볼 수 있는 곳입니다.
              </p>
            </div>
            <CouponPointContent />
          </div>
        </div>
      </div>
    </div>
  );
}
