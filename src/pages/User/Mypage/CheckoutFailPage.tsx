import { useNavigate, useSearchParams } from "react-router-dom";

export default function CheckoutFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-gray-200 bg-white px-8 py-10 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          결제에 실패했습니다
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {message ?? "결제가 취소되었거나 처리 중 오류가 발생했습니다."}
        </p>
        <button
          onClick={() => navigate("/mycart")}
          className="w-full py-3 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
        >
          장바구니로 돌아가기
        </button>
      </div>
    </div>
  );
}
