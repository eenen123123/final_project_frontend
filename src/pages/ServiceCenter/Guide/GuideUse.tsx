import { Link } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";

const STEPS = [
  {
    step: 1,
    title: "수강 리포트",
    desc: "나의 학습 현황을 한눈에 파악하고 분석할 수 있습니다.",
    details: [
      { label: "접속 위치", text: "마이페이지 → 수강 리포트" },
      { label: "레이더 차트", text: "국어·수학·영어 등 과목별 학습 시간 비중을 차트로 시각화" },
      { label: "강좌 현황", text: "수강중·완료 강좌 수, 평균 진척도 통계 제공" },
      { label: "활용 팁", text: "취약 과목을 파악하고 학습 계획 수립에 활용하세요." },
    ],
    tip: "강의 시청 시간이 누적될수록 리포트 데이터가 더욱 정확해집니다.",
  },
  {
    step: 2,
    title: "쿠폰 / 포인트",
    desc: "쿠폰과 포인트를 활용해 강좌를 더욱 저렴하게 수강하세요.",
    details: [
      { label: "쿠폰 등록", text: "마이페이지 → 쿠폰/포인트 → 할인권 등록에서 쿠폰 코드 입력" },
      { label: "쿠폰 사용", text: "결제 시 쿠폰 선택 팝업에서 상품별 쿠폰 적용 가능" },
      { label: "HM 포인트", text: "결제 금액의 1%가 자동 적립되며 다음 결제 시 사용 가능" },
      { label: "포인트 사용", text: "결제 페이지에서 보유 포인트를 차감하여 결제 금액 절감" },
    ],
    tip: "쿠폰과 포인트는 동시에 사용할 수 있습니다. (배송비 제외 상품금액에만 적용)",
  },
  {
    step: 3,
    title: "Q&A 이용",
    desc: "강좌 관련 궁금한 점은 Q&A를 통해 문의하세요.",
    details: [
      { label: "질문 등록", text: "고객센터 → Q&A → 질문 등록하기 (로그인 필요)" },
      { label: "나의 문의", text: "고객센터 → Q&A → 나의 문의내역에서 답변 확인 가능" },
      { label: "답변 안내", text: "등록된 문의는 영업일 기준 1~2일 내 답변이 등록됩니다." },
      { label: "FAQ 활용", text: "자주 묻는 질문(FAQ)에서 빠르게 답변을 찾을 수 있습니다." },
    ],
    tip: "문의 전 FAQ를 먼저 확인하시면 더 빠르게 해결하실 수 있습니다.",
  },
  {
    step: 4,
    title: "캘린더 활용",
    desc: "학습 일정을 캘린더에 등록해 체계적으로 관리하세요.",
    details: [
      { label: "접속 위치", text: "마이페이지 → 마이 캘린더" },
      { label: "공식 일정", text: "수능 일정, 모의고사, 플랫폼 이벤트 등 공식 일정이 자동 표시" },
      { label: "개인 일정", text: "날짜 클릭 후 나만의 학습 계획, 메모 등 개인 일정 등록 가능" },
      { label: "공휴일", text: "공공데이터 연동으로 법정 공휴일이 자동으로 표시됩니다." },
    ],
    tip: "시험 D-day를 개인 일정으로 등록해 남은 기간을 효율적으로 활용하세요.",
  },
];

export default function GuideUse() {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">수강 활용하기</h1>
                  <span className="text-xs text-gray-400">리포트·쿠폰·Q&A·캘린더 활용 방법을 안내합니다.</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Link to="/customer" className="hover:text-blue-500 transition-colors">고객센터</Link>
                  <span>&gt;</span>
                  <span>학습 이용 가이드</span>
                  <span>&gt;</span>
                  <span className="text-gray-600">수강 활용하기</span>
                </div>
              </div>
              <hr className="border-t-2 border-gray-800 mt-2" />
            </div>

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
                          <td className="py-3 px-4 w-28 text-xs font-semibold text-gray-500 bg-gray-50/50 border-r border-gray-100">{d.label}</td>
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

            <div className="border-t border-gray-200 pt-5 mt-6 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                궁금한 점이 있으신가요?&nbsp;
                <Link to="/customer/qna/write" className="text-blue-600 hover:underline">1:1 문의하기</Link>
              </p>
              <Link to="/customer/faq" className="text-xs px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors rounded">
                자주하는 질문 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
