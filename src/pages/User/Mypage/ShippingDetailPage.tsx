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
  READY: {
    label: "배송 준비중",
    cls: "bg-amber-50 text-amber-700 border-amber-100",
    step: 1,
  },
  SHIPPING: {
    label: "배송중",
    cls: "bg-blue-50 text-blue-700 border-blue-100",
    step: 2,
  },
  DELIVERED: {
    label: "배송완료",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-100",
    step: 3,
  },
  CANCELED: {
    label: "배송취소",
    cls: "bg-rose-50 text-rose-600 border-rose-100",
    step: 0,
  },
};

const SHIPPING_FAQS = [
  {
    q: "배송은 얼마나 걸리나요?",
    a: "출고 완료 후 일반 지역은 1~3영업일, 도서산간 지역은 3~5영업일이 소요됩니다.",
  },
  {
    q: "배송지를 변경하고 싶어요.",
    a: "['배송 준비중'] 단계까지만 고객센터를 통해 변경이 가능하며, 배송이 시작된 이후에는 변경이 어렵습니다.",
  },
  {
    q: "교재를 반품/교환하고 싶습니다.",
    a: "교재 수령 후 7일 이내에 낙서나 훼손이 없는 상태에서만 가능하며, 단순 변심일 경우 왕복 배송비가 부과됩니다.",
  },
];

