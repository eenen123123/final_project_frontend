import { Link } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";

const STEPS = [
  {
    step: 1,
    title: "브라우저 설치",
    desc: "원활한 수강을 위해 최신 브라우저를 준비해주세요.",
    details: [
      { label: "권장", text: "Google Chrome 최신 버전" },
      { label: "지원", text: "Microsoft Edge, Safari (일부 기능 제한)" },
      { label: "미지원", text: "Internet Explorer (IE)" },
    ],
    tip: "크롬 브라우저에서 가장 안정적으로 동작합니다.",
  },
  {
    step: 2,
    title: "회원가입 및 로그인",
    desc: "헤르메스 서비스를 이용하려면 회원가입이 필요합니다.",
    details: [
      { label: "가입 방법", text: "상단 메뉴 '회원가입' 클릭 → 정보 입력 → 가입 완료" },
      { label: "필수 정보", text: "아이디, 비밀번호, 이름, 이메일" },
      { label: "로그인", text: "가입 후 아이디/비밀번호로 로그인" },
    ],
    tip: "이미 계정이 있다면 바로 로그인 후 강좌를 이용하세요.",
  },
  {
    step: 3,
    title: "강좌 선택 및 결제",
    desc: "수강하실 강좌를 선택하고 결제를 진행해주세요.",
    details: [
      { label: "강좌 탐색", text: "상단 메뉴 '강좌' 또는 '교재' 에서 원하는 강좌 검색" },
      { label: "신청 방법", text: "강좌 상세 페이지 → 장바구니 담기 → 결제하기" },
      { label: "결제 수단", text: "신용카드, 체크카드 / 쿠폰·포인트 병행 사용 가능" },
    ],
    tip: "쿠폰 등록 후 결제 시 할인 혜택을 받으실 수 있습니다.",
  },
  {
    step: 4,
    title: "수강 시작",
    desc: "결제 완료 후 마이페이지에서 바로 수강을 시작하실 수 있습니다.",
    details: [
      { label: "수강 위치", text: "마이페이지 → 수강중 강좌 → 강의 보기" },
      { label: "수강 기간", text: "결제일로부터 강좌별 설정된 기간 내 수강 가능" },
      { label: "진도 확인", text: "마이페이지 → 수강 리포트에서 학습 현황 확인 가능" },
    ],
    tip: "수강기간 만료 전 수강 연장을 신청하실 수 있습니다.",
  },
];

export default function GuidePrepare() {
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
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">수강 준비하기</h1>
                  <span className="text-xs text-gray-400">강좌 수강을 위한 단계별 준비 방법입니다.</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Link to="/customer" className="hover:text-blue-500 transition-colors">고객센터</Link>
                  <span>&gt;</span>
                  <span>학습 이용 가이드</span>
                  <span>&gt;</span>
                  <span className="text-gray-600">수강 준비하기</span>
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
                  {/* 스텝 헤더 */}
                  <div className="flex items-center gap-3 bg-gray-50 border-b border-gray-200 px-4 py-3">
                    <span className="w-6 h-6 rounded-full bg-gray-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {s.step}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{s.title}</span>
                    <span className="text-xs text-gray-400 ml-1">{s.desc}</span>
                  </div>

                  {/* 상세 내용 */}
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

                  {/* 팁 */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50/50 border-t border-blue-100">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">TIP</span>
                    <p className="text-xs text-blue-700">{s.tip}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 문의 */}
            <div className="border-t border-gray-200 pt-5 mt-6 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                준비 중 궁금한 점이 있으신가요?&nbsp;
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
