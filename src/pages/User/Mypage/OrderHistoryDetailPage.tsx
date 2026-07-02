import { useNavigate, useParams, Link } from "react-router-dom";
import MyPageSidebar from "./components/MyPageSidebar";
import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../../../api/api";

interface OrderInfo {
  ordSn: number;
  ordId: string;
  ordNm: string;
  totAmt: number;
  origAmt?: number;
  pointAmt?: number;
  pointType?: string;
  couponNm?: string;
  ordStatCd: string;
  regDt: string;
  items: OrderItem[];
}
interface OrderItem {
  ordSn: string;
  ordItemSn: string;
  prodDivCd: string;
  prodSn: string;
  prodNm: string;
  prodPrice: number;
  itemQty: number;
  regDt: string;
  prodImg?: string;
  instrUserId?: string;
}

const STAT_LABEL: Record<string, string> = {
  PAID: "결제완료",
  PENDING: "결제대기",
  CANCEL_REQUESTED: "취소 처리중",
  CANCELED: "취소 완료",
  EXPIRED: "기간만료",
};

const STAT_STYLE: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  PENDING: "bg-amber-50 text-amber-700 border border-amber-100",
  CANCEL_REQUESTED: "bg-rose-50 text-rose-600 border border-rose-100",
  CANCELED: "bg-slate-100 text-slate-500 border border-slate-200",
  EXPIRED: "bg-slate-100 text-slate-400 border border-slate-200",
};

const PROD_LABEL: Record<string, string> = { TEXTBOOK: "교재", COURSE: "강좌" };
const PROD_STYLE: Record<string, string> = {
  TEXTBOOK: "bg-slate-100 text-slate-600",
  COURSE: "bg-blue-50 text-blue-600",
};

const POINT_LABEL: Record<string, string> = {
  HM_POINT: "HM 포인트",
  STUDY_POINT: "스터디 포인트",
  HM_MONEY: "HM 머니",
};

const CANCEL_REASONS = [
  { value: "CHANGE_OF_MIND", label: "단순 변심" },
  { value: "DELIVERY_DELAY", label: "배송 지연" },
  { value: "WRONG_ORDER", label: "주문 실수" },
  { value: "DUPLICATE_ORDER", label: "중복 주문" },
  { value: "OTHER", label: "기타" },
];

const CANCEL_NOTICES = [
  "취소 요청 후 관리자 검토를 거쳐 환불이 처리됩니다.",
  "결제 취소 시 사용한 포인트는 자동 복원됩니다.",
  "교재를 함께 구매한 경우, 교재 반송 후 처리되며 왕복 배송비는 고객 부담입니다.",
  "이벤트·할인 적용 상품은 환불 시 실 결제금액 기준으로 처리됩니다.",
  "수강 기간이 종료된 강좌는 환불이 불가합니다.",
];

