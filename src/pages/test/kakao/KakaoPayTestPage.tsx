import { useState } from "react";
import api from "../../../api/api";

interface KakaoPayRequest {
  item_name: string;
  quantity: number;
  total_amount: number;
}

export default function KakaoPayTestPage() {
  const [formData, setFormData] = useState<KakaoPayRequest>({
    item_name: "",
    quantity: 1,
    total_amount: 100,
  });

  const handleKakaoPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.item_name ||
      formData.quantity <= 0 ||
      formData.total_amount <= 0
    ) {
      alert("상품명, 수량, 총 금액을 올바르게 입력해주세요.");
      return;
    }
    try {
      // Access Token을 담아서 카카오페이 결제 요청을 보냄
      const res = await api.post("/api/test/kakao-pay", formData);
      console.log("res.data:", res.data);
      window.open(res.data.next_redirect_pc_url, "_blank");
    } catch (error) {
      console.error("카카오페이 결제 요청 실패:", error);
      alert("카카오페이 결제 요청에 실패했습니다.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">카카오페이 테스트 페이지</h1>

      <div className="bg-white p-6 rounded shadow-md">
        <form action="" className="mb-4">
          <div className="mb-4">
            <label className="block mb-1">상품명</label>
            <input
              type="text"
              value={formData.item_name}
              onChange={(e) =>
                setFormData({ ...formData, item_name: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">수량</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">총 금액</label>
            <input
              type="number"
              value={formData.total_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  total_amount: Number(e.target.value),
                })
              }
              className="border p-2 w-full"
            />
          </div>
        </form>

        <button
          type="submit"
          onClick={handleKakaoPay}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          카카오페이 결제 요청
        </button>
      </div>
    </div>
  );
}
