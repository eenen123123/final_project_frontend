import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import type { TossPayRequestInterface } from "../../../types/TossPayRequestInterface";
import { useSearchParams } from "react-router-dom";

const clientKey = "test_ck_ALnQvDd2VJ209bO49mMOVMj7X41m";

export default function TossPayTestPage() {
  const [searchParams] = useSearchParams();
  const handlePayment = async () => {
    const tossPayments = await loadTossPayments(clientKey);
    const payment = tossPayments.payment({ customerKey: ANONYMOUS });
    // TODO : Anonymous 대신 실제 고객 식별자 사용 (예: userId)

    const req: TossPayRequestInterface = {
      amount: {
        currency: "KRW",
        value: searchParams.get("total_amount")
          ? parseInt(searchParams.get("total_amount")!)
          : 100,
      },
      orderId: crypto.randomUUID(),
      orderName: searchParams.get("item_name") || "테스트 상품",
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
