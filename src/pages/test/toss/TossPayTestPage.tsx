import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import type { TossPayRequestInterface } from "../../../types/TossPayRequestInterface";
import { useSearchParams } from "react-router-dom";

const clientKey = "test_ck_ALnQvDd2VJ209bO49mMOVMj7X41m";

export default function TossPayTestPage() {
  const [searchParams] = useSearchParams();
  const handlePayment = async () => {
    // 서버가 발급한 주문 ID(ORDERS.ORD_ID) · 서버가 계산한 금액
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    if (!orderId || !amount) {
      alert("주문 정보가 없습니다. 주문 생성 후 다시 시도해주세요.");
      return;
    }

    const tossPayments = await loadTossPayments(clientKey);
    const payment = tossPayments.payment({ customerKey: ANONYMOUS });
    // TODO : Anonymous 대신 실제 고객 식별자 사용 (예: userId)

    const req: TossPayRequestInterface = {
      amount: {
        currency: "KRW",
        value: parseInt(amount),
      },
      orderId,
      orderName: searchParams.get("orderName") || "테스트 상품",
      successUrl: "http://localhost:9001/test/toss-pay/success",
      failUrl: "http://localhost:9001/test/toss-pay/fail",
    };

    await payment.requestPayment({
      method: "CARD",
      ...req,
    });
  };
  handlePayment();

  return <div></div>;
}
