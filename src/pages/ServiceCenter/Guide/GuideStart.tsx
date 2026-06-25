import { Link } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";

const STEPS = [
  {
    step: 1,
    title: "마이페이지 접속",
    desc: "로그인 후 마이페이지에서 수강중인 강좌를 확인합니다.",
    details: [
      { label: "접속 방법", text: "상단 메뉴 프로필 클릭 → 마이페이지 선택" },
      { label: "수강 목록", text: "마이페이지 → 수강중 강좌에서 결제한 강좌 목록 확인" },
      { label: "진도율 확인", text: "강좌별 학습 진행률이 % 형태로 표시됩니다." },
      { label: "만료 확인", text: "수강 기간 만료일이 강좌 카드에 함께 표시됩니다." },
    ],
    tip: "수강 기간이 7일 이하로 남은 강좌는 만료 임박으로 별도 표시됩니다.",
  },
  {
    step: 2,
    title: "강의 시청",
    desc: "수강중 강좌에서 원하는 강의를 선택해 시청합니다.",
    details: [
      { label: "강의 보기", text: "수강중 강좌 → 강의 보기 버튼 클릭 → 강의 플레이어 실행" },
      { label: "목차 이동", text: "플레이어 좌측 목차에서 원하는 강의를 선택해 바로 이동 가능" },
      { label: "이어보기", text: "이전에 시청한 위치부터 자동으로 이어서 재생됩니다." },
      { label: "화질 설정", text: "플레이어 하단에서 480p / 720p / 1080p 중 선택 가능합니다." },
    ],
    tip: "배속 조절(0.5x ~ 2.0x)을 활용하면 효율적인 학습이 가능합니다.",
  },
  {
    step: 3,
    title: "학습 관리",
    desc: "학습 현황을 체크하며 효율적으로 강좌를 관리하세요.",
    details: [
      { label: "진도 저장", text: "강의 시청 시 자동으로 진도가 저장되며 언제든 이어볼 수 있습니다." },
      { label: "수강 리포트", text: "마이페이지 → 수강 리포트에서 과목별 학습 시간 및 현황 확인 가능" },
      { label: "즐겨찾기", text: "강좌 카드의 별 아이콘을 눌러 즐겨찾기 등록 후 빠르게 접근 가능" },
      { label: "강좌 정보", text: "강좌정보 버튼을 누르면 해당 강좌 상세 페이지로 이동합니다." },
    ],
    tip: "수강 리포트의 레이더 차트를 통해 과목별 학습 균형을 한눈에 파악하세요.",
  },
  {
    step: 4,
    title: "수강 완료",
    desc: "강좌 수강 기간이 종료되면 수강종료 강좌로 이동됩니다.",
    details: [
      { label: "수강종료 탭", text: "마이페이지 → 수강중 강좌 → 수강종료 탭에서 이전 수강 강좌 확인" },
      { label: "재수강", text: "동일 강좌를 다시 구매하면 수강 기간이 연장되어 계속 이용 가능합니다." },
      { label: "수강기간 연장", text: "종료 후 30일 이내 1회에 한해 연장 신청이 가능합니다." },
      { label: "문의", text: "수강 완료 후 궁금한 사항은 Q&A 또는 1:1 문의를 이용해주세요." },
    ],
    tip: "수강이 완료된 강좌도 교재는 계속 보유하실 수 있습니다.",
  },
];

export default function GuideStart() {
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
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">수강 시작하기</h1>
                  <span className="text-xs text-gray-400">강의 시청부터 학습 관리까지 안내합니다.</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Link to="/customer" className="hover:text-blue-500 transition-colors">고객센터</Link>
                  <span>&gt;</span>
                  <span>학습 이용 가이드</span>
                  <span>&gt;</span>
                  <span className="text-gray-600">수강 시작하기</span>
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
