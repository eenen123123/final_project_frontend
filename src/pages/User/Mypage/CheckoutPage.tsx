import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MyPageSidebar from "./components/MyPageSidebar";
import api from "../../../api/api";

interface CheckoutItem {
  cartSn: number;
  prodDivCd: string;
  prodSn: number;
  prodNm: string;
  prodPrice: number;
  itemQty: number;
}

interface MemberProfile {
  userName: string;
  userTelno: string | null;
  userEmailAddr: string | null;
}

const EMAIL_DOMAINS = ["naver.com", "gmail.com", "daum.net", "kakao.com", "nate.com", "yahoo.co.kr", "직접입력"];
const PHONE_CODES = ["010", "011", "016", "017", "018", "019"];

const STEP_ICONS = {
  cart: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  payment: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  complete: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
};

function formatPrice(p: number) {
  return p.toLocaleString("ko-KR");
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const items: CheckoutItem[] = location.state?.items ?? [];

  const [activeSection, setActiveSection] = useState("장바구니");
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  // 구매자 정보 입력 상태
  const [phoneCode, setPhoneCode] = useState("010");
  const [phoneMid, setPhoneMid] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("naver.com");
  const [emailCustom, setEmailCustom] = useState("");

  // 배송지 (교재 있을 때만)
  const [receiverNm, setReceiverNm] = useState("");
  const [receiverTel, setReceiverTel] = useState("");
  const [zipCd, setZipCd] = useState("");
  const [addr, setAddr] = useState("");
  const [addrDtl, setAddrDtl] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  // 기타
  const [notifyConsent, setNotifyConsent] = useState(true);
  const [payMethod, setPayMethod] = useState("card");

  const hasBook = items.some((i) => i.prodDivCd === "TEXTBOOK");
  const totalPrice = items.reduce((sum, i) => sum + i.prodPrice * i.itemQty, 0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/mypage/profile");
        const data: MemberProfile = res.data;
        setProfile(data);
        // 전화번호 파싱: 010-1234-5678
        if (data.userTelno) {
          const parts = data.userTelno.split("-");
          if (parts.length === 3) {
            setPhoneCode(parts[0]);
            setPhoneMid(parts[1]);
            setPhoneLast(parts[2]);
          }
        }
        // 이메일 파싱
        if (data.userEmailAddr) {
          const [id, domain] = data.userEmailAddr.split("@");
          setEmailId(id ?? "");
          if (domain && EMAIL_DOMAINS.includes(domain)) {
            setEmailDomain(domain);
          } else if (domain) {
            setEmailDomain("직접입력");
            setEmailCustom(domain);
          }
        }
      } catch {
        // 401 → api.ts 인터셉터가 /login으로 이동
      }
    };
    fetchProfile();
  }, []);

  const STEPS = [
    { key: "cart", label: "장바구니", icon: STEP_ICONS.cart },
    { key: "payment", label: "결제정보 입력", icon: STEP_ICONS.payment },
    { key: "complete", label: "결제완료", icon: STEP_ICONS.complete },
  ];

  const PAY_METHODS = [
    { key: "card", label: "신용카드" },
    { key: "transfer", label: "무통장입금" },
    { key: "account", label: "계좌이체" },
    { key: "toss", label: "toss" },
    { key: "samsung", label: "SAMSUNG Pay" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">
          <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            {/* 단계 헤더 */}
            <div className="flex border border-gray-300 mb-8" style={{ height: "56px" }}>
              {STEPS.map(({ key, label, icon }, i) => {
                const isActive = key === "payment";
                const isLast = i === STEPS.length - 1;
                return (
                  <div
                    key={key}
                    className={`relative flex-1 flex items-center justify-center gap-2
                      ${i > 0 ? "border-l border-gray-300" : ""}
                      ${isActive ? "bg-gray-800" : "bg-white"}`}
                  >
                    <span className={isActive ? "text-white" : "text-gray-400"}>{icon}</span>
                    <span className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-400"}`}>
                      {label}
                    </span>
                    {!isLast && (
                      <span className={`ml-1 text-sm font-bold ${isActive ? "text-gray-400" : "text-gray-300"}`}>
                        &gt;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 주문정보 */}
            <h2 className="text-base font-bold text-gray-900 mb-3">주문정보</h2>
            <div className="border-t-2 border-gray-800 border-b border-gray-200 mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">상품정보</th>
                    <th className="py-3 px-4 w-28 text-center font-semibold text-gray-700">판매가</th>
                    <th className="py-3 px-4 w-14 text-center font-semibold text-gray-700 whitespace-nowrap">수량</th>
                    <th className="py-3 px-4 w-28 text-center font-semibold text-gray-700">결제가</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.cartSn} className="border-b border-gray-200 last:border-b-0">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                          <span className={`inline-block text-[10px] px-1 py-px border font-semibold shrink-0 ${
                            item.prodDivCd === "COURSE"
                              ? "border-blue-400 text-blue-500 bg-blue-50"
                              : "border-green-400 text-green-600 bg-green-50"
                          }`}>
                            {item.prodDivCd === "COURSE" ? "강좌" : "교재"}
                          </span>
                          {item.prodNm}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-700">
                        {formatPrice(item.prodPrice)}원
                      </td>
                      <td className="py-4 px-4 text-center text-gray-700 text-sm">{item.itemQty}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-orange-500 text-sm">
                          {formatPrice(item.prodPrice * item.itemQty)}원
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 학습관리 알림 (강좌 있을 때) */}
            {items.some((i) => i.prodDivCd === "20") && (
              <div className="border border-blue-200 bg-blue-50 px-4 py-3 mb-2 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="notify"
                  checked={notifyConsent}
                  onChange={(e) => setNotifyConsent(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="notify" className="cursor-pointer">
                  <p className="text-sm font-semibold text-blue-700">학습관리 알림 수신에 동의합니다</p>
                  <p className="text-xs text-blue-500 mt-0.5 leading-relaxed">
                    수강 신청하는 강좌의 학습정보 모바일 알림(수강기간별 안내, 학습독려 알림 등)을 수신하겠습니다.<br />
                    알림 설정 시, 회원정보의 휴대전화번호 기준으로 안내됩니다.
                  </p>
                </label>
              </div>
            )}
            <p className="text-xs text-gray-400 mb-8">
              · 회원님께 특별 제공되는 개별할인을 원치 않으시면 [자동할인 취소] 버튼을 클릭해주세요.
            </p>

            {/* 배송지 (교재 있을 때) */}
            {hasBook && (
              <>
                <h2 className="text-base font-bold text-gray-900 mb-3">배송지</h2>
                <div className="border border-gray-200 mb-8 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-500">받으실 주소를 입력해 주세요.</span>
                    <button className="text-xs px-3 py-1.5 border border-gray-300 text-gray-500 hover:bg-white transition-colors cursor-pointer">
                      주소록 &gt;
                    </button>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="w-20 text-sm text-gray-500 shrink-0 text-right">
                        수령인 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={receiverNm}
                        onChange={(e) => setReceiverNm(e.target.value)}
                        placeholder="수령인 이름을 입력하세요"
                        className="w-56 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-20 text-sm text-gray-500 shrink-0 text-right">
                        연락처 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={receiverTel}
                        onChange={(e) => setReceiverTel(e.target.value)}
                        placeholder="010-0000-0000"
                        className="w-56 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                    </div>
                    <div className="flex items-start gap-4">
                      <label className="w-20 text-sm text-gray-500 shrink-0 text-right pt-2.5">
                        주소 <span className="text-red-400">*</span>
                      </label>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={zipCd}
                            onChange={(e) => setZipCd(e.target.value)}
                            placeholder="우편번호"
                            className="w-32 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                          />
                          <button className="px-4 py-2 bg-gray-700 text-white text-xs hover:bg-gray-900 transition-colors cursor-pointer">
                            주소 검색
                          </button>
                        </div>
                        <input
                          type="text"
                          value={addr}
                          onChange={(e) => setAddr(e.target.value)}
                          placeholder="기본주소"
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 bg-gray-50"
                          readOnly
                        />
                        <input
                          type="text"
                          value={addrDtl}
                          onChange={(e) => setAddrDtl(e.target.value)}
                          placeholder="상세주소를 입력하세요"
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-20 text-sm text-gray-500 shrink-0 text-right">배송 메모</label>
                      <input
                        type="text"
                        value={deliveryMsg}
                        onChange={(e) => setDeliveryMsg(e.target.value)}
                        placeholder="예: 문 앞에 놓아주세요"
                        className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 구매자 정보 */}
            <h2 className="text-base font-bold text-gray-900 mb-3">구매자 정보</h2>
            <div className="border border-gray-200 mb-8 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">주문 및 결제 안내를 받을 연락처를 확인해 주세요.</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-sm text-gray-500 shrink-0">이름</span>
                  <span className="text-sm font-semibold text-gray-900">{profile?.userName ?? "-"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-16 text-sm text-gray-500 shrink-0 pt-1.5">
                    휴대폰 <span className="text-red-400">*</span>
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        className="border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
                      >
                        {PHONE_CODES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <span className="text-gray-300">—</span>
                      <input
                        type="text"
                        maxLength={4}
                        value={phoneMid}
                        onChange={(e) => setPhoneMid(e.target.value.replace(/\D/g, ""))}
                        className="w-16 border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                      <span className="text-gray-300">—</span>
                      <input
                        type="text"
                        maxLength={4}
                        value={phoneLast}
                        onChange={(e) => setPhoneLast(e.target.value.replace(/\D/g, ""))}
                        className="w-16 border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                    </div>
                    <p className="text-[11px] text-red-400 mt-1">
                      * 주문 및 결제정보 변경 내용을 안내해드리오니 정확한 정보를 입력해주세요.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 text-sm text-gray-500 shrink-0">
                    이메일 <span className="text-red-400">*</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <input
                      type="text"
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      className="w-24 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                    />
                    <span className="text-gray-400 font-semibold">@</span>
                    {emailDomain === "직접입력" && (
                      <input
                        type="text"
                        value={emailCustom}
                        onChange={(e) => setEmailCustom(e.target.value)}
                        placeholder="도메인 입력"
                        className="w-28 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                    )}
                    <select
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      className="border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
                    >
                      {EMAIL_DOMAINS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 결제정보 */}
            <h2 className="text-base font-bold text-gray-900 mb-3">결제정보</h2>
            <div className="border border-gray-300 mb-8">
              <div className="grid grid-cols-3 divide-x divide-gray-200">
                {/* 왼쪽: 금액 요약 */}
                <div className="p-5">
                  <p className="text-xs text-gray-500 mb-1">총 주문금액</p>
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    {formatPrice(totalPrice)}<span className="text-sm font-normal text-gray-500 ml-0.5">원</span>
                  </p>
                  <hr className="border-gray-200 mb-3" />
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">추가혜택</span>
                    <span className="text-gray-700">0원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">배송비</span>
                    <span className="text-gray-700">{hasBook ? "3,000원" : "0원"}</span>
                  </div>
                </div>

                {/* 가운데: 할인 */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">할인 적용</span>
                    <span className="text-sm font-bold text-orange-500">0원</span>
                  </div>
                  {[
                    { label: "HERMES 포인트", sub: "(0p보유)", unit: "P" },
                    { label: "PayBack포인트",  sub: "(0p보유)", unit: "P" },
                    { label: "적립금",          sub: "(0원보유)", unit: "원" },
                    { label: "할인쿠폰",        sub: "(0장보유)", unit: "원", extra: "등록" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-1.5 border-t border-gray-100 text-xs">
                      <span className="text-gray-600 leading-tight">
                        {row.label}<br />
                        <span className="text-gray-400">{row.sub}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {row.extra && (
                          <button className="px-1.5 py-0.5 border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer text-[10px]">
                            {row.extra}
                          </button>
                        )}
                        <span className="text-gray-500 w-8 text-right">0</span>
                        <span className="text-gray-400">{row.unit}</span>
                        <button className="px-1.5 py-0.5 border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer">
                          사용
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 오른쪽: 총 결제금액 */}
                <div className="p-5 flex flex-col items-center justify-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-bold">
                    =
                  </div>
                  <p className="text-xs text-gray-500 mb-2">총 결제금액</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {formatPrice(totalPrice + (hasBook ? 3000 : 0))}
                    <span className="text-sm font-normal text-gray-400 ml-0.5">원</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-3">총 예상 적립혜택 <span className="font-semibold">0p</span></p>
                </div>
              </div>
            </div>

            {/* 결제수단 */}
            <h2 className="text-base font-bold text-gray-900 mb-3">결제수단</h2>
            <div className="border border-gray-300 mb-4">
              <div className="flex border-b border-gray-300">
                {PAY_METHODS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPayMethod(m.key)}
                    className={`flex-1 py-3.5 text-sm font-semibold border-r last:border-r-0 border-gray-300 transition-colors cursor-pointer
                      ${payMethod === m.key ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-1">
                  {({
                    card: [
                      "신용카드 결제 시 즉시 수강이 가능합니다.",
                      "결제 금액이 30만원 이상인 경우 공인인증서가 필요할 수 있습니다.",
                      "카드사 별로 무이자 할부 개월 등 상세 혜택이 매월 다르므로, 결제 시 확인하시기 바랍니다.",
                    ],
                    transfer: [
                      "계좌이체 결제 시 즉시 수강이 가능합니다.",
                      "계좌이체는 인터넷 뱅킹이 신청되어 있을 경우에만 결제 가능합니다.",
                      "서비스 가능 시간과 거래 한도 금액은 은행마다 상이합니다.",
                    ],
                    account: [
                      "무통장 입금은 가상계좌로 입금 완료 후 수강이 가능합니다.",
                      "주문 후 7일 이내까지 입금 가능합니다.",
                      "신청 금액과 입금 금액이 다를 경우 오류가 발생하니 정확한 금액을 입금해주세요.",
                    ],
                    toss: [
                      "토스앱에 은행계좌 또는 신용카드를 등록하여 결제하는 서비스입니다.",
                      "결제 비밀번호로 간편하게 결제할 수 있습니다.",
                      "등록 가능한 계좌 및 카드는 토스앱에서 확인 가능합니다.",
                    ],
                    samsung: [
                      "삼성페이에 등록한 카드를 지문 또는 비밀번호로 인증하여 결제합니다.",
                      "본인 명의 휴대폰에서 본인 명의 카드 등록 후 사용 가능합니다.",
                      "삼성페이에서 제공하는 카드사별 무이자, 할인 혜택을 받을 수 있습니다.",
                    ],
                  } as Record<string, string[]>)[payMethod]?.map((txt, i) => (
                    <li key={i} className="text-xs text-gray-500">· {txt}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 안내사항 */}
            <div className="border border-gray-300 bg-gray-50 mb-8">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-800">안내사항</span>
                <div className="flex gap-2">
                  {["환불/취소 안내", "결제 관련 FAQ", "도서 소득공제 안내"].map((label) => (
                    <button
                      key={label}
                      className="text-xs px-3 py-1.5 border border-gray-400 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {label} &gt;
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-5 py-4 text-xs text-gray-500 leading-relaxed space-y-1.5">
                {[
                  "모든 강좌 수강기간에는 교재 배송기간 최대 7일이 포함되어 있습니다.",
                  "강좌·교재를 함께 구매 후 강좌 취소는 교재가 반송되어야 취소 가능합니다.",
                  "결제수단별 최소 결제금액이 상이하오니, 확인 후 결제 바랍니다.",
                  "여러 개의 상품을 함께 주문하셔도 배송비는 전체 주문에 대해 묶음으로 1회만 결제됩니다.",
                  "미성년자 결제 시 법정대리인이 동의하지 않으면 취소될 수 있습니다.",
                  "결제 완료 후 구매 확정까지는 배송 조회 및 환불 요청이 가능합니다.",
                  "교재는 수령 후 7일 이내 반품 신청이 가능하며, 단순 변심은 배송비 부담입니다.",
                  "이벤트·할인 적용 상품은 환불 시 실 결제금액 기준으로 처리됩니다.",
                ].map((txt, i) => (
                  <p key={i}>{i + 1}. {txt}</p>
                ))}
                <div className="flex justify-end pt-2">
                  <span className="text-gray-400">고객센터 <span className="font-semibold text-gray-600">1599-6405</span></span>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate("/mycart")}
                className="px-12 py-3.5 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
              >
                장바구니 가기 &gt;
              </button>
              <button
                className="px-12 py-3.5 bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
              >
                결제하기 &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
