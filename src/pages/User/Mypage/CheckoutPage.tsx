import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useKakaoPostcodePopup } from "react-daum-postcode";
import MyPageSidebar from "./components/MyPageSidebar";
import DeliveryMsgSelect from "./components/DeliveryMsgSelect";
import CheckoutNotice from "./components/CheckoutNotice";
import { type CouponItem } from "./components/CouponSelectPopup";
import api, { getApiErrorMessage } from "../../../api/api";
import { useAuth } from "../../../auth/AuthContext";

const TOSS_CLIENT_KEY = "test_ck_ALnQvDd2VJ209bO49mMOVMj7X41m";

type PointType = "HM_POINT" | "STUDY_POINT";

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

interface MemberAddress {
  addressSn: number;
  addressNm: string;
  receiverNm: string;
  receiverTel: string;
  zipCd: string;
  addrRoad: string;
  addrJibun: string;
  addrDtl: string;
  deliveryMsg: string;
  defaultYn: string;
}

const EMAIL_DOMAINS = [
  "naver.com",
  "gmail.com",
  "daum.net",
  "kakao.com",
  "nate.com",
  "yahoo.co.kr",
  "직접입력",
];
const PHONE_CODES = ["010", "011", "016", "017", "018", "019"];

const STEP_ICONS = {
  cart: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  payment: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  complete: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  ),
};

