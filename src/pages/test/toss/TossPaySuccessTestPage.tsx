import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../api/api";

export default function TossPaySuccessTestPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirm = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const productName = searchParams.get("orderName");

      const res = await api.post("/api/payments/confirm", {
        paymentKey,
        orderId,
        amount,
        productName,
      });
      alert(
        `결제 성공! 결제 ID: ${res.data.orderId} / 상품명: ${res.data.orderName} / 결제 금액: ${res.data.totalAmount} ${res.data.currency}`,
      );
      window.close();
    };

    confirm();
  }, [searchParams]);

  return (
    <div>
      <p>결제 처리중...</p>
    </div>
  );
}
