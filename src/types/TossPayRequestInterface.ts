export interface TossPayRequestInterface {
  amount: { currency: string; value: number }; // 결제 금액
  orderId: string; // 고유 주문 ID
  orderName: string; // 주문명
  successUrl: string; // 결제 성공 시 리다이렉트 URL
  failUrl: string; // 결제 실패 시 리다이렉트 URL
}
