const NAV_LINKS = [
  { label: "회사소개" },
  { label: "개인정보처리방침", highlight: true },
  { label: "이용약관" },
  { label: "저작권 침해 신고" },
  { label: "사이트맵" },
  { label: "찾아오시는길" },
  { label: "제휴문의" },
  { label: "단체구매 문의" },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-5 h-5"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">
          {/* 왼쪽 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {/* 로고 */}
            <div className="mb-5">
              <span className="text-2xl font-black text-gray-800 tracking-tight">
                HERMES
              </span>
              <span className="text-2xl font-black text-blue-600">.</span>
              <span className="ml-2 text-xs font-semibold text-gray-400 align-middle">
                (포트폴리오 데모 사이트)
              </span>
            </div>

            {/* 네비게이션 링크 */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 mb-6 text-sm text-gray-500">
              {NAV_LINKS.map((link) => (
                <span
                  key={link.label}
                  className={`cursor-pointer hover:text-gray-700 transition-colors ${link.highlight ? "text-blue-600 font-semibold hover:text-blue-700" : ""}`}
                >
                  {link.label}
                </span>
              ))}
            </div>

            {/* 회사 정보 (전부 가상의 데모 데이터) */}
            <div className="space-y-5 text-xs text-gray-500 leading-relaxed">
              <div>
                <p className="font-bold text-gray-700 mb-1">
                  주식회사 HERMES (가상)
                </p>
                <p>주소 : 서울특별시 ○○구 ○○로 000, 0층 | 대표이사 : 홍길동</p>
                <p>
                  사업자 등록번호 : 000-00-00000 | 통신판매업 신고 :
                  0000-서울○○-0000호{" "}
                  <button className="border border-gray-300 text-gray-500 text-xs px-1.5 py-0.5 rounded hover:bg-gray-50 cursor-pointer">
                    정보조회
                  </button>
                </p>
                <p>
                  학원설립·운영등록번호 : 제0000호 HERMES원격학원{" "}
                  <button className="border border-gray-300 text-gray-500 text-xs px-1.5 py-0.5 rounded hover:bg-gray-50 cursor-pointer">
                    정보조회
                  </button>
                </p>
                <p>
                  호스팅서비스 사업자 : (주)HERMES | 개인정보보호 책임자 :
                  홍길동
                </p>
                <p>고객센터 : 00-0000-0000 | 이메일 : help@hermes.example</p>
              </div>

              <div>
                <p className="font-bold text-gray-700 mb-1">
                  HERMES 교재 (가상)
                </p>
                <p>주소 : 서울특별시 ○○구 ○○로 000, 0층 | 대표이사 : 홍길동</p>
                <p>
                  사업자 등록번호 : 000-00-00000 | 통신판매업 신고 :
                  0000-서울○○-0000호{" "}
                  <button className="border border-gray-300 text-gray-500 text-xs px-1.5 py-0.5 rounded hover:bg-gray-50 cursor-pointer">
                    정보조회
                  </button>
                </p>
                <p>고객센터 : 00-0000-0000 | 이메일 : help@hermes.example</p>
              </div>
            </div>

            {/* 저작권 */}
            <p className="text-xs text-gray-400 mt-6">
              © 2026 HERMES (포트폴리오 데모). 실제 서비스가 아닌 학습용 데모
              사이트입니다.
            </p>
          </div>

          {/* 오른쪽: SNS + 인증 */}
          <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-6">
            {/* SNS 아이콘 */}
            <div className="flex gap-2">
              {[FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  <Icon />
                </button>
              ))}
              <button className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer text-xs font-bold">
                blog
              </button>
              <button className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer text-xs font-bold">
                N
              </button>
            </div>

            {/* 배지 (데모용 표시) */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">
                  ● toss payments
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  결제 연동 (데모)
                </div>
              </div>
              <div className="border border-gray-300 rounded px-3 py-2 text-center">
                <div className="text-xs font-bold text-gray-600">DEMO</div>
                <div className="text-xs text-gray-400">학습용 포트폴리오</div>
                <div className="text-xs text-gray-400">데모 사이트</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
