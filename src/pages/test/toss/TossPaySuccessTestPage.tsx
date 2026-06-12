import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../api/api";
import { useAuth } from "../../../auth/AuthContext";

export default function TossPaySuccessTestPage() {
  const [searchParams] = useSearchParams();
  const { isAuthReady } = useAuth(); // 인증 상태가 준비될 때까지 대기
  const confirmedRef = useRef(false);

  useEffect(() => {
    // 새 창은 in-memory 액세스 토큰이 비어 있으므로, 세션 복원(refresh)이 끝나
    // 토큰이 채워진 뒤에 confirm을 호출해야 인증 헤더가 실린다.
    // (먼저 호출하면 401 → 인터셉터 refresh가 AuthProvider refresh와 경쟁,
    //  토큰 회전으로 한쪽이 실패해 로그인 페이지로 튕긴다)
    if (!isAuthReady) return;
    if (confirmedRef.current) return; // StrictMode 이중 실행 / 중복 승인 방지
    confirmedRef.current = true;

    const confirm = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      try {
        const res = await api.post("/api/payments/toss/confirm", {
          paymentKey,
          orderId,
          amount,
        });
        alert(
          `결제 성공! 결제 ID: ${res.data.orderId} / 상품명: ${res.data.orderName} / 결제 금액: ${res.data.totalAmount} ${res.data.currency}`,
        );
        window.close();
      } catch (error) {
        console.error("결제 승인 실패:", error);
        alert("결제 승인에 실패했습니다.");
      }
    };

    confirm();
  }, [isAuthReady, searchParams]);

  return (
    <div>
      <p>결제 처리중...</p>
    </div>
  );
}