export default function OrderHistoryDetailPage() {
  const ordSn = useParams().ordSn;
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("주문/배송 조회");
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isError, setIsError] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelRsnCd, setCancelRsnCd] = useState("");
  const [cancelRsnDtl, setCancelRsnDtl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get<OrderInfo>(`/api/orders/detail`, {
          params: { id: ordSn },
        });
        setOrderInfo(res.data);
        setIsError(false);
      } catch {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [ordSn]);

  const handleCancelSubmit = async () => {
    if (!cancelRsnCd) {
      alert("취소 사유를 선택해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/orders/${ordSn}/cancel`, {
        cancelRsnCd,
        cancelRsnDtl: cancelRsnDtl || undefined,
      });
      alert("취소/환불 요청이 접수되었습니다. 관리자 검토 후 처리됩니다.");
      setShowCancelPopup(false);
      setOrderInfo((prev) =>
        prev ? { ...prev, ordStatCd: "CANCEL_REQUESTED" } : prev,
      );
    } catch (error) {
      alert(getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."));
    } finally {
      setSubmitting(false);
    }
  };

  const origAmt =
    orderInfo?.origAmt ??
    orderInfo?.items.reduce((s, i) => s + i.prodPrice * i.itemQty, 0) ??
    0;
  const pointAmt = orderInfo?.pointAmt ?? 0;
  const couponDisc = Math.max(0, origAmt - pointAmt - (orderInfo?.totAmt ?? 0));

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* 상단 네비게이션 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mt-1">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  주문 상세 내역
                </h2>
                {/* ⚠️ 기존 상단 환불/취소 신청 버튼 제거됨 */}
              </div>
            </div>

            {/* 상단 마스터 정보 대시보드 */}
            {orderInfo && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-wrap items-center gap-x-12 gap-y-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                    주문번호
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-800 tracking-tight">
                    {orderInfo.ordId}
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                    주문일시
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(orderInfo.regDt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                    주문상태
                  </p>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide ${STAT_STYLE[orderInfo.ordStatCd] ?? "bg-slate-100 text-slate-500"}`}
                  >
                    {STAT_LABEL[orderInfo.ordStatCd] ?? orderInfo.ordStatCd}
                  </span>
                </div>
              </div>
            )}

            {/* 로딩 스켈레톤 */}
            {loading && (
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-100 rounded-2xl p-6 flex gap-5 animate-pulse"
                  >
                    <div className="shrink-0 w-20 h-20 rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 w-1/2 bg-slate-100 rounded" />
                      <div className="h-3 w-1/6 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 에러 핸들링 */}
            {!loading && isError && (
              <div className="bg-white border border-slate-100 rounded-2xl py-20 text-center shadow-sm">
                <p className="text-sm font-semibold text-slate-800">
                  주문 상세 정보를 불러오지 못했습니다.
                </p>
              </div>
            )}

            {/* 본문 메인 콘텐츠 */}
            {!loading && !isError && (
              <div className="space-y-6">
                {/* 1. 주문 상품 리스트 카드 */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-6 py-4.5 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">
                      주문 상품 정보
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {orderInfo?.items.map((item) => (
                      <div
                        key={item.ordItemSn}
                        className="flex gap-5 px-6 py-5.5 items-center hover:bg-slate-50/30 transition-colors"
                      >
                        <div className="shrink-0 w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center text-slate-300">
                          {item.prodImg ? (
                            <img
                              src={item.prodImg}
                              alt={item.prodNm}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.2}
                              stroke="currentColor"
                              className="w-7 h-7 text-slate-300"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 6h.008v.008H18V6Zm-12 9V6a2.25 2.25 0 0 1 2.25-2.25h11.5A2.25 2.25 0 0 1 22 6v9a2.25 2.25 0 0 1-2.25 2.25H8.25A2.25 2.25 0 0 1 6 15Z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide mb-1.5 ${PROD_STYLE[item.prodDivCd] ?? "bg-slate-100 text-slate-500"}`}
                          >
                            {PROD_LABEL[item.prodDivCd] ?? item.prodDivCd}
                          </span>
                          <Link
                            to={
                              item.prodDivCd === "COURSE" && item.instrUserId
                                ? `/instructor/${item.instrUserId}/courses/${item.prodSn}`
                                : `/header/books/${item.prodSn}`
                            }
                            className="block font-semibold text-sm text-slate-800 leading-snug truncate max-w-xl hover:text-blue-600 hover:underline transition-colors"
                          >
                            {item.prodNm}
                          </Link>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            수량 {item.itemQty}개
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-slate-900">
                            {(item.prodPrice * item.itemQty).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 결제 상세 금액 카드 */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-6 py-4.5 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">
                      결제 상세 금액
                    </h3>
                  </div>
                  <div className="px-6 py-5 space-y-3.5 border-b border-slate-100">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">총 상품 금액</span>
                      <span className="text-slate-800">
                        {origAmt.toLocaleString()}원
                      </span>
                    </div>
                    {couponDisc > 0 && (
                      <div className="flex justify-between text-xs font-medium">
                        <div>
                          <span className="text-blue-600">쿠폰 할인 혜택</span>
                          {orderInfo?.couponNm && (
                            <p className="text-[11px] text-slate-400 mt-0.5 ml-2">ㄴ {orderInfo.couponNm}</p>
                          )}
                        </div>
                        <span className="text-blue-600 shrink-0">
                          - {couponDisc.toLocaleString()}원
                        </span>
                      </div>
                    )}
                    {pointAmt > 0 && (
                      <div className="flex justify-between text-xs font-medium">
                        <div>
                          <span className="text-indigo-600">포인트 차감 사용</span>
                          {orderInfo?.pointType && (
                            <p className="text-[11px] text-slate-400 mt-0.5 ml-2">
                              ㄴ {POINT_LABEL[orderInfo.pointType] ?? orderInfo.pointType} {pointAmt.toLocaleString()}p
                            </p>
                          )}
                        </div>
                        <span className="text-indigo-600 shrink-0">
                          - {pointAmt.toLocaleString()}원
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-5 bg-slate-50/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      최종 실 결제금액
                    </span>
                    <span
                      className={`text-xl font-extrabold tracking-tight ${orderInfo?.ordStatCd === "CANCELED" ? "line-through text-slate-300" : "text-slate-900"}`}
                    >
                      {(orderInfo?.totAmt ?? 0).toLocaleString()}
                      <span className="text-xs font-normal text-slate-400 ml-0.5">
                        원
                      </span>
                    </span>
                  </div>
                </div>

                {/* 🌟 3. 오른쪽 하단에 배치된 아담한 환불/취소 신청 버튼 영역 */}
                {orderInfo?.ordStatCd === "PAID" && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCancelPopup(true)}
                      className="px-3 py-1.5 text-[11px] font-bold text-slate-400 bg-white border border-slate-200 rounded-lg hover:bg-rose-50/50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer shadow-sm"
                    >
                      환불 / 취소 신청
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 하단 돌아가기 버튼 */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-10 py-3 text-sm font-bold text-white bg-slate-500 hover:bg-slate-600 rounded-lg transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                주문 내역으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 환불/취소 모달 (이전과 동일) */}
      {showCancelPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                환불 / 취소 신청
              </h3>
              <button
                type="button"
                onClick={() => setShowCancelPopup(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="bg-slate-50/80 rounded-xl px-4 py-3 flex justify-between items-center border border-slate-100">
                <p className="text-xs font-semibold text-slate-700 truncate flex-1 mr-4">
                  {orderInfo?.ordNm}
                </p>
                <p className="text-xs font-bold text-slate-900">
                  {(orderInfo?.totAmt ?? 0).toLocaleString()}원
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  취소 사유 선택 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={cancelRsnCd}
                  onChange={(e) => setCancelRsnCd(e.target.value)}
                  className="w-full border border-slate-200 px-3.5 py-3 text-xs rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 font-medium shadow-sm"
                >
                  <option value="">사유를 선택해주세요</option>
                  {CANCEL_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  상세 내용 피드백{" "}
                  <span className="text-[10px] text-slate-400 font-normal ml-2">
                    {cancelRsnDtl.length} / 500자
                  </span>
                </label>
                <textarea
                  value={cancelRsnDtl}
                  onChange={(e) => setCancelRsnDtl(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="구체적인 사유를 남겨주세요. (선택)"
                  className="w-full border border-slate-200 px-4 py-3 text-xs rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder:text-slate-300 font-medium shadow-sm"
                />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-[11px] font-bold text-slate-700 mb-2">
                  💡 신청 전 확인해 주세요
                </p>
                <ul className="space-y-1.5">
                  {CANCEL_NOTICES.map((n, i) => (
                    <li
                      key={i}
                      className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-1"
                    >
                      <span className="shrink-0 text-slate-300">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-2 px-6 pb-5 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelPopup(false)}
                className="flex-1 py-3 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer border border-slate-100"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleCancelSubmit}
                disabled={submitting || !cancelRsnCd}
                className="flex-1 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer disabled:opacity-40 shadow-sm"
              >
                {submitting ? "요청 중..." : "취소 신청하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