function formatPrice(p: number) {
  return p.toLocaleString("ko-KR");
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserId } = useAuth();
  const items: CheckoutItem[] = location.state?.items ?? [];
  const [paying, setPaying] = useState(false);

  const openPostcode = useKakaoPostcodePopup();

  const hasBook = items.some((i) => i.prodDivCd === "TEXTBOOK");

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
  const [addrJibun, setAddrJibun] = useState("");
  const [addrDtl, setAddrDtl] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [isAddressFromBook, setIsAddressFromBook] = useState(false);

  const handleAddressSearch = () => {
    openPostcode({
      onComplete: (data) => {
        setZipCd(data.zonecode);
        setAddr(data.address);
        setAddrJibun(data.jibunAddress);
      },
    });
  };

  // 주소록 팝업
  const openAddressModal = () => {
    window.open(
      "/mypage/address-book",
      "addressBook",
      "width=640,height=580,scrollbars=yes,resizable=no"
    );
  };

  const applyAddress = (a: MemberAddress, fromBook: boolean) => {
    setReceiverNm(a.receiverNm);
    setReceiverTel(a.receiverTel);
    setZipCd(a.zipCd ?? "");
    setAddr(a.addrRoad ?? "");
    setAddrJibun(a.addrJibun ?? "");
    setAddrDtl(a.addrDtl ?? "");
    setDeliveryMsg(a.deliveryMsg ?? "");
    setIsAddressFromBook(fromBook);
  };

  // 주소록 팝업 → postMessage 수신
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "ADDRESS_SELECTED") {
        applyAddress(e.data.address as MemberAddress, true);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // 교재 포함 시 기본 배송지 자동 입력
  useEffect(() => {
    if (!hasBook) return;
    api.get<MemberAddress[]>("/api/addresses")
      .then((res) => {
        const def = res.data.find((a) => a.defaultYn === "Y");
        if (def) applyAddress(def, true);
      })
      .catch(() => {});
  }, [hasBook]);

  // 쿠폰
  const [availableCoupons, setAvailableCoupons] = useState<CouponItem[]>([]);
  const [itemCoupons, setItemCoupons] = useState<Record<number, CouponItem>>({});

  const openCouponPopup = () => {
    localStorage.setItem("couponPopupData", JSON.stringify({
      items: items.map((i) => ({
        cartSn: i.cartSn,
        prodDivCd: i.prodDivCd,
        prodNm: i.prodNm,
        prodPrice: i.prodPrice,
        itemQty: i.itemQty,
      })),
      coupons: availableCoupons,
      initialSelections: itemCoupons,
    }));
    const popup = window.open(
      "/mypage/coupon-select",
      "couponSelect",
      "width=420,height=520,scrollbars=yes,resizable=no"
    );
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data === "couponSelected") {
        const raw = localStorage.getItem("couponPopupResult");
        if (raw) setItemCoupons(JSON.parse(raw));
        popup?.close();
        window.removeEventListener("message", onMessage);
      }
    };
    window.addEventListener("message", onMessage);
  };

  // 기타
  const [notifyConsent, setNotifyConsent] = useState(true);

  // [포인트 시스템] 포인트 잔액 및 사용 상태
  const [hmPointBalance, setHmPointBalance] = useState(0);
  const [studyBalance, setStudyBalance] = useState(0);
  const [usedPointType, setUsedPointType] = useState<PointType | null>(null);
  const [usedPointAmt, setUsedPointAmt] = useState(0);
  const [pointInput, setPointInput] = useState("");

  const totalPrice = items.reduce((sum, i) => sum + i.prodPrice * i.itemQty, 0);
  const shippingFee = hasBook ? 3000 : 0;

  // 상품별 쿠폰 할인 합산
  const couponDiscAmt = Object.entries(itemCoupons).reduce((total, [cartSnStr, coupon]) => {
    const cartSn = Number(cartSnStr);
    const item = items.find((i) => i.cartSn === cartSn);
    if (!item) return total;
    const baseAmt = item.prodPrice * item.itemQty;
    const disc = coupon.discType === "FIXED"
      ? Math.min(coupon.discAmt ?? 0, baseAmt)
      : Math.floor(baseAmt * (coupon.discRate ?? 0) / 100);
    return total + disc;
  }, 0);

  const finalAmt = Math.max(0, totalPrice + shippingFee - usedPointAmt - couponDiscAmt);

  // 쿠폰 목록 조회
  useEffect(() => {
    api.get<CouponItem[]>("/api/coupons/my/available")
      .then((res) => setAvailableCoupons(res.data))
      .catch(() => {});
  }, []);

  // [포인트 시스템] 포인트 잔액 조회
  useEffect(() => {
    Promise.all([
      api.get<number>("/api/points/balance?assetType=HM_POINT"),
      api.get<number>("/api/points/balance?assetType=STUDY_POINT"),
    ])
      .then(([hm, study]) => {
        setHmPointBalance(hm.data);
        setStudyBalance(study.data);
      })
      .catch(() => {});
  }, []);

  // [포인트 시스템] 포인트 사용 핸들러
  // UI 단에서 단일 타입만 허용 (비즈니스 검증은 결제하기 버튼 클릭 시 서버에서 수행)
  const handleUsePoint = (type: PointType) => {
    if (usedPointType && usedPointType !== type) {
      alert("하나의 포인트만 사용 가능합니다.");
      return;
    }
    const balance = type === "HM_POINT" ? hmPointBalance : studyBalance;
    const maxPointable = totalPrice - couponDiscAmt; // 배송비 제외한 상품금액만
    const max = Math.min(balance, maxPointable);
    if (max <= 0) {
      alert("쿠폰 할인 후 남은 상품금액이 없어 포인트를 사용할 수 없습니다.");
      return;
    }
    setUsedPointType(type);
    setUsedPointAmt(max);
    setPointInput(String(max));
  };

  const handleCancelPoint = () => {
    setUsedPointType(null);
    setUsedPointAmt(0);
    setPointInput("");
  };

  // [포인트 시스템] 결제하기 핸들러
  // 주문 생성 → 서버 검증 → 에러 시 서버 메시지 출력 → 성공 시 토스 결제창 호출
  const handlePayment = async () => {
    if (paying) return;

    // 구매자 전화번호 체크
    if (!phoneMid || !phoneLast) {
      alert("구매자 휴대폰 번호를 입력해주세요.");
      return;
    }

    // 구매자 이메일 체크
    if (!emailId) {
      alert("구매자 이메일을 입력해주세요.");
      return;
    }
    if (emailDomain === "직접입력" && !emailCustom) {
      alert("이메일 도메인을 입력해주세요.");
      return;
    }

    if (hasBook) {
      if (!receiverNm || !receiverTel || !zipCd || !addr) {
        alert("배송지 정보(수령인, 연락처, 주소)를 모두 입력해주세요.");
        return;
      }
      if (!/^0\d{1,2}-\d{3,4}-\d{4}$/.test(receiverTel)) {
        alert("수령인 연락처를 올바른 형식으로 입력해주세요. (예: 010-1234-5678)");
        return;
      }
    }

    setPaying(true);
    try {
      const buyerEmail =
        emailDomain === "직접입력"
          ? `${emailId}@${emailCustom}`
          : `${emailId}@${emailDomain}`;

      const res = await api.post("/api/orders", {
        items: items.map((i) => ({
          prodDivCd: i.prodDivCd,
          prodSn: i.prodSn,
          itemQty: i.itemQty,
        })),
        pointAmt: usedPointAmt,
        pointType: usedPointType ?? undefined,
        shipping: hasBook
          ? {
              buyerNm: profile?.userName ?? "",
              buyerTel: `${phoneCode}-${phoneMid}-${phoneLast}`,
              buyerEmail,
              receiverNm,
              receiverTel,
              zipCd,
              addrRoad: addr,
              addrJibun,
              addrDtl,
              deliveryMsg,
            }
          : undefined,
        saveToAddressBook: hasBook ? saveAddress : false,
        coupons: Object.entries(itemCoupons).map(([cartSn, coupon]) => {
          const item = items.find((i) => i.cartSn === Number(cartSn));
          return { mcpntSn: coupon.mcpntSn, prodDivCd: item?.prodDivCd ?? "" };
        }).filter((c) => c.prodDivCd !== ""),
      });

      const { ordId, ordNm, totAmt } = res.data;

      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({
        customerKey: getUserId() ?? crypto.randomUUID(),
      });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: totAmt },
        orderId: ordId,
        orderName: ordNm,
        successUrl: `${window.location.origin}/test/toss-pay/success`,
        failUrl: `${window.location.origin}/test/toss-pay/fail`,
      });
    } catch (error) {
      // 서버 에러 메시지 출력 (POINT_MINIMUM_USAGE, POINT_INSUFFICIENT_BALANCE 등)
      alert(getApiErrorMessage(error, "결제 처리 중 오류가 발생했습니다."));
    } finally {
      setPaying(false);
    }
  };

  const handlePointInputChange = (type: PointType, value: string) => {
    const num = Number(value.replace(/\D/g, ""));
    const balance = type === "HM_POINT" ? hmPointBalance : studyBalance;
    const maxPointable = totalPrice - couponDiscAmt; // 배송비 제외
    const max = Math.min(balance, maxPointable);
    const clamped = Math.min(num, max);
    if (num > max && max > 0) {
      alert(`${max.toLocaleString()}원 이하만 사용 가능합니다.`);
    }
    setPointInput(String(clamped));
    setUsedPointAmt(clamped);
    if (clamped === 0) {
      setUsedPointType(null);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/mypage/profile");
        const data: MemberProfile = res.data;
        setProfile(data);
        // 전화번호 파싱: 010-1234-5678
        if (data.userTelno) {
          const tel = data.userTelno;
          if (tel.includes("-")) {
            const parts = tel.split("-");
            if (parts.length === 3) {
              setPhoneCode(parts[0]);
              setPhoneMid(parts[1]);
              setPhoneLast(parts[2]);
            }
          } else if (tel.length === 11) {
            // 01012345678 → 010 / 1234 / 5678
            setPhoneCode(tel.slice(0, 3));
            setPhoneMid(tel.slice(3, 7));
            setPhoneLast(tel.slice(7));
          } else if (tel.length === 10) {
            // 0111234567 → 011 / 123 / 4567
            setPhoneCode(tel.slice(0, 3));
            setPhoneMid(tel.slice(3, 6));
            setPhoneLast(tel.slice(6));
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


  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <MyPageSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 min-w-0">
            {/* 단계 헤더 */}
            <div
              className="flex border border-gray-300 mb-8"
              style={{ height: "56px" }}
            >
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
                    <span className={isActive ? "text-white" : "text-gray-400"}>
                      {icon}
                    </span>
                    <span
                      className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-400"}`}
                    >
                      {label}
                    </span>
                    {!isLast && (
                      <span
                        className={`ml-1 text-sm font-bold ${isActive ? "text-gray-400" : "text-gray-300"}`}
                      >
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
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">
                      상품정보
                    </th>
                    <th className="py-3 px-4 w-28 text-center font-semibold text-gray-700">
                      판매가
                    </th>
                    <th className="py-3 px-4 w-14 text-center font-semibold text-gray-700 whitespace-nowrap">
                      수량
                    </th>
                    <th className="py-3 px-4 w-28 text-center font-semibold text-gray-700">
                      결제가
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.cartSn}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                          <span
                            className={`inline-block text-[10px] px-1 py-px border font-semibold shrink-0 ${
                              item.prodDivCd === "COURSE"
                                ? "border-blue-400 text-blue-500 bg-blue-50"
                                : "border-green-400 text-green-600 bg-green-50"
                            }`}
                          >
                            {item.prodDivCd === "COURSE" ? "강좌" : "교재"}
                          </span>
                          {item.prodNm}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-700">
                        {formatPrice(item.prodPrice)}원
                      </td>
                      <td className="py-4 px-4 text-center text-gray-700 text-sm">
                        {item.itemQty}
                      </td>
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
            {items.some((i) => i.prodDivCd === "COURSE") && (
              <div className="border border-blue-200 bg-blue-50 px-4 py-3 mb-2 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="notify"
                  checked={notifyConsent}
                  onChange={(e) => setNotifyConsent(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="notify" className="cursor-pointer">
                  <p className="text-sm font-semibold text-blue-700">
                    학습관리 알림 수신에 동의합니다
                  </p>
                  <p className="text-xs text-blue-500 mt-0.5 leading-relaxed">
                    수강 신청하는 강좌의 학습정보 모바일 알림(수강기간별 안내,
                    학습독려 알림 등)을 수신하겠습니다.
                    <br />
                    알림 설정 시, 회원정보의 휴대전화번호 기준으로 안내됩니다.
                  </p>
                </label>
              </div>
            )}
            {/* 배송지 (교재 있을 때) */}
            {hasBook && (
              <>
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  배송지
                </h2>
                <div className="border border-gray-200 mb-8 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">
                      받으실 주소를 입력해 주세요.
                    </span>
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
                          <button
                            type="button"
                            onClick={handleAddressSearch}
                            className="px-4 py-2 bg-gray-700 text-white text-xs hover:bg-gray-900 transition-colors cursor-pointer"
                          >
                            주소 검색
                          </button>
                          <button
                            type="button"
                            onClick={openAddressModal}
                            className="px-4 py-2 border border-gray-300 text-gray-600 text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            주소록 &gt;
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
                    <div className="flex items-start gap-4">
                      <label className="w-20 text-sm text-gray-500 shrink-0 text-right pt-2">
                        배송 메모
                      </label>
                      <DeliveryMsgSelect
                        value={deliveryMsg}
                        onChange={setDeliveryMsg}
                        inputClassName="focus:ring-1 focus:ring-orange-100"
                      />
                    </div>
                    {!isAddressFromBook && (
                      <div className="flex items-center gap-4">
                        <span className="w-20 shrink-0" />
                        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveAddress}
                            onChange={(e) => setSaveAddress(e.target.checked)}
                            className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                          />
                          이 배송지를 주소록에 저장
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {/* 구매자 정보 */}
            <h2 className="text-base font-bold text-gray-900 mb-3">
              구매자 정보
            </h2>
            <div className="border border-gray-200 mb-8 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">
                  주문 및 결제 안내를 받을 연락처를 확인해 주세요.
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-sm text-gray-500 shrink-0">
                    이름
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {profile?.userName ?? "-"}
                  </span>
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
                        {PHONE_CODES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <span className="text-gray-800 text-xs">-</span>
                      <input
                        type="text"
                        maxLength={4}
                        value={phoneMid}
                        onChange={(e) =>
                          setPhoneMid(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-16 border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                      <span className="text-gray-800 text-xs">-</span>
                      <input
                        type="text"
                        maxLength={4}
                        value={phoneLast}
                        onChange={(e) =>
                          setPhoneLast(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-16 border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                    </div>
                    <p className="text-[11px] text-red-400 mt-1">
                      * 주문 및 결제정보 변경 내용을 안내해드리오니 정확한
                      정보를 입력해주세요.
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
                      {EMAIL_DOMAINS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* MARK: 결제 */}
            <h2 className="text-base font-bold text-gray-900 mb-3">결제</h2>
            <div className="border border-gray-300 mb-8">
              <div className="grid grid-cols-3 divide-x divide-gray-200">
                {/* 왼쪽: 금액 요약 */}
                <div className="p-5">
                  <p className="text-xs text-gray-500 mb-1">총 주문금액</p>
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    {formatPrice(totalPrice)}
                    <span className="text-sm font-normal text-gray-500 ml-0.5">
                      원
                    </span>
                  </p>
                  <hr className="border-gray-200 mb-3" />
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">추가혜택</span>
                    <span className="text-gray-700">0원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">배송비</span>
                    <span className="text-gray-700">
                      {hasBook ? "3,000원" : "0원"}
                    </span>
                  </div>
                </div>

                {/* 가운데: 할인 */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      할인 적용
                    </span>
                    <span className="text-sm font-bold text-orange-500">
                      {(usedPointAmt + couponDiscAmt) > 0
                        ? `-${(usedPointAmt + couponDiscAmt).toLocaleString()}원`
                        : "0원"}
                    </span>
                  </div>

                  {/* HM 할인권 */}
                  <div className="border-t border-gray-100 py-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 leading-tight">
                        HM 할인권
                        <br />
                        <span className="text-gray-400">({availableCoupons.length}장 보유)</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {Object.keys(itemCoupons).length > 0 ? (
                          <>
                            <span className="text-orange-500 font-bold text-[11px]">
                              -{couponDiscAmt.toLocaleString()}원
                            </span>
                            <button
                              onClick={() => openCouponPopup()}
                              className="px-1.5 py-0.5 border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer text-[10px]"
                            >
                              변경
                            </button>
                            <button
                              onClick={() => setItemCoupons({})}
                              className="px-1.5 py-0.5 border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer text-[10px]"
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openCouponPopup()}
                            disabled={availableCoupons.length === 0}
                            className="px-1.5 py-0.5 border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer text-[10px] disabled:opacity-40"
                          >
                            선택
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* HM 포인트 */}
                  {[
                    {
                      type: "HM_POINT" as PointType,
                      label: "HM 포인트",
                      balance: hmPointBalance,
                    },
                    {
                      type: "STUDY_POINT" as PointType,
                      label: "스터디포인트",
                      balance: studyBalance,
                    },
                  ].map((row) => (
                    <div
                      key={row.type}
                      className="border-t border-gray-100 py-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 leading-tight">
                          {row.label}
                          <br />
                          <span className="text-gray-400">
                            ({row.balance.toLocaleString()}p 보유)
                          </span>
                        </span>
                        <div className="flex items-center gap-1">
                          {usedPointType === row.type ? (
                            <>
                              <input
                                type="text"
                                value={pointInput}
                                onChange={(e) =>
                                  handlePointInputChange(
                                    row.type,
                                    e.target.value,
                                  )
                                }
                                className="w-16 border border-orange-300 px-1.5 py-0.5 text-right text-xs focus:outline-none"
                              />
                              <span className="text-gray-400">P</span>
                              <button
                                onClick={handleCancelPoint}
                                className="px-1.5 py-0.5 border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer text-[10px]"
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-500 w-8 text-right">
                                0
                              </span>
                              <span className="text-gray-400">P</span>
                              <button
                                onClick={() => handleUsePoint(row.type)}
                                className="px-1.5 py-0.5 border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer"
                              >
                                사용
                              </button>
                            </>
                          )}
                        </div>
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
                    {formatPrice(finalAmt)}
                    <span className="text-sm font-normal text-gray-400 ml-0.5">
                      원
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    총 예상 적립혜택{" "}
                    <span className="font-semibold">
                      {Math.floor(finalAmt / 100).toLocaleString()}p
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <CheckoutNotice />
            {/* 하단 버튼 */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate("/mycart")}
                className="px-12 py-3.5 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
              >
                장바구니 가기 &gt;
              </button>
              <button
                onClick={handlePayment}
                disabled={paying}
                className="px-12 py-3.5 bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying ? "처리 중..." : "결제하기 >"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
