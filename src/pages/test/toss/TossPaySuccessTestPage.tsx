import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { useAuth } from "../../../auth/AuthContext";

interface PayResult {
  orderId: string;
  orderName: string;
  totalAmount: number;
  method: string;
}

export default function TossPaySuccessTestPage() {
  const [searchParams] = useSearchParams();
  const { isAuthReady } = useAuth();
  const navigate = useNavigate();
  const confirmedRef = useRef(false);
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [payResult, setPayResult] = useState<PayResult | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    const confirm = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      try {
        const res = await api.post("/api/payments/toss/confirm", { paymentKey, orderId, amount });
        setPayResult({
          orderId: res.data.orderId ?? orderId ?? "-",
          orderName: res.data.orderName ?? "-",
          totalAmount: res.data.totalAmount ?? Number(amount) ?? 0,
          method: res.data.method ?? "카드",
        });
        setStatus("success");
      } catch (error) {
        console.error("결제 승인 실패:", error);
        setStatus("error");
      }
    };

    confirm();
  }, [isAuthReady, searchParams, navigate]);

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-medium">결제를 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-sm w-full mx-4 shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">결제 승인 실패</h2>
          <p className="text-sm text-gray-500 mb-6">결제 처리 중 오류가 발생했습니다.<br />잠시 후 다시 시도해주세요.</p>
          <button
            onClick={() => navigate("/mycart")}
            className="w-full py-3 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
          >
            장바구니로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-lg mx-auto px-6 py-16">

        {/* 성공 아이콘 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-50 border-2 border-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">결제 완료</h1>
          <p className="text-sm text-gray-500">주문이 정상적으로 처리되었습니다.</p>
        </div>

        {/* 결제 정보 카드 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
          <div className="border-t-2 border-gray-800 px-6 py-5 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-500 shrink-0">주문번호</span>
              <span className="text-sm font-mono text-gray-700 text-right break-all">{payResult?.orderId}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-500 shrink-0">상품명</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{payResult?.orderName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">결제 수단</span>
              <span className="text-sm text-gray-700">{payResult?.method}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="text-sm font-bold text-gray-700">결제 금액</span>
              <span className="text-xl font-bold text-orange-500">
                {payResult?.totalAmount.toLocaleString("ko-KR")}
                <span className="text-sm font-normal text-gray-400 ml-0.5">원</span>
              </span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            홈으로
          </button>
          <button
            onClick={() => navigate("/mycart/orderhistory")}
            className="flex-1 py-3 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
          >
            주문 내역 보기 &gt;
          </button>
        </div>

      </div>
    </div>
  );
}
