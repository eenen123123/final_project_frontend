import { useState } from "react";
import api, { getApiErrorMessage } from "../../api/api";

/**
 * 상품 구매 테스트 페이지
 *
 * 1) POST /api/orders 로 주문 선생성(PENDING) → 서버가 ordId 발급 + 가격 재계산
 * 2) 새 창에서 토스 결제창 호출 (서버가 준 ordId/totAmt 사용)
 *
 * TODO : 구매 처리 후 성공/실패 페이지 구현
 * - 성공 페이지에서는 결제 정보 표시
 * - 실패 페이지에서는 실패 사유 표시
 */

interface OrderItemForm {
  prodDivCd: "COURSE" | "TEXTBOOK";
  prodSn: string;
  itemQty: number;
}

export default function BuyProduct() {
  const [items, setItems] = useState<OrderItemForm[]>([
    { prodDivCd: "COURSE", prodSn: "", itemQty: 1 },
  ]);

  const handleItemChange = (
    index: number,
    field: keyof OrderItemForm,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: field === "itemQty" ? Number(value) : value }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { prodDivCd: "TEXTBOOK", prodSn: "", itemQty: 1 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTossPay = async () => {
    if (items.length === 0 || items.some((item) => !item.prodSn)) {
      alert("상품 번호를 모두 입력해주세요.");
      return;
    }
    try {
      // 주문 선생성 : 상품명/가격은 서버가 DB에서 조회해 계산
      const res = await api.post(
        "/api/orders",
        items.map((item) => ({
          prodDivCd: item.prodDivCd,
          prodSn: Number(item.prodSn),
          itemQty: item.itemQty,
        })),
      );
      const { ordId, ordNm, totAmt } = res.data;

      window.open(
        `/test/toss-pay?orderId=${ordId}&amount=${totAmt}&orderName=${encodeURIComponent(ordNm)}`,
        "_blank",
      );
    } catch (error) {
      console.error("주문 생성 실패:", error);
      alert(getApiErrorMessage(error, "주문 생성에 실패했습니다."));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">상품 구매 페이지</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-bold mb-4">
          Rest 모듈 실행중이어야함 / 로그인 필요
        </h3>
      </div>
      <div className="bg-white p-6 rounded shadow-md">
        <form className="mb-4">
          {items.map((item, index) => (
            <div key={index} className="mb-4 flex items-end gap-2">
              <div>
                <label className="block mb-1">상품 구분</label>
                <select
                  value={item.prodDivCd}
                  onChange={(e) =>
                    handleItemChange(index, "prodDivCd", e.target.value)
                  }
                  className="border p-2"
                >
                  <option value="COURSE">강좌</option>
                  <option value="TEXTBOOK">교재</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">상품 번호 (SN)</label>
                <input
                  type="number"
                  value={item.prodSn}
                  onChange={(e) =>
                    handleItemChange(index, "prodSn", e.target.value)
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">수량</label>
                <input
                  type="number"
                  min={1}
                  value={item.itemQty}
                  onChange={(e) =>
                    handleItemChange(index, "itemQty", e.target.value)
                  }
                  className="border p-2 w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white px-3 py-2 rounded cursor-pointer"
              >
                삭제
              </button>
            </div>
          ))}
        </form>
        <div className="mt-4">
          <button
            type="button"
            onClick={addItem}
            className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            상품 추가
          </button>
          <button
            type="button"
            onClick={handleTossPay}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2 cursor-pointer"
          >
            토스페이 결제 요청
          </button>
        </div>
      </div>
    </div>
  );
}
