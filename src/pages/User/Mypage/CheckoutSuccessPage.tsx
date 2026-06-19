import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { getApiErrorMessage } from "../../../api/api";
import { useAuth } from "../../../auth/AuthContext";

interface ConfirmResult {
  orderId: string;
  orderName: string;
  totalAmount: number;
  currency: string;
}

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthReady } = useAuth(); // 인증 상태가 준비될 때까지 대기
  const confirmedRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [result, setResult] = useState<ConfirmResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 리다이렉트로 앱이 새로 로드되면 in-memory 액세스 토큰이 비어 있으므로,
    // 세션 복원(refresh)이 끝나 토큰이 채워진 뒤에 confirm을 호출해야 인증 헤더가 실린다.
    if (!isAuthReady) return;
    if (confirmedRef.current) return; // StrictMode 이중 실행 / 중복 승인 방지
    confirmedRef.current = true;

    const confirm = async () => {
      try {
        const res = await api.post("/api/payments/toss/confirm", {
          paymentKey: searchParams.get("paymentKey"),
          orderId: searchParams.get("orderId"),
          amount: searchParams.get("amount"),
        });
        setResult(res.data);
        setStatus("success");
      } catch (error) {
        console.error("결제 승인 실패:", error);
        setErrorMsg(getApiErrorMessage(error, "결제 승인에 실패했습니다."));
        setStatus("error");
      }
    };

    confirm();
  }, [isAuthReady, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-gray-200 bg-white px-8 py-10 text-center">
        {status === "loading" && (
          <p className="text-sm text-gray-500">결제를 처리하고 있습니다...</p>
        )}

        {status === "success" && result && (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-6">
              결제가 완료되었습니다
            </h1>
            <div className="text-left text-sm text-gray-600 space-y-2 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-400">주문명</span>
                <span className="font-semibold text-gray-800">
                  {result.orderName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">결제금액</span>
                <span className="font-bold text-orange-500">
                  {result.totalAmount.toLocaleString("ko-KR")}원
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/mycart/orderhistory")}
              className="w-full py-3 bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
            >
              주문내역 보기
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              결제 승인에 실패했습니다
            </h1>
            <p className="text-sm text-gray-500 mb-8">{errorMsg}</p>
            <button
              onClick={() => navigate("/mycart")}
              className="w-full py-3 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
            >
              장바구니로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
