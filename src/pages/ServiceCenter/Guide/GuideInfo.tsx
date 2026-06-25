import { Link } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";

const STEPS = [
  {
    step: 1,
    title: "강좌 종류",
    desc: "헤르메스에서 제공하는 강좌 유형을 확인하세요.",
    details: [
      { label: "일반 강좌", text: "과목별 단일 강좌로 원하는 강좌만 선택해 수강할 수 있습니다." },
      { label: "패키지 강좌", text: "여러 강좌를 묶어 할인된 가격에 제공하는 상품입니다." },
      { label: "교재", text: "강좌와 연계된 교재를 함께 구매하면 학습 효과를 높일 수 있습니다." },
      { label: "무료 강좌", text: "일부 강좌는 무료로 제공되며 로그인 후 바로 수강 가능합니다." },
    ],
    tip: "강좌 목록 페이지에서 유형별 필터를 사용해 원하는 강좌를 쉽게 찾을 수 있습니다.",
  },
  {
    step: 2,
    title: "수강 기간",
    desc: "강좌별로 수강 가능한 기간이 다르게 설정됩니다.",
    details: [
      { label: "기간 확인", text: "강좌 상세 페이지 또는 마이페이지 → 수강중 강좌에서 확인 가능합니다." },
      { label: "기간 시작", text: "결제 완료 즉시 수강 기간이 시작됩니다." },
      { label: "기간 만료", text: "수강 기간이 지나면 강좌 시청이 불가하며 만료 강좌로 이동됩니다." },
      { label: "기간 연장", text: "수강 기간 내 또는 종료 후 30일 이내에 연장 신청이 가능합니다." },
    ],
    tip: "만료 7일 전부터 마이페이지에 만료 임박 알림이 표시됩니다.",
  },
  {
    step: 3,
    title: "수강 방법",
    desc: "PC와 모바일 모두에서 편리하게 수강하실 수 있습니다.",
    details: [
      { label: "PC 수강", text: "마이페이지 → 수강중 강좌 → 강의 보기 클릭 후 동영상 강의 시청" },
      { label: "모바일 수강", text: "모바일 브라우저에서 동일하게 접속하여 수강 가능합니다." },
      { label: "진도 저장", text: "수강 중 종료해도 마지막 재생 위치부터 이어서 시청할 수 있습니다." },
      { label: "배속 조절", text: "강의 플레이어에서 0.5배속 ~ 2.0배속으로 속도 조절이 가능합니다." },
    ],
    tip: "강의 시청 후 진도율이 자동으로 반영되며 수강 리포트에서 확인할 수 있습니다.",
  },
  {
    step: 4,
    title: "환불 / 취소",
    desc: "수강 취소 및 환불 정책을 미리 확인해주세요.",
    details: [
      { label: "취소 신청", text: "마이페이지 → 주문/배송 조회 → 주문 상세 → 환불/취소 신청" },
      { label: "환불 기준", text: "결제일로부터 7일 이내, 수강 진도율 20% 미만인 경우 전액 환불 가능" },
      { label: "처리 기간", text: "관리자 승인 후 3~5 영업일 내 결제 수단으로 환불 처리됩니다." },
      { label: "교재 환불", text: "교재는 배송 완료 후 환불 시 왕복 배송비가 고객 부담입니다." },
    ],
    tip: "환불 정책에 대한 자세한 내용은 고객센터 환불/취소 안내를 참고해주세요.",
  },
];

export default function GuideInfo() {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
            {/* 헤더 */}
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">수강 알아보기</h1>
                  <span className="text-xs text-gray-400">강좌 종류부터 환불 정책까지 안내합니다.</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Link to="/customer" className="hover:text-blue-500 transition-colors">고객센터</Link>
                  <span>&gt;</span>
                  <span>학습 이용 가이드</span>
                  <span>&gt;</span>
                  <span className="text-gray-600">수강 알아보기</span>
                </div>
              </div>
              <hr className="border-t-2 border-gray-800 mt-2" />
            </div>

            {/* 스텝 흐름도 */}
            <div className="flex items-center mb-8 bg-gray-50 border border-gray-200 rounded px-4 py-5">
              {STEPS.map((s, i) => (
                <div key={s.step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center w-full">
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white text-base font-bold flex items-center justify-center mb-2 shadow-sm">
                      {s.step}
                    </div>
                    <span className="text-sm text-gray-700 font-semibold whitespace-nowrap">{s.title}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span className="text-blue-300 text-2xl font-light shrink-0 pb-5">&gt;</span>
                  )}
                </div>
              ))}
            </div>

            {/* 단계별 상세 */}
            <div className="space-y-6">
              {STEPS.map((s) => (
                <div key={s.step} className="border border-gray-200">
                  <div className="flex items-center gap-3 bg-gray-50 border-b border-gray-200 px-4 py-3">
                    <span className="w-6 h-6 rounded-full bg-gray-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {s.step}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{s.title}</span>
                    <span className="text-xs text-gray-400 ml-1">{s.desc}</span>
                  </div>

                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      {s.details.map((d) => (
                        <tr key={d.label}>
                          <td className="py-3 px-4 w-28 text-xs font-semibold text-gray-500 bg-gray-50/50 border-r border-gray-100">
                            {d.label}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{d.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50/50 border-t border-blue-100">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">TIP</span>
                    <p className="text-xs text-blue-700">{s.tip}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 */}
            <div className="border-t border-gray-200 pt-5 mt-6 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                궁금한 점이 있으신가요?&nbsp;
                <Link to="/customer/qna/write" className="text-blue-600 hover:underline">1:1 문의하기</Link>
              </p>
              <Link
                to="/customer/faq"
                className="text-xs px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors rounded"
              >
                자주하는 질문 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