export default function ShippingDetailPage() {
  const { ordSn } = useParams<{ ordSn: string }>();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api
      .get<ShippingInfo>(`/api/shipping/${ordSn}`)
      .then((res) => setShipping(res.data))
      .catch(() => setIsError(true))
      .finally(() => setLoading(false));
  }, [ordSn]);

  const handleCopyInvoice = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("운송장 번호가 복사되었습니다.");
  };

  const status = shipping ? statusMap[shipping.dlvryStatCd] : null;
  const currentStep = status?.step ?? 0;

  return (
    <div className="min-h-screen bg-slate-50/50 antialiased text-slate-900 selection:bg-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex gap-10 items-start">
          {/* 사이드바 영역 */}
          <div className="w-64 shrink-0 hidden md:block">
            <MyPageSidebar
              activeSection="주문/배송 조회"
              onSectionChange={() => {}}
            />
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* 상단 네비게이션 */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer w-fit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
                주문 내역으로 돌아가기
              </button>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                배송 상세 정보
              </h2>
            </div>

            {/* 로딩 스켈레톤 */}
            {loading && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 h-24 animate-pulse" />
                <div className="bg-white border border-slate-100 rounded-2xl p-6 h-48 animate-pulse" />
              </div>
            )}

            {/* 에러 핸들링 */}
            {!loading && isError && (
              <div className="bg-white border border-slate-100 rounded-2xl py-20 text-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
                <p className="text-sm font-semibold text-rose-500">
                  배송 정보를 찾을 수 없습니다.
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  교재가 포함된 주문 건만 배송 정보 확인이 가능합니다.
                </p>
              </div>
            )}

            {/* 본문 콘텐츠 */}
            {!loading && !isError && shipping && (
              <div className="space-y-6">
                {/* 1. 상단 배송 마스터 정보 대시보드 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-wrap items-center gap-x-12 gap-y-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]">
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                      주문번호
                    </p>
                    <p className="font-mono text-sm font-bold text-slate-800 tracking-tight">
                      {shipping.ordId}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                      배송 상태
                    </p>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide border ${status?.cls}`}
                    >
                      {status?.label}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                      운송장 번호
                    </p>
                    {shipping.invoiceNo ? (
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-bold text-slate-800 tracking-tight select-all">
                          {shipping.invoiceNo}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyInvoice(shipping.invoiceNo!)}
                          className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded cursor-pointer transition-colors"
                        >
                          복사
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-amber-500">
                        택배사 등록 대기 중
                      </p>
                    )}
                  </div>
                </div>

                {/* ✨ 2. [신규 추가] 시각적 배송 타임라인 트래커 (허전함 해결사) */}
                {shipping.dlvryStatCd !== "CANCELED" && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
                    <div className="relative flex items-center justify-between max-w-xl mx-auto py-4">
                      {/* 백그라운드 진행 바 게이지 */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0" />
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 transition-all duration-500"
                        style={{
                          width:
                            currentStep === 1
                              ? "0%"
                              : currentStep === 2
                                ? "50%"
                                : "100%",
                        }}
                      />

                      {/* Step 1: 배송 준비중 */}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${currentStep >= 1 ? "bg-blue-500 border-blue-500 text-white shadow-sm shadow-blue-200" : "bg-white border-slate-200 text-slate-400"}`}
                        >
                          1
                        </div>
                        <span
                          className={`text-xs font-bold ${currentStep === 1 ? "text-blue-600 font-extrabold" : "text-slate-500"}`}
                        >
                          배송 준비중
                        </span>
                      </div>

                      {/* Step 2: 배송중 */}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${currentStep >= 2 ? "bg-blue-500 border-blue-500 text-white shadow-sm shadow-blue-200" : "bg-white border-slate-200 text-slate-400"}`}
                        >
                          2
                        </div>
                        <span
                          className={`text-xs font-bold ${currentStep === 2 ? "text-blue-600 font-extrabold" : "text-slate-500"}`}
                        >
                          배송중
                        </span>
                      </div>

                      {/* Step 3: 배송완료 */}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${currentStep >= 3 ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200" : "bg-white border-slate-200 text-slate-400"}`}
                        >
                          3
                        </div>
                        <span
                          className={`text-xs font-bold ${currentStep === 3 ? "text-emerald-600 font-extrabold" : "text-slate-500"}`}
                        >
                          배송완료
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 상세 배송 정보 그리드 레이아웃 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 배송지 및 수령인 정보 카드 */}
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="px-6 py-4.5 border-b border-slate-50">
                      <h3 className="text-sm font-bold text-slate-800">
                        배송지 정보
                      </h3>
                    </div>
                    <div className="p-6 space-y-4 text-xs font-medium">
                      <div className="flex items-start gap-4">
                        <span className="w-20 text-slate-400 shrink-0">
                          수령인
                        </span>
                        <span className="text-slate-800 font-bold">
                          {shipping.receiverNm || "-"}
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="w-20 text-slate-400 shrink-0">
                          연락처
                        </span>
                        <span className="text-slate-700 font-mono">
                          {shipping.receiverTel || "-"}
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="w-20 text-slate-400 shrink-0">
                          우편번호
                        </span>
                        <span className="text-slate-700 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {shipping.zipCd || "-"}
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="w-20 text-slate-400 shrink-0">
                          배송 주소
                        </span>
                        <div className="space-y-1">
                          <p className="text-slate-800 leading-relaxed font-semibold">
                            {shipping.addrRoad || "-"}
                          </p>
                          {shipping.addrDtl && (
                            <p className="text-slate-500 text-[11px]">
                              {shipping.addrDtl}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-50 flex items-start gap-4">
                        <span className="w-20 text-slate-400 shrink-0">
                          배송 메모
                        </span>
                        <span className="text-slate-600 leading-relaxed font-normal italic">
                          {shipping.deliveryMsg
                            ? `"${shipping.deliveryMsg}"`
                            : "선택된 배송 메모가 없습니다."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 주문자 기본 정보 카드 */}
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="px-6 py-4.5 border-b border-slate-50">
                      <h3 className="text-sm font-bold text-slate-800">
                        주문자 정보
                      </h3>
                    </div>
                    <div className="p-6 space-y-4 text-xs font-medium">
                      <div className="flex items-start gap-4">
                        <span className="w-20 text-slate-400 shrink-0">
                          구매자명
                        </span>
                        <span className="text-slate-800 font-bold">
                          {shipping.buyerNm || "-"}
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="w-20 text-slate-400 shrink-0">
                          연락처
                        </span>
                        <span className="text-slate-700 font-mono">
                          {shipping.buyerTel || "-"}
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="w-20 text-slate-400 shrink-0">
                          이메일
                        </span>
                        <span className="text-slate-700 font-mono">
                          {shipping.buyerEmail || "-"}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <div className="bg-slate-50/60 rounded-xl p-3.5 border border-slate-100 flex gap-2.5 items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 text-slate-400 mt-0.5 shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m11.25 11.25.041-.02a.75.75 0 1 1 .512 1.35h-.47a.75.75 0 0 1-.402-1.122ZM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                          </svg>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            배송 정보는 교재 출고 단계 전까지만 수정할 수
                            있습니다. 정보 변경이 필요한 경우 고객센터로 연락
                            바랍니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✨ 4. [신규 추가] 하단 미니 FAQ/안내 가이드라인 카드 (푸터 여백 보완용) */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-6 py-4.5 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 text-slate-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                        />
                      </svg>
                      교재 배송 및 반품 안내 FAQ
                    </h3>
                  </div>
                  <div className="p-6 divide-y divide-slate-100">
                    {SHIPPING_FAQS.map((faq, i) => (
                      <div key={i} className={`py-3.5 first:pt-0 last:pb-0`}>
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="text-blue-500 font-extrabold font-mono">
                            Q.
                          </span>
                          {faq.q}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1.5 pl-4 leading-relaxed font-medium">
                          {faq.a}
                        </p>
                      </div>
                    ))}
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
