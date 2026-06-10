import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useAuth } from "../../auth/AuthContext";

const CLIENT_KEY = "test_ck_ALnQvDd2VJ209bO49mMOVMj7X41m";

const TYPE_LABEL: Record<string, string> = {
  course: "강좌",
  book: "교재",
};

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getUserId, getUserName } = useAuth();

  const type = searchParams.get("type") ?? "course";
  const name = searchParams.get("name") ?? "상품";
  const price = parseInt(searchParams.get("price") ?? "0", 10);

  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (price <= 0) {
      alert("결제 금액이 올바르지 않습니다.");
      return;
    }
    setLoading(true);
    try {
      const userId = getUserId();
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const payment = tossPayments.payment({
        customerKey: userId ?? crypto.randomUUID(),
      });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: price },
        orderId: crypto.randomUUID(),
        orderName: name,
        successUrl: `${window.location.origin}/test/toss-pay/success`,
        failUrl: `${window.location.origin}/test/toss-pay/fail`,
      });
    } catch (e) {
      console.error("결제 요청 실패", e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3 flex items-center gap-1"
          >
            ← 돌아가기
          </button>
          <h1 className="text-lg font-extrabold text-gray-900">결제하기</h1>
        </div>

        {/* 주문 상품 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 mb-3">주문 상품</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] px-1.5 py-0.5 bg-blue-50 text-blue-600 font-semibold rounded shrink-0">
                {TYPE_LABEL[type] ?? type}
              </span>
              <span className="text-sm font-semibold text-gray-800 truncate">{name}</span>
            </div>
            <span className="text-sm font-extrabold text-gray-900 shrink-0">
              {price === 0 ? "무료" : `${price.toLocaleString()}원`}
            </span>
          </div>
        </div>

        {/* 구매자 정보 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 mb-3">구매자 정보</p>
          <p className="text-sm text-gray-700">
            {getUserName() ?? "로그인 필요"}
          </p>
        </div>

        {/* 결제 수단 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 mb-3">결제 수단</p>
          <div className="flex items-center gap-2 px-3 py-2.5 border-2 border-blue-500 rounded-lg bg-blue-50/50">
            <span className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
            <span className="text-sm font-medium text-gray-800">카드 결제</span>
          </div>
        </div>

        {/* 최종 결제 금액 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">최종 결제 금액</span>
            <span className="text-xl font-extrabold text-blue-600">
              {price === 0 ? "무료" : `${price.toLocaleString()}원`}
            </span>
          </div>
        </div>

        {/* 결제 버튼 */}
        <div className="px-6 py-5">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white text-sm font-extrabold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "결제 진행 중..." : `${price === 0 ? "무료 수강신청" : `${price.toLocaleString()}원 결제하기`}`}
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
            토스페이먼츠를 통해 안전하게 결제됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
