import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyPageSidebar from "./components/MyPageSidebar";
import api from "../../../api/api";

interface ShippingInfo {
  shippingSn: number;
  ordSn: number;
  ordId: string;
  buyerNm: string;
  buyerTel: string;
  buyerEmail: string;
  receiverNm: string;
  receiverTel: string;
  zipCd: string;
  addrRoad: string;
  addrDtl: string;
  deliveryMsg: string;
  dlvryStatCd: "READY" | "SHIPPING" | "DELIVERED" | "CANCELED";
  invoiceNo: string | null;
  regDt: string;
}

const statusMap = {
  READY:     { label: "준비중",   cls: "bg-amber-50 text-amber-600 border-amber-200" },
  SHIPPING:  { label: "배송중",   cls: "bg-blue-50 text-blue-600 border-blue-200" },
  DELIVERED: { label: "배송완료", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  CANCELED:  { label: "취소",     cls: "bg-rose-50 text-rose-600 border-rose-200" },
};

export default function ShippingDetailPage() {
  const { ordSn } = useParams<{ ordSn: string }>();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api.get<ShippingInfo>(`/api/shipping/${ordSn}`)
      .then(res => setShipping(res.data))
      .catch(() => setIsError(true))
      .finally(() => setLoading(false));
  }, [ordSn]);

  const status = shipping ? statusMap[shipping.dlvryStatCd] : null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar activeSection="주문/배송 조회" onSectionChange={() => {}} />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mb-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                주문 내역으로
              </button>
              <h2 className="text-2xl font-bold text-gray-900">배송 상세</h2>
            </div>

            {loading && (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400 animate-pulse">
                배송 정보를 불러오는 중...
              </div>
            )}

            {!loading && isError && (
              <div className="bg-white border border-red-100 rounded-xl py-16 text-center">
                <p className="text-sm font-bold text-red-500">배송 정보를 찾을 수 없습니다.</p>
                <p className="text-xs text-gray-400 mt-1">교재 포함 주문만 배송 정보가 제공됩니다.</p>
              </div>
            )}

            {!loading && !isError && shipping && (
              <div className="space-y-4">

                {/* 배송 상태 */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">배송 현황</h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${status?.cls}`}>
                      {status?.label}
                    </span>
                    <div className="text-sm text-gray-500">
                      {shipping.invoiceNo
                        ? <span>송장번호 <span className="font-mono font-bold text-gray-800">{shipping.invoiceNo}</span></span>
                        : <span className="text-amber-500 font-medium">송장번호 입력 대기중</span>
                      }
                    </div>
                  </div>
                </div>

                {/* 수령인 정보 */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">배송지 정보</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex gap-3">
                      <span className="w-20 text-gray-400 shrink-0">수령인</span>
                      <span className="font-semibold text-gray-800">{shipping.receiverNm || '-'}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-20 text-gray-400 shrink-0">연락처</span>
                      <span className="text-gray-700">{shipping.receiverTel || '-'}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-20 text-gray-400 shrink-0">주소</span>
                      <div>
                        <p className="text-gray-700">{shipping.addrRoad || '-'}</p>
                        {shipping.addrDtl && <p className="text-gray-500 text-xs mt-0.5">{shipping.addrDtl}</p>}
                      </div>
                    </div>
                    {shipping.deliveryMsg && (
                      <div className="flex gap-3">
                        <span className="w-20 text-gray-400 shrink-0">배송메모</span>
                        <span className="text-gray-500">{shipping.deliveryMsg}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
