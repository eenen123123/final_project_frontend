import { useParams } from "react-router-dom";
import MyPageSidebar from "./components/MyPageSidebar";
import { useState } from "react";
import api from "../../../api/api";

interface OrderItem {
  ordSn: string;
  ordItemSn: string;
  prodDivCd: string; // TEXTBOOK, COURSE
  prodSn: string;
  prodNm: string;
  prodPrice: number;
  itemQty: number;
  regDt: string;
}

export default function OrderHistoryDetailPage() {
  const ordSn = useParams().ordSn;
  const [activeSection, setActiveSection] = useState("주문/배송 조회");
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isError, setIsError] = useState(false);

  const getOrderItems = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/orders/detail`, {
        params: {
          id: ordSn,
        },
      });
      setOrderItems(res.data);
      setLoading(false);
      setIsError(false);
    } catch (error) {
      console.error("주문 상세 조회 실패:", error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <div>
            <h2 className="text-2xl font-bold mb-6">주문 상세 조회</h2>
            <p className="text-gray-700 mb-4">
              주문 번호: <span className="font-medium">{ordSn}</span>
            </p>
            {/* 주문 상세 정보 표시 */}
            <button onClick={getOrderItems}>주문 상세 조회</button>

            <div>
              {loading && <p>로딩 중...</p>}
              {isError && <p className="text-red-500">주문 상세 조회 실패</p>}
              {!loading && !isError && (
                <div>
                  {orderItems.map((item) => (
                    <div
                      key={item.ordItemSn}
                      className="border p-4 mb-4 rounded-lg"
                    >
                      <h3 className="text-lg font-semibold">{item.prodNm}</h3>
                      <p>수량: {item.itemQty}</p>
                      <p>
                        가격:{" "}
                        <span className="font-bold text-blue-600">
                          {item.prodPrice.toLocaleString()}
                        </span>
                      </p>
                      <p>주문일: {new Date(item.regDt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
